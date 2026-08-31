//! Filtered-view export and published-snapshot download (TZ §4.4, §4.5).
//!
//! Three endpoints, one document builder:
//!
//! * `POST /api/internal/export` - the caller's current filtered view, inside
//!   their RBAC scope, watermarked «Для служебного пользования» and audited as
//!   `export_pdf` / `export_xlsx`;
//! * `POST /api/public/export` - the same builder at [`Scope::All`] with the
//!   public filter set, unwatermarked, rate limited, unauthenticated;
//! * `GET /api/public/reports/{id}/download` - bytes of a **published**
//!   `report_snapshots` file, streamed from disk.
//!
//! # Why exports are always screened
//!
//! The on-screen internal contour gives the five scoped roles exact numbers
//! (ADR-014 §4). An export is different in kind: it is a file that leaves the
//! session, gets mailed, and is read by whoever ends up holding it. TZ §6.2 is
//! explicit that suppressed values are not transmitted «ни в каком виде,
//! **включая экспорт**», so both endpoints render through
//! [`compliance::KPolicy`]. That is not a limitation of the renderer - it is
//! structural: [`reports::Metric`] is constructible only from a
//! [`compliance::Screened`], so there is no path from a raw aggregate to a
//! printed digit (AGENTS.md invariant #2).
//!
//! # Why the builder lives here and not in `reports`
//!
//! `reports::period_report` renders the Приложение-1 form university-wide and
//! unfiltered - it is the annual report, and it takes neither a `Filters` nor a
//! `Scope`. TZ §4.4 asks for «выгрузка текущего представления (с учётом
//! применённых фильтров)», so the seven sections are assembled here from the
//! same `db::q` calls with the caller's filters and scope, and handed to the
//! *same* `reports` renderers. Nothing about screening or PDF/XLSX generation is
//! reimplemented (ADR-014 §5).

use axum::Router;
use axum::extract::{Path, Query, State};
use axum::http::{HeaderValue, header};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use compliance::{AggregateCell, KPolicy, Scope, ScreenedTable, suppress_table};
use domain::Filters;
use reports::{
    Cell, Column, Label, Locale, Metric, RenderOptions, ReportDoc, ReportSection, ReportTable, Row,
    Strings,
};
use serde::Deserialize;

use crate::auth::{CurrentUser, RbacScope};
use crate::error::ApiError;
use crate::layers::audit::AuditNote;
use crate::query::{
    InternalFilterQuery, PublicFilterQuery, ScopeGuard, filters_from, internal_filters_from,
    validated_body,
};
use crate::state::AppState;

/// Roles allowed to export from the internal contour (TZ §4.4 «доступен только
/// ролям с соответствующими правами»). `staff` is not among them: TZ §5 gives
/// ППС the public contour, and the public export is open to them there.
const EXPORT_ROLES: [domain::RoleKind; 5] = [
    domain::RoleKind::DeptHead,
    domain::RoleKind::Dean,
    domain::RoleKind::Ethics,
    domain::RoleKind::Compliance,
    domain::RoleKind::Admin,
];

/// The sentinel dictionary code for an unmapped reviewer (ADR-008 §6).
const UNASSIGNED_UNIT: &str = "UNASSIGNED";

const PDF_CONTENT_TYPE: &str = "application/pdf";
const XLSX_CONTENT_TYPE: &str = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/// The public contour's file routes, mounted outside the `KAnonymityGuard`.
///
/// The guard deserializes a JSON body and checks its metric-shaped numbers
/// against a witness; a PDF is neither. What protects these responses is the
/// same thing that protects the guard's own inputs - the document model, whose
/// every cell is a `Screened` value (ADR-014 §5).
pub fn public_router() -> Router<AppState> {
    Router::new()
        .route("/export", post(public_export))
        .route("/reports/{id}/download", get(download))
}

// ── request shapes ──────────────────────────────────────────────────────────

/// Wire names of the two export formats.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "lowercase")]
pub enum ExportFormat {
    Pdf,
    Xlsx,
}

impl ExportFormat {
    fn content_type(self) -> &'static str {
        match self {
            Self::Pdf => PDF_CONTENT_TYPE,
            Self::Xlsx => XLSX_CONTENT_TYPE,
        }
    }

    fn extension(self) -> &'static str {
        match self {
            Self::Pdf => "pdf",
            Self::Xlsx => "xlsx",
        }
    }

    /// `audit_log.action` for this format (ARCHITECTURE.md §3.2).
    fn audit_action(self) -> &'static str {
        match self {
            Self::Pdf => crate::layers::audit::ACTION_EXPORT_PDF,
            Self::Xlsx => crate::layers::audit::ACTION_EXPORT_XLSX,
        }
    }
}

/// `?format=pdf|xlsx&locale=ru|kk|en`.
#[derive(Debug, Deserialize, utoipa::IntoParams)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct ExportOptions {
    /// `pdf` or `xlsx`.
    #[param(inline)]
    pub format: ExportFormat,
    /// Report language: `ru` (default), `kk` or `en`.
    #[serde(default)]
    #[param(value_type = Option<String>)]
    pub locale: Option<ExportLocale>,
}

