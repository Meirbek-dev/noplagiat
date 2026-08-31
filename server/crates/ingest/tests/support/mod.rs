//! Shared scaffolding for the ingest integration tests.
//!
//! `#[sqlx::test]` gives every test a fresh database with the migrations
//! applied - and nothing else. The dictionaries, derivation rules and staff-unit
//! mapping therefore have to be seeded here, from the same fixture artefacts the
//! `db`, `reports` and e2e lanes assert against.
// `server/clippy.toml` already declares `allow-expect-in-tests`; that lint
// config reaches `#[test]` functions but not the helpers they call. A helper
// here exists only to fail the test loudly on a malformed fixture - it is not a
// request path, which is what the workspace lint protects.
#![expect(
    clippy::expect_used,
    reason = "test scaffolding: a malformed fixture must abort the test"
)]
#![allow(dead_code)]

use std::path::{Path, PathBuf};

use ingest::Pepper;
use sqlx::PgPool;

/// Pepper used by every test. Never the production one; ADR-008 §2 keeps that
/// in the environment only.
pub const TEST_PEPPER: &str = "test-pepper";

pub fn pepper() -> Pepper {
    Pepper::new(TEST_PEPPER).expect("a non-empty test pepper")
}

/// Repository root, derived from this crate's manifest directory.
pub fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .ancestors()
        .nth(3)
        .expect("server/crates/ingest has three ancestors up to the repo root")
        .to_path_buf()
}

pub fn fixtures_dir() -> PathBuf {
    repo_root().join("fixtures")
}

pub fn fixtures_out() -> PathBuf {
    fixtures_dir().join("out")
}

/// Academic-year directories the `small` scale produces.
pub const SMALL_SCALE_YEARS: [&str; 3] = ["2023-2024", "2024-2025", "2025-2026"];

/// Generate `fixtures/out` when it is absent.
///
/// `out/` is gitignored and fully reproducible from the seed, so a fresh
/// checkout must be able to run these tests without a separate setup step.
pub fn ensure_fixtures() {
    let out = fixtures_out();
    let complete = SMALL_SCALE_YEARS.iter().all(|year| {
        out.join(year).join("documents.csv").is_file()
            && out.join(year).join("malformed.json").is_file()
    });
    if complete {
        return;
    }

    let status = std::process::Command::new("bun")
        .args(["fixtures/generate.ts", "--scale", "small"])
        .current_dir(repo_root())
        .status()
        .expect("`bun` must be on PATH to generate fixtures (see fixtures/README.md)");
    assert!(status.success(), "fixture generation failed");
}

/// The exact expected rejection/deleted counts for one academic year.
#[derive(Debug, Clone, serde::Deserialize)]
pub struct Sidecar {
    pub academic_year: i64,
    pub rows_total: u64,
    pub rows_importable: u64,
    pub rows_deleted: u64,
    pub rows_rejected_expected: u64,
    pub row_indices: Vec<u64>,
    pub rejections: Rejections,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct Rejections {
    pub column_shifted: RejectionBucket,
    pub unparseable_report_link: RejectionBucket,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct RejectionBucket {
    pub count: u64,
    pub row_indices: Vec<u64>,
}

pub fn sidecar(year: &str) -> Sidecar {
    let path = fixtures_out().join(year).join("malformed.json");
    let raw = std::fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("cannot read {}: {error}", path.display()));
    serde_json::from_str(&raw).expect("malformed.json matches the documented sidecar shape")
}

/// Apply the fixture dictionaries and derivation rules.
pub async fn seed_dictionaries(pool: &PgPool) {
    for file in [
        "dictionaries.sql",
        "work-type-rules.sql",
        "initiator-rules.sql",
    ] {
        let path = fixtures_dir().join(file);
        let sql = std::fs::read_to_string(&path)
            .unwrap_or_else(|error| panic!("cannot read {}: {error}", path.display()));
        sqlx::raw_sql(sqlx::AssertSqlSafe(sql))
            .execute(pool)
            .await
            .unwrap_or_else(|error| panic!("{file}: {error}"));
    }
}

/// Load `fixtures/staff-units.csv` the way `fixtures/seed.ts` does: HMAC the
/// e-mail with the test pepper, store the digest plus a masked label, and never
/// let the address itself reach the database (ADR-008 §2).
pub async fn seed_staff_units(pool: &PgPool) -> usize {
    let path = fixtures_dir().join("staff-units.csv");
    let raw = std::fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("cannot read {}: {error}", path.display()));
    let pepper = pepper();
    let mut seeded = 0;

    for line in raw.lines().skip(1).filter(|line| !line.trim().is_empty()) {
        let mut parts = line.split(';');
        let (Some(email), Some(faculty), Some(department)) =
            (parts.next(), parts.next(), parts.next())
        else {
            continue;
        };
        let faculty_id: i64 = sqlx::query_scalar("SELECT id FROM faculties WHERE code = $1")
            .bind(faculty.trim())
            .fetch_one(pool)
            .await
            .expect("the fixture faculty exists");
        let department_id: i64 = sqlx::query_scalar("SELECT id FROM departments WHERE code = $1")
            .bind(department.trim())
            .fetch_one(pool)
            .await
            .expect("the fixture department exists");

        ingest::store::upsert_staff_unit(
            pool,
            &pepper.reviewer_ref(email),
            faculty_id,
            department_id,
            &ingest::masked_label(email),
        )
        .await
        .expect("staff unit upsert");
        seeded += 1;
    }
    seeded
}

