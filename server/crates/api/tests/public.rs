//! Slice W2.1 gates - **acceptance evidence for TZ §10.1 and §10.4 on the
//! public contour**, as ADR-016 redefined it.
//!
//! Every public endpoint is driven over HTTP against the 60 000-row fixture and
//! compared with the `public_*` blocks of `fixtures/expected.json`, which
//! `fixtures/expected.ts` computes by brute force with no SQL and no server
//! code (fixtures/README.md "Independence"). Those blocks are the **released
//! cube**: sums over `(month, faculty, work type)` cells holding at least `k`
//! checks, over a window snapped to whole months. The raw `summary`/`units`
//! blocks in the same file are what the *internal* contour publishes, and
//! `tests/internal.rs` still checks against those - the two differ on purpose,
//! and by exactly the withheld cells.
//!
//! Counts must match exactly; means are compared within half of the last
//! published digit, because `expected.json` rounds to 4 dp.
//!
//! Loading the fixture takes several seconds, so the whole scenario matrix runs
//! inside one `#[sqlx::test]` database.

// `server/clippy.toml` allows `expect` in `#[test]` functions but not in the
// helpers below them. A malformed fixture must abort the test loudly; none of
// this is a request path, which is what the workspace lint protects.
#![expect(
    clippy::expect_used,
    reason = "test assertions: a malformed fixture must abort the test"
)]

mod support;

use api::state::{AppConfig, AppState, AuthMode};
use axum::http::StatusCode;
use serde_json::{Value, json};
use sqlx::PgPool;
use support::{
    assert_suppressed, assert_visible_close, assert_visible_int, expected_json, get, public_query,
    scenario,
};

/// Find one item of a `/work-types` or `/faculties` response by its code.
fn item<'a>(body: &'a Value, code: &str) -> &'a Value {
    body["items"]
        .as_array()
        .expect("a breakdown carries an item array")
        .iter()
        .find(|item| item["code"] == json!(code))
        .unwrap_or_else(|| panic!("no `{code}` in {body}"))
}

/// A published row of the closure expectation: `checks = 0` means the group had
/// no released cell, so the wire carries the marker instead of a number.
fn assert_row(context: &str, got: &Value, want: &Value) {
    let checks = want["checks"].as_i64().expect("expected count");
    if checks == 0 {
        assert_suppressed(&format!("{context}: checks"), &got["checks"]);
        assert_suppressed(&format!("{context}: avg"), &got["avg_originality"]);
        return;
    }
    assert_visible_int(&format!("{context}: checks"), &got["checks"], checks);
    assert_visible_close(
        &format!("{context}: avg"),
        &got["avg_originality"],
        want["avg_originality"].as_f64().expect("expected mean"),
    );
}

/// Every rolled-up view of one filter withholds the same cells, so the counter
/// is the same number on every endpoint.
fn assert_suppressed_groups(context: &str, body: &Value, want: i64) {
    assert_eq!(
        body["suppressed_groups"].as_i64(),
        Some(want),
        "{context}: suppressed_groups"
    );
}

