//! Public-contour response types and the screening helpers that build them.
//!
//! Every metric field is a [`compliance::Screened<T>`]. `Screened` has no public
//! constructor outside `compliance`, so a DTO in this module *cannot* be built
//! from a raw aggregate - that is AGENTS.md invariant #2 expressed as a type
//! rather than a review comment.
//!
//! `Screened<T>` serializes as the bare value or as the string
//! `"insufficient_data"`. The [`ScreenedInt`]/[`ScreenedFloat`] enums exist only
//! so `utoipa` can describe that union honestly in `contracts/openapi.json`;
//! nothing constructs them at runtime.

use compliance::{AggregateCell, KPolicy, Screened, ScreenedTable, SuppressionError};
use serde::Serialize;
use utoipa::ToSchema;

use crate::error::ApiError;
use crate::layers::kanon::KAnonWitness;

/// Wire form of a suppressed cell (TZ §6.2 - «недостаточно данных»).
#[derive(Debug, Clone, Copy, Serialize, ToSchema)]
pub enum SuppressedMarker {
    #[serde(rename = "insufficient_data")]
    InsufficientData,
}

/// OpenAPI shape of `Screened<i64>`: the count, or the suppression marker.
#[derive(Debug, Clone, Copy, Serialize, ToSchema)]
#[serde(untagged)]
pub enum ScreenedInt {
    Value(i64),
    Suppressed(SuppressedMarker),
}

/// OpenAPI shape of `Screened<f64>`: the value, or the suppression marker.
#[derive(Debug, Clone, Copy, Serialize, ToSchema)]
#[serde(untagged)]
pub enum ScreenedFloat {
    Value(f64),
    Suppressed(SuppressedMarker),
}

/// The inclusive range a response covers, echoed back so a cached body is
/// self-describing.
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct PeriodDto {
    /// `YYYY-MM-DD`, inclusive.
    pub from: String,
    /// `YYYY-MM-DD`, inclusive.
    pub to: String,
}

impl From<domain::Period> for PeriodDto {
    fn from(period: domain::Period) -> Self {
        Self {
            from: period.start().to_string(),
            to: period.end().to_string(),
        }
    }
}

/// Count and mean originality of one group - the pair every section publishes.
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct MetricPair {
    #[schema(value_type = ScreenedInt)]
    pub checks: Screened<i64>,
    /// Mean originality in percent, rounded to 4 decimal places.
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
}

/// JSON field names of [`MetricPair`], for [`KAnonWitness::group`].
pub const METRIC_PAIR_FIELDS: [&str; 2] = ["checks", "avg_originality"];

// ── §1 summary ──────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct SummaryResponse {
    pub period: PeriodDto,
    /// Active k-anonymity threshold, so a client can explain a suppressed cell.
    pub k_threshold: u32,
    #[schema(value_type = ScreenedInt)]
    pub total_checks: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
    #[schema(value_type = ScreenedInt)]
    pub below_threshold: Screened<i64>,
    /// Share of checks below `settings.originality_threshold`, 0..=1.
    #[schema(value_type = ScreenedFloat)]
    pub below_threshold_share: Screened<f64>,
    #[schema(value_type = ScreenedInt)]
    pub escalated: Screened<i64>,
    /// Checks ÷ works submitted. `null` when the registrar has supplied no
    /// denominators - TZ §4.2 §1 «при наличии данных»; never estimated.
    #[schema(value_type = Option<ScreenedFloat>)]
    pub coverage: Option<Screened<f64>>,
    /// Cube cells this response withheld because they held fewer than `k`
    /// checks (ADR-016 §2). A count, never a size: it makes «недостаточно
    /// данных» explicit (TZ §8) without saying how small any group was.
    pub suppressed_groups: u32,
    pub previous: PreviousPeriodDto,
}

