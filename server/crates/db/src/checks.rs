//! The fact table: idempotent upsert, plus fixture loading for tests.
//!
//! Writing facts is the ingest lane's job; this module owns only the SQL. The
//! upsert target is the `UNIQUE (source_check_id, attempt_no)` constraint of
//! migration 0001, so re-running a batch converges instead of duplicating
//! (ARCHITECTURE.md §4.4).

use serde::Deserialize;

use crate::{DbError, Pool};

/// Rows per statement. Large enough that 60 000 fixture rows load in a handful
/// of round trips, small enough that no single statement carries an unbounded
/// parameter payload.
const CHUNK_ROWS: usize = 4_000;

/// One check attempt, in the shape the ingest lane and `fixtures/out/facts.jsonl`
/// both speak: dictionary **codes** rather than ids, decimals as exact 2-dp
/// strings rather than floats, and derived references as 64 hex characters.
///
/// Percentages travel as text on purpose. `NUMERIC(5,2)` is exact and the
/// source is exact; routing them through `f64` would introduce a rounding step
/// that `fixtures/expected.json` would then disagree with.
///
/// Unknown JSON fields are ignored so the fixtures lane can add a column
/// without breaking this loader.
#[derive(Debug, Clone, Deserialize)]
pub struct FactRow {
    pub source_check_id: String,
    pub attempt_no: i32,
    pub checked_at: jiff::Timestamp,
    pub academic_year: i16,
    pub work_type_code: String,
    pub faculty_code: String,
    pub department_code: String,
    #[serde(default)]
    pub program_code: Option<String>,
    /// Exact decimal with two fractional digits, e.g. `"91.64"`.
    pub originality_pct: String,
    pub status: domain::CheckStatus,
    pub escalated: bool,
    pub initiator: domain::InitiatorRole,
    #[serde(default)]
    pub suspicious: bool,
    #[serde(default)]
    pub suspicion_cleared: bool,
    /// «Удален» in the source. Deleted rows stay in the warehouse and are
    /// filtered at query time (ADR-008 §4).
    #[serde(default)]
    pub deleted: bool,
    #[serde(default)]
    pub self_citation_pct: Option<String>,
    #[serde(default)]
    pub citation_pct: Option<String>,
    #[serde(default)]
    pub match_pct: Option<String>,
    #[serde(default)]
    pub ai_content_pct: Option<String>,
    /// 64 hex characters of an HMAC-SHA256 digest (ADR-008 §2), or absent for
    /// API-mode rows that carry `attempt_no` and the unit natively.
    #[serde(default)]
    pub work_ref: Option<String>,
    #[serde(default)]
    pub reviewer_ref: Option<String>,
}

/// Columns bound as parallel arrays to one `UNNEST`.
#[derive(Default)]
struct Columns {
    source_check_id: Vec<String>,
    attempt_no: Vec<i32>,
    checked_at: Vec<String>,
    academic_year: Vec<i16>,
    work_type_code: Vec<String>,
    faculty_code: Vec<String>,
    department_code: Vec<String>,
    program_code: Vec<Option<String>>,
    originality_pct: Vec<String>,
    status: Vec<String>,
    escalated: Vec<bool>,
    initiator: Vec<String>,
    self_citation_pct: Vec<Option<String>>,
    citation_pct: Vec<Option<String>>,
    match_pct: Vec<Option<String>>,
    ai_content_pct: Vec<Option<String>>,
    suspicious: Vec<bool>,
    suspicion_cleared: Vec<bool>,
    deleted: Vec<bool>,
    work_ref: Vec<Option<String>>,
    reviewer_ref: Vec<Option<String>>,
}

