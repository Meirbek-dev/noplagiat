//! Ingest batch bookkeeping.
//!
//! Every run of the importer opens a row here and closes it with counters and
//! the per-row error list, so a silently dropped row is impossible to confuse
//! with a clean import (ADR-008 §4, ARCHITECTURE.md §4.4).

use sqlx::types::time::OffsetDateTime;

use crate::{DbError, Pool};

/// `ingest_batches.mode` - the CHECK constraint of migration 0001.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Mode {
    Api,
    Csv,
}

impl Mode {
    #[must_use]
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Api => "api",
            Self::Csv => "csv",
        }
    }
}

/// `ingest_batches.status` - the CHECK constraint of migration 0001.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BatchStatus {
    Running,
    Succeeded,
    Failed,
}

impl BatchStatus {
    #[must_use]
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Running => "running",
            Self::Succeeded => "succeeded",
            Self::Failed => "failed",
        }
    }
}

/// The counters a finished batch reports. «Удален» rows are counted separately
/// from rejections: they are a policy exclusion, not a data defect.
#[derive(Debug, Clone)]
pub struct BatchOutcome {
    pub rows_read: i32,
    pub rows_upserted: i32,
    pub rows_rejected: i32,
    pub rows_skipped_deleted: i32,
    /// Typed per-row rejections, surfaced verbatim in the admin UI.
    pub errors: serde_json::Value,
    pub status: BatchStatus,
}

#[derive(Debug, Clone)]
pub struct BatchRow {
    pub id: i64,
    pub started_at: OffsetDateTime,
    pub finished_at: Option<OffsetDateTime>,
    pub source: String,
    pub mode: String,
    pub rows_read: i32,
    pub rows_upserted: i32,
    pub rows_rejected: i32,
    pub rows_skipped_deleted: i32,
    pub status: String,
}

/// A batch plus its error list (only fetched for the detail view - the list
/// endpoint must not carry every row error of every batch).
#[derive(Debug, Clone)]
pub struct BatchDetail {
    pub batch: BatchRow,
    pub errors: serde_json::Value,
}

/// Open a running batch.
pub async fn start(pool: &Pool, source: &str, mode: Mode) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO ingest_batches (source, mode) VALUES ($1, $2) RETURNING id",
        source,
        mode.as_str(),
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

/// Close a batch with its counters. `finished_at` is set here, never earlier.
pub async fn finish(pool: &Pool, id: i64, outcome: &BatchOutcome) -> Result<(), DbError> {
    sqlx::query!(
        "UPDATE ingest_batches
            SET finished_at = now(),
                rows_read = $2,
                rows_upserted = $3,
                rows_rejected = $4,
                rows_skipped_deleted = $5,
                errors = $6,
                status = $7
          WHERE id = $1",
        id,
        outcome.rows_read,
        outcome.rows_upserted,
        outcome.rows_rejected,
        outcome.rows_skipped_deleted,
        outcome.errors,
        outcome.status.as_str(),
    )
    .execute(pool.pg())
    .await?;
    Ok(())
}

/// Most recent batches first.
pub async fn list(pool: &Pool, limit: i64, offset: i64) -> Result<Vec<BatchRow>, DbError> {
    let rows = sqlx::query_as!(
        BatchRow,
        "SELECT id, started_at, finished_at, source, mode,
                rows_read, rows_upserted, rows_rejected, rows_skipped_deleted, status
           FROM ingest_batches
          ORDER BY started_at DESC, id DESC
          LIMIT $1 OFFSET $2",
        limit,
        offset,
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

/// Lifetime ingest counters, for the `/metrics` scrape (ARCHITECTURE.md §8).
///
/// Computed at scrape time rather than kept in process counters: the numbers
/// have to survive a restart, and `ingest_batches` is a handful of rows a day.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct BatchTotals {
    pub batches: i64,
    pub rows_read: i64,
    pub rows_upserted: i64,
    pub rows_rejected: i64,
    pub rows_skipped_deleted: i64,
}

pub async fn totals(pool: &Pool) -> Result<BatchTotals, DbError> {
    let row = sqlx::query!(
        r#"SELECT count(*) AS "batches!",
                  coalesce(sum(rows_read), 0)::bigint AS "rows_read!",
                  coalesce(sum(rows_upserted), 0)::bigint AS "rows_upserted!",
                  coalesce(sum(rows_rejected), 0)::bigint AS "rows_rejected!",
                  coalesce(sum(rows_skipped_deleted), 0)::bigint AS "rows_skipped_deleted!"
             FROM ingest_batches"#
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(BatchTotals {
        batches: row.batches,
        rows_read: row.rows_read,
        rows_upserted: row.rows_upserted,
        rows_rejected: row.rows_rejected,
        rows_skipped_deleted: row.rows_skipped_deleted,
    })
}

/// When the newest **succeeded** batch finished, or `None` when none ever has.
///
/// `None` is a fresh install, not a stale one: `/readyz` must not report a
/// degraded warehouse on a database that has simply never been fed
/// (ARCHITECTURE.md §8).
pub async fn last_succeeded_at(pool: &Pool) -> Result<Option<OffsetDateTime>, DbError> {
    let at = sqlx::query_scalar!(
        "SELECT max(finished_at) FROM ingest_batches
          WHERE status = 'succeeded' AND finished_at IS NOT NULL"
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(at)
}

pub async fn count(pool: &Pool) -> Result<i64, DbError> {
    let total = sqlx::query_scalar!("SELECT count(*) FROM ingest_batches")
        .fetch_one(pool.pg())
        .await?;
    Ok(total.unwrap_or_default())
}

/// One batch with its per-row error list.
pub async fn get(pool: &Pool, id: i64) -> Result<Option<BatchDetail>, DbError> {
    let row = sqlx::query!(
        "SELECT id, started_at, finished_at, source, mode,
                rows_read, rows_upserted, rows_rejected, rows_skipped_deleted, status, errors
           FROM ingest_batches WHERE id = $1",
        id,
    )
    .fetch_optional(pool.pg())
    .await?;

    Ok(row.map(|row| BatchDetail {
        batch: BatchRow {
            id: row.id,
            started_at: row.started_at,
            finished_at: row.finished_at,
            source: row.source,
            mode: row.mode,
            rows_read: row.rows_read,
            rows_upserted: row.rows_upserted,
            rows_rejected: row.rows_rejected,
            rows_skipped_deleted: row.rows_skipped_deleted,
            status: row.status,
        },
        errors: row.errors,
    }))
}