/// Everything a golden run needs: fixtures on disk, dictionaries, rules and the
/// reviewer→unit mapping in the database.
pub async fn seed_all(pool: &PgPool) {
    ensure_fixtures();
    seed_dictionaries(pool).await;
    seed_staff_units(pool).await;
}

pub fn year_dir(year: &str) -> PathBuf {
    fixtures_out().join(year)
}

pub fn documents(year: &str) -> PathBuf {
    year_dir(year).join("documents.csv")
}

/// `(source_check_id, attempt_no)` for every stored fact, sorted.
pub async fn attempt_pairs(pool: &PgPool) -> Vec<(String, i32)> {
    let mut pairs: Vec<(String, i32)> =
        sqlx::query_as("SELECT source_check_id, attempt_no FROM checks")
            .fetch_all(pool)
            .await
            .expect("checks are readable");
    pairs.sort();
    pairs
}

/// One `documents.csv` row in contract order (ADR-008 §1).
pub struct SourceRow {
    pub checked_at: &'static str,
    pub title: &'static str,
    pub authors: &'static str,
    pub originality: &'static str,
    pub reviewer_name: &'static str,
    pub reviewer_email: &'static str,
    pub suspicious: bool,
    pub cleared: bool,
    pub deleted: bool,
    pub report_link: String,
}

impl SourceRow {
    pub fn new(checked_at: &'static str, title: &'static str, link: &str) -> Self {
        Self {
            checked_at,
            title,
            authors: "Тестов Т.Т.",
            originality: "80,00",
            reviewer_name: "Проверяющий П.П.",
            reviewer_email: "p.checker@teachers.tou.edu.kz",
            suspicious: false,
            cleared: false,
            deleted: false,
            report_link: link.to_owned(),
        }
    }

    pub fn originality(mut self, value: &'static str) -> Self {
        self.originality = value;
        self
    }

    pub fn suspicious(mut self, suspicious: bool, cleared: bool) -> Self {
        self.suspicious = suspicious;
        self.cleared = cleared;
        self
    }

    pub fn deleted(mut self) -> Self {
        self.deleted = true;
        self
    }

    pub fn authors(mut self, authors: &'static str) -> Self {
        self.authors = authors;
        self
    }

    pub fn reviewer(mut self, name: &'static str, email: &'static str) -> Self {
        self.reviewer_name = name;
        self.reviewer_email = email;
        self
    }

    /// The row as one CSV record, in contract order.
    pub fn render(&self) -> String {
        let yes_no = |flag: bool| if flag { "Да" } else { "Нет" };
        [
            self.checked_at,
            self.title,
            self.authors,
            self.originality,
            "1,00",
            "2,00",
            "3,00",
            self.reviewer_name,
            self.reviewer_email,
            yes_no(self.suspicious),
            yes_no(self.cleared),
            if self.deleted {
                "Удален"
            } else {
                "Не удален"
            },
            &self.report_link,
            "0,50",
        ]
        .map(escape)
        .join(";")
    }
}

fn escape(field: &str) -> String {
    if field.contains([';', '"', '\n', '\r']) {
        format!("\"{}\"", field.replace('"', "\"\""))
    } else {
        field.to_owned()
    }
}

/// A report link that parses into `"{user}:{report}"`.
pub fn link(user: u64, report: u64) -> String {
    format!("https://noplagiat.tou.edu.kz/report/full/{report}?userId={user}")
}

/// Write a `documents.csv` in the exact source dialect: UTF-8 with BOM, `;`,
/// CRLF record separators, the 14-column contract header.
pub fn write_documents(name: &str, rows: &[SourceRow]) -> PathBuf {
    write_documents_raw(
        name,
        &ingest::source_csv::DOCUMENTS_HEADER.join(";"),
        &rows.iter().map(SourceRow::render).collect::<Vec<_>>(),
    )
}

/// Same, but with a caller-supplied header - for the header-contract gate.
pub fn write_documents_raw(name: &str, header: &str, rows: &[String]) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("noplagiat-ingest-{}", std::process::id()));
    std::fs::create_dir_all(&dir).expect("temp directory");
    let path = dir.join(format!("{name}.csv"));

    let mut body = String::from("\u{feff}");
    body.push_str(header);
    body.push_str("\r\n");
    for row in rows {
        body.push_str(row);
        body.push_str("\r\n");
    }
    std::fs::write(&path, body.as_bytes()).expect("write documents.csv");
    path
}

pub async fn count(pool: &PgPool, table: &'static str) -> i64 {
    let sql = format!("SELECT count(*) FROM {table}");
    sqlx::query_scalar(sqlx::AssertSqlSafe(sql))
        .fetch_one(pool)
        .await
        .expect("count query")
}