/// Wire names of `reports::Locale`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ExportLocale {
    Ru,
    Kk,
    En,
}

impl From<ExportLocale> for Locale {
    fn from(value: ExportLocale) -> Self {
        match value {
            ExportLocale::Ru => Self::Ru,
            ExportLocale::Kk => Self::Kk,
            ExportLocale::En => Self::En,
        }
    }
}

impl ExportOptions {
    fn locale(&self) -> Locale {
        self.locale.map_or(Locale::Ru, Into::into)
    }
}

// ── internal export ─────────────────────────────────────────────────────────

/// TZ §4.4 - the caller's current filtered view, as a file.
#[utoipa::path(
    post,
    path = "/api/internal/export",
    tag = "internal",
    params(ExportOptions),
    request_body(content = InternalFilterQuery, description = "the filter state to export; an empty body means the default period"),
    responses(
        (status = 200, description = "the rendered report", content_type = "application/pdf"),
        (status = 401, body = crate::error::Problem),
        (status = 403, body = crate::error::Problem, description = "role without export rights, a unit outside your scope, or a missing CSRF token"),
        (status = 422, body = crate::error::Problem, description = "malformed filters or format"),
    ),
    security(("session_cookie" = [])),
)]
pub async fn internal_export(
    State(state): State<AppState>,
    user: CurrentUser,
    RbacScope(scope): RbacScope,
    Query(options): Query<ExportOptions>,
    body: axum::body::Bytes,
) -> Result<Response, ApiError> {
    let query: InternalFilterQuery = validated_body(&body)?;
    if !user
        .roles
        .iter()
        .any(|grant| EXPORT_ROLES.contains(&grant.role))
    {
        return Err(ApiError::Forbidden(
            "your role may read the internal contour but not export from it",
        ));
    }
    ScopeGuard::load(&state.db, scope).await?.narrow(&query)?;
    let filters = internal_filters_from(&state.db, &query).await?;
    let policy = state.k_policy().await?;

    let document = build_document(&state, &filters, scope, policy, options.locale()).await?;
    let bytes = render(&document, options.format, RenderOptions::internal())?;
    let mut response = file_response(bytes, options.format, &filters);
    // The audit layer writes `export_pdf`/`export_xlsx` instead of the default
    // action for a mutating request, and journals the filter state the handler
    // resolved rather than the query string, which carries only the format
    // (TZ §6.3 «с какими фильтрами», ARCHITECTURE.md §3.2).
    response
        .extensions_mut()
        .insert(AuditNote::action(options.format.audit_action()).with_filters(&filters));
    Ok(response)
}

// ── public export ───────────────────────────────────────────────────────────

/// TZ §4.4 - the public filtered view, as a file. No watermark, no audit row
/// (there is no identity to record), and every cell screened by construction.
///
/// Since ADR-016 this renders the **four closure sections** - overview, work
/// types, originality bands, faculties - from the released cube, and not the
/// seven of the internal export. Rechecks, escalation categories and usage are
/// distinct-entity counts with no decomposition over the cube, so a public
/// figure for them would necessarily include the checks of withheld cells,
/// which TZ §6.2 forbids «ни в каком виде, включая экспорт». Those four
/// sections are also exactly what the public dashboard shows, so the file is
/// now a faithful «выгрузка текущего представления» rather than a superset of
/// it. The internal export is unchanged.
#[utoipa::path(
    post,
    path = "/api/public/export",
    tag = "public",
    params(ExportOptions),
    request_body(content = PublicFilterQuery, description = "the filter state to export; an empty body means the default period"),
    responses(
        (status = 200, description = "the rendered report", content_type = "application/pdf"),
        (status = 422, body = crate::error::Problem, description = "malformed filters or format"),
        (status = 429, body = crate::error::Problem, description = "rate limited"),
    ),
)]
pub async fn public_export(
    State(state): State<AppState>,
    Query(options): Query<ExportOptions>,
    body: axum::body::Bytes,
) -> Result<Response, ApiError> {
    let query: PublicFilterQuery = validated_body(&body)?;
    let filters = filters_from(&state.db, &query).await?;
    let policy = state.k_policy().await?;
    let document = build_public_document(&state, &filters, policy, options.locale()).await?;
    let bytes = render(&document, options.format, RenderOptions::public())?;
    Ok(file_response(bytes, options.format, &filters))
}

// ── published snapshot download ─────────────────────────────────────────────

#[derive(Debug, Deserialize, utoipa::IntoParams)]
#[serde(deny_unknown_fields)]
#[into_params(parameter_in = Query)]
pub struct DownloadQuery {
    /// `pdf` or `xlsx`.
    #[param(inline)]
    pub format: ExportFormat,
}

