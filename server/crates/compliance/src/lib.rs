//! Compliance primitives: k-anonymity screening and RBAC scope.
//!
//! Invariant #2 (AGENTS.md): public DTOs are built only from [`Screened`]
//! values. Constructing them from raw aggregates must not compile.
//! Invariant #3: every internal query takes a [`Scope`]; filtering happens
//! in SQL, never in post-processing.

use std::sync::{Mutex, PoisonError};
use std::time::{Duration, Instant};

use serde::ser::{Serialize, Serializer};

/// Sentinel emitted for suppressed cells (TZ §6.2 - «недостаточно данных»).
pub const SUPPRESSED_MARKER: &str = "insufficient_data";

/// A metric cell that has passed k-anonymity screening.
///
/// The representation and constructors are private: downstream crates can
/// transform an already-screened value, but cannot mark a raw value as safe.
///
/// ```compile_fail
/// use compliance::Screened;
///
/// let _bypass = Screened::Value(42_u64);
/// ```
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Screened<T>(ScreenedState<T>);

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ScreenedState<T> {
    Value(T),
    Suppressed,
}

impl<T> Screened<T> {
    fn value(value: T) -> Self {
        Self(ScreenedState::Value(value))
    }

    fn suppressed() -> Self {
        Self(ScreenedState::Suppressed)
    }

    pub fn is_suppressed(&self) -> bool {
        matches!(self.0, ScreenedState::Suppressed)
    }

    /// Return a value only when it was released by the policy.
    pub fn visible_value(&self) -> Option<&T> {
        match &self.0 {
            ScreenedState::Value(value) => Some(value),
            ScreenedState::Suppressed => None,
        }
    }

    /// Transform a released value while preserving suppression.
    pub fn map<U>(self, f: impl FnOnce(T) -> U) -> Screened<U> {
        match self.0 {
            ScreenedState::Value(value) => Screened::value(f(value)),
            ScreenedState::Suppressed => Screened::suppressed(),
        }
    }
}

impl<T: Serialize> Serialize for Screened<T> {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        match &self.0 {
            ScreenedState::Value(value) => value.serialize(serializer),
            ScreenedState::Suppressed => serializer.serialize_str(SUPPRESSED_MARKER),
        }
    }
}

/// Validated k-anonymity threshold. Zero is unrepresentable outside this crate.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct KThreshold(u32);

impl KThreshold {
    pub fn new(value: u32) -> Result<Self, InvalidKThreshold> {
        if value == 0 {
            Err(InvalidKThreshold)
        } else {
            Ok(Self(value))
        }
    }

    pub fn get(self) -> u32 {
        self.0
    }
}

impl Default for KThreshold {
    fn default() -> Self {
        Self(5)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
#[error("k-anonymity threshold must be greater than zero")]
pub struct InvalidKThreshold;

/// Active k-anonymity policy, loaded from `settings.k_threshold` (default 5).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct KPolicy {
    threshold: KThreshold,
}

impl KPolicy {
    pub fn new(threshold: KThreshold) -> Self {
        Self { threshold }
    }

    pub fn threshold(self) -> KThreshold {
        self.threshold
    }

    /// Screen a metric computed over a group of `observations` records.
    pub fn screen<T>(&self, observations: u64, value: T) -> Screened<T> {
        if observations < u64::from(self.threshold.get()) {
            Screened::suppressed()
        } else {
            Screened::value(value)
        }
    }
}

impl Default for KPolicy {
    fn default() -> Self {
        Self::new(KThreshold::default())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
pub enum KPolicyError {
    #[error("settings.k_threshold must be a JSON integer")]
    NotAnInteger,
    #[error("settings.k_threshold does not fit in an unsigned 32-bit integer")]
    OutOfRange,
    #[error(transparent)]
    InvalidThreshold(#[from] InvalidKThreshold),
}

impl KPolicy {
    /// Build the active policy from the raw `settings.k_threshold` JSON value.
    ///
    /// A malformed setting is an error, never a silent fallback to the default:
    /// suppression must not weaken because an administrator typed `"5"` instead
    /// of `5`.
    pub fn from_settings(value: &serde_json::Value) -> Result<Self, KPolicyError> {
        let threshold = value.as_i64().ok_or(KPolicyError::NotAnInteger)?;
        let threshold = u32::try_from(threshold).map_err(|_| KPolicyError::OutOfRange)?;
        Ok(Self::new(KThreshold::new(threshold)?))
    }
}

/// The TTL of [`KPolicyCache`] (ARCHITECTURE.md §4.3: changing `k` takes
/// effect without a redeploy, within a minute).
pub const K_POLICY_TTL: Duration = Duration::from_secs(60);

/// A time-bounded cache for the active [`KPolicy`].
///
/// Deliberately synchronous and runtime-agnostic (`std::sync::Mutex` +
/// `Instant`, no tokio): the caller owns the asynchronous reload.
///
/// ```
/// # use compliance::{KPolicy, KPolicyCache};
/// # fn load_from_settings() -> KPolicy { KPolicy::default() }
/// let cache = KPolicyCache::new();
/// let policy = match cache.get() {
///     Some(policy) => policy,
///     None => {
///         let policy = load_from_settings(); // ← `db::settings::k_threshold(&pool).await?`
///         cache.store(policy);
///         policy
///     }
/// };
/// # let _ = policy;
/// ```
#[derive(Debug)]
pub struct KPolicyCache {
    ttl: Duration,
    state: Mutex<Option<(KPolicy, Instant)>>,
}

impl KPolicyCache {
    #[must_use]
    pub fn new() -> Self {
        Self::with_ttl(K_POLICY_TTL)
    }

    #[must_use]
    pub fn with_ttl(ttl: Duration) -> Self {
        Self {
            ttl,
            state: Mutex::new(None),
        }
    }

    #[must_use]
    pub fn ttl(&self) -> Duration {
        self.ttl
    }

    /// The cached policy, or `None` when empty or older than the TTL.
    #[must_use]
    pub fn get(&self) -> Option<KPolicy> {
        let state = self.state.lock().unwrap_or_else(PoisonError::into_inner);
        state
            .filter(|(_, loaded_at)| loaded_at.elapsed() < self.ttl)
            .map(|(policy, _)| policy)
    }

    pub fn store(&self, policy: KPolicy) {
        let mut state = self.state.lock().unwrap_or_else(PoisonError::into_inner);
        *state = Some((policy, Instant::now()));
    }

    /// Drop the cached value - used after an admin writes `k_threshold`.
    pub fn invalidate(&self) {
        let mut state = self.state.lock().unwrap_or_else(PoisonError::into_inner);
        *state = None;
    }
}

impl Default for KPolicyCache {
    fn default() -> Self {
        Self::new()
    }
}

/// One disjoint cell before k-anonymity screening.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AggregateCell<T> {
    observations: u64,
    value: T,
}

impl<T> AggregateCell<T> {
    pub fn new(observations: u64, value: T) -> Self {
        Self {
            observations,
            value,
        }
    }

    pub fn observations(&self) -> u64 {
        self.observations
    }
}

/// An exhaustive table screened together with its grand total.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ScreenedTable<T> {
    total: Screened<T>,
    cells: Vec<Screened<T>>,
}

impl<T> ScreenedTable<T> {
    pub fn total(&self) -> &Screened<T> {
        &self.total
    }

