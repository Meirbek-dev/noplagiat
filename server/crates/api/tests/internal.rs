//! Slice W3.3 - the internal contour against the brute-force fixtures
//! (TZ §4.2, PLAN.md W3.3 gate: «query-level scope tests and endpoint tests;
//! the recheck improvement rate compared against the brute-force fixture»).
//!
//! Everything runs through the real router with a real dev session, so the
//! scope reaching SQL is the one the session layer derived - not one the test
//! passed in.

// `server/clippy.toml` allows `expect` in `#[test]` functions but not in the
// helpers they call. These helpers exist to abort a test loudly on a broken
// harness; they are not a request path, which is what the workspace lint
// protects (ARCHITECTURE.md §4.1).
#![expect(
    clippy::expect_used,
    reason = "test harness: a broken fixture must abort the test"
)]

mod support;

use axum::http::StatusCode;
use serde_json::{Value, json};
use sqlx::PgPool;
use support::{
    Session, assert_visible_close, assert_visible_int, authenticated, dev_login, expected_json,
    scenario, send,
};

/// The fixture faculty the dean in these tests presides over, and the
/// department its head runs.
const FACULTY: &str = "FAC03";
const DEPARTMENT: &str = "DEP11";
/// The fixture range every scenario covers.
const RANGE: &str = "from=2023-09-01&to=2026-08-31";

async fn warehouse(pool: PgPool) -> (axum::Router, db::Pool) {
    let pool = db::Pool::for_tests(pool);
    support::load_warehouse(&pool)
        .await
        .expect("the fixture warehouse loads");
    (api::build_router(support::state_from(pool.clone())), pool)
}

async fn dean(router: &axum::Router) -> Session {
    dev_login(
        router,
        json!({"sso_subject": "fac03-dean", "role": "dean", "scope_faculty_code": FACULTY}),
    )
    .await
}

/// The «Эскалации» section is reserved for the oversight roles (TZ §5,
/// ADR-014 §7), so its numbers are read here by an ethics account scoped to the
/// same faculty - the fixture scenario is unchanged, only the caller is.
async fn faculty_ethics(router: &axum::Router) -> Session {
    dev_login(
        router,
        json!({"sso_subject": "fac03-ethics", "role": "ethics", "scope_faculty_code": FACULTY}),
    )
    .await
}

async fn head(router: &axum::Router) -> Session {
    dev_login(
        router,
        json!({
            "sso_subject": "dep11-head", "role": "dept_head",
            "scope_department_code": DEPARTMENT,
        }),
    )
    .await
}

async fn get_json(router: &axum::Router, session: &Session, uri: &str) -> Value {
    let reply = send(router, authenticated(session, "GET", uri)).await;
    assert_eq!(
        reply.status,
        StatusCode::OK,
        "{uri}: {}",
        String::from_utf8_lossy(&reply.body)
    );
    reply.json()
}

