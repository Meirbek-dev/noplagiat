//! **Regression suite for the two public-contour blockers** (ADR-016).
//!
//! A data auditor recovered individual originality scores from the public API
//! twice over, on fixture data, without ever seeing a response that violated
//! k-anonymity on its own:
//!
//! * **B1 - differencing.** `from`/`to` accepted arbitrary days, so walking a
//!   window's end forward by one day and subtracting the two `/summary`
//!   answers left exactly one check.
//! * **B2 - cross-response reconstruction.** Complementary suppression hid a
//!   cell only inside one response, and every hidden cell was separately
//!   addressable through a narrower filter, so `total − Σ visible` recovered
//!   it. Three recipes were published: timeseries against per-month summaries,
//!   the work-types margin, and the faculties margin.
//!
//! Every one of them is reproduced below against the live router, and every one
//! must now yield **zero new information**: the residual of any subtraction is
//! either 0 or a number the API already published, and never the size of a
//! withheld group. The counterfactuals - the same arithmetic over the *raw*
//! figures `fixtures/expected.json` still carries for the internal contour -
//! are asserted to succeed, so a passing test cannot be vacuous.

#![expect(
    clippy::expect_used,
    reason = "test assertions: a malformed fixture must abort the test"
)]

mod support;

use axum::http::StatusCode;
use serde_json::{Value, json};
use sqlx::PgPool;
use support::{expected_json, get, scenario};

/// The fixture's k, and the November group the auditor attacked.
const K: i64 = 5;
const ATTACKED_FACULTY: &str = "FAC08";

/// `/summary` for one query, as JSON.
async fn summary(router: &axum::Router, query: &str) -> Value {
    let reply = get(router, &format!("/api/public/summary?{query}")).await;
    assert_eq!(reply.status, StatusCode::OK, "{query}");
    reply.json()
}

/// A published count, or `None` when the cell carries the marker.
fn published(value: &Value) -> Option<i64> {
    value.as_i64()
}

/// A published count that must be there.
fn number(context: &str, value: &Value) -> i64 {
    published(value).unwrap_or_else(|| panic!("{context}: expected a number, got {value}"))
}

/// Raw (internal-contour) faculty totals of a scenario, summed from its
/// department rows - the numbers the *counterfactual* attacks work on.
fn raw_faculty_checks(scenario: &Value, code: &str) -> i64 {
    scenario["units"]
        .as_array()
        .expect("a scenario carries unit rows")
        .iter()
        .filter(|unit| unit["faculty"] == json!(code))
        .filter_map(|unit| unit["checks"].as_i64())
        .sum()
}

/// Every residual a closed model may produce: nothing at all, or a figure the
/// API published in its own right. Never a group of `1..k`.
fn assert_residual_is_closed(context: &str, residual: i64) {
    assert!(
        residual == 0 || residual >= K,
        "{context}: subtraction isolated a group of {residual}, which is below k = {K}"
    );
}

// ── B1: the window walk ─────────────────────────────────────────────────────

/// **B1.** Walking `to` forward one day at a time used to isolate a single
/// check. The public contour now answers whole months, so a day-step inside a
/// month changes nothing, and a step across a month boundary moves the answer
/// by exactly the month `/timeseries` already publishes.
#[sqlx::test(migrations = "../../migrations")]
async fn walking_the_window_by_a_day_reveals_nothing(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);

    // Twenty-nine consecutive one-day extensions inside November: every one of
    // them must return the *same* body, byte for byte.
    let baseline = summary(&router, "from=2025-11-01&to=2025-11-01").await;
    for day in 2..=30 {
        let walked = summary(&router, &format!("from=2025-11-01&to=2025-11-{day:02}")).await;
        assert_eq!(
            walked, baseline,
            "extending the window to November {day} changed the answer"
        );
    }
    // The window start is snapped too, so walking it backwards is just as inert.
    for day in 1..=30 {
        let walked = summary(&router, &format!("from=2025-11-{day:02}&to=2025-11-30")).await;
        assert_eq!(walked, baseline, "moving the start to November {day}");
    }

    // Crossing the boundary does move the answer - by exactly one month, and
    // that month is published on `/timeseries`.
    let october_only = summary(&router, "from=2025-10-01&to=2025-10-31").await;
    let both = summary(&router, "from=2025-10-01&to=2025-11-30").await;
    let step =
        number("Oct+Nov", &both["total_checks"]) - number("Oct", &october_only["total_checks"]);
    assert_eq!(
        step,
        number("Nov", &baseline["total_checks"]),
        "the step across a month boundary must equal the published November total"
    );
    assert_residual_is_closed("month-boundary step", step);

    // The escalation counter travels with its cells, so it steps by the same
    // rule rather than by a hidden remainder.
    let escalation_step = number("Oct+Nov escalated", &both["escalated"])
        - number("Oct escalated", &october_only["escalated"]);
    assert_eq!(
        escalation_step,
        number("Nov escalated", &baseline["escalated"])
    );
    Ok(())
}

