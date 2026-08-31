//! Materialized-aggregate maintenance.
//!
//! Request paths never rebuild anything; ingest calls [`refresh_all`] once per
//! batch (ARCHITECTURE.md §3.3).

use crate::{DbError, Pool};

/// Refresh every materialized view in the current schema, concurrently.
///
/// The view list comes from `pg_matviews` rather than a hard-coded array, so a
/// future aggregate is covered without touching the ingest path; the loop and
/// the `%I` quoting live in the `refresh_aggregates()` function created by
/// migration 0003, which also falls back to the blocking form for a view that
/// has never been populated (CONCURRENTLY requires a populated view).
///
/// Returns the number of views refreshed.
pub async fn refresh_all(pool: &Pool) -> Result<i32, DbError> {
    let refreshed = sqlx::query_scalar!("SELECT refresh_aggregates()")
        .fetch_one(pool.pg())
        .await?;
    Ok(refreshed.unwrap_or_default())
}