#[sqlx::test(migrations = "../../migrations")]
async fn public_endpoints_reproduce_the_fixture_closure(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);
    let expected = expected_json();

    for name in [
        "all-time-no-filter",
        "academic-year-2025-2026",
        // A ragged range: the public contour widens it to Oct 1 – Nov 30, and
        // the expectation is computed over that window, not the requested one.
        "custom-range-crossing-month",
    ] {
        let scenario = scenario(&expected, name);
        let query = public_query(&scenario);
        let want_summary = &scenario["public_summary"];
        let suppressed = want_summary["suppressed_groups"]
            .as_i64()
            .expect("expected suppressed-group count");

        // ── §1 summary ──────────────────────────────────────────────────────
        let reply = get(&router, &format!("/api/public/summary?{query}")).await;
        assert_eq!(reply.status, StatusCode::OK, "{name}");
        let body = reply.json();
        assert_eq!(
            body["period"]["from"], scenario["public_filters"]["from"],
            "{name}: the response echoes the *snapped* period"
        );
        assert_eq!(
            body["period"]["to"], scenario["public_filters"]["to"],
            "{name}: the response echoes the *snapped* period"
        );
        assert_eq!(body["k_threshold"], json!(5), "{name}");
        assert_suppressed_groups(name, &body, suppressed);
        assert_visible_int(
            &format!("{name}: summary.total_checks"),
            &body["total_checks"],
            want_summary["checks"].as_i64().expect("expected count"),
        );
        assert_visible_close(
            &format!("{name}: summary.avg_originality"),
            &body["avg_originality"],
            want_summary["avg_originality"]
                .as_f64()
                .expect("expected mean"),
        );
        assert_visible_int(
            &format!("{name}: summary.below_threshold"),
            &body["below_threshold"],
            want_summary["below_threshold"]
                .as_i64()
                .expect("expected count"),
        );
        assert_visible_close(
            &format!("{name}: summary.below_threshold_share"),
            &body["below_threshold_share"],
            want_summary["below_threshold_share"]
                .as_f64()
                .expect("expected share"),
        );
        assert_visible_int(
            &format!("{name}: summary.escalated"),
            &body["escalated"],
            want_summary["escalated"]
                .as_i64()
                .expect("expected escalation count"),
        );
        // TZ §4.2 §1 «при наличии данных»: the fixture supplies no registrar
        // denominators, so the coverage KPI is absent rather than zero.
        assert_eq!(body["coverage"], Value::Null, "{name}");
        // The comparison window is the same calendar months one year earlier.
        assert_eq!(
            body["previous"]["period"]["to"].as_str(),
            Some(
                scenario["public_filters"]["to"]
                    .as_str()
                    .map(shift_year)
                    .expect("scenario end date")
                    .as_str()
            ),
            "{name}"
        );

        // ── §2 dynamics ─────────────────────────────────────────────────────
        let body = get(&router, &format!("/api/public/timeseries?{query}"))
            .await
            .json();
        assert_suppressed_groups(name, &body, suppressed);
        let want_months = scenario["public_timeseries"]
            .as_array()
            .expect("a scenario carries closure monthly rows");
        let months = body["months"].as_array().expect("months array");
        assert_eq!(months.len(), want_months.len(), "{name}: month count");
        for (got, want) in months.iter().zip(want_months) {
            assert_eq!(got["month"], want["month"], "{name}");
            assert_row(&format!("{name}: timeseries {}", want["month"]), got, want);
        }

        // ── §3 work types ───────────────────────────────────────────────────
        let body = get(&router, &format!("/api/public/work-types?{query}"))
            .await
            .json();
        assert_suppressed_groups(name, &body, suppressed);
        let want_types = scenario["public_work_types"]
            .as_array()
            .expect("closure work-type rows");
        assert_eq!(
            body["items"].as_array().map(Vec::len),
            Some(want_types.len()),
            "{name}"
        );
        for want in want_types {
            let code = want["code"].as_str().expect("work type has a code");
            let got = item(&body, code);
            assert_row(&format!("{name}: work_types {code}"), got, want);
            // Dictionary labels ride along so the UI needs no second call.
            assert!(got["name_ru"].as_str().is_some_and(|n| !n.is_empty()));
        }
        assert_closure_total(name, &body, want_summary);

        // ── §4 faculties (aggregate grain only) ─────────────────────────────
        let body = get(&router, &format!("/api/public/faculties?{query}"))
            .await
            .json();
        assert_suppressed_groups(name, &body, suppressed);
        let want_faculties = scenario["public_faculties"]
            .as_array()
            .expect("closure faculty rows");
        assert_eq!(
            body["items"].as_array().map(Vec::len),
            Some(want_faculties.len()),
            "{name}"
        );
        for want in want_faculties {
            let code = want["code"].as_str().expect("faculty has a code");
            assert_row(
                &format!("{name}: faculties {code}"),
                item(&body, code),
                want,
            );
        }
        assert_closure_total(name, &body, want_summary);
        // No department ever appears on the public contour (TZ §4.2 §4).
        let rendered = body.to_string();
        assert!(
            !rendered.contains("DEP"),
            "{name}: a department code leaked into a public response"
        );

        // ── §5 histogram ────────────────────────────────────────────────────
        let body = get(&router, &format!("/api/public/histogram?{query}"))
            .await
            .json();
        assert_eq!(body["boundaries"], json!([50, 70, 85, 95]), "{name}");
        assert_suppressed_groups(name, &body, suppressed);
        let want_bands = &scenario["public_histogram"];
        let total = want_bands["total"].as_i64().expect("closure band total");
        assert_visible_int(&format!("{name}: histogram total"), &body["total"], total);
        let buckets = body["buckets"].as_array().expect("bucket array");
        assert_eq!(buckets.len(), 5, "{name}");
        let mut summed = 0_i64;
        for (bucket, key) in buckets
            .iter()
            .zip(["lt50", "b50_70", "b70_85", "b85_95", "ge95"])
        {
            let want = want_bands[key].as_i64().expect("closure band count");
            summed += want;
            assert_visible_int(&format!("{name}: histogram {key}"), &bucket["checks"], want);
            assert_visible_close(
                &format!("{name}: histogram {key} share"),
                &bucket["share"],
                exact_ratio4(want, total),
            );
        }
        assert_eq!(summed, total, "{name}: the bands must partition the total");

        // ── §9 year over year ───────────────────────────────────────────────
        let body = get(&router, &format!("/api/public/yoy?{query}"))
            .await
            .json();
        assert_suppressed_groups(name, &body, suppressed);
        let want_years = scenario["public_yoy"].as_array().expect("closure yoy rows");
        let years = body["years"].as_array().expect("years array");
        assert_eq!(years.len(), want_years.len(), "{name}");
        for (got, want) in years.iter().zip(want_years) {
            assert_eq!(got["academic_year"], want["academic_year"], "{name}");
            assert_row(&format!("{name}: yoy {}", want["academic_year"]), got, want);
        }
        assert_closure_total(name, &body, want_summary);
    }

    // A filter reaches SQL rather than being applied after the fact, and it
    // selects a *subset of the same cells* - which is what makes the margins
    // close (ADR-016 §2).
    let filtered = scenario(&expected, "faculty-fac03-worktype-course");
    let body = get(
        &router,
        &format!("/api/public/summary?{}", public_query(&filtered)),
    )
    .await
    .json();
    assert_visible_int(
        "faculty-fac03-worktype-course: summary.total_checks",
        &body["total_checks"],
        filtered["public_summary"]["checks"].as_i64().unwrap_or(-1),
    );

    // No published snapshots in the fixture, so `/reports` is empty rather than
    // absent - and it exposes no filesystem path.
    let reports = get(&router, "/api/public/reports").await.json();
    assert_eq!(reports["items"], json!([]));
    Ok(())
}

