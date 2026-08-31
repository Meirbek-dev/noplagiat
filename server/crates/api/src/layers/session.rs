//! `SessionAuth` and the two authorization gates in front of the internal and
//! admin contours (ARCHITECTURE.md §4.2).
//!
//! Identity is re-read from the database on every request. There is no signed
//! cookie payload and no in-process cache, so revoking a role or deactivating a
//! user takes effect on the next request rather than at the next login.

use axum::extract::{Request, State};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use domain::RoleKind;

use crate::auth::{self, CurrentUser, RoleGrant, store};
use crate::error::ApiError;
use crate::state::AppState;

/// Load the session and attach [`CurrentUser`]. Missing, malformed, unknown and
/// expired sessions are all one answer - 401 - so the response does not tell an
/// attacker which of the four they hit.
pub async fn session_auth(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Response {
    let unauthorized = || {
        ApiError::Unauthorized("a valid session is required for the internal contour")
            .into_response()
    };

    let Some(cookie) = auth::session_cookie(request.headers()) else {
        return unauthorized();
    };
    let Ok(session_id) = hex::decode(&cookie) else {
        return unauthorized();
    };
    if session_id.len() != store::TOKEN_LEN {
        return unauthorized();
    }

    let session = match store::load(&state.db, &session_id).await {
        Ok(Some(session)) => session,
        Ok(None) => return unauthorized(),
        Err(error) => {
            tracing::error!(%error, "session lookup failed");
            return ApiError::Internal("session lookup failed").into_response();
        }
    };

    let user = match db::users::by_id(&state.db, session.user_id).await {
        Ok(Some(user)) if user.user.active => user,
        // A session whose user has been deactivated or removed is dead.
        Ok(_) => return unauthorized(),
        Err(error) => {
            tracing::error!(%error, "user lookup failed");
            return ApiError::Internal("user lookup failed").into_response();
        }
    };

    let grants: Vec<RoleGrant> = user
        .roles
        .iter()
        .filter_map(|assignment| {
            let role = auth::parse_role(&assignment.role).or_else(|| {
                // A role label the domain does not know is a schema/enum drift
                // bug. Dropping it fails closed.
                tracing::error!(role = %assignment.role, "unknown role_kind in user_roles");
                None
            })?;
            Some(RoleGrant {
                role,
                scope_faculty_id: assignment.scope_faculty_id,
                scope_department_id: assignment.scope_department_id,
                scope_faculty_code: assignment.scope_faculty_code.clone(),
                scope_department_code: assignment.scope_department_code.clone(),
            })
        })
        .collect();

    let current = CurrentUser {
        user_id: user.user.id,
        username: user.user.username,
        effective_role: auth::effective_role(&grants),
        scope: auth::widest_scope(&grants),
        roles: grants,
        session_id,
        csrf_token: session.csrf_token,
    };
    request.extensions_mut().insert(current);
    next.run(request).await
}

/// Authenticated but role-less users see nothing internal (ARCHITECTURE.md
/// §4.2). Runs before the audit layer so a rejected request is not logged as a
/// section view.
pub async fn require_internal_access(request: Request, next: Next) -> Response {
    match request.extensions().get::<CurrentUser>() {
        Some(user) if user.scope.is_some() => next.run(request).await,
        Some(_) => ApiError::Forbidden(auth::REQUEST_ACCESS_DETAIL).into_response(),
        None => ApiError::Unauthorized("a valid session is required").into_response(),
    }
}

/// `RequireRole(admin)` for `/api/admin/*` (ARCHITECTURE.md §4.2).
pub async fn require_admin(request: Request, next: Next) -> Response {
    match request.extensions().get::<CurrentUser>() {
        Some(user) if user.roles.iter().any(|grant| grant.role == RoleKind::Admin) => {
            next.run(request).await
        }
        Some(_) => {
            ApiError::Forbidden("the administrative area requires the admin role").into_response()
        }
        None => ApiError::Unauthorized("a valid session is required").into_response(),
    }
}
