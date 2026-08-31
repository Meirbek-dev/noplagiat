//! The **released cube** - the entire data universe of the public contour
//! (ADR-016).
//!
//! # Why this module exists
//!
//! Until ADR-016 the public endpoints read the same raw `db::q::*` aggregates
//! the internal contour reads and suppressed them on the way out. Two attacks
//! survived that (ADR-016 §2):
//!
//! * **differencing** - the public `from`/`to` accepted arbitrary days, so
//!   walking a window's end by one day and subtracting two individually
//!   `n >= k` responses recovered a single check's originality exactly;
//! * **cross-response reconstruction** - complementary suppression hides a cell
//!   only *within one response*, and every hidden cell was separately
//!   addressable through a narrower filter, so `total − Σ visible` recovered it.
//!
//! Both have the same root cause: a suppressed group's numbers were still being
//! transmitted, folded into a total. TZ §6.2 says «подавленные значения не
//! передаются клиенту ни в каком виде», and a total that contains them *is* a
//! form of transmission.
//!
//! # The fix, in one sentence
//!
//! The public contour publishes sums over the cube
//! `(month, faculty, work_type)` restricted to cells with `n >= k`, and nothing
//! else. Every public number is then an arithmetic combination of values that
//! are *already published*, so differencing and margins are closed by
//! construction: subtracting two public answers can only ever yield a sum of
//! released cells.
//!
//! # Consequences visible in this module's shape
//!
//! * **A sub-k cell's measures never leave SQL.** [`PublicCube`] retains the
//!   released cells and, for the withheld ones, nothing but a count and their
//!   grouping labels - never `n`, never a sum.
//! * **No boundary-month fact scan.** Public periods are snapped to whole
//!   months (`domain::Period::snap_to_months`), so this reads `agg_monthly`
//!   directly rather than through `agg_cells`. The internal contour keeps the
//!   ragged-range machinery.
//! * **No `status` dimension.** The cube cannot carry status without splitting
//!   ~5 % of all rows into sub-k cells, so TZ §4.3's status filter is internal
//!   only (ADR-016 §3).
//!
//! Two documented fact-table exceptions remain, and both are restricted to the
//! released key set so they cannot reopen the hole:
//! [`released_below_threshold`] (an `originality_threshold` that is not one of
//! the four `agg_monthly` bucket edges) and [`released_buckets`]
//! (`histogram_buckets` moved off the ADR-008 §8 defaults).

use std::collections::{BTreeMap, BTreeSet};

use compliance::{KPolicy, Scope};
use domain::{AcademicYear, BucketBoundaries, Filters};
use sqlx::types::time::Date;

use super::fact_query;
use crate::{DbError, Pool};

/// The grouping key of one cube cell.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct CubeKey {
    /// First day of the month, in the university's +05:00 civil calendar.
    pub month: Date,
    pub faculty_code: String,
    pub work_type_code: String,
}

/// One **released** cell: a group of at least `k` checks, at the only grain the
/// public contour ever aggregates from.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CubeCell {
    pub key: CubeKey,
    /// `AcademicYear(2024)` is AY 2024/25 - read from the materialized column,
    /// so `/yoy` splits exactly where `db::q::yoy` does.
    pub academic_year: AcademicYear,
    pub checks: i64,
    /// Exact sum of originality in hundredths of a percentage point.
    pub sum_originality_hundredths: i64,
    /// The five ADR-008 §8 bands, lowest first.
    pub buckets: [i64; 5],
    pub escalated: i64,
    /// Checks that were not the first attempt on their work (ADR-008 §9).
    pub rechecks: i64,
}

/// A roll-up of released cells: everything a public response may publish about
/// one display group.
///
/// Every field is a sum over released cells only. `suppressed_cells` is a
/// count, never a size: it says *how many* small groups were withheld, and
/// says nothing about how small they were.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct CubeGroup {
    pub checks: i64,
    pub sum_originality_hundredths: i64,
    pub buckets: [i64; 5],
    pub escalated: i64,
    pub rechecks: i64,
    /// Cube cells inside this group that held `0 < n < k`.
    pub suppressed_cells: u32,
}

