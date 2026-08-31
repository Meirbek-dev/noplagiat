//! TZ §4.2 §1 - coverage: checks ÷ works actually submitted.
//!
//! The denominators are registrar data kept in `submission_totals` (ADR-008
//! §9). When they are absent the section is **hidden**, never estimated - so
//! this query is driven by the denominator table and returns an empty vector
//! when there is nothing to divide by.

use compliance::Scope;
use domain::{AcademicYear, Filters};

use super::agg_query;
use crate::{DbError, Pool};

/// One (academic year, work type) coverage cell. **Pre-suppression** - see the
/// [module docs](super).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CoverageRow {
    pub academic_year: AcademicYear,
    pub work_type_code: String,
    /// Checks matching the filter in that year and work type.
    pub checks: i64,
    /// Works submitted, from the registrar.
    pub total_submitted: i32,
}

impl CoverageRow {
    /// Checks ÷ submitted, or `None` when the denominator is zero.
    #[must_use]
    pub fn coverage(&self) -> Option<f64> {
        #[expect(
            clippy::cast_precision_loss,
            reason = "counts are bounded by the fact table size"
        )]
        (self.total_submitted > 0).then(|| self.checks as f64 / f64::from(self.total_submitted))
    }
}

pub async fn coverage(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<Vec<CoverageRow>, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let period = filters.period();
    let AcademicYear(from_year) = AcademicYear::from_date(period.start());
    let AcademicYear(to_year) = AcademicYear::from_date(period.end());

    let rows = agg_query!(
        r#"WITH cells AS (
               SELECT c.academic_year, c.work_type_id, sum(c.checks)::bigint AS checks
                 FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c
                GROUP BY 1, 2
           )
           SELECT st.academic_year AS "academic_year!",
                  wt.code AS "work_type_code!",
                  coalesce(cells.checks, 0)::bigint AS "checks!",
                  st.total_submitted AS "total_submitted!"
             FROM submission_totals st
             JOIN work_types wt ON wt.id = st.work_type_id
             LEFT JOIN cells
                    ON cells.academic_year = st.academic_year
                   AND cells.work_type_id = st.work_type_id
            WHERE st.academic_year >= $16 AND st.academic_year <= $17
            ORDER BY 1, 2"#,
        binds,
        from_year,
        to_year,
    )
    .fetch_all(pool.pg())
    .await?;

    Ok(rows
        .into_iter()
        .map(|row| CoverageRow {
            academic_year: AcademicYear(row.academic_year),
            work_type_code: row.work_type_code,
            checks: row.checks,
            total_submitted: row.total_submitted,
        })
        .collect())
}
