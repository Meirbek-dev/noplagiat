//! Session lifecycle (`/api/auth/*`).
//!
//! Production authentication is the portal's OIDC authorization-code flow with
//! PKCE (slice W3.1, ADR-014); the protocol mechanics live in
//! [`crate::auth::oidc`] and this module is the HTTP shape around them.
//! `APP_AUTH_MODE=dev` instead mounts `dev-login`, which mints a session
//! directly so that development, integration tests and Playwright can exercise
//! the whole RBAC and audit stack without an identity provider (PLAN.md D7, R3).
//!
//! `dev-login` and `callback` are the two mutating endpoints outside the CSRF
//! layer: they are the requests that *create* the token, so there is none to
//! present yet. The callback's CSRF defence is the `state` parameter, compared
//! against the flow cookie.
//!
//! # Session fixation
//!
//! Both login paths mint a **new** session id and destroy any session the
//! browser presented on the way in. An attacker who plants a session cookie in
//! a victim's browser before sign-in therefore ends up holding a dead id.

use axum::extract::{Query, State};
use axum::http::{HeaderValue, header};
use axum::response::{IntoResponse, Redirect, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};

use crate::auth::oidc::{self, FlowState};
use crate::auth::{self, CurrentUser, mapping, store};
use crate::dto::{RoleGrantDto, ScopeDto};
use crate::error::ApiError;
use crate::state::{AppState, AuthMode};

/// Where a signed-in user lands.
const DASHBOARD_PATH: &str = "/app";

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
        .route("/login", get(login))
        .route("/callback", get(callback))
        .route("/dev-login", post(dev_login))
        .merge(authenticated)
}

// ── login ───────────────────────────────────────────────────────────────────

/// Start the portal SSO flow.
///
/// Answers `303 See Other` to the provider's authorization endpoint, carrying
/// `state`, `nonce` and an S256 PKCE challenge, and sets the ten-minute flow
/// cookie the callback validates against.
#[utoipa::path(
    get,
    path = "/api/auth/login",
    tag = "auth",
    responses(
        (status = 303, description = "redirect to the identity provider"),
        (status = 503, body = crate::error::Problem, description = "no identity provider is configured"),
    ),
)]
pub async fn login(State(state): State<AppState>) -> Result<Response, ApiError> {
    if state.config.auth_mode == AuthMode::Dev {
        return Err(ApiError::NotImplementedYet(
            "this deployment runs APP_AUTH_MODE=dev; sign in with POST /api/auth/dev-login",
        ));
    }
    let Some(client) = state.oidc.as_ref() else {
        return Err(ApiError::NotImplementedYet(
            "APP_OIDC_ISSUER, APP_OIDC_CLIENT_ID and APP_OIDC_CLIENT_SECRET are not configured",
        ));
    };

    let flow = FlowState::generate().map_err(|error| {
        tracing::error!(%error, "flow token generation failed");
        ApiError::Internal("sign-in token generation failed")
    })?;
    let url = client.authorization_url(&flow).await.map_err(oidc_error)?;

    let mut response = Redirect::to(&url).into_response();
    append_cookie(
        &mut response,
        &oidc::set_flow_cookie(&flow.to_cookie_value()),
    );
    Ok(response)
}

// ── callback ────────────────────────────────────────────────────────────────

/// Query parameters the provider returns on the callback.
#[derive(Debug, Default, Deserialize, utoipa::IntoParams)]
#[into_params(parameter_in = Query)]
pub struct CallbackQuery {
    /// Authorization code, on success.
    pub code: Option<String>,
    /// Opaque value echoed back, compared against the flow cookie.
    pub state: Option<String>,
    /// OAuth error code, when the user declined or the provider refused.
    pub error: Option<String>,
    #[serde(rename = "error_description")]
    pub error_description: Option<String>,
}

