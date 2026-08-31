//! Generated report snapshots (TZ §4.5): the annual Приложение-1 report and
//! manual exports, plus the "published" flag the public contour reads.

use sqlx::types::time::{Date, OffsetDateTime};

use crate::{DbError, Pool};

/// `report_snapshots.kind` - the CHECK constraint of migration 0001.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SnapshotKind {
    Annual,
    Manual,
}

impl SnapshotKind {
    #[must_use]
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Annual => "annual",
            Self::Manual => "manual",
        }
    }
}

#[derive(Debug, Clone)]
pub struct NewSnapshot<'a> {
    pub period_start: Date,
    pub period_end: Date,
    pub kind: SnapshotKind,
    /// BCP-47 tag the snapshot was rendered in (migration 0005). `None` only
    /// for a caller that genuinely does not know; every renderer does.
    pub locale: Option<&'a str>,
    pub pdf_path: Option<&'a str>,
    pub xlsx_path: Option<&'a str>,
}

#[derive(Debug, Clone)]
pub struct SnapshotRow {
    pub id: i64,
    pub generated_at: OffsetDateTime,
    pub period_start: Date,
    pub period_end: Date,
    pub kind: String,
    /// `None` for a row written before migration 0005 added the column.
    pub locale: Option<String>,
    pub pdf_path: Option<String>,
    pub xlsx_path: Option<String>,
    pub published: bool,
}

pub async fn insert(pool: &Pool, snapshot: &NewSnapshot<'_>) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO report_snapshots (period_start, period_end, kind, locale, pdf_path, xlsx_path)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id",
        snapshot.period_start,
        snapshot.period_end,
        snapshot.kind.as_str(),
        snapshot.locale,
        snapshot.pdf_path,
        snapshot.xlsx_path,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

/// Newest first. `published_only` is what the public `/reports` endpoint binds.
pub async fn list(
    pool: &Pool,
    published_only: bool,
    limit: i64,
    offset: i64,
) -> Result<Vec<SnapshotRow>, DbError> {
    let rows = sqlx::query_as!(
        SnapshotRow,
        "SELECT id, generated_at, period_start, period_end, kind, locale, pdf_path, xlsx_path,
                published
           FROM report_snapshots
          WHERE NOT $1::boolean OR published
          ORDER BY generated_at DESC, id DESC
          LIMIT $2 OFFSET $3",
        published_only,
        limit,
        offset,
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

pub async fn get(pool: &Pool, id: i64) -> Result<Option<SnapshotRow>, DbError> {
    let row = sqlx::query_as!(
        SnapshotRow,
        "SELECT id, generated_at, period_start, period_end, kind, locale, pdf_path, xlsx_path,
                published
           FROM report_snapshots WHERE id = $1",
        id,
    )
    .fetch_optional(pool.pg())
    .await?;
    Ok(row)
}

/// Publish or unpublish a snapshot. Publication is an explicit admin act
/// (AGENTS.md §7), never a side effect of generation.
pub async fn set_published(pool: &Pool, id: i64, published: bool) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE report_snapshots SET published = $2 WHERE id = $1",
        id,
        published
    )
    .execute(pool.pg())
    .await?;
    Ok(result.rows_affected())
}
