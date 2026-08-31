//! Slice W1.6 gates: session authentication, RBAC scope, CSRF and the audit
//! trail (ARCHITECTURE.md §4.2, TZ §5, §6.3).

mod support;

use api::state::{AppConfig, AppState, AuthMode};
use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use sqlx::PgPool;
use support::{authenticated, dev_login, get, mutating, send};

/// The sentinel unit migration 0002 guarantees, so these tests need no
/// dictionary fixture.
const SENTINEL_UNIT: &str = "UNASSIGNED";

#[sqlx::test(migrations = "../../migrations")]
async fn an_unauthenticated_internal_request_is_401(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    let reply = get(&router, "/api/internal/ping").await;
    let problem = reply.problem(StatusCode::UNAUTHORIZED);
    assert_eq!(problem["instance"], serde_json::json!("/api/internal/ping"));
    assert_eq!(problem["type"], serde_json::json!("/problems/unauthorized"));

    // Same for the admin area, and for a session id that is merely well shaped.
    get(&router, "/api/admin/ping")
        .await
        .problem(StatusCode::UNAUTHORIZED);
    let forged = Request::builder()
        .uri("/api/internal/ping")
        .header(header::COOKIE, format!("np_session={}", "ab".repeat(32)))
        .body(Body::empty())
        .expect("well formed");
    send(&router, forged)
        .await
        .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_authenticated_role_less_user_is_403(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = dev_login(&router, serde_json::json!({"sso_subject": "newcomer"})).await;

    // The session itself is valid - `/me` answers - but nothing internal opens.
    let me = send(&router, authenticated(&session, "GET", "/api/auth/me")).await;
    assert_eq!(me.status, StatusCode::OK);
    assert_eq!(me.json()["role"], serde_json::Value::Null);
    assert_eq!(me.json()["scope"], serde_json::Value::Null);

    let reply = send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await;
    let problem = reply.problem(StatusCode::FORBIDDEN);
    assert!(
        problem["detail"]
            .as_str()
            .is_some_and(|detail| detail.contains("request access")),
        "the 403 should tell the user how to get access: {problem}"
    );
    Ok(())
}

/// TZ §5: ППС hold no internal scope yet, so a staff-only grant is still 403.
#[sqlx::test(migrations = "../../migrations")]
async fn a_staff_only_grant_does_not_open_the_internal_contour(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = dev_login(
        &router,
        serde_json::json!({"sso_subject": "lecturer", "role": "staff"}),
    )
    .await;

    send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::FORBIDDEN);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn the_dev_login_flow_works_end_to_end(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = dev_login(
        &router,
        serde_json::json!({
            "sso_subject": "dean-01",
            "role": "dean",
            "scope_faculty_code": SENTINEL_UNIT,
        }),
    )
    .await;
    assert!(
        session.cookie.starts_with("np_session="),
        "{}",
        session.cookie
    );
    assert_eq!(session.csrf_token.len(), 64, "32 bytes, hex encoded");

    // The cookie carries every attribute ARCHITECTURE.md §4.2 requires.
    let login = Request::builder()
        .method("POST")
        .uri("/api/auth/dev-login")
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(
            serde_json::json!({"sso_subject": "dean-01"}).to_string(),
        ))
        .expect("well formed");
    let set_cookie = send(&router, login)
        .await
        .header(header::SET_COOKIE)
        .expect("dev-login sets a cookie");
    for attribute in ["HttpOnly", "Secure", "SameSite=Lax", "Path=/"] {
        assert!(set_cookie.contains(attribute), "{set_cookie}");
    }

    // /me reports the grant and the scope it collapses to.
    let me = send(&router, authenticated(&session, "GET", "/api/auth/me")).await;
    assert_eq!(me.status, StatusCode::OK);
    assert_eq!(me.json()["role"], serde_json::json!("dean"));
    assert_eq!(me.json()["scope"]["kind"], serde_json::json!("faculty"));
    assert_eq!(
        me.json()["csrf_token"],
        serde_json::json!(session.csrf_token)
    );

    // The scoped internal endpoint answers with the same scope.
    let ping = send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await;
    assert_eq!(ping.status, StatusCode::OK);
    assert_eq!(ping.json()["role"], serde_json::json!("dean"));
    assert_eq!(ping.json()["scope"]["kind"], serde_json::json!("faculty"));
    assert!(ping.json()["scope"]["faculty_id"].is_i64());
    // An authenticated response must never be cached or framed.
    assert_eq!(
        ping.header(header::CACHE_CONTROL).as_deref(),
        Some("no-store")
    );
    assert_eq!(
        ping.header(header::X_FRAME_OPTIONS).as_deref(),
        Some("DENY")
    );
    assert_eq!(
        ping.header(header::X_CONTENT_TYPE_OPTIONS).as_deref(),
        Some("nosniff")
    );
    assert!(
        ping.header(header::CONTENT_SECURITY_POLICY)
            .is_some_and(|policy| policy.contains("frame-ancestors 'none'"))
    );

    // Logout destroys the session; the cookie it returns clears the browser's.
    let logout = send(
        &router,
        mutating(&session, "POST", "/api/auth/logout", &session.csrf_token),
    )
    .await;
    assert_eq!(logout.status, StatusCode::OK);
    // No provider is configured in dev mode, so there is no RP-initiated
    // logout to follow (ADR-014 §1).
    assert_eq!(logout.json()["end_session_url"], serde_json::Value::Null);
    assert!(
        logout
            .header(header::SET_COOKIE)
            .is_some_and(|cookie| cookie.contains("Max-Age=0"))
    );

    // The same cookie no longer authenticates anything.
    send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    send(&router, authenticated(&session, "GET", "/api/auth/me"))
        .await
        .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_mutation_without_a_matching_csrf_token_is_403(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = dev_login(
        &router,
        serde_json::json!({"sso_subject": "compliance-01", "role": "compliance"}),
    )
    .await;

    // No token at all.
    send(&router, authenticated(&session, "POST", "/api/auth/logout"))
        .await
        .problem(StatusCode::FORBIDDEN);
    // A well-formed but wrong token.
    send(
        &router,
        mutating(&session, "POST", "/api/auth/logout", &"0".repeat(64)),
    )
    .await
    .problem(StatusCode::FORBIDDEN);
    // Not even hex.
    send(
        &router,
        mutating(&session, "POST", "/api/auth/logout", "not-a-token"),
    )
    .await
    .problem(StatusCode::FORBIDDEN);

    // The session survived all three: the correct token still works.
    let logout = send(
        &router,
        mutating(&session, "POST", "/api/auth/logout", &session.csrf_token),
    )
    .await;
    assert_eq!(logout.status, StatusCode::OK);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn the_admin_area_requires_the_admin_role(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    let compliance = dev_login(
        &router,
        serde_json::json!({"sso_subject": "ethics-01", "role": "compliance"}),
    )
    .await;
    // Compliance sees the whole internal contour…
    let ping = send(
        &router,
        authenticated(&compliance, "GET", "/api/internal/ping"),
    )
    .await;
    assert_eq!(ping.status, StatusCode::OK);
    assert_eq!(ping.json()["scope"]["kind"], serde_json::json!("all"));
    // …but not the administrative area.
    send(
        &router,
        authenticated(&compliance, "GET", "/api/admin/ping"),
    )
    .await
    .problem(StatusCode::FORBIDDEN);

    let admin = dev_login(
        &router,
        serde_json::json!({"sso_subject": "admin-01", "role": "admin"}),
    )
    .await;
    let reply = send(&router, authenticated(&admin, "GET", "/api/admin/ping")).await;
    assert_eq!(reply.status, StatusCode::OK);
    Ok(())
}

/// TZ §6.3 / §10.6 - every internal read is journalled, with the filter state
/// it was made under.
#[sqlx::test(migrations = "../../migrations")]
async fn an_audit_row_is_written_for_every_internal_2xx(pool: PgPool) -> sqlx::Result<()> {
    let audit_pool = db::Pool::for_tests(pool.clone());
    let router = support::router(pool);
    let session = dev_login(
        &router,
        serde_json::json!({"sso_subject": "dean-02", "role": "dean", "scope_faculty_code": SENTINEL_UNIT}),
    )
    .await;

    let reply = send(
        &router,
        authenticated(
            &session,
            "GET",
            "/api/internal/ping?work_type=thesis_master&period=year&faculty=",
        ),
    )
    .await;
    assert_eq!(reply.status, StatusCode::OK);

    // The row is there the moment the response is: the layer writes inline.
    let page = db::audit::list(&audit_pool, &db::audit::AuditFilter::default(), 10, 0)
        .await
        .expect("audit log is readable");
    assert_eq!(page.total, 1, "exactly one row per internal 2xx");
    let row = &page.rows[0];
    assert_eq!(row.role, "dean");
    assert_eq!(row.action, "view");
    assert_eq!(row.section, "ping", "the section is the route name");
    assert_eq!(
        row.filters,
        serde_json::json!({"period": "year", "work_type": "thesis_master"}),
        "filters are normalized: sorted keys, empty values dropped"
    );
    assert!(row.ip.is_some(), "the client address is recorded");

    // A rejected request is not a section view and is not journalled.
    get(&router, "/api/internal/ping")
        .await
        .problem(StatusCode::UNAUTHORIZED);
    let page = db::audit::list(&audit_pool, &db::audit::AuditFilter::default(), 10, 0)
        .await
        .expect("audit log is readable");
    assert_eq!(page.total, 1, "a 401 is not an access to journal");

    // Public reads are anonymous and are not journalled either.
    get(&router, "/api/public/summary").await;
    let page = db::audit::list(&audit_pool, &db::audit::AuditFilter::default(), 10, 0)
        .await
        .expect("audit log is readable");
    assert_eq!(page.total, 1, "the public contour writes no audit rows");
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_expired_session_no_longer_authenticates(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool.clone());
    let session = dev_login(
        &router,
        serde_json::json!({"sso_subject": "dean-03", "role": "compliance"}),
    )
    .await;

    sqlx::query("UPDATE sessions SET expires_at = now() - interval '1 minute'")
        .execute(&pool)
        .await?;

    send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

/// A deactivated account is closed out immediately, not at its next login.
#[sqlx::test(migrations = "../../migrations")]
async fn deactivating_a_user_closes_their_live_session(pool: PgPool) -> sqlx::Result<()> {
    let admin_pool = db::Pool::for_tests(pool.clone());
    let router = support::router(pool);
    let session = dev_login(
        &router,
        serde_json::json!({"sso_subject": "dean-04", "role": "compliance"}),
    )
    .await;
    let ping = send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await;
    assert_eq!(ping.status, StatusCode::OK);

    let user = db::users::by_sso_subject(&admin_pool, "dean-04")
        .await
        .expect("user lookup")
        .expect("the dev login created the user");
    db::users::set_active(&admin_pool, user.user.id, false)
        .await
        .expect("deactivation");

    send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

/// `APP_AUTH_MODE=oidc` is the production shape: `dev-login` does not exist and
/// `login` says plainly that the flow is not wired yet (slice W3.1).
#[sqlx::test(migrations = "../../migrations")]
async fn oidc_mode_hides_the_dev_login_and_answers_503_from_login(
    pool: PgPool,
) -> sqlx::Result<()> {
    let state = AppState::new(
        db::Pool::for_tests(pool),
        AppConfig {
            auth_mode: AuthMode::Oidc,
            ..AppConfig::new(
                "https://analytics.example.edu"
                    .parse()
                    .expect("absolute base URL"),
            )
        },
    );
    let router = api::build_router(state);

    let request = Request::builder()
        .method("POST")
        .uri("/api/auth/dev-login")
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(
            serde_json::json!({"sso_subject": "anyone", "role": "admin"}).to_string(),
        ))
        .expect("well formed");
    send(&router, request).await.problem(StatusCode::NOT_FOUND);

    // `oidc` mode with no `APP_OIDC_*` configuration: the flow exists but this
    // deployment has no provider, and the 503 names exactly what is missing
    // rather than saying «not implemented» (ADR-014 §1).
    let login = get(&router, "/api/auth/login").await;
    let problem = login.problem(StatusCode::SERVICE_UNAVAILABLE);
    assert!(
        problem["detail"]
            .as_str()
            .is_some_and(|detail| detail.contains("APP_OIDC_ISSUER")),
        "the 503 should name the missing configuration: {problem}"
    );
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_unknown_scope_code_is_a_field_error(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let request = Request::builder()
        .method("POST")
        .uri("/api/auth/dev-login")
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(
            serde_json::json!({
                "sso_subject": "dean-05",
                "role": "dean",
                "scope_faculty_code": "NO-SUCH-FACULTY",
            })
            .to_string(),
        ))
        .expect("well formed");

    let problem = send(&router, request)
        .await
        .problem(StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(
        problem["errors"][0]["field"],
        serde_json::json!("scope_faculty_code")
    );
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_unknown_route_is_a_problem_document(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    get(&router, "/api/internal/does-not-exist")
        .await
        .problem(StatusCode::NOT_FOUND);
    Ok(())
}
