//! The RBAC registry: every internal and admin route, with the roles that may
//! reach it (slice W3.2, TZ §5, acceptance §10.5).
//!
//! This table is not documentation - it is the input to two tests:
//!
//! * `tests/rbac.rs::the_rbac_matrix_holds` executes **every** row × every role
//!   × every scope variant against the real router and asserts the outcome;
//! * `tests/rbac.rs::every_route_has_a_matrix_row` walks the generated OpenAPI
//!   document and fails if a `/api/internal` or `/api/admin` path is missing
//!   here, or present here and not in the router.
//!
//! Adding an endpoint without a row therefore breaks CI, which is the property
//! the slice exists for.
//!
//! The registry is also **normative** for one thing the layer stack cannot get
//! from anywhere else: which roles reach a *narrowed* internal section.
//! [`require_section_role`] reads the `allowed` column of the matched route, so
//! `GET /api/internal/escalations` is closed to a dean because of the row below
//! and not because of a second copy of the rule in a handler (ADR-014 §7).
//!
//! # What "allowed" means
//!
//! A row records an **authorization** outcome, not a business one. `Allowed`
//! asserts the request gets past the session, role and scope gates - it may
//! still answer `404` for a missing id or `422` for an empty body, and the test
//! accepts any of those. `Denied` asserts the exact status the gate produces.

use axum::extract::{MatchedPath, Request};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use domain::RoleKind;

use crate::auth::CurrentUser;
use crate::error::ApiError;

/// The seven callers of the matrix.
///
/// `Anonymous` is not a role - it is the absence of a session, and it is in the
/// list because "an unauthenticated request reaches nothing internal" is the
/// first thing the matrix has to prove.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Caller {
    Anonymous,
    /// Authenticated with a `staff` grant. TZ §5 gives ППС the public contour;
    /// the internal contour is closed to them until the own-discipline view of
    /// §5 lands (ADR-012 §4).
    Staff,
    /// `dept_head` scoped to one department.
    DeptHead,
    /// `dean` scoped to one faculty.
    Dean,
    Ethics,
    Compliance,
    Admin,
}

impl Caller {
    /// Every caller, in widening order.
    pub const ALL: [Self; 7] = [
        Self::Anonymous,
        Self::Staff,
        Self::DeptHead,
        Self::Dean,
        Self::Ethics,
        Self::Compliance,
        Self::Admin,
    ];

    /// The grant a dev-login session is minted with, or `None` for anonymous.
    #[must_use]
    pub fn role(self) -> Option<RoleKind> {
        match self {
            Self::Anonymous => None,
            Self::Staff => Some(RoleKind::Staff),
            Self::DeptHead => Some(RoleKind::DeptHead),
            Self::Dean => Some(RoleKind::Dean),
            Self::Ethics => Some(RoleKind::Ethics),
            Self::Compliance => Some(RoleKind::Compliance),
            Self::Admin => Some(RoleKind::Admin),
        }
    }

    /// The matrix caller one held grant corresponds to.
    #[must_use]
    pub fn from_role(role: RoleKind) -> Self {
        match role {
            RoleKind::Staff => Self::Staff,
            RoleKind::DeptHead => Self::DeptHead,
            RoleKind::Dean => Self::Dean,
            RoleKind::Ethics => Self::Ethics,
            RoleKind::Compliance => Self::Compliance,
            RoleKind::Admin => Self::Admin,
        }
    }

    /// Whether this caller reaches the internal contour at all.
    #[must_use]
    pub fn has_internal_access(self) -> bool {
        !matches!(self, Self::Anonymous | Self::Staff)
    }

    #[must_use]
    pub fn label(self) -> &'static str {
        match self {
            Self::Anonymous => "anonymous",
            Self::Staff => "staff",
            Self::DeptHead => "dept_head",
            Self::Dean => "dean",
            Self::Ethics => "ethics",
            Self::Compliance => "compliance",
            Self::Admin => "admin",
        }
    }
}

/// Which contour a route belongs to, and therefore which gates it sits behind.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Contour {
    /// Session + internal access + CSRF + audit.
    Internal,
    /// The internal stack plus `RequireRole(admin)`.
    Admin,
}

/// How the caller's unit filter relates to their scope.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeCase {
    /// No unit filter, or one inside the caller's scope.
    InScope,
    /// A unit filter naming a unit the caller may not see.
    OutOfScope,
}

/// What a row expects.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Outcome {
    /// Past every gate: any status except 401 and 403.
    Allowed,
    /// Rejected with exactly this status.
    Denied(u16),
}

