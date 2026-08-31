//! **Acceptance evidence for TZ §10.1** - every dashboard query reproduces
//! `fixtures/expected.json` exactly.
//!
//! `fixtures/expected.ts` is an independent brute-force reducer: it contains no
//! SQL, imports nothing from `server/`, and re-implements CSV parsing, attempt
//! grouping, the status ladder, buckets and period arithmetic a second time on
//! purpose (fixtures/README.md "Independence"). A disagreement between it and
//! the SQL here is therefore a real bug in one of the two, not a shared
//! mistake - which is exactly what makes this file evidence rather than a
//! tautology.
//!
//! Counts must match exactly. Means are compared within half of the last
//! published digit, because `expected.json` rounds them half-up to 4 dp.
//!
//! Loading 60 000 fact rows takes several seconds, so the whole scenario matrix
//! runs inside one `#[sqlx::test]` database rather than one per scenario.

mod support;

use compliance::Scope;
use db::Pool;
use db::q::{self, UnitDepth};
use sqlx::PgPool;
use support::{as_f64, as_i64, as_str, assert_close, scenario_filters};

#[sqlx::test(migrations = "../../migrations")]
async fn dashboard_queries_reproduce_expected_json_tz_10_1(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let loaded = support::load_warehouse(&pool).await?;
    let expected = support::expected_json();

    let meta = &expected["meta"];
    let facts = as_i64(&meta["rows_generated"], "meta.rows_generated")
        - as_i64(&meta["rows_deleted"], "meta.rows_deleted")
        - as_i64(&meta["rows_malformed"], "meta.rows_malformed");
    assert_eq!(
        i64::try_from(loaded).unwrap_or(i64::MAX),
        facts,
        "facts.jsonl must hold exactly the importable rows of expected.json's meta"
    );

    let scenarios = expected["scenarios"]
        .as_array()
        .expect("expected.json carries a scenario array");
    assert_eq!(
        scenarios.len(),
        10,
        "the pinned scenario matrix has 10 rows"
    );

    for scenario in scenarios {
        let name = as_str(&scenario["name"], "scenario.name");
        let filters = scenario_filters(&scenario["filters"]);

        // ── §1 summary ──────────────────────────────────────────────────────
        let want = &scenario["summary"];
        let got = q::summary(&pool, &filters, Scope::All)
            .await
            .expect("summary query");
        assert_eq!(
            got.checks,
            as_i64(&want["checks"], name),
            "{name}: summary.checks"
        );
        assert_close(
            &format!("{name}: summary.avg_originality"),
            got.avg_originality(),
            as_f64(&want["avg_originality"], name),
        );
        assert_eq!(
            got.below_threshold,
            as_i64(&want["below_threshold"], name),
            "{name}: summary.below_threshold"
        );
        assert_close(
            &format!("{name}: summary.below_threshold_share"),
            got.below_threshold_share(),
            as_f64(&want["below_threshold_share"], name),
        );

        // ── §2 timeseries ───────────────────────────────────────────────────
        let want = scenario["timeseries"]
            .as_array()
            .expect("timeseries is an array");
        let got = q::timeseries(&pool, &filters, Scope::All)
            .await
            .expect("timeseries query");
        assert_eq!(got.len(), want.len(), "{name}: timeseries length");
        for (point, want) in got.iter().zip(want) {
            let label = format!("{name}: timeseries {}", point.month);
            assert_eq!(point.month.to_string(), as_str(&want["month"], &label));
            assert_eq!(point.checks, as_i64(&want["checks"], &label), "{label}");
            assert_close(
                &label,
                point.avg_originality(),
                as_f64(&want["avg_originality"], &label),
            );
        }

        // ── §3 work types ───────────────────────────────────────────────────
        let want = scenario["work_types"]
            .as_array()
            .expect("work_types is an array");
        let got = q::work_types(&pool, &filters, Scope::All)
            .await
            .expect("work_types query");
        assert_eq!(got.len(), want.len(), "{name}: work_types length");
        for (row, want) in got.iter().zip(want) {
            let label = format!("{name}: work_type {}", row.code);
            assert_eq!(row.code, as_str(&want["code"], &label));
            assert_eq!(row.checks, as_i64(&want["checks"], &label), "{label}");
            assert_close(
                &label,
                row.avg_originality(),
                as_f64(&want["avg_originality"], &label),
            );
        }

        // ── §4 units, at department grain ───────────────────────────────────
        let want = scenario["units"].as_array().expect("units is an array");
        let got = q::units(&pool, &filters, Scope::All, UnitDepth::Department)
            .await
            .expect("units query");
        assert_eq!(got.len(), want.len(), "{name}: units length");
        for (row, want) in got.iter().zip(want) {
            let label = format!(
                "{name}: unit {}/{:?}",
                row.faculty_code, row.department_code
            );
            assert_eq!(row.faculty_code, as_str(&want["faculty"], &label));
            assert_eq!(
                row.department_code.as_deref(),
                Some(as_str(&want["department"], &label))
            );
            assert_eq!(row.checks, as_i64(&want["checks"], &label), "{label}");
            assert_close(
                &label,
                row.avg_originality(),
                as_f64(&want["avg_originality"], &label),
            );
        }

        // ── §5 histogram ────────────────────────────────────────────────────
        let want = &scenario["histogram"];
        let got = q::histogram(&pool, &filters, Scope::All)
            .await
            .expect("histogram query");
        for (got, key) in got
            .counts()
            .into_iter()
            .zip(["lt50", "b50_70", "b70_85", "b85_95", "ge95"])
        {
            assert_eq!(got, as_i64(&want[key], name), "{name}: histogram.{key}");
        }

        // ── §9 year over year ───────────────────────────────────────────────
        let want = scenario["yoy"].as_array().expect("yoy is an array");
        let got = q::yoy(&pool, &filters, Scope::All)
            .await
            .expect("yoy query");
        assert_eq!(got.len(), want.len(), "{name}: yoy length");
        for (row, want) in got.iter().zip(want) {
            let label = format!("{name}: yoy {}", row.academic_year.0);
            assert_eq!(
                i64::from(row.academic_year.0),
                as_i64(&want["academic_year"], &label),
                "{label}"
            );
            assert_eq!(row.checks, as_i64(&want["checks"], &label), "{label}");
            assert_close(
                &label,
                row.avg_originality(),
                as_f64(&want["avg_originality"], &label),
            );
        }

        // ── §6 rechecks ─────────────────────────────────────────────────────
        let want = &scenario["rechecks"];
        let got = q::rechecks(&pool, &filters, Scope::All)
            .await
            .expect("rechecks query");
        assert_eq!(
            got.works_total,
            as_i64(&want["works_total"], name),
            "{name}: rechecks.works_total"
        );
        assert_eq!(
            got.works_rechecked,
            as_i64(&want["works_rechecked"], name),
            "{name}: rechecks.works_rechecked"
        );
        assert_eq!(
            got.improved,
            as_i64(&want["improved"], name),
            "{name}: rechecks.improved"
        );

        // ── §7 escalations ──────────────────────────────────────────────────
        let want = &scenario["escalations"];
        let got = q::escalations(&pool, &filters, Scope::All)
            .await
            .expect("escalations query");
        assert_eq!(
            got.checks_escalated,
            as_i64(&want["checks_escalated"], name),
            "{name}: escalations.checks_escalated"
        );
        assert!(
            got.ethics_cases.is_empty(),
            "{name}: the fixture seeds no Ethics Council rows"
        );

        // ── §8 usage ────────────────────────────────────────────────────────
        let want = scenario["usage"].as_array().expect("usage is an array");
        let got = q::usage(&pool, &filters, Scope::All)
            .await
            .expect("usage query");
        assert_eq!(got.len(), want.len(), "{name}: usage length");
        for (point, want) in got.iter().zip(want) {
            let label = format!("{name}: usage {}", point.month);
            assert_eq!(point.month.to_string(), as_str(&want["month"], &label));
            assert_eq!(
                point.active_reviewers,
                as_i64(&want["active_reviewers"], &label),
                "{label}"
            );
            assert_eq!(
                point.avg_check_seconds, None,
                "{label}: «нет данных» until `usage_stats` is filled in"
            );
        }

        // ── §1 coverage ─────────────────────────────────────────────────────
        // The fixture seeds no `submission_totals`, so coverage is hidden
        // entirely rather than reported as zero (ADR-008 §9).
        let coverage = q::coverage(&pool, &filters, Scope::All)
            .await
            .expect("coverage query");
        assert!(
            coverage.is_empty(),
            "{name}: coverage must be empty without denominators"
        );
    }

    Ok(())
}

