//! Slice W3.1 gate: the portal SSO code flow against a mock identity provider
//! (PLAN.md W3.1 «integration tests of the full code flow against a mock IdP;
//! session-fixation and CSRF tests»).
//!
//! Every test drives the **real** router - `GET /api/auth/login` for the
//! redirect, `GET /api/auth/callback` for the exchange - so a check that moves
//! out of the flow fails here rather than passing quietly.

// `server/clippy.toml` allows `expect` in `#[test]` functions but not in the
// helpers they call. These helpers exist to abort a test loudly on a broken
// harness; they are not a request path, which is what the workspace lint
// protects (ARCHITECTURE.md §4.1).
#![expect(
    clippy::expect_used,
    reason = "test harness: a broken fixture must abort the test"
)]

mod support;

use api::state::{AppState, AuthMode};
use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use serde_json::json;
use sqlx::PgPool;
use support::idp::{CLIENT_ID, MockIdp, now_seconds, sign_with_kid};
use support::{Reply, send};

/// One in-flight authorization request, as the browser holds it.
struct Flow {
    cookie: String,
    state: String,
    nonce: String,
    challenge: String,
}

/// Build a router in `oidc` mode pointed at `idp`.
async fn router(pool: PgPool, idp: &MockIdp) -> axum::Router {
    let mut config = support::config(AuthMode::Oidc);
    config.oidc = Some(idp.oidc_config("http://localhost:8080"));
    api::build_router(AppState::new(db::Pool::for_tests(pool), config))
}

