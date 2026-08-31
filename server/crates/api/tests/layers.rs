//! Slice W1.6 gates for the public-contour layer stack: the `KAnonymityGuard`,
//! RFC 7807 validation, caching validators, security headers and rate limiting.

mod support;

use api::layers::kanon::{self, Guarded, KAnonWitness};
use api::layers::rate_limit::RateLimitConfig;
use api::state::{AppConfig, AppState, AuthMode};
use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use axum::routing::get as route;
use axum::{Json, Router};
use compliance::KPolicy;
use serde_json::json;
use sqlx::PgPool;
use support::{get, send};

// ── KAnonymityGuard ─────────────────────────────────────────────────────────

/// A handler that never went through screening must not reach the client, even
/// though the JSON it produces looks perfectly ordinary.
#[tokio::test]
async fn the_guard_withholds_an_unscreened_response() {
    let router = Router::new()
        .route(
            "/api/public/leak",
            route(|| async { Json(json!({"checks": 3, "avg_originality": 71.8})) }),
        )
        .layer(axum::middleware::from_fn(kanon::guard));

    let reply = get(&router, "/api/public/leak").await;
    assert_eq!(reply.status, StatusCode::INTERNAL_SERVER_ERROR);
    assert!(
        !String::from_utf8_lossy(&reply.body).contains("71.8"),
        "the unscreened payload must not be forwarded: {}",
        String::from_utf8_lossy(&reply.body)
    );
}

/// A handler that screened against the wrong group size - the failure mode the
/// type system cannot catch, because `Screened` does not remember its `n`.
#[tokio::test]
async fn the_guard_withholds_a_value_screened_against_the_wrong_group() {
    let router = Router::new()
        .route(
            "/api/public/miscounted",
            route(|| async {
                let policy = KPolicy::default();
                let mut witness = KAnonWitness::new(policy);
                // The real group is three checks; the handler screened against
                // the period total and published the number.
                witness.field("/checks", 3);
                Guarded::new(json!({"checks": 3}), witness)
            }),
        )
        .layer(axum::middleware::from_fn(kanon::guard));

    let reply = get(&router, "/api/public/miscounted").await;
    assert_eq!(reply.status, StatusCode::INTERNAL_SERVER_ERROR);
}

/// A metric the handler published but never witnessed is caught by the sweep
/// over metric-shaped keys.
#[tokio::test]
async fn the_guard_withholds_a_metric_no_witness_covers() {
    let router = Router::new()
        .route(
            "/api/public/partial",
            route(|| async {
                let mut witness = KAnonWitness::new(KPolicy::default());
                witness.field("/checks", 900);
                Guarded::new(json!({"checks": 900, "escalated": 2}), witness)
            }),
        )
        .layer(axum::middleware::from_fn(kanon::guard));

    assert_eq!(
        get(&router, "/api/public/partial").await.status,
        StatusCode::INTERNAL_SERVER_ERROR
    );
}

/// The positive control: a correctly screened handler passes, and the internal
/// marker never reaches the wire.
#[tokio::test]
async fn the_guard_passes_a_correctly_screened_response() {
    let router = Router::new()
        .route(
            "/api/public/clean",
            route(|| async {
                let policy = KPolicy::default();
                let mut witness = KAnonWitness::new(policy);
                witness.field("/checks", 3);
                witness.field("/total", 900);
                Guarded::new(
                    json!({
                        "checks": policy.screen(3, 3),
                        "total": policy.screen(900, 900),
                    }),
                    witness,
                )
            }),
        )
        .layer(axum::middleware::from_fn(kanon::guard));

    let reply = get(&router, "/api/public/clean").await;
    assert_eq!(reply.status, StatusCode::OK);
    assert_eq!(reply.json()["checks"], json!("insufficient_data"));
    assert_eq!(reply.json()["total"], json!(900));
    assert!(
        reply.headers.get("x-kanon-checked").is_none(),
        "the marker is an internal assertion and must be stripped"
    );
}

/// Every real public endpoint carries the marker.
#[sqlx::test(migrations = "../../migrations")]
async fn every_public_endpoint_passes_the_guard(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    for path in [
        "/api/public/summary",
        "/api/public/timeseries",
        "/api/public/work-types",
        "/api/public/faculties",
        "/api/public/histogram",
        "/api/public/yoy",
        "/api/public/reports",
        "/api/public/status",
    ] {
        let reply = get(&router, path).await;
        assert_eq!(reply.status, StatusCode::OK, "{path}");
        assert!(reply.headers.get("x-kanon-checked").is_none(), "{path}");
    }
    Ok(())
}

