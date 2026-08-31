//! Public contour: aggregated, anonymized, k-anonymity-screened only
//! (TZ §4.1, §4.2, §6.2), and since ADR-016 **closed**.
//!
//! # The released cube
//!
//! Every handler here reads one thing and one thing only: the released cube of
//! [`db::q::public_cube`] - the `(month, faculty, work_type)` cells of
//! `agg_monthly` that hold at least `k` checks. A cell below `k` contributes to
//! no published number, not even to a total, because a total that contains it
//! *is* a transmission of it (TZ §6.2 «подавленные значения не передаются
//! клиенту ни в каком виде»).
//!
//! Three properties follow, and they are what closed the two blockers ADR-016
//! records:
//!
//! 1. **Differencing is closed.** Public periods snap to whole months
//!    ([`domain::Period::snap_to_months`]), and every answer is a sum of cells,
//!    so the difference of two answers is again a sum of cells - never a single
//!    check's score.
//! 2. **Margins are closed.** `Σ items = total` holds on the wire, and a
//!    narrower filter selects a *subset of the same cells*, so
//!    `total − Σ visible` recovers a sum of already-published cells and nothing
//!    else.
//! 3. **Complementary suppression is unnecessary here.** It existed to stop a
//!    visible total from revealing a hidden child; under closure a visible
//!    total has no hidden children. The pass stays in `compliance` for the
//!    internal contour and the ratified static artefacts (ADR-016 §4).
//!
//! A display group that holds no released cell is published as
//! `"insufficient_data"` with `suppressed_groups` saying how many cells were
//! withheld - a count, never a size.
//!
//! Each handler therefore reads: resolve filters → read the cube → screen each
//! group against **its own** observation count (`>= k` by construction, or `0`)
//! → witness → return [`Guarded`], which the `KAnonymityGuard` layer verifies.
//!
//! The scope passed to `db::q` is [`Scope::All`]: the public contour is
//! university-wide by definition, and what protects a small group here is the
//! cube, not row filtering. Department grain is never queried - TZ §4.2 §4 puts
//! it on the internal contour only - and neither is `status`, which the cube
//! cannot carry without shattering ~5 % of all rows into sub-`k` cells
//! (ADR-016 §3).

use axum::Router;
use axum::extract::State;
use axum::routing::get;
use compliance::{KPolicy, Scope, Screened};
use db::q::{CubeGroup, PublicCube};
use domain::Filters;

use crate::dto::{
    BreakdownItemDto, BreakdownResponse, HistogramBucketDto, HistogramResponse, PeriodDto,
    PreviousPeriodDto, ReportFileDto, ReportSnapshotDto, ReportsResponse, ScreenedInt,
    SummaryDeltaDto, SummaryResponse, TIMESERIES_POINT_FIELDS, TimeseriesPointDto,
    TimeseriesResponse, YoyResponse, YoyYearDto, mean4, ratio4, released_pair, round4, witness_pair,
};
use crate::error::ApiError;
use crate::layers::kanon::{Guarded, KAnonWitness};
use crate::query::{PublicFilterQuery, ValidQuery, filters_from};
use crate::state::AppState;

/// Published report snapshots returned by `/reports`. Generous but bounded: the
/// university produces a handful a year.
const REPORTS_PAGE_SIZE: i64 = 100;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/summary", get(summary))
        .route("/timeseries", get(timeseries))
        .route("/work-types", get(work_types))
        .route("/faculties", get(faculties))
        .route("/histogram", get(histogram))
        .route("/yoy", get(yoy))
        .route("/reports", get(reports))
        .route("/status", get(status))
}

/// Group sizes are `i64` counts in SQL and `u64` observation counts in
/// `compliance`. A negative count is impossible (they are `count(*)` results),
/// and mapping one to zero fails closed - zero observations is always
/// suppressed.
fn observations(checks: i64) -> u64 {
    u64::try_from(checks).unwrap_or(0)
}

