//! The nightly ingest task (ADR-005: in-process, advisory-locked).
//!
//! One deployable, one log stream. The advisory lock in [`crate::store`] makes
//! the schedule safe under horizontal scaling - several runners may tick at the
//! same minute; only one writes.

use std::time::Duration;

use sqlx::PgPool;

use crate::api::{self, DEFAULT_PAGE_LIMIT, RestSourceApi, SOURCE_TOKEN_ENV};
use crate::error::{ConfigError, IngestError};
use crate::pipeline::{self, BatchSummary};
use crate::refs::Pepper;
use crate::row::SOURCE_OFFSET_HOURS;
use crate::store::{self, SourceRow};

/// Local hour of the nightly tick, at the university's +05:00 offset.
pub const NIGHTLY_HOUR: i8 = 2;

/// Runtime configuration for the scheduler.
pub struct SchedulerConfig {
    /// Required by CSV sources; API sources never need it (ADR-010 §4).
    pub pepper: Option<Pepper>,
    /// Bearer service token for API sources (`APP_SOURCE_TOKEN`).
    pub source_token: Option<String>,
    pub page_limit: u32,
}

impl SchedulerConfig {
    /// Read the environment. Absent secrets are not an error here: a host that
    /// runs only API sources has no pepper, and one that runs only the CSV
    /// backfill has no source token. The per-source run fails loudly instead.
    pub fn from_env() -> Result<Self, ConfigError> {
        Ok(Self {
            pepper: Pepper::from_env_optional()?,
            source_token: std::env::var(SOURCE_TOKEN_ENV)
                .ok()
                .filter(|t| !t.is_empty()),
            page_limit: DEFAULT_PAGE_LIMIT,
        })
    }
}

/// Run every enabled source once. Also the entry point the admin trigger will
/// call (W3.7) - errors are per source, so one broken source does not stop the
/// others.
pub async fn run_enabled_sources(
    pool: &PgPool,
    config: &SchedulerConfig,
) -> Result<Vec<(i64, BatchSummary)>, IngestError> {
    let sources = store::load_enabled_sources(pool).await?;
    let mut summaries = Vec::new();
    for source in sources {
        let id = source.id;
        match run_source_row(pool, &source, config).await {
            Ok(summary) => {
                tracing::info!(
                    source_id = id,
                    rows_read = summary.rows_read,
                    rows_upserted = summary.rows_upserted,
                    rows_rejected = summary.rows_rejected,
                    rows_skipped_deleted = summary.rows_skipped_deleted,
                    "ingest source finished"
                );
                summaries.push((id, summary));
            }
            // The message is built from typed variants only - no source text.
            Err(error) => tracing::error!(source_id = id, error = %error, "ingest source failed"),
        }
    }
    Ok(summaries)
}

/// Run one configured source by id. Exposed for the admin-triggered run that
/// the `api` lane adds in W3.7.
pub async fn run_source(
    pool: &PgPool,
    source_id: i64,
    config: &SchedulerConfig,
) -> Result<BatchSummary, IngestError> {
    let source = store::load_source(pool, source_id)
        .await?
        .ok_or(ConfigError::ApiSourceWithoutBaseUrl { id: source_id })?;
    run_source_row(pool, &source, config).await
}

