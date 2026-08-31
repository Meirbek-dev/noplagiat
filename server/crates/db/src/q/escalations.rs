//! TZ §4.2 §7 - escalations and the Ethics Council registry.
//!
//! Two independent numbers, reported side by side and never summed: the derived
//! `escalated` flag on checks (ADR-008 §4), and the manually maintained
//! `ethics_cases` counters (D11).

use compliance::Scope;
use domain::{AcademicYear, Filters};

use super::agg_query;
use crate::manual::ethics::EthicsCase;
use crate::{DbError, Pool};

/// Escalation counters. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EscalationsRow {
    /// Checks flagged «Подозрительный документ» with the mark not cleared.
    pub checks_escalated: i64,
    /// Ethics Council rows for the academic years the period touches.
    pub ethics_cases: Vec<EthicsCase>,
}

pub async fn escalations(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<EscalationsRow, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let row = agg_query!(
        r#"SELECT coalesce(sum(c.escalated), 0)::bigint AS "checks_escalated!"
             FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c"#,
        binds
    )
    .fetch_one(pool.pg())
    .await?;

    let period = filters.period();
    let AcademicYear(from_year) = AcademicYear::from_date(period.start());
    let AcademicYear(to_year) = AcademicYear::from_date(period.end());
    let ethics_cases = crate::manual::ethics::list(pool, from_year, to_year).await?;

    Ok(EscalationsRow {
        checks_escalated: row.checks_escalated,
        ethics_cases,
    })
}