/// Resolve a request into the three things every handler needs.
async fn resolve(
    state: &AppState,
    query: &PublicFilterQuery,
) -> Result<(Filters, KPolicy, PublicCube), ApiError> {
    let filters = filters_from(&state.db, query).await?;
    let policy = state.k_policy().await?;
    let cube = db::q::public_cube(&state.db, &filters, Scope::All, policy).await?;
    Ok((filters, policy, cube))
}

// ── §1 overview ─────────────────────────────────────────────────────────────

/// TZ §4.2 §1 - KPI cards for the selected period, with the same figures one
/// year earlier and the deltas between them.
///
/// The comparison window is the same calendar months a year earlier, at their
/// true lengths (`domain::Period::shift_years`), so a 28-day February is
/// compared against a 29-day one rather than being silently truncated.
#[utoipa::path(
    get,
    path = "/api/public/summary",
    tag = "public",
    params(PublicFilterQuery),
    responses(
        (status = 200, body = SummaryResponse),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
        (status = 429, body = crate::error::Problem, description = "rate limited"),
    ),
)]
pub async fn summary(
    State(state): State<AppState>,
    ValidQuery(query): ValidQuery<PublicFilterQuery>,
) -> Result<Guarded<SummaryResponse>, ApiError> {
    let (filters, policy, cube) = resolve(&state, &query).await?;
    let mut witness = KAnonWitness::new(policy);

    let previous_filters = filters.previous_year()?;
    let previous_cube =
        db::q::public_cube(&state.db, &previous_filters, Scope::All, policy).await?;

    let threshold = db::settings::originality_threshold(&state.db).await?;
    let current = closure_kpis(&state, &filters, &cube, threshold).await?;
    let previous = closure_kpis(&state, &previous_filters, &previous_cube, threshold).await?;

    let coverage = coverage_of(&state, &filters, &cube, policy, &mut witness).await?;
    let now = screen_kpis(policy, &current, "", &mut witness);
    let then = screen_kpis(policy, &previous, "/previous", &mut witness);
    let delta = screen_delta(policy, &current, &previous, &mut witness);

    Ok(Guarded::new(
        SummaryResponse {
            period: filters.period().into(),
            k_threshold: policy.threshold().get(),
            total_checks: now.total_checks,
            avg_originality: now.avg_originality,
            below_threshold: now.below_threshold,
            below_threshold_share: now.below_threshold_share,
            escalated: now.escalated,
            coverage,
            // The previous period's own withheld cells are not published: the
            // counter describes the response's primary window.
            suppressed_groups: cube.suppressed_cells(),
            previous: PreviousPeriodDto {
                period: previous_filters.period().into(),
                total_checks: then.total_checks,
                avg_originality: then.avg_originality,
                below_threshold: then.below_threshold,
                below_threshold_share: then.below_threshold_share,
                escalated: then.escalated,
                delta,
            },
        },
        witness,
    ))
}

/// The five KPI numbers of one period, as exact integer sums over released
/// cells. Nothing here is rounded - that happens once, in [`screen_kpis`].
#[derive(Debug, Clone, Copy, Default)]
pub(crate) struct ClosureKpis {
    pub(crate) checks: i64,
    pub(crate) sum_originality_hundredths: i64,
    pub(crate) below_threshold: i64,
    pub(crate) escalated: i64,
}

/// Roll the released cube up into the KPI numbers.
///
/// `below_threshold` comes from the cube's own bucket columns whenever
/// `settings.originality_threshold` is one of the four edges baked into
/// `agg_monthly` (the default 70 % is `b_lt50 + b_50_70`). An administrator who
/// moves it off those edges falls back to a fact-table count - **joined to the
/// released key set**, so the exception cannot reopen what the cube closed.
pub(crate) async fn closure_kpis(
    state: &AppState,
    filters: &Filters,
    cube: &PublicCube,
    threshold: domain::OriginalityPct,
) -> Result<ClosureKpis, ApiError> {
    let total = cube.total();
    let below = match db::q::bucket_edge_index(threshold) {
        Some(index) => total.below_bucket_edge(index),
        None => {
            db::q::released_below_threshold(&state.db, filters, Scope::All, cube, threshold).await?
        }
    };
    Ok(ClosureKpis {
        checks: total.checks,
        sum_originality_hundredths: total.sum_originality_hundredths,
        below_threshold: below,
        escalated: total.escalated,
    })
}

