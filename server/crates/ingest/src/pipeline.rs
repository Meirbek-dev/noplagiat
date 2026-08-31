//! Batch orchestration: read → derive → group → upsert → refresh.
//!
//! One transaction per batch, guarded by the project advisory lock, with the
//! `ingest_batches` row opened before and closed after it so a failure is still
//! auditable (TZ §3.3.5). Materialized views are refreshed after the commit -
//! `REFRESH … CONCURRENTLY` cannot run inside a transaction block.

use std::collections::HashMap;
use std::path::{Path, PathBuf};

use domain::{AcademicYear, CheckStatus, InitiatorRole, StatusInput};
use sqlx::PgPool;

use crate::attempts::{AttemptKey, assign_ordinals};
use crate::error::{IngestError, RejectionKind, RowRejection, SourceError, StoreError};
use crate::refs::Pepper;
use crate::row::{ParsedRow, RowOutcome, parse_row};
use crate::rules::RuleSet;
use crate::source_csv;
use crate::store::{self, CheckUpsert, DerivationSettings, MAX_PERSISTED_REJECTIONS, Renumber};

/// Counters mirrored into `ingest_batches`.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct BatchSummary {
    pub batch_id: i64,
    pub rows_read: u64,
    pub rows_upserted: u64,
    pub rows_rejected: u64,
    pub rows_skipped_deleted: u64,
    /// `succeeded` or `failed` - mirrors `ingest_batches.status`.
    pub status: BatchStatus,
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub enum BatchStatus {
    #[default]
    Succeeded,
    Failed,
}

impl BatchStatus {
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Succeeded => "succeeded",
            Self::Failed => "failed",
        }
    }
}

/// The result of ingesting one academic-year directory.
#[derive(Debug, Clone)]
pub struct YearReport {
    pub directory: String,
    pub academic_year: Option<AcademicYear>,
    pub summary: BatchSummary,
}

/// Ingest every `YYYY-YYYY` directory found under `root`, or `root` itself when
/// it already is one.
pub async fn run_csv_tree(
    pool: &PgPool,
    root: &Path,
    source: &str,
    pepper: &Pepper,
) -> Result<Vec<YearReport>, IngestError> {
    let mut reports = Vec::new();
    for directory in academic_year_directories(root)? {
        let academic_year = academic_year_of(&directory);
        let documents = directory.join("documents.csv");
        let summary = run_csv_file(pool, &documents, source, pepper).await?;

        // `user-intensity.csv` is never imported (ADR-008 §1) - it carries ФИО
        // and adds no signal: monthly active reviewers come from reviewer_ref.
        let usage = directory.join("system-usage.csv");
        if let (Some(year), true) = (academic_year, usage.is_file()) {
            let totals = source_csv::read_control_totals(&usage)?;
            store::upsert_control_totals(pool, year.0, totals).await?;
        }

        reports.push(YearReport {
            directory: directory.display().to_string(),
            academic_year,
            summary,
        });
    }
    Ok(reports)
}

/// Ingest one `documents.csv`.
pub async fn run_csv_file(
    pool: &PgPool,
    documents: &Path,
    source: &str,
    pepper: &Pepper,
) -> Result<BatchSummary, IngestError> {
    let batch_id = store::start_batch(pool, source, "csv").await?;
    match ingest_documents(pool, documents, pepper, batch_id).await {
        Ok(summary) => Ok(summary),
        Err(error) => {
            // The batch row must record the failure, not vanish with it.
            let errors = match &error {
                IngestError::Source(SourceError::Batch(batch)) => {
                    serde_json::json!([batch])
                }
                IngestError::Batch(batch) => serde_json::json!([batch]),
                _ => serde_json::json!([]),
            };
            store::finish_batch(
                pool,
                batch_id,
                0,
                0,
                0,
                0,
                errors,
                BatchStatus::Failed.as_str(),
            )
            .await?;
            Err(error)
        }
    }
}