/// One route of the internal or admin contour.
#[derive(Debug, Clone, Copy)]
pub struct RouteSpec {
    pub method: &'static str,
    /// The axum path, matching the `#[utoipa::path]` annotation exactly.
    pub path: &'static str,
    pub contour: Contour,
    /// Roles that reach the handler. `Anonymous` is never in this list.
    pub allowed: &'static [Caller],
    /// Whether the route accepts a unit filter, and therefore whether the
    /// out-of-scope half of the matrix applies to it.
    pub unit_filterable: bool,
    /// A path with `{}` placeholders filled in, ready to request.
    pub sample_path: &'static str,
}

impl RouteSpec {
    /// The expected outcome for one caller and one scope case.
    #[must_use]
    pub fn expect(&self, caller: Caller, scope: ScopeCase) -> Outcome {
        if caller == Caller::Anonymous {
            return Outcome::Denied(401);
        }
        if !self.allowed.contains(&caller) {
            return Outcome::Denied(403);
        }
        match scope {
            ScopeCase::InScope => Outcome::Allowed,
            // A caller who can see everything has no out-of-scope unit.
            ScopeCase::OutOfScope if self.sees_everything(caller) => Outcome::Allowed,
            ScopeCase::OutOfScope => Outcome::Denied(403),
        }
    }

    fn sees_everything(&self, caller: Caller) -> bool {
        matches!(caller, Caller::Ethics | Caller::Compliance | Caller::Admin)
    }
}

/// Callers that hold an internal scope: everyone except anonymous and staff.
const SCOPED: &[Caller] = &[
    Caller::DeptHead,
    Caller::Dean,
    Caller::Ethics,
    Caller::Compliance,
    Caller::Admin,
];

/// The oversight roles: the three TZ §5 grants university-wide access to.
///
/// A section listed against these and not against `dept_head`/`dean` is one the
/// specification reserves for the ethics and compliance functions rather than
/// one a unit head reads about their own unit.
const OVERSIGHT: &[Caller] = &[Caller::Ethics, Caller::Compliance, Caller::Admin];

/// The admin contour: `RequireRole(admin)` and nothing else.
const ADMIN_ONLY: &[Caller] = &[Caller::Admin];

const fn internal(method: &'static str, path: &'static str, unit_filterable: bool) -> RouteSpec {
    RouteSpec {
        method,
        path,
        contour: Contour::Internal,
        allowed: SCOPED,
        unit_filterable,
        sample_path: path,
    }
}

const fn admin(method: &'static str, path: &'static str, sample_path: &'static str) -> RouteSpec {
    RouteSpec {
        method,
        path,
        contour: Contour::Admin,
        allowed: ADMIN_ONLY,
        unit_filterable: false,
        sample_path,
    }
}

