//! One query per dashboard section (TZ §4.2), each `Scope`-parameterized.
//!
//! # Two invariants every function here upholds
//!
//! **Scope is a parameter.** Every function takes a [`compliance::Scope`] and
//! hands it to SQL as the two bind values of the canonical predicate
//! (`compliance::Scope` docs, AGENTS.md invariant #3). Callers that legitimately
//! see everything pass [`Scope::All`](compliance::Scope::All) explicitly; there
//! is no overload that omits it.
//!
//! **Everything returned here is RAW.** These are internal-contour numbers,
//! before any k-anonymity screening: exact counts, exact sums, group sizes
//! included - the `units` grain in particular exists so the caller can build the
//! faculty × work-type matrix that [`compliance::suppress_matrix`] needs. **No
//! value from this module may be serialized into a public response before it
//! has passed through [`compliance::KPolicy`]** (invariant #2). The `api` layer
//! is where that happens, and its `KAnonymityGuard` is the backstop.
//!
//! # Where the numbers come from
//!
//! Every section reads `agg_cells` - `agg_monthly` rolled up to
//! (month, academic year, unit, work type) - never the fact table
//! (ARCHITECTURE.md §3.3). There are exactly four documented exceptions, each
//! justified at its call site:
//!
//! 1. the **boundary months** of a period that does not cover whole months
//!    (handled inside `agg_cells` itself, migration 0003);
//! 2. **[`histogram`]** when `settings.histogram_buckets` differs from the
//!    ADR-008 §8 defaults baked into `agg_monthly`'s FILTER columns, and
//!    **[`summary`]**'s below-threshold count when
//!    `settings.originality_threshold` is not one of those four edges;
//! 3. **[`rechecks`]**, whose distinct-work counts are not additive across the
//!    key of `agg_rechecks_yearly`;
//! 4. **[`usage`]** under a filter outside `agg_usage_monthly`'s key.

use crate::filters::QueryBinds;

pub mod coverage;
pub mod escalations;
pub mod histogram;
pub mod public_cube;
pub mod rechecks;
pub mod summary;
pub mod timeseries;
pub mod units;
pub mod usage;
pub mod work_types;
pub mod yoy;

pub use coverage::{CoverageRow, coverage};
pub use escalations::{EscalationsRow, escalations};
pub use histogram::{HistogramRow, histogram};
pub use public_cube::{
    CubeCell, CubeGroup, CubeKey, PublicCube, bucket_edge_index, coverage_denominators,
    public_cube, released_below_threshold, released_buckets,
};
pub use rechecks::{RechecksRow, rechecks};
pub use summary::{SummaryRow, summary};
pub use timeseries::{TimeseriesPoint, timeseries};
pub use units::{UnitDepth, UnitRow, units};
pub use usage::{UsagePoint, usage};
pub use work_types::{WorkTypeRow, work_types};
pub use yoy::{YoyRow, yoy};

/// Exact hundredths of a percentage point per whole percent. Originality is
/// summed as an exact `NUMERIC` in SQL and returned in hundredths, so the mean
/// is computed once, here, from integers - never from an average of averages
/// and never through a float sum whose result depends on row order.
const HUNDREDTHS_PER_PERCENT: f64 = 100.0;

/// Weighted mean originality in percent, or `None` for an empty group.
#[must_use]
pub(crate) fn mean_originality(sum_hundredths: i64, checks: i64) -> Option<f64> {
    (checks > 0).then(|| {
        #[expect(
            clippy::cast_precision_loss,
            reason = "a sum of at most 10_000 per row over the fixture and \
                      production volumes stays far inside f64's exact integer range"
        )]
        let sum = sum_hundredths as f64;
        #[expect(
            clippy::cast_precision_loss,
            reason = "row counts are bounded by the fact table size"
        )]
        let count = checks as f64;
        sum / (count * HUNDREDTHS_PER_PERCENT)
    })
}

/// The four bucket edges hard-coded into `agg_monthly`'s FILTER columns
/// (ADR-008 §8 defaults), in hundredths of a percent. A request that needs
/// other edges cannot use those columns and falls back to `fact_cells`.
pub(crate) const AGG_BUCKET_EDGES_HUNDREDTHS: [u16; 4] = [5_000, 7_000, 8_500, 9_500];

/// Expand the fifteen bind parameters of the `agg_cells` function, in order,
/// after the SQL literal. Extra parameters continue at `$16`.
///
/// This is repetition removal, not SQL composition: the statement itself is a
/// literal that `sqlx::query!` still checks against the live schema.
macro_rules! agg_query {
    ($sql:tt, $binds:ident $(, $extra:expr)* $(,)?) => {
        sqlx::query!(
            $sql,
            $binds.period().full_from(),
            $binds.period().full_to(),
            $binds.period().partial1_from(),
            $binds.period().partial1_to(),
            $binds.period().partial2_from(),
            $binds.period().partial2_to(),
            $binds.exclude_deleted(),
            $binds.scope_faculty_id(),
            $binds.scope_department_id(),
            $binds.faculty_code(),
            $binds.department_code(),
            $binds.program_code(),
            $binds.work_type_code(),
            $binds.status(),
            $binds.initiator(),
            $($extra),*
        )
    };
}

/// Expand the eleven bind parameters of the `fact_cells` function, in order,
/// after the SQL literal. Extra parameters continue at `$12`.
macro_rules! fact_query {
    ($sql:tt, $binds:ident $(, $extra:expr)* $(,)?) => {
        sqlx::query!(
            $sql,
            $binds.period().from(),
            $binds.period().to(),
            $binds.exclude_deleted(),
            $binds.scope_faculty_id(),
            $binds.scope_department_id(),
            $binds.faculty_code(),
            $binds.department_code(),
            $binds.program_code(),
            $binds.work_type_code(),
            $binds.status(),
            $binds.initiator(),
            $($extra),*
        )
    };
}

pub(crate) use {agg_query, fact_query};

/// Build the bind set for one request: filters, scope and the current
/// `settings.exclude_deleted` toggle.
pub(crate) async fn binds<'a>(
    pool: &crate::Pool,
    filters: &'a domain::Filters,
    scope: compliance::Scope,
) -> Result<QueryBinds<'a>, crate::DbError> {
    let exclude_deleted = crate::settings::exclude_deleted(pool).await?;
    QueryBinds::new(filters, scope, exclude_deleted)
}