impl CubeGroup {
    fn add(&mut self, cell: &CubeCell) {
        self.checks += cell.checks;
        self.sum_originality_hundredths += cell.sum_originality_hundredths;
        for (total, bucket) in self.buckets.iter_mut().zip(cell.buckets) {
            *total += bucket;
        }
        self.escalated += cell.escalated;
        self.rechecks += cell.rechecks;
    }

    /// Group size for k-anonymity screening. `>= k` for any group holding at
    /// least one released cell, and `0` for a group holding none.
    #[must_use]
    pub fn observations(&self) -> u64 {
        u64::try_from(self.checks).unwrap_or(0)
    }

    /// Whether this display group has no released cells - the «недостаточно
    /// данных» state of TZ §8.
    #[must_use]
    pub fn is_withheld(&self) -> bool {
        self.checks == 0
    }

    /// Checks below `settings.originality_threshold` when that threshold is one
    /// of the four bucket edges baked into `agg_monthly`: the bands are
    /// lower-inclusive, so the count is the cumulative sum up to `edge_index`.
    #[must_use]
    pub fn below_bucket_edge(&self, edge_index: usize) -> i64 {
        self.buckets.iter().take(edge_index + 1).sum()
    }

    /// Total of the five bands - equal to [`Self::checks`](Self::checks), and
    /// asserted so by a test, because a divergence would mean the aggregate and
    /// its bands disagree.
    #[must_use]
    pub fn bucket_total(&self) -> i64 {
        self.buckets.iter().sum()
    }
}

/// The released cells of one public request, plus the labels of the groups that
/// were withheld.
#[derive(Debug, Clone)]
pub struct PublicCube {
    cells: Vec<CubeCell>,
    /// Keys of cells with `0 < n < k`. Only the labels survive - the counts and
    /// sums are dropped in [`PublicCube::build`] and never reach a caller.
    withheld: Vec<CubeKey>,
    /// Academic year of every withheld key, so a year with only small cells is
    /// still *shown* as «недостаточно данных» rather than vanishing.
    withheld_years: Vec<AcademicYear>,
}

impl PublicCube {
    fn build(rows: Vec<CubeRow>, policy: KPolicy) -> Self {
        let k = i64::from(policy.threshold().get());
        let mut cells = Vec::new();
        let mut withheld = Vec::new();
        let mut withheld_years = Vec::new();
        for row in rows {
            if row.cell.checks >= k {
                cells.push(row.cell);
            } else if row.cell.checks > 0 {
                withheld_years.push(row.cell.academic_year);
                withheld.push(row.cell.key);
            }
        }
        Self {
            cells,
            withheld,
            withheld_years,
        }
    }

    /// The released cells, ascending by key.
    #[must_use]
    pub fn cells(&self) -> &[CubeCell] {
        &self.cells
    }

    /// The released keys, for the two fact-table exceptions.
    #[must_use]
    pub fn released_keys(&self) -> Vec<&CubeKey> {
        self.cells.iter().map(|cell| &cell.key).collect()
    }

    /// How many cube cells this request withheld. Published: it is what makes
    /// «недостаточно данных» explicit (TZ §8) and it reveals no group size.
    #[must_use]
    pub fn suppressed_cells(&self) -> u32 {
        u32::try_from(self.withheld.len()).unwrap_or(u32::MAX)
    }

    /// The whole request as one group.
    #[must_use]
    pub fn total(&self) -> CubeGroup {
        let mut group = CubeGroup {
            suppressed_cells: self.suppressed_cells(),
            ..CubeGroup::default()
        };
        for cell in &self.cells {
            group.add(cell);
        }
        group
    }

    /// Roll up by an arbitrary label, keeping groups that hold only withheld
    /// cells so they can be rendered as «недостаточно данных».
    fn roll_up<K: Ord + Clone>(
        &self,
        of_cell: impl Fn(&CubeCell) -> K,
        of_withheld: impl Fn(usize, &CubeKey) -> K,
    ) -> Vec<(K, CubeGroup)> {
        let mut groups: BTreeMap<K, CubeGroup> = BTreeMap::new();
        for cell in &self.cells {
            groups.entry(of_cell(cell)).or_default().add(cell);
        }
        for (index, key) in self.withheld.iter().enumerate() {
            groups
                .entry(of_withheld(index, key))
                .or_default()
                .suppressed_cells += 1;
        }
        groups.into_iter().collect()
    }

