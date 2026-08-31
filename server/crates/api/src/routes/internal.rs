//! Internal contour: SSO session + RBAC scope + audit logging (TZ §4.2, §5).
//!
//! The layer stack is assembled in [`crate::build_router`]; by the time a
//! handler here runs, the request has passed `SessionAuth`, holds a
//! [`CurrentUser`], and has an [`RbacScope`] - there is no code path into this
//! module without one (AGENTS.md invariant #3).
//!
//! # Two controls, not one
//!
//! **Scope** is enforced in SQL: every `db::q` call below is handed the
//! caller's [`compliance::Scope`], and [`ScopeGuard::narrow`] refuses a filter
//! naming a unit outside it with a `403` rather than an empty result set.
//!
//! **Screening** is a separate decision ([`Screening`], ADR-014 §4). The five
//! roles TZ §5 gives scoped internal access to read exact numbers inside their
//! scope; a wide-audience role reads the same responses through the active
//! [`compliance::KPolicy`]. Two things are screened for *everyone*: the
//! escalation breakdown by unit (TZ §4.2 §7 «без указания конкретных кафедр при
//! малой выборке») and every export file.

use axum::Router;
use axum::extract::State;
use axum::routing::get;
use axum::{Json, routing::post};
use compliance::{KPolicy, Scope, Screened};
use domain::Filters;
use serde::Serialize;
use utoipa::ToSchema;

use crate::auth::{CurrentUser, RbacScope};
use crate::dto::{RawCell, ScopeDto, ScreenedFloat, ScreenedInt, round4, screen_table};
use crate::error::ApiError;
use crate::query::{InternalFilterQuery, ScopeGuard, ValidQuery, internal_filters_from};
use crate::state::{AppState, Screening};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/ping", get(ping))
        .route("/summary", get(summary))
        .route("/timeseries", get(timeseries))
        .route("/work-types", get(work_types))
        .route("/histogram", get(histogram))
        .route("/yoy", get(yoy))
        .route("/departments-matrix", get(departments_matrix))
        .route("/rechecks", get(rechecks))
        .route("/escalations", get(escalations))
        .route("/usage", get(usage))
        .route("/export", post(crate::routes::export::internal_export))
}

// ── the metric cell of the internal contour ─────────────────────────────────

/// One number on the internal contour.
///
/// Serializes exactly like [`compliance::Screened`] - the bare value, or the
/// string `"insufficient_data"` - so a client renders both the same way and the
/// generated contract carries one union type. The distinction is *who* is
/// looking, not what the wire looks like.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(untagged)]
pub enum Cell<T> {
    /// Exact, inside the caller's SQL-enforced scope.
    Exact(T),
    /// Passed through the active `KPolicy`.
    Screened(Screened<T>),
}

impl<T> Cell<T> {
    /// Build a cell under the caller's screening policy.
    fn new(screening: Screening, policy: KPolicy, observations: u64, value: T) -> Self {
        if screening.is_raw() {
            Self::Exact(value)
        } else {
            Self::Screened(policy.screen(observations, value))
        }
    }

    /// Adopt a value already screened as part of a whole table, keeping the
    /// caller's policy: complementary suppression is a property of the table,
    /// so a raw-data role still sees the exact number.
    fn adopt(screening: Screening, exact: T, screened: Screened<T>) -> Self {
        if screening.is_raw() {
            Self::Exact(exact)
        } else {
            Self::Screened(screened)
        }
    }

    fn is_suppressed(&self) -> bool {
        match self {
            Self::Exact(_) => false,
            Self::Screened(value) => value.is_suppressed(),
        }
    }
}

/// A count and a mean, the pair every section publishes.
#[derive(Debug, Clone, Copy, Serialize, ToSchema)]
pub struct InternalPair {
    #[schema(value_type = ScreenedInt)]
    pub checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
}

// ── request context ─────────────────────────────────────────────────────────

/// Everything the handlers below share: validated filters, the caller's scope,
/// the active policy and the caller's screening decision.
struct Context {
    filters: Filters,
    scope: Scope,
    policy: KPolicy,
    screening: Screening,
    /// Cells this response withheld, for `suppression_screened_cells_total`.
    screened_cells: u64,
}

impl Context {
    async fn build(
        state: &AppState,
        user: &CurrentUser,
        scope: Scope,
        query: &InternalFilterQuery,
    ) -> Result<Self, ApiError> {
        ScopeGuard::load(&state.db, scope).await?.narrow(query)?;
        Ok(Self {
            filters: internal_filters_from(&state.db, query).await?,
            scope,
            policy: state.k_policy().await?,
            screening: Screening::for_role(user.effective_role),
            screened_cells: 0,
        })
    }