// ── 422 problem documents ───────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn malformed_filters_are_422_with_field_detail(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    let cases: [(&str, &str); 5] = [
        ("/api/public/summary?from=15.10.2025", "from"),
        ("/api/public/summary?status=bogus", "status"),
        ("/api/public/summary?period=decade", "period"),
        ("/api/public/summary?from=2026-01-01&to=2025-01-01", "to"),
        // Department grain does not exist on the public contour (TZ §4.2 §4).
        ("/api/public/summary?department=DEP11", "department"),
    ];

    for (uri, field) in cases {
        let reply = get(&router, uri).await;
        let problem = reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
        assert_eq!(
            problem["type"],
            json!("/problems/validation-failed"),
            "{uri}"
        );
        let empty = Vec::new();
        let fields: Vec<&str> = problem["errors"]
            .as_array()
            .unwrap_or(&empty)
            .iter()
            .filter_map(|entry| entry["field"].as_str())
            .collect();
        assert!(
            fields.contains(&field),
            "{uri}: expected a field error on `{field}`, got {problem}"
        );
    }
    Ok(())
}

/// Every malformed parameter is reported, not just the first one.
///
/// Both parameters have to be **known** public ones: an unknown field is a
/// `serde` rejection that stops at the first offender, so a mixed pair would
/// prove nothing about `garde` collecting the rest.
#[sqlx::test(migrations = "../../migrations")]
async fn all_malformed_parameters_are_reported_at_once(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let reply = get(&router, "/api/public/summary?from=nope&period=decade").await;
    let problem = reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
    let fields: Vec<&str> = problem["errors"]
        .as_array()
        .map(|errors| {
            errors
                .iter()
                .filter_map(|entry| entry["field"].as_str())
                .collect()
        })
        .unwrap_or_default();
    assert_eq!(fields.len(), 2, "{problem}");
    assert!(fields.contains(&"from"), "{problem}");
    assert!(fields.contains(&"period"), "{problem}");
    Ok(())
}

// ── caching validators ──────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn public_responses_carry_cache_control_and_a_strong_etag(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    let first = get(&router, "/api/public/summary?period=year").await;
    assert_eq!(first.status, StatusCode::OK);
    assert_eq!(
        first.header(header::CACHE_CONTROL).as_deref(),
        Some("public, max-age=3600")
    );
    let etag = first
        .header(header::ETAG)
        .expect("public responses carry an ETag");
    assert!(etag.starts_with('"') && etag.ends_with('"'), "{etag}");

    // The same request yields the same validator…
    let again = get(&router, "/api/public/summary?period=year").await;
    assert_eq!(again.header(header::ETAG).as_deref(), Some(etag.as_str()));

    // …and a conditional request is answered 304 with no body.
    let conditional = Request::builder()
        .uri("/api/public/summary?period=year")
        .header(header::IF_NONE_MATCH, &etag)
        .body(Body::empty())
        .expect("well formed");
    let not_modified = send(&router, conditional).await;
    assert_eq!(not_modified.status, StatusCode::NOT_MODIFIED);
    assert!(not_modified.body.is_empty());
    assert_eq!(
        not_modified.header(header::ETAG).as_deref(),
        Some(etag.as_str())
    );

    // A stale validator gets the full body back.
    let stale = Request::builder()
        .uri("/api/public/summary?period=year")
        .header(header::IF_NONE_MATCH, "\"stale\"")
        .body(Body::empty())
        .expect("well formed");
    assert_eq!(send(&router, stale).await.status, StatusCode::OK);

    // Different filters are a different resource.
    let other = get(&router, "/api/public/summary?period=month").await;
    assert_ne!(other.header(header::ETAG).as_deref(), Some(etag.as_str()));
    Ok(())
}

/// An error is not a cacheable representation.
#[sqlx::test(migrations = "../../migrations")]
async fn a_rejected_request_carries_no_validator(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let reply = get(&router, "/api/public/summary?status=bogus").await;
    reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(reply.header(header::ETAG), None);
    assert_eq!(reply.header(header::CACHE_CONTROL), None);
    Ok(())
}

// ── security headers ────────────────────────────────────────────────────────

/// TZ §8 requires the public widget to be embeddable **on the portal**; the
/// internal contour must never be framed (`auth.rs` asserts the other half).
///
/// W2.5 replaced the original `frame-ancestors *` with the pinned origin list,
/// so an unconfigured deployment publishes the portal origins and nothing
/// wider (ADR-012 §9).
#[sqlx::test(migrations = "../../migrations")]
async fn the_public_contour_is_embeddable_by_the_portal_and_still_hardened(
    pool: PgPool,
) -> sqlx::Result<()> {
    let router = support::router(pool);
    let reply = get(&router, "/api/public/summary").await;

    assert_eq!(
        reply.header(header::X_CONTENT_TYPE_OPTIONS).as_deref(),
        Some("nosniff")
    );
    assert_eq!(
        reply.header(header::REFERRER_POLICY).as_deref(),
        Some("no-referrer")
    );
    let csp = reply
        .header(header::CONTENT_SECURITY_POLICY)
        .expect("public responses carry a CSP");
    assert_eq!(
        csp,
        format!(
            "default-src 'none'; frame-ancestors {}",
            api::layers::security::DEFAULT_FRAME_ANCESTORS
        ),
        "the default policy pins the portal origins"
    );
    assert!(
        !csp.contains("frame-ancestors *"),
        "any origin may no longer frame the public contour: {csp}"
    );
    assert_eq!(
        reply.header(header::X_FRAME_OPTIONS),
        None,
        "X-Frame-Options would override the embeddable CSP"
    );
    Ok(())
}