/// The same KPIs one year earlier, plus the deltas the cards render.
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct PreviousPeriodDto {
    pub period: PeriodDto,
    #[schema(value_type = ScreenedInt)]
    pub total_checks: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
    #[schema(value_type = ScreenedInt)]
    pub below_threshold: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub below_threshold_share: Screened<f64>,
    #[schema(value_type = ScreenedInt)]
    pub escalated: Screened<i64>,
    /// Current minus previous. Suppressed whenever either side is.
    pub delta: SummaryDeltaDto,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct SummaryDeltaDto {
    #[schema(value_type = ScreenedInt)]
    pub total_checks: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
    #[schema(value_type = ScreenedFloat)]
    pub below_threshold_share: Screened<f64>,
    #[schema(value_type = ScreenedInt)]
    pub escalated: Screened<i64>,
}

// ── §2 dynamics ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct TimeseriesResponse {
    pub period: PeriodDto,
    pub k_threshold: u32,
    /// Cube cells this response withheld because they held fewer than `k`
    /// checks (ADR-016 §2). A count, never a size: it makes «недостаточно
    /// данных» explicit (TZ §8) without saying how small any group was.
    pub suppressed_groups: u32,
    pub months: Vec<TimeseriesPointDto>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct TimeseriesPointDto {
    /// First day of the month, `YYYY-MM-DD`.
    pub month: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
    /// Checks escalated to Комплаенс - «подозрительный» and not cleared.
    ///
    /// Additive over the cube exactly as `checks` is, so it is a sum over
    /// released cells like every other public number (ADR-016 §2). `/summary`
    /// already publishes it for the whole period; this is the same measure at
    /// the grain the cube is built on.
    #[schema(value_type = ScreenedInt)]
    pub escalated: Screened<i64>,
    /// Checks that were not the first attempt on their work (ADR-008 §9).
    #[schema(value_type = ScreenedInt)]
    pub rechecks: Screened<i64>,
}

/// JSON field names of [`TimeseriesPointDto`]'s metrics, for
/// [`KAnonWitness::group`].
pub const TIMESERIES_POINT_FIELDS: [&str; 4] =
    ["checks", "avg_originality", "escalated", "rechecks"];

// ── §3 work types · §4 faculties ────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct BreakdownResponse {
    pub period: PeriodDto,
    pub k_threshold: u32,
    /// Cube cells this response withheld because they held fewer than `k`
    /// checks (ADR-016 §2). A count, never a size: it makes «недостаточно
    /// данных» explicit (TZ §8) without saying how small any group was.
    pub suppressed_groups: u32,
    /// Grand total over the published rows: the sum of exactly the cells the
    /// rows are built from, so `Σ items = total` holds on the wire.
    pub total: MetricPair,
    pub items: Vec<BreakdownItemDto>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct BreakdownItemDto {
    /// Dictionary code (work-type or faculty).
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
}

// ── §5 histogram ────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct HistogramResponse {
    pub period: PeriodDto,
    pub k_threshold: u32,
    /// Band edges in percent, from `settings.histogram_buckets`.
    pub boundaries: [u16; 4],
    /// Cube cells this response withheld because they held fewer than `k`
    /// checks (ADR-016 §2). A count, never a size: it makes «недостаточно
    /// данных» explicit (TZ §8) without saying how small any group was.
    pub suppressed_groups: u32,
    #[schema(value_type = ScreenedInt)]
    pub total: Screened<i64>,
    pub buckets: Vec<HistogramBucketDto>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct HistogramBucketDto {
    /// Stable band key: `b_lt50`, `b_50_70`, `b_70_85`, `b_85_95`, `b_ge95`.
    pub key: String,
    /// Rendered band label, e.g. `70–85`.
    pub label: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Screened<i64>,
    /// Share of the period's checks in this band, 0..=1.
    #[schema(value_type = ScreenedFloat)]
    pub share: Screened<f64>,
}

// ── §9 year over year ───────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct YoyResponse {
    pub period: PeriodDto,
    pub k_threshold: u32,
    /// Cube cells this response withheld because they held fewer than `k`
    /// checks (ADR-016 §2). A count, never a size: it makes «недостаточно
    /// данных» explicit (TZ §8) without saying how small any group was.
    pub suppressed_groups: u32,
    pub total: MetricPair,
    pub years: Vec<YoyYearDto>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct YoyYearDto {
    /// `2024` is AY 2024/25 (Sep 1 – Aug 31).
    pub academic_year: i16,
    /// Human label, e.g. `2024–2025`.
    pub label: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Screened<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Screened<f64>,
}

// ── published reports ───────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ReportsResponse {
    pub items: Vec<ReportSnapshotDto>,
}