    fn cell<T>(&mut self, observations: u64, value: T) -> Cell<T> {
        let cell = Cell::new(self.screening, self.policy, observations, value);
        if cell.is_suppressed() {
            self.screened_cells += 1;
        }
        cell
    }

    /// A cell that is screened for **everyone**, whatever the caller's role.
    /// TZ §4.2 §7 puts the escalation breakdown by unit here.
    fn always_screened<T>(&mut self, observations: u64, value: T) -> Cell<T> {
        let cell = Cell::Screened(self.policy.screen(observations, value));
        if cell.is_suppressed() {
            self.screened_cells += 1;
        }
        cell
    }

    fn adopt<T>(&mut self, exact: T, screened: Screened<T>) -> Cell<T> {
        let cell = Cell::adopt(self.screening, exact, screened);
        if cell.is_suppressed() {
            self.screened_cells += 1;
        }
        cell
    }

    fn pair(&mut self, exact: &RawCell, screened: &crate::dto::MetricPair) -> InternalPair {
        InternalPair {
            checks: self.adopt(exact.checks, screened.checks),
            avg_originality: self.adopt(exact.avg_originality, screened.avg_originality),
        }
    }

    /// Publish the suppression counter and hand the body back.
    fn finish<T>(self, state: &AppState, body: T) -> Json<T> {
        state.metrics.add_screened_cells(self.screened_cells);
        Json(body)
    }
}

/// Group sizes are `i64` counts in SQL and `u64` observation counts in
/// `compliance`; a negative count is impossible and mapping one to zero fails
/// closed.
fn observations(checks: i64) -> u64 {
    u64::try_from(checks).unwrap_or(0)
}

// ── §0 identity probe ───────────────────────────────────────────────────────

/// Who the caller is and what they may see.
#[derive(Debug, Serialize, ToSchema)]
pub struct InternalPing {
    pub sso_subject: String,
    /// Widest role held - the value written to `audit_log.role`.
    pub role: String,
    pub scope: ScopeDto,
    /// `raw` or `screened` - whether this account reads exact numbers inside
    /// its scope (ADR-014 §4).
    pub screening: &'static str,
}

/// Minimal scoped endpoint: proves the session, the RBAC scope and the audit
/// row end to end, and reports the screening decision the other sections apply.
#[utoipa::path(
    get,
    path = "/api/internal/ping",
    tag = "internal",
    responses(
        (status = 200, body = InternalPing),
        (status = 401, body = crate::error::Problem, description = "no valid session"),
        (status = 403, body = crate::error::Problem, description = "no role for the internal contour"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn ping(
    user: CurrentUser,
    RbacScope(scope): RbacScope,
) -> Result<Json<InternalPing>, ApiError> {
    let role = user
        .effective_role
        .ok_or(ApiError::Forbidden(crate::auth::REQUEST_ACCESS_DETAIL))?;
    Ok(Json(InternalPing {
        sso_subject: user.sso_subject,
        role: db::filters::role_label(role).to_owned(),
        scope: scope.into(),
        screening: if Screening::for_role(Some(role)).is_raw() {
            "raw"
        } else {
            "screened"
        },
    }))
}

// ── §1 overview ─────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalSummary {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    #[schema(value_type = ScreenedInt)]
    pub total_checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
    #[schema(value_type = ScreenedInt)]
    pub below_threshold: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub below_threshold_share: Cell<f64>,
    #[schema(value_type = ScreenedInt)]
    pub escalated: Cell<i64>,
    /// Checks ÷ works submitted, `null` when the registrar supplied no
    /// denominators for the period (TZ §4.2 §1 «при наличии данных»).
    #[schema(value_type = Option<ScreenedFloat>)]
    pub coverage: Option<Cell<f64>>,
    pub previous: InternalPreviousPeriod,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalPreviousPeriod {
    pub period: crate::dto::PeriodDto,
    #[schema(value_type = ScreenedInt)]
    pub total_checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
    #[schema(value_type = ScreenedInt)]
    pub escalated: Cell<i64>,
}

/// TZ §4.2 §1 - KPI cards for the caller's scope.
#[utoipa::path(
    get,
    path = "/api/internal/summary",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalSummary),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem, description = "no internal role, or a unit filter outside your scope"),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn summary(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalSummary>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let current = db::q::summary(&state.db, &context.filters, context.scope).await?;
    let previous_filters = context.filters.previous_year()?;
    let previous = db::q::summary(&state.db, &previous_filters, context.scope).await?;

    let checks = observations(current.checks);
    let below = observations(current.below_threshold);
    let escalated = observations(current.escalated);
    let coverage = coverage_of(&state, &context.filters, context.scope).await?;

    let body = InternalSummary {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        total_checks: context.cell(checks, current.checks),
        avg_originality: context.cell(
            checks,
            round4(current.avg_originality().unwrap_or_default()),
        ),
        below_threshold: context.cell(below, current.below_threshold),
        below_threshold_share: context.cell(
            below.min(checks),
            round4(current.below_threshold_share().unwrap_or_default()),
        ),
        escalated: context.cell(escalated, current.escalated),
        coverage: coverage.map(|(group, ratio)| context.cell(group, ratio)),
        previous: InternalPreviousPeriod {
            period: previous_filters.period().into(),
            total_checks: context.cell(observations(previous.checks), previous.checks),
            avg_originality: context.cell(
                observations(previous.checks),
                round4(previous.avg_originality().unwrap_or_default()),
            ),
            escalated: context.cell(observations(previous.escalated), previous.escalated),
        },
    };
    Ok(context.finish(&state, body))
}

