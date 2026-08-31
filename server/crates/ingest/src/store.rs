//! Every SQL statement the ingest lane issues.
//!
//! **Lane deviation (ADR-011).** The warehouse SQL normally lives in `db`; this
//! module keeps the ingest writer path inside the ingest crate so the `db` and
//! `ingest` lanes can proceed in parallel without editing the same files. The
//! path is a single-writer, transactional one - it never serves a request, so
//! it needs no `compliance::Scope` (AGENTS.md invariant #3 governs *query*
//! functions, and there are none here).
//!
//! Statements go through `sqlx::query!`/`query_scalar!` so the schema checks
//! them at compile time. The one exception is `REFRESH MATERIALIZED VIEW`,
//! whose target is an identifier: it is composed from `pg_matviews` - a
//! catalogue, never user input - and quoted.

use std::collections::HashMap;

use domain::{REF_LEN, ReviewerRef, StatusRules};
use sqlx::{PgPool, Postgres, Transaction};
use time::OffsetDateTime;

use crate::error::{ConfigError, StoreError};
use crate::rules::{InitiatorRule, RuleSet, WorkTypeRule};
use crate::source_csv::ControlTotals;

/// Project-wide advisory-lock key. Every ingest runner - the nightly task, the
/// CLI and (later) the admin trigger - takes this one lock, so a run is
/// single-flight across processes (ARCHITECTURE §4.4, ADR-005).
pub const INGEST_ADVISORY_LOCK: i64 = 0x6E70_6C67_0000_0001;

/// Rows per `INSERT … ON CONFLICT` statement. Parameters are arrays, so this
/// bounds memory and message size, not the parameter count.
const UPSERT_CHUNK: usize = 5_000;

/// Cap on rejections listed in `ingest_batches.errors`; the surplus is counted.
pub const MAX_PERSISTED_REJECTIONS: usize = 1_000;

/// Settings the derivation reads (ADR-008 §4).
#[derive(Debug, Clone)]
pub struct DerivationSettings {
    pub status_rules: StatusRules,
    pub originality_threshold: domain::OriginalityPct,
}

/// One warehouse row taking part in a work's attempt ladder.
#[derive(Debug, Clone)]
pub struct ExistingAttempt {
    pub id: i64,
    pub work_ref: Vec<u8>,
    pub source_check_id: String,
    pub checked_at_nanos: i128,
    pub attempt_no: i32,
    pub originality_hundredths: i32,
    pub suspicious: bool,
    pub suspicion_cleared: bool,
}

/// A row about to be written, with its ladder position already decided.
#[derive(Debug, Clone)]
pub struct CheckUpsert {
    pub source_check_id: String,
    pub attempt_no: i32,
    pub checked_at: OffsetDateTime,
    pub academic_year: i16,
    pub work_type_id: i64,
    pub faculty_id: i64,
    pub department_id: i64,
    pub program_id: Option<i64>,
    pub originality_hundredths: i32,
    pub status: &'static str,
    pub escalated: bool,
    pub initiator: &'static str,
    pub duration_seconds: Option<i32>,
    pub work_ref: Option<Vec<u8>>,
    pub reviewer_ref: Option<Vec<u8>>,
    pub self_citation_hundredths: Option<i32>,
    pub citation_hundredths: Option<i32>,
    pub match_hundredths: Option<i32>,
    pub ai_content_hundredths: Option<i32>,
    pub suspicious: bool,
    pub suspicion_cleared: bool,
    pub deleted: bool,
}

/// A stored row whose ladder position changed and must be rewritten.
#[derive(Debug, Clone, Copy)]
pub struct Renumber {
    pub id: i64,
    pub attempt_no: i32,
    pub status: &'static str,
    pub escalated: bool,
}

/// Dictionary code → id, with the `dict_aliases` fallback (ADR-010 §3).
#[derive(Debug, Clone, Default)]
pub struct Dictionaries {
    by_code: HashMap<(&'static str, String), i64>,
    aliases: HashMap<(String, String), i64>,
}

impl Dictionaries {
    /// Resolve a source code: the dictionary's own `code` first, then an
    /// administrator-maintained alias. Never guessed.
    #[must_use]
    pub fn resolve(&self, kind: &'static str, code: &str) -> Option<i64> {
        self.by_code
            .get(&(kind, code.to_owned()))
            .or_else(|| self.aliases.get(&(kind.to_owned(), code.to_owned())))
            .copied()
    }

