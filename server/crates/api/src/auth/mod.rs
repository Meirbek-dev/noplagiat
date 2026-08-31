//! Session identity, the RBAC scope it collapses to, and the cookie carrying
//! it (ARCHITECTURE.md §4.2).
//!
//! The browser holds one opaque value: the hex-encoded 32-byte session id. Both
//! the identity and the authorization decision come from the database on every
//! request, so revoking a role takes effect immediately rather than at the next
//! login.

pub mod password;
pub mod store;

use axum::extract::FromRequestParts;
use axum::http::HeaderMap;
use axum::http::request::Parts;
use compliance::Scope;
use domain::RoleKind;

use crate::error::ApiError;

/// Name of the session cookie.
pub const SESSION_COOKIE: &str = "np_session";
/// Header carrying the double-submit CSRF token on mutating requests.
pub const CSRF_HEADER: &str = "x-csrf-token";

/// Frontend route an authenticated but role-less user is sent to (PLAN.md W3.1
/// «a "request access" path for authenticated role-less users»).
pub const REQUEST_ACCESS_PATH: &str = "/app/request-access";

/// The `detail` of the 403 such a user gets. Naming the path is what makes the
/// problem document actionable: the account is valid, the grant is missing, and
/// TZ §5 routes that request through the head of unit.
pub const REQUEST_ACCESS_DETAIL: &str =
    "your account holds no role for the internal contour - request access at /app/request-access";

/// The authenticated user of the current request, as loaded by
/// [`crate::layers::session::session_auth`].
#[derive(Debug, Clone)]
pub struct CurrentUser {
    pub user_id: i64,
    /// Login name the account was created under (ADR-017).
    pub username: String,
    /// Widest role held, used as the `audit_log.role` of this request.
    /// `None` for an authenticated user with no grants at all.
    pub effective_role: Option<RoleKind>,
    /// Widest visibility the held roles grant. `None` means "sees nothing
    /// internal" - the default for an account the CLI created without a role
    /// (ARCHITECTURE.md §4.2) and for `staff`, whose own-discipline view is not
    /// built yet.
    pub scope: Option<Scope>,
    /// Every grant, for `/api/auth/me`.
    pub roles: Vec<RoleGrant>,
    pub session_id: Vec<u8>,
    pub csrf_token: Vec<u8>,
}

/// One `(role, scope)` grant, typed.
///
/// Carries the dictionary codes beside the ids so that `/api/auth/me` and the
/// admin roles screen can both say *which* unit a grant covers without a second
/// round trip. `Clone` rather than `Copy` for that reason; [`Self::scope`]
/// takes `&self` so the scope arithmetic is unaffected.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RoleGrant {
    pub role: RoleKind,
    pub scope_faculty_id: Option<i64>,
    pub scope_department_id: Option<i64>,
    pub scope_faculty_code: Option<String>,
    pub scope_department_code: Option<String>,
}

impl RoleGrant {
    /// Visibility this single grant confers, or `None` when the role carries no
    /// internal access at all.
    ///
    /// `db::users` documents a NULL scope as "the whole university". That
    /// reading is applied only to the three roles TZ §5 grants university-wide
    /// access to. For a dean or a department head a NULL scope is a
    /// misconfigured grant, and the safe interpretation of "no unit" is *no
    /// data*, never *every unit* - otherwise a half-filled admin form is a
    /// privilege escalation.
    #[must_use]
    pub fn scope(&self) -> Option<Scope> {
        let narrowest_unit = || {
            self.scope_department_id
                .map(Scope::Department)
                .or_else(|| self.scope_faculty_id.map(Scope::Faculty))
        };
        match self.role {
            // TZ §5: ППС see the public contour plus, optionally, their own
            // aggregates. No internal scope exists for them yet, so a staff
            // grant alone is 403 on the internal contour.
            RoleKind::Staff => None,
            RoleKind::DeptHead | RoleKind::Dean => narrowest_unit(),
            RoleKind::Ethics | RoleKind::Compliance | RoleKind::Admin => {
                Some(narrowest_unit().unwrap_or(Scope::All))
            }
        }
    }
}