/// The auditor's day-grain request survives as a `422` for `status` and as a
/// silently widened window for `from`/`to` - the response says which window it
/// actually answered, so a client is never misled about its own filter.
#[sqlx::test(migrations = "../../migrations")]
async fn the_public_contour_reports_the_window_it_answered(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);

    let body = summary(&router, "from=2025-10-15&to=2025-11-14").await;
    assert_eq!(body["period"]["from"], json!("2025-10-01"));
    assert_eq!(body["period"]["to"], json!("2025-11-30"));

    // February keeps its own length in its own year, in both directions.
    let leap = summary(&router, "from=2024-02-10&to=2024-02-20").await;
    assert_eq!(leap["period"]["to"], json!("2024-02-29"));
    assert_eq!(leap["previous"]["period"]["from"], json!("2023-02-01"));
    assert_eq!(leap["previous"]["period"]["to"], json!("2023-02-28"));

    let common = summary(&router, "from=2025-02-01&to=2025-02-28").await;
    assert_eq!(
        common["previous"]["period"]["to"],
        json!("2024-02-29"),
        "a 28-day February compares against the 29-day one, not a truncated copy"
    );

    // ADR-016 §3: `status` is no longer a public dimension.
    for endpoint in [
        "summary",
        "timeseries",
        "work-types",
        "faculties",
        "histogram",
        "yoy",
    ] {
        let reply = get(
            &router,
            &format!("/api/public/{endpoint}?period=year&status=accepted"),
        )
        .await;
        assert_eq!(
            reply.status,
            StatusCode::UNPROCESSABLE_ENTITY,
            "/{endpoint} must refuse a status filter"
        );
        let problem = reply.json();
        assert_eq!(
            problem["errors"][0]["field"],
            json!("status"),
            "the 422 must name the parameter: {problem}"
        );
    }
    Ok(())
}

// ── B2, recipe 1: timeseries against per-month summaries ────────────────────

/// **B2/1.** The auditor summed per-month `/summary` calls and subtracted them
/// from the window total to isolate the months whose cells were hidden. Under
/// closure the two are equal by construction: a cube cell belongs to exactly
/// one month, and whether it is released does not depend on the window it is
/// read through.
#[sqlx::test(migrations = "../../migrations")]
async fn per_month_summaries_sum_to_the_window(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);

    // Autumn 2025: five months, one of which holds the crafted small groups.
    let months = [
        ("2025-09-01", "2025-09-30"),
        ("2025-10-01", "2025-10-31"),
        ("2025-11-01", "2025-11-30"),
        ("2025-12-01", "2025-12-31"),
        ("2026-01-01", "2026-01-31"),
    ];
    let window = summary(&router, "from=2025-09-01&to=2026-01-31").await;
    let series = get(
        &router,
        "/api/public/timeseries?from=2025-09-01&to=2026-01-31",
    )
    .await
    .json();

    let mut summed = 0_i64;
    let mut summed_escalated = 0_i64;
    let mut summed_below = 0_i64;
    for (index, (from, to)) in months.iter().enumerate() {
        let month = summary(&router, &format!("from={from}&to={to}")).await;
        let checks = number(from, &month["total_checks"]);
        summed += checks;
        summed_escalated += number(from, &month["escalated"]);
        summed_below += number(from, &month["below_threshold"]);

        // The same month, read through `/timeseries`, is the same number.
        let point = &series["months"][index];
        assert_eq!(point["month"], json!(from), "month order");
        assert_eq!(
            published(&point["checks"]),
            Some(checks),
            "/timeseries and /summary disagree for {from}"
        );
        assert_eq!(
            point["avg_originality"].as_f64(),
            month["avg_originality"].as_f64(),
            "the two endpoints must round the same mean identically for {from}"
        );
    }

    let residual = number("window", &window["total_checks"]) - summed;
    assert_eq!(residual, 0, "Σ months must equal the window total");
    assert_residual_is_closed("timeseries residual", residual);
    assert_eq!(
        number("window escalated", &window["escalated"]) - summed_escalated,
        0
    );
    assert_eq!(
        number("window below", &window["below_threshold"]) - summed_below,
        0
    );
    Ok(())
}