/// The five KPI cells of one period, screened and witnessed.
struct ScreenedKpis {
    total_checks: Screened<i64>,
    avg_originality: Screened<f64>,
    below_threshold: Screened<i64>,
    below_threshold_share: Screened<f64>,
    escalated: Screened<i64>,
}

/// Every KPI is screened against **the group's** observation count.
///
/// Before ADR-016 each KPI was screened against its own numerator - the
/// escalation counter against the number of escalations, the below-threshold
/// share against the smaller of its two terms. That was strictly *more*
/// suppression on one response and strictly *less* safety across responses:
/// `escalated` is additive over the cube, so a value hidden under one filter
/// was the difference of the values published under the neighbouring ones. The
/// released cell is the unit of disclosure, and every measure it carries -
/// count, originality sum, the five bands, escalations - is released with it.
fn screen_kpis(
    policy: KPolicy,
    kpis: &ClosureKpis,
    base: &str,
    witness: &mut KAnonWitness,
) -> ScreenedKpis {
    let group = observations(kpis.checks);
    for field in [
        "total_checks",
        "avg_originality",
        "below_threshold",
        "below_threshold_share",
        "escalated",
    ] {
        witness.field(format!("{base}/{field}"), group);
    }

    ScreenedKpis {
        total_checks: policy.screen(group, kpis.checks),
        avg_originality: policy.screen(group, mean4(kpis.sum_originality_hundredths, kpis.checks)),
        below_threshold: policy.screen(group, kpis.below_threshold),
        below_threshold_share: policy.screen(group, ratio4(kpis.below_threshold, kpis.checks)),
        escalated: policy.screen(group, kpis.escalated),
    }
}

/// A difference is only publishable when both sides are, so every delta is
/// screened against the smaller of the two windows.
fn screen_delta(
    policy: KPolicy,
    current: &ClosureKpis,
    previous: &ClosureKpis,
    witness: &mut KAnonWitness,
) -> SummaryDeltaDto {
    let group = observations(current.checks).min(observations(previous.checks));
    for field in [
        "total_checks",
        "avg_originality",
        "below_threshold_share",
        "escalated",
    ] {
        witness.field(format!("/previous/delta/{field}"), group);
    }

    SummaryDeltaDto {
        total_checks: policy.screen(group, current.checks - previous.checks),
        avg_originality: policy.screen(
            group,
            // Both terms are already rounded to 4 dp; `round4` only clears the
            // binary-subtraction residue.
            round4(
                mean4(current.sum_originality_hundredths, current.checks)
                    - mean4(previous.sum_originality_hundredths, previous.checks),
            ),
        ),
        below_threshold_share: policy.screen(
            group,
            round4(
                ratio4(current.below_threshold, current.checks)
                    - ratio4(previous.below_threshold, previous.checks),
            ),
        ),
        escalated: policy.screen(group, current.escalated - previous.escalated),
    }
}

/// TZ §4.2 §1 «охват проверками (при наличии данных)» - `None` when the
/// registrar has supplied no `submission_totals` for the period. Never
/// estimated, never zero-filled.
///
/// The denominator is registrar data and carries no check-level detail, so it
/// is not part of the cube. The **numerator** is, and is summed over released
/// cells only.
async fn coverage_of(
    state: &AppState,
    filters: &Filters,
    cube: &PublicCube,
    policy: KPolicy,
    witness: &mut KAnonWitness,
) -> Result<Option<Screened<f64>>, ApiError> {
    let Some((checks, submitted)) = closure_coverage(state, filters, cube).await? else {
        return Ok(None);
    };
    let group = observations(checks);
    witness.field("/coverage", group);
    Ok(Some(policy.screen(group, ratio4(checks, submitted))))
}