/// TZ §4.5 - bytes of a published report snapshot.
///
/// An unpublished snapshot answers `404`, not `403`: the public contour must
/// not confirm that a draft exists.
#[utoipa::path(
    get,
    path = "/api/public/reports/{id}/download",
    tag = "public",
    params(
        ("id" = i64, Path, description = "report snapshot id from /api/public/reports"),
        DownloadQuery,
    ),
    responses(
        (status = 200, description = "the published file", content_type = "application/pdf"),
        (status = 404, body = crate::error::Problem, description = "no such published snapshot, or no file in that format"),
    ),
)]
pub async fn download(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Query(query): Query<DownloadQuery>,
) -> Result<Response, ApiError> {
    let snapshot = db::snapshots::get(&state.db, id)
        .await?
        .filter(|snapshot| snapshot.published)
        .ok_or(ApiError::NotFound)?;

    let relative = match query.format {
        ExportFormat::Pdf => snapshot.pdf_path,
        ExportFormat::Xlsx => snapshot.xlsx_path,
    }
    .ok_or(ApiError::NotFound)?;

    let bytes = read_snapshot(&state.config.reports_dir, &relative).await?;
    let filename = format!(
        "noplagiat-{}-{}_{}.{}",
        snapshot.kind,
        format_date(snapshot.period_start),
        format_date(snapshot.period_end),
        query.format.extension()
    );
    Ok(attachment(bytes, query.format.content_type(), &filename))
}

/// Read one snapshot file, refusing anything that escapes the reports
/// directory.
///
/// The path comes from `report_snapshots.pdf_path`, which only `reports`
/// writes - but an administrator with database access is not the threat model
/// this guards against; a future import path is. Two independent checks: no
/// path component may be `..` or absolute, and the resolved path must still be
/// inside the resolved reports directory.
async fn read_snapshot(root: &std::path::Path, relative: &str) -> Result<Vec<u8>, ApiError> {
    let candidate = std::path::Path::new(relative);
    let traversal = candidate.components().any(|component| {
        !matches!(
            component,
            std::path::Component::Normal(_) | std::path::Component::CurDir
        )
    });
    if traversal {
        tracing::error!("a report snapshot path escapes the reports directory - refused");
        return Err(ApiError::NotFound);
    }

    let full = root.join(candidate);
    let (Ok(resolved), Ok(base)) = (full.canonicalize(), root.canonicalize()) else {
        return Err(ApiError::NotFound);
    };
    if !resolved.starts_with(&base) {
        tracing::error!("a report snapshot resolved outside the reports directory - refused");
        return Err(ApiError::NotFound);
    }
    tokio::fs::read(&resolved).await.map_err(|error| {
        tracing::warn!(%error, "a published snapshot file could not be read");
        ApiError::NotFound
    })
}

// ── rendering ───────────────────────────────────────────────────────────────

fn render(
    document: &ReportDoc,
    format: ExportFormat,
    options: RenderOptions,
) -> Result<Vec<u8>, ApiError> {
    let bytes = match format {
        ExportFormat::Pdf => reports::render_pdf(document, &options).map(|pdf| pdf.bytes),
        ExportFormat::Xlsx => reports::render_xlsx(document, &options),
    };
    bytes.map_err(|error| {
        tracing::error!(%error, "report rendering failed");
        ApiError::Internal("the report could not be rendered")
    })
}

fn file_response(bytes: Vec<u8>, format: ExportFormat, filters: &Filters) -> Response {
    let period = filters.period();
    let filename = format!(
        "noplagiat-{}_{}.{}",
        period.start(),
        period.end(),
        format.extension()
    );
    attachment(bytes, format.content_type(), &filename)
}

fn attachment(bytes: Vec<u8>, content_type: &'static str, filename: &str) -> Response {
    let mut response = bytes.into_response();
    let headers = response.headers_mut();
    headers.insert(header::CONTENT_TYPE, HeaderValue::from_static(content_type));
    // The filename is built from dates and a dictionary kind, so it is already
    // header-safe; the fallback keeps the response valid if that ever changes.
    let disposition = format!("attachment; filename=\"{filename}\"");
    if let Ok(value) = HeaderValue::try_from(disposition) {
        headers.insert(header::CONTENT_DISPOSITION, value);
    }
    response
}

// ── the seven sections of the filtered view ─────────────────────────────────

/// Build the Приложение-1 seven-table document for one filter set and scope.
async fn build_document(
    state: &AppState,
    filters: &Filters,
    scope: Scope,
    policy: KPolicy,
    locale: Locale,
) -> Result<ReportDoc, ApiError> {
    let strings = locale.strings();
    let threshold = db::settings::originality_threshold(&state.db).await?;

    let summary = db::q::summary(&state.db, filters, scope).await?;
    let coverage = db::q::coverage(&state.db, filters, scope).await?;
    let work_types = db::q::work_types(&state.db, filters, scope).await?;
    let histogram = db::q::histogram(&state.db, filters, scope).await?;
    let units = db::q::units(&state.db, filters, scope, db::q::UnitDepth::Faculty).await?;
    let rechecks = db::q::rechecks(&state.db, filters, scope).await?;
    let escalations = db::q::escalations(&state.db, filters, scope).await?;
    let usage = db::q::usage(&state.db, filters, scope).await?;

    let sections = vec![
        summary_section(strings, &policy, &summary, &coverage, threshold),
        work_types_section(strings, &policy, &summary, &work_types)?,
        buckets_section(strings, &policy, &histogram)?,
        faculties_section(strings, &policy, &summary, &units)?,
        rechecks_section(strings, &policy, &rechecks),
        escalations_section(strings, &policy, &summary, &escalations),
        usage_section(strings, &policy, &summary, &usage),
    ];

    let period = filters.period();
    Ok(ReportDoc {
        title: Label::phrase(strings.report_title),
        subtitle: Label::phrase(strings.report_subtitle),
        period: Label::range(strings.period_range, period.start(), period.end()),
        // The export is a live view, so its date is today in the university's
        // calendar rather than an injected instant: unlike a snapshot, nothing
        // downstream hashes these bytes.
        generated_note: Label::date(strings.generated_on, crate::query::today()),
        sections,
        locale,
    })
}