/// Finish the portal SSO flow.
#[utoipa::path(
    get,
    path = "/api/auth/callback",
    tag = "auth",
    params(CallbackQuery),
    responses(
        (status = 303, description = "session established; redirect into the dashboard"),
        (status = 403, body = crate::error::Problem, description = "the sign-in could not be matched to this browser"),
        (status = 502, body = crate::error::Problem, description = "the identity provider rejected the exchange"),
        (status = 503, body = crate::error::Problem, description = "no identity provider is configured"),
    ),
)]
pub async fn callback(
    State(state): State<AppState>,
    headers: axum::http::HeaderMap,
    Query(query): Query<CallbackQuery>,
) -> Result<Response, ApiError> {
    let Some(client) = state.oidc.as_ref() else {
        return Err(ApiError::NotImplementedYet(
            "no identity provider is configured for this deployment",
        ));
    };

    // The flow cookie is cleared on every outcome: an authorization request is
    // single use, so a replayed `code` finds no verifier waiting for it.
    let finish = |response: Response| -> Response {
        let mut response = response;
        append_cookie(&mut response, &oidc::clear_flow_cookie());
        response
    };

    if let Some(error) = query.error.as_deref() {
        // The provider's description is attacker-influenced text; it is logged
        // at debug through a typed field and never echoed into the response.
        tracing::warn!(
            error,
            has_description = query.error_description.is_some(),
            "the identity provider refused the sign-in"
        );
        return Ok(finish(
            ApiError::Forbidden("the identity provider refused this sign-in").into_response(),
        ));
    }

    let flow = oidc::flow_cookie(&headers)
        .as_deref()
        .and_then(FlowState::from_cookie_value);
    let (Some(code), Some(returned_state), Some(flow)) =
        (query.code.as_deref(), query.state.as_deref(), flow)
    else {
        return Ok(finish(
            ApiError::Forbidden(
                "this sign-in could not be matched to your browser - start again from /api/auth/login",
            )
            .into_response(),
        ));
    };

    if !oidc::tokens_match(returned_state, &flow.state) {
        tracing::warn!("OIDC callback state does not match the flow cookie");
        return Ok(finish(
            ApiError::Forbidden("this sign-in could not be matched to your browser")
                .into_response(),
        ));
    }

    let claims = match client.exchange_and_verify(code, &flow).await {
        Ok(claims) => claims,
        Err(error) => {
            tracing::warn!(%error, "the OIDC code exchange failed");
            return Ok(finish(oidc_error(error).into_response()));
        }
    };

    let user = establish(&state, &claims, auth::session_cookie(&headers).as_deref()).await?;
    let target = if user.scope.is_some() {
        DASHBOARD_PATH
    } else {
        auth::REQUEST_ACCESS_PATH
    };

    let mut response = Redirect::to(target).into_response();
    append_cookie(
        &mut response,
        &auth::set_cookie(&user.session_id_hex, state.config.session_ttl_seconds),
    );
    Ok(finish(response))
}

// ── dev login ───────────────────────────────────────────────────────────────

/// Development sign-in request.
///
/// No name and no e-mail: the identity is the opaque SSO subject, and the
/// synthetic account fields are derived from it, so this endpoint cannot be
/// used to put a person's name into the database (AGENTS.md invariant #1).
#[derive(Debug, Deserialize, utoipa::ToSchema)]
#[serde(deny_unknown_fields)]
pub struct DevLoginRequest {
    /// Opaque subject identifier, as the IdP would supply.
    pub sso_subject: String,
    /// Role to grant: `staff`, `dept_head`, `dean`, `ethics`, `compliance` or
    /// `admin`. Omit to mint the role-less session that the «request access»
    /// path uses.
    #[serde(default)]
    #[schema(value_type = Option<String>)]
    pub role: Option<domain::RoleKind>,
    /// Faculty dictionary code for a `dean` grant.
    #[serde(default)]
    pub scope_faculty_code: Option<String>,
    /// Department dictionary code for a `dept_head` grant.
    #[serde(default)]
    pub scope_department_code: Option<String>,
}

#[derive(Debug, Serialize, utoipa::ToSchema)]
pub struct DevLoginResponse {
    pub sso_subject: String,
    /// Grants the account now holds.
    pub roles: Vec<RoleGrantDto>,
    pub scope: Option<ScopeDto>,
    /// Hex CSRF token for this session - send it as `x-csrf-token` on every
    /// mutating request.
    pub csrf_token: String,
}