    pub fn cells(&self) -> &[Screened<T>] {
        &self.cells
    }

    pub fn into_parts(self) -> (Screened<T>, Vec<Screened<T>>) {
        (self.total, self.cells)
    }
}

/// A cross-tabulation (rows × columns, e.g. faculty × work type) together with
/// its margins, before screening.
///
/// Cells are row-major. Margin *values* are supplied by the caller because they
/// are not always additive (an average row total is not a sum of averages);
/// margin *observation counts* are derived here, since those always are.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AggregateMatrix<T> {
    columns: usize,
    cells: Vec<AggregateCell<T>>,
    row_totals: Vec<T>,
    column_totals: Vec<T>,
    grand_total: T,
}

impl<T> AggregateMatrix<T> {
    pub fn new(
        columns: usize,
        cells: Vec<AggregateCell<T>>,
        row_totals: Vec<T>,
        column_totals: Vec<T>,
        grand_total: T,
    ) -> Result<Self, SuppressionError> {
        let rows = row_totals.len();
        let dimensions_agree = columns > 0
            && rows > 0
            && column_totals.len() == columns
            && cells.len() == rows.saturating_mul(columns);
        if !dimensions_agree {
            return Err(SuppressionError::DimensionMismatch);
        }
        Ok(Self {
            columns,
            cells,
            row_totals,
            column_totals,
            grand_total,
        })
    }

    #[must_use]
    pub fn rows(&self) -> usize {
        self.row_totals.len()
    }

    #[must_use]
    pub fn columns(&self) -> usize {
        self.columns
    }
}

/// A screened cross-tabulation. Cells and margins are all [`Screened`].
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ScreenedMatrix<T> {
    columns: usize,
    cells: Vec<Screened<T>>,
    row_totals: Vec<Screened<T>>,
    column_totals: Vec<Screened<T>>,
    grand_total: Screened<T>,
}

impl<T> ScreenedMatrix<T> {
    #[must_use]
    pub fn rows(&self) -> usize {
        self.row_totals.len()
    }

    #[must_use]
    pub fn columns(&self) -> usize {
        self.columns
    }

    #[must_use]
    pub fn cell(&self, row: usize, column: usize) -> Option<&Screened<T>> {
        if column >= self.columns {
            return None;
        }
        self.cells.get(row * self.columns + column)
    }

    /// All cells, row-major.
    #[must_use]
    pub fn cells(&self) -> &[Screened<T>] {
        &self.cells
    }

    #[must_use]
    pub fn row_total(&self, row: usize) -> Option<&Screened<T>> {
        self.row_totals.get(row)
    }

    #[must_use]
    pub fn row_totals(&self) -> &[Screened<T>] {
        &self.row_totals
    }

    #[must_use]
    pub fn column_total(&self, column: usize) -> Option<&Screened<T>> {
        self.column_totals.get(column)
    }

    #[must_use]
    pub fn column_totals(&self) -> &[Screened<T>] {
        &self.column_totals
    }

