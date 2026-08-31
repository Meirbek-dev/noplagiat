//! HTTP edge: Axum router, middleware topology, error mapping, OpenAPI.
//!
//! See ARCHITECTURE.md §4.2 for the layer order, §4.3 for the k-anonymity
//! contract, and §4.6 for the contract-generation rule: `contracts/openapi.json`
//! is generated from this crate and never edited (AGENTS.md invariant #5).

pub mod auth;
pub mod dto;
pub mod error;
pub mod layers;
pub mod metrics;
pub mod query;
pub mod rbac;
pub mod routes;
pub mod state;

use axum::Router;
use axum::middleware::{from_fn, from_fn_with_state};
use tower_http::trace::TraceLayer;
use utoipa::OpenApi;
use utoipa::openapi::security::{ApiKey, ApiKeyValue, SecurityScheme};

pub use error::{ApiError, Problem};
pub use state::{AppConfig, AppState, AuthMode, Screening};

/// Build the full application router.
///
/// Each contour gets its own layer stack; nothing is shared but the trace span,
/// the metrics timer and the RFC 7807 `instance` filler, because a layer that
/// runs on the wrong contour is exactly how a compliance control gets bypassed.
/// In particular the `KAnonymityGuard` is mounted on the **JSON** routes of
/// `/api/public` only - it is what makes an unscreened public response
/// impossible, it has nothing to say about authenticated scope-filtered
/// internal data, and it cannot inspect a PDF (ADR-014 §5).
pub fn build_router(state: AppState) -> Router {
    // Public JSON: screened aggregates, cacheable, guarded.
    let public_json = routes::public::router()
        // Inside the guard, which strips the witness on its way out.
        .layer(from_fn_with_state(
            state.clone(),
            layers::kanon::count_screened,
        ))
        .layer(from_fn(layers::kanon::guard))
        .layer(from_fn(layers::cache::cache_and_etag));
    // Public files: exports and published snapshots. Screened by construction
    // in the document model, not by the response guard.
    let public = layers::security::public(
        public_json
            .merge(routes::export::public_router())
            .layer(from_fn_with_state(state.clone(), layers::rate_limit::limit)),
        // The portal origin pin of TZ §8, configured rather than compiled in
        // (ADR-012 §9).
        &state.config.embed_frame_ancestors,
    );

    let internal = layers::security::private(
        routes::internal::router()
            .layer(from_fn_with_state(state.clone(), layers::audit::record))
            .layer(from_fn(layers::csrf::protect))
            // The registry's `allowed` column, in the slot `require_admin`
            // occupies on the admin contour: before the audit layer, so a
            // refusal is not journalled as a section view (ADR-014 §7).
            .layer(from_fn(rbac::require_section_role))
            .layer(from_fn(layers::session::require_internal_access))
            .layer(from_fn_with_state(
                state.clone(),
                layers::session::session_auth,
            )),
    );

    let admin = layers::security::private(
        routes::admin::router()
            .layer(from_fn_with_state(state.clone(), layers::audit::record))
            .layer(from_fn(layers::csrf::protect))
            .layer(from_fn(layers::session::require_admin))
            .layer(from_fn(layers::session::require_internal_access))
            .layer(from_fn_with_state(
                state.clone(),
                layers::session::session_auth,
            )),
    );

    let auth = layers::security::private(routes::auth::router(&state));

    Router::new()
        .merge(routes::health::router())
        .nest("/api/public", public)
        .nest("/api/internal", internal)
        .nest("/api/admin", admin)
        .nest("/api/auth", auth)
        .fallback(error::not_found)
        .method_not_allowed_fallback(error::method_not_allowed)
        .layer(from_fn(layers::problem::fill_instance))
        // Innermost of the two metrics layers: copies the matched route onto
        // the response so the timer above can label the observation with it.
        .layer(from_fn(layers::metrics::tag_route))
        .layer(from_fn_with_state(state.clone(), layers::metrics::record))
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

/// OpenAPI document - the single source of truth for the frontend client.
/// Regenerate `contracts/openapi.json` with `cargo run --bin export-openapi`.
#[derive(OpenApi)]
#[openapi(
    info(
        title = "noplagiat-analytics API",
        description = "Antiplagiarism analytics dashboard - Toraighyrov University",
        version = env!("CARGO_PKG_VERSION"),
    ),
    tags(
        (name = "public", description = "Public contour - anonymized aggregates, k-anonymity screened (TZ §4.1)"),
        (name = "internal", description = "Internal contour - SSO session, RBAC scope, audit logged (TZ §5)"),
        (name = "admin", description = "Administrative area - requires the admin role (TZ §4.6)"),
        (name = "auth", description = "Session lifecycle"),
        (name = "ops", description = "Liveness and readiness probes"),
    ),
    modifiers(&SessionCookieScheme),
    paths(
        routes::health::healthz,
        routes::health::readyz,
        routes::public::summary,
        routes::public::timeseries,
        routes::public::work_types,
        routes::public::faculties,
        routes::public::histogram,
        routes::public::yoy,
        routes::public::reports,
        routes::public::status,
        routes::export::public_export,
        routes::export::download,
        routes::internal::ping,
        routes::internal::summary,
        routes::internal::timeseries,
        routes::internal::work_types,
        routes::internal::histogram,
        routes::internal::yoy,
        routes::internal::departments_matrix,
        routes::internal::rechecks,
        routes::internal::escalations,
        routes::internal::usage,
        routes::export::internal_export,
        routes::admin::ping,
        routes::admin::settings,
        routes::admin::update_settings,
        routes::admin::list_dictionary,
        routes::admin::upsert_dictionary,
        routes::admin::delete_dictionary,
        routes::admin::list_aliases,
        routes::admin::upsert_alias,
        routes::admin::delete_alias,
        routes::admin::list_roles,
        routes::admin::grant_role,
        routes::admin::revoke_role,
        routes::admin::list_staff_units,
        routes::admin::upsert_staff_unit,
        routes::admin::delete_staff_unit,
        routes::admin::list_work_type_rules,
        routes::admin::create_work_type_rule,
        routes::admin::update_work_type_rule,
        routes::admin::delete_work_type_rule,
        routes::admin::list_initiator_rules,
        routes::admin::create_initiator_rule,
        routes::admin::update_initiator_rule,
        routes::admin::delete_initiator_rule,
        routes::admin::list_sources,
        routes::admin::create_source,
        routes::admin::update_source,
        routes::admin::delete_source,
        routes::admin::run_ingest,
        routes::admin::list_batches,
        routes::admin::get_batch,
        routes::admin::list_ethics,
        routes::admin::create_ethics,
        routes::admin::update_ethics,
        routes::admin::delete_ethics,
        routes::admin::list_submission_totals,
        routes::admin::upsert_submission_total,
        routes::admin::delete_submission_total,
        routes::admin::list_usage_stats,
        routes::admin::upsert_usage_stat,
        routes::admin::delete_usage_stat,
        routes::admin::list_reports,
        routes::admin::generate_report,
        routes::admin::publish_report,
        routes::admin::unpublish_report,
        routes::admin::audit,
        routes::auth::login,
        routes::auth::callback,
        routes::auth::dev_login,
        routes::auth::logout,
        routes::auth::me,
    ),
    components(schemas(
        error::Problem,
        error::FieldError,
        dto::SuppressedMarker,
        dto::ScreenedInt,
        dto::ScreenedFloat,
        dto::PeriodDto,
        dto::MetricPair,
        dto::SummaryResponse,
        dto::PreviousPeriodDto,
        dto::SummaryDeltaDto,
        dto::TimeseriesResponse,
        dto::TimeseriesPointDto,
        dto::BreakdownResponse,
        dto::BreakdownItemDto,
        dto::HistogramResponse,
        dto::HistogramBucketDto,
        dto::YoyResponse,
        dto::YoyYearDto,
        dto::ReportsResponse,
        dto::ReportSnapshotDto,
        dto::ReportFileDto,
        dto::ScopeDto,
        dto::RoleGrantDto,
        auth::mapping::RoleMapping,
        query::PublicFilterQuery,
        query::InternalFilterQuery,
    ))
)]
pub struct ApiDoc;

/// The session cookie, described so the generated client knows the internal
/// contour is credentialed.
struct SessionCookieScheme;

impl utoipa::Modify for SessionCookieScheme {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_with(Default::default);
        components.add_security_scheme(
            "session_cookie",
            SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::with_description(
                auth::SESSION_COOKIE,
                "Opaque session id, HttpOnly + Secure + SameSite=Lax",
            ))),
        );
    }
}

pub fn openapi_json() -> Result<String, serde_json::Error> {
    ApiDoc::openapi().to_pretty_json()
}