/// `(group size, ratio)`, or `None` when no denominators exist.
async fn coverage_of(
    state: &AppState,
    filters: &Filters,
    scope: Scope,
) -> Result<Option<(u64, f64)>, ApiError> {
    let rows = db::q::coverage(&state.db, filters, scope).await?;
    if rows.is_empty() {
        return Ok(None);
    }
    let checks: i64 = rows.iter().map(|row| row.checks).sum();
    let submitted: i64 = rows.iter().map(|row| i64::from(row.total_submitted)).sum();
    if submitted <= 0 {
        return Ok(None);
    }
    #[expect(
        clippy::cast_precision_loss,
        reason = "counts are bounded by the fact table size"
    )]
    let ratio = checks as f64 / submitted as f64;
    Ok(Some((observations(checks), round4(ratio))))
}

// ── §2 dynamics ─────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalTimeseries {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    pub months: Vec<InternalTimeseriesPoint>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalTimeseriesPoint {
    /// First day of the month, `YYYY-MM-DD`.
    pub month: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
}

/// TZ §4.2 §2 - checks and mean originality by month, inside the scope.
#[utoipa::path(
    get,
    path = "/api/internal/timeseries",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalTimeseries),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn timeseries(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalTimeseries>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let points = db::q::timeseries(&state.db, &context.filters, context.scope).await?;
    let cells: Vec<RawCell> = points
        .iter()
        .map(|point| RawCell::new(point.checks, point.avg_originality()))
        .collect();
    let (_total, screened) = screen_table(&context.policy, total_cell(&cells), &cells)?;

    let months = points
        .iter()
        .zip(&cells)
        .zip(&screened)
        .map(|((point, exact), pair)| InternalTimeseriesPoint {
            month: crate::routes::export::format_date(point.month),
            checks: context.adopt(exact.checks, pair.checks),
            avg_originality: context.adopt(exact.avg_originality, pair.avg_originality),
        })
        .collect();

    let body = InternalTimeseries {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        months,
    };
    Ok(context.finish(&state, body))
}

// ── §3 work types · §4 units ────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalBreakdown {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    pub total: InternalPair,
    pub items: Vec<InternalBreakdownItem>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalBreakdownItem {
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
}