    #[must_use]
    pub fn grand_total(&self) -> &Screened<T> {
        &self.grand_total
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
pub enum SuppressionError {
    #[error("observation count overflow while screening an aggregate table")]
    ObservationCountOverflow,
    #[error("matrix dimensions do not match the supplied cells and margins")]
    DimensionMismatch,
}

/// Screen an exhaustive set of disjoint cells and its grand total (TZ §6.2).
///
/// Primary suppression hides every cell with `n < k`. If the published values
/// would then leave exactly one hidden term in the relation
/// `Σ cells = total`, the smallest still-visible cell is hidden too
/// (complementary suppression). Consequently a visible total can never be used
/// to reconstruct a uniquely hidden child.
///
/// For a two-dimensional table (faculty × work type and the like), use
/// [`suppress_matrix`]: screening rows independently is *not* sufficient,
/// because the column margins reopen the reconstruction.
pub fn suppress_table<T>(
    policy: &KPolicy,
    total_value: T,
    cells: Vec<AggregateCell<T>>,
) -> Result<ScreenedTable<T>, SuppressionError> {
    let total_observations = sum_observations(cells.iter().map(|cell| cell.observations))?;
    let total_index = cells.len();

    let mut suppressor = Suppressor::new(
        cells
            .iter()
            .map(|cell| cell.observations)
            .chain(std::iter::once(total_observations))
            .collect(),
        u64::from(policy.threshold().get()),
    );
    suppressor.close_relation(total_index + 1);

    let mut values = cells.into_iter().map(|cell| cell.value);
    let screened_cells = (0..total_index)
        .map(|index| suppressor.screen(index, values.next()))
        .collect();

    Ok(ScreenedTable {
        total: suppressor.screen(total_index, Some(total_value)),
        cells: screened_cells,
    })
}

/// Screen a two-dimensional table together with its row totals, column totals
/// and grand total (TZ §6.2; ARCHITECTURE.md §4.3).
///
/// Screening rows one at a time with [`suppress_table`] is **not** sufficient:
/// the column margins reopen every hole a row closed. So the table is screened
/// as one object, on the *extended* grid of `(rows + 1) × (columns + 1)` in
/// which the last column holds the row totals, the last row holds the column
/// totals, and the corner holds the grand total. On that grid every published
/// relation is simply "one extended row" or "one extended column", and the
/// safety requirement reads:
///
/// > no extended row and no extended column may contain **exactly one** hidden
/// > entry - otherwise that entry is the difference of published numbers, and
/// > hiding it hid nothing.
///
/// **Primary suppression** hides every extended entry observed fewer than `k`
/// times. **Complementary suppression** then hides, for each primary-hidden
/// entry `(r, c)`, the three remaining corners of a rectangle: `(r, c*)`,
/// `(r*, c)` and `(r*, c*)`, where `r*` is the extended row with the fewest
/// observations in column `c`, and `c*` the extended column with the fewest
/// observations in row `r` (index breaks ties). Each rectangle contributes
/// exactly two hidden entries to each of the two rows and two columns it
/// touches, so the union of rectangles satisfies the requirement above, and a
/// row or column that holds a hidden entry always holds a second one.
///
/// Two properties fall out of choosing the partners from the **observation
/// counts alone**, never from what is already hidden:
///
/// - the result does not depend on the order cells are visited in;
/// - it is monotone in `k` (P3). Raising `k` only grows the primary set, and
///   each entry's rectangle is unchanged, so the hidden set only grows. A
///   greedy "hide the smallest still-visible neighbour" rule has neither
///   property - the same two small cells get picked in different orders at `k`
///   and `k + 1`, and one of them resurfaces.
///
/// Non-additive metrics (averages) are screened by the same rule. That is
/// deliberately conservative: it suppresses more than reconstruction strictly
/// requires, never less.
pub fn suppress_matrix<T>(
    policy: &KPolicy,
    matrix: AggregateMatrix<T>,
) -> Result<ScreenedMatrix<T>, SuppressionError> {
    let AggregateMatrix {
        columns,
        cells,
        row_totals,
        column_totals,
        grand_total,
    } = matrix;
    let rows = row_totals.len();

    // Extended grid, row-major: data cells, then the margins as a final column
    // and a final row, with the grand total in the corner.
    let extended_columns = columns + 1;
    let extended_rows = rows + 1;
    let at = |row: usize, column: usize| row * extended_columns + column;

    let mut observations = vec![0_u64; extended_rows * extended_columns];
    for (index, cell) in cells.iter().enumerate() {
        observations[at(index / columns, index % columns)] = cell.observations;
    }
    for row in 0..rows {
        observations[at(row, columns)] =
            sum_observations((0..columns).map(|column| observations[at(row, column)]))?;
    }
    for column in 0..extended_columns {
        observations[at(rows, column)] =
            sum_observations((0..rows).map(|row| observations[at(row, column)]))?;
    }

    let mut suppressor = Suppressor::new(observations, u64::from(policy.threshold().get()));
    suppressor.close_rectangles(extended_rows, extended_columns);

    let mut cell_values = cells.into_iter().map(|cell| cell.value);
    let screened_cells = (0..rows * columns)
        .map(|index| suppressor.screen(at(index / columns, index % columns), cell_values.next()))
        .collect();
    let mut row_total_values = row_totals.into_iter();
    let screened_row_totals = (0..rows)
        .map(|row| suppressor.screen(at(row, columns), row_total_values.next()))
        .collect();
    let mut column_total_values = column_totals.into_iter();
    let screened_column_totals = (0..columns)
        .map(|column| suppressor.screen(at(rows, column), column_total_values.next()))
        .collect();

    Ok(ScreenedMatrix {
        columns,
        cells: screened_cells,
        row_totals: screened_row_totals,
        column_totals: screened_column_totals,
        grand_total: suppressor.screen(at(rows, columns), Some(grand_total)),
    })
}

fn sum_observations(mut counts: impl Iterator<Item = u64>) -> Result<u64, SuppressionError> {
    counts.try_fold(0_u64, |total, count| {
        total
            .checked_add(count)
            .ok_or(SuppressionError::ObservationCountOverflow)
    })
}

/// The shared suppression engine: the observation count behind every published
/// number, plus which of them are hidden. Both [`suppress_table`] and
/// [`suppress_matrix`] drive it, so the two can never drift apart on what
/// "hidden" means.
struct Suppressor {
    hidden: Vec<bool>,
    observations: Vec<u64>,
}

impl Suppressor {
    /// Primary suppression: every entity observed fewer than `threshold` times.
    fn new(observations: Vec<u64>, threshold: u64) -> Self {
        let hidden = observations
            .iter()
            .map(|count| *count < threshold)
            .collect();
        Self {
            hidden,
            observations,
        }
    }

    /// Complementary suppression for a single relation `Σ terms = total` over
    /// entities `0..entity_count`.
    ///
    /// One hidden term would be the difference of the published ones, so the
    /// smallest still-visible term is hidden as well - the second-smallest term
    /// of the relation, since the smallest is the one already hidden. Monotone
    /// in `k`: the newly hidden term either has exactly `k` observations, and
    /// so is hidden by primary suppression at `k + 1`, or has more than `k`, in
    /// which case no term has exactly `k` and the same term is chosen again.
    fn close_relation(&mut self, entity_count: usize) {
        if entity_count < 2 {
            return;
        }
        let hidden_terms = (0..entity_count).filter(|e| self.hidden[*e]).count();
        if hidden_terms != 1 {
            return;
        }
        if let Some(target) = (0..entity_count)
            .filter(|entity| !self.hidden[*entity])
            .min_by_key(|entity| self.order(*entity))
        {
            self.hidden[target] = true;
        }
    }

    /// Complementary suppression over an extended grid: hide the three
    /// remaining corners of a rectangle around every primary-hidden entry. See
    /// [`suppress_matrix`] for why the rectangle is chosen from the observation
    /// counts alone.
    fn close_rectangles(&mut self, rows: usize, columns: usize) {
        if rows < 2 || columns < 2 {
            return;
        }
        let primary: Vec<usize> = (0..self.hidden.len())
            .filter(|entity| self.hidden[*entity])
            .collect();

        for entity in primary {
            let (row, column) = (entity / columns, entity % columns);
            let partner_row = (0..rows)
                .filter(|candidate| *candidate != row)
                .min_by_key(|candidate| self.order(candidate * columns + column));
            let partner_column = (0..columns)
                .filter(|candidate| *candidate != column)
                .min_by_key(|candidate| self.order(row * columns + candidate));
            let (Some(partner_row), Some(partner_column)) = (partner_row, partner_column) else {
                continue;
            };

            self.hidden[row * columns + partner_column] = true;
            self.hidden[partner_row * columns + column] = true;
            self.hidden[partner_row * columns + partner_column] = true;
        }
    }

    /// Total order used wherever a "smallest" entity is chosen: fewest
    /// observations first, index as a deterministic tie-break.
    fn order(&self, entity: usize) -> (u64, usize) {
        (self.observations[entity], entity)
    }

    /// Release `value` only if the entity survived screening.
    fn screen<T>(&self, entity: usize, value: Option<T>) -> Screened<T> {
        match value {
            Some(value) if !self.hidden[entity] => Screened::value(value),
            _ => Screened::suppressed(),
        }
    }
}

/// Visibility scope of an internal-contour user. Required by every internal
/// query function in `db` - there is no unscoped internal query path
/// (AGENTS.md invariant #3).
///
/// SQLx compile-checked macros cannot take a dynamic SQL fragment, so the scope
/// is bound as two nullable parameters instead. **Every internal query must use
/// this exact pattern**, so that a missing scope is a missing bind parameter
/// rather than a silently unfiltered result set:
///
/// ```sql
/// WHERE ($1::bigint IS NULL OR faculty_id = $1)
///   AND ($2::bigint IS NULL OR department_id = $2)
/// ```
///
/// ```
/// # use compliance::Scope;
/// let scope = Scope::Faculty(7);
/// // sqlx::query!(SQL_ABOVE, scope.faculty_id(), scope.department_id())
/// assert_eq!((scope.faculty_id(), scope.department_id()), (Some(7), None));
/// ```
///
/// A `Department` scope binds only `department_id`: a department belongs to
/// exactly one faculty, so the narrower predicate is sufficient and lets the
/// planner use `idx_checks_unit_time`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Scope {
    /// Ethics officer, compliance service, admin.
    All,
    /// Dean: one faculty.
    Faculty(i64),
    /// Department head: one department.
    Department(i64),
}

impl Scope {
    /// Bind value for `$1` in the canonical predicate above.
    #[must_use]
    pub fn faculty_id(self) -> Option<i64> {
        match self {
            Self::Faculty(id) => Some(id),
            Self::All | Self::Department(_) => None,
        }
    }