/// **Every** route of the internal and admin contours.
pub const ROUTES: &[RouteSpec] = &[
    // ── internal (TZ §4.2) ──────────────────────────────────────────────────
    internal("GET", "/api/internal/ping", false),
    internal("GET", "/api/internal/summary", true),
    internal("GET", "/api/internal/timeseries", true),
    internal("GET", "/api/internal/work-types", true),
    internal("GET", "/api/internal/histogram", true),
    internal("GET", "/api/internal/yoy", true),
    internal("GET", "/api/internal/departments-matrix", true),
    internal("GET", "/api/internal/rechecks", true),
    // TZ §5 reserves the «Эскалации» section - the suspicious-document register
    // and the Ethics Council counters - for the ethics and compliance
    // functions. It is an oversight view of people's cases, not a unit head's
    // own statistics, and the internal UI already hides the section for a dean.
    // This row is what closes it on the wire (ADR-014 §7).
    RouteSpec {
        method: "GET",
        path: "/api/internal/escalations",
        contour: Contour::Internal,
        allowed: OVERSIGHT,
        unit_filterable: true,
        sample_path: "/api/internal/escalations",
    },
    internal("GET", "/api/internal/usage", true),
    // TZ §4.4 grants «выгрузка текущего представления» to «ролям с
    // соответствующими правами»: an export is the caller's *own* area of
    // visibility rendered to a file, so every role that may read a section may
    // export it. `staff` never reaches the internal contour at all.
    RouteSpec {
        method: "POST",
        path: "/api/internal/export",
        contour: Contour::Internal,
        allowed: SCOPED,
        unit_filterable: false,
        sample_path: "/api/internal/export?format=xlsx",
    },
    // ── admin (TZ §4.6) ─────────────────────────────────────────────────────
    admin("GET", "/api/admin/ping", "/api/admin/ping"),
    admin("GET", "/api/admin/settings", "/api/admin/settings"),
    admin("PUT", "/api/admin/settings", "/api/admin/settings"),
    admin(
        "GET",
        "/api/admin/dictionaries/{kind}",
        "/api/admin/dictionaries/faculties",
    ),
    admin(
        "POST",
        "/api/admin/dictionaries/{kind}",
        "/api/admin/dictionaries/faculties",
    ),
    admin(
        "DELETE",
        "/api/admin/dictionaries/{kind}/{code}",
        "/api/admin/dictionaries/faculties/NOSUCHCODE",
    ),
    admin("GET", "/api/admin/aliases", "/api/admin/aliases"),
    admin("POST", "/api/admin/aliases", "/api/admin/aliases"),
    admin(
        "DELETE",
        "/api/admin/aliases/{id}",
        "/api/admin/aliases/999999",
    ),
    admin("GET", "/api/admin/roles", "/api/admin/roles"),
    admin("POST", "/api/admin/roles", "/api/admin/roles"),
    admin("DELETE", "/api/admin/roles", "/api/admin/roles"),
    admin("GET", "/api/admin/staff-units", "/api/admin/staff-units"),
    admin("POST", "/api/admin/staff-units", "/api/admin/staff-units"),
    admin(
        "DELETE",
        "/api/admin/staff-units/{hmac}",
        "/api/admin/staff-units/00",
    ),
    admin(
        "GET",
        "/api/admin/work-type-rules",
        "/api/admin/work-type-rules",
    ),
    admin(
        "POST",
        "/api/admin/work-type-rules",
        "/api/admin/work-type-rules",
    ),
    admin(
        "PUT",
        "/api/admin/work-type-rules/{id}",
        "/api/admin/work-type-rules/999999",
    ),
    admin(
        "DELETE",
        "/api/admin/work-type-rules/{id}",
        "/api/admin/work-type-rules/999999",
    ),
    admin(
        "GET",
        "/api/admin/initiator-rules",
        "/api/admin/initiator-rules",
    ),
    admin(
        "POST",
        "/api/admin/initiator-rules",
        "/api/admin/initiator-rules",
    ),
    admin(
        "PUT",
        "/api/admin/initiator-rules/{id}",
        "/api/admin/initiator-rules/999999",
    ),
    admin(
        "DELETE",
        "/api/admin/initiator-rules/{id}",
        "/api/admin/initiator-rules/999999",
    ),
    admin(
        "GET",
        "/api/admin/ingest/sources",
        "/api/admin/ingest/sources",
    ),
    admin(
        "POST",
        "/api/admin/ingest/sources",
        "/api/admin/ingest/sources",
    ),
    admin(
        "PUT",
        "/api/admin/ingest/sources/{id}",
        "/api/admin/ingest/sources/999999",
    ),
    admin(
        "DELETE",
        "/api/admin/ingest/sources/{id}",
        "/api/admin/ingest/sources/999999",
    ),
    admin("POST", "/api/admin/ingest/run", "/api/admin/ingest/run"),
    admin(
        "GET",
        "/api/admin/ingest/batches",
        "/api/admin/ingest/batches",
    ),
    admin(
        "GET",
        "/api/admin/ingest/batches/{id}",
        "/api/admin/ingest/batches/999999",
    ),
    admin("GET", "/api/admin/ethics-cases", "/api/admin/ethics-cases"),
    admin("POST", "/api/admin/ethics-cases", "/api/admin/ethics-cases"),
    admin(
        "PUT",
        "/api/admin/ethics-cases/{id}",
        "/api/admin/ethics-cases/999999",
    ),
    admin(
        "DELETE",
        "/api/admin/ethics-cases/{id}",
        "/api/admin/ethics-cases/999999",
    ),
    admin(
        "GET",
        "/api/admin/submission-totals",
        "/api/admin/submission-totals",
    ),
    admin(
        "POST",
        "/api/admin/submission-totals",
        "/api/admin/submission-totals",
    ),
    admin(
        "DELETE",
        "/api/admin/submission-totals",
        "/api/admin/submission-totals",
    ),
    admin("GET", "/api/admin/usage-stats", "/api/admin/usage-stats"),
    admin("POST", "/api/admin/usage-stats", "/api/admin/usage-stats"),
    admin("DELETE", "/api/admin/usage-stats", "/api/admin/usage-stats"),
    admin("GET", "/api/admin/reports", "/api/admin/reports"),
    admin(
        "POST",
        "/api/admin/reports/generate",
        "/api/admin/reports/generate",
    ),
    admin(
        "POST",
        "/api/admin/reports/{id}/publish",
        "/api/admin/reports/999999/publish",
    ),
    admin(
        "POST",
        "/api/admin/reports/{id}/unpublish",
        "/api/admin/reports/999999/unpublish",
    ),
    admin("GET", "/api/admin/audit", "/api/admin/audit"),
];