/// TZ §4.2 §3 - checks and mean originality per work type, inside the scope.
#[utoipa::path(
    get,
    path = "/api/internal/work-types",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalBreakdown),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn work_types(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalBreakdown>, ApiError> {
    let context = Context::build(&state, &user, scope, &query).await?;
    let rows = db::q::work_types(&state.db, &context.filters, context.scope).await?;
    let names = db::dicts::work_types(&state.db).await?;
    let labelled: Vec<(String, [String; 3], RawCell)> = rows
        .iter()
        .map(|row| {
            let entry = names.iter().find(|work_type| work_type.code == row.code);
            (
                row.code.clone(),
                labels(
                    entry.map(|w| (&w.name_ru, &w.name_kk, &w.name_en)),
                    &row.code,
                ),
                RawCell::new(row.checks, row.avg_originality()),
            )
        })
        .collect();
    breakdown(&state, context, labelled)
}

/// Shared body of the breakdown sections: one complementary-suppression pass
/// over the rows plus their grand total.
fn breakdown(
    state: &AppState,
    mut context: Context,
    rows: Vec<(String, [String; 3], RawCell)>,
) -> Result<Json<InternalBreakdown>, ApiError> {
    let cells: Vec<RawCell> = rows.iter().map(|(_, _, cell)| *cell).collect();
    let total = total_cell(&cells);
    let (total_pair, screened) = screen_table(&context.policy, total, &cells)?;

    let total_cells = context.pair(&total, &total_pair);
    let items = rows
        .into_iter()
        .zip(&screened)
        .map(
            |((code, [name_ru, name_kk, name_en], exact), pair)| InternalBreakdownItem {
                code,
                name_ru,
                name_kk,
                name_en,
                checks: context.adopt(exact.checks, pair.checks),
                avg_originality: context.adopt(exact.avg_originality, pair.avg_originality),
            },
        )
        .collect();

    let body = InternalBreakdown {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        total: total_cells,
        items,
    };
    Ok(context.finish(state, body))
}

// ── §4 faculty → department matrix ──────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct DepartmentsMatrix {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    pub total: InternalPair,
    pub faculties: Vec<MatrixFaculty>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct MatrixFaculty {
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    /// The faculty margin - the sum of its visible and hidden departments.
    pub total: InternalPair,
    pub departments: Vec<MatrixDepartment>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct MatrixDepartment {
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
}

/// TZ §4.2 §4 - the faculty → department drill-down. Internal only: the public
/// contour publishes faculty grain at most.
///
/// The whole table is screened as **one** complementary pass over every
/// department, not one pass per faculty: screening rows independently would let
/// the faculty margins reopen the holes (`compliance::suppress_table`).
#[utoipa::path(
    get,
    path = "/api/internal/departments-matrix",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = DepartmentsMatrix),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn departments_matrix(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<DepartmentsMatrix>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let rows = db::q::units(
        &state.db,
        &context.filters,
        context.scope,
        db::q::UnitDepth::Department,
    )
    .await?;
    let faculty_names = db::dicts::faculties(&state.db).await?;
    let department_names = db::dicts::departments(&state.db).await?;

    let cells: Vec<RawCell> = rows
        .iter()
        .map(|row| RawCell::new(row.checks, row.avg_originality()))
        .collect();
    let grand = total_cell(&cells);
    let (grand_pair, screened) = screen_table(&context.policy, grand, &cells)?;

    let mut faculties: Vec<MatrixFaculty> = Vec::new();
    for ((row, exact), pair) in rows.iter().zip(&cells).zip(&screened) {
        let department_code = row.department_code.clone().unwrap_or_default();
        let entry = department_names
            .iter()
            .find(|department| department.code == department_code);
        let [name_ru, name_kk, name_en] = labels(
            entry.map(|d| (&d.name_ru, &d.name_kk, &d.name_en)),
            &department_code,
        );
        let department = MatrixDepartment {
            code: department_code,
            name_ru,
            name_kk,
            name_en,
            checks: context.adopt(exact.checks, pair.checks),
            avg_originality: context.adopt(exact.avg_originality, pair.avg_originality),
        };

        match faculties
            .iter_mut()
            .find(|faculty| faculty.code == row.faculty_code)
        {
            Some(faculty) => faculty.departments.push(department),
            None => {
                let entry = faculty_names
                    .iter()
                    .find(|faculty| faculty.code == row.faculty_code);
                let [name_ru, name_kk, name_en] = labels(
                    entry.map(|f| (&f.name_ru, &f.name_kk, &f.name_en)),
                    &row.faculty_code,
                );
                faculties.push(MatrixFaculty {
                    code: row.faculty_code.clone(),
                    name_ru,
                    name_kk,
                    name_en,
                    // Filled below, once every department of the faculty is in.
                    total: InternalPair {
                        checks: Cell::Exact(0),
                        avg_originality: Cell::Exact(0.0),
                    },
                    departments: vec![department],
                });
            }
        }
    }

    // Faculty margins are computed from the *raw* department cells and screened
    // against their own group size - a margin published beside one visible and
    // one hidden department would reconstruct the hidden one, which is exactly
    // what the complementary pass above already prevents at the grand-total
    // level; here it is the faculty level.
    let mut margins: Vec<RawCell> = Vec::with_capacity(faculties.len());
    let mut index = 0;
    for faculty in &faculties {
        let span = faculty.departments.len();
        margins.push(total_cell(&cells[index..index + span]));
        index += span;
    }
    let (_grand_again, screened_margins) = screen_table(&context.policy, grand, &margins)?;
    for (faculty, (exact, pair)) in faculties
        .iter_mut()
        .zip(margins.iter().zip(&screened_margins))
    {
        faculty.total = InternalPair {
            checks: Cell::adopt(context.screening, exact.checks, pair.checks),
            avg_originality: Cell::adopt(
                context.screening,
                exact.avg_originality,
                pair.avg_originality,
            ),
        };
    }

    let total = context.pair(&grand, &grand_pair);
    let body = DepartmentsMatrix {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        total,
        faculties,
    };
    Ok(context.finish(&state, body))
}

// ── §5 histogram ────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalHistogram {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    /// Band edges in percent, from `settings.histogram_buckets`.
    pub boundaries: [u16; 4],
    #[schema(value_type = ScreenedInt)]
    pub total: Cell<i64>,
    pub buckets: Vec<InternalHistogramBucket>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalHistogramBucket {
    pub key: String,
    pub label: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub share: Cell<f64>,
}

/// TZ §4.2 §5 - the five originality bands, inside the scope.
#[utoipa::path(
    get,
    path = "/api/internal/histogram",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalHistogram),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn histogram(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalHistogram>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let row = db::q::histogram(&state.db, &context.filters, context.scope).await?;
    let boundaries = db::settings::histogram_buckets(&state.db).await?;
    let labels = boundaries.labels();
    let counts = row.counts();
    let total = row.total();

    let cells: Vec<compliance::AggregateCell<i64>> = counts
        .iter()
        .map(|count| compliance::AggregateCell::new(observations(*count), *count))
        .collect();
    let (screened_total, screened_counts) =
        compliance::suppress_table(&context.policy, total, cells)?.into_parts();

    #[expect(
        clippy::cast_precision_loss,
        reason = "counts are bounded by the fact table size"
    )]
    let denominator = total as f64;
    let share_of = |value: i64| {
        #[expect(
            clippy::cast_precision_loss,
            reason = "counts are bounded by the fact table size"
        )]
        let numerator = value as f64;
        if denominator > 0.0 {
            round4(numerator / denominator)
        } else {
            0.0
        }
    };

    let total_cell = context.adopt(total, screened_total);
    let buckets = domain::Bucket::ALL
        .iter()
        .zip(labels)
        .zip(&screened_counts)
        .zip(&counts)
        .map(
            |(((bucket, label), screened), count)| InternalHistogramBucket {
                key: bucket_key(*bucket).to_owned(),
                label,
                checks: context.adopt(*count, *screened),
                // The share is derived from the already-screened count, so it is
                // hidden exactly when the count is.
                share: context.adopt(share_of(*count), screened.map(share_of)),
            },
        )
        .collect();

    let body = InternalHistogram {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        boundaries: boundaries.edges_hundredths().map(|edge| edge / 100),
        total: total_cell,
        buckets,
    };
    Ok(context.finish(&state, body))
}