async fn ingest_documents(
    pool: &PgPool,
    documents: &Path,
    pepper: &Pepper,
    batch_id: i64,
) -> Result<BatchSummary, IngestError> {
    let rules = store::load_rule_set(pool).await?;
    let settings = store::load_derivation_settings(pool).await?;

    let parsed = read_documents(documents, pepper, &rules)?;
    tracing::info!(
        batch_id,
        rows_read = parsed.rows_read,
        rows_rejected = parsed.rejections.len(),
        rows_skipped_deleted = parsed.rows_skipped_deleted,
        "documents parsed"
    );

    let mut tx = pool.begin().await.map_err(StoreError::Sqlx)?;
    store::lock(&mut tx).await?;

    let work_refs: Vec<Vec<u8>> = {
        let mut seen: Vec<Vec<u8>> = parsed
            .rows
            .iter()
            .map(|row| row.work_ref.to_vec())
            .collect();
        seen.sort_unstable();
        seen.dedup();
        seen
    };
    let existing = store::load_existing_attempts(&mut tx, &work_refs).await?;

    let plan = plan_batch(&parsed.rows, &existing, &settings)?;
    store::renumber_existing(&mut tx, &plan.renumbered).await?;
    let upserted = store::upsert_checks(&mut tx, batch_id, &plan.upserts).await?;
    tx.commit().await.map_err(StoreError::Sqlx)?;

    let summary = BatchSummary {
        batch_id,
        rows_read: parsed.rows_read,
        rows_upserted: upserted,
        rows_rejected: parsed.rejections.len() as u64,
        rows_skipped_deleted: parsed.rows_skipped_deleted,
        status: BatchStatus::Succeeded,
    };
    store::finish_batch(
        pool,
        batch_id,
        i32::try_from(summary.rows_read).unwrap_or(i32::MAX),
        i32::try_from(summary.rows_upserted).unwrap_or(i32::MAX),
        i32::try_from(summary.rows_rejected).unwrap_or(i32::MAX),
        i32::try_from(summary.rows_skipped_deleted).unwrap_or(i32::MAX),
        rejections_json(&parsed.rejections),
        BatchStatus::Succeeded.as_str(),
    )
    .await?;

    let refreshed = store::refresh_materialized_views(pool).await?;
    tracing::info!(batch_id, views = refreshed.len(), "aggregates refreshed");

    Ok(summary)
}

/// Everything one `documents.csv` reduced to. No source text survives here.
struct ParsedDocuments {
    rows: Vec<ParsedRow>,
    rejections: Vec<RowRejection>,
    rows_read: u64,
    rows_skipped_deleted: u64,
}

fn read_documents(
    documents: &Path,
    pepper: &Pepper,
    rules: &RuleSet,
) -> Result<ParsedDocuments, SourceError> {
    let mut reader = source_csv::open(documents)?;
    source_csv::read_documents_header(&mut reader)?;

    let mut parsed = ParsedDocuments {
        rows: Vec::new(),
        rejections: Vec::new(),
        rows_read: 0,
        rows_skipped_deleted: 0,
    };

    let mut record = csv::StringRecord::new();
    loop {
        // A record whose field count differs is a *soft* csv error: it is
        // reported and the reader continues, so one shifted row never truncates
        // the batch (PLAN §1.4).
        let read = match reader.read_record(&mut record) {
            Ok(read) => read,
            Err(error) if is_recoverable(&error) => {
                let row_index = parsed.rows_read;
                parsed.rows_read += 1;
                parsed.rejections.push(RowRejection::new(
                    row_index,
                    RejectionKind::ColumnShifted,
                    None,
                ));
                continue;
            }
            Err(error) => return Err(SourceError::Csv(error)),
        };
        if !read {
            break;
        }

        let row_index = parsed.rows_read;
        parsed.rows_read += 1;

        match parse_row(row_index, &record, pepper, rules) {
            RowOutcome::Row(row) => {
                if row.deleted {
                    parsed.rows_skipped_deleted += 1;
                }
                parsed.rows.push(*row);
            }
            RowOutcome::DeletedWithoutIdentifier => {
                // Counted as deleted, never guessed into a fact (ADR-008 §1).
                parsed.rows_skipped_deleted += 1;
                tracing::debug!(row_index, "deleted row without a parseable identifier");
            }
            RowOutcome::Rejected(rejection) => parsed.rejections.push(rejection),
        }
    }

    Ok(parsed)
}