/// The grand total of a breakdown is the same number `/summary` publishes, to
/// the last decimal - one cube, one rounding (ADR-016 §2).
fn assert_closure_total(name: &str, body: &Value, want_summary: &Value) {
    assert_visible_int(
        &format!("{name}: breakdown total checks"),
        &body["total"]["checks"],
        want_summary["checks"].as_i64().unwrap_or(-1),
    );
    assert_visible_close(
        &format!("{name}: breakdown total avg"),
        &body["total"]["avg_originality"],
        want_summary["avg_originality"].as_f64().unwrap_or(-1.0),
    );
}

/// The published-share arithmetic, in integers - the same rule as
/// `fixtures/rules.ts::ratio4` and `api::dto::ratio4`.
fn exact_ratio4(numerator: i64, denominator: i64) -> f64 {
    if denominator == 0 {
        return 0.0;
    }
    let scaled = numerator * 10_000;
    let quotient = scaled.div_euclid(denominator);
    let remainder = scaled.rem_euclid(denominator);
    let rounded = if remainder * 2 >= denominator {
        quotient + 1
    } else {
        quotient
    };
    #[expect(clippy::cast_precision_loss, reason = "fixture counts are small")]
    let value = rounded as f64;
    value / 10_000.0
}

/// `2026-08-31` → `2025-08-31`: the comparison window of TZ §4.2 §9.
fn shift_year(date: &str) -> String {
    let (year, rest) = date.split_at(4);
    let year: i32 = year.parse().unwrap_or(0);
    format!("{}{rest}", year - 1)
}