/// The released numerator and the registrar denominator of TZ §4.2 §1, or
/// `None` when the section must be hidden. Shared with the public export.
pub(crate) async fn closure_coverage(
    state: &AppState,
    filters: &Filters,
    cube: &PublicCube,
) -> Result<Option<(i64, i64)>, ApiError> {
    let years = cube.academic_years();
    let (Some(first), Some(last)) = (years.first(), years.last()) else {
        return Ok(None);
    };
    let denominators = db::q::coverage_denominators(
        &state.db,
        first.0,
        last.0,
        filters.work_type().map(domain::DictionaryCode::as_str),
    )
    .await?;
    if denominators.is_empty() {
        return Ok(None);
    }

    let mut checks = 0_i64;
    let mut submitted = 0_i64;
    for (academic_year, work_type_code, total_submitted) in &denominators {
        checks += cube.checks_for(*academic_year, work_type_code);
        submitted += i64::from(*total_submitted);
    }
    Ok((submitted > 0).then_some((checks, submitted)))
}

// ── §2 dynamics ─────────────────────────────────────────────────────────────

/// TZ §4.2 §2 - checks and mean originality by month.
///
/// Months with no data at all are absent; months whose every cell was withheld
/// are present with both metrics as `"insufficient_data"`, so the chart draws
/// the gap explicitly (TZ §8 «состояние "недостаточно данных" отображается
/// явно»).
#[utoipa::path(
    get,
    path = "/api/public/timeseries",
    tag = "public",
    params(PublicFilterQuery),
    responses(
        (status = 200, body = TimeseriesResponse),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
    ),
)]
pub async fn timeseries(
    State(state): State<AppState>,
    ValidQuery(query): ValidQuery<PublicFilterQuery>,
) -> Result<Guarded<TimeseriesResponse>, ApiError> {
    let (filters, policy, cube) = resolve(&state, &query).await?;
    let mut witness = KAnonWitness::new(policy);

    let months = cube
        .by_month()
        .into_iter()
        .enumerate()
        .map(|(index, (month, group))| {
            let observations = group.observations();
            witness.group(
                &format!("/months/{index}"),
                observations,
                &TIMESERIES_POINT_FIELDS,
            );
            let pair = released_pair(policy, &group);
            TimeseriesPointDto {
                month: format_date(month),
                checks: pair.checks,
                avg_originality: pair.avg_originality,
                escalated: policy.screen(observations, group.escalated),
                rechecks: policy.screen(observations, group.rechecks),
            }
        })
        .collect();

    Ok(Guarded::new(
        TimeseriesResponse {
            period: filters.period().into(),
            k_threshold: policy.threshold().get(),
            suppressed_groups: cube.suppressed_cells(),
            months,
        },
        witness,
    ))
}

// ── §3 work types ───────────────────────────────────────────────────────────

/// TZ §4.2 §3 - checks and mean originality per work type.
#[utoipa::path(
    get,
    path = "/api/public/work-types",
    tag = "public",
    params(PublicFilterQuery),
    responses(
        (status = 200, body = BreakdownResponse),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
    ),
)]
pub async fn work_types(
    State(state): State<AppState>,
    ValidQuery(query): ValidQuery<PublicFilterQuery>,
) -> Result<Guarded<BreakdownResponse>, ApiError> {
    let (filters, policy, cube) = resolve(&state, &query).await?;
    let names = db::dicts::work_types(&state.db).await?;
    let rows = cube
        .by_work_type()
        .into_iter()
        .map(|(code, group)| {
            let entry = names.iter().find(|work_type| work_type.code == code);
            let names = labels(entry.map(|w| (&w.name_ru, &w.name_kk, &w.name_en)), &code);
            (code, names, group)
        })
        .collect();

    breakdown(&filters, policy, &cube, rows)
}

// ── §4 faculties (aggregate grain only) ─────────────────────────────────────