/// The `agg_monthly` column names, which are also the stable wire keys.
fn bucket_key(bucket: domain::Bucket) -> &'static str {
    match bucket {
        domain::Bucket::Lt50 => "b_lt50",
        domain::Bucket::B50To70 => "b_50_70",
        domain::Bucket::B70To85 => "b_70_85",
        domain::Bucket::B85To95 => "b_85_95",
        domain::Bucket::Ge95 => "b_ge95",
    }
}

// ── §9 year over year ───────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalYoy {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    pub total: InternalPair,
    pub years: Vec<InternalYoyYear>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalYoyYear {
    /// `2024` is AY 2024/25 (Sep 1 – Aug 31).
    pub academic_year: i16,
    pub label: String,
    #[schema(value_type = ScreenedInt)]
    pub checks: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub avg_originality: Cell<f64>,
}

/// TZ §4.2 §9 - the period split by academic year, inside the scope.
#[utoipa::path(
    get,
    path = "/api/internal/yoy",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalYoy),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn yoy(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalYoy>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let rows = db::q::yoy(&state.db, &context.filters, context.scope).await?;
    let cells: Vec<RawCell> = rows
        .iter()
        .map(|row| RawCell::new(row.checks, row.avg_originality()))
        .collect();
    let total = total_cell(&cells);
    let (total_pair, screened) = screen_table(&context.policy, total, &cells)?;

    let total_cells = context.pair(&total, &total_pair);
    let years = rows
        .iter()
        .zip(&cells)
        .zip(&screened)
        .map(|((row, exact), pair)| InternalYoyYear {
            academic_year: row.academic_year.0,
            label: row.academic_year.label(),
            checks: context.adopt(exact.checks, pair.checks),
            avg_originality: context.adopt(exact.avg_originality, pair.avg_originality),
        })
        .collect();

    let body = InternalYoy {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        total: total_cells,
        years,
    };
    Ok(context.finish(&state, body))
}