/// A dean's *unfiltered* view must equal the fixture's faculty-filtered one:
/// the scope is applied in SQL, so «all data I may see» and «this faculty» are
/// the same query (AGENTS.md invariant #3).
#[sqlx::test(migrations = "../../migrations")]
async fn a_dean_sees_exactly_their_faculty(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = dean(&router).await;
    let expected = expected_json();
    let want = scenario(&expected, "faculty-fac03");

    // ── §1 summary ──────────────────────────────────────────────────────────
    let summary = get_json(&router, &session, &format!("/api/internal/summary?{RANGE}")).await;
    assert_eq!(summary["scope"]["kind"], json!("faculty"));
    assert_visible_int(
        "summary.total_checks",
        &summary["total_checks"],
        want["summary"]["checks"].as_i64().unwrap_or_default(),
    );
    assert_visible_close(
        "summary.avg_originality",
        &summary["avg_originality"],
        want["summary"]["avg_originality"]
            .as_f64()
            .unwrap_or_default(),
    );
    assert_visible_int(
        "summary.below_threshold",
        &summary["below_threshold"],
        want["summary"]["below_threshold"]
            .as_i64()
            .unwrap_or_default(),
    );
    assert_visible_close(
        "summary.below_threshold_share",
        &summary["below_threshold_share"],
        want["summary"]["below_threshold_share"]
            .as_f64()
            .unwrap_or_default(),
    );

    // ── §2 dynamics ─────────────────────────────────────────────────────────
    let timeseries = get_json(
        &router,
        &session,
        &format!("/api/internal/timeseries?{RANGE}"),
    )
    .await;
    let months = timeseries["months"]
        .as_array()
        .expect("the response carries months");
    for point in want["timeseries"].as_array().unwrap_or(&Vec::new()) {
        let month = point["month"].as_str().unwrap_or_default();
        let got = months
            .iter()
            .find(|candidate| candidate["month"] == json!(month))
            .unwrap_or_else(|| panic!("{month} missing from the response"));
        assert_visible_int(
            &format!("timeseries {month}"),
            &got["checks"],
            point["checks"].as_i64().unwrap_or_default(),
        );
        assert_visible_close(
            &format!("timeseries {month} mean"),
            &got["avg_originality"],
            point["avg_originality"].as_f64().unwrap_or_default(),
        );
    }

    // ── §3 work types ───────────────────────────────────────────────────────
    let work_types = get_json(
        &router,
        &session,
        &format!("/api/internal/work-types?{RANGE}"),
    )
    .await;
    for row in want["work_types"].as_array().unwrap_or(&Vec::new()) {
        let code = row["code"].as_str().unwrap_or_default();
        let got = work_types["items"]
            .as_array()
            .expect("items")
            .iter()
            .find(|item| item["code"] == json!(code))
            .unwrap_or_else(|| panic!("work type {code} missing"));
        assert_visible_int(
            &format!("work type {code}"),
            &got["checks"],
            row["checks"].as_i64().unwrap_or_default(),
        );
    }

    // ── §4 the department matrix ────────────────────────────────────────────
    let matrix = get_json(
        &router,
        &session,
        &format!("/api/internal/departments-matrix?{RANGE}"),
    )
    .await;
    let faculties = matrix["faculties"].as_array().expect("faculties");
    assert_eq!(
        faculties.len(),
        1,
        "a dean's matrix holds their faculty and nothing else: {matrix}"
    );
    assert_eq!(faculties[0]["code"], json!(FACULTY));
    for row in want["units"].as_array().unwrap_or(&Vec::new()) {
        let code = row["department"].as_str().unwrap_or_default();
        let got = faculties[0]["departments"]
            .as_array()
            .expect("departments")
            .iter()
            .find(|item| item["code"] == json!(code))
            .unwrap_or_else(|| panic!("department {code} missing"));
        assert_visible_int(
            &format!("department {code}"),
            &got["checks"],
            row["checks"].as_i64().unwrap_or_default(),
        );
        assert_visible_close(
            &format!("department {code} mean"),
            &got["avg_originality"],
            row["avg_originality"].as_f64().unwrap_or_default(),
        );
    }

    // ── §5 histogram ────────────────────────────────────────────────────────
    let histogram = get_json(
        &router,
        &session,
        &format!("/api/internal/histogram?{RANGE}"),
    )
    .await;
    for (key, wanted) in [
        ("b_lt50", "lt50"),
        ("b_50_70", "b50_70"),
        ("b_70_85", "b70_85"),
        ("b_85_95", "b85_95"),
        ("b_ge95", "ge95"),
    ] {
        let got = histogram["buckets"]
            .as_array()
            .expect("buckets")
            .iter()
            .find(|bucket| bucket["key"] == json!(key))
            .unwrap_or_else(|| panic!("bucket {key} missing"));
        assert_visible_int(
            key,
            &got["checks"],
            want["histogram"][wanted].as_i64().unwrap_or_default(),
        );
    }

    // ── §9 year over year ───────────────────────────────────────────────────
    let yoy = get_json(&router, &session, &format!("/api/internal/yoy?{RANGE}")).await;
    for row in want["yoy"].as_array().unwrap_or(&Vec::new()) {
        let year = row["academic_year"].as_i64().unwrap_or_default();
        let got = yoy["years"]
            .as_array()
            .expect("years")
            .iter()
            .find(|item| item["academic_year"] == json!(year))
            .unwrap_or_else(|| panic!("academic year {year} missing"));
        assert_visible_int(
            &format!("yoy {year}"),
            &got["checks"],
            row["checks"].as_i64().unwrap_or_default(),
        );
    }
    Ok(())
}

