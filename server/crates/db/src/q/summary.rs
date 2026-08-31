//! TZ §4.2 §1 - the KPI cards.

use compliance::Scope;
use domain::Filters;

use super::{AGG_BUCKET_EDGES_HUNDREDTHS, agg_query, fact_query, mean_originality};
use crate::filters::QueryBinds;
use crate::{DbError, Pool};

/// Raw KPI values. **Pre-suppression** - see the [module docs](super).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct SummaryRow {
    pub checks: i64,
    /// Exact sum of originality in hundredths of a percentage point.
    pub sum_originality_hundredths: i64,
    /// `originality < settings.originality_threshold` (ADR-008 §9).
    pub below_threshold: i64,
    pub escalated: i64,
}

impl SummaryRow {
    /// Weighted mean originality in percent, or `None` when the group is empty.
    #[must_use]
    pub fn avg_originality(&self) -> Option<f64> {
        mean_originality(self.sum_originality_hundredths, self.checks)
    }

    /// Share of checks below the threshold, or `None` when the group is empty.
    #[must_use]
    pub fn below_threshold_share(&self) -> Option<f64> {
        #[expect(
            clippy::cast_precision_loss,
            reason = "counts are bounded by the fact table size"
        )]
        (self.checks > 0).then(|| self.below_threshold as f64 / self.checks as f64)
    }
}

/// Total checks, mean originality, below-threshold count and escalations.
pub async fn summary(pool: &Pool, filters: &Filters, scope: Scope) -> Result<SummaryRow, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let threshold = crate::settings::originality_threshold(pool).await?;

    let totals = agg_query!(
        r#"SELECT coalesce(sum(c.checks), 0)::bigint              AS "checks!",
                  (coalesce(sum(c.sum_originality), 0) * 100)::bigint
                                                                  AS "sum_originality_hundredths!",
                  coalesce(sum(c.b_lt50), 0)::bigint              AS "b_lt50!",
                  coalesce(sum(c.b_50_70), 0)::bigint             AS "b_50_70!",
                  coalesce(sum(c.b_70_85), 0)::bigint             AS "b_70_85!",
                  coalesce(sum(c.b_85_95), 0)::bigint             AS "b_85_95!",
                  coalesce(sum(c.escalated), 0)::bigint           AS "escalated!"
             FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c"#,
        binds
    )
    .fetch_one(pool.pg())
    .await?;

    // The bucket columns of `agg_monthly` are cumulative below any of the four
    // ADR-008 §8 edges, so when the threshold *is* one of those edges the
    // below-threshold count is a sum of columns already in the aggregate. A
    // threshold anywhere else (an admin may set 65 %) has no such column, and
    // the only exact answer is a row-level count.
    let bucket_index = AGG_BUCKET_EDGES_HUNDREDTHS
        .iter()
        .position(|edge| *edge == threshold.hundredths());
    let below_threshold = match bucket_index {
        Some(index) => {
            let cumulative = [
                totals.b_lt50,
                totals.b_50_70,
                totals.b_70_85,
                totals.b_85_95,
            ];
            cumulative.iter().take(index + 1).sum()
        }
        None => below_threshold_from_facts(pool, binds, threshold).await?,
    };

    Ok(SummaryRow {
        checks: totals.checks,
        sum_originality_hundredths: totals.sum_originality_hundredths,
        below_threshold,
        escalated: totals.escalated,
    })
}

/// Documented fact-table exception: a threshold that is not one of the four
/// aggregate bucket edges.
async fn below_threshold_from_facts(
    pool: &Pool,
    binds: QueryBinds<'_>,
    threshold: domain::OriginalityPct,
) -> Result<i64, DbError> {
    let threshold = super::histogram::edge_text(threshold.hundredths());
    let count = fact_query!(
        r#"SELECT count(*) AS "below!"
             FROM fact_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) f
            WHERE f.originality_pct < $12::text::numeric"#,
        binds,
        threshold.as_str(),
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(count.below)
}