/// Rank used to pick the role written to `audit_log` when a user holds several.
fn role_rank(role: RoleKind) -> u8 {
    match role {
        RoleKind::Staff => 0,
        RoleKind::DeptHead => 1,
        RoleKind::Dean => 2,
        RoleKind::Ethics => 3,
        RoleKind::Compliance => 4,
        RoleKind::Admin => 5,
    }
}

/// Rank used to pick the widest scope when a user holds several grants.
fn scope_rank(scope: Scope) -> u8 {
    match scope {
        Scope::Department(_) => 0,
        Scope::Faculty(_) => 1,
        Scope::All => 2,
    }
}

/// The `role_kind` enum labels of migration 0001, parsed back into the domain
/// type. Spelled out rather than derived from `serde`, mirroring
/// `db::filters::role_label` in the other direction.
#[must_use]
pub fn parse_role(label: &str) -> Option<RoleKind> {
    match label {
        "staff" => Some(RoleKind::Staff),
        "dept_head" => Some(RoleKind::DeptHead),
        "dean" => Some(RoleKind::Dean),
        "ethics" => Some(RoleKind::Ethics),
        "compliance" => Some(RoleKind::Compliance),
        "admin" => Some(RoleKind::Admin),
        _ => None,
    }
}

/// Collapse a user's grants into the single widest [`Scope`] (`RbacScope`).
///
/// TODO(W3.2): `compliance::Scope` holds one unit, so a user granted two
/// faculties currently sees the lower-numbered one only. The RBAC matrix slice
/// either widens `Scope` to a set or forbids the grant; until then the choice
/// is deterministic and never widens beyond a single held grant.
#[must_use]
pub fn widest_scope(grants: &[RoleGrant]) -> Option<Scope> {
    grants
        .iter()
        .filter_map(|grant| grant.scope())
        .max_by_key(|scope| {
            (
                scope_rank(*scope),
                // Deterministic tie-break: lowest unit id wins.
                std::cmp::Reverse(scope.faculty_id().or(scope.department_id()).unwrap_or(0)),
            )
        })
}

/// The role recorded in the audit log for a user holding several grants.
#[must_use]
pub fn effective_role(grants: &[RoleGrant]) -> Option<RoleKind> {
    grants
        .iter()
        .map(|grant| grant.role)
        .max_by_key(|role| role_rank(*role))
}

/// Read the session cookie out of a request's headers.
#[must_use]
pub fn session_cookie(headers: &HeaderMap) -> Option<String> {
    headers
        .get_all(axum::http::header::COOKIE)
        .iter()
        .filter_map(|value| value.to_str().ok())
        .flat_map(|value| value.split(';'))
        .filter_map(|pair| pair.split_once('='))
        .find(|(name, _)| name.trim() == SESSION_COOKIE)
        .map(|(_, value)| value.trim().to_owned())
}

/// `Set-Cookie` value establishing a session.
///
/// `HttpOnly` keeps it out of scripts, `Secure` off plaintext transports, and
/// `SameSite=Lax` blocks cross-site POSTs while still allowing a top-level
/// navigation into the dashboard to carry the session (ARCHITECTURE.md §6).
#[must_use]
pub fn set_cookie(session_id_hex: &str, max_age_seconds: i64) -> String {
    format!(
        "{SESSION_COOKIE}={session_id_hex}; Path=/; HttpOnly; Secure; SameSite=Lax; \
         Max-Age={max_age_seconds}"
    )
}

/// `Set-Cookie` value clearing the session.
#[must_use]
pub fn clear_cookie() -> String {
    format!("{SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0")
}

/// Extractor handing a handler the caller's visibility.
///
/// Every internal query in `db` takes a [`Scope`] and there is no overload that
/// omits it (AGENTS.md invariant #3); this is where handlers get theirs. A
/// request that reached a handler without one is a 403, not a wider query.
#[derive(Debug, Clone, Copy)]
pub struct RbacScope(pub Scope);

impl<S: Send + Sync> FromRequestParts<S> for RbacScope {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        parts
            .extensions
            .get::<CurrentUser>()
            .ok_or(ApiError::Unauthorized("no session on this request"))?
            .scope
            .map(RbacScope)
            .ok_or(ApiError::Forbidden(REQUEST_ACCESS_DETAIL))
    }
}