/// A published annual or manual report (TZ §4.5).
///
/// Snapshots are already-screened artefacts, so nothing here is a live
/// aggregate. No filesystem path leaves the process: the client gets an opaque
/// `download_id` that slice W3.5 resolves to a stream.
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ReportSnapshotDto {
    pub id: i64,
    /// `annual` or `manual`.
    pub kind: String,
    pub period: PeriodDto,
    /// RFC 3339 instant.
    pub generated_at: String,
    pub files: Vec<ReportFileDto>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ReportFileDto {
    /// `pdf` or `xlsx`.
    pub format: String,
    /// Opaque handle for the download endpoint (slice W3.5).
    pub download_id: String,
}

// ── internal contour ────────────────────────────────────────────────────────

/// The caller's RBAC visibility, as `compliance::Scope` renders on the wire.
///
/// Carries ids rather than codes because that is what the scope *is*; the UI
/// resolves them through the dictionary endpoints.
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ScopeDto {
    /// `all`, `faculty` or `department`.
    pub kind: String,
    pub faculty_id: Option<i64>,
    pub department_id: Option<i64>,
}

impl From<compliance::Scope> for ScopeDto {
    fn from(scope: compliance::Scope) -> Self {
        let kind = match scope {
            compliance::Scope::All => "all",
            compliance::Scope::Faculty(_) => "faculty",
            compliance::Scope::Department(_) => "department",
        };
        Self {
            kind: kind.to_owned(),
            faculty_id: scope.faculty_id(),
            department_id: scope.department_id(),
        }
    }
}

/// One `(role, scope)` grant, as `/api/auth/me` reports it.
#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct RoleGrantDto {
    /// `staff`, `dept_head`, `dean`, `ethics`, `compliance` or `admin`.
    pub role: String,
    pub scope_faculty_id: Option<i64>,
    pub scope_department_id: Option<i64>,
    /// Dictionary code of the scoped faculty, so a client can name the unit a
    /// dean governs without resolving an opaque id. `null` for an unscoped
    /// grant, and for an id whose dictionary row has been deleted.
    pub scope_faculty_code: Option<String>,
    /// Dictionary code of the scoped department; see `scope_faculty_code`.
    pub scope_department_code: Option<String>,
}

impl RoleGrantDto {
    #[must_use]
    pub fn from_grant(grant: &crate::auth::RoleGrant) -> Self {
        Self {
            role: db::filters::role_label(grant.role).to_owned(),
            scope_faculty_id: grant.scope_faculty_id,
            scope_department_id: grant.scope_department_id,
            scope_faculty_code: grant.scope_faculty_code.clone(),
            scope_department_code: grant.scope_department_code.clone(),
        }
    }
}

// ── screening helpers ───────────────────────────────────────────────────────

/// Round to the precision `fixtures/expected.json` publishes, so the wire value
/// is stable across platforms and the ETag does not churn on a last-bit change.
///
/// Use [`ratio4`] or [`mean4`] wherever the value is a quotient of integers -
/// they round **once**, exactly, from the integers themselves. This function is
/// for the one case that is genuinely a float subtraction: a delta between two
/// already-rounded 4 dp values.
#[must_use]
pub fn round4(value: f64) -> f64 {
    (value * 10_000.0).round() / 10_000.0
}

/// `numerator / denominator` at 4 dp, half-up, in **integer** arithmetic.
///
/// The public contour rounds exactly once, at serialization (ADR-016 §2), and
/// it rounds from integers: every published average is `sum_hundredths ÷ n`
/// over the same released cells, so `/summary`, `/faculties`, `/work-types`,
/// `/timeseries` and `/yoy` agree to the last decimal *by construction* rather
/// than by luck. Doing it in `f64` - as `round4(a / b)` did - makes the result
/// depend on association order, which is how the same mean came back as
/// 76.4343 from one endpoint and 76.4342 from another.
///
/// Bit-identical to `ratio4()` in `fixtures/rules.ts`, which is what makes the
/// brute-force reducer a real cross-check.
#[must_use]
pub fn ratio4(numerator: i64, denominator: i64) -> f64 {
    if denominator == 0 {
        return 0.0;
    }
    let scaled = numerator.saturating_mul(10_000);
    let quotient = scaled.div_euclid(denominator);
    let remainder = scaled.rem_euclid(denominator);
    let rounded = if remainder.saturating_mul(2) >= denominator {
        quotient.saturating_add(1)
    } else {
        quotient
    };
    #[expect(
        clippy::cast_precision_loss,
        reason = "a 4 dp ratio of fact-table counts is far inside f64's exact \
                  integer range"
    )]
    let value = rounded as f64;
    value / 10_000.0
}