// ── the public export: the four closure sections ────────────────────────────

/// Build the public document from the released cube (ADR-016 §2).
///
/// Every number below is a sum over cells that hold at least `k` checks, and
/// every average is `Σ hundredths ÷ n` rounded exactly once - the same
/// arithmetic the JSON endpoints do, from the same cube, so the file and the
/// dashboard cannot disagree.
async fn build_public_document(
    state: &AppState,
    filters: &Filters,
    policy: KPolicy,
    locale: Locale,
) -> Result<ReportDoc, ApiError> {
    let strings = locale.strings();
    let threshold = db::settings::originality_threshold(&state.db).await?;
    let boundaries = db::settings::histogram_buckets(&state.db).await?;
    let cube = db::q::public_cube(&state.db, filters, Scope::All, policy).await?;
    let total = cube.total();

    let kpis = crate::routes::public::closure_kpis(state, filters, &cube, threshold).await?;
    let coverage = crate::routes::public::closure_coverage(state, filters, &cube).await?;
    let bands = if boundaries == domain::BucketBoundaries::default() {
        total.buckets
    } else {
        db::q::released_buckets(&state.db, filters, Scope::All, &cube, boundaries).await?
    };

    let work_type_rows = labelled_groups(cube.by_work_type(), |code| strings.work_type(code))?;
    let faculty_rows = labelled_groups(cube.by_faculty(), |code| strings.unit(code))?;

    // The faculty sheet carries the same mapping footnote the dashboard shows
    // under this table: how the breakdown was attributed (or, while every row
    // is the sentinel, what is missing) - `reports::annual` does the same.
    let mapped = faculty_rows
        .iter()
        .any(|(code, _, _)| code != UNASSIGNED_UNIT);
    let mut faculties_breakdown = closure_breakdown_section(
        strings,
        &policy,
        Label::phrase(strings.section_faculties),
        Label::phrase(strings.sheet_faculties),
        Label::phrase(strings.column_faculty),
        faculty_rows,
        &total,
    );
    faculties_breakdown.footnotes.insert(
        1,
        Label::phrase(if mapped {
            strings.note_units_current_mapping
        } else {
            strings.note_units_pending_mapping
        }),
    );

    let sections = vec![
        public_summary_section(strings, &policy, &kpis, coverage, threshold),
        closure_breakdown_section(
            strings,
            &policy,
            Label::phrase(strings.section_work_types),
            Label::phrase(strings.sheet_work_types),
            Label::phrase(strings.column_work_type),
            work_type_rows,
            &total,
        ),
        public_bands_section(strings, &policy, &bands, &total),
        faculties_breakdown,
    ];

    let period = filters.period();
    Ok(ReportDoc {
        title: Label::phrase(strings.report_title),
        subtitle: Label::phrase(strings.report_subtitle),
        period: Label::range(strings.period_range, period.start(), period.end()),
        generated_note: Label::date(strings.generated_on, crate::query::today()),
        sections,
        locale,
    })
}

/// Attach a localized label to each rolled-up group, keeping the cube's order
/// and the dictionary code (the faculty footnote keys off it).
fn labelled_groups(
    groups: Vec<(String, db::q::CubeGroup)>,
    known: impl Fn(&str) -> Option<&'static str>,
) -> Result<Vec<(String, Label, db::q::CubeGroup)>, ApiError> {
    groups
        .into_iter()
        .map(|(code, group)| {
            let label = dictionary_label(known(&code), &code)?;
            Ok((code, label, group))
        })
        .collect()
}