/// Extractor handing a handler the authenticated user.
impl<S: Send + Sync> FromRequestParts<S> for CurrentUser {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        parts
            .extensions
            .get::<CurrentUser>()
            .cloned()
            .ok_or(ApiError::Unauthorized("no session on this request"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn grant(role: RoleKind, faculty: Option<i64>, department: Option<i64>) -> RoleGrant {
        RoleGrant {
            scope_faculty_code: faculty.map(|id| format!("FAC{id:02}")),
            scope_department_code: department.map(|id| format!("DEP{id:02}")),
            role,
            scope_faculty_id: faculty,
            scope_department_id: department,
        }
    }

    #[test]
    fn compliance_and_admin_see_the_whole_university() {
        for role in [RoleKind::Admin, RoleKind::Ethics, RoleKind::Compliance] {
            assert_eq!(
                widest_scope(&[grant(role, None, None)]),
                Some(Scope::All),
                "{role:?}"
            );
        }
    }

    #[test]
    fn a_dean_sees_one_faculty_and_a_head_one_department() {
        assert_eq!(
            widest_scope(&[grant(RoleKind::Dean, Some(7), None)]),
            Some(Scope::Faculty(7))
        );
        assert_eq!(
            widest_scope(&[grant(RoleKind::DeptHead, None, Some(11))]),
            Some(Scope::Department(11))
        );
    }

    #[test]
    fn staff_alone_grants_no_internal_scope() {
        assert_eq!(widest_scope(&[grant(RoleKind::Staff, None, None)]), None);
        assert_eq!(widest_scope(&[]), None);
    }

    /// A unit role with no unit is a misconfigured grant, and must not widen to
    /// the whole university.
    #[test]
    fn an_unscoped_unit_role_grants_nothing() {
        assert_eq!(widest_scope(&[grant(RoleKind::Dean, None, None)]), None);
        assert_eq!(widest_scope(&[grant(RoleKind::DeptHead, None, None)]), None);
    }

    #[test]
    fn the_widest_grant_wins_and_ties_break_on_the_lowest_unit() {
        assert_eq!(
            widest_scope(&[
                grant(RoleKind::DeptHead, None, Some(11)),
                grant(RoleKind::Dean, Some(3), None),
            ]),
            Some(Scope::Faculty(3))
        );
        assert_eq!(
            widest_scope(&[
                grant(RoleKind::Dean, Some(9), None),
                grant(RoleKind::Dean, Some(3), None),
            ]),
            Some(Scope::Faculty(3))
        );
        assert_eq!(
            widest_scope(&[
                grant(RoleKind::Dean, Some(3), None),
                grant(RoleKind::Compliance, None, None),
            ]),
            Some(Scope::All)
        );
    }

    #[test]
    fn the_audit_role_is_the_widest_one_held() {
        assert_eq!(
            effective_role(&[
                grant(RoleKind::Staff, None, None),
                grant(RoleKind::Dean, Some(1), None),
            ]),
            Some(RoleKind::Dean)
        );
        assert_eq!(effective_role(&[]), None);
    }

    #[test]
    fn role_labels_round_trip_through_the_postgres_enum() {
        for role in [
            RoleKind::Staff,
            RoleKind::DeptHead,
            RoleKind::Dean,
            RoleKind::Ethics,
            RoleKind::Compliance,
            RoleKind::Admin,
        ] {
            assert_eq!(parse_role(db::filters::role_label(role)), Some(role));
        }
        assert_eq!(parse_role("root"), None);
    }

    #[test]
    fn the_session_cookie_is_read_out_of_a_multi_value_header() {
        let mut headers = HeaderMap::new();
        headers.append(
            axum::http::header::COOKIE,
            axum::http::HeaderValue::from_static("locale=ru; np_session=deadbeef"),
        );
        assert_eq!(session_cookie(&headers).as_deref(), Some("deadbeef"));

        let empty = HeaderMap::new();
        assert_eq!(session_cookie(&empty), None);
    }

    #[test]
    fn the_cookie_carries_every_required_attribute() {
        let cookie = set_cookie("abc", 3600);
        for attribute in [
            "HttpOnly",
            "Secure",
            "SameSite=Lax",
            "Path=/",
            "Max-Age=3600",
        ] {
            assert!(cookie.contains(attribute), "{cookie} lacks {attribute}");
        }
        assert!(clear_cookie().contains("Max-Age=0"));
    }
}