/// The row for one `(method, axum path)` pair, if the registry has one.
#[must_use]
pub fn route_for(method: &str, path: &str) -> Option<&'static RouteSpec> {
    ROUTES
        .iter()
        .find(|route| route.method == method && route.path == path)
}

/// The 403 detail a narrowed section produces.
pub const SECTION_RESERVED_DETAIL: &str = "this dashboard section is not open to your role";

/// Enforce the registry's `allowed` column on the internal contour.
///
/// Mounted between `require_internal_access` and the CSRF layer - the same slot
/// `require_admin` occupies on the admin contour - so a refusal happens before
/// the audit layer and is therefore not journalled as a section view
/// (ADR-012 §1).
///
/// For most rows this is a no-op: they name all five scoped roles, and the SQL
/// `Scope` is what limits what those roles see. It has something to say only
/// about a row that names fewer, which today is `GET /api/internal/escalations`.
pub async fn require_section_role(request: Request, next: Next) -> Response {
    let matched = request
        .extensions()
        .get::<MatchedPath>()
        .map(|path| path.as_str().to_owned());
    // No matched route: the request is on its way to the 404/405 fallback and
    // there is no row to enforce. A matched route with no row is a registry
    // drift that `tests/rbac.rs::every_route_has_a_matrix_row` fails on; say so
    // loudly rather than inventing a decision here.
    let Some(route) = matched.as_deref().and_then(|path| {
        let found = route_for(request.method().as_str(), path);
        if found.is_none() {
            tracing::error!(
                method = request.method().as_str(),
                path,
                "no RBAC registry row for an internal route"
            );
        }
        found
    }) else {
        return next.run(request).await;
    };

    let Some(user) = request.extensions().get::<CurrentUser>() else {
        return ApiError::Unauthorized("a valid portal session is required").into_response();
    };
    // Any held grant that the row names is enough: a user who is both a dean and
    // a member of Комплаенс reads the section through the second grant.
    let permitted = user
        .roles
        .iter()
        .any(|grant| route.allowed.contains(&Caller::from_role(grant.role)));
    if !permitted {
        tracing::warn!(
            path = route.path,
            user_id = user.user_id,
            "a reserved section was refused"
        );
        return ApiError::Forbidden(SECTION_RESERVED_DETAIL).into_response();
    }
    next.run(request).await
}

/// The `(method, path)` pairs the registry covers, for the drift test.
#[must_use]
pub fn registered() -> std::collections::BTreeSet<(String, String)> {
    ROUTES
        .iter()
        .map(|route| (route.method.to_owned(), route.path.to_owned()))
        .collect()
}