/// TZ §4.2 §4 - the faculty aggregate. The public contour never publishes
/// department grain; that is the internal contour's `/departments-matrix`.
#[utoipa::path(
    get,
    path = "/api/public/faculties",
    tag = "public",
    params(PublicFilterQuery),
    responses(
        (status = 200, body = BreakdownResponse),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
    ),
)]
pub async fn faculties(
    State(state): State<AppState>,
    ValidQuery(query): ValidQuery<PublicFilterQuery>,
) -> Result<Guarded<BreakdownResponse>, ApiError> {
    let (filters, policy, cube) = resolve(&state, &query).await?;
    let names = db::dicts::faculties(&state.db).await?;
    let rows = cube
        .by_faculty()
        .into_iter()
        .map(|(code, group)| {
            let entry = names.iter().find(|faculty| faculty.code == code);
            let names = labels(entry.map(|f| (&f.name_ru, &f.name_kk, &f.name_en)), &code);
            (code, names, group)
        })
        .collect();

    breakdown(&filters, policy, &cube, rows)
}

/// Shared body of `/work-types` and `/faculties`.
///
/// No complementary pass: the total is the sum of exactly the rows below it, so
/// `total − Σ visible = 0` and there is nothing for a margin to reveal.
fn breakdown(
    filters: &Filters,
    policy: KPolicy,
    cube: &PublicCube,
    rows: Vec<(String, [String; 3], CubeGroup)>,
) -> Result<Guarded<BreakdownResponse>, ApiError> {
    let mut witness = KAnonWitness::new(policy);
    let total = cube.total();
    witness_pair(&mut witness, "/total", total.observations());

    let items = rows
        .into_iter()
        .enumerate()
        .map(|(index, (code, [name_ru, name_kk, name_en], group))| {
            witness_pair(
                &mut witness,
                &format!("/items/{index}"),
                group.observations(),
            );
            let pair = released_pair(policy, &group);
            BreakdownItemDto {
                code,
                name_ru,
                name_kk,
                name_en,
                checks: pair.checks,
                avg_originality: pair.avg_originality,
            }
        })
        .collect();

    Ok(Guarded::new(
        BreakdownResponse {
            period: filters.period().into(),
            k_threshold: policy.threshold().get(),
            suppressed_groups: cube.suppressed_cells(),
            total: released_pair(policy, &total),
            items,
        },
        witness,
    ))
}

// ── §5 histogram ────────────────────────────────────────────────────────────

/// TZ §4.2 §5 - the five originality bands and their shares.
///
/// The bands are the distribution *inside* one released group, so they are
/// published with it: `Σ bands = total`, and a band is never the difference of
/// published numbers.
#[utoipa::path(
    get,
    path = "/api/public/histogram",
    tag = "public",
    params(PublicFilterQuery),
    responses(
        (status = 200, body = HistogramResponse),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
    ),
)]
pub async fn histogram(
    State(state): State<AppState>,
    ValidQuery(query): ValidQuery<PublicFilterQuery>,
) -> Result<Guarded<HistogramResponse>, ApiError> {
    let (filters, policy, cube) = resolve(&state, &query).await?;
    let mut witness = KAnonWitness::new(policy);

    let boundaries = db::settings::histogram_buckets(&state.db).await?;
    let total = cube.total();
    // `agg_monthly` carries one FILTER column per ADR-008 §8 default band. When
    // an administrator moves an edge those columns answer a different question,
    // and the only exact source is the fact table - restricted to the released
    // key set, so the exception publishes nothing the cube withheld.
    let counts = if boundaries == domain::BucketBoundaries::default() {
        total.buckets
    } else {
        db::q::released_buckets(&state.db, &filters, Scope::All, &cube, boundaries).await?
    };

    let group = total.observations();
    witness.field("/total", group);
    let buckets = domain::Bucket::ALL
        .iter()
        .zip(boundaries.labels())
        .zip(counts)
        .enumerate()
        .map(|(index, ((bucket, label), count))| {
            witness.field(format!("/buckets/{index}/checks"), group);
            witness.field(format!("/buckets/{index}/share"), group);
            HistogramBucketDto {
                key: bucket_key(*bucket).to_owned(),
                label,
                checks: policy.screen(group, count),
                share: policy.screen(group, ratio4(count, total.checks)),
            }
        })
        .collect();

    Ok(Guarded::new(
        HistogramResponse {
            period: filters.period().into(),
            k_threshold: policy.threshold().get(),
            boundaries: boundaries.edges_hundredths().map(|edge| edge / 100),
            suppressed_groups: cube.suppressed_cells(),
            total: policy.screen(group, total.checks),
            buckets,
        },
        witness,
    ))
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

/// TZ §4.2 §9 - the period split by academic year.
#[utoipa::path(
    get,
    path = "/api/public/yoy",
    tag = "public",
    params(PublicFilterQuery),
    responses(
        (status = 200, body = YoyResponse),
        (status = 422, body = crate::error::Problem, description = "malformed filters"),
    ),
)]
pub async fn yoy(
    State(state): State<AppState>,
    ValidQuery(query): ValidQuery<PublicFilterQuery>,
) -> Result<Guarded<YoyResponse>, ApiError> {
    let (filters, policy, cube) = resolve(&state, &query).await?;
    let mut witness = KAnonWitness::new(policy);

    let total = cube.total();
    witness_pair(&mut witness, "/total", total.observations());
    let years = cube
        .by_academic_year()
        .into_iter()
        .enumerate()
        .map(|(index, (academic_year, group))| {
            witness_pair(
                &mut witness,
                &format!("/years/{index}"),
                group.observations(),
            );
            let pair = released_pair(policy, &group);
            YoyYearDto {
                academic_year: academic_year.0,
                label: academic_year.label(),
                checks: pair.checks,
                avg_originality: pair.avg_originality,
            }
        })
        .collect();

    Ok(Guarded::new(
        YoyResponse {
            period: filters.period().into(),
            k_threshold: policy.threshold().get(),
            suppressed_groups: cube.suppressed_cells(),
            total: released_pair(policy, &total),
            years,
        },
        witness,
    ))
}