    /// TZ §4.2 §2 - one group per month, ascending.
    #[must_use]
    pub fn by_month(&self) -> Vec<(Date, CubeGroup)> {
        self.roll_up(|cell| cell.key.month, |_, key| key.month)
    }

    /// TZ §4.2 §4 - one group per faculty, by dictionary code.
    #[must_use]
    pub fn by_faculty(&self) -> Vec<(String, CubeGroup)> {
        self.roll_up(
            |cell| cell.key.faculty_code.clone(),
            |_, key| key.faculty_code.clone(),
        )
    }

    /// TZ §4.2 §3 - one group per work type, by dictionary code.
    #[must_use]
    pub fn by_work_type(&self) -> Vec<(String, CubeGroup)> {
        self.roll_up(
            |cell| cell.key.work_type_code.clone(),
            |_, key| key.work_type_code.clone(),
        )
    }

    /// TZ §4.2 §9 - one group per academic year, ascending.
    #[must_use]
    pub fn by_academic_year(&self) -> Vec<(AcademicYear, CubeGroup)> {
        self.roll_up(
            |cell| cell.academic_year,
            |index, _| {
                self.withheld_years
                    .get(index)
                    .copied()
                    .unwrap_or(AcademicYear(0))
            },
        )
    }

    /// Released checks for the `(academic year, work type)` pairs the registrar
    /// supplied a denominator for - the numerator of TZ §4.2 §1's coverage.
    #[must_use]
    pub fn checks_for(&self, academic_year: AcademicYear, work_type_code: &str) -> i64 {
        self.cells
            .iter()
            .filter(|cell| {
                cell.academic_year == academic_year && cell.key.work_type_code == work_type_code
            })
            .map(|cell| cell.checks)
            .sum()
    }

    /// Academic years the released cells touch, ascending - the range the
    /// coverage denominators are read for.
    #[must_use]
    pub fn academic_years(&self) -> Vec<AcademicYear> {
        let years: BTreeSet<i16> = self
            .cells
            .iter()
            .map(|cell| cell.academic_year.0)
            .chain(self.withheld_years.iter().map(|year| year.0))
            .collect();
        years.into_iter().map(AcademicYear).collect()
    }
}

/// One row of the cube query, before the release decision.
struct CubeRow {
    cell: CubeCell,
}

/// Where `threshold` sits among the four bucket edges baked into
/// `agg_monthly`, or `None` when no column answers it and
/// [`released_below_threshold`] has to scan the fact table.
///
/// The bands are lower-inclusive, so a threshold *equal to* an edge is the
/// cumulative sum up to and including the band below it - index 1 (`b_50_70`)
/// for the default 70 %.
#[must_use]
pub fn bucket_edge_index(threshold: domain::OriginalityPct) -> Option<usize> {
    super::AGG_BUCKET_EDGES_HUNDREDTHS
        .iter()
        .position(|edge| *edge == threshold.hundredths())
}

