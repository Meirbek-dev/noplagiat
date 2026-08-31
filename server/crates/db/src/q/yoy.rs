//! TZ §4.2 §9 - year over year, keyed on the materialized `academic_year`.

use compliance::Scope;
use domain::{AcademicYear, Filters};

use super::{agg_query, mean_originality};
use crate::{DbError, Pool};

/// One academic year. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct YoyRow {
    /// `AcademicYear(2024)` is AY 2024/25 (Sep 1 – Aug 31).
    pub academic_year: AcademicYear,
    pub checks: i64,
    pub sum_originality_hundredths: i64,
}

impl YoyRow {
    #[must_use]
    pub fn avg_originality(&self) -> Option<f64> {
        mean_originality(self.sum_originality_hundredths, self.checks)
    }
}

/// Checks and mean originality per academic year, ascending.
///
/// The academic year is a stored column derived at ingest from the row's local
/// (+05:00) calendar date, so a period that straddles Sep 1 splits here exactly
/// the way the filter bar promises.
pub async fn yoy(pool: &Pool, filters: &Filters, scope: Scope) -> Result<Vec<YoyRow>, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let rows = agg_query!(
        r#"SELECT c.academic_year AS "academic_year!",
                  sum(c.checks)::bigint AS "checks!",
                  (sum(c.sum_originality) * 100)::bigint AS "sum_originality_hundredths!"
             FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c
            GROUP BY 1
            ORDER BY 1"#,
        binds
    )
    .fetch_all(pool.pg())
    .await?;

    Ok(rows
        .into_iter()
        .map(|row| YoyRow {
            academic_year: AcademicYear(row.academic_year),
            checks: row.checks,
            sum_originality_hundredths: row.sum_originality_hundredths,
        })
        .collect())
}