    fn require(&self, kind: &'static str, code: &'static str) -> Result<i64, StoreError> {
        self.resolve(kind, code)
            .ok_or(StoreError::MissingSentinel { kind, code })
    }
}

/// Load every dictionary code and alias.
pub async fn load_dictionaries(pool: &PgPool) -> Result<Dictionaries, StoreError> {
    let mut by_code = HashMap::new();
    for row in sqlx::query!(r#"SELECT code, id FROM faculties"#)
        .fetch_all(pool)
        .await?
    {
        by_code.insert(("faculty", row.code), row.id);
    }
    for row in sqlx::query!(r#"SELECT code, id FROM departments"#)
        .fetch_all(pool)
        .await?
    {
        by_code.insert(("department", row.code), row.id);
    }
    for row in sqlx::query!(r#"SELECT code, id FROM programs"#)
        .fetch_all(pool)
        .await?
    {
        by_code.insert(("program", row.code), row.id);
    }
    for row in sqlx::query!(r#"SELECT code, id FROM work_types"#)
        .fetch_all(pool)
        .await?
    {
        by_code.insert(("work_type", row.code), row.id);
    }

    let mut aliases = HashMap::new();
    for row in sqlx::query!(r#"SELECT kind, source_label, target_id FROM dict_aliases"#)
        .fetch_all(pool)
        .await?
    {
        aliases.insert((row.kind, row.source_label), row.target_id);
    }

    Ok(Dictionaries { by_code, aliases })
}

/// Load the derivation rule set (ADR-008 §5, §6, §7).
///
/// An `initiator_rules.pattern` that does not compile is skipped with a warning
/// rather than failing the batch: one bad admin edit must not stop the nightly
/// ingest. The warning names the rule id, never the pattern.
pub async fn load_rule_set(pool: &PgPool) -> Result<RuleSet, StoreError> {
    let dictionaries = load_dictionaries(pool).await?;
    let default_work_type_id = dictionaries.require("work_type", "other")?;
    let unassigned_faculty_id = dictionaries.require("faculty", "UNASSIGNED")?;
    let unassigned_department_id = dictionaries.require("department", "UNASSIGNED")?;

    let work_types = sqlx::query!(
        r#"SELECT pattern, work_type_id
           FROM work_type_rules
           WHERE active
           ORDER BY priority, id"#
    )
    .fetch_all(pool)
    .await?
    .into_iter()
    .map(|row| WorkTypeRule {
        pattern: crate::norm::norm(&row.pattern),
        work_type_id: row.work_type_id,
    })
    .collect();

    let mut initiators = Vec::new();
    for row in sqlx::query!(
        r#"SELECT id, pattern, initiator::text AS "initiator!"
           FROM initiator_rules
           WHERE active
           ORDER BY priority, id"#
    )
    .fetch_all(pool)
    .await?
    {
        let Some(initiator) = parse_initiator(&row.initiator) else {
            tracing::warn!(rule_id = row.id, "initiator rule has an unknown role");
            continue;
        };
        match regex::Regex::new(&row.pattern) {
            Ok(pattern) => initiators.push(InitiatorRule { pattern, initiator }),
            Err(_) => tracing::warn!(rule_id = row.id, "initiator rule pattern does not compile"),
        }
    }

    let mut staff_units = HashMap::new();
    for row in sqlx::query!(r#"SELECT email_hmac, faculty_id, department_id FROM staff_units"#)
        .fetch_all(pool)
        .await?
    {
        if let Ok(digest) = <[u8; REF_LEN]>::try_from(row.email_hmac.as_slice()) {
            staff_units.insert(digest, (row.faculty_id, row.department_id));
        }
    }

    Ok(RuleSet::new(
        work_types,
        initiators,
        staff_units,
        default_work_type_id,
        unassigned_faculty_id,
        unassigned_department_id,
    ))
}

fn parse_initiator(value: &str) -> Option<domain::InitiatorRole> {
    match value {
        "student" => Some(domain::InitiatorRole::Student),
        "staff_self" => Some(domain::InitiatorRole::StaffSelf),
        "registrar" => Some(domain::InitiatorRole::Registrar),
        "other" => Some(domain::InitiatorRole::Other),
        _ => None,
    }
}

/// Load `settings.status_rules` and `settings.originality_threshold`.
pub async fn load_derivation_settings(pool: &PgPool) -> Result<DerivationSettings, StoreError> {
    let rows = sqlx::query!(
        r#"SELECT key, value FROM settings WHERE key IN ('status_rules', 'originality_threshold')"#
    )
    .fetch_all(pool)
    .await?;

    let mut status_rules = None;
    let mut threshold = None;
    for row in rows {
        match row.key.as_str() {
            "status_rules" => status_rules = serde_json::from_value::<StatusRules>(row.value).ok(),
            "originality_threshold" => threshold = row.value.as_f64(),
            _ => {}
        }
    }

    let threshold = threshold.ok_or(StoreError::MissingSetting {
        key: "originality_threshold",
    })?;
    let hundredths = (threshold * 100.0).round();
    let originality_threshold = u16::try_from(hundredths as i64)
        .ok()
        .and_then(|value| domain::OriginalityPct::from_hundredths(value).ok())
        .ok_or(StoreError::MissingSetting {
            key: "originality_threshold",
        })?;

    Ok(DerivationSettings {
        status_rules: status_rules.ok_or(StoreError::MissingSetting {
            key: "status_rules",
        })?,
        originality_threshold,
    })
}

/// Open an `ingest_batches` row. Committed immediately, outside the data
/// transaction, so a failed batch still leaves an auditable record (TZ §3.3.5).
pub async fn start_batch(pool: &PgPool, source: &str, mode: &str) -> Result<i64, StoreError> {
    let id = sqlx::query_scalar!(
        r#"INSERT INTO ingest_batches (source, mode) VALUES ($1, $2) RETURNING id"#,
        source,
        mode
    )
    .fetch_one(pool)
    .await?;
    Ok(id)
}

/// Close an `ingest_batches` row with its counters, error list and status.
#[allow(clippy::too_many_arguments)]
pub async fn finish_batch(
    pool: &PgPool,
    batch_id: i64,
    rows_read: i32,
    rows_upserted: i32,
    rows_rejected: i32,
    rows_skipped_deleted: i32,
    errors: serde_json::Value,
    status: &str,
) -> Result<(), StoreError> {
    sqlx::query!(
        r#"UPDATE ingest_batches
           SET finished_at = now(),
               rows_read = $2,
               rows_upserted = $3,
               rows_rejected = $4,
               rows_skipped_deleted = $5,
               errors = $6,
               status = $7
           WHERE id = $1"#,
        batch_id,
        rows_read,
        rows_upserted,
        rows_rejected,
        rows_skipped_deleted,
        errors,
        status
    )
    .execute(pool)
    .await?;
    Ok(())
}

/// Take the transaction-scoped advisory lock. Released on commit or rollback,
/// so a crashed runner never leaves the lock held.
pub async fn lock(tx: &mut Transaction<'_, Postgres>) -> Result<(), StoreError> {
    sqlx::query!(r#"SELECT pg_advisory_xact_lock($1)"#, INGEST_ADVISORY_LOCK)
        .execute(&mut **tx)
        .await?;
    Ok(())
}

/// Rows already in the warehouse for the given works, for ladder continuation.
pub async fn load_existing_attempts(
    tx: &mut Transaction<'_, Postgres>,
    work_refs: &[Vec<u8>],
) -> Result<Vec<ExistingAttempt>, StoreError> {
    if work_refs.is_empty() {
        return Ok(Vec::new());
    }
    let rows = sqlx::query!(
        r#"SELECT id,
                  work_ref AS "work_ref!",
                  source_check_id,
                  checked_at,
                  attempt_no,
                  (originality_pct * 100)::int AS "originality_hundredths!",
                  suspicious,
                  suspicion_cleared
           FROM checks
           WHERE work_ref = ANY($1::bytea[])"#,
        work_refs
    )
    .fetch_all(&mut **tx)
    .await?;

    Ok(rows
        .into_iter()
        .map(|row| ExistingAttempt {
            id: row.id,
            work_ref: row.work_ref,
            source_check_id: row.source_check_id,
            checked_at_nanos: row.checked_at.unix_timestamp_nanos(),
            attempt_no: row.attempt_no,
            originality_hundredths: row.originality_hundredths,
            suspicious: row.suspicious,
            suspicion_cleared: row.suspicion_cleared,
        })
        .collect())
}

/// Rewrite the ladder positions of stored rows whose ordinal changed.
///
/// Two phases: negate first, then assign. `UNIQUE (source_check_id,
/// attempt_no)` is checked per row and is not deferrable, so a straight update
/// would collide with a row it is about to move.
pub async fn renumber_existing(
    tx: &mut Transaction<'_, Postgres>,
    updates: &[Renumber],
) -> Result<(), StoreError> {
    if updates.is_empty() {
        return Ok(());
    }
    let ids: Vec<i64> = updates.iter().map(|update| update.id).collect();
    sqlx::query!(
        r#"UPDATE checks SET attempt_no = -attempt_no WHERE id = ANY($1::bigint[])"#,
        &ids
    )
    .execute(&mut **tx)
    .await?;

    let attempts: Vec<i32> = updates.iter().map(|update| update.attempt_no).collect();
    let statuses: Vec<String> = updates
        .iter()
        .map(|update| update.status.to_owned())
        .collect();
    let escalated: Vec<bool> = updates.iter().map(|update| update.escalated).collect();

    sqlx::query!(
        r#"UPDATE checks AS c
           SET attempt_no = t.attempt_no,
               status = t.status::check_status,
               escalated = t.escalated
           FROM UNNEST($1::bigint[], $2::int[], $3::text[], $4::bool[])
                AS t(id, attempt_no, status, escalated)
           WHERE c.id = t.id"#,
        &ids,
        &attempts,
        &statuses,
        &escalated
    )
    .execute(&mut **tx)
    .await?;
    Ok(())
}

/// Idempotent fact upsert (TZ §3.3.4).
///
/// Percentages travel as integer hundredths and become `NUMERIC` inside the
/// statement, so no float ever decides a histogram bucket. Enum columns travel
/// as `text` and are cast in SQL, which keeps the statement compile-checkable
/// without a custom type mapping.
pub async fn upsert_checks(
    tx: &mut Transaction<'_, Postgres>,
    batch_id: i64,
    rows: &[CheckUpsert],
) -> Result<u64, StoreError> {
    let mut upserted = 0_u64;
    for chunk in rows.chunks(UPSERT_CHUNK) {
        let source_check_id: Vec<String> =
            chunk.iter().map(|r| r.source_check_id.clone()).collect();
        let attempt_no: Vec<i32> = chunk.iter().map(|r| r.attempt_no).collect();
        let checked_at: Vec<OffsetDateTime> = chunk.iter().map(|r| r.checked_at).collect();
        let academic_year: Vec<i16> = chunk.iter().map(|r| r.academic_year).collect();
        let work_type_id: Vec<i64> = chunk.iter().map(|r| r.work_type_id).collect();
        let faculty_id: Vec<i64> = chunk.iter().map(|r| r.faculty_id).collect();
        let department_id: Vec<i64> = chunk.iter().map(|r| r.department_id).collect();
        let program_id: Vec<Option<i64>> = chunk.iter().map(|r| r.program_id).collect();
        let originality: Vec<i32> = chunk.iter().map(|r| r.originality_hundredths).collect();
        let status: Vec<String> = chunk.iter().map(|r| r.status.to_owned()).collect();
        let escalated: Vec<bool> = chunk.iter().map(|r| r.escalated).collect();
        let initiator: Vec<String> = chunk.iter().map(|r| r.initiator.to_owned()).collect();
        let duration: Vec<Option<i32>> = chunk.iter().map(|r| r.duration_seconds).collect();
        let work_ref: Vec<Option<Vec<u8>>> = chunk.iter().map(|r| r.work_ref.clone()).collect();
        let reviewer_ref: Vec<Option<Vec<u8>>> =
            chunk.iter().map(|r| r.reviewer_ref.clone()).collect();
        let self_citation: Vec<Option<i32>> =
            chunk.iter().map(|r| r.self_citation_hundredths).collect();
        let citation: Vec<Option<i32>> = chunk.iter().map(|r| r.citation_hundredths).collect();
        let matched: Vec<Option<i32>> = chunk.iter().map(|r| r.match_hundredths).collect();
        let ai_content: Vec<Option<i32>> = chunk.iter().map(|r| r.ai_content_hundredths).collect();
        let suspicious: Vec<bool> = chunk.iter().map(|r| r.suspicious).collect();
        let cleared: Vec<bool> = chunk.iter().map(|r| r.suspicion_cleared).collect();
        let deleted: Vec<bool> = chunk.iter().map(|r| r.deleted).collect();

        let result = sqlx::query!(
            r#"INSERT INTO checks (
                   source_check_id, attempt_no, checked_at, academic_year,
                   work_type_id, faculty_id, department_id, program_id,
                   originality_pct, status, escalated, initiator, duration_seconds,
                   ingest_batch_id, work_ref, reviewer_ref,
                   self_citation_pct, citation_pct, match_pct, ai_content_pct,
                   suspicious, suspicion_cleared, deleted
               )
               SELECT t.source_check_id,
                      t.attempt_no,
                      t.checked_at,
                      t.academic_year,
                      t.work_type_id,
                      t.faculty_id,
                      t.department_id,
                      t.program_id,
                      t.originality::numeric / 100,
                      t.status::check_status,
                      t.escalated,
                      t.initiator::initiator_role,
                      t.duration_seconds,
                      $1::bigint,
                      t.work_ref,
                      t.reviewer_ref,
                      t.self_citation::numeric / 100,
                      t.citation::numeric / 100,
                      t.matched::numeric / 100,
                      t.ai_content::numeric / 100,
                      t.suspicious,
                      t.cleared,
                      t.deleted
               FROM UNNEST(
                        $2::text[], $3::int[], $4::timestamptz[], $5::smallint[],
                        $6::bigint[], $7::bigint[], $8::bigint[], $9::bigint[],
                        $10::int[], $11::text[], $12::bool[], $13::text[], $14::int[],
                        $15::bytea[], $16::bytea[],
                        $17::int[], $18::int[], $19::int[], $20::int[],
                        $21::bool[], $22::bool[], $23::bool[]
                    ) AS t(
                        source_check_id, attempt_no, checked_at, academic_year,
                        work_type_id, faculty_id, department_id, program_id,
                        originality, status, escalated, initiator, duration_seconds,
                        work_ref, reviewer_ref,
                        self_citation, citation, matched, ai_content,
                        suspicious, cleared, deleted
                    )
               ON CONFLICT (source_check_id, attempt_no) DO UPDATE SET
                   checked_at        = EXCLUDED.checked_at,
                   academic_year     = EXCLUDED.academic_year,
                   work_type_id      = EXCLUDED.work_type_id,
                   faculty_id        = EXCLUDED.faculty_id,
                   department_id     = EXCLUDED.department_id,
                   program_id        = EXCLUDED.program_id,
                   originality_pct   = EXCLUDED.originality_pct,
                   status            = EXCLUDED.status,
                   escalated         = EXCLUDED.escalated,
                   initiator         = EXCLUDED.initiator,
                   duration_seconds  = EXCLUDED.duration_seconds,
                   ingest_batch_id   = EXCLUDED.ingest_batch_id,
                   work_ref          = EXCLUDED.work_ref,
                   reviewer_ref      = EXCLUDED.reviewer_ref,
                   self_citation_pct = EXCLUDED.self_citation_pct,
                   citation_pct      = EXCLUDED.citation_pct,
                   match_pct         = EXCLUDED.match_pct,
                   ai_content_pct    = EXCLUDED.ai_content_pct,
                   suspicious        = EXCLUDED.suspicious,
                   suspicion_cleared = EXCLUDED.suspicion_cleared,
                   deleted           = EXCLUDED.deleted"#,
            batch_id,
            &source_check_id,
            &attempt_no,
            &checked_at,
            &academic_year,
            &work_type_id,
            &faculty_id,
            &department_id,
            &program_id as &[Option<i64>],
            &originality,
            &status,
            &escalated,
            &initiator,
            &duration as &[Option<i32>],
            &work_ref as &[Option<Vec<u8>>],
            &reviewer_ref as &[Option<Vec<u8>>],
            &self_citation as &[Option<i32>],
            &citation as &[Option<i32>],
            &matched as &[Option<i32>],
            &ai_content as &[Option<i32>],
            &suspicious,
            &cleared,
            &deleted
        )
        .execute(&mut **tx)
        .await?;
        upserted += result.rows_affected();
    }
    Ok(upserted)
}

/// Refresh every materialized view, concurrently where possible.
///
/// The view set is enumerated rather than hard-coded: the `db` lane adds
/// `agg_rechecks_yearly` and `agg_usage_monthly` in migration 0003, and ingest
/// must not need a code change to keep them fresh. A view that has never been
/// populated cannot be refreshed `CONCURRENTLY`, and neither can one without a
/// unique index - both fall back to a plain refresh.
///
/// Runs after the batch transaction commits: `CONCURRENTLY` cannot run inside a
/// transaction block.
pub async fn refresh_materialized_views(pool: &PgPool) -> Result<Vec<String>, StoreError> {
    let views = sqlx::query!(
        r#"SELECT matviewname::text AS name, ispopulated
           FROM pg_matviews
           WHERE schemaname = current_schema()
           ORDER BY matviewname"#
    )
    .fetch_all(pool)
    .await?;

    let mut refreshed = Vec::new();
    for view in views {
        let Some(name) = view.name else { continue };
        let quoted = quote_identifier(&name);
        let populated = view.ispopulated.unwrap_or(false);

        if populated {
            let concurrent = format!("REFRESH MATERIALIZED VIEW CONCURRENTLY {quoted}");
            // `AssertSqlSafe`: the statement is a constant plus one identifier
            // read out of `pg_matviews` and quoted above - no request value can
            // reach it (AGENTS.md §5 forbids concatenating *user input*).
            if sqlx::query(sqlx::AssertSqlSafe(concurrent))
                .execute(pool)
                .await
                .is_ok()
            {
                refreshed.push(name);
                continue;
            }
            tracing::debug!(
                view = %name,
                "concurrent refresh unavailable, falling back to a blocking refresh"
            );
        }

        let plain = format!("REFRESH MATERIALIZED VIEW {quoted}");
        sqlx::query(sqlx::AssertSqlSafe(plain))
            .execute(pool)
            .await?;
        refreshed.push(name);
    }
    Ok(refreshed)
}

/// Quote a catalogue identifier. The input comes from `pg_matviews`, never from
/// a request, but a doubled quote costs nothing and closes the shape entirely.
fn quote_identifier(name: &str) -> String {
    format!("\"{}\"", name.replace('"', "\"\""))
}

/// Upsert the `system-usage.csv` control figures for one academic year.
pub async fn upsert_control_totals(
    pool: &PgPool,
    academic_year: i16,
    totals: ControlTotals,
) -> Result<(), StoreError> {
    sqlx::query!(
        r#"INSERT INTO source_control_totals (
               academic_year, users_total, active_users,
               storage_documents, index_documents, checks_total, avg_checks
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7::int::numeric / 100)
           ON CONFLICT (academic_year) DO UPDATE SET
               users_total       = EXCLUDED.users_total,
               active_users      = EXCLUDED.active_users,
               storage_documents = EXCLUDED.storage_documents,
               index_documents   = EXCLUDED.index_documents,
               checks_total      = EXCLUDED.checks_total,
               avg_checks        = EXCLUDED.avg_checks"#,
        academic_year,
        totals.users_total,
        totals.active_users,
        totals.storage_documents,
        totals.index_documents,
        totals.checks_total,
        totals.avg_checks_hundredths
    )
    .execute(pool)
    .await?;
    Ok(())
}

/// A configured source (`ingest_sources`).
#[derive(Debug, Clone)]
pub struct SourceRow {
    pub id: i64,
    pub kind: String,
    pub base_url: Option<String>,
    pub cursor: Option<serde_json::Value>,
}

/// Every enabled source, in id order.
pub async fn load_enabled_sources(pool: &PgPool) -> Result<Vec<SourceRow>, StoreError> {
    let rows = sqlx::query!(
        r#"SELECT id, kind, base_url, cursor FROM ingest_sources WHERE enabled ORDER BY id"#
    )
    .fetch_all(pool)
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| SourceRow {
            id: row.id,
            kind: row.kind,
            base_url: row.base_url,
            cursor: row.cursor,
        })
        .collect())
}

/// One source by id, enabled or not (the admin trigger runs disabled sources).
pub async fn load_source(pool: &PgPool, id: i64) -> Result<Option<SourceRow>, StoreError> {
    let row = sqlx::query!(
        r#"SELECT id, kind, base_url, cursor FROM ingest_sources WHERE id = $1"#,
        id
    )
    .fetch_optional(pool)
    .await?;
    Ok(row.map(|row| SourceRow {
        id: row.id,
        kind: row.kind,
        base_url: row.base_url,
        cursor: row.cursor,
    }))
}

/// Advance a pull cursor. Called only after the page's rows are committed, so a
/// crash re-reads at most one page (ADR-010 §2).
pub async fn save_cursor(
    pool: &PgPool,
    id: i64,
    cursor: Option<&serde_json::Value>,
) -> Result<(), StoreError> {
    sqlx::query!(
        r#"UPDATE ingest_sources SET cursor = $2 WHERE id = $1"#,
        id,
        cursor
    )
    .execute(pool)
    .await?;
    Ok(())
}

/// Insert a `staff_units` mapping. Used by the fixture/test seeding path and by
/// the admin editor (W3.7); the warehouse only ever sees a digest and a masked
/// label (ADR-008 §2).
pub async fn upsert_staff_unit(
    pool: &PgPool,
    reviewer: &ReviewerRef,
    faculty_id: i64,
    department_id: i64,
    masked_label: &str,
) -> Result<(), StoreError> {
    sqlx::query!(
        r#"INSERT INTO staff_units (email_hmac, faculty_id, department_id, masked_label)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email_hmac) DO UPDATE SET
               faculty_id    = EXCLUDED.faculty_id,
               department_id = EXCLUDED.department_id,
               masked_label  = EXCLUDED.masked_label,
               updated_at    = now()"#,
        &reviewer.to_vec(),
        faculty_id,
        department_id,
        masked_label
    )
    .execute(pool)
    .await?;
    Ok(())
}

/// Convert a validated instant into the type the `TIMESTAMPTZ` binding wants.
pub fn to_offset_date_time(timestamp: jiff::Timestamp) -> Result<OffsetDateTime, ConfigError> {
    OffsetDateTime::from_unix_timestamp_nanos(timestamp.as_nanosecond()).map_err(|_| {
        ConfigError::Settings {
            key: "checked_at",
            reason: "timestamp is outside the representable range".to_owned(),
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identifiers_are_quoted_and_embedded_quotes_doubled() {
        assert_eq!(quote_identifier("agg_monthly"), "\"agg_monthly\"");
        assert_eq!(quote_identifier("a\"b"), "\"a\"\"b\"");
    }

    #[test]
    fn the_advisory_lock_key_is_a_fixed_project_constant() {
        // Every runner must take the same key or single-flight is a fiction.
        // The value is pinned in ADR-011 so an external tool can take it too.
        assert_eq!(
            format!("{INGEST_ADVISORY_LOCK:#018x}"),
            "0x6e706c6700000001"
        );
    }
}