/// Mint a session directly. `APP_AUTH_MODE=dev` only.
///
/// Idempotent and additive: repeating it for the same subject re-uses the user
/// row and adds the requested grant if it is missing. It never revokes, so a
/// test that needs a different role uses a different subject.
#[utoipa::path(
    post,
    path = "/api/auth/dev-login",
    tag = "auth",
    request_body = DevLoginRequest,
    responses(
        (status = 200, body = DevLoginResponse),
        (status = 404, body = crate::error::Problem, description = "not running in dev auth mode"),
        (status = 422, body = crate::error::Problem, description = "unknown dictionary code"),
    ),
)]
pub async fn dev_login(
    State(state): State<AppState>,
    Json(request): Json<DevLoginRequest>,
) -> Result<Response, ApiError> {
    if state.config.auth_mode != AuthMode::Dev {
        // Not 403: in production this route does not exist at all.
        return Err(ApiError::NotFound);
    }
    if request.sso_subject.trim().is_empty() {
        return Err(ApiError::field("sso_subject", "must not be empty"));
    }

    let subject = request.sso_subject.trim();
    let user = db::users::upsert_by_sso_subject(
        &state.db,
        subject,
        &format!("{subject}@dev.invalid"),
        subject,
    )
    .await?;

    if let Some(role) = request.role {
        let faculty_id = match &request.scope_faculty_code {
            Some(code) => Some(resolve_faculty(&state, code).await?),
            None => None,
        };
        let department_id = match &request.scope_department_code {
            Some(code) => Some(resolve_department(&state, code).await?),
            None => None,
        };
        db::users::add_role(&state.db, user.id, role, faculty_id, department_id).await?;
    }

    // Opportunistic housekeeping: expired rows are dead weight, and login is
    // the one moment a session table is guaranteed to be touched.
    if let Err(error) = store::delete_expired(&state.db).await {
        tracing::warn!(%error, "expired session sweep failed");
    }

    let session = store::create(&state.db, user.id, state.config.session_ttl_seconds)
        .await
        .map_err(session_error)?;

    let grants = load_grants(&state, user.id).await?;
    let body = DevLoginResponse {
        sso_subject: user.sso_subject,
        scope: auth::widest_scope(&grants).map(Into::into),
        roles: grants.iter().map(RoleGrantDto::from_grant).collect(),
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
    /// RP-initiated logout URL, when the provider advertises an
    /// `end_session_endpoint`. The browser should follow it so the portal
    /// session ends too; `null` means the local session was all there was.
    pub end_session_url: Option<String>,
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

    let end_session_url = match state.oidc.as_ref() {
        Some(client) => client.end_session_url().await,
        None => None,
    };
    let mut response = Json(LogoutResponse { end_session_url }).into_response();
    append_cookie(&mut response, &auth::clear_cookie());
    Ok(response)
}

// ── me ──────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, utoipa::ToSchema)]
pub struct MeResponse {
    pub sso_subject: String,
    /// Widest role held, or `null` for an account awaiting access.
    pub role: Option<String>,
    pub roles: Vec<RoleGrantDto>,
    /// Visibility the roles grant, or `null` when none of them reaches the
    /// internal contour.
    pub scope: Option<ScopeDto>,
    /// Where to send an account that holds no grants (TZ §5).
    pub request_access_path: &'static str,
    /// Hex CSRF token for this session, so a reloaded page can keep mutating.
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
        sso_subject: user.sso_subject.clone(),
        role: user
            .effective_role
            .map(|role| db::filters::role_label(role).to_owned()),
        roles: user.roles.iter().map(RoleGrantDto::from_grant).collect(),
        scope: user.scope.map(Into::into),
        request_access_path: auth::REQUEST_ACCESS_PATH,
        csrf_token: hex::encode(&user.csrf_token),
    })
}

// ── establishing a session from verified claims ─────────────────────────────

/// What a successful callback produced.
pub struct EstablishedSession {
    pub session_id_hex: String,
    pub scope: Option<compliance::Scope>,
}