/// The overview table of the public export, screened against the released
/// total rather than against each metric's own numerator (ADR-016 §2).
fn public_summary_section(
    strings: &'static Strings,
    policy: &KPolicy,
    kpis: &crate::routes::public::ClosureKpis,
    coverage: Option<(i64, i64)>,
    threshold: domain::OriginalityPct,
) -> ReportSection {
    let group = observations(kpis.checks);
    let mut rows = vec![
        metric_row(
            Label::phrase(strings.metric_checks_total),
            Metric::count(policy, group, kpis.checks),
        ),
        metric_row(
            Label::phrase(strings.metric_avg_originality),
            Metric::percent(
                policy,
                group,
                (kpis.checks > 0)
                    .then(|| crate::dto::mean4(kpis.sum_originality_hundredths, kpis.checks)),
            ),
        ),
        metric_row(
            Label::percent(strings.metric_below_threshold, threshold.hundredths()),
            Metric::share(
                policy,
                group,
                (kpis.checks > 0).then(|| crate::dto::ratio4(kpis.below_threshold, kpis.checks)),
            ),
        ),
        metric_row(
            Label::phrase(strings.metric_escalated),
            Metric::count(policy, group, kpis.escalated),
        ),
    ];

    let mut footnotes = vec![k_note(strings, policy)];
    match coverage {
        None => footnotes.push(Label::phrase(strings.note_coverage_missing)),
        Some((checks, submitted)) => rows.push(metric_row(
            Label::phrase(strings.metric_coverage),
            Metric::share(
                policy,
                observations(checks),
                Some(crate::dto::ratio4(checks, submitted)),
            ),
        )),
    }

    ReportSection {
        title: Label::phrase(strings.section_summary),
        short_title: Label::phrase(strings.sheet_summary),
        table: ReportTable {
            columns: metric_columns(strings),
            rows,
        },
        footnotes,
    }
}

/// A count-and-mean table over released groups. No complementary pass: the
/// total is the sum of exactly the rows above it.
fn closure_breakdown_section(
    strings: &'static Strings,
    policy: &KPolicy,
    title: Label,
    short_title: Label,
    first_column: Label,
    rows: Vec<(String, Label, db::q::CubeGroup)>,
    total: &db::q::CubeGroup,
) -> ReportSection {
    let unassigned = rows.iter().any(|(code, _, _)| code == UNASSIGNED_UNIT);
    let mut table_rows: Vec<Row> = rows
        .into_iter()
        .map(|(_, label, group)| {
            Row::data(vec![
                Cell::Label(label),
                Cell::Metric(Metric::count(policy, group.observations(), group.checks)),
                Cell::Metric(Metric::percent(
                    policy,
                    group.observations(),
                    (group.checks > 0)
                        .then(|| crate::dto::mean4(group.sum_originality_hundredths, group.checks)),
                )),
            ])
        })
        .collect();
    table_rows.push(Row::total(vec![
        Cell::Label(Label::phrase(strings.total)),
        Cell::Metric(Metric::count(policy, total.observations(), total.checks)),
        Cell::Metric(Metric::percent(
            policy,
            total.observations(),
            (total.checks > 0)
                .then(|| crate::dto::mean4(total.sum_originality_hundredths, total.checks)),
        )),
    ]));

    let mut footnotes = vec![k_note(strings, policy)];
    if unassigned {
        footnotes.push(Label::phrase(strings.note_unassigned_unit));
    }

    ReportSection {
        title,
        short_title,
        table: ReportTable {
            columns: vec![
                Column::text(first_column),
                Column::numeric(Label::phrase(strings.column_checks)),
                Column::numeric(Label::phrase(strings.column_avg_originality)),
            ],
            rows: table_rows,
        },
        footnotes,
    }
}

/// TZ §4.2 §5 over the released cube: the bands are the distribution inside one
/// released group, so they are published with it and sum to its total.
fn public_bands_section(
    strings: &'static Strings,
    policy: &KPolicy,
    bands: &[i64; 5],
    total: &db::q::CubeGroup,
) -> ReportSection {
    let group = total.observations();
    let mut rows: Vec<Row> = strings
        .buckets()
        .into_iter()
        .zip(bands)
        .map(|(band, count)| {
            Row::data(vec![
                Cell::Label(Label::phrase(band)),
                Cell::Metric(Metric::count(policy, group, *count)),
                Cell::Metric(Metric::share(
                    policy,
                    group,
                    (total.checks > 0).then(|| crate::dto::ratio4(*count, total.checks)),
                )),
            ])
        })
        .collect();
    rows.push(Row::total(vec![
        Cell::Label(Label::phrase(strings.total)),
        Cell::Metric(Metric::count(policy, group, total.checks)),
        Cell::Metric(Metric::share(
            policy,
            group,
            (total.checks > 0).then_some(1.0),
        )),
    ]));

    ReportSection {
        title: Label::phrase(strings.section_buckets),
        short_title: Label::phrase(strings.sheet_buckets),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_bucket)),
                Column::numeric(Label::phrase(strings.column_checks)),
                Column::numeric(Label::phrase(strings.column_share)),
            ],
            rows,
        },
        footnotes: vec![k_note(strings, policy)],
    }
}

fn k_note(strings: &'static Strings, policy: &KPolicy) -> Label {
    Label::number(
        strings.note_k_anonymity,
        i64::from(policy.threshold().get()),
    )
}

fn observations(count: i64) -> u64 {
    u64::try_from(count).unwrap_or(0)
}

fn metric_row(label: Label, value: Metric) -> Row {
    Row::data(vec![Cell::Label(label), Cell::Metric(value)])
}

fn metric_columns(strings: &'static Strings) -> Vec<Column> {
    vec![
        Column::text(Label::phrase(strings.column_metric)),
        Column::numeric(Label::phrase(strings.column_value)),
    ]
}