/// TZ §4.2 §6 - «доля работ, прошедших повторную проверку … из них доля с
/// улучшенным показателем», against the brute-force fixture.
#[sqlx::test(migrations = "../../migrations")]
async fn rechecks_match_the_brute_force_fixture(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = dean(&router).await;
    let want = scenario(&expected_json(), "faculty-fac03");
    let wanted = &want["rechecks"];

    let body = get_json(
        &router,
        &session,
        &format!("/api/internal/rechecks?{RANGE}"),
    )
    .await;
    let total = wanted["works_total"].as_i64().unwrap_or_default();
    let rechecked = wanted["works_rechecked"].as_i64().unwrap_or_default();
    let improved = wanted["improved"].as_i64().unwrap_or_default();

    assert_visible_int("works_total", &body["works_total"], total);
    assert_visible_int("works_rechecked", &body["works_rechecked"], rechecked);
    assert_visible_int("improved", &body["improved"], improved);

    #[expect(
        clippy::cast_precision_loss,
        reason = "fixture counts are far inside f64's exact integer range"
    )]
    let ratio = |numerator: i64, denominator: i64| numerator as f64 / denominator as f64;
    assert_visible_close(
        "recheck_share",
        &body["recheck_share"],
        ratio(rechecked, total),
    );
    assert_visible_close(
        "improved_share",
        &body["improved_share"],
        ratio(improved, rechecked),
    );

    // A dean's breakdown is one grain deeper: the departments of the faculty.
    let units = body["units"].as_array().expect("per-unit rows");
    assert_eq!(units.len(), 5, "FAC03 has five departments: {body}");
    assert!(
        units.iter().any(|unit| unit["code"] == json!(DEPARTMENT)),
        "{body}"
    );
    Ok(())
}

/// TZ §4.2 §7 - the escalation total, and the per-unit breakdown that is
/// screened for **everyone**.
#[sqlx::test(migrations = "../../migrations")]
async fn escalations_report_the_total_and_screen_the_unit_breakdown(
    pool: PgPool,
) -> sqlx::Result<()> {
    let (router, pool) = warehouse(pool).await;
    let session = faculty_ethics(&router).await;
    let want = scenario(&expected_json(), "faculty-fac03");

    let body = get_json(
        &router,
        &session,
        &format!("/api/internal/escalations?{RANGE}"),
    )
    .await;
    assert_visible_int(
        "escalated",
        &body["escalated"],
        want["escalations"]["checks_escalated"]
            .as_i64()
            .unwrap_or_default(),
    );
    assert!(
        body["units"]
            .as_array()
            .is_some_and(|units| !units.is_empty()),
        "the breakdown should carry the faculty's departments: {body}"
    );

    // Raise k above every department's escalation count. Ethics is a raw-data
    // role, so the scalar total stays exact - but TZ §4.2 §7 makes the per-unit
    // breakdown screened regardless of role, and it must now be «недостаточно
    // данных» everywhere.
    db::settings::set(&pool, "k_threshold", &json!(100_000), Some("test"))
        .await
        .expect("k is stored");
    // The k-policy cache has a 60 s TTL; a fresh router reads the new value.
    let router = api::build_router(support::state_from(pool.clone()));
    let session = faculty_ethics(&router).await;

    let body = get_json(
        &router,
        &session,
        &format!("/api/internal/escalations?{RANGE}"),
    )
    .await;
    assert_visible_int(
        "escalated stays exact for a raw-data role",
        &body["escalated"],
        want["escalations"]["checks_escalated"]
            .as_i64()
            .unwrap_or_default(),
    );
    for unit in body["units"].as_array().expect("units") {
        assert_eq!(
            unit["escalated"],
            json!(compliance::SUPPRESSED_MARKER),
            "a unit-level escalation count must be screened for every role: {unit}"
        );
    }
    Ok(())
}