impl Columns {
    fn from_rows(rows: &[FactRow]) -> Self {
        let mut columns = Self::default();
        for row in rows {
            columns.source_check_id.push(row.source_check_id.clone());
            columns.attempt_no.push(row.attempt_no);
            // RFC 3339 with an explicit offset; PostgreSQL normalizes to UTC.
            columns.checked_at.push(row.checked_at.to_string());
            columns.academic_year.push(row.academic_year);
            columns.work_type_code.push(row.work_type_code.clone());
            columns.faculty_code.push(row.faculty_code.clone());
            columns.department_code.push(row.department_code.clone());
            columns.program_code.push(row.program_code.clone());
            columns.originality_pct.push(row.originality_pct.clone());
            columns
                .status
                .push(crate::filters::status_label(row.status).to_owned());
            columns.escalated.push(row.escalated);
            columns
                .initiator
                .push(crate::filters::initiator_label(row.initiator).to_owned());
            columns
                .self_citation_pct
                .push(row.self_citation_pct.clone());
            columns.citation_pct.push(row.citation_pct.clone());
            columns.match_pct.push(row.match_pct.clone());
            columns.ai_content_pct.push(row.ai_content_pct.clone());
            columns.suspicious.push(row.suspicious);
            columns.suspicion_cleared.push(row.suspicion_cleared);
            columns.deleted.push(row.deleted);
            columns.work_ref.push(row.work_ref.clone());
            columns.reviewer_ref.push(row.reviewer_ref.clone());
        }
        columns
    }
}

/// Upsert a batch of facts, returning the number of rows inserted or updated.
///
/// Idempotent: `ON CONFLICT (source_check_id, attempt_no) DO UPDATE` means a
/// re-run of the same batch converges on the same rows rather than duplicating
/// them. Dictionary codes are resolved **in SQL**; an unknown faculty,
/// department or work type leaves the NOT NULL foreign key unsatisfied and the
/// statement fails loudly instead of guessing (ADR-008 §6, §7).
pub async fn insert_facts(pool: &Pool, batch_id: i64, rows: &[FactRow]) -> Result<u64, DbError> {
    let mut affected = 0_u64;
    for chunk in rows.chunks(CHUNK_ROWS) {
        let columns = Columns::from_rows(chunk);
        let result = sqlx::query!(
            "INSERT INTO checks (
                 source_check_id, attempt_no, checked_at, academic_year,
                 work_type_id, faculty_id, department_id, program_id,
                 originality_pct, status, escalated, initiator,
                 self_citation_pct, citation_pct, match_pct, ai_content_pct,
                 suspicious, suspicion_cleared, deleted, work_ref, reviewer_ref,
                 ingest_batch_id
             )
             SELECT s.source_check_id,
                    s.attempt_no,
                    s.checked_at::timestamptz,
                    s.academic_year,
                    wt.id, f.id, d.id, p.id,
                    s.originality_pct::numeric,
                    s.status::check_status,
                    s.escalated,
                    s.initiator::initiator_role,
                    s.self_citation_pct::numeric,
                    s.citation_pct::numeric,
                    s.match_pct::numeric,
                    s.ai_content_pct::numeric,
                    s.suspicious,
                    s.suspicion_cleared,
                    s.deleted,
                    decode(s.work_ref, 'hex'),
                    decode(s.reviewer_ref, 'hex'),
                    $1
             FROM UNNEST(
                      $2::text[], $3::int4[], $4::text[], $5::int2[],
                      $6::text[], $7::text[], $8::text[], $9::text[],
                      $10::text[], $11::text[], $12::bool[], $13::text[],
                      $14::text[], $15::text[], $16::text[], $17::text[],
                      $18::bool[], $19::bool[], $20::bool[], $21::text[], $22::text[]
                  ) AS s(
                      source_check_id, attempt_no, checked_at, academic_year,
                      work_type_code, faculty_code, department_code, program_code,
                      originality_pct, status, escalated, initiator,
                      self_citation_pct, citation_pct, match_pct, ai_content_pct,
                      suspicious, suspicion_cleared, deleted, work_ref, reviewer_ref
                  )
             LEFT JOIN work_types wt ON wt.code = s.work_type_code
             LEFT JOIN faculties f ON f.code = s.faculty_code
             LEFT JOIN departments d ON d.code = s.department_code
             LEFT JOIN programs p ON p.code = s.program_code
             ON CONFLICT (source_check_id, attempt_no) DO UPDATE SET
                 checked_at = EXCLUDED.checked_at,
                 academic_year = EXCLUDED.academic_year,
                 work_type_id = EXCLUDED.work_type_id,
                 faculty_id = EXCLUDED.faculty_id,
                 department_id = EXCLUDED.department_id,
                 program_id = EXCLUDED.program_id,
                 originality_pct = EXCLUDED.originality_pct,
                 status = EXCLUDED.status,
                 escalated = EXCLUDED.escalated,
                 initiator = EXCLUDED.initiator,
                 self_citation_pct = EXCLUDED.self_citation_pct,
                 citation_pct = EXCLUDED.citation_pct,
                 match_pct = EXCLUDED.match_pct,
                 ai_content_pct = EXCLUDED.ai_content_pct,
                 suspicious = EXCLUDED.suspicious,
                 suspicion_cleared = EXCLUDED.suspicion_cleared,
                 deleted = EXCLUDED.deleted,
                 work_ref = EXCLUDED.work_ref,
                 reviewer_ref = EXCLUDED.reviewer_ref,
                 ingest_batch_id = EXCLUDED.ingest_batch_id",
            batch_id,
            &columns.source_check_id,
            &columns.attempt_no,
            &columns.checked_at,
            &columns.academic_year,
            &columns.work_type_code,
            &columns.faculty_code,
            &columns.department_code,
            &columns.program_code as &[Option<String>],
            &columns.originality_pct,
            &columns.status,
            &columns.escalated,
            &columns.initiator,
            &columns.self_citation_pct as &[Option<String>],
            &columns.citation_pct as &[Option<String>],
            &columns.match_pct as &[Option<String>],
            &columns.ai_content_pct as &[Option<String>],
            &columns.suspicious,
            &columns.suspicion_cleared,
            &columns.deleted,
            &columns.work_ref as &[Option<String>],
            &columns.reviewer_ref as &[Option<String>],
        )
        .execute(pool.pg())
        .await?;
        affected += result.rows_affected();
    }
    Ok(affected)
}

