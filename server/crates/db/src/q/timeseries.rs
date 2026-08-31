//! TZ §4.2 §2 - dynamics over 3–5 years, at monthly grain.

use compliance::Scope;
use domain::Filters;
use sqlx::types::time::Date;

use super::{agg_query, mean_originality};
use crate::{DbError, Pool};

/// One month. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TimeseriesPoint {
    /// First day of the month, in the university's +05:00 civil calendar.
    pub month: Date,
    pub checks: i64,
    pub sum_originality_hundredths: i64,
}

impl TimeseriesPoint {
    #[must_use]
    pub fn avg_originality(&self) -> Option<f64> {
        mean_originality(self.sum_originality_hundredths, self.checks)
    }
}

/// Monthly checks and mean originality, ascending. Months with no data are
/// omitted rather than emitted as zeros - the chart layer decides how to draw a
/// gap.
pub async fn timeseries(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<Vec<TimeseriesPoint>, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let rows = agg_query!(
        r#"SELECT c.month AS "month!",
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
        .map(|row| TimeseriesPoint {
            month: row.month,
            checks: row.checks,
            sum_originality_hundredths: row.sum_originality_hundredths,
        })
        .collect())
}