/// TZ §5 reserves the escalation register for the ethics and compliance
/// functions: a dean and a head are refused it outright, with a **role**
/// denial rather than the out-of-scope-unit problem - there is no filter they
/// could clear to get in. Every other section stays open to them, and the
/// refusal is not journalled as a section view (ADR-012 §1).
#[sqlx::test(migrations = "../../migrations")]
async fn the_escalation_register_is_closed_to_the_unit_roles(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("dictionaries load");
    let router = api::build_router(support::state_from(pool.clone()));

    for session in [dean(&router).await, head(&router).await] {
        let reply = send(
            &router,
            authenticated(&session, "GET", "/api/internal/escalations"),
        )
        .await;
        let problem = reply.problem(StatusCode::FORBIDDEN);
        assert_eq!(problem["type"], json!("/problems/forbidden"), "{problem}");

        // The neighbouring sections are untouched by the narrowing.
        for section in ["summary", "rechecks", "usage"] {
            let reply = send(
                &router,
                authenticated(&session, "GET", &format!("/api/internal/{section}")),
            )
            .await;
            assert_eq!(reply.status, StatusCode::OK, "{section}");
        }
    }

    // A refused section is not a section view.
    let rows = db::audit::list(&pool, &db::audit::AuditFilter::default(), 100, 0)
        .await
        .expect("the audit log reads")
        .rows;
    assert!(
        !rows.iter().any(|row| row.section == "escalations"),
        "a 403 must not be journalled as a view"
    );

    // …and the oversight roles still reach it.
    let ethics = dev_login(
        &router,
        json!({"sso_subject": "ethics-open", "role": "ethics"}),
    )
    .await;
    let reply = send(
        &router,
        authenticated(&ethics, "GET", "/api/internal/escalations"),
    )
    .await;
    assert_eq!(reply.status, StatusCode::OK);
    Ok(())
}

/// TZ §4.2 §8 - monthly active reviewers, and «нет данных» rather than a zero
/// where the manual register has no row.
#[sqlx::test(migrations = "../../migrations")]
async fn usage_reports_reviewers_and_admits_missing_durations(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = dean(&router).await;
    let want = scenario(&expected_json(), "faculty-fac03");

    let body = get_json(&router, &session, &format!("/api/internal/usage?{RANGE}")).await;
    let months = body["months"].as_array().expect("months");
    for point in want["usage"].as_array().unwrap_or(&Vec::new()) {
        let month = point["month"].as_str().unwrap_or_default();
        let got = months
            .iter()
            .find(|candidate| candidate["month"] == json!(month))
            .unwrap_or_else(|| panic!("{month} missing from usage"));
        assert_visible_int(
            &format!("usage {month}"),
            &got["active_reviewers"],
            point["active_reviewers"].as_i64().unwrap_or_default(),
        );
        assert_eq!(
            got["avg_check_seconds"],
            Value::Null,
            "no manual usage_stats row exists, so the duration must be null, not 0"
        );
    }
    Ok(())
}

/// A head of department reads their own department and nothing else - the
/// numbers come from the `department-dep11` fixture scenario.
#[sqlx::test(migrations = "../../migrations")]
async fn a_head_of_department_sees_exactly_their_department(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = head(&router).await;
    let want = scenario(&expected_json(), "department-dep11");

    let summary = get_json(&router, &session, &format!("/api/internal/summary?{RANGE}")).await;
    assert_eq!(summary["scope"]["kind"], json!("department"));
    assert_visible_int(
        "summary.total_checks",
        &summary["total_checks"],
        want["summary"]["checks"].as_i64().unwrap_or_default(),
    );

    // One grain below a department is nothing, so the recheck breakdown is
    // empty rather than a repeat of the total.
    let rechecks = get_json(
        &router,
        &session,
        &format!("/api/internal/rechecks?{RANGE}"),
    )
    .await;
    assert_visible_int(
        "works_total",
        &rechecks["works_total"],
        want["rechecks"]["works_total"].as_i64().unwrap_or_default(),
    );
    assert!(
        rechecks["units"].as_array().is_some_and(Vec::is_empty),
        "{rechecks}"
    );

    // The matrix holds one faculty with one department.
    let matrix = get_json(
        &router,
        &session,
        &format!("/api/internal/departments-matrix?{RANGE}"),
    )
    .await;
    let faculties = matrix["faculties"].as_array().expect("faculties");
    assert_eq!(faculties.len(), 1);
    assert_eq!(
        faculties[0]["departments"]
            .as_array()
            .map(Vec::len)
            .unwrap_or_default(),
        1,
        "{matrix}"
    );
    Ok(())
}