fn is_recoverable(error: &csv::Error) -> bool {
    matches!(
        error.kind(),
        csv::ErrorKind::UnequalLengths { .. } | csv::ErrorKind::Utf8 { .. }
    )
}

/// The writes one batch implies.
struct BatchPlan {
    upserts: Vec<CheckUpsert>,
    renumbered: Vec<Renumber>,
}

/// Assign ladder positions and derive statuses (ADR-008 §3, §4).
fn plan_batch(
    rows: &[ParsedRow],
    existing: &[store::ExistingAttempt],
    settings: &DerivationSettings,
) -> Result<BatchPlan, IngestError> {
    // Group the union {warehouse rows} ∪ {batch rows} by work.
    let mut union: HashMap<Vec<u8>, Vec<AttemptKey>> = HashMap::new();
    for row in existing {
        union
            .entry(row.work_ref.clone())
            .or_default()
            .push(AttemptKey::from_nanos(
                row.checked_at_nanos,
                &row.source_check_id,
            ));
    }
    for row in rows {
        union
            .entry(row.work_ref.to_vec())
            .or_default()
            .push(AttemptKey::new(
                row.checked_at,
                row.source_check_id.as_str(),
            ));
    }

    let ordinals: HashMap<Vec<u8>, HashMap<AttemptKey, u32>> = union
        .into_iter()
        .map(|(work_ref, keys)| (work_ref, assign_ordinals(keys)))
        .collect();

    let mut upserts: Vec<CheckUpsert> = Vec::with_capacity(rows.len());
    for row in rows {
        let key = AttemptKey::new(row.checked_at, row.source_check_id.as_str());
        let attempt_no = ordinals
            .get(row.work_ref.as_bytes().as_slice())
            .and_then(|ladder| ladder.get(&key))
            .copied()
            .unwrap_or(1);
        let derived = derive(
            settings,
            attempt_no,
            row.suspicious,
            row.suspicion_cleared,
            i32::from(row.originality.hundredths()),
        );

        upserts.push(CheckUpsert {
            source_check_id: row.source_check_id.as_str().to_owned(),
            attempt_no: i32::try_from(attempt_no).unwrap_or(i32::MAX),
            checked_at: store::to_offset_date_time(row.checked_at)?,
            academic_year: row.academic_year.0,
            work_type_id: row.work_type_id,
            faculty_id: row.faculty_id,
            department_id: row.department_id,
            program_id: None,
            originality_hundredths: i32::from(row.originality.hundredths()),
            status: status_label(derived.status),
            escalated: derived.escalated,
            initiator: initiator_label(row.initiator),
            duration_seconds: None,
            work_ref: Some(row.work_ref.to_vec()),
            reviewer_ref: Some(row.reviewer_ref.to_vec()),
            self_citation_hundredths: row.self_citation_hundredths,
            citation_hundredths: row.citation_hundredths,
            match_hundredths: row.match_hundredths,
            ai_content_hundredths: row.ai_content_hundredths,
            suspicious: row.suspicious,
            suspicion_cleared: row.suspicion_cleared,
            deleted: row.deleted,
        });
    }

    // Two rows of one batch may legitimately share a report link; two rows
    // sharing (source_check_id, attempt_no) are the same fact twice and would
    // make Postgres refuse the whole statement ("ON CONFLICT DO UPDATE cannot
    // affect row a second time"). Collapse them.
    upserts.sort_by(|a, b| {
        a.source_check_id
            .cmp(&b.source_check_id)
            .then(a.attempt_no.cmp(&b.attempt_no))
    });
    upserts.dedup_by(|a, b| a.source_check_id == b.source_check_id && a.attempt_no == b.attempt_no);

    // A late-arriving earlier attempt pushes stored rows down the ladder; their
    // status has to move with them (attempt > 1 → recheck).
    let mut renumbered = Vec::new();
    for row in existing {
        let key = AttemptKey::from_nanos(row.checked_at_nanos, &row.source_check_id);
        let Some(attempt_no) = ordinals
            .get(&row.work_ref)
            .and_then(|ladder| ladder.get(&key))
            .copied()
        else {
            continue;
        };
        let attempt_no = i32::try_from(attempt_no).unwrap_or(i32::MAX);
        if attempt_no == row.attempt_no {
            continue;
        }
        let derived = derive(
            settings,
            u32::try_from(attempt_no).unwrap_or(1),
            row.suspicious,
            row.suspicion_cleared,
            row.originality_hundredths,
        );
        renumbered.push(Renumber {
            id: row.id,
            attempt_no,
            status: status_label(derived.status),
            escalated: derived.escalated,
        });
    }

    Ok(BatchPlan {
        upserts,
        renumbered,
    })
}