/// Start the flow and pull `state`, `nonce` and the PKCE challenge out of the
/// redirect the server issued.
async fn begin(router: &axum::Router) -> Flow {
    let reply = send(
        router,
        Request::builder()
            .uri("/api/auth/login")
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    assert_eq!(
        reply.status,
        StatusCode::SEE_OTHER,
        "login should redirect to the provider, got {}",
        String::from_utf8_lossy(&reply.body)
    );

    let location = reply
        .header(header::LOCATION)
        .expect("the redirect names the authorization endpoint");
    let cookie = reply
        .header(header::SET_COOKIE)
        .expect("the flow cookie is set")
        .split(';')
        .next()
        .expect("the cookie has a value")
        .to_owned();

    Flow {
        cookie,
        state: query_param(&location, "state"),
        nonce: query_param(&location, "nonce"),
        challenge: query_param(&location, "code_challenge"),
    }
}

fn query_param(url: &str, name: &str) -> String {
    let query = url
        .split_once('?')
        .map(|(_, rest)| rest)
        .unwrap_or_default();
    query
        .split('&')
        .filter_map(|pair| pair.split_once('='))
        .find(|(key, _)| *key == name)
        .map(|(_, value)| value.replace("%2D", "-").replace("%5F", "_"))
        .unwrap_or_else(|| panic!("`{name}` is missing from {url}"))
}

/// Finish the flow with the code and state the caller supplies.
async fn callback(router: &axum::Router, flow: &Flow, state: &str) -> Reply {
    send(
        router,
        Request::builder()
            .uri(format!("/api/auth/callback?code=mock-code&state={state}"))
            .header(header::COOKIE, flow.cookie.clone())
            .body(Body::empty())
            .expect("well formed"),
    )
    .await
}

fn session_cookie(reply: &Reply) -> Option<String> {
    reply
        .headers
        .get_all(header::SET_COOKIE)
        .iter()
        .filter_map(|value| value.to_str().ok())
        .find(|value| value.starts_with("np_session="))
        .and_then(|value| value.split(';').next())
        .map(str::to_owned)
}

// ── the happy path ──────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn the_code_flow_signs_a_mapped_group_into_its_role(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    // The redirect carries PKCE S256, not a plain challenge.
    assert!(!flow.challenge.is_empty());
    assert_ne!(flow.challenge, flow.state);
    assert!(!flow.nonce.is_empty());

    idp.issue(idp.id_token("compliance.officer", &flow.nonce, &["noplagiat-compliance"]));
    let reply = callback(&router, &flow, &flow.state).await;

    assert_eq!(reply.status, StatusCode::SEE_OTHER);
    assert_eq!(reply.header(header::LOCATION).as_deref(), Some("/app"));
    let session = session_cookie(&reply).expect("the callback establishes a session");
    // The single-use flow cookie is cleared on the way out.
    assert!(
        reply
            .headers
            .get_all(header::SET_COOKIE)
            .iter()
            .filter_map(|value| value.to_str().ok())
            .any(|value| value.starts_with("np_oidc=") && value.contains("Max-Age=0")),
        "the flow cookie must be single use"
    );

    let me = send(
        &router,
        Request::builder()
            .uri("/api/auth/me")
            .header(header::COOKIE, session)
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    assert_eq!(me.status, StatusCode::OK);
    let body = me.json();
    assert_eq!(body["sso_subject"], json!("compliance.officer"));
    assert_eq!(body["role"], json!("compliance"));
    assert_eq!(body["scope"]["kind"], json!("all"));
    Ok(())
}

/// The mapping table resolves a unit code to a scope, so a dean of FAC03 lands
/// on `Scope::Faculty(FAC03)` and nothing wider.
#[sqlx::test(migrations = "../../migrations")]
async fn a_group_mapping_resolves_a_unit_scope(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let pool = db::Pool::for_tests(pool);
    support::load_warehouse(&pool)
        .await
        .expect("the fixture warehouse loads");
    db::settings::set(
        &pool,
        "role_mappings",
        &json!([
            {"group": "TOU-Dean-FAC03", "role": "dean", "faculty_code": "FAC03"},
            {"group": "TOU-Head-DEP11", "role": "dept_head", "department_code": "DEP11"},
        ]),
        Some("test"),
    )
    .await
    .expect("the mapping is stored");

    let mut config = support::config(AuthMode::Oidc);
    config.oidc = Some(idp.oidc_config("http://localhost:8080"));
    let router = api::build_router(AppState::new(pool.clone(), config));

    let flow = begin(&router).await;
    idp.issue(idp.id_token("dean.fac03", &flow.nonce, &["TOU-Dean-FAC03"]));
    let reply = callback(&router, &flow, &flow.state).await;
    let session = session_cookie(&reply).expect("session established");

    let me = send(
        &router,
        Request::builder()
            .uri("/api/auth/me")
            .header(header::COOKIE, session)
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    let body = me.json();
    assert_eq!(body["role"], json!("dean"));
    assert_eq!(body["scope"]["kind"], json!("faculty"));
    assert!(body["scope"]["faculty_id"].as_i64().is_some());
    Ok(())
}

/// An authenticated account with no mapped group is signed in but lands on the
/// request-access path, and the internal contour says so (TZ §5).
#[sqlx::test(migrations = "../../migrations")]
async fn an_unmapped_group_lands_on_the_request_access_path(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    idp.issue(idp.id_token("newcomer", &flow.nonce, &["TOU-Some-Other-Group"]));
    let reply = callback(&router, &flow, &flow.state).await;

    assert_eq!(reply.status, StatusCode::SEE_OTHER);
    assert_eq!(
        reply.header(header::LOCATION).as_deref(),
        Some("/app/request-access")
    );

    let session = session_cookie(&reply).expect("a role-less session still exists");
    let ping = send(
        &router,
        Request::builder()
            .uri("/api/internal/ping")
            .header(header::COOKIE, session)
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    let problem = ping.problem(StatusCode::FORBIDDEN);
    assert!(
        problem["detail"]
            .as_str()
            .is_some_and(|detail| detail.contains("/app/request-access")),
        "the 403 must point at the request-access flow: {problem}"
    );
    Ok(())
}

// ── every rejection the flow owes ───────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn a_callback_whose_state_does_not_match_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    idp.issue(idp.id_token("attacker", &flow.nonce, &["noplagiat-admin"]));

    let reply = callback(&router, &flow, "a-state-this-browser-never-saw").await;
    reply.problem(StatusCode::FORBIDDEN);
    assert!(
        session_cookie(&reply).is_none(),
        "a refused callback must not establish a session"
    );
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_callback_without_the_flow_cookie_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;
    let flow = begin(&router).await;
    idp.issue(idp.id_token("attacker", &flow.nonce, &["noplagiat-admin"]));

    let reply = send(
        &router,
        Request::builder()
            .uri(format!(
                "/api/auth/callback?code=mock-code&state={}",
                flow.state
            ))
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    reply.problem(StatusCode::FORBIDDEN);
    assert!(session_cookie(&reply).is_none());
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_id_token_with_a_foreign_nonce_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    // A token minted for a *different* authorization request: correct issuer,
    // correct audience, valid signature, wrong nonce.
    idp.issue(idp.id_token("attacker", "some-other-nonce", &["noplagiat-admin"]));

    let reply = callback(&router, &flow, &flow.state).await;
    reply.problem(StatusCode::FORBIDDEN);
    assert!(session_cookie(&reply).is_none());
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_id_token_for_another_client_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    let mut claims = idp.claims("attacker", &flow.nonce, &["noplagiat-admin"]);
    claims["aud"] = json!("some-other-client");
    idp.issue(idp.sign(&claims));

    let reply = callback(&router, &flow, &flow.state).await;
    reply.problem(StatusCode::FORBIDDEN);
    assert!(session_cookie(&reply).is_none());
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_id_token_from_another_issuer_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    let mut claims = idp.claims("attacker", &flow.nonce, &["noplagiat-admin"]);
    claims["iss"] = json!("https://evil.example");
    idp.issue(idp.sign(&claims));

    callback(&router, &flow, &flow.state)
        .await
        .problem(StatusCode::FORBIDDEN);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_expired_id_token_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    let mut claims = idp.claims("stale", &flow.nonce, &["noplagiat-admin"]);
    // Well outside the 60-second skew allowance.
    claims["iat"] = json!(now_seconds() - 7200);
    claims["exp"] = json!(now_seconds() - 3600);
    idp.issue(idp.sign(&claims));

    callback(&router, &flow, &flow.state)
        .await
        .problem(StatusCode::FORBIDDEN);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_id_token_signed_by_an_unknown_key_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    // The provider publishes one key; the token claims another. Even after the
    // rotation refetch, nothing matches.
    idp.issue(sign_with_kid(
        &idp.claims("attacker", &flow.nonce, &["noplagiat-admin"]),
        "a-key-the-provider-never-published",
    ));
    idp.set_jwks(json!({"keys": [{
        "kty": "RSA", "alg": "RS256", "kid": "test-key-1",
        "n": support::idp::TEST_KEY_MODULUS, "e": support::idp::TEST_KEY_EXPONENT,
    }]}));

    callback(&router, &flow, &flow.state)
        .await
        .problem(StatusCode::FORBIDDEN);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_refused_code_exchange_is_a_bad_gateway(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    idp.set_token_status(400);

    let reply = callback(&router, &flow, &flow.state).await;
    reply.problem(StatusCode::BAD_GATEWAY);
    assert!(session_cookie(&reply).is_none());
    Ok(())
}

/// The provider declining (`?error=access_denied`) is a refusal, not a crash,
/// and it never reaches the token endpoint.
#[sqlx::test(migrations = "../../migrations")]
async fn a_provider_error_response_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;
    let flow = begin(&router).await;

    let reply = send(
        &router,
        Request::builder()
            .uri("/api/auth/callback?error=access_denied&error_description=user+declined")
            .header(header::COOKIE, flow.cookie.clone())
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    let problem = reply.problem(StatusCode::FORBIDDEN);
    // The provider's description is attacker-influenced text and must not be
    // echoed back into the response body.
    assert!(
        !problem.to_string().contains("user declined"),
        "the provider's error_description must not be reflected: {problem}"
    );
    Ok(())
}

// ── session fixation and CSRF ───────────────────────────────────────────────

/// A session id planted in the browser before sign-in is dead afterwards, and
/// the id the callback issues is a different one.
#[sqlx::test(migrations = "../../migrations")]
async fn the_session_id_rotates_at_login(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    // A first sign-in, whose cookie stands in for the id an attacker planted.
    let first_flow = begin(&router).await;
    idp.issue(idp.id_token("victim", &first_flow.nonce, &["noplagiat-compliance"]));
    let first = callback(&router, &first_flow, &first_flow.state).await;
    let planted = session_cookie(&first).expect("the first sign-in establishes a session");

    // The browser then signs in again, still carrying that cookie - which is
    // exactly the shape of a fixation attack.
    let second_flow = begin(&router).await;
    idp.issue(idp.id_token("victim", &second_flow.nonce, &["noplagiat-compliance"]));
    let second = send(
        &router,
        Request::builder()
            .uri(format!(
                "/api/auth/callback?code=mock-code&state={}",
                second_flow.state
            ))
            .header(header::COOKIE, format!("{}; {planted}", second_flow.cookie))
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;

    let fresh = session_cookie(&second).expect("the callback establishes a session");
    assert_ne!(fresh, planted, "the session id must not survive a sign-in");

    // And the old id is gone from the database, not merely superseded.
    send(
        &router,
        Request::builder()
            .uri("/api/auth/me")
            .header(header::COOKIE, planted)
            .body(Body::empty())
            .expect("well formed"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

/// Logout is a mutation, so it needs the double-submit token - and it reports
/// the provider's RP-initiated logout URL so the portal session ends too.
#[sqlx::test(migrations = "../../migrations")]
async fn logout_is_csrf_protected_and_reports_the_end_session_url(
    pool: PgPool,
) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    let flow = begin(&router).await;
    idp.issue(idp.id_token("admin.one", &flow.nonce, &["noplagiat-admin"]));
    let reply = callback(&router, &flow, &flow.state).await;
    let session = session_cookie(&reply).expect("session established");

    let me = send(
        &router,
        Request::builder()
            .uri("/api/auth/me")
            .header(header::COOKIE, session.clone())
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    let csrf = me.json()["csrf_token"]
        .as_str()
        .expect("the session carries a CSRF token")
        .to_owned();

    // Without the token: refused, session intact.
    send(
        &router,
        Request::builder()
            .method("POST")
            .uri("/api/auth/logout")
            .header(header::COOKIE, session.clone())
            .body(Body::empty())
            .expect("well formed"),
    )
    .await
    .problem(StatusCode::FORBIDDEN);

    let logout = send(
        &router,
        Request::builder()
            .method("POST")
            .uri("/api/auth/logout")
            .header(header::COOKIE, session.clone())
            .header("x-csrf-token", csrf)
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    assert_eq!(logout.status, StatusCode::OK);
    let end_session = logout.json()["end_session_url"]
        .as_str()
        .expect("the mock provider advertises an end_session_endpoint")
        .to_owned();
    assert!(end_session.contains("/logout"), "{end_session}");
    assert!(
        end_session.contains(CLIENT_ID),
        "the RP-initiated logout must identify the client: {end_session}"
    );

    // The session is gone.
    send(
        &router,
        Request::builder()
            .uri("/api/auth/me")
            .header(header::COOKIE, session)
            .body(Body::empty())
            .expect("well formed"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

/// In `oidc` mode the dev login does not exist at all.
#[sqlx::test(migrations = "../../migrations")]
async fn the_dev_login_is_absent_in_oidc_mode(pool: PgPool) -> sqlx::Result<()> {
    let idp = MockIdp::start().await;
    let router = router(pool, &idp).await;

    send(
        &router,
        Request::builder()
            .method("POST")
            .uri("/api/auth/dev-login")
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(json!({"sso_subject": "x"}).to_string()))
            .expect("well formed"),
    )
    .await
    .problem(StatusCode::NOT_FOUND);
    Ok(())
}