/// The origin list is a deployment decision (`APP_EMBED_FRAME_ANCESTORS`), so a
/// second portal host is configuration rather than a release. Driven through
/// `AppConfig` rather than through the process environment, which is shared by
/// every test in this binary.
#[sqlx::test(migrations = "../../migrations")]
async fn a_configured_frame_ancestors_list_is_honoured(pool: PgPool) -> sqlx::Result<()> {
    let state = AppState::new(
        db::Pool::for_tests(pool),
        AppConfig {
            auth_mode: AuthMode::Dev,
            embed_frame_ancestors: "'self' https://portal.example.edu".to_owned(),
            ..AppConfig::new("http://localhost:8080".parse().expect("absolute"))
        },
    );
    let router = api::build_router(state);

    let reply = get(&router, "/api/public/status").await;
    assert_eq!(reply.status, StatusCode::OK);
    assert_eq!(
        reply.header(header::CONTENT_SECURITY_POLICY).as_deref(),
        Some("default-src 'none'; frame-ancestors 'self' https://portal.example.edu")
    );
    Ok(())
}

/// A value that cannot become a header - here one smuggling a second directive
/// - falls back to the documented default instead of publishing a policy nobody
/// chose, and never widens to `*`.
#[sqlx::test(migrations = "../../migrations")]
async fn an_unusable_frame_ancestors_value_falls_back_to_the_default(
    pool: PgPool,
) -> sqlx::Result<()> {
    let state = AppState::new(
        db::Pool::for_tests(pool),
        AppConfig {
            auth_mode: AuthMode::Dev,
            embed_frame_ancestors: "*; script-src 'unsafe-inline'".to_owned(),
            ..AppConfig::new("http://localhost:8080".parse().expect("absolute"))
        },
    );
    let router = api::build_router(state);

    let reply = get(&router, "/api/public/status").await;
    assert_eq!(
        reply.header(header::CONTENT_SECURITY_POLICY).as_deref(),
        Some(
            format!(
                "default-src 'none'; frame-ancestors {}",
                api::layers::security::DEFAULT_FRAME_ANCESTORS
            )
            .as_str()
        )
    );
    Ok(())
}

/// The authenticated contours are unaffected by the public origin pin.
#[sqlx::test(migrations = "../../migrations")]
async fn the_internal_contour_is_never_framable(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    // Unauthenticated is enough: the security headers are outside the session
    // layer, so even the 401 carries them.
    let reply = get(&router, "/api/internal/summary").await;
    assert_eq!(reply.status, StatusCode::UNAUTHORIZED);
    assert_eq!(
        reply.header(header::CONTENT_SECURITY_POLICY).as_deref(),
        Some("default-src 'none'; frame-ancestors 'none'")
    );
    assert_eq!(
        reply.header(header::X_FRAME_OPTIONS).as_deref(),
        Some("DENY")
    );
    Ok(())
}

// ── rate limiting ───────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn the_public_contour_is_rate_limited_per_client(pool: PgPool) -> sqlx::Result<()> {
    let state = AppState::new(
        db::Pool::for_tests(pool),
        AppConfig {
            auth_mode: AuthMode::Dev,
            public_rate_limit: RateLimitConfig {
                burst: 2,
                per_minute: 1,
            },
            ..AppConfig::new("http://localhost:8080".parse().expect("absolute"))
        },
    );
    let router = api::build_router(state);

    assert_eq!(
        get(&router, "/api/public/status").await.status,
        StatusCode::OK
    );
    assert_eq!(
        get(&router, "/api/public/status").await.status,
        StatusCode::OK
    );

    let limited = get(&router, "/api/public/status").await;
    let problem = limited.problem(StatusCode::TOO_MANY_REQUESTS);
    assert_eq!(problem["type"], json!("/problems/rate-limited"));
    assert!(
        limited.header(header::RETRY_AFTER).is_some(),
        "a 429 must tell the client when to come back"
    );

    // A different address has its own bucket.
    let other_client = Request::builder()
        .uri("/api/public/status")
        .header("x-forwarded-for", "203.0.113.7")
        .body(Body::empty())
        .expect("well formed");
    assert_eq!(send(&router, other_client).await.status, StatusCode::OK);
    Ok(())
}

// ── probes ──────────────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn the_probes_stay_unlayered(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);

    let health = get(&router, "/healthz").await;
    assert_eq!(health.status, StatusCode::OK);
    assert_eq!(health.json()["status"], json!("ok"));
    assert_eq!(health.header(header::CACHE_CONTROL), None);
    assert_eq!(health.header(header::ETAG), None);

    let ready = get(&router, "/readyz").await;
    assert_eq!(ready.status, StatusCode::OK);
    assert_eq!(ready.json()["status"], json!("ready"));
    Ok(())
}
