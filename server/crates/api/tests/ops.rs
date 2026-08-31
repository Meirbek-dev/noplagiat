//! Slice W4.5 (api side) - `/metrics`, `/readyz` freshness, and the promise
//! that authentication never writes an address into a log line
//! (ARCHITECTURE.md §8).

mod support;

use axum::http::{StatusCode, header};
use serde_json::json;
use sqlx::PgPool;
use support::{authenticated, get, send};

/// Every metric name ARCHITECTURE.md §8 and ADR-014 §8 ask for - all eight, so
/// a metric silently dropped from the exposition fails here.
const REQUIRED_METRICS: [&str; 8] = [
    "http_request_duration_seconds",
    "http_requests_total",
    "ingest_batches_total",
    "ingest_rows_rejected_total",
    "ingest_rows_upserted_total",
    "ingest_last_success_age_seconds",
    "suppression_screened_cells_total",
    "audit_write_failures_total",
];

#[sqlx::test(migrations = "../../migrations")]
async fn the_scrape_carries_every_declared_metric(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_warehouse(&pool)
        .await
        .expect("the fixture warehouse loads");
    let router = support::Harness::new(support::state_from(pool));

    // Traffic on three contours, so the label set is non-trivial.
    get(&router, "/api/public/summary?from=2023-09-01&to=2026-08-31").await;
    get(
        &router,
        "/api/public/faculties?from=2023-09-01&to=2026-08-31",
    )
    .await;
    get(&router, "/api/internal/ping").await;

    let scrape = get(&router, "/metrics").await;
    assert_eq!(scrape.status, StatusCode::OK);
    assert!(
        scrape
            .header(header::CONTENT_TYPE)
            .is_some_and(|value| value.starts_with("text/plain; version=0.0.4")),
        "a Prometheus scrape has its own media type"
    );
    let body = String::from_utf8_lossy(&scrape.body).into_owned();

    for name in REQUIRED_METRICS {
        assert!(body.contains(&format!("# HELP {name} ")), "{name}: {body}");
        assert!(body.contains(&format!("# TYPE {name} ")), "{name}");
    }

    // The label is the matched route, never the request URI, so a filter value
    // can never become a label value.
    assert!(
        body.contains("route=\"/api/public/summary\""),
        "the matched route should be the label: {body}"
    );
    assert!(
        !body.contains("2023-09-01"),
        "a filter value must never reach a metric label: {body}"
    );
    assert!(
        body.contains("contour=\"public\"") && body.contains("contour=\"internal\""),
        "both contours should be represented"
    );
    // The unauthenticated internal ping is a 4xx, and it is counted as one.
    assert!(body.contains("status=\"4xx\""), "{body}");
    Ok(())
}

/// The suppression counter moves when the policy actually hides something.
#[sqlx::test(migrations = "../../migrations")]
async fn the_suppression_counter_tracks_withheld_cells(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_warehouse(&pool)
        .await
        .expect("the fixture warehouse loads");
    db::settings::set(&pool, "k_threshold", &json!(10_000_000), Some("test"))
        .await
        .expect("k is stored");
    let router = support::Harness::new(support::state_from(pool));

    let before = screened_cells(&router).await;
    get(&router, "/api/public/summary?from=2023-09-01&to=2026-08-31").await;
    let after = screened_cells(&router).await;
    assert!(
        after > before,
        "every cell of that response was withheld, so the counter must move \
         ({before} → {after})"
    );
    Ok(())
}

async fn screened_cells(router: &axum::Router) -> u64 {
    let body = String::from_utf8_lossy(&get(router, "/metrics").await.body).into_owned();
    body.lines()
        .find_map(|line| line.strip_prefix("suppression_screened_cells_total "))
        .and_then(|value| value.trim().parse().ok())
        .unwrap_or_default()
}

/// A warehouse that has never been fed is **ready** - a fresh install must not
/// be held out of its own load balancer (ARCHITECTURE.md §8).
#[sqlx::test(migrations = "../../migrations")]
async fn readiness_treats_an_empty_warehouse_as_fresh(pool: PgPool) -> sqlx::Result<()> {
    let router = support::router(pool);
    let reply = get(&router, "/readyz").await;
    assert_eq!(reply.status, StatusCode::OK);
    let body = reply.json();
    assert_eq!(body["status"], json!("ready"));
    assert_eq!(
        body["ingest_age_seconds"],
        serde_json::Value::Null,
        "no succeeded batch exists, so there is no age to report"
    );

    // The scrape says the same thing in its own vocabulary: every gauge is
    // present on a warehouse that has never been fed, the age carrying the
    // documented `-1` sentinel rather than being omitted (ADR-014 §8).
    let scrape = String::from_utf8_lossy(&get(&router, "/metrics").await.body).into_owned();
    for name in REQUIRED_METRICS {
        assert!(
            scrape.contains(&format!("# TYPE {name} ")),
            "{name}: {scrape}"
        );
    }
    assert!(
        scrape.contains("\ningest_last_success_age_seconds -1\n"),
        "a warehouse that was never fed reports -1, not 0: {scrape}"
    );
    assert!(
        scrape.contains("\ningest_rows_upserted_total 0\n"),
        "the upsert counter is emitted even at zero: {scrape}"
    );
    Ok(())
}