/// Screen a section's counts and means as one table, against one shared
/// observation vector, so a row never shows a mean beside a hidden count.
fn screen_pair(
    policy: &KPolicy,
    rows: &[(u64, i64, Option<f64>)],
    total_count: i64,
    total_mean: Option<f64>,
) -> Result<(ScreenedTable<i64>, ScreenedTable<Option<f64>>), ApiError> {
    let counts = suppress_table(
        policy,
        total_count,
        rows.iter()
            .map(|(observed, count, _)| AggregateCell::new(*observed, *count))
            .collect(),
    )?;
    let means = suppress_table(
        policy,
        total_mean,
        rows.iter()
            .map(|(observed, _, mean)| AggregateCell::new(*observed, *mean))
            .collect(),
    )?;
    Ok((counts, means))
}

fn count_and_mean_table(
    strings: &'static Strings,
    first_column: Label,
    labels: Vec<Label>,
    counts: &ScreenedTable<i64>,
    means: &ScreenedTable<Option<f64>>,
) -> ReportTable {
    let mut rows: Vec<Row> = labels
        .into_iter()
        .zip(counts.cells().iter().zip(means.cells()))
        .map(|(label, (count, mean))| {
            Row::data(vec![
                Cell::Label(label),
                Cell::Metric(Metric::screened_count(*count)),
                Cell::Metric(Metric::screened_percent(*mean)),
            ])
        })
        .collect();
    rows.push(Row::total(vec![
        Cell::Label(Label::phrase(strings.total)),
        Cell::Metric(Metric::screened_count(*counts.total())),
        Cell::Metric(Metric::screened_percent(*means.total())),
    ]));

    ReportTable {
        columns: vec![
            Column::text(first_column),
            Column::numeric(Label::phrase(strings.column_checks)),
            Column::numeric(Label::phrase(strings.column_avg_originality)),
        ],
        rows,
    }
}

fn summary_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &db::q::SummaryRow,
    coverage: &[db::q::CoverageRow],
    threshold: domain::OriginalityPct,
) -> ReportSection {
    let observed = observations(summary.checks);
    let mut rows = vec![
        metric_row(
            Label::phrase(strings.metric_checks_total),
            Metric::count(policy, observed, summary.checks),
        ),
        metric_row(
            Label::phrase(strings.metric_avg_originality),
            Metric::percent(policy, observed, summary.avg_originality()),
        ),
        metric_row(
            Label::percent(strings.metric_below_threshold, threshold.hundredths()),
            Metric::share(policy, observed, summary.below_threshold_share()),
        ),
        metric_row(
            Label::phrase(strings.metric_escalated),
            Metric::count(policy, observations(summary.escalated), summary.escalated),
        ),
    ];

    let mut footnotes = vec![k_note(strings, policy)];
    if coverage.is_empty() {
        footnotes.push(Label::phrase(strings.note_coverage_missing));
    } else {
        let checks: i64 = coverage.iter().map(|row| row.checks).sum();
        let submitted: i64 = coverage
            .iter()
            .map(|row| i64::from(row.total_submitted))
            .sum();
        #[expect(
            clippy::cast_precision_loss,
            reason = "counts are bounded by the fact table size"
        )]
        let share = (submitted > 0).then(|| checks as f64 / submitted as f64);
        rows.push(metric_row(
            Label::phrase(strings.metric_coverage),
            Metric::share(policy, observed, share),
        ));
    }

    ReportSection {
        title: Label::phrase(strings.section_summary),
        short_title: Label::phrase(strings.sheet_summary),
        table: ReportTable {
            columns: metric_columns(strings),
            rows,
        },
        footnotes,
    }
}

fn work_types_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &db::q::SummaryRow,
    work_types: &[db::q::WorkTypeRow],
) -> Result<ReportSection, ApiError> {
    let cells: Vec<(u64, i64, Option<f64>)> = work_types
        .iter()
        .map(|row| (observations(row.checks), row.checks, row.avg_originality()))
        .collect();
    let labels = work_types
        .iter()
        .map(|row| dictionary_label(strings.work_type(&row.code), &row.code))
        .collect::<Result<Vec<_>, _>>()?;
    let (counts, means) = screen_pair(policy, &cells, summary.checks, summary.avg_originality())?;

    Ok(ReportSection {
        title: Label::phrase(strings.section_work_types),
        short_title: Label::phrase(strings.sheet_work_types),
        table: count_and_mean_table(
            strings,
            Label::phrase(strings.column_work_type),
            labels,
            &counts,
            &means,
        ),
        footnotes: vec![k_note(strings, policy)],
    })
}