// ── published reports ───────────────────────────────────────────────────────

/// TZ §4.5 - the published report snapshots.
///
/// Snapshots are immutable artefacts that were screened when they were
/// generated, so there is nothing left to suppress; the witness is empty and
/// the guard only checks that no metric-shaped number slipped in. No
/// filesystem path is exposed.
#[utoipa::path(
    get,
    path = "/api/public/reports",
    tag = "public",
    responses((status = 200, body = ReportsResponse)),
)]
pub async fn reports(State(state): State<AppState>) -> Result<Guarded<ReportsResponse>, ApiError> {
    let policy = state.k_policy().await?;
    let rows = db::snapshots::list(&state.db, true, REPORTS_PAGE_SIZE, 0).await?;

    let items = rows
        .into_iter()
        .map(|row| {
            let mut files = Vec::new();
            if row.pdf_path.is_some() {
                files.push(ReportFileDto {
                    format: "pdf".to_owned(),
                    download_id: format!("{}-pdf", row.id),
                });
            }
            if row.xlsx_path.is_some() {
                files.push(ReportFileDto {
                    format: "xlsx".to_owned(),
                    download_id: format!("{}-xlsx", row.id),
                });
            }
            ReportSnapshotDto {
                id: row.id,
                kind: row.kind,
                period: PeriodDto {
                    from: format_date(row.period_start),
                    to: format_date(row.period_end),
                },
                generated_at: format_instant(row.generated_at),
                files,
            }
        })
        .collect();

    Ok(Guarded::new(
        ReportsResponse { items },
        KAnonWitness::new(policy),
    ))
}

// ── legacy placeholder ──────────────────────────────────────────────────────

#[derive(Debug, serde::Serialize, utoipa::ToSchema)]
pub struct PublicStatus {
    pub contour: &'static str,
    /// Demonstrates the screened-cell contract; serializes to a number or the
    /// string `"insufficient_data"`.
    #[schema(value_type = ScreenedInt)]
    pub example_metric: Screened<i64>,
}

/// Wiring probe kept from the scaffold until the frontend client is generated
/// in slice W2.2. Carries no data.
#[utoipa::path(
    get,
    path = "/api/public/status",
    tag = "public",
    responses((status = 200, body = PublicStatus)),
)]
pub async fn status(State(state): State<AppState>) -> Result<Guarded<PublicStatus>, ApiError> {
    let policy = state.k_policy().await?;
    let mut witness = KAnonWitness::new(policy);
    witness.field("/example_metric", 0);
    Ok(Guarded::new(
        PublicStatus {
            contour: "public",
            example_metric: policy.screen(0, 0),
        },
        witness,
    ))
}