fn derive(
    settings: &DerivationSettings,
    attempt_no: u32,
    suspicious: bool,
    suspicion_cleared: bool,
    originality_hundredths: i32,
) -> domain::DerivedStatus {
    let attempt = domain::AttemptNo::new(attempt_no.max(1)).unwrap_or_else(|_| fallback_attempt());
    let originality = u16::try_from(originality_hundredths)
        .ok()
        .and_then(|value| domain::OriginalityPct::from_hundredths(value).ok())
        .unwrap_or(settings.originality_threshold);

    settings.status_rules.derive(&StatusInput {
        attempt_no: attempt,
        suspicious,
        suspicion_cleared,
        originality,
        originality_threshold: settings.originality_threshold,
    })
}

/// `AttemptNo::new(1)` is infallible by construction; this keeps the code total
/// without an `unwrap` (the workspace lints deny it).
fn fallback_attempt() -> domain::AttemptNo {
    match domain::AttemptNo::new(1) {
        Ok(attempt) => attempt,
        Err(_) => unreachable!("1 is a valid attempt number"),
    }
}

pub(crate) const fn status_label(status: CheckStatus) -> &'static str {
    match status {
        CheckStatus::Accepted => "accepted",
        CheckStatus::NeedsRevision => "needs_revision",
        CheckStatus::Rejected => "rejected",
        CheckStatus::Recheck => "recheck",
    }
}

pub(crate) const fn initiator_label(initiator: InitiatorRole) -> &'static str {
    match initiator {
        InitiatorRole::Student => "student",
        InitiatorRole::StaffSelf => "staff_self",
        InitiatorRole::Registrar => "registrar",
        InitiatorRole::Other => "other",
    }
}

/// Serialize the rejection list for `ingest_batches.errors`, capped.
pub(crate) fn rejections_json(rejections: &[RowRejection]) -> serde_json::Value {
    let listed = rejections.len().min(MAX_PERSISTED_REJECTIONS);
    let mut entries: Vec<serde_json::Value> = rejections[..listed]
        .iter()
        .map(|rejection| serde_json::to_value(rejection).unwrap_or(serde_json::Value::Null))
        .collect();
    if rejections.len() > listed {
        entries.push(serde_json::json!({
            "kind": RejectionKind::RejectionsTruncated,
            "omitted": rejections.len() - listed,
        }));
    }
    serde_json::Value::Array(entries)
}

/// Every `YYYY-YYYY` directory under `root`, or `root` itself when it is one.
pub fn academic_year_directories(root: &Path) -> Result<Vec<PathBuf>, SourceError> {
    if academic_year_of(root).is_some() {
        return Ok(vec![root.to_path_buf()]);
    }
    let entries = std::fs::read_dir(root).map_err(|source| SourceError::Io {
        path: root.display().to_string(),
        source,
    })?;
    let mut directories: Vec<PathBuf> = entries
        .filter_map(Result::ok)
        .map(|entry| entry.path())
        .filter(|path| path.is_dir() && academic_year_of(path).is_some())
        .collect();
    directories.sort();
    if directories.is_empty() {
        return Err(SourceError::NoAcademicYearDirectories {
            path: root.display().to_string(),
        });
    }
    Ok(directories)
}