// ── §6 rechecks ─────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalRechecks {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    #[schema(value_type = ScreenedInt)]
    pub works_total: Cell<i64>,
    #[schema(value_type = ScreenedInt)]
    pub works_rechecked: Cell<i64>,
    /// Rechecked ÷ total, 0..=1.
    #[schema(value_type = ScreenedFloat)]
    pub recheck_share: Cell<f64>,
    #[schema(value_type = ScreenedInt)]
    pub improved: Cell<i64>,
    /// Improved ÷ rechecked, 0..=1.
    #[schema(value_type = ScreenedFloat)]
    pub improved_share: Cell<f64>,
    /// Per-unit rows inside the caller's scope: faculties for a
    /// university-wide caller, departments for a dean, empty for a head of
    /// department (whose own row is the total above).
    pub units: Vec<RecheckUnit>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct RecheckUnit {
    pub code: String,
    pub name_ru: String,
    #[schema(value_type = ScreenedInt)]
    pub works_total: Cell<i64>,
    #[schema(value_type = ScreenedInt)]
    pub works_rechecked: Cell<i64>,
    #[schema(value_type = ScreenedFloat)]
    pub recheck_share: Cell<f64>,
    #[schema(value_type = ScreenedInt)]
    pub improved: Cell<i64>,
}

/// TZ §4.2 §6 - «доля работ, прошедших повторную проверку после доработки; из
/// них доля с улучшенным показателем оригинальности».
///
/// The distinct-work counts are not additive across units (`db::q::rechecks`
/// module docs), so a per-unit row is a **separate** query rather than a
/// roll-up. The unit list is bounded by the caller's scope, and one grain
/// deeper than it: at most the faculties of the university, or the departments
/// of one faculty.
#[utoipa::path(
    get,
    path = "/api/internal/rechecks",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalRechecks),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn rechecks(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalRechecks>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let row = db::q::rechecks(&state.db, &context.filters, context.scope).await?;

    let total = observations(row.works_total);
    let rechecked = observations(row.works_rechecked);
    let improved = observations(row.improved);

    let mut units = Vec::new();
    for (code, name, filters) in unit_slices(&state, &context).await? {
        let unit = db::q::rechecks(&state.db, &filters, context.scope).await?;
        let unit_total = observations(unit.works_total);
        let unit_rechecked = observations(unit.works_rechecked);
        units.push(RecheckUnit {
            code,
            name_ru: name,
            works_total: context.cell(unit_total, unit.works_total),
            works_rechecked: context.cell(unit_rechecked, unit.works_rechecked),
            recheck_share: context.cell(
                unit_rechecked.min(unit_total),
                share(unit.works_rechecked, unit.works_total),
            ),
            improved: context.cell(observations(unit.improved), unit.improved),
        });
    }

    let body = InternalRechecks {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        works_total: context.cell(total, row.works_total),
        works_rechecked: context.cell(rechecked, row.works_rechecked),
        recheck_share: context.cell(
            rechecked.min(total),
            share(row.works_rechecked, row.works_total),
        ),
        improved: context.cell(improved, row.improved),
        improved_share: context.cell(
            improved.min(rechecked),
            share(row.improved, row.works_rechecked),
        ),
        units,
    };
    Ok(context.finish(&state, body))
}