// ── B2, recipe 2: the work-types margin ─────────────────────────────────────

/// **B2/2.** Every hidden `/work-types` cell used to be separately addressable
/// through `/summary?faculty=…&work_type=…`, so `total − Σ visible` recovered
/// it. Now the rows sum to the total, and each row equals the answer its own
/// narrower query gives.
#[sqlx::test(migrations = "../../migrations")]
async fn the_work_type_margin_is_closed(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);

    // November, where the crafted groups live.
    let window = "from=2025-11-01&to=2025-11-30";
    let breakdown = get(&router, &format!("/api/public/work-types?{window}"))
        .await
        .json();
    let total = number("work-types total", &breakdown["total"]["checks"]);

    let mut visible = 0_i64;
    for row in breakdown["items"].as_array().expect("items") {
        let code = row["code"].as_str().expect("work type code");
        let narrower = summary(&router, &format!("{window}&work_type={code}")).await;
        match published(&row["checks"]) {
            Some(checks) => {
                visible += checks;
                assert_eq!(
                    published(&narrower["total_checks"]),
                    Some(checks),
                    "the narrower query must agree with the row for {code}"
                );
            }
            None => assert_eq!(
                narrower["total_checks"],
                json!("insufficient_data"),
                "a row hidden in the breakdown must stay hidden under its own filter: {code}"
            ),
        }
    }
    assert_eq!(total - visible, 0, "Σ work types must equal the total");

    // The pair drill-down: for one faculty, the work-type answers must sum back
    // to that faculty's own answer - this is the exact pair the auditor used.
    let faculty = "FAC03";
    let faculty_total = number(
        faculty,
        &summary(&router, &format!("{window}&faculty={faculty}")).await["total_checks"],
    );
    let mut pairs = 0_i64;
    for row in breakdown["items"].as_array().expect("items") {
        let code = row["code"].as_str().expect("work type code");
        let pair = summary(
            &router,
            &format!("{window}&faculty={faculty}&work_type={code}"),
        )
        .await;
        pairs += published(&pair["total_checks"]).unwrap_or(0);
    }
    let residual = faculty_total - pairs;
    assert_eq!(
        residual, 0,
        "the (faculty × work type) cells must sum to the faculty total"
    );
    assert_residual_is_closed("work-type pair residual", residual);
    Ok(())
}

// ── B2, recipe 3: the faculties margin ──────────────────────────────────────

/// **B2/3.** The published attack: `/faculties` in a month where one faculty is
/// hidden, minus the visible rows, used to yield that faculty's exact count.
///
/// The counterfactual at the end is what makes this test mean something - the
/// same subtraction over the raw figures the internal contour still publishes
/// *does* recover the hidden three.
#[sqlx::test(migrations = "../../migrations")]
async fn the_faculty_margin_is_closed(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);
    let expected = expected_json();
    let november = scenario(&expected, "month-2025-11");

    let window = "from=2025-11-01&to=2025-11-30";
    let breakdown = get(&router, &format!("/api/public/faculties?{window}"))
        .await
        .json();
    let total = number("faculties total", &breakdown["total"]["checks"]);

    let mut visible = 0_i64;
    let mut hidden_codes = Vec::new();
    for row in breakdown["items"].as_array().expect("items") {
        let code = row["code"].as_str().expect("faculty code").to_owned();
        let narrower = summary(&router, &format!("{window}&faculty={code}")).await;
        match published(&row["checks"]) {
            Some(checks) => {
                visible += checks;
                assert_eq!(
                    published(&narrower["total_checks"]),
                    Some(checks),
                    "the narrower query must agree with the row for {code}"
                );
            }
            None => {
                assert_eq!(
                    narrower["total_checks"],
                    json!("insufficient_data"),
                    "{code} is hidden in the margin and must stay hidden alone"
                );
                hidden_codes.push(code);
            }
        }
    }

    let residual = total - visible;
    assert_eq!(residual, 0, "Σ faculties must equal the total");
    assert_residual_is_closed("faculty margin residual", residual);
    assert_eq!(
        hidden_codes,
        vec![ATTACKED_FACULTY.to_owned()],
        "the attacked faculty is the one with no released cell"
    );

    // The number the auditor recovered, and what the residual would have been.
    let recovered = raw_faculty_checks(&november, ATTACKED_FACULTY);
    assert!(
        recovered > 0 && recovered < K,
        "the fixture must still contain a sub-k November group for {ATTACKED_FACULTY}, got {recovered}"
    );
    assert_ne!(
        residual, recovered,
        "the residual must not be the withheld group size"
    );

    // Counterfactual - the same arithmetic over the raw figures the internal
    // contour publishes still recovers it, so this test is not vacuous.
    let raw_total = november["summary"]["checks"]
        .as_i64()
        .expect("raw November total");
    let raw_visible: i64 = november["public_faculties"]
        .as_array()
        .expect("closure faculty rows")
        .iter()
        .filter(|row| row["code"] != json!(ATTACKED_FACULTY))
        .map(|row| raw_faculty_checks(&november, row["code"].as_str().unwrap_or_default()))
        .sum();
    assert_eq!(
        raw_total - raw_visible,
        recovered,
        "the counterfactual must reproduce the published attack"
    );

    // And the public total is strictly smaller than the raw one - the withheld
    // checks are absent, not masked.
    assert!(
        total < raw_total,
        "{total} !< {raw_total}: withheld cells must not survive inside a total"
    );
    Ok(())
}

