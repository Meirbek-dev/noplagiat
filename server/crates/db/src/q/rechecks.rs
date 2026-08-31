//! TZ §4.2 §6 - rechecks and improvement (ADR-008 §9).
//!
//! # Why this one reads the fact table
//!
//! `works_total`, `works_rechecked` and `improved` are **distinct counts over
//! `work_ref`**, and a distinct count is not additive. `agg_rechecks_yearly`
//! precomputes them per (academic year, faculty, department, work type), but
//! summing that view across its own key double-counts every work whose attempts
//! fall in two groups - a recheck picked up by a different reviewer, or a work
//! whose ladder crosses Sep 1. It also *undercounts* `works_rechecked`, because
//! a two-attempt work split across two groups looks single-attempt in both.
//!
//! The `small` fixture makes this measurable: 4 of 52 064 works span two units
//! and 3 span two academic years, so the roll-up reports `works_total` 52 068
//! and `works_rechecked` 6 080 where ADR-008 §9 requires 52 064 and 6 083.
//! Reading the aggregate here would therefore be wrong, not merely imprecise.
//!
//! `agg_rechecks_yearly` remains the right source for a **single cell** - one
//! academic year × unit × work type - which is the grain the Приложение-1
//! annual report publishes (W4.1).

use compliance::Scope;
use domain::Filters;

use super::fact_query;
use crate::{DbError, Pool};

/// Distinct-work recheck metrics over the filtered rows. **Pre-suppression** -
/// see the [module docs](super).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct RechecksRow {
    /// Distinct works among the filtered rows.
    pub works_total: i64,
    /// Works with at least two attempts **in the filtered set**.
    pub works_rechecked: i64,
    /// Rechecked works whose last attempt beats their first.
    pub improved: i64,
}

/// Recheck counts for the filter, computed from attempt ladders.
pub async fn rechecks(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<RechecksRow, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let row = fact_query!(
        r#"WITH works AS (
               SELECT f.work_key,
                      count(*) AS attempts,
                      -- ADR-008 §3 ordering: (checked_at, source_check_id) ascending.
                      (array_agg(f.originality_pct
                                 ORDER BY f.checked_at, f.source_check_id))[1]
                          AS first_originality,
                      (array_agg(f.originality_pct
                                 ORDER BY f.checked_at DESC, f.source_check_id DESC))[1]
                          AS last_originality
                 FROM fact_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) f
                GROUP BY 1
           )
           SELECT count(*) AS "works_total!",
                  (count(*) FILTER (WHERE w.attempts > 1)) AS "works_rechecked!",
                  (count(*) FILTER (WHERE w.attempts > 1
                                      AND w.last_originality > w.first_originality))
                      AS "improved!"
             FROM works w"#,
        binds
    )
    .fetch_one(pool.pg())
    .await?;

    Ok(RechecksRow {
        works_total: row.works_total,
        works_rechecked: row.works_rechecked,
        improved: row.improved,
    })
}