fn buckets_section(
    strings: &'static Strings,
    policy: &KPolicy,
    histogram: &db::q::HistogramRow,
) -> Result<ReportSection, ApiError> {
    let total = histogram.total();
    let counts = suppress_table(
        policy,
        total,
        histogram
            .counts()
            .into_iter()
            .map(|count| AggregateCell::new(observations(count), count))
            .collect(),
    )?;
    #[expect(
        clippy::cast_precision_loss,
        reason = "band counts are bounded by the fact table size"
    )]
    let share = |count: i64| (total > 0).then(|| count as f64 / total as f64);
    let shares = suppress_table(
        policy,
        share(total),
        histogram
            .counts()
            .into_iter()
            .map(|count| AggregateCell::new(observations(count), share(count)))
            .collect(),
    )?;

    let mut rows: Vec<Row> = strings
        .buckets()
        .into_iter()
        .zip(counts.cells().iter().zip(shares.cells()))
        .map(|(band, (count, share))| {
            Row::data(vec![
                Cell::Label(Label::phrase(band)),
                Cell::Metric(Metric::screened_count(*count)),
                Cell::Metric(Metric::screened_share(*share)),
            ])
        })
        .collect();
    rows.push(Row::total(vec![
        Cell::Label(Label::phrase(strings.total)),
        Cell::Metric(Metric::screened_count(*counts.total())),
        Cell::Metric(Metric::screened_share(*shares.total())),
    ]));

    Ok(ReportSection {
        title: Label::phrase(strings.section_buckets),
        short_title: Label::phrase(strings.sheet_buckets),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_bucket)),
                Column::numeric(Label::phrase(strings.column_checks)),
                Column::numeric(Label::phrase(strings.column_share)),
            ],
            rows,
        },
        footnotes: vec![k_note(strings, policy)],
    })
}

/// Faculty grain, in both contours.
///
/// The internal contour's department drill-down lives on
/// `/api/internal/departments-matrix`; the printed form of TZ §4.5 has one
/// «по факультетам» table, and the locale tables carry a faculty column header
/// and no department one - printing department codes under «Факультет» would be
/// a mislabelled table.
fn faculties_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &db::q::SummaryRow,
    units: &[db::q::UnitRow],
) -> Result<ReportSection, ApiError> {
    let cells: Vec<(u64, i64, Option<f64>)> = units
        .iter()
        .map(|row| (observations(row.checks), row.checks, row.avg_originality()))
        .collect();
    let labels = units
        .iter()
        .map(|row| dictionary_label(strings.unit(&row.faculty_code), &row.faculty_code))
        .collect::<Result<Vec<_>, _>>()?;
    let (counts, means) = screen_pair(policy, &cells, summary.checks, summary.avg_originality())?;

    let mut footnotes = vec![
        k_note(strings, policy),
        Label::phrase(strings.note_units_current_mapping),
    ];
    if units.iter().any(|row| row.faculty_code == UNASSIGNED_UNIT) {
        footnotes.push(Label::phrase(strings.note_unassigned_unit));
    }

    Ok(ReportSection {
        title: Label::phrase(strings.section_faculties),
        short_title: Label::phrase(strings.sheet_faculties),
        table: count_and_mean_table(
            strings,
            Label::phrase(strings.column_faculty),
            labels,
            &counts,
            &means,
        ),
        footnotes,
    })
}

fn rechecks_section(
    strings: &'static Strings,
    policy: &KPolicy,
    rechecks: &db::q::RechecksRow,
) -> ReportSection {
    let works = observations(rechecks.works_total);
    let rechecked = observations(rechecks.works_rechecked);
    #[expect(
        clippy::cast_precision_loss,
        reason = "distinct-work counts are bounded by the fact table size"
    )]
    let ratio = |numerator: i64, denominator: i64| {
        (denominator > 0).then(|| numerator as f64 / denominator as f64)
    };

    ReportSection {
        title: Label::phrase(strings.section_rechecks),
        short_title: Label::phrase(strings.sheet_rechecks),
        table: ReportTable {
            columns: metric_columns(strings),
            rows: vec![
                metric_row(
                    Label::phrase(strings.metric_works_total),
                    Metric::count(policy, works, rechecks.works_total),
                ),
                metric_row(
                    Label::phrase(strings.metric_works_rechecked),
                    Metric::count(policy, rechecked, rechecks.works_rechecked),
                ),
                metric_row(
                    Label::phrase(strings.metric_recheck_share),
                    Metric::share(
                        policy,
                        works,
                        ratio(rechecks.works_rechecked, rechecks.works_total),
                    ),
                ),
                metric_row(
                    Label::phrase(strings.metric_improved_share),
                    Metric::share(
                        policy,
                        rechecked,
                        ratio(rechecks.improved, rechecks.works_rechecked),
                    ),
                ),
            ],
        },
        footnotes: vec![k_note(strings, policy)],
    }
}