// ── §7 escalations ──────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalEscalations {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    /// Checks flagged «Подозрительный документ» with the mark not cleared,
    /// over the whole scope.
    #[schema(value_type = ScreenedInt)]
    pub escalated: Cell<i64>,
    /// Share of the scope's checks, 0..=1.
    #[schema(value_type = ScreenedFloat)]
    pub escalated_share: Cell<f64>,
    /// **Always k-screened**, whatever the caller's role - TZ §4.2 §7 «без
    /// указания конкретных кафедр при малой выборке».
    pub units: Vec<EscalationUnit>,
    /// Ethics Council counters for the academic years the period touches.
    /// A manually maintained register (D11), never derived from `checks` and
    /// never summed with `escalated`.
    pub ethics_cases: Vec<EthicsCaseDto>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct EscalationUnit {
    pub code: String,
    pub name_ru: String,
    #[schema(value_type = ScreenedInt)]
    pub escalated: Cell<i64>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct EthicsCaseDto {
    pub id: i64,
    pub academic_year: i16,
    pub category: String,
    pub referred: i32,
    pub reviewed_closed: i32,
}

/// TZ §4.2 §7 - escalations and the Ethics Council register.
#[utoipa::path(
    get,
    path = "/api/internal/escalations",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalEscalations),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn escalations(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalEscalations>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let row = db::q::escalations(&state.db, &context.filters, context.scope).await?;
    let overall = db::q::summary(&state.db, &context.filters, context.scope).await?;

    // Per-unit escalation counts, then one complementary pass over them: the
    // total above is published, so a single hidden unit would be its difference.
    let slices = unit_slices(&state, &context).await?;
    let mut raw = Vec::with_capacity(slices.len());
    for (code, name, filters) in &slices {
        let unit = db::q::escalations(&state.db, filters, context.scope).await?;
        raw.push((code.clone(), name.clone(), unit.checks_escalated));
    }
    let cells: Vec<compliance::AggregateCell<i64>> = raw
        .iter()
        .map(|(_, _, count)| compliance::AggregateCell::new(observations(*count), *count))
        .collect();
    let (_total, screened_units) =
        compliance::suppress_table(&context.policy, row.checks_escalated, cells)?.into_parts();

    // TZ §4.2 §7 «без указания конкретных кафедр при малой выборке»: the
    // per-unit breakdown is screened for *every* role, including the ones that
    // read exact numbers everywhere else - `Context::always_screened` is what
    // makes that unconditional rather than a policy the caller can widen.
    let units = raw
        .iter()
        .zip(&screened_units)
        .map(|((code, name, count), screened)| EscalationUnit {
            code: code.clone(),
            name_ru: name.clone(),
            escalated: match screened.visible_value() {
                // Adopt the table-wide complementary decision, and screen the
                // adopted value again against its own group so a raw-data role
                // cannot slip past the first pass.
                Some(value) => context.always_screened(observations(*count), *value),
                None => context.always_screened(0, *count),
            },
        })
        .collect();

    let escalated = observations(row.checks_escalated);
    let body = InternalEscalations {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        escalated: context.cell(escalated, row.checks_escalated),
        escalated_share: context.cell(
            escalated.min(observations(overall.checks)),
            share(row.checks_escalated, overall.checks),
        ),
        units,
        ethics_cases: row
            .ethics_cases
            .iter()
            .map(|case| EthicsCaseDto {
                id: case.id,
                academic_year: case.academic_year,
                category: case.category.clone(),
                referred: case.referred,
                reviewed_closed: case.reviewed_closed,
            })
            .collect(),
    };
    Ok(context.finish(&state, body))
}

// ── §8 usage ────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, ToSchema)]
pub struct InternalUsage {
    pub period: crate::dto::PeriodDto,
    pub scope: ScopeDto,
    pub k_threshold: u32,
    pub months: Vec<UsageMonth>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct UsageMonth {
    /// First day of the month, `YYYY-MM-DD`.
    pub month: String,
    /// Distinct reviewers active in the month, derived from `reviewer_ref`.
    #[schema(value_type = ScreenedInt)]
    pub active_reviewers: Cell<i64>,
    /// From the manual `usage_stats` register; `null` means «нет данных»
    /// (ADR-008 §9) - never a zero.
    pub avg_check_seconds: Option<i32>,
    /// The figure Комплаенс entered by hand, for reconciliation against
    /// `active_reviewers`.
    pub reported_active_users: Option<i32>,
}

/// TZ §4.2 §8 - monthly active reviewers and average check duration.
#[utoipa::path(
    get,
    path = "/api/internal/usage",
    tag = "internal",
    params(InternalFilterQuery),
    responses(
        (status = 200, body = InternalUsage),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem),
        (status = 422, body = crate::error::Problem),
    ),
    security(("session_cookie" = [])),
)]
pub async fn usage(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    ValidQuery(query): ValidQuery<InternalFilterQuery>,
) -> Result<Json<InternalUsage>, ApiError> {
    let mut context = Context::build(&state, &user, scope, &query).await?;
    let points = db::q::usage(&state.db, &context.filters, context.scope).await?;

    let months = points
        .iter()
        .map(|point| UsageMonth {
            month: crate::routes::export::format_date(point.month),
            // A reviewer count *is* its own group: three active reviewers in a
            // department is a group of three, whatever the check volume.
            active_reviewers: context
                .cell(observations(point.active_reviewers), point.active_reviewers),
            avg_check_seconds: point.avg_check_seconds,
            reported_active_users: point.reported_active_users,
        })
        .collect();

    let body = InternalUsage {
        period: context.filters.period().into(),
        scope: context.scope.into(),
        k_threshold: context.policy.threshold().get(),
        months,
    };
    Ok(context.finish(&state, body))
}

// ── shared helpers ──────────────────────────────────────────────────────────

