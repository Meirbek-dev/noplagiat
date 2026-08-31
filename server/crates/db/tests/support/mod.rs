//! Shared fixture loading for the `db` integration tests.
//!
//! Tests load `fixtures/out/facts.jsonl` - the pre-derived fact rows - rather
//! than the source CSVs: CSV parsing, HMAC derivation and the status ladder
//! belong to the ingest lane, and re-implementing them here would make a
//! numeric disagreement between the two lanes invisible (fixtures/README.md
//! "Independence").

#![allow(dead_code, reason = "each test binary uses a different subset")]
// `server/clippy.toml` already declares `allow-expect-in-tests`; that lint
// config reaches `#[test]` functions but not the helpers they call, and these
// helpers exist only to fail a test loudly on a malformed fixture. They are not
// a request path (ARCHITECTURE.md §4.1), which is what the workspace lint
// protects.
#![expect(
    clippy::expect_used,
    reason = "test fixture loading: a malformed fixture must abort the test"
)]

use std::path::{Path, PathBuf};

use db::Pool;
use domain::{CheckStatus, DictionaryCode, Filters, Period};
use sqlx::PgPool;

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

/// Apply `fixtures/dictionaries.sql` (faculties, departments, programmes, work
/// types). Every statement is `ON CONFLICT DO NOTHING`, so it composes with the
/// sentinel rows migration 0002 already inserted.
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

/// Dictionaries plus all 60 000 fact rows plus a matview refresh.
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

/// Turn one `expected.json` scenario filter object into a [`Filters`] value.
pub fn scenario_filters(spec: &serde_json::Value) -> Filters {
    let date = |key: &str| -> jiff::civil::Date {
        spec[key]
            .as_str()
            .expect("scenario filter has a date")
            .parse()
            .expect("scenario date is ISO 8601")
    };
    let period = Period::new(date("from"), date("to")).expect("scenario period is ordered");
    let code = |value: &serde_json::Value| {
        DictionaryCode::new(value.as_str().expect("code is a string").to_owned())
            .expect("scenario code is valid")
    };

    let mut filters = Filters::new(period);
    if !spec["faculty"].is_null() {
        filters = filters.with_faculty(code(&spec["faculty"]));
    }
    if !spec["department"].is_null() {
        filters = filters.with_department(code(&spec["department"]));
    }
    if !spec["program"].is_null() {
        filters = filters.with_program(code(&spec["program"]));
    }
    if !spec["workType"].is_null() {
        filters = filters.with_work_type(code(&spec["workType"]));
    }
    if !spec["status"].is_null() {
        let status: CheckStatus =
            serde_json::from_value(spec["status"].clone()).expect("scenario status is known");
        filters = filters.with_status(status);
    }
    filters
}

/// `expected.json` rounds means half-up to 4 dp, so a computed mean may differ
/// from the published one by at most half of the last digit.
pub const MEAN_TOLERANCE: f64 = 5e-5 + 1e-9;

pub fn assert_close(context: &str, got: Option<f64>, want: f64) {
    let got = got.unwrap_or_else(|| panic!("{context}: expected a value, got an empty group"));
    assert!(
        (got - want).abs() <= MEAN_TOLERANCE,
        "{context}: got {got}, expected {want} (tolerance {MEAN_TOLERANCE})"
    );
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

/// Resolve a dictionary code to its id, for scope construction.
pub async fn faculty_id(pool: &PgPool, code: &str) -> sqlx::Result<i64> {
    sqlx::query_scalar("SELECT id FROM faculties WHERE code = $1")
        .bind(code)
        .fetch_one(pool)
        .await
}

pub async fn department_id(pool: &PgPool, code: &str) -> sqlx::Result<i64> {
    sqlx::query_scalar("SELECT id FROM departments WHERE code = $1")
        .bind(code)
        .fetch_one(pool)
        .await
}
