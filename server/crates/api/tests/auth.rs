//! Slice W1.6 gates: session authentication, RBAC scope, CSRF and the audit
//! trail (ARCHITECTURE.md §4.2, TZ §5, §6.3), over the local accounts of
//! ADR-017.

mod support;

use api::auth::password;
use api::layers::rate_limit::RateLimitConfig;
use api::state::{AppConfig, AppState};
use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use serde_json::json;
use sqlx::PgPool;
use support::{TEST_PASSWORD, authenticated, get, login_request, mutating, send};

/// The sentinel unit migration 0002 guarantees, so these tests need no
/// dictionary fixture.
const SENTINEL_UNIT: &str = "UNASSIGNED";

#[sqlx::test(migrations = "../../migrations")]
async fn an_unauthenticated_internal_request_is_401(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    let reply = get(&router, "/api/internal/ping").await;
    let problem = reply.problem(StatusCode::UNAUTHORIZED);
    assert_eq!(problem["instance"], json!("/api/internal/ping"));
    assert_eq!(problem["type"], json!("/problems/unauthorized"));

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
    let session = router.sign_in(json!({"username": "newcomer"})).await;

    // The session itself is valid - `/me` answers - but nothing internal opens.
    let me = send(&router, authenticated(&session, "GET", "/api/auth/me")).await;
    assert_eq!(me.status, StatusCode::OK);
    assert_eq!(me.json()["username"], json!("newcomer"));
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
    let session = router
        .sign_in(json!({"username": "lecturer", "role": "staff"}))
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
async fn the_sign_in_flow_works_end_to_end(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = router
        .sign_in(json!({
            "username": "dean-01",
            "role": "dean",
            "scope_faculty_code": SENTINEL_UNIT,
        }))
        .await;
    assert!(
        session.cookie.starts_with("np_session="),
        "{}",
        session.cookie
    );
    assert_eq!(session.csrf_token.len(), 64, "32 bytes, hex encoded");
    // The sign-in body is the same document `/me` serves, so the client needs
    // no second round trip to learn what it may do.
    assert_eq!(session.body["role"], json!("dean"));
    assert_eq!(session.body["scope"]["kind"], json!("faculty"));

    // The cookie carries every attribute ARCHITECTURE.md §4.2 requires.
    let set_cookie = send(&router, login_request("dean-01", TEST_PASSWORD))
        .await
        .header(header::SET_COOKIE)
        .expect("login sets a cookie");
    for attribute in ["HttpOnly", "Secure", "SameSite=Lax", "Path=/"] {
        assert!(set_cookie.contains(attribute), "{set_cookie}");
    }

    // /me reports the grant and the scope it collapses to.
    let me = send(&router, authenticated(&session, "GET", "/api/auth/me")).await;
    assert_eq!(me.status, StatusCode::OK);
    assert_eq!(me.json()["username"], json!("dean-01"));
    assert_eq!(me.json()["role"], json!("dean"));
    assert_eq!(me.json()["scope"]["kind"], json!("faculty"));
    assert_eq!(me.json()["csrf_token"], json!(session.csrf_token));

    // The scoped internal endpoint answers with the same scope.
    let ping = send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await;
    assert_eq!(ping.status, StatusCode::OK);
    assert_eq!(ping.json()["role"], json!("dean"));
    assert_eq!(ping.json()["scope"]["kind"], json!("faculty"));
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
    // There is no identity provider to sign out of - the local session was all
    // there was, so the browser is simply sent back to the form (ADR-017 §2).
    assert_eq!(logout.json()["next_path"], json!("/login"));
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

/// Every way a sign-in can fail answers the same 401 with the same message.
///
/// Anything finer - "no such user" against "wrong password" - is an oracle for
/// which login names exist, and accounts here are named after real staff roles
/// (ADR-017 §4).
#[sqlx::test(migrations = "../../migrations")]
async fn every_sign_in_failure_is_the_same_answer(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    router
        .sign_in(json!({"username": "dean-06", "role": "compliance"}))
        .await;

    let refusals = [
        ("dean-06", "the-wrong-password"),
        ("nobody-at-all", TEST_PASSWORD),
        ("dean-06", ""),
    ];
    let mut details = Vec::new();
    for (username, secret) in refusals {
        let reply = send(&router, login_request(username, secret)).await;
        // An empty password is a 422 before anything is looked up; the other
        // two must be indistinguishable from each other.
        if secret.is_empty() {
            reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
            continue;
        }
        let problem = reply.problem(StatusCode::UNAUTHORIZED);
        details.push(problem["detail"].as_str().unwrap_or_default().to_owned());
        assert!(
            reply.header(header::SET_COOKIE).is_none(),
            "a refused sign-in must not set a cookie"
        );
    }
    assert_eq!(
        details.first(),
        details.last(),
        "a wrong password and an unknown name must be the same answer"
    );

    // An empty login name is a field error, not a lookup.
    let problem = send(&router, login_request("   ", TEST_PASSWORD))
        .await
        .problem(StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(problem["errors"][0]["field"], json!("username"));
    Ok(())
}

/// An account the CLI created with `--no-password` exists and may hold grants,
/// but nothing verifies against it.
#[sqlx::test(migrations = "../../migrations")]
async fn an_account_with_no_password_cannot_sign_in(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let user = db::users::create(router.pool(), "no-password", "n@test.invalid", "n", None)
        .await
        .expect("account creation");
    db::users::add_role(router.pool(), user.id, domain::RoleKind::Admin, None, None)
        .await
        .expect("role grant");

    for secret in [TEST_PASSWORD, "anything-at-all"] {
        send(&router, login_request("no-password", secret))
            .await
            .problem(StatusCode::UNAUTHORIZED);
    }

    // Setting one opens it, and only then.
    let hash = password::hash(TEST_PASSWORD).expect("hashing succeeds");
    db::users::set_password(router.pool(), user.id, Some(&hash))
        .await
        .expect("password set");
    let reply = send(&router, login_request("no-password", TEST_PASSWORD)).await;
    assert_eq!(reply.status, StatusCode::OK);
    Ok(())
}

/// A deactivated account is refused exactly like a wrong password, and its live
/// sessions die with it rather than at their next expiry.
#[sqlx::test(migrations = "../../migrations")]
async fn a_deactivated_account_is_closed_out_and_locked_out(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = router
        .sign_in(json!({"username": "dean-04", "role": "compliance"}))
        .await;
    let ping = send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await;
    assert_eq!(ping.status, StatusCode::OK);

    let user = db::users::by_username(router.pool(), "dean-04")
        .await
        .expect("user lookup")
        .expect("the sign-in created the user");
    db::users::set_active(router.pool(), user.user.id, false)
        .await
        .expect("deactivation");

    send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    send(&router, login_request("dean-04", TEST_PASSWORD))
        .await
        .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

/// Changing a password must not leave the old cookie working.
#[sqlx::test(migrations = "../../migrations")]
async fn setting_a_password_ends_the_accounts_sessions(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = router
        .sign_in(json!({"username": "dean-07", "role": "compliance"}))
        .await;
    let user = db::users::by_username(router.pool(), "dean-07")
        .await
        .expect("user lookup")
        .expect("the sign-in created the user");

    let hash = password::hash("a-completely-new-password").expect("hashing succeeds");
    db::users::set_password(router.pool(), user.user.id, Some(&hash))
        .await
        .expect("password set");

    send(
        &router,
        authenticated(&session, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    // The new one works, the old one does not.
    send(&router, login_request("dean-07", TEST_PASSWORD))
        .await
        .problem(StatusCode::UNAUTHORIZED);
    let reply = send(
        &router,
        login_request("dean-07", "a-completely-new-password"),
    )
    .await;
    assert_eq!(reply.status, StatusCode::OK);
    Ok(())
}

/// The login name is the account key, case-insensitively - `Admin` and `admin`
/// are one account, not two (migration 0006).
#[sqlx::test(migrations = "../../migrations")]
async fn the_login_name_is_matched_without_regard_to_case(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    router
        .sign_in(json!({"username": "Compliance-01", "role": "compliance"}))
        .await;

    let reply = send(&router, login_request("cOMPLIANCE-01", TEST_PASSWORD)).await;
    assert_eq!(reply.status, StatusCode::OK);
    // The stored spelling is what comes back, not the one that was typed.
    assert_eq!(reply.json()["username"], json!("Compliance-01"));

    assert!(
        db::users::create(
            router.pool(),
            "compliance-01",
            "c@test.invalid",
            "c",
            None
        )
        .await
        .is_err(),
        "a login name differing only in case must not be a second account"
    );
    Ok(())
}

/// Session fixation: a cookie planted before sign-in is dead afterwards.
#[sqlx::test(migrations = "../../migrations")]
async fn signing_in_rotates_away_the_presented_session(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let planted = router
        .sign_in(json!({"username": "victim", "role": "compliance"}))
        .await;

    // The attacker's cookie rides along on the sign-in request.
    let request = Request::builder()
        .method("POST")
        .uri("/api/auth/login")
        .header(header::CONTENT_TYPE, "application/json")
        .header(header::COOKIE, planted.cookie.clone())
        .body(Body::from(
            json!({"username": "victim", "password": TEST_PASSWORD}).to_string(),
        ))
        .expect("well formed");
    let reply = send(&router, request).await;
    assert_eq!(reply.status, StatusCode::OK);
    let fresh = reply
        .header(header::SET_COOKIE)
        .expect("a new session cookie");
    assert!(
        !fresh.contains(planted.cookie.trim_start_matches("np_session=")),
        "the new session must not be the planted one"
    );

    // The planted id no longer authenticates anything.
    send(
        &router,
        authenticated(&planted, "GET", "/api/internal/ping"),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);
    Ok(())
}

/// The sign-in endpoint is the one place a password is guessable, so it carries
/// its own, much tighter, bucket (ADR-017 §4).
#[sqlx::test(migrations = "../../migrations")]
async fn repeated_sign_in_attempts_are_throttled(pool: PgPool) -> sqlx::Result<()> {
    // That the shipped bucket is the tighter of the two is a fact about two
    // constants, so it is asserted as one - no clock involved.
    assert!(
        api::state::DEFAULT_LOGIN_RATE_LIMIT.burst < RateLimitConfig::default().burst,
        "the sign-in bucket must be tighter than the public one"
    );

    // The bucket exercised below is configured here rather than taken from the
    // default, because the default's refill rate and this test's runtime are
    // the same order of magnitude. At 15/min a token comes back every four
    // seconds, and a refused sign-in deliberately costs a full Argon2
    // verification - which in a debug build is slow enough that the bucket
    // refills faster than a loop can drain it. One token per minute makes the
    // refill irrelevant to a test that finishes in seconds, and what is under
    // test is the mechanism, not the two numbers already asserted above.
    const BURST: u32 = 3;
    let state = AppState::new(
        db::Pool::for_tests(pool),
        AppConfig {
            login_rate_limit: RateLimitConfig {
                burst: BURST,
                per_minute: 1,
            },
            ..support::config()
        },
    );
    let router = support::Harness::new(state);

    let mut throttled = None;
    for attempt in 0..=BURST {
        let reply = send(&router, login_request("nobody", "wrong-password-here")).await;
        if reply.status == StatusCode::TOO_MANY_REQUESTS {
            throttled = Some(attempt);
            assert!(
                reply.header(header::RETRY_AFTER).is_some(),
                "a throttled response says when to come back"
            );
            break;
        }
        assert_eq!(reply.status, StatusCode::UNAUTHORIZED);
    }
    assert_eq!(
        throttled,
        Some(BURST),
        "the bucket must empty after exactly {BURST} attempts"
    );
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_mutation_without_a_matching_csrf_token_is_403(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let session = router
        .sign_in(json!({"username": "compliance-02", "role": "compliance"}))
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

    let compliance = router
        .sign_in(json!({"username": "ethics-01", "role": "compliance"}))
        .await;
    // Compliance sees the whole internal contour…
    let ping = send(
        &router,
        authenticated(&compliance, "GET", "/api/internal/ping"),
    )
    .await;
    assert_eq!(ping.status, StatusCode::OK);
    assert_eq!(ping.json()["scope"]["kind"], json!("all"));
    // …but not the administrative area.
    send(
        &router,
        authenticated(&compliance, "GET", "/api/admin/ping"),
    )
    .await
    .problem(StatusCode::FORBIDDEN);

    let admin = router
        .sign_in(json!({"username": "admin-01", "role": "admin"}))
        .await;
    let reply = send(&router, authenticated(&admin, "GET", "/api/admin/ping")).await;
    assert_eq!(reply.status, StatusCode::OK);
    assert_eq!(reply.json()["username"], json!("admin-01"));
    Ok(())
}

/// TZ §6.3 / §10.6 - every internal read is journalled, with the filter state
/// it was made under.
#[sqlx::test(migrations = "../../migrations")]
async fn an_audit_row_is_written_for_every_internal_2xx(pool: PgPool) -> sqlx::Result<()> {
    let audit_pool = db::Pool::for_tests(pool.clone());
    let router = support::router(pool);
    let session = router
        .sign_in(json!({
            "username": "dean-02", "role": "dean", "scope_faculty_code": SENTINEL_UNIT,
        }))
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
        json!({"period": "year", "work_type": "thesis_master"}),
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
    let session = router
        .sign_in(json!({"username": "dean-03", "role": "compliance"}))
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

/// The endpoints the portal SSO flow used are gone, not merely disabled
/// (ADR-017 §1). A deployment that still holds their URLs gets a 404.
#[sqlx::test(migrations = "../../migrations")]
async fn the_retired_sso_endpoints_no_longer_exist(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    get(&router, "/api/auth/callback?code=x&state=y")
        .await
        .problem(StatusCode::NOT_FOUND);
    // `/api/auth/login` exists, but only as a POST: the SSO redirect is gone.
    get(&router, "/api/auth/login")
        .await
        .problem(StatusCode::METHOD_NOT_ALLOWED);

    let dev_login = Request::builder()
        .method("POST")
        .uri("/api/auth/dev-login")
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(json!({"sso_subject": "anyone"}).to_string()))
        .expect("well formed");
    send(&router, dev_login)
        .await
        .problem(StatusCode::NOT_FOUND);
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