/// A university-wide role reads every faculty, and `ping` reports the screening
/// decision the sections apply (ADR-014 §4).
#[sqlx::test(migrations = "../../migrations")]
async fn a_university_wide_role_reads_every_faculty_raw(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = dev_login(
        &router,
        json!({"sso_subject": "compliance-internal", "role": "compliance"}),
    )
    .await;

    let ping = get_json(&router, &session, "/api/internal/ping").await;
    assert_eq!(ping["scope"]["kind"], json!("all"));
    assert_eq!(ping["screening"], json!("raw"));

    let matrix = get_json(
        &router,
        &session,
        &format!("/api/internal/departments-matrix?{RANGE}"),
    )
    .await;
    let faculties = matrix["faculties"].as_array().expect("faculties");
    assert!(
        faculties.len() > 1,
        "a university-wide role sees every faculty: {}",
        faculties.len()
    );

    // The whole-university total equals the all-time fixture scenario.
    let want = scenario(&expected_json(), "all-time-no-filter");
    let summary = get_json(&router, &session, &format!("/api/internal/summary?{RANGE}")).await;
    assert_visible_int(
        "university total",
        &summary["total_checks"],
        want["summary"]["checks"].as_i64().unwrap_or_default(),
    );
    Ok(())
}

/// The internal contour rejects a malformed filter with a `422` naming it,
/// exactly as the public one does - a filter that is ignored produces a
/// plausible wrong number.
#[sqlx::test(migrations = "../../migrations")]
async fn malformed_internal_filters_are_422(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("dictionaries load");
    let router = api::build_router(support::state_from(pool));
    let session = dev_login(
        &router,
        json!({"sso_subject": "compliance-filters", "role": "compliance"}),
    )
    .await;

    for (query, field) in [
        ("initiator=nobody", "initiator"),
        ("status=maybe", "status"),
        ("from=15.10.2025", "from"),
        ("period=decade", "period"),
    ] {
        let reply = send(
            &router,
            authenticated(&session, "GET", &format!("/api/internal/summary?{query}")),
        )
        .await;
        let problem = reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
        let fields: Vec<String> = problem["errors"]
            .as_array()
            .expect("field errors")
            .iter()
            .filter_map(|error| error["field"].as_str().map(str::to_owned))
            .collect();
        assert!(fields.contains(&field.to_owned()), "{query}: {problem}");
    }

    // An unknown parameter is refused rather than silently dropped.
    send(
        &router,
        authenticated(&session, "GET", "/api/internal/summary?faculties=FAC03"),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    Ok(())
}

/// Every internal read writes exactly one audit row, with the normalized
/// filters (TZ §6.3).
#[sqlx::test(migrations = "../../migrations")]
async fn every_internal_section_is_audited(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("dictionaries load");
    let router = api::build_router(support::state_from(pool.clone()));
    let session = dev_login(
        &router,
        json!({"sso_subject": "compliance-audit", "role": "compliance"}),
    )
    .await;

    let sections = [
        "summary",
        "timeseries",
        "work-types",
        "histogram",
        "yoy",
        "departments-matrix",
        "rechecks",
        "escalations",
        "usage",
    ];
    for section in sections {
        let reply = send(
            &router,
            authenticated(
                &session,
                "GET",
                &format!("/api/internal/{section}?period=year&faculty={FACULTY}"),
            ),
        )
        .await;
        assert_eq!(reply.status, StatusCode::OK, "{section}");
    }

    let page = db::audit::list(&pool, &db::audit::AuditFilter::default(), 100, 0)
        .await
        .expect("the audit log reads");
    for section in sections {
        let row = page
            .rows
            .iter()
            .find(|row| row.section == section)
            .unwrap_or_else(|| panic!("no audit row for {section}"));
        assert_eq!(row.action, "view");
        assert_eq!(row.role, "compliance");
        assert_eq!(
            row.filters,
            json!({"period": "year", "faculty": FACULTY}),
            "{section}"
        );
    }
    Ok(())
}