/// One grain below the caller's scope: `(code, RU name, filters)` per unit.
///
/// A department head has nothing below their own unit, so the list is empty and
/// the section publishes its totals only.
async fn unit_slices(
    state: &AppState,
    context: &Context,
) -> Result<Vec<(String, String, Filters)>, ApiError> {
    let depth = match context.scope {
        Scope::All => db::q::UnitDepth::Faculty,
        Scope::Faculty(_) => db::q::UnitDepth::Department,
        Scope::Department(_) => return Ok(Vec::new()),
    };
    let rows = db::q::units(&state.db, &context.filters, context.scope, depth).await?;

    let faculties = db::dicts::faculties(&state.db).await?;
    let departments = db::dicts::departments(&state.db).await?;
    let mut out = Vec::with_capacity(rows.len());
    for row in rows {
        let (code, name) = match (&row.department_code, depth) {
            (Some(code), db::q::UnitDepth::Department) => {
                let name = departments
                    .iter()
                    .find(|department| &department.code == code)
                    .map_or_else(|| code.clone(), |department| department.name_ru.clone());
                (code.clone(), name)
            }
            _ => {
                let name = faculties
                    .iter()
                    .find(|faculty| faculty.code == row.faculty_code)
                    .map_or_else(
                        || row.faculty_code.clone(),
                        |faculty| faculty.name_ru.clone(),
                    );
                (row.faculty_code.clone(), name)
            }
        };
        let Ok(dictionary_code) = domain::DictionaryCode::new(code.clone()) else {
            continue;
        };
        let filters = match depth {
            db::q::UnitDepth::Faculty => context.filters.clone().with_faculty(dictionary_code),
            db::q::UnitDepth::Department => {
                context.filters.clone().with_department(dictionary_code)
            }
        };
        out.push((code, name, filters));
    }
    Ok(out)
}

/// `numerator ÷ denominator`, rounded, or 0 for an empty denominator.
fn share(numerator: i64, denominator: i64) -> f64 {
    if denominator <= 0 {
        return 0.0;
    }
    #[expect(
        clippy::cast_precision_loss,
        reason = "counts are bounded by the fact table size"
    )]
    let ratio = numerator as f64 / denominator as f64;
    round4(ratio)
}

/// The grand total of disjoint cells: counts add, means are count-weighted.
fn total_cell(cells: &[RawCell]) -> RawCell {
    let checks: i64 = cells.iter().map(|cell| cell.checks).sum();
    #[expect(
        clippy::cast_precision_loss,
        reason = "counts are bounded by the fact table size"
    )]
    let weighted: f64 = cells
        .iter()
        .map(|cell| cell.avg_originality * cell.checks as f64)
        .sum();
    #[expect(
        clippy::cast_precision_loss,
        reason = "counts are bounded by the fact table size"
    )]
    let denominator = checks as f64;
    RawCell::new(checks, (checks > 0).then(|| weighted / denominator))
}

/// RU/KK/EN labels, falling back to the code when the dictionary has no row.
fn labels(names: Option<(&String, &String, &String)>, code: &str) -> [String; 3] {
    match names {
        Some((ru, kk, en)) => [ru.clone(), kk.clone(), en.clone()],
        None => [code.to_owned(), code.to_owned(), code.to_owned()],
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn policy(k: u32) -> KPolicy {
        KPolicy::new(compliance::KThreshold::new(k).unwrap_or_default())
    }

    #[test]
    fn a_raw_cell_publishes_a_small_group_and_a_screened_one_does_not() {
        let raw = Cell::new(Screening::Raw, policy(5), 2, 42_i64);
        let screened = Cell::new(Screening::Screened, policy(5), 2, 42_i64);
        assert_eq!(serde_json::to_value(raw).ok(), Some(serde_json::json!(42)));
        assert_eq!(
            serde_json::to_value(screened).ok(),
            Some(serde_json::json!("insufficient_data"))
        );
        assert!(!raw.is_suppressed());
        assert!(screened.is_suppressed());
    }

    #[test]
    fn a_visible_cell_serializes_identically_under_both_policies() {
        let raw = Cell::new(Screening::Raw, policy(5), 900, 42_i64);
        let screened = Cell::new(Screening::Screened, policy(5), 900, 42_i64);
        assert_eq!(
            serde_json::to_value(raw).ok(),
            serde_json::to_value(screened).ok()
        );
    }

    #[test]
    fn shares_are_total_over_an_empty_denominator() {
        assert_eq!(share(0, 0), 0.0);
        assert!((share(1, 3) - 0.3333).abs() < 1e-9);
    }

    #[test]
    fn the_grand_total_mean_is_count_weighted() {
        let total = total_cell(&[RawCell::new(10, Some(80.0)), RawCell::new(90, Some(70.0))]);
        assert_eq!(total.checks, 100);
        assert!((total.avg_originality - 71.0).abs() < 1e-9);
    }
}