/// Build the released cube for one public request (ADR-016 §2).
///
/// `filters` must already be month-snapped - `PublicFilterQuery::resolve` does
/// that, and a ragged range would simply read the whole boundary months here,
/// which is the same answer the snapped range gives.
///
/// `scope` is [`Scope::All`] for every public caller (the public contour is
/// university-wide by definition), but it is a parameter like every other query
/// in this module so that an unscoped read cannot be written (AGENTS.md
/// invariant #3).
pub async fn public_cube(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
    policy: KPolicy,
) -> Result<PublicCube, DbError> {
    let binds = super::binds(pool, filters, scope).await?;
    let period = binds.period();
    let (scope_faculty, scope_department) = (binds.scope_faculty_id(), binds.scope_department_id());

    // The period is whole months, so `agg_monthly` answers it on its own and
    // the `agg_cells` boundary-month union is not needed (ADR-016 §2).
    // `full_from`/`full_to` are the first days of the first and last month.
    let rows = sqlx::query!(
        r#"SELECT a.month                                        AS "month!",
                  min(a.academic_year)::smallint                 AS "academic_year!",
                  f.code                                         AS "faculty_code!",
                  w.code                                         AS "work_type_code!",
                  sum(a.checks)::bigint                          AS "checks!",
                  (sum(a.sum_originality) * 100)::bigint         AS "sum_originality_hundredths!",
                  sum(a.b_lt50)::bigint                          AS "b_lt50!",
                  sum(a.b_50_70)::bigint                         AS "b_50_70!",
                  sum(a.b_70_85)::bigint                         AS "b_70_85!",
                  sum(a.b_85_95)::bigint                         AS "b_85_95!",
                  sum(a.b_ge95)::bigint                          AS "b_ge95!",
                  sum(a.escalated)::bigint                       AS "escalated!",
                  sum(a.rechecks)::bigint                        AS "rechecks!"
             FROM agg_monthly a
             JOIN faculties f ON f.id = a.faculty_id
             JOIN work_types w ON w.id = a.work_type_id
            WHERE $1::date IS NOT NULL
              AND a.month >= $1 AND a.month <= $2
              AND (NOT COALESCE($3, TRUE) OR NOT a.deleted)
              -- Canonical RBAC scope predicate (compliance::Scope, invariant #3).
              AND ($4::bigint IS NULL OR a.faculty_id = $4)
              AND ($5::bigint IS NULL OR a.department_id = $5)
              AND ($6::text IS NULL
                   OR a.faculty_id = (SELECT id FROM faculties WHERE code = $6))
              AND ($7::text IS NULL
                   OR a.work_type_id = (SELECT id FROM work_types WHERE code = $7))
            GROUP BY 1, 3, 4
            ORDER BY 1, 3, 4"#,
        period.full_from(),
        period.full_to(),
        binds.exclude_deleted(),
        scope_faculty,
        scope_department,
        binds.faculty_code(),
        binds.work_type_code(),
    )
    .fetch_all(pool.pg())
    .await?;

    let rows = rows
        .into_iter()
        .map(|row| CubeRow {
            cell: CubeCell {
                key: CubeKey {
                    month: row.month,
                    faculty_code: row.faculty_code,
                    work_type_code: row.work_type_code,
                },
                academic_year: AcademicYear(row.academic_year),
                checks: row.checks,
                sum_originality_hundredths: row.sum_originality_hundredths,
                buckets: [
                    row.b_lt50,
                    row.b_50_70,
                    row.b_70_85,
                    row.b_85_95,
                    row.b_ge95,
                ],
                escalated: row.escalated,
                rechecks: row.rechecks,
            },
        })
        .collect();

    Ok(PublicCube::build(rows, policy))
}

/// The released key set, split into the three parallel arrays the two
/// fact-table exceptions join against.
fn released_arrays(cube: &PublicCube) -> (Vec<Date>, Vec<String>, Vec<String>) {
    let mut months = Vec::with_capacity(cube.cells.len());
    let mut faculties = Vec::with_capacity(cube.cells.len());
    let mut work_types = Vec::with_capacity(cube.cells.len());
    for cell in &cube.cells {
        months.push(cell.key.month);
        faculties.push(cell.key.faculty_code.clone());
        work_types.push(cell.key.work_type_code.clone());
    }
    (months, faculties, work_types)
}

/// Documented fact-table exception (a): `settings.originality_threshold` is not
/// one of the four `agg_monthly` bucket edges, so no column answers it.
///
/// The scan is **joined to the released key set**, so a sub-k cell contributes
/// nothing - without that join this function would reopen exactly the hole
/// ADR-016 closes.
pub async fn released_below_threshold(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
    cube: &PublicCube,
    threshold: domain::OriginalityPct,
) -> Result<i64, DbError> {
    if cube.cells.is_empty() {
        return Ok(0);
    }
    let binds = super::binds(pool, filters, scope).await?;
    let (months, faculties, work_types) = released_arrays(cube);
    let edge = super::histogram::edge_text(threshold.hundredths());

    let row = fact_query!(
        r#"SELECT count(*) AS "below!"
             FROM fact_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) f
             JOIN faculties fa ON fa.id = f.faculty_id
             JOIN work_types wt ON wt.id = f.work_type_id
             JOIN unnest($12::date[], $13::text[], $14::text[])
                    AS released(month, faculty_code, work_type_code)
                    ON released.month = f.month
                   AND released.faculty_code = fa.code
                   AND released.work_type_code = wt.code
            WHERE f.originality_pct < $15::text::numeric"#,
        binds,
        &months,
        &faculties,
        &work_types,
        edge.as_str(),
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(row.below)
}

/// Documented fact-table exception (b): `settings.histogram_buckets` differs
/// from the ADR-008 §8 defaults baked into `agg_monthly`'s FILTER columns.
///
/// Restricted to the released key set for the same reason as
/// [`released_below_threshold`].
pub async fn released_buckets(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
    cube: &PublicCube,
    boundaries: BucketBoundaries,
) -> Result<[i64; 5], DbError> {
    if cube.cells.is_empty() {
        return Ok([0; 5]);
    }
    let binds = super::binds(pool, filters, scope).await?;
    let (months, faculties, work_types) = released_arrays(cube);
    let [first, second, third, fourth] = boundaries
        .edges_hundredths()
        .map(super::histogram::edge_text);

    let row = fact_query!(
        r#"SELECT count(*) FILTER (WHERE f.originality_pct < $15::text::numeric)
                      AS "lt50!",
                  count(*) FILTER (WHERE f.originality_pct >= $15::text::numeric
                                     AND f.originality_pct < $16::text::numeric)
                      AS "b50_70!",
                  count(*) FILTER (WHERE f.originality_pct >= $16::text::numeric
                                     AND f.originality_pct < $17::text::numeric)
                      AS "b70_85!",
                  count(*) FILTER (WHERE f.originality_pct >= $17::text::numeric
                                     AND f.originality_pct < $18::text::numeric)
                      AS "b85_95!",
                  count(*) FILTER (WHERE f.originality_pct >= $18::text::numeric)
                      AS "ge95!"
             FROM fact_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) f
             JOIN faculties fa ON fa.id = f.faculty_id
             JOIN work_types wt ON wt.id = f.work_type_id
             JOIN unnest($12::date[], $13::text[], $14::text[])
                    AS released(month, faculty_code, work_type_code)
                    ON released.month = f.month
                   AND released.faculty_code = fa.code
                   AND released.work_type_code = wt.code"#,
        binds,
        &months,
        &faculties,
        &work_types,
        first.as_str(),
        second.as_str(),
        third.as_str(),
        fourth.as_str(),
    )
    .fetch_one(pool.pg())
    .await?;

    Ok([row.lt50, row.b50_70, row.b70_85, row.b85_95, row.ge95])
}