// ── the cross-view invariant ────────────────────────────────────────────────

/// One cube, one rounding: `/summary`, `/faculties`, `/work-types`,
/// `/timeseries` and `/yoy` answer the same filter with the same total and the
/// same mean, to the last published decimal (audit finding 4).
#[sqlx::test(migrations = "../../migrations")]
async fn every_view_of_one_filter_agrees(pool: PgPool) -> sqlx::Result<()> {
    let warehouse = db::Pool::for_tests(pool.clone());
    support::load_warehouse(&warehouse).await?;
    let router = support::router(pool);

    for window in [
        "from=2023-09-01&to=2026-08-31",
        "from=2025-09-01&to=2026-08-31",
        "from=2025-11-01&to=2025-11-30",
        "from=2023-09-01&to=2026-08-31&faculty=FAC03",
    ] {
        let overview = summary(&router, window).await;
        let checks = number(window, &overview["total_checks"]);
        let mean = overview["avg_originality"]
            .as_f64()
            .expect("a published mean");
        let suppressed = overview["suppressed_groups"]
            .as_i64()
            .expect("a suppressed-group count");

        for endpoint in ["work-types", "faculties", "yoy"] {
            let body = get(&router, &format!("/api/public/{endpoint}?{window}"))
                .await
                .json();
            assert_eq!(
                published(&body["total"]["checks"]),
                Some(checks),
                "/{endpoint} total for {window}"
            );
            assert_eq!(
                body["total"]["avg_originality"].as_f64(),
                Some(mean),
                "/{endpoint} mean for {window} must match /summary bit for bit"
            );
            assert_eq!(
                body["suppressed_groups"].as_i64(),
                Some(suppressed),
                "/{endpoint} withheld-cell count for {window}"
            );

            // Every row sums back into the total: no margin has a remainder.
            let summed: i64 = body[if endpoint == "yoy" { "years" } else { "items" }]
                .as_array()
                .expect("rows")
                .iter()
                .filter_map(|row| row["checks"].as_i64())
                .sum();
            assert_eq!(summed, checks, "/{endpoint} rows for {window}");
        }

        let series = get(&router, &format!("/api/public/timeseries?{window}"))
            .await
            .json();
        let monthly: i64 = series["months"]
            .as_array()
            .expect("months")
            .iter()
            .filter_map(|point| point["checks"].as_i64())
            .sum();
        assert_eq!(monthly, checks, "/timeseries rows for {window}");

        let histogram = get(&router, &format!("/api/public/histogram?{window}"))
            .await
            .json();
        assert_eq!(published(&histogram["total"]), Some(checks));
        let banded: i64 = histogram["buckets"]
            .as_array()
            .expect("buckets")
            .iter()
            .filter_map(|bucket| bucket["checks"].as_i64())
            .sum();
        assert_eq!(banded, checks, "/histogram bands for {window}");
    }
    Ok(())
}