// ── shared helpers ──────────────────────────────────────────────────────────

/// RU/KK/EN labels, falling back to the code when the dictionary has no row -
/// an aggregate must not vanish because a label is missing.
fn labels(names: Option<(&String, &String, &String)>, code: &str) -> [String; 3] {
    match names {
        Some((ru, kk, en)) => [ru.clone(), kk.clone(), en.clone()],
        None => [code.to_owned(), code.to_owned(), code.to_owned()],
    }
}

/// `time::Date` as ISO 8601. Spelled out rather than relying on the driver's
/// `Display`, which is feature-gated.
fn format_date(date: sqlx::types::time::Date) -> String {
    let (year, month, day) = date.to_calendar_date();
    format!("{year:04}-{:02}-{day:02}", u8::from(month))
}

/// `time::OffsetDateTime` as RFC 3339, through `jiff` - the calendar library
/// the rest of the workspace already speaks.
fn format_instant(instant: sqlx::types::time::OffsetDateTime) -> String {
    let nanoseconds = i32::try_from(instant.nanosecond()).unwrap_or(0);
    jiff::Timestamp::new(instant.unix_timestamp(), nanoseconds)
        .map_or_else(|_| instant.unix_timestamp().to_string(), |t| t.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bucket_keys_match_the_aggregate_columns() {
        let keys: Vec<&str> = domain::Bucket::ALL.iter().map(|b| bucket_key(*b)).collect();
        assert_eq!(
            keys,
            vec!["b_lt50", "b_50_70", "b_70_85", "b_85_95", "b_ge95"]
        );
    }

    /// The single-rounding rule of ADR-016 §2: every public average is
    /// `round(Σ hundredths ÷ n)` over the same released cells, so a total and
    /// the rows it sums agree exactly. The old path rounded each row and then
    /// averaged the rounded values, which is where the fourth decimal drifted.
    #[test]
    fn a_total_and_its_rows_round_to_the_same_mean() {
        // `(checks, Σ originality in hundredths)` for three groups. Rounding
        // each row's mean and then averaging lands one ten-thousandth above the
        // exact answer - the audit's finding 4, in miniature.
        let rows: [(i64, i64); 3] = [(31, 198_243), (53, 444_335), (14, 134_089)];
        let total_checks: i64 = rows.iter().map(|(checks, _)| checks).sum();
        let total_sum: i64 = rows.iter().map(|(_, sum)| sum).sum();

        let round_of_rounds = {
            let weighted: f64 = rows
                .iter()
                .map(|(checks, sum)| {
                    #[expect(clippy::cast_precision_loss, reason = "tiny test fixture")]
                    let count = *checks as f64;
                    mean4(*sum, *checks) * count
                })
                .sum();
            #[expect(clippy::cast_precision_loss, reason = "tiny test fixture")]
            let denominator = total_checks as f64;
            round4(weighted / denominator)
        };
        let single_rounding = mean4(total_sum, total_checks);

        assert!(
            (single_rounding - 79.2517).abs() < 1e-9,
            "{single_rounding}"
        );
        assert!(
            (round_of_rounds - 79.2518).abs() < 1e-9,
            "{round_of_rounds}"
        );
        assert!(
            (round_of_rounds - single_rounding).abs() > 1e-9,
            "the fixture must actually distinguish the two rules"
        );
    }

    #[test]
    fn ratios_round_half_up_in_integer_arithmetic() {
        // 1/3 and 2/3 round away from each other, not both down.
        assert!((ratio4(1, 3) - 0.3333).abs() < 1e-12);
        assert!((ratio4(2, 3) - 0.6667).abs() < 1e-12);
        // Exact half rounds up.
        assert!((ratio4(1, 2) - 0.5).abs() < 1e-12);
        assert!((ratio4(1, 16_000) - 0.0001).abs() < 1e-12);
        // An empty denominator is zero, never a NaN on the wire.
        assert!((ratio4(7, 0) - 0.0).abs() < 1e-12);
    }
}