/// A warehouse whose newest succeeded batch is older than the budget is
/// degraded: it still serves, but `/readyz` says `503`.
#[sqlx::test(migrations = "../../migrations")]
async fn readiness_degrades_when_the_newest_batch_is_stale(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    let router = support::Harness::new(support::state_from(pool.clone()));

    // A fresh batch keeps it ready.
    let id = db::batches::start(&pool, "fixture", db::batches::Mode::Csv)
        .await
        .expect("a batch opens");
    db::batches::finish(
        &pool,
        id,
        &db::batches::BatchOutcome {
            rows_read: 10,
            rows_upserted: 10,
            rows_rejected: 0,
            rows_skipped_deleted: 0,
            errors: json!([]),
            status: db::batches::BatchStatus::Succeeded,
        },
    )
    .await
    .expect("the batch closes");

    let reply = get(&router, "/readyz").await;
    assert_eq!(reply.status, StatusCode::OK);
    assert_eq!(reply.json()["status"], json!("ready"));
    assert!(
        reply.json()["ingest_age_seconds"]
            .as_i64()
            .is_some_and(|age| age < 60)
    );

    // Age it past the 26-hour budget.
    sqlx::query("UPDATE ingest_batches SET finished_at = now() - interval '30 hours'")
        .execute(&*pool)
        .await
        .expect("the batch is aged");

    let reply = get(&router, "/readyz").await;
    assert_eq!(reply.status, StatusCode::SERVICE_UNAVAILABLE);
    let body = reply.json();
    assert_eq!(body["status"], json!("ingest_stale"));
    assert!(
        body["ingest_age_seconds"]
            .as_i64()
            .is_some_and(|age| age > 26 * 3600)
    );
    assert_eq!(body["ingest_max_age_seconds"], json!(26 * 3600));

    // A batch that *failed* does not count as freshness.
    let id = db::batches::start(&pool, "fixture", db::batches::Mode::Csv)
        .await
        .expect("a batch opens");
    db::batches::finish(
        &pool,
        id,
        &db::batches::BatchOutcome {
            rows_read: 0,
            rows_upserted: 0,
            rows_rejected: 3,
            rows_skipped_deleted: 0,
            errors: json!([{"index": 1, "kind": "header_mismatch"}]),
            status: db::batches::BatchStatus::Failed,
        },
    )
    .await
    .expect("the batch closes");
    let reply = get(&router, "/readyz").await;
    assert_eq!(
        reply.status,
        StatusCode::SERVICE_UNAVAILABLE,
        "a failed run does not make the warehouse fresh"
    );

    // The ingest gauges reach the scrape.
    let body = String::from_utf8_lossy(&get(&router, "/metrics").await.body).into_owned();
    assert!(body.contains("ingest_batches_total 2"), "{body}");
    assert!(body.contains("ingest_rows_rejected_total 3"), "{body}");
    Ok(())
}

/// The probes and the scrape carry no session, no rate limit and no audit row.
#[sqlx::test(migrations = "../../migrations")]
async fn the_operational_endpoints_stay_unlayered(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    let router = support::Harness::new(support::state_from(pool.clone()));

    for path in ["/healthz", "/readyz", "/metrics"] {
        let reply = get(&router, path).await;
        assert!(reply.status.is_success(), "{path}: {}", reply.status);
        assert_eq!(
            reply.header(header::CONTENT_SECURITY_POLICY),
            None,
            "{path} is not part of a contour"
        );
    }

    assert_eq!(
        db::audit::list(&pool, &db::audit::AuditFilter::default(), 10, 0)
            .await
            .expect("the audit log reads")
            .total,
        0,
        "an operational probe is not a section view"
    );
    Ok(())
}

/// ARCHITECTURE.md §8: «request spans carry route, user role (never subject or
/// e-mail in public logs)». The structural half of that promise is that the
/// authenticated identity a handler reports is the opaque subject and the
/// numeric user id - never the address stored on the account.
#[sqlx::test(migrations = "../../migrations")]
async fn authentication_never_surfaces_an_address(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("dictionaries load");
    let router = support::Harness::new(support::state_from(pool.clone()));
    let session = router.sign_in(
        json!({"username": "compliance-logs", "role": "compliance"}),
    )
    .await;

    for path in ["/api/auth/me", "/api/internal/ping"] {
        let reply = send(&router, authenticated(&session, "GET", path)).await;
        assert_eq!(reply.status, StatusCode::OK);
        let body = String::from_utf8_lossy(&reply.body);
        assert!(
            !body.contains('@'),
            "{path} must not carry an address: {body}"
        );
    }

    // The audit row identifies the actor by user id and role, never by address.
    let rows = db::audit::list(&pool, &db::audit::AuditFilter::default(), 10, 0)
        .await
        .expect("the audit log reads")
        .rows;
    assert!(!rows.is_empty());
    for row in rows {
        assert!(row.user_id > 0);
        assert!(
            !serde_json::to_string(&row.filters)
                .unwrap_or_default()
                .contains('@'),
            "an audit row must not carry an address"
        );
    }

    // The one place an address legitimately lives is the administrative roles
    // screen (TZ §6.1 exempts service accounts), and it is admin-only.
    let admin = router
        .sign_in(json!({"username": "root", "role": "admin"}))
        .await;
    let roles = send(&router, authenticated(&admin, "GET", "/api/admin/roles")).await;
    assert_eq!(roles.status, StatusCode::OK);
    assert!(
        String::from_utf8_lossy(&roles.body).contains(&support::test_email("root")),
        "the roles screen is the one place an address legitimately appears"
    );
    Ok(())
}
