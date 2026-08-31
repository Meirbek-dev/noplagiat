//! Session lifecycle (`/api/auth/*`).
//!
//! Authentication is a login name and a password, both held in the `users` row
//! and both put there by the `manage-users` CLI on the server host (ADR-017).
//! There is no identity provider, no redirect, no self-service registration and
//! no password-reset flow: an operator with shell access to the deployment is
//! the reset path, which is the same operator TZ §5 already routes role
//! assignment through.
//!
//! `login` is the one mutating endpoint outside the CSRF layer - it is the
//! request that *creates* the token, so there is none to present yet. It is
//! instead the one endpoint behind the login rate limiter.
//!
//! # Session fixation
//!
//! A successful sign-in mints a **new** session id and destroys any session the
//! browser presented on the way in. An attacker who plants a session cookie in
//! a victim's browser before sign-in therefore ends up holding a dead id.

use axum::extract::{Request, State};
use axum::http::{HeaderValue, header};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};

use crate::auth::{self, CurrentUser, password, store};
use crate::dto::{RoleGrantDto, ScopeDto};
use crate::error::ApiError;
use crate::layers::rate_limit::client_address;
use crate::state::AppState;

pub fn router(state: &AppState) -> Router<AppState> {
    let authenticated = Router::new()
        .route("/logout", post(logout))
        .route("/me", get(me))
        // Mutating session state needs the double-submit token; `me` is a GET
        // and passes straight through.
        .layer(axum::middleware::from_fn(crate::layers::csrf::protect))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            crate::layers::session::session_auth,
        ));

    Router::new()
        .route(
            "/login",
            post(login).layer(axum::middleware::from_fn_with_state(
                state.clone(),
                throttle_login,
            )),
        )
        .merge(authenticated)
}

// ── login ───────────────────────────────────────────────────────────────────

/// Sign-in request.
///
/// No name and no e-mail: those are account fields an operator sets with the
/// CLI, so this endpoint cannot be used to put a person's name into the
/// database (AGENTS.md invariant #1).
#[derive(Debug, Deserialize, utoipa::ToSchema)]
#[serde(deny_unknown_fields)]
pub struct LoginRequest {
    /// Login name, matched case-insensitively.
    pub username: String,
    /// The account's password. Never logged, never echoed.
    pub password: String,
}

/// Per-address throttle in front of the one endpoint that takes a password.
///
/// The public limiter is deliberately generous (a cached portal page issues one
/// request an hour); a password endpoint needs the opposite shape, so it gets
/// its own bucket. Mounted as a layer rather than checked inside the handler so
/// that a refusal costs no database round trip and no Argon2 verification.
async fn throttle_login(
    State(state): State<AppState>,
    request: Request,
    next: Next,
) -> Response {
    let client = client_address(&request);
    match state.login_rate_limiter.check(client) {
        Ok(()) => next.run(request).await,
        Err(retry_after_seconds) => {
            tracing::warn!(%client, "sign-in rate limit exceeded");
            ApiError::TooManyRequests {
                retry_after_seconds,
            }
            .into_response()
        }
    }
}

/// Sign in with a local account.
///
/// Every failure - unknown name, deactivated account, no password set, wrong
/// password - is one `401` with one message. Distinguishing them would turn the
/// endpoint into an oracle for which login names exist, and the operator who
/// can create accounts is not the person doing the guessing.
#[utoipa::path(
    post,
    path = "/api/auth/login",
    tag = "auth",
    request_body = LoginRequest,
    responses(
        (status = 200, body = MeResponse, description = "session established"),
        (status = 401, body = crate::error::Problem, description = "the credentials were not accepted"),
        (status = 422, body = crate::error::Problem, description = "a field was empty"),
        (status = 429, body = crate::error::Problem, description = "too many sign-in attempts from this address"),
    ),
)]
pub async fn login(
    State(state): State<AppState>,
    headers: axum::http::HeaderMap,
    Json(request): Json<LoginRequest>,
) -> Result<Response, ApiError> {
    if request.username.trim().is_empty() {
        return Err(ApiError::field("username", "must not be empty"));
    }
    if request.password.is_empty() {
        return Err(ApiError::field("password", "must not be empty"));
    }

    let refused = || ApiError::Unauthorized("the login name or password is not correct");

    let candidate = db::users::credentials_by_username(&state.db, request.username.trim()).await?;
    let Some(candidate) = candidate else {
        // Spend the verification time anyway: answering an unknown name faster
        // than a wrong password is a membership oracle.
        password::spend_verification_time();
        return Err(refused());
    };

    // A deactivated account is refused by withholding its hash, which
    // `password::verify` treats exactly like an account that has none: same
    // answer, and the same Argon2 work spent before giving it.
    let stored = candidate
        .password_hash
        .as_deref()
        .filter(|_| candidate.user.active);
    if !password::verify(&request.password, stored) {
        tracing::warn!(user_id = candidate.user.id, "sign-in refused");
        return Err(refused());
    }

    // Session fixation: whatever id the browser arrived with is destroyed, and
    // the id below is freshly generated. A planted cookie is dead by the time
    // the victim is signed in.
    if let Some(hex) = auth::session_cookie(&headers)
        && let Ok(id) = hex::decode(hex)
        && id.len() == store::TOKEN_LEN
        && let Err(error) = store::delete(&state.db, &id).await
    {
        tracing::warn!(%error, "presented session could not be rotated away");
    }

    // Opportunistic housekeeping: expired rows are dead weight, and a sign-in
    // is the one moment the session table is guaranteed to be touched.
    if let Err(error) = store::delete_expired(&state.db).await {
        tracing::warn!(%error, "expired session sweep failed");
    }

    let session = store::create(&state.db, candidate.user.id, state.config.session_ttl_seconds)
        .await
        .map_err(session_error)?;

    let grants = load_grants(&state, candidate.user.id).await?;
    // The user id is a warehouse key, not an address. The login name, the
    // e-mail and the display name never reach a log line (ARCHITECTURE.md §8).
    tracing::info!(
        user_id = candidate.user.id,
        grants = grants.len(),
        "session established"
    );

    let body = MeResponse {
        username: candidate.user.username,
        role: auth::effective_role(&grants).map(|role| db::filters::role_label(role).to_owned()),
        roles: grants.iter().map(RoleGrantDto::from_grant).collect(),
        scope: auth::widest_scope(&grants).map(Into::into),
        request_access_path: auth::REQUEST_ACCESS_PATH,
        csrf_token: session.csrf_hex(),
    };

    let mut response = Json(body).into_response();
    append_cookie(
        &mut response,
        &auth::set_cookie(&session.id_hex(), state.config.session_ttl_seconds),
    );
    Ok(response)
}