/// **Acceptance evidence for TZ §10.4 on the wire.** A month in which one
/// faculty ran three checks must not publish that three - and, under ADR-016,
/// must not have contributed to the total either, so the residual of a
/// subtraction attack is exactly zero.
#[sqlx::test(migrations = "../../migrations")]
async fn a_small_faculty_is_withheld_and_contributes_to_nothing(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);
    let expected = expected_json();
    let november = scenario(&expected, "month-2025-11");

    let body = get(
        &router,
        &format!("/api/public/faculties?{}", public_query(&november)),
    )
    .await
    .json();

    // FAC08 ran three checks that month - below k = 5, so its only cell is
    // withheld and the faculty has nothing left to publish.
    assert_suppressed("FAC08 checks", &item(&body, "FAC08")["checks"]);
    assert_suppressed(
        "FAC08 avg_originality",
        &item(&body, "FAC08")["avg_originality"],
    );

    // FAC05 is no longer collateral damage. Before ADR-016 the complementary
    // pass had to hide the smallest still-visible faculty, because the total
    // contained FAC08's three checks and `total − Σ visible` would have
    // recovered them. The total no longer contains them, so FAC05 is published.
    assert_visible_int("FAC05", &item(&body, "FAC05")["checks"], 156);
    assert_visible_int("FAC04", &item(&body, "FAC04")["checks"], 306);

    // Exactly one row is withheld - the one with no released cell.
    let hidden = body["items"]
        .as_array()
        .expect("items")
        .iter()
        .filter(|item| item["checks"] == json!("insufficient_data"))
        .count();
    assert_eq!(hidden, 1, "{body}");

    // The margin is closed: the published rows sum to the published total, so
    // subtraction yields nothing at all.
    let visible: i64 = body["items"]
        .as_array()
        .expect("items")
        .iter()
        .filter_map(|item| item["checks"].as_i64())
        .sum();
    let total = body["total"]["checks"].as_i64().unwrap_or(0);
    assert_eq!(
        total - visible,
        0,
        "Σ published rows must equal the published total"
    );
    assert_eq!(
        total,
        november["public_summary"]["checks"].as_i64().unwrap_or(-1)
    );
    // And it is strictly below the raw November figure - the withheld checks
    // are gone from the public contour, not merely masked.
    assert!(
        total < november["summary"]["checks"].as_i64().unwrap_or(0),
        "the closure total must exclude the withheld cells"
    );
    Ok(())
}

/// TZ §4.6 / §6.2: `k` is an administrator setting, and raising it takes effect
/// without a redeploy - within the 60 s cache TTL.
#[sqlx::test(migrations = "../../migrations")]
async fn raising_k_shrinks_the_released_cube(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;

    let state = AppState::new(
        db::Pool::for_tests(pool),
        AppConfig {
            auth_mode: AuthMode::Dev,
            ..AppConfig::new("http://localhost:8080".parse().expect("absolute"))
        },
    );
    let policy_cache = std::sync::Arc::clone(&state.k_policy);
    let router = api::build_router(state);

    let query = "from=2023-09-01&to=2026-08-31";
    let before = get(&router, &format!("/api/public/faculties?{query}"))
        .await
        .json();
    assert_eq!(before["k_threshold"], json!(5));
    // 21 checks raw, 11 of them in cells that clear k = 5.
    assert_visible_int("FAC08 at k=5", &item(&before, "FAC08")["checks"], 11);
    let released_before = before["total"]["checks"].as_i64().unwrap_or(0);

    db::settings::set(
        &warehouse,
        db::settings::K_THRESHOLD,
        &json!(25),
        Some("test"),
    )
    .await
    .expect("k_threshold is writable");

    // Still the cached policy: the TTL is what bounds the change, and a test
    // that passed here without invalidation would prove the cache is a no-op.
    let cached = get(&router, &format!("/api/public/faculties?{query}"))
        .await
        .json();
    assert_eq!(cached["k_threshold"], json!(5), "the 60 s TTL still holds");

    policy_cache.invalidate();

    let after = get(&router, &format!("/api/public/faculties?{query}"))
        .await
        .json();
    assert_eq!(after["k_threshold"], json!(25));
    assert_suppressed("FAC08 at k=25", &item(&after, "FAC08")["checks"]);
    for code in ["FAC01", "FAC04", "UNASSIGNED"] {
        assert!(
            item(&after, code)["checks"].as_i64().is_some(),
            "{code} has thousands of checks and must stay visible"
        );
    }

    // P3 on the wire: raising `k` only ever removes cells, so the released
    // total can only shrink, and the withheld-cell counter can only grow.
    let released_after = after["total"]["checks"].as_i64().unwrap_or(0);
    assert!(
        released_after < released_before,
        "{released_after} !< {released_before}"
    );
    assert!(
        after["suppressed_groups"].as_i64() > before["suppressed_groups"].as_i64(),
        "raising k must withhold more cells"
    );
    Ok(())
}