/// Mean originality in percent, 4 dp, from the exact integer sum of hundredths.
///
/// The single rounding point of the public contour (ADR-016 §2). Matches
/// `meanFromHundredths()` in `fixtures/rules.ts`.
#[must_use]
pub fn mean4(sum_hundredths: i64, checks: i64) -> f64 {
    ratio4(sum_hundredths, checks.saturating_mul(100))
}

/// The published pair of one released group of the public cube (ADR-016 §2).
///
/// The group is the unit of disclosure: it holds either at least `k`
/// observations - every one of its cells does - or none at all, in which case
/// both metrics carry the «недостаточно данных» marker. There is no
/// complementary pass, because a published total is the sum of the published
/// cells and never contains a withheld one.
#[must_use]
pub fn released_pair(policy: KPolicy, group: &db::q::CubeGroup) -> MetricPair {
    let observations = group.observations();
    MetricPair {
        checks: policy.screen(observations, group.checks),
        avg_originality: policy.screen(
            observations,
            mean4(group.sum_originality_hundredths, group.checks),
        ),
    }
}

/// One row on its way into a 1-D suppression pass: the group size, the count,
/// and the mean.
#[derive(Debug, Clone, Copy)]
pub struct RawCell {
    pub observations: u64,
    pub checks: i64,
    pub avg_originality: f64,
}

impl RawCell {
    #[must_use]
    pub fn new(checks: i64, avg_originality: Option<f64>) -> Self {
        Self {
            observations: u64::try_from(checks).unwrap_or(0),
            checks,
            avg_originality: round4(avg_originality.unwrap_or_default()),
        }
    }
}

/// Screen an exhaustive set of cells and its grand total, twice over - once for
/// the counts, once for the means.
///
/// Both passes run `compliance::suppress_table` on the *same* observation
/// counts, so they hide exactly the same cells: complementary suppression
/// depends only on group sizes, never on the published value. Screening the
/// mean with a bare `KPolicy::screen` instead would leave a mean visible beside
/// a complementarily suppressed count - and a mean plus the totals is enough to
/// reconstruct the count.
pub fn screen_table(
    policy: &KPolicy,
    total: RawCell,
    cells: &[RawCell],
) -> Result<(MetricPair, Vec<MetricPair>), SuppressionError> {
    let counts = suppress(policy, total.checks, cells, |cell| cell.checks)?;
    let means = suppress(policy, total.avg_originality, cells, |cell| {
        cell.avg_originality
    })?;

    let (total_count, cell_counts) = counts.into_parts();
    let (total_mean, cell_means) = means.into_parts();
    let items = cell_counts
        .into_iter()
        .zip(cell_means)
        .map(|(checks, avg_originality)| MetricPair {
            checks,
            avg_originality,
        })
        .collect();
    Ok((
        MetricPair {
            checks: total_count,
            avg_originality: total_mean,
        },
        items,
    ))
}

fn suppress<T: Copy>(
    policy: &KPolicy,
    total: T,
    cells: &[RawCell],
    value: impl Fn(&RawCell) -> T,
) -> Result<ScreenedTable<T>, SuppressionError> {
    compliance::suppress_table(
        policy,
        total,
        cells
            .iter()
            .map(|cell| AggregateCell::new(cell.observations, value(cell)))
            .collect(),
    )
}

/// Record a [`MetricPair`] group in the guard's witness.
pub fn witness_pair(witness: &mut KAnonWitness, base: &str, observations: u64) {
    witness.group(base, observations, &METRIC_PAIR_FIELDS);
}

impl From<SuppressionError> for ApiError {
    fn from(error: SuppressionError) -> Self {
        tracing::error!(%error, "k-anonymity screening failed");
        Self::Internal("k-anonymity screening failed")
    }
}
