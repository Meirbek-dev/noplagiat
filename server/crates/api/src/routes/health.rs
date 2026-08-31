//! Operational endpoints: liveness, readiness and the Prometheus scrape
//! (ARCHITECTURE.md §8, slice W4.5).
//!
//! All three are mounted **outside** every layer - no session, no rate limit,
//! no audit row. A probe that needed a cookie would not be a probe, and a
//! scrape that wrote an audit row would fill the journal with non-events.
//!
//! # Exposure
//!
//! Nothing here carries identity or an unscreened aggregate. `deploy/nginx.conf`
//! proxies all three paths today; the scrape in particular should be narrowed
//! to the monitoring network at the gateway before production - see the
//! operational note on [`crate::metrics`].

use axum::extract::State;
use axum::http::{HeaderValue, StatusCode, header};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use serde::Serialize;

use crate::metrics::IngestGauges;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(readyz))
        .route("/metrics", get(metrics))
}

#[derive(Serialize, utoipa::ToSchema)]
pub struct Health {
    /// `ok`, `ready`, `db_unreachable` or `ingest_stale`.
    pub status: &'static str,
    /// Seconds since the newest succeeded ingest batch. `null` when the
    /// warehouse has never been fed - a fresh install, not a stale one.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ingest_age_seconds: Option<i64>,
    /// The freshness budget this deployment enforces.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ingest_max_age_seconds: Option<i64>,
}

impl Health {
    fn plain(status: &'static str) -> Self {
        Self {
            status,
            ingest_age_seconds: None,
            ingest_max_age_seconds: None,
        }
    }
}

/// Liveness: the process is up.
#[utoipa::path(get, path = "/healthz", tag = "ops", responses((status = 200, body = Health)))]
pub async fn healthz() -> Json<Health> {
    Json(Health::plain("ok"))
}

/// Readiness: the database answers **and** the warehouse is fresh.
///
/// TZ §3.3.3 requires an internal refresh at least once a day, so a warehouse
/// whose newest succeeded ingest batch is older than
/// `APP_INGEST_MAX_AGE_SECONDS` (26 h by default - the nightly 02:00 tick plus
/// two hours of slack) is **degraded**: it still serves, but it is not ready to
/// take traffic in a rotation.
///
/// A warehouse with **no succeeded batch at all** is ready. That is a fresh
/// install or a fixture database; reporting it as stale would keep a brand-new
/// deployment permanently out of its own load balancer, and "never imported" is
/// a condition the ingest metrics show plainly (`ingest_batches_total 0`).
#[utoipa::path(get, path = "/readyz", tag = "ops", responses(
    (status = 200, body = Health),
    (status = 503, body = Health, description = "database unreachable, or the newest ingest batch is stale"),
))]
pub async fn readyz(State(state): State<AppState>) -> (StatusCode, Json<Health>) {
    if let Err(error) = db::ping(&state.db).await {
        tracing::warn!(error = %error, "readiness probe failed");
        return (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(Health::plain("db_unreachable")),
        );
    }

    let age = match ingest_age(&state).await {
        Ok(age) => age,
        Err(error) => {
            tracing::warn!(error = %error, "ingest freshness could not be read");
            return (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(Health::plain("db_unreachable")),
            );
        }
    };

    let budget = state.config.ingest_max_age_seconds;
    let stale = age.is_some_and(|age| age > budget);
    let body = Health {
        status: if stale { "ingest_stale" } else { "ready" },
        ingest_age_seconds: age,
        ingest_max_age_seconds: Some(budget),
    };
    let status = if stale {
        StatusCode::SERVICE_UNAVAILABLE
    } else {
        StatusCode::OK
    };
    (status, Json(body))
}

/// Seconds since the newest succeeded batch, or `None` when there is none.
async fn ingest_age(state: &AppState) -> Result<Option<i64>, db::DbError> {
    let Some(finished) = db::batches::last_succeeded_at(&state.db).await? else {
        return Ok(None);
    };
    let now = jiff::Timestamp::now().as_second();
    Ok(Some((now - finished.unix_timestamp()).max(0)))
}

/// Prometheus text exposition (version 0.0.4).
///
/// Not annotated as a contract path on purpose: the body is not JSON, and the
/// generated frontend client has no business calling it.
pub async fn metrics(State(state): State<AppState>) -> Response {
    let gauges = match db::batches::totals(&state.db).await {
        Ok(totals) => IngestGauges {
            batches: totals.batches,
            rows_rejected: totals.rows_rejected,
            rows_upserted: totals.rows_upserted,
            last_success_age_seconds: ingest_age(&state).await.ok().flatten().unwrap_or(-1),
        },
        Err(error) => {
            // A scrape must not fail because one gauge is unavailable: the
            // process counters are the ones that matter during an incident.
            tracing::warn!(error = %error, "ingest gauges unavailable for this scrape");
            IngestGauges::default()
        }
    };

    let mut response = state.metrics.render(&gauges).into_response();
    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("text/plain; version=0.0.4; charset=utf-8"),
    );
    response
}