// ── logout ──────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, utoipa::ToSchema)]
pub struct LogoutResponse {
    /// Where the browser should go once the session is gone. Always the sign-in
    /// page: with no identity provider there is no second session to end.
    pub next_path: &'static str,
}

/// End the current session and clear the cookie.
#[utoipa::path(
    post,
    path = "/api/auth/logout",
    tag = "auth",
    responses(
        (status = 200, body = LogoutResponse, description = "session ended"),
        (status = 401, body = crate::error::Problem, description = "no valid session"),
        (status = 403, body = crate::error::Problem, description = "missing or mismatched CSRF token"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn logout(
    State(state): State<AppState>,
    user: CurrentUser,
) -> Result<Response, ApiError> {
    store::delete(&state.db, &user.session_id)
        .await
        .map_err(session_error)?;

    let mut response = Json(LogoutResponse {
        next_path: LOGIN_PATH,
    })
    .into_response();
    append_cookie(&mut response, &auth::clear_cookie());
    Ok(response)
}

/// Frontend sign-in route.
pub const LOGIN_PATH: &str = "/login";

// ── me ──────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, utoipa::ToSchema)]
pub struct MeResponse {
    /// Login name of the signed-in account.
    pub username: String,
    /// Widest role held, or `null` for an account awaiting access.
    pub role: Option<String>,
    pub roles: Vec<RoleGrantDto>,
    /// Visibility the roles grant, or `null` when none of them reaches the
    /// internal contour.
    pub scope: Option<ScopeDto>,
    /// Where to send an account that holds no grants (TZ §5).
    pub request_access_path: &'static str,
    /// Hex CSRF token for this session - send it as `x-csrf-token` on every
    /// mutating request.
    pub csrf_token: String,
}

/// The current session's identity and authorization.
#[utoipa::path(
    get,
    path = "/api/auth/me",
    tag = "auth",
    responses(
        (status = 200, body = MeResponse),
        (status = 401, body = crate::error::Problem, description = "no valid session"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn me(user: CurrentUser) -> Json<MeResponse> {
    Json(MeResponse {
        username: user.username.clone(),
        role: user
            .effective_role
            .map(|role| db::filters::role_label(role).to_owned()),
        roles: user.roles.iter().map(RoleGrantDto::from_grant).collect(),
        scope: user.scope.map(Into::into),
        request_access_path: auth::REQUEST_ACCESS_PATH,
        csrf_token: hex::encode(&user.csrf_token),
    })
}

// ── helpers ─────────────────────────────────────────────────────────────────

fn append_cookie(response: &mut Response, value: &str) {
    match HeaderValue::try_from(value) {
        Ok(header) => {
            response.headers_mut().append(header::SET_COOKIE, header);
        }
        Err(error) => tracing::error!(%error, "cookie could not be encoded"),
    }
}

fn session_error(error: store::SessionError) -> ApiError {
    match error {
        store::SessionError::Db(error) => ApiError::Db(error),
        store::SessionError::Entropy(error) => {
            tracing::error!(%error, "session token generation failed");
            ApiError::Internal("session token generation failed")
        }
    }
}

async fn load_grants(state: &AppState, user_id: i64) -> Result<Vec<auth::RoleGrant>, ApiError> {
    let assignments = db::users::roles(&state.db, user_id).await?;
    Ok(assignments
        .iter()
        .filter_map(|assignment| {
            Some(auth::RoleGrant {
                role: auth::parse_role(&assignment.role)?,
                scope_faculty_id: assignment.scope_faculty_id,
                scope_department_id: assignment.scope_department_id,
                scope_faculty_code: assignment.scope_faculty_code.clone(),
                scope_department_code: assignment.scope_department_code.clone(),
            })
        })
        .collect())
}