async fn run_source_row(
    pool: &PgPool,
    source: &SourceRow,
    config: &SchedulerConfig,
) -> Result<BatchSummary, IngestError> {
    match source.kind.as_str() {
        "api" => {
            let base_url = source
                .base_url
                .as_deref()
                .filter(|url| !url.trim().is_empty())
                .ok_or(ConfigError::ApiSourceWithoutBaseUrl { id: source.id })?;
            let token = config
                .source_token
                .as_deref()
                .ok_or(ConfigError::SourceTokenMissing)?;
            let client = RestSourceApi::new(base_url, token)?;
            api::run_api_source(
                pool,
                source.id,
                &format!("api-{}", source.id),
                &client,
                config.page_limit,
            )
            .await
        }
        _ => {
            // A CSV source points `base_url` at a watched directory
            // (ARCHITECTURE §4.4). The pepper is mandatory here (ADR-008 §2).
            let directory = source
                .base_url
                .as_deref()
                .filter(|path| !path.trim().is_empty())
                .ok_or(ConfigError::CsvSourceWithoutDirectory { id: source.id })?;
            let pepper = config.pepper.as_ref().ok_or(ConfigError::PepperMissing)?;
            let reports = pipeline::run_csv_tree(
                pool,
                std::path::Path::new(directory),
                &format!("csv-{}", source.id),
                pepper,
            )
            .await?;
            Ok(reports.into_iter().map(|report| report.summary).fold(
                BatchSummary::default(),
                |mut total, summary| {
                    total.batch_id = summary.batch_id;
                    total.rows_read += summary.rows_read;
                    total.rows_upserted += summary.rows_upserted;
                    total.rows_rejected += summary.rows_rejected;
                    total.rows_skipped_deleted += summary.rows_skipped_deleted;
                    total
                },
            ))
        }
    }
}

/// The nightly loop. Never returns; intended for `tokio::spawn`.
pub async fn run_forever(pool: PgPool, config: SchedulerConfig) {
    loop {
        let wait = duration_until_next_tick(jiff::Timestamp::now());
        tracing::info!(seconds = wait.as_secs(), "next ingest tick scheduled");
        tokio::time::sleep(wait).await;
        if let Err(error) = run_enabled_sources(&pool, &config).await {
            tracing::error!(error = %error, "nightly ingest tick failed");
        }
    }
}

/// Time until the next `NIGHTLY_HOUR:00` at +05:00, strictly in the future.
#[must_use]
pub fn duration_until_next_tick(now: jiff::Timestamp) -> Duration {
    let offset = jiff::tz::Offset::constant(SOURCE_OFFSET_HOURS);
    let local = offset.to_datetime(now);
    let mut target = local.date().at(NIGHTLY_HOUR, 0, 0, 0);
    if target <= local {
        let Some(tomorrow) = local.date().tomorrow().ok() else {
            return Duration::from_secs(60);
        };
        target = tomorrow.at(NIGHTLY_HOUR, 0, 0, 0);
    }
    match offset.to_timestamp(target) {
        Ok(target) => {
            let seconds = target.as_second() - now.as_second();
            Duration::from_secs(u64::try_from(seconds).unwrap_or(60).max(1))
        }
        Err(_) => Duration::from_secs(60),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn at(text: &str) -> jiff::Timestamp {
        text.parse().unwrap()
    }

    #[test]
    fn the_tick_is_two_in_the_morning_at_plus_five() {
        // 01:00 local → one hour to go.
        let wait = duration_until_next_tick(at("2026-03-01T01:00:00+05:00"));
        assert_eq!(wait.as_secs(), 3_600);

        // 02:00 local exactly → the *next* day, never a zero-length sleep.
        let wait = duration_until_next_tick(at("2026-03-01T02:00:00+05:00"));
        assert_eq!(wait.as_secs(), 86_400);

        // 03:00 local → 23 hours.
        let wait = duration_until_next_tick(at("2026-03-01T03:00:00+05:00"));
        assert_eq!(wait.as_secs(), 23 * 3_600);
    }

    #[test]
    fn the_tick_is_computed_in_local_time_not_utc() {
        // 22:00Z is 03:00 the next local day, so the wait is 23 h, not 4 h.
        let wait = duration_until_next_tick(at("2026-03-01T22:00:00Z"));
        assert_eq!(wait.as_secs(), 23 * 3_600);
    }

    #[test]
    fn the_wait_is_always_positive() {
        for hour in 0..24 {
            let stamp = format!("2026-03-01T{hour:02}:30:00+05:00");
            assert!(duration_until_next_tick(at(&stamp)).as_secs() > 0);
        }
    }
}