    /// Bind value for `$2` in the canonical predicate above.
    #[must_use]
    pub fn department_id(self) -> Option<i64> {
        match self {
            Self::Department(id) => Some(id),
            Self::All | Self::Faculty(_) => None,
        }
    }

    /// Both bind values at once, in `($1, $2)` order.
    #[must_use]
    pub fn bindings(self) -> (Option<i64>, Option<i64>) {
        (self.faculty_id(), self.department_id())
    }

    /// Whether this scope sees the whole university.
    #[must_use]
    pub fn is_unrestricted(self) -> bool {
        matches!(self, Self::All)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    fn policy(k: u32) -> KPolicy {
        let threshold = KThreshold::new(k).expect("test threshold is non-zero");
        KPolicy::new(threshold)
    }

    /// A cross-tabulation whose published value *is* its group size, so a
    /// visible number betrays the count that produced it.
    fn matrix_from_counts(counts: &[Vec<u64>]) -> AggregateMatrix<u64> {
        let columns = counts.first().map_or(0, Vec::len);
        let cells = counts
            .iter()
            .flatten()
            .map(|count| AggregateCell::new(*count, *count))
            .collect();
        let row_totals = counts.iter().map(|row| row.iter().sum()).collect();
        let column_totals = (0..columns)
            .map(|column| counts.iter().map(|row| row[column]).sum())
            .collect();
        let grand_total = counts.iter().flatten().sum();
        AggregateMatrix::new(columns, cells, row_totals, column_totals, grand_total)
            .expect("the generated matrix is rectangular")
    }

    /// Row totals, column totals and the grand total, as counts.
    fn margins(counts: &[Vec<u64>]) -> (Vec<u64>, Vec<u64>, u64) {
        let columns = counts.first().map_or(0, Vec::len);
        (
            counts.iter().map(|row| row.iter().sum()).collect(),
            (0..columns)
                .map(|column| counts.iter().map(|row| row[column]).sum())
                .collect(),
            counts.iter().flatten().sum(),
        )
    }

    /// Rectangular count grids with deliberately small groups.
    fn counts_strategy() -> impl Strategy<Value = Vec<Vec<u64>>> {
        (1_usize..5, 1_usize..5).prop_flat_map(|(rows, columns)| {
            prop::collection::vec(
                prop::collection::vec(0_u64..25, columns..=columns),
                rows..=rows,
            )
        })
    }

    /// Number of hidden terms in each published linear relation of a matrix:
    /// one entry per row, per column, and one per margin.
    fn hidden_terms_per_relation(screened: &ScreenedMatrix<u64>) -> Vec<usize> {
        let rows = screened.rows();
        let columns = screened.columns();
        let mut counts = Vec::new();

        for row in 0..rows {
            let hidden_cells = (0..columns)
                .filter(|column| {
                    screened
                        .cell(row, *column)
                        .is_none_or(Screened::is_suppressed)
                })
                .count();
            let hidden_total =
                usize::from(screened.row_total(row).is_none_or(Screened::is_suppressed));
            counts.push(hidden_cells + hidden_total);
        }
        for column in 0..columns {
            let hidden_cells = (0..rows)
                .filter(|row| {
                    screened
                        .cell(*row, column)
                        .is_none_or(Screened::is_suppressed)
                })
                .count();
            let hidden_total = usize::from(
                screened
                    .column_total(column)
                    .is_none_or(Screened::is_suppressed),
            );
            counts.push(hidden_cells + hidden_total);
        }

        let hidden_grand = usize::from(screened.grand_total().is_suppressed());
        counts.push(
            screened
                .row_totals()
                .iter()
                .filter(|total| total.is_suppressed())
                .count()
                + hidden_grand,
        );
        counts.push(
            screened
                .column_totals()
                .iter()
                .filter(|total| total.is_suppressed())
                .count()
                + hidden_grand,
        );
        counts
    }

    /// Rank of a real matrix by Gauss–Jordan elimination - the attacker's tool
    /// in `reconstruction_attack_tz_10_4`.
    fn rank(matrix: &[Vec<f64>]) -> usize {
        const EPSILON: f64 = 1e-9;
        let mut rows = matrix.to_vec();
        let columns = rows.first().map_or(0, Vec::len);
        let mut rank = 0;

        for column in 0..columns {
            let Some(pivot) = (rank..rows.len()).find(|row| rows[*row][column].abs() > EPSILON)
            else {
                continue;
            };
            rows.swap(rank, pivot);
            let factor = rows[rank][column];
            let pivot_row: Vec<f64> = rows[rank].iter().map(|value| value / factor).collect();
            rows[rank].clone_from(&pivot_row);
            for (row, equation) in rows.iter_mut().enumerate() {
                if row == rank {
                    continue;
                }
                let scale = equation[column];
                if scale.abs() > EPSILON {
                    for (value, pivot) in equation.iter_mut().zip(&pivot_row) {
                        *value -= scale * pivot;
                    }
                }
            }
            rank += 1;
        }
        rank
    }

    #[test]
    fn threshold_rejects_zero() {
        assert_eq!(KThreshold::new(0), Err(InvalidKThreshold));
    }

    #[test]
    fn screen_boundaries() {
        let policy = policy(5);
        assert!(policy.screen(4, 1.0).is_suppressed());
        assert_eq!(policy.screen(5, 1.0).visible_value(), Some(&1.0));
        assert!(policy.screen(0, 1.0).is_suppressed());
    }

    #[test]
    fn suppressed_serializes_as_marker() {
        let suppressed = policy(5).screen(4, 7_u32);
        let visible = policy(5).screen(5, 7_u32);
        assert_eq!(
            serde_json::to_string(&suppressed).expect("screened value serializes"),
            format!("\"{SUPPRESSED_MARKER}\"")
        );
        assert_eq!(
            serde_json::to_string(&visible).expect("screened value serializes"),
            "7"
        );
    }

    #[test]
    fn one_primary_cell_triggers_complementary_suppression() {
        let table = suppress_table(
            &policy(5),
            15_u64,
            vec![
                AggregateCell::new(3, 3),
                AggregateCell::new(5, 5),
                AggregateCell::new(7, 7),
            ],
        )
        .expect("small fixture cannot overflow");

        assert!(!table.total().is_suppressed());
        assert!(table.cells()[0].is_suppressed());
        assert!(table.cells()[1].is_suppressed());
        assert_eq!(table.cells()[2].visible_value(), Some(&7));
    }

    #[test]
    fn multiple_primary_cells_need_no_secondary_cell() {
        let table = suppress_table(
            &policy(5),
            16_u64,
            vec![
                AggregateCell::new(3, 3),
                AggregateCell::new(4, 4),
                AggregateCell::new(9, 9),
            ],
        )
        .expect("small fixture cannot overflow");

        assert!(table.cells()[0].is_suppressed());
        assert!(table.cells()[1].is_suppressed());
        assert_eq!(table.cells()[2].visible_value(), Some(&9));
    }

    #[test]
    fn policy_reads_the_settings_value() {
        assert_eq!(
            KPolicy::from_settings(&serde_json::json!(5)),
            Ok(KPolicy::default())
        );
        assert_eq!(
            KPolicy::from_settings(&serde_json::json!(12)).map(|policy| policy.threshold().get()),
            Ok(12)
        );
        // A malformed setting must never silently fall back to a weaker policy.
        assert_eq!(
            KPolicy::from_settings(&serde_json::json!("5")),
            Err(KPolicyError::NotAnInteger)
        );
        assert_eq!(
            KPolicy::from_settings(&serde_json::json!(null)),
            Err(KPolicyError::NotAnInteger)
        );
        assert_eq!(
            KPolicy::from_settings(&serde_json::json!(-1)),
            Err(KPolicyError::OutOfRange)
        );
        assert_eq!(
            KPolicy::from_settings(&serde_json::json!(0)),
            Err(KPolicyError::InvalidThreshold(InvalidKThreshold))
        );
    }

    #[test]
    fn policy_cache_expires_and_can_be_invalidated() {
        assert_eq!(KPolicyCache::new().ttl(), K_POLICY_TTL);

        let cache = KPolicyCache::with_ttl(Duration::from_millis(30));
        assert_eq!(cache.get(), None);

        cache.store(policy(9));
        assert_eq!(cache.get(), Some(policy(9)));

        cache.invalidate();
        assert_eq!(cache.get(), None);

        cache.store(policy(9));
        std::thread::sleep(Duration::from_millis(60));
        assert_eq!(cache.get(), None, "a stale policy must not be served");
    }

    #[test]
    fn scope_binds_the_canonical_predicate_parameters() {
        assert_eq!(Scope::All.bindings(), (None, None));
        assert_eq!(Scope::Faculty(7).bindings(), (Some(7), None));
        assert_eq!(Scope::Department(11).bindings(), (None, Some(11)));
        assert!(Scope::All.is_unrestricted());
        assert!(!Scope::Faculty(7).is_unrestricted());
    }

    #[test]
    fn matrix_rejects_inconsistent_dimensions() {
        let cells = vec![AggregateCell::new(9_u64, 9_u64); 6];
        assert_eq!(
            AggregateMatrix::new(3, cells.clone(), vec![9, 9], vec![9, 9], 9),
            Err(SuppressionError::DimensionMismatch)
        );
        assert_eq!(
            AggregateMatrix::new(0, Vec::<AggregateCell<u64>>::new(), vec![], vec![], 0),
            Err(SuppressionError::DimensionMismatch)
        );
        assert!(AggregateMatrix::new(3, cells, vec![9, 9], vec![9, 9, 9], 9).is_ok());
    }

    /// Screening rows in isolation is not enough: a column margin reopens the
    /// reconstruction, so the second-smallest cell of the column goes too.
    #[test]
    fn complementary_suppression_closes_rows_and_columns() {
        let counts = vec![vec![20_u64, 30, 2], vec![15, 25, 40], vec![10, 12, 18]];
        let screened = suppress_matrix(&policy(5), matrix_from_counts(&counts))
            .expect("small fixture cannot overflow");

        let hidden: Vec<(usize, usize)> = (0..3)
            .flat_map(|row| (0..3).map(move |column| (row, column)))
            .filter(|(row, column)| {
                screened
                    .cell(*row, *column)
                    .is_none_or(Screened::is_suppressed)
            })
            .collect();
        // n = 2 at (0,2) is the only primary suppression. Its rectangle picks
        // row 2 (fewest observations in column 2: 18 against 40 and the 60 of
        // the margin) and column 0 (fewest in row 0: 20 against 30 and 52), so
        // the other three corners go with it. Both row 0 and row 2, and both
        // column 0 and column 2, end up with two hidden cells.
        assert_eq!(hidden, vec![(0, 0), (0, 2), (2, 0), (2, 2)]);

        assert_eq!(
            screened.cell(0, 1).and_then(Screened::visible_value),
            Some(&30)
        );
        assert_eq!(screened.grand_total().visible_value(), Some(&172));
        assert!(
            screened
                .row_totals()
                .iter()
                .chain(screened.column_totals())
                .all(|total| !total.is_suppressed())
        );
        assert!(hidden_terms_per_relation(&screened).iter().all(|n| *n != 1));
    }

    /// **Acceptance evidence for TZ §10.4.** A concrete faculty × work-type
    /// table with one small group is suppressed, then attacked: every published
    /// number is fed into the linear system that the margins imply, and the
    /// small cell must not be uniquely determined by it.
    #[test]
    fn reconstruction_attack_tz_10_4() {
        const ROWS: usize = 3;
        const COLUMNS: usize = 3;
        let counts = vec![vec![20_u64, 30, 2], vec![15, 25, 40], vec![10, 12, 18]];
        let screened = suppress_matrix(&policy(5), matrix_from_counts(&counts))
            .expect("small fixture cannot overflow");

        let cell_id = |row: usize, column: usize| row * COLUMNS + column;
        let row_total_id = |row: usize| ROWS * COLUMNS + row;
        let column_total_id = |column: usize| ROWS * COLUMNS + ROWS + column;
        let grand_id = ROWS * COLUMNS + ROWS + COLUMNS;
        let target = cell_id(0, 2);

        // Everything an attacker can read off the published response.
        let mut published = vec![None::<f64>; grand_id + 1];
        for row in 0..ROWS {
            for column in 0..COLUMNS {
                published[cell_id(row, column)] = screened
                    .cell(row, column)
                    .and_then(Screened::visible_value)
                    .map(|count| *count as f64);
            }
            published[row_total_id(row)] = screened
                .row_total(row)
                .and_then(Screened::visible_value)
                .map(|count| *count as f64);
        }
        for column in 0..COLUMNS {
            published[column_total_id(column)] = screened
                .column_total(column)
                .and_then(Screened::visible_value)
                .map(|count| *count as f64);
        }
        published[grand_id] = screened.grand_total().visible_value().map(|c| *c as f64);
        assert!(published[target].is_none(), "the small cell must be hidden");

        // `Σ terms − total = 0` for every row, every column and both margins.
        let mut relations: Vec<(Vec<usize>, usize)> = Vec::new();
        for row in 0..ROWS {
            relations.push((
                (0..COLUMNS).map(|column| cell_id(row, column)).collect(),
                row_total_id(row),
            ));
        }
        for column in 0..COLUMNS {
            relations.push((
                (0..ROWS).map(|row| cell_id(row, column)).collect(),
                column_total_id(column),
            ));
        }
        relations.push(((0..ROWS).map(row_total_id).collect(), grand_id));
        relations.push(((0..COLUMNS).map(column_total_id).collect(), grand_id));

        let solve = |published: &[Option<f64>]| {
            let unknowns: Vec<usize> = (0..published.len())
                .filter(|entity| published[*entity].is_none())
                .collect();
            let position = |entity: usize| unknowns.iter().position(|held| *held == entity);
            let mut system: Vec<Vec<f64>> = Vec::new();
            for (terms, total) in &relations {
                let mut equation = vec![0.0; unknowns.len()];
                let mut constrains_an_unknown = false;
                for term in terms {
                    if let Some(index) = position(*term) {
                        equation[index] += 1.0;
                        constrains_an_unknown = true;
                    }
                }
                if let Some(index) = position(*total) {
                    equation[index] -= 1.0;
                    constrains_an_unknown = true;
                }
                if constrains_an_unknown {
                    system.push(equation);
                }
            }
            let target_index = position(target).expect("the attacked cell is hidden");
            let mut probe = vec![0.0; unknowns.len()];
            probe[target_index] = 1.0;
            let mut augmented = system.clone();
            augmented.push(probe);
            // Determined ⟺ the unit vector on the target lies in the row space.
            rank(&augmented) == rank(&system)
        };

        assert!(
            !solve(&published),
            "the suppressed cell is uniquely determined by the published numbers"
        );

        // Counterfactual: with primary suppression alone - the small cell
        // hidden and nothing else - the very same attack recovers it. This is
        // what complementary suppression buys.
        let mut primary_only: Vec<Option<f64>> = published.clone();
        for row in 0..ROWS {
            for column in 0..COLUMNS {
                if cell_id(row, column) != target {
                    primary_only[cell_id(row, column)] = Some(counts[row][column] as f64);
                }
            }
        }
        let (row_totals, column_totals, grand) = margins(&counts);
        for row in 0..ROWS {
            primary_only[row_total_id(row)] = Some(row_totals[row] as f64);
        }
        for column in 0..COLUMNS {
            primary_only[column_total_id(column)] = Some(column_totals[column] as f64);
        }
        primary_only[grand_id] = Some(grand as f64);
        assert!(
            solve(&primary_only),
            "the counterfactual must be reconstructible, otherwise this test proves nothing"
        );
    }

    /// P2 and P3 exhaustively rather than by sampling: over *every* 2×2, 2×3
    /// and 3×2 table of counts 0..=4 and every k in 1..=6, no relation is left
    /// with one hidden term, and raising k never turns a hidden cell or margin
    /// visible. Randomized search finds the P3 class of bug only by luck - the
    /// counterexamples hinge on two equally small cells in different rows.
    #[test]
    fn matrix_suppression_is_sound_and_monotone_over_every_small_table() {
        const RADIX: u32 = 5;
        let hidden = |screened: &ScreenedMatrix<u64>| -> Vec<bool> {
            screened
                .cells()
                .iter()
                .chain(screened.row_totals())
                .chain(screened.column_totals())
                .chain(std::iter::once(screened.grand_total()))
                .map(Screened::is_suppressed)
                .collect()
        };

        for (rows, columns) in [(2_usize, 2_usize), (2, 3), (3, 2)] {
            for encoded in 0..RADIX.pow(u32::try_from(rows * columns).unwrap_or(u32::MAX)) {
                let mut remaining = encoded;
                let counts: Vec<Vec<u64>> = (0..rows)
                    .map(|_| {
                        (0..columns)
                            .map(|_| {
                                let count = u64::from(remaining % RADIX);
                                remaining /= RADIX;
                                count
                            })
                            .collect()
                    })
                    .collect();

                let mut previous: Option<Vec<bool>> = None;
                for k in 1..=6_u32 {
                    let screened = suppress_matrix(&policy(k), matrix_from_counts(&counts))
                        .expect("small fixture cannot overflow");
                    // P2 exhaustively, on the way past.
                    for hidden_terms in hidden_terms_per_relation(&screened) {
                        assert_ne!(
                            hidden_terms, 1,
                            "a relation is left with one hidden term at k = {k}: {counts:?}"
                        );
                    }
                    let current = hidden(&screened);
                    if let Some(previous) = previous {
                        for (entity, (was, now)) in previous.iter().zip(&current).enumerate() {
                            assert!(
                                !(*was && !now),
                                "entity {entity} is hidden at k = {} but visible at k = {k}: {counts:?}",
                                k - 1
                            );
                        }
                    }
                    previous = Some(current);
                }
            }
        }
    }

    proptest! {
        /// P1: no screened value survives with 0 <= n < k.
        #[test]
        fn no_small_group_survives(n in 0_u64..1000, k in 1_u32..100) {
            let screened = policy(k).screen(n, n);
            prop_assert_eq!(screened.is_suppressed(), n < u64::from(k));
        }

        /// P2: a visible total never leaves exactly one child hidden.
        #[test]
        fn no_single_cell_is_reconstructible(
            observations in prop::collection::vec(0_u64..100, 1..20),
            k in 1_u32..100,
        ) {
            let cells = observations
                .iter()
                .copied()
                .map(|n| AggregateCell::new(n, n))
                .collect();
            let table = suppress_table(&policy(k), 0, cells)
                .expect("bounded generated counts cannot overflow");
            if !table.total().is_suppressed() {
                let hidden = table.cells().iter().filter(|cell| cell.is_suppressed()).count();
                prop_assert_ne!(hidden, 1);
            }
        }

        /// P3: raising k never reveals data.
        #[test]
        fn suppression_monotone_in_k(n in 0_u64..1000, k in 1_u32..100) {
            let looser = policy(k).screen(n, ());
            let stricter = policy(k + 1).screen(n, ());
            prop_assert!(!(looser.is_suppressed() && !stricter.is_suppressed()));
        }

        /// P1 over a matrix: every published number - cell or margin - is
        /// backed by at least k observations.
        #[test]
        fn matrix_publishes_no_small_group(counts in counts_strategy(), k in 1_u32..12) {
            let screened = suppress_matrix(&policy(k), matrix_from_counts(&counts))
                .expect("bounded generated counts cannot overflow");
            let (row_totals, column_totals, grand) = margins(&counts);
            let k = u64::from(k);

            for (row, cells) in counts.iter().enumerate() {
                for (column, count) in cells.iter().enumerate() {
                    let cell = screened.cell(row, column).expect("cell is in range");
                    if let Some(value) = cell.visible_value() {
                        prop_assert_eq!(value, count);
                        prop_assert!(*count >= k);
                    }
                }
                if let Some(value) = screened.row_total(row).expect("row is in range").visible_value() {
                    prop_assert_eq!(*value, row_totals[row]);
                    prop_assert!(row_totals[row] >= k);
                }
            }
            for (column, total) in column_totals.iter().enumerate() {
                if let Some(value) = screened
                    .column_total(column)
                    .expect("column is in range")
                    .visible_value()
                {
                    prop_assert_eq!(value, total);
                    prop_assert!(*total >= k);
                }
            }
            if let Some(value) = screened.grand_total().visible_value() {
                prop_assert_eq!(*value, grand);
                prop_assert!(grand >= k);
            }
        }

        /// P2 over a matrix: no published relation (row, column, or either
        /// margin) is left with exactly one hidden term, so no hidden number is
        /// the difference of published ones.
        #[test]
        fn matrix_leaves_no_residual_reconstruction(counts in counts_strategy(), k in 1_u32..12) {
            let screened = suppress_matrix(&policy(k), matrix_from_counts(&counts))
                .expect("bounded generated counts cannot overflow");
            for hidden_terms in hidden_terms_per_relation(&screened) {
                prop_assert_ne!(hidden_terms, 1);
            }
        }

        /// P3 over a matrix: raising k never turns a hidden cell or margin
        /// visible.
        #[test]
        fn matrix_suppression_monotone_in_k(counts in counts_strategy(), k in 1_u32..12) {
            let looser = suppress_matrix(&policy(k), matrix_from_counts(&counts))
                .expect("bounded generated counts cannot overflow");
            let stricter = suppress_matrix(&policy(k + 1), matrix_from_counts(&counts))
                .expect("bounded generated counts cannot overflow");

            let hidden = |screened: &ScreenedMatrix<u64>| -> Vec<bool> {
                screened
                    .cells()
                    .iter()
                    .chain(screened.row_totals())
                    .chain(screened.column_totals())
                    .chain(std::iter::once(screened.grand_total()))
                    .map(Screened::is_suppressed)
                    .collect()
            };
            for (was_hidden, now_hidden) in hidden(&looser).into_iter().zip(hidden(&stricter)) {
                prop_assert!(!(was_hidden && !now_hidden));
            }
        }

        /// A single-column matrix must behave exactly like the 1-D table: both
        /// go through the same engine, and public endpoints rely on it.
        #[test]
        fn single_column_matrix_agrees_with_the_one_dimensional_table(
            observations in prop::collection::vec(0_u64..25, 1..8),
            k in 1_u32..12,
        ) {
            let counts: Vec<Vec<u64>> = observations.iter().map(|n| vec![*n]).collect();
            let matrix = suppress_matrix(&policy(k), matrix_from_counts(&counts))
                .expect("bounded generated counts cannot overflow");
            let table = suppress_table(
                &policy(k),
                observations.iter().sum::<u64>(),
                observations.iter().map(|n| AggregateCell::new(*n, *n)).collect(),
            )
            .expect("bounded generated counts cannot overflow");

            // The matrix additionally publishes the column margin, which equals
            // the grand total, so it can only ever suppress at least as much.
            for (index, cell) in table.cells().iter().enumerate() {
                if !matrix.cell(index, 0).expect("cell is in range").is_suppressed() {
                    prop_assert!(!cell.is_suppressed());
                }
            }
            prop_assert_eq!(
                matrix.grand_total().is_suppressed(),
                table.total().is_suppressed()
            );
        }
    }
}