/// Coverage denominators (TZ §4.2 §1): works actually submitted, from the
/// registrar's `submission_totals`.
///
/// Not fact data, so not part of the cube and not suppressible; the *numerator*
/// is [`PublicCube::checks_for`], which is a sum of released cells.
pub async fn coverage_denominators(
    pool: &Pool,
    from_year: i16,
    to_year: i16,
    work_type_code: Option<&str>,
) -> Result<Vec<(AcademicYear, String, i32)>, DbError> {
    let rows = sqlx::query!(
        r#"SELECT st.academic_year AS "academic_year!",
                  wt.code          AS "work_type_code!",
                  st.total_submitted AS "total_submitted!"
             FROM submission_totals st
             JOIN work_types wt ON wt.id = st.work_type_id
            WHERE st.academic_year >= $1 AND st.academic_year <= $2
              AND ($3::text IS NULL OR wt.code = $3)
            ORDER BY 1, 2"#,
        from_year,
        to_year,
        work_type_code,
    )
    .fetch_all(pool.pg())
    .await?;

    Ok(rows
        .into_iter()
        .map(|row| {
            (
                AcademicYear(row.academic_year),
                row.work_type_code,
                row.total_submitted,
            )
        })
        .collect())
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The first day of a month, built through the ordinal date - the driver
    /// does not re-export `time::Month`, and `db::filters` avoids naming it for
    /// the same reason.
    fn month_start(year: i32, month: u32) -> Date {
        const DAYS_BEFORE: [u16; 12] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        let ordinal = DAYS_BEFORE.get(month as usize - 1).copied().unwrap_or(0)
            + u16::from(leap && month > 2)
            + 1;
        Date::from_ordinal_date(year, ordinal).unwrap_or(Date::MIN)
    }

    fn key(month: (i32, u32), faculty: &str, work_type: &str) -> CubeKey {
        CubeKey {
            month: month_start(month.0, month.1),
            faculty_code: faculty.to_owned(),
            work_type_code: work_type.to_owned(),
        }
    }

    fn cell(key: CubeKey, year: i16, checks: i64) -> CubeCell {
        CubeCell {
            key,
            academic_year: AcademicYear(year),
            checks,
            sum_originality_hundredths: checks * 8_000,
            buckets: [0, checks, 0, 0, 0],
            escalated: checks / 10,
            rechecks: checks / 20,
        }
    }

    fn cube(cells: Vec<(CubeKey, i16, i64)>, k: u32) -> PublicCube {
        let policy = KPolicy::new(
            compliance::KThreshold::new(k).unwrap_or_else(|_| compliance::KThreshold::default()),
        );
        PublicCube::build(
            cells
                .into_iter()
                .map(|(key, year, checks)| CubeRow {
                    cell: cell(key, year, checks),
                })
                .collect(),
            policy,
        )
    }

    #[test]
    fn a_sub_k_cell_contributes_to_nothing() {
        let built = cube(
            vec![
                (key((2025, 11), "FAC01", "course"), 2025, 40),
                // Below k: must not appear in any total, only in the counter.
                (key((2025, 11), "FAC08", "course"), 2025, 3),
            ],
            5,
        );

        assert_eq!(built.cells().len(), 1);
        assert_eq!(built.suppressed_cells(), 1);
        let total = built.total();
        assert_eq!(total.checks, 40, "the withheld 3 must not be in the total");
        assert_eq!(total.suppressed_cells, 1);

        // The faculty whose only cell was withheld is still *listed*, so the UI
        // shows «недостаточно данных» rather than silently dropping it.
        let faculties = built.by_faculty();
        assert_eq!(faculties.len(), 2);
        let withheld = faculties
            .iter()
            .find(|(code, _)| code == "FAC08")
            .map(|(_, group)| *group)
            .unwrap_or_default();
        assert!(withheld.is_withheld());
        assert_eq!(withheld.checks, 0);
        assert_eq!(withheld.suppressed_cells, 1);
    }

    #[test]
    fn an_empty_cell_is_neither_released_nor_counted() {
        let built = cube(vec![(key((2025, 11), "FAC01", "course"), 2025, 0)], 5);
        assert_eq!(built.cells().len(), 0);
        assert_eq!(
            built.suppressed_cells(),
            0,
            "a cell with no data is absence, not suppression"
        );
    }

    #[test]
    fn roll_ups_partition_the_released_cells() {
        let built = cube(
            vec![
                (key((2025, 10), "FAC01", "course"), 2025, 40),
                (key((2025, 11), "FAC01", "article"), 2025, 60),
                (key((2025, 11), "FAC02", "course"), 2025, 10),
                (key((2026, 9), "FAC01", "course"), 2026, 20),
            ],
            5,
        );
        let total = built.total().checks;
        assert_eq!(total, 130);

        for rolled in [
            built.by_month().iter().map(|(_, g)| g.checks).sum::<i64>(),
            built.by_faculty().iter().map(|(_, g)| g.checks).sum(),
            built.by_work_type().iter().map(|(_, g)| g.checks).sum(),
            built.by_academic_year().iter().map(|(_, g)| g.checks).sum(),
        ] {
            assert_eq!(rolled, total, "every roll-up partitions the same cells");
        }

        assert_eq!(built.by_month().len(), 3);
        assert_eq!(built.by_academic_year().len(), 2);
        assert_eq!(
            built.academic_years(),
            vec![AcademicYear(2025), AcademicYear(2026)]
        );
    }

    #[test]
    fn the_bucket_edge_below_count_is_cumulative() {
        let group = CubeGroup {
            checks: 100,
            buckets: [7, 13, 30, 40, 10],
            ..CubeGroup::default()
        };
        assert_eq!(group.bucket_total(), 100);
        assert_eq!(group.below_bucket_edge(0), 7);
        assert_eq!(group.below_bucket_edge(1), 20);
        assert_eq!(group.below_bucket_edge(3), 90);
    }
}
