//! Shared helpers for the `reports` integration tests.
//!
//! Fixture loading mirrors `crates/db/tests/support/mod.rs`: the tests read the
//! pre-derived facts of `fixtures/out/facts.jsonl` rather than re-deriving them,
//! so a numeric disagreement between this lane and the ingest lane stays visible
//! (fixtures/README.md "Independence").

#![allow(dead_code, reason = "each test binary uses a different subset")]
// `server/clippy.toml` already declares `allow-expect-in-tests`; that lint config
// reaches `#[test]` functions but not the helpers they call, and these helpers
// exist only to fail a test loudly on a malformed fixture. They are not a
// request path (ARCHITECTURE.md §4.1), which is what the workspace lint protects.
#![expect(
    clippy::expect_used,
    reason = "test fixture loading: a malformed fixture must abort the test"
)]

use std::path::{Path, PathBuf};

use compliance::{KPolicy, KThreshold};
use db::Pool;
use reports::{Cell, Column, Label, Locale, Metric, ReportDoc, ReportSection, ReportTable, Row};
use sqlx::PgPool;

/// Values planted in cells the model marks suppressed. If either renderer ever
/// leaks a withheld number, these are the strings the guard tests look for - a
/// digit sequence distinctive enough that a false positive is impossible.
pub const SECRET_COUNT: i64 = 4_321;
pub const SECRET_PERCENT: f64 = 91.75;

pub fn policy(k: u32) -> KPolicy {
    KPolicy::new(KThreshold::new(k).expect("test threshold is non-zero"))
}

/// Absolute path of the repository `fixtures/` directory.
pub fn fixtures_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../fixtures")
}

pub fn facts_path() -> PathBuf {
    fixtures_root().join("out/facts.jsonl")
}

/// Fail with the exact command that produces the missing artefact rather than
/// skipping the gate (AGENTS.md invariant #7).
pub fn require_fixture(path: &Path) {
    assert!(
        path.exists(),
        "missing fixture {}. Run:\n  bun fixtures/generate.ts --scale small && bun fixtures/expected.ts",
        path.display()
    );
}

pub async fn load_dictionaries(pool: &PgPool) -> sqlx::Result<()> {
    let path = fixtures_root().join("dictionaries.sql");
    require_fixture(&path);
    let sql = std::fs::read_to_string(&path).expect("dictionaries.sql is readable");
    // Generated fixture SQL from the repository, never user input.
    sqlx::raw_sql(sqlx::AssertSqlSafe(sql))
        .execute(pool)
        .await?;
    Ok(())
}

/// Dictionaries plus all fact rows plus a matview refresh.
pub async fn load_warehouse(pool: &Pool) -> sqlx::Result<u64> {
    load_dictionaries(pool).await?;
    let facts = facts_path();
    require_fixture(&facts);
    let upserted = db::checks::load_facts_jsonl(pool, &facts, "fixture")
        .await
        .expect("fixture facts load");
    Ok(upserted)
}

/// The committed reference aggregates.
pub fn expected_json() -> serde_json::Value {
    let path = fixtures_root().join("expected.json");
    require_fixture(&path);
    let raw = std::fs::read_to_string(&path).expect("expected.json is readable");
    serde_json::from_str(&raw).expect("expected.json is valid JSON")
}

/// One scenario of `fixtures/expected.json` by name.
pub fn scenario(expected: &serde_json::Value, name: &str) -> serde_json::Value {
    expected["scenarios"]
        .as_array()
        .expect("expected.json carries a scenario array")
        .iter()
        .find(|scenario| scenario["name"] == name)
        .unwrap_or_else(|| panic!("expected.json has no scenario `{name}`"))
        .clone()
}

pub fn as_i64(value: &serde_json::Value, context: &str) -> i64 {
    value
        .as_i64()
        .unwrap_or_else(|| panic!("{context}: expected an integer, got {value}"))
}

pub fn as_f64(value: &serde_json::Value, context: &str) -> f64 {
    value
        .as_f64()
        .unwrap_or_else(|| panic!("{context}: expected a number, got {value}"))
}

pub fn as_str<'a>(value: &'a serde_json::Value, context: &str) -> &'a str {
    value
        .as_str()
        .unwrap_or_else(|| panic!("{context}: expected a string, got {value}"))
}

/// `expected.json` rounds means half-up to 4 dp, so a computed mean may differ
/// from the published one by at most half of the last digit.
pub const MEAN_TOLERANCE: f64 = 5e-5 + 1e-9;

pub fn assert_close(context: &str, got: f64, want: f64, tolerance: f64) {
    assert!(
        (got - want).abs() <= tolerance,
        "{context}: got {got}, expected {want} (tolerance {tolerance})"
    );
}

/// A document whose every metric sits in a group of 2–3 - below the k = 5 policy
/// the tests use, so every numeric cell must come out suppressed.
///
/// The withheld values are [`SECRET_COUNT`] and [`SECRET_PERCENT`]: the guard
/// tests assert those digit sequences appear nowhere in either rendered format,
/// which is a sharper claim than "the cell says «недостаточно данных»".
pub fn suppressed_doc(locale: Locale) -> ReportDoc {
    let policy = policy(5);
    let strings = locale.strings();
    let table = ReportTable {
        columns: vec![
            Column::text(Label::phrase(strings.column_faculty)),
            Column::numeric(Label::phrase(strings.column_checks)),
            Column::numeric(Label::phrase(strings.column_avg_originality)),
        ],
        rows: vec![
            Row::data(vec![
                Cell::Label(Label::code("FAC01").expect("a dictionary code")),
                Cell::Metric(Metric::count(&policy, 3, SECRET_COUNT)),
                Cell::Metric(Metric::percent(&policy, 3, Some(SECRET_PERCENT))),
            ]),
            Row::data(vec![
                Cell::Label(Label::code("FAC02").expect("a dictionary code")),
                Cell::Metric(Metric::count(&policy, 2, SECRET_COUNT)),
                Cell::Metric(Metric::percent(&policy, 2, Some(SECRET_PERCENT))),
            ]),
        ],
    };

    ReportDoc {
        title: Label::phrase(strings.report_title),
        subtitle: Label::phrase(strings.report_subtitle),
        period: Label::academic_year(strings.period_academic_year, 2025),
        generated_note: Label::date(strings.generated_on, jiff::civil::date(2026, 9, 1)),
        sections: vec![ReportSection {
            title: Label::phrase(strings.section_faculties),
            short_title: Label::phrase(strings.sheet_faculties),
            table,
            footnotes: vec![Label::phrase(strings.note_units_current_mapping)],
        }],
        locale,
    }
}