fn escalations_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &db::q::SummaryRow,
    escalations: &db::q::EscalationsRow,
) -> ReportSection {
    let observed = observations(summary.checks);
    let mut rows = vec![Row::data(vec![
        Cell::Label(Label::phrase(strings.metric_escalated_checks)),
        Cell::Metric(Metric::count(
            policy,
            observations(escalations.checks_escalated),
            escalations.checks_escalated,
        )),
        Cell::Metric(Metric::absent(policy, observed)),
    ])];

    for case in &escalations.ethics_cases {
        let referred = i64::from(case.referred);
        let group = observations(referred);
        rows.push(Row::data(vec![
            // An Ethics Council category is admin-entered free text; it reaches
            // a report only if it is code-shaped (AGENTS.md invariant #1).
            Cell::Label(
                Label::code(&case.category)
                    .unwrap_or_else(|_| Label::phrase(strings.category_other)),
            ),
            Cell::Metric(Metric::count(policy, group, referred)),
            Cell::Metric(Metric::count(
                policy,
                group,
                i64::from(case.reviewed_closed),
            )),
        ]));
    }

    ReportSection {
        title: Label::phrase(strings.section_escalations),
        short_title: Label::phrase(strings.sheet_escalations),
        table: ReportTable {
            columns: vec![
                Column::text(Label::phrase(strings.column_category)),
                Column::numeric(Label::phrase(strings.column_referred)),
                Column::numeric(Label::phrase(strings.column_reviewed)),
            ],
            rows,
        },
        footnotes: vec![
            k_note(strings, policy),
            Label::phrase(strings.note_ethics_separate),
        ],
    }
}

fn usage_section(
    strings: &'static Strings,
    policy: &KPolicy,
    summary: &db::q::SummaryRow,
    usage: &[db::q::UsagePoint],
) -> ReportSection {
    let months = i64::try_from(usage.len()).unwrap_or(i64::MAX);
    let reviewers: Vec<i64> = usage.iter().map(|point| point.active_reviewers).collect();
    let peak = reviewers.iter().copied().max();
    let mean = (months > 0).then(|| (reviewers.iter().sum::<i64>() + months / 2) / months);
    let smallest = observations(reviewers.iter().copied().min().unwrap_or(0));

    let durations: Vec<i64> = usage
        .iter()
        .filter_map(|point| point.avg_check_seconds.map(i64::from))
        .collect();
    let sampled = i64::try_from(durations.len()).unwrap_or(i64::MAX);
    let duration = (sampled > 0).then(|| (durations.iter().sum::<i64>() + sampled / 2) / sampled);

    let rows = vec![
        metric_row(
            Label::phrase(strings.metric_active_reviewers_avg),
            match mean {
                Some(mean) => Metric::count(policy, smallest, mean),
                None => Metric::absent(policy, observations(summary.checks)),
            },
        ),
        metric_row(
            Label::phrase(strings.metric_active_reviewers_max),
            match peak {
                Some(peak) => Metric::count(policy, observations(peak), peak),
                None => Metric::absent(policy, observations(summary.checks)),
            },
        ),
        metric_row(
            Label::phrase(strings.metric_avg_check_seconds),
            Metric::seconds(policy, observations(summary.checks), duration),
        ),
    ];

    let mut footnotes = vec![k_note(strings, policy)];
    if duration.is_none() {
        footnotes.push(Label::phrase(strings.note_no_duration));
    }

    ReportSection {
        title: Label::phrase(strings.section_usage),
        short_title: Label::phrase(strings.sheet_usage),
        table: ReportTable {
            columns: metric_columns(strings),
            rows,
        },
        footnotes,
    }
}

/// A localized dictionary name when this build knows the code, the code itself
/// otherwise. Never an invented name, and never free text.
fn dictionary_label(known: Option<&'static str>, code: &str) -> Result<Label, ApiError> {
    match known {
        Some(phrase) => Ok(Label::phrase(phrase)),
        None => Label::code(code).map_err(|error| {
            tracing::error!(%error, "a dictionary code is not usable as a report label");
            ApiError::Internal("a dictionary code is not usable as a report label")
        }),
    }
}

// ── shared formatting ───────────────────────────────────────────────────────

/// `time::Date` as ISO 8601. Spelled out rather than relying on the driver's
/// `Display`, which is feature-gated.
#[must_use]
pub fn format_date(date: sqlx::types::time::Date) -> String {
    let (year, month, day) = date.to_calendar_date();
    format!("{year:04}-{:02}-{day:02}", u8::from(month))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn each_format_carries_its_media_type_and_audit_action() {
        assert_eq!(ExportFormat::Pdf.content_type(), PDF_CONTENT_TYPE);
        assert_eq!(ExportFormat::Xlsx.content_type(), XLSX_CONTENT_TYPE);
        assert_eq!(ExportFormat::Pdf.audit_action(), "export_pdf");
        assert_eq!(ExportFormat::Xlsx.audit_action(), "export_xlsx");
    }

    #[test]
    fn only_the_five_scoped_roles_may_export_internally() {
        assert!(!EXPORT_ROLES.contains(&domain::RoleKind::Staff));
        assert_eq!(EXPORT_ROLES.len(), 5);
    }

    #[tokio::test]
    async fn a_snapshot_path_cannot_escape_the_reports_directory() {
        let root = std::env::temp_dir();
        for hostile in ["../secret.pdf", "a/../../secret.pdf", "/etc/passwd"] {
            let error = read_snapshot(&root, hostile)
                .await
                .expect_err("traversal must be refused");
            assert!(matches!(error, ApiError::NotFound), "{hostile}");
        }
    }

    #[test]
    fn the_default_export_locale_is_russian() {
        let options = ExportOptions {
            format: ExportFormat::Pdf,
            locale: None,
        };
        assert_eq!(options.locale(), Locale::Ru);
    }
}
