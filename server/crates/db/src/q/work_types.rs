//! TZ §4.2 §3 - distribution by work type.

use compliance::Scope;
use domain::Filters;

use super::{agg_query, mean_originality};
use crate::{DbError, Pool};

/// One work type. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WorkTypeRow {
    pub code: String,
    pub checks: i64,
    pub sum_originality_hundredths: i64,
}

impl WorkTypeRow {
    #[must_use]
    pub fn avg_originality(&self) -> Option<f64> {
        mean_originality(self.sum_originality_hundredths, self.checks)
    }
}

/// Checks and mean originality per work type, ordered by code.
pub async fn work_types(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<Vec<WorkTypeRow>, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let rows = agg_query!(
        r#"SELECT wt.code AS "code!",
                  sum(c.checks)::bigint AS "checks!",
                  (sum(c.sum_originality) * 100)::bigint AS "sum_originality_hundredths!"
             FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c
             JOIN work_types wt ON wt.id = c.work_type_id
            GROUP BY 1
            ORDER BY 1"#,
        binds
    )
    .fetch_all(pool.pg())
    .await?;

    Ok(rows
        .into_iter()
        .map(|row| WorkTypeRow {
            code: row.code,
            checks: row.checks,
            sum_originality_hundredths: row.sum_originality_hundredths,
        })
        .collect())
}