/// The `(method, path)` pairs of the generated contract that the registry has
/// to cover: everything under `/api/internal` and `/api/admin`.
///
/// Reading the contract rather than the axum router is deliberate. `axum` does
/// not expose its route table, and every route in this crate must carry a
/// `#[utoipa::path]` annotation anyway (AGENTS.md invariant #5) - so this walk
/// doubles as the gate that catches an endpoint added without one.
#[must_use]
pub fn contract_routes() -> std::collections::BTreeSet<(String, String)> {
    use utoipa::OpenApi as _;
    let document = crate::ApiDoc::openapi();
    let mut out = std::collections::BTreeSet::new();
    for (path, item) in document.paths.paths {
        if !path.starts_with("/api/internal") && !path.starts_with("/api/admin") {
            continue;
        }
        for (method, operation) in [
            ("GET", &item.get),
            ("PUT", &item.put),
            ("POST", &item.post),
            ("DELETE", &item.delete),
            ("PATCH", &item.patch),
        ] {
            if operation.is_some() {
                out.insert((method.to_owned(), path.clone()));
            }
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn anonymous_is_refused_everywhere_with_401() {
        for route in ROUTES {
            assert_eq!(
                route.expect(Caller::Anonymous, ScopeCase::InScope),
                Outcome::Denied(401),
                "{} {}",
                route.method,
                route.path
            );
        }
    }

    #[test]
    fn staff_reaches_nothing_internal_or_administrative() {
        for route in ROUTES {
            assert_eq!(
                route.expect(Caller::Staff, ScopeCase::InScope),
                Outcome::Denied(403),
                "{} {}",
                route.method,
                route.path
            );
        }
    }

    #[test]
    fn only_admin_reaches_the_admin_contour() {
        for route in ROUTES.iter().filter(|r| r.contour == Contour::Admin) {
            for caller in [
                Caller::DeptHead,
                Caller::Dean,
                Caller::Ethics,
                Caller::Compliance,
            ] {
                assert_eq!(
                    route.expect(caller, ScopeCase::InScope),
                    Outcome::Denied(403),
                    "{} {} must be closed to {}",
                    route.method,
                    route.path,
                    caller.label()
                );
            }
            assert_eq!(
                route.expect(Caller::Admin, ScopeCase::InScope),
                Outcome::Allowed
            );
        }
    }

    #[test]
    fn a_unit_role_is_refused_a_unit_outside_its_scope() {
        for route in ROUTES.iter().filter(|r| r.unit_filterable) {
            for caller in [Caller::DeptHead, Caller::Dean] {
                assert_eq!(
                    route.expect(caller, ScopeCase::OutOfScope),
                    Outcome::Denied(403),
                    "{} {}",
                    route.method,
                    route.path
                );
            }
            // A university-wide role has no out-of-scope unit to be refused.
            assert_eq!(
                route.expect(Caller::Compliance, ScopeCase::OutOfScope),
                Outcome::Allowed
            );
        }
    }

    /// TZ §5 - the escalation register is an oversight view, not a unit head's
    /// own statistics.
    #[test]
    fn the_escalation_register_is_closed_to_the_unit_roles() {
        let route = route_for("GET", "/api/internal/escalations")
            .expect("the registry carries the escalations row");
        for caller in [Caller::DeptHead, Caller::Dean] {
            assert_eq!(
                route.expect(caller, ScopeCase::InScope),
                Outcome::Denied(403),
                "{}",
                caller.label()
            );
        }
        for caller in [Caller::Ethics, Caller::Compliance, Caller::Admin] {
            assert_eq!(
                route.expect(caller, ScopeCase::InScope),
                Outcome::Allowed,
                "{}",
                caller.label()
            );
        }
    }

    /// TZ §4.4 grants the export to «ролям с соответствующими правами», and a
    /// head's export is their own department: narrowing the escalation section
    /// must not narrow the export with it (ADR-014 §5).
    #[test]
    fn every_scoped_role_still_exports_its_own_area() {
        let route =
            route_for("POST", "/api/internal/export").expect("the registry carries the export row");
        for caller in [
            Caller::DeptHead,
            Caller::Dean,
            Caller::Ethics,
            Caller::Compliance,
            Caller::Admin,
        ] {
            assert_eq!(
                route.expect(caller, ScopeCase::InScope),
                Outcome::Allowed,
                "{}",
                caller.label()
            );
        }
    }

    /// Every other internal section stays open to all five scoped roles: the
    /// narrowing above is one row, not a policy change.
    #[test]
    fn the_other_internal_sections_stay_open_to_every_scoped_role() {
        for route in ROUTES
            .iter()
            .filter(|route| route.contour == Contour::Internal)
            .filter(|route| route.path != "/api/internal/escalations")
        {
            for caller in [Caller::DeptHead, Caller::Dean] {
                assert_eq!(
                    route.expect(caller, ScopeCase::InScope),
                    Outcome::Allowed,
                    "{} {} must stay open to {}",
                    route.method,
                    route.path,
                    caller.label()
                );
            }
        }
    }

    /// The role → caller mapping the enforcement layer reads must be a bijection
    /// onto the six real roles; a new `RoleKind` that fell through to `Staff`
    /// would silently lose access.
    #[test]
    fn every_role_maps_to_its_own_caller() {
        for (role, caller) in [
            (RoleKind::Staff, Caller::Staff),
            (RoleKind::DeptHead, Caller::DeptHead),
            (RoleKind::Dean, Caller::Dean),
            (RoleKind::Ethics, Caller::Ethics),
            (RoleKind::Compliance, Caller::Compliance),
            (RoleKind::Admin, Caller::Admin),
        ] {
            assert_eq!(Caller::from_role(role), caller, "{role:?}");
            assert_eq!(caller.role(), Some(role), "{role:?}");
        }
    }

    #[test]
    fn the_registry_has_no_duplicate_rows() {
        assert_eq!(
            registered().len(),
            ROUTES.len(),
            "two rows describe the same method and path"
        );
    }

    #[test]
    fn every_registered_sample_path_matches_its_template() {
        for route in ROUTES {
            let template = route.path.split('{').next().unwrap_or(route.path);
            assert!(
                route.sample_path.starts_with(template),
                "{} is not an instance of {}",
                route.sample_path,
                route.path
            );
        }
    }
}