/// Upsert the account, apply the group mapping, and mint a fresh session.
///
/// Group mapping is **additive**: a mapped group grants the role it names, and
/// grants an administrator added by hand survive (TZ §5 routes assignment and
/// revocation through the head of unit and the system administrator, not
/// through AD alone). Revocation is therefore an admin action -
/// `DELETE /api/admin/roles` - and ADR-014 §3 records the trade.
pub async fn establish(
    state: &AppState,
    claims: &crate::auth::oidc::IdClaims,
    presented_session_hex: Option<&str>,
) -> Result<EstablishedSession, ApiError> {
    // Session fixation: whatever id the browser arrived with is destroyed, and
    // the id below is freshly generated. A planted cookie is dead by the time
    // the victim is signed in.
    if let Some(hex) = presented_session_hex
        && let Ok(id) = hex::decode(hex)
        && id.len() == store::TOKEN_LEN
        && let Err(error) = store::delete(&state.db, &id).await
    {
        tracing::warn!(%error, "presented session could not be rotated away");
    }

    let email = claims.email.clone().unwrap_or_else(|| {
        // The account row needs something; an opaque, non-routable placeholder
        // beats inventing an address.
        format!("{}@sso.invalid", claims.sub)
    });
    let user =
        db::users::upsert_by_sso_subject(&state.db, &claims.sub, &email, claims.display_name())
            .await?;

    let mappings = state.role_mappings().await?;
    let groups = claims.groups(
        state
            .oidc
            .as_ref()
            .map_or(crate::auth::oidc::DEFAULT_GROUPS_CLAIM, |client| {
                client.config().groups_claim.as_str()
            }),
    );
    let faculty_ids = db::dicts::faculty_ids(&state.db).await?;
    let department_ids = db::dicts::department_ids(&state.db).await?;
    for grant in mapping::grants_for(&mappings, &groups, &faculty_ids, &department_ids) {
        db::users::add_role(
            &state.db,
            user.id,
            grant.role,
            grant.scope_faculty_id,
            grant.scope_department_id,
        )
        .await?;
    }

    if let Err(error) = store::delete_expired(&state.db).await {
        tracing::warn!(%error, "expired session sweep failed");
    }
    let session = store::create(&state.db, user.id, state.config.session_ttl_seconds)
        .await
        .map_err(session_error)?;

    let grants = load_grants(state, user.id).await?;
    // The subject is an opaque IdP identifier and the user id is a warehouse
    // key; neither is an address. The e-mail and the display name never reach a
    // log line (ARCHITECTURE.md §8).
    tracing::info!(
        user_id = user.id,
        grants = grants.len(),
        "portal SSO session established"
    );

    Ok(EstablishedSession {
        session_id_hex: session.id_hex(),
        scope: auth::widest_scope(&grants),
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

fn oidc_error(error: crate::auth::oidc::OidcError) -> ApiError {
    use crate::auth::oidc::OidcError;
    match error {
        OidcError::NotConfigured => {
            ApiError::NotImplementedYet("no identity provider is configured for this deployment")
        }
        OidcError::FlowState => {
            ApiError::Forbidden("this sign-in could not be matched to your browser")
        }
        OidcError::IdToken(_) => {
            ApiError::Forbidden("the identity provider's token could not be validated")
        }
        OidcError::Transport(_) | OidcError::Malformed { .. } | OidcError::TokenExchange(_) => {
            ApiError::Upstream("the identity provider could not be reached")
        }
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

async fn resolve_faculty(state: &AppState, code: &str) -> Result<i64, ApiError> {
    db::dicts::faculty_ids(&state.db)
        .await?
        .get(code)
        .copied()
        .ok_or_else(|| ApiError::field("scope_faculty_code", format!("unknown faculty `{code}`")))
}

async fn resolve_department(state: &AppState, code: &str) -> Result<i64, ApiError> {
    db::dicts::department_ids(&state.db)
        .await?
        .get(code)
        .copied()
        .ok_or_else(|| {
            ApiError::field(
                "scope_department_code",
                format!("unknown department `{code}`"),
            )
        })
}