/// `…/2025-2026` → `AcademicYear(2025)`; anything else → `None`.
#[must_use]
pub fn academic_year_of(path: &Path) -> Option<AcademicYear> {
    let name = path.file_name()?.to_str()?;
    let (start, end) = name.split_once('-')?;
    if start.len() != 4 || end.len() != 4 {
        return None;
    }
    let start: i16 = start.parse().ok()?;
    let end: i16 = end.parse().ok()?;
    (end == start + 1).then_some(AcademicYear(start))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn academic_year_directories_are_recognized_by_name() {
        assert_eq!(
            academic_year_of(Path::new("/fixtures/out/2025-2026")),
            Some(AcademicYear(2025))
        );
        assert_eq!(
            academic_year_of(Path::new("out/2024-2025")),
            Some(AcademicYear(2024))
        );
        // Not a consecutive pair, not four digits, not a year directory.
        assert_eq!(academic_year_of(Path::new("out/2024-2026")), None);
        assert_eq!(academic_year_of(Path::new("out/24-25")), None);
        assert_eq!(academic_year_of(Path::new("out")), None);
    }

    #[test]
    fn the_status_ladder_labels_match_the_postgres_enum() {
        assert_eq!(status_label(CheckStatus::Accepted), "accepted");
        assert_eq!(status_label(CheckStatus::NeedsRevision), "needs_revision");
        assert_eq!(status_label(CheckStatus::Rejected), "rejected");
        assert_eq!(status_label(CheckStatus::Recheck), "recheck");
        assert_eq!(initiator_label(InitiatorRole::StaffSelf), "staff_self");
        assert_eq!(initiator_label(InitiatorRole::Registrar), "registrar");
    }

    fn settings() -> DerivationSettings {
        DerivationSettings {
            status_rules: domain::StatusRules::default(),
            originality_threshold: domain::OriginalityPct::from_hundredths(7_000).unwrap(),
        }
    }

    #[test]
    fn the_ladder_follows_adr_008_section_4() {
        let settings = settings();
        // attempt > 1 wins over everything.
        assert_eq!(
            derive(&settings, 2, true, false, 1_000).status,
            CheckStatus::Recheck
        );
        // suspicious and not cleared.
        let rejected = derive(&settings, 1, true, false, 9_900);
        assert_eq!(rejected.status, CheckStatus::Rejected);
        assert!(rejected.escalated);
        // below the threshold.
        assert_eq!(
            derive(&settings, 1, false, false, 6_999).status,
            CheckStatus::NeedsRevision
        );
        // exactly at the threshold is not below it.
        assert_eq!(
            derive(&settings, 1, false, false, 7_000).status,
            CheckStatus::Accepted
        );
        // escalation is independent of the ladder.
        assert!(derive(&settings, 3, true, false, 9_000).escalated);
        assert!(!derive(&settings, 3, true, true, 9_000).escalated);
    }

    #[test]
    fn a_capped_rejection_list_reports_what_it_omitted() {
        let many: Vec<RowRejection> = (0..MAX_PERSISTED_REJECTIONS as u64 + 5)
            .map(|index| RowRejection::new(index, RejectionKind::ColumnShifted, None))
            .collect();
        let json = rejections_json(&many);
        let entries = json.as_array().unwrap();
        assert_eq!(entries.len(), MAX_PERSISTED_REJECTIONS + 1);
        assert_eq!(
            entries[MAX_PERSISTED_REJECTIONS]["kind"],
            serde_json::json!("rejections_truncated")
        );
        assert_eq!(
            entries[MAX_PERSISTED_REJECTIONS]["omitted"],
            serde_json::json!(5)
        );
    }

    #[test]
    fn a_short_rejection_list_is_not_annotated() {
        let json = rejections_json(&[RowRejection::new(3, RejectionKind::ColumnShifted, None)]);
        assert_eq!(json.as_array().unwrap().len(), 1);
    }
}
