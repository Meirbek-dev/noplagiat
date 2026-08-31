//! TZ §4.2 §8 - system usage: monthly active reviewers and average check
//! duration.
//!
//! `active_reviewers` is a distinct count of `reviewer_ref` (ADR-008 §9), so it
//! cannot be derived from `agg_monthly`; `agg_usage_monthly` precomputes it per
//! (month, faculty, department). Summing that view across units is exact
//! because `staff_units.email_hmac` is a primary key - a reviewer resolves to
//! exactly one unit - but the view has no work-type, status, initiator or
//! `deleted` dimension, so any filter outside its key, and any period that does
//! not cover whole months, falls back to the fact table. That is the documented
//! exception (d) of the [module docs](super).
//!
//! `avg_check_seconds` has no source in the vendor export; it comes from the
//! manual `usage_stats` rows and is `None` («нет данных») where none exists.

use compliance::Scope;
use domain::Filters;
use sqlx::types::time::Date;

use super::fact_query;
use crate::{DbError, Pool};

/// One month of usage. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct UsagePoint {
    pub month: Date,
    /// Distinct reviewers active in the month.
    pub active_reviewers: i64,
    /// From the manual `usage_stats` table; `None` means «нет данных».
    pub avg_check_seconds: Option<i32>,
    /// From the manual `usage_stats` table, for reconciliation against
    /// `active_reviewers`.
    pub reported_active_users: Option<i32>,
}

pub async fn usage(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<Vec<UsagePoint>, DbError> {
    let binds = super::binds(pool, filters, scope).await?;

    let monthly: Vec<(Date, i64)> = if binds.needs_row_level_usage() {
        let rows = fact_query!(
            r#"SELECT f.month AS "month!",
                      count(DISTINCT f.reviewer_ref) AS "active_reviewers!"
                 FROM fact_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) f
                WHERE f.reviewer_ref IS NOT NULL
                GROUP BY 1
                ORDER BY 1"#,
            binds
        )
        .fetch_all(pool.pg())
        .await?;
        rows.into_iter()
            .map(|row| (row.month, row.active_reviewers))
            .collect()
    } else {
        // Month-aligned period, no filter outside the view's key: the
        // precomputed monthly grain answers it directly. The canonical scope
        // predicate is spelled out here because this is the one dashboard query
        // that does not go through `agg_cells` or `fact_cells`.
        let rows = sqlx::query!(
            r#"SELECT u.month AS "month!",
                      sum(u.active_reviewers)::bigint AS "active_reviewers!"
                 FROM agg_usage_monthly u
                WHERE u.month >= $1 AND u.month <= $2
                  AND ($3::bigint IS NULL OR u.faculty_id = $3)
                  AND ($4::bigint IS NULL OR u.department_id = $4)
                  AND ($5::text IS NULL
                       OR u.faculty_id = (SELECT f.id FROM faculties f WHERE f.code = $5))
                  AND ($6::text IS NULL
                       OR u.department_id = (SELECT d.id FROM departments d WHERE d.code = $6))
                GROUP BY 1
                ORDER BY 1"#,
            binds.period().full_from(),
            binds.period().full_to(),
            binds.scope_faculty_id(),
            binds.scope_department_id(),
            binds.faculty_code(),
            binds.department_code(),
        )
        .fetch_all(pool.pg())
        .await?;
        rows.into_iter()
            .map(|row| (row.month, row.active_reviewers))
            .collect()
    };

    let stats =
        crate::manual::usage_stats::list(pool, binds.period().from(), binds.period().to()).await?;

    Ok(monthly
        .into_iter()
        .map(|(month, active_reviewers)| {
            let manual = stats.iter().find(|stat| stat.period_month == month);
            UsagePoint {
                month,
                active_reviewers,
                avg_check_seconds: manual.and_then(|stat| stat.avg_check_seconds),
                reported_active_users: manual.map(|stat| stat.active_users),
            }
        })
        .collect())
}