/// Load `fixtures/out/facts.jsonl` into an empty warehouse: one
/// `ingest_batches` row, the facts themselves, then an aggregate refresh.
///
/// Test support only - the real ingest path derives these rows from the source
/// CSV/API and owns HMAC derivation (ADR-008 §2). Returns the number of rows
/// upserted.
#[cfg(any(test, feature = "test-support"))]
pub async fn load_facts_jsonl(
    pool: &Pool,
    path: &std::path::Path,
    source: &str,
) -> Result<u64, DbError> {
    use std::io::BufRead as _;

    let file = std::fs::File::open(path)
        .map_err(|error| DbError::Fixture(format!("{}: {error}", path.display())))?;
    let mut rows = Vec::new();
    for (index, line) in std::io::BufReader::new(file).lines().enumerate() {
        let line =
            line.map_err(|error| DbError::Fixture(format!("line {}: {error}", index + 1)))?;
        if line.trim().is_empty() {
            continue;
        }
        let row: FactRow = serde_json::from_str(&line)
            .map_err(|error| DbError::Fixture(format!("line {}: {error}", index + 1)))?;
        rows.push(row);
    }

    let batch_id = crate::batches::start(pool, source, crate::batches::Mode::Csv).await?;
    let upserted = insert_facts(pool, batch_id, &rows).await?;
    let read = i32::try_from(rows.len()).unwrap_or(i32::MAX);
    crate::batches::finish(
        pool,
        batch_id,
        &crate::batches::BatchOutcome {
            rows_read: read,
            rows_upserted: i32::try_from(upserted).unwrap_or(i32::MAX),
            rows_rejected: 0,
            rows_skipped_deleted: 0,
            errors: serde_json::Value::Array(Vec::new()),
            status: crate::batches::BatchStatus::Succeeded,
        },
    )
    .await?;
    crate::agg::refresh_all(pool).await?;
    Ok(upserted)
}