/// A dean's scope must be indistinguishable from a faculty filter, and must
/// never leak a row from another faculty (AGENTS.md invariant #3).
#[sqlx::test(migrations = "../../migrations")]
async fn scope_isolates_a_faculty_and_a_department(pool: PgPool) -> sqlx::Result<()> {
    let raw = pool.clone();
    let pool = Pool::for_tests(pool);
    support::load_warehouse(&pool).await?;
    let expected = support::expected_json();
    let scenarios = expected["scenarios"]
        .as_array()
        .expect("expected.json carries a scenario array");
    let scenario = |name: &str| -> serde_json::Value {
        scenarios
            .iter()
            .find(|s| s["name"] == name)
            .unwrap_or_else(|| panic!("scenario {name} exists"))
            .clone()
    };

    // The unfiltered, university-wide period: only the scope narrows it.
    let all_time = scenario("all-time-no-filter");
    let filters = scenario_filters(&all_time["filters"]);

    // ── Dean of FAC03 ───────────────────────────────────────────────────────
    let fac03 = scenario("faculty-fac03");
    let scope = Scope::Faculty(support::faculty_id(&raw, "FAC03").await?);

    let got = q::summary(&pool, &filters, scope).await.expect("summary");
    assert_eq!(
        got.checks,
        as_i64(&fac03["summary"]["checks"], "faculty scope"),
        "a faculty scope must count exactly the faculty filter's rows"
    );
    assert_close(
        "faculty scope: avg_originality",
        got.avg_originality(),
        as_f64(&fac03["summary"]["avg_originality"], "faculty scope"),
    );

    let units = q::units(&pool, &filters, scope, UnitDepth::Department)
        .await
        .expect("units");
    assert!(!units.is_empty(), "the scoped faculty has departments");
    assert!(
        units.iter().all(|row| row.faculty_code == "FAC03"),
        "a faculty scope leaked another faculty: {:?}",
        units
            .iter()
            .map(|row| row.faculty_code.as_str())
            .collect::<Vec<_>>()
    );
    assert_eq!(
        units.len(),
        fac03["units"].as_array().map_or(0, Vec::len),
        "faculty scope: unit count"
    );

    let series = q::timeseries(&pool, &filters, scope)
        .await
        .expect("timeseries");
    let want = fac03["timeseries"]
        .as_array()
        .expect("timeseries is an array");
    assert_eq!(series.len(), want.len(), "faculty scope: timeseries length");
    for (point, want) in series.iter().zip(want) {
        let label = format!("faculty scope: timeseries {}", point.month);
        assert_eq!(point.month.to_string(), as_str(&want["month"], &label));
        assert_eq!(point.checks, as_i64(&want["checks"], &label), "{label}");
    }

    // A scope is not a filter the caller can widen: asking for another faculty
    // inside a faculty scope yields nothing, never that faculty's rows.
    let crossed = scenario_filters(&scenario("faculty-fac03")["filters"]);
    let other = Scope::Faculty(support::faculty_id(&raw, "FAC05").await?);
    let leaked = q::summary(&pool, &crossed, other).await.expect("summary");
    assert_eq!(
        leaked.checks, 0,
        "FAC03 rows must be invisible to a FAC05 scope"
    );

    // ── Head of DEP11 ───────────────────────────────────────────────────────
    let dep11 = scenario("department-dep11");
    let scope = Scope::Department(support::department_id(&raw, "DEP11").await?);
    let got = q::summary(&pool, &filters, scope).await.expect("summary");
    assert_eq!(
        got.checks,
        as_i64(&dep11["summary"]["checks"], "department scope"),
        "a department scope must count exactly the department filter's rows"
    );

    let units = q::units(&pool, &filters, scope, UnitDepth::Department)
        .await
        .expect("units");
    assert_eq!(units.len(), 1, "a department scope sees one department");
    assert_eq!(units[0].department_code.as_deref(), Some("DEP11"));

    let rechecks = q::rechecks(&pool, &filters, scope).await.expect("rechecks");
    assert_eq!(
        rechecks.works_total,
        as_i64(&dep11["rechecks"]["works_total"], "department scope"),
        "department scope: rechecks.works_total"
    );

    Ok(())
}
