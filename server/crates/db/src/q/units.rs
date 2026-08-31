//! TZ §4.2 §4 - the faculty/department matrix and heatmap.
//!
//! The public contour publishes faculty grain only; department grain is
//! internal (TZ §5). Both are produced here **raw**: the caller assembles a
//! [`compliance::AggregateMatrix`] from these rows and screens it as one object
//! - which is why every row carries its observation count and not just its
//! average (`compliance::suppress_matrix`).

use compliance::Scope;
use domain::Filters;

use super::{agg_query, mean_originality};
use crate::{DbError, Pool};

/// Which grain to aggregate at.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnitDepth {
    /// One row per faculty (the public grain).
    Faculty,
    /// One row per department (internal contour only).
    Department,
}

/// One unit cell. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UnitRow {
    pub faculty_code: String,
    /// `None` at [`UnitDepth::Faculty`].
    pub department_code: Option<String>,
    /// Raw group size - the input to k-anonymity screening.
    pub checks: i64,
    pub sum_originality_hundredths: i64,
}

impl UnitRow {
    #[must_use]
    pub fn avg_originality(&self) -> Option<f64> {
        mean_originality(self.sum_originality_hundredths, self.checks)
    }
}

/// Checks and mean originality per unit, ordered by faculty then department.
pub async fn units(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
    depth: UnitDepth,
) -> Result<Vec<UnitRow>, DbError> {
    let binds = super::binds(pool, filters, scope).await?;

    match depth {
        UnitDepth::Faculty => {
            let rows = agg_query!(
                r#"SELECT f.code AS "faculty_code!",
                          sum(c.checks)::bigint AS "checks!",
                          (sum(c.sum_originality) * 100)::bigint
                              AS "sum_originality_hundredths!"
                     FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c
                     JOIN faculties f ON f.id = c.faculty_id
                    GROUP BY 1
                    ORDER BY 1"#,
                binds
            )
            .fetch_all(pool.pg())
            .await?;

            Ok(rows
                .into_iter()
                .map(|row| UnitRow {
                    faculty_code: row.faculty_code,
                    department_code: None,
                    checks: row.checks,
                    sum_originality_hundredths: row.sum_originality_hundredths,
                })
                .collect())
        }
        UnitDepth::Department => {
            let rows = agg_query!(
                r#"SELECT f.code AS "faculty_code!",
                          d.code AS "department_code!",
                          sum(c.checks)::bigint AS "checks!",
                          (sum(c.sum_originality) * 100)::bigint
                              AS "sum_originality_hundredths!"
                     FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c
                     JOIN faculties f ON f.id = c.faculty_id
                     JOIN departments d ON d.id = c.department_id
                    GROUP BY 1, 2
                    ORDER BY 1, 2"#,
                binds
            )
            .fetch_all(pool.pg())
            .await?;

            Ok(rows
                .into_iter()
                .map(|row| UnitRow {
                    faculty_code: row.faculty_code,
                    department_code: Some(row.department_code),
                    checks: row.checks,
                    sum_originality_hundredths: row.sum_originality_hundredths,
                })
                .collect())
        }
    }
}
