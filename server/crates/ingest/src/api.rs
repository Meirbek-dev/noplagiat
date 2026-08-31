//! API mode - the primary path once the new source system is live (ADR-010).
//!
//! The wire format is `contracts/ingest-source.schema.json`. Two of its
//! properties are load-bearing here:
//!
//! * `additionalProperties: false` on the record object is mirrored by
//!   `#[serde(deny_unknown_fields)]`. A source that starts sending `"author"`
//!   fails loudly instead of quietly filling a column - that closed property
//!   set *is* the anonymization assurance (ADR-010 §4), so neither may be
//!   relaxed.
//! * The cursor is `(checked_at, check_id)`, exclusive, persisted only after
//!   the page's rows are committed, so a crash re-reads at most one page.
//!
//! No pepper, no HMAC: `attempt_no` and the unit arrive natively, so
//! `work_ref`/`reviewer_ref` stay NULL.

use std::time::Duration;

use domain::{AcademicYear, AttemptNo, CheckStatus, InitiatorRole, OriginalityPct, SourceCheckId};
use sqlx::PgPool;

use crate::error::{ApiError, IngestError, RejectionKind, RowRejection, StoreError};
use crate::pipeline::{BatchStatus, BatchSummary, initiator_label, rejections_json, status_label};
use crate::row::SOURCE_OFFSET_HOURS;
use crate::store::{self, CheckUpsert, Dictionaries};

/// Path of the versioned pull endpoint (ADR-010 §1). The major version is in
/// the path: a breaking change is a new path, never a redefinition of v1.
pub const CHECKS_PATH: &str = "/api/analytics/v1/checks";

/// Environment variable holding the bearer service token (ADR-010 §1).
pub const SOURCE_TOKEN_ENV: &str = "APP_SOURCE_TOKEN";

/// Records requested per page. Advisory - the source may return fewer.
pub const DEFAULT_PAGE_LIMIT: u32 = 500;

/// Pages pulled in one run before the runner yields; bounds a single batch.
const MAX_PAGES_PER_RUN: u32 = 10_000;

/// The `(checked_at, check_id)` pull cursor, stored verbatim in
/// `ingest_sources.cursor`.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Cursor {
    pub checked_at: String,
    pub check_id: String,
}

/// One page of `GET {base_url}/api/analytics/v1/checks`.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Page {
    pub records: Vec<SourceRecord>,
    /// `null` means "caller has caught up" and is the only end-of-stream signal.
    pub next_cursor: Option<Cursor>,
}

/// One check attempt, exactly the schema's closed property set.
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SourceRecord {
    pub check_id: String,
    pub checked_at: String,
    pub attempt_no: i64,
    pub work_type_code: String,
    pub faculty_code: String,
    pub department_code: String,
    #[serde(default)]
    pub program_code: Option<String>,
    pub originality_pct: f64,
    #[serde(default)]
    pub self_citation_pct: Option<f64>,
    #[serde(default)]
    pub citation_pct: Option<f64>,
    #[serde(default)]
    pub match_pct: Option<f64>,
    #[serde(default)]
    pub ai_content_pct: Option<f64>,
    pub status: CheckStatus,
    pub escalated: bool,
    #[serde(default)]
    pub suspicious: bool,
    #[serde(default)]
    pub suspicion_cleared: bool,
    pub initiator: InitiatorRole,
    #[serde(default)]
    pub duration_seconds: Option<i64>,
    #[serde(default)]
    pub deleted: bool,
}

/// A paged, cursor-driven pull from one source system.
///
/// Async-fn-in-trait rather than a boxed future: every caller knows its
/// implementation statically (the scheduler uses [`RestSourceApi`], the tests
/// use an in-memory one), so no `dyn` dispatch is needed.
pub trait SourceApi {
    /// Fetch the page strictly after `cursor`, or the first page when `None`.
    fn fetch_page(
        &self,
        cursor: Option<&Cursor>,
        limit: u32,
    ) -> impl Future<Output = Result<Page, ApiError>> + Send;
}

/// REST implementation of [`SourceApi`] (reqwest over rustls).
pub struct RestSourceApi {
    http: reqwest::Client,
    base_url: String,
    token: String,
    max_attempts: u32,
    base_backoff: Duration,
}

impl RestSourceApi {
    /// `base_url` pins one contract version per configured source.
    pub fn new(base_url: &str, token: &str) -> Result<Self, ApiError> {
        if base_url.trim().is_empty() {
            return Err(ApiError::InvalidBaseUrl);
        }
        Ok(Self {
            http: reqwest::Client::builder()
                .timeout(Duration::from_secs(30))
                .build()?,
            base_url: base_url.trim_end_matches('/').to_owned(),
            token: token.to_owned(),
            max_attempts: 5,
            base_backoff: Duration::from_millis(250),
        })
    }

    /// Shorten the backoff so tests do not sleep for seconds.
    #[must_use]
    pub fn with_backoff(mut self, max_attempts: u32, base_backoff: Duration) -> Self {
        self.max_attempts = max_attempts.max(1);
        self.base_backoff = base_backoff;
        self
    }
}

impl SourceApi for RestSourceApi {
    async fn fetch_page(&self, cursor: Option<&Cursor>, limit: u32) -> Result<Page, ApiError> {
        let url = format!("{}{CHECKS_PATH}", self.base_url);
        let mut last_status = None;

        for attempt in 1..=self.max_attempts {
            let mut request = self
                .http
                .get(&url)
                .bearer_auth(&self.token)
                .query(&[("limit", limit.to_string())]);
            if let Some(cursor) = cursor {
                request = request.query(&[
                    ("checked_at", cursor.checked_at.as_str()),
                    ("check_id", cursor.check_id.as_str()),
                ]);
            }

            match request.send().await {
                Ok(response) if response.status().is_success() => {
                    let body = response.text().await?;
                    return serde_json::from_str::<Page>(&body)
                        .map_err(|error| ApiError::Contract(error.to_string()));
                }
                Ok(response) => {
                    let status = response.status();
                    last_status = Some(status.as_u16());
                    // 4xx other than 429 will not get better by waiting.
                    if !(status.is_server_error() || status.as_u16() == 429) {
                        return Err(ApiError::Status {
                            status: status.as_u16(),
                            attempts: attempt,
                        });
                    }
                }
                Err(error) if attempt == self.max_attempts => return Err(error.into()),
                Err(_) => {}
            }

            if attempt < self.max_attempts {
                // Exponential backoff: 1×, 2×, 4×, … of the base delay.
                let factor = 1_u32 << (attempt - 1).min(16);
                tokio::time::sleep(self.base_backoff * factor).await;
            }
        }

        Err(ApiError::Status {
            status: last_status.unwrap_or(0),
            attempts: self.max_attempts,
        })
    }
}

/// Pull every page after the stored cursor and upsert it.
///
/// The cursor advances only after each page's rows are committed, so a crash
/// re-reads at most one page; combined with the `ON CONFLICT` upsert, that
/// re-read is a no-op (ADR-010 §2).
pub async fn run_api_source<S: SourceApi>(
    pool: &PgPool,
    source_id: i64,
    source_label: &str,
    api: &S,
    limit: u32,
) -> Result<BatchSummary, IngestError> {
    let batch_id = store::start_batch(pool, source_label, "api").await?;
    match pull_pages(pool, source_id, api, limit, batch_id).await {
        Ok(summary) => Ok(summary),
        Err(error) => {
            store::finish_batch(
                pool,
                batch_id,
                0,
                0,
                0,
                0,
                serde_json::json!([]),
                BatchStatus::Failed.as_str(),
            )
            .await?;
            Err(error)
        }
    }
}

async fn pull_pages<S: SourceApi>(
    pool: &PgPool,
    source_id: i64,
    api: &S,
    limit: u32,
    batch_id: i64,
) -> Result<BatchSummary, IngestError> {
    let dictionaries = store::load_dictionaries(pool).await?;
    let stored = store::load_source(pool, source_id)
        .await?
        .and_then(|source| source.cursor)
        .and_then(|value| serde_json::from_value::<Cursor>(value).ok());

    let mut cursor = stored;
    let mut summary = BatchSummary {
        batch_id,
        ..BatchSummary::default()
    };
    let mut rejections: Vec<RowRejection> = Vec::new();

    for _ in 0..MAX_PAGES_PER_RUN {
        let page = api.fetch_page(cursor.as_ref(), limit).await?;
        let (upserts, page_rejections, deleted) =
            convert_page(&page, &dictionaries, summary.rows_read);
        summary.rows_read += page.records.len() as u64;
        summary.rows_skipped_deleted += deleted;
        rejections.extend(page_rejections);

        if !upserts.is_empty() {
            let mut tx = pool.begin().await.map_err(StoreError::Sqlx)?;
            store::lock(&mut tx).await?;
            summary.rows_upserted += store::upsert_checks(&mut tx, batch_id, &upserts).await?;
            tx.commit().await.map_err(StoreError::Sqlx)?;
        }

        // Committed - only now may the cursor move.
        let next = page.next_cursor.clone();
        let serialized = next
            .as_ref()
            .and_then(|value| serde_json::to_value(value).ok());
        store::save_cursor(pool, source_id, serialized.as_ref()).await?;

        match next {
            // `next_cursor: null` is the only end-of-stream signal.
            None => break,
            Some(next) => cursor = Some(next),
        }
    }

    summary.rows_rejected = rejections.len() as u64;
    summary.status = BatchStatus::Succeeded;
    store::finish_batch(
        pool,
        batch_id,
        i32::try_from(summary.rows_read).unwrap_or(i32::MAX),
        i32::try_from(summary.rows_upserted).unwrap_or(i32::MAX),
        i32::try_from(summary.rows_rejected).unwrap_or(i32::MAX),
        i32::try_from(summary.rows_skipped_deleted).unwrap_or(i32::MAX),
        rejections_json(&rejections),
        BatchStatus::Succeeded.as_str(),
    )
    .await?;

    let refreshed = store::refresh_materialized_views(pool).await?;
    tracing::info!(batch_id, views = refreshed.len(), "aggregates refreshed");

    Ok(summary)
}

/// Validate a page against the domain newtypes and resolve its dictionary codes.
fn convert_page(
    page: &Page,
    dictionaries: &Dictionaries,
    row_offset: u64,
) -> (Vec<CheckUpsert>, Vec<RowRejection>, u64) {
    let mut upserts = Vec::with_capacity(page.records.len());
    let mut rejections = Vec::new();
    let mut deleted = 0_u64;

    for (index, record) in page.records.iter().enumerate() {
        let row_index = row_offset + index as u64;
        if record.deleted {
            deleted += 1;
        }
        match convert_record(record, dictionaries, row_index) {
            Ok(upsert) => upserts.push(upsert),
            Err(rejection) => rejections.push(rejection),
        }
    }
    (upserts, rejections, deleted)
}

fn convert_record(
    record: &SourceRecord,
    dictionaries: &Dictionaries,
    row_index: u64,
) -> Result<CheckUpsert, RowRejection> {
    let reject = |kind| RowRejection::new(row_index, kind, None);

    let source_check_id = SourceCheckId::new(record.check_id.clone())
        .map_err(|_| reject(RejectionKind::InvalidCheckId))?;
    let attempt_no = u32::try_from(record.attempt_no)
        .ok()
        .and_then(|value| AttemptNo::new(value).ok())
        .ok_or_else(|| reject(RejectionKind::InvalidAttemptNo))?;

    let checked_at: jiff::Timestamp = record
        .checked_at
        .parse()
        .map_err(|_| reject(RejectionKind::InvalidCursorTimestamp))?;
    let civil = jiff::tz::Offset::constant(SOURCE_OFFSET_HOURS).to_datetime(checked_at);
    let checked_at = store::to_offset_date_time(checked_at)
        .map_err(|_| reject(RejectionKind::InvalidCursorTimestamp))?;

    let originality = percentage(record.originality_pct)
        .ok_or_else(|| reject(RejectionKind::InvalidPercentage))?;
    let optional = |value: Option<f64>| -> Result<Option<i32>, RowRejection> {
        match value {
            None => Ok(None),
            Some(value) => percentage(value)
                .map(|pct| Some(i32::from(pct.hundredths())))
                .ok_or_else(|| reject(RejectionKind::InvalidPercentage)),
        }
    };

    let work_type_id = dictionaries
        .resolve("work_type", &record.work_type_code)
        .ok_or_else(|| reject(RejectionKind::UnknownDictionaryCode))?;
    let faculty_id = dictionaries
        .resolve("faculty", &record.faculty_code)
        .ok_or_else(|| reject(RejectionKind::UnknownDictionaryCode))?;
    let department_id = dictionaries
        .resolve("department", &record.department_code)
        .ok_or_else(|| reject(RejectionKind::UnknownDictionaryCode))?;
    let program_id = match record.program_code.as_deref() {
        None => None,
        Some(code) => Some(
            dictionaries
                .resolve("program", code)
                .ok_or_else(|| reject(RejectionKind::UnknownDictionaryCode))?,
        ),
    };

    Ok(CheckUpsert {
        source_check_id: source_check_id.as_str().to_owned(),
        attempt_no: i32::try_from(attempt_no.get()).unwrap_or(i32::MAX),
        checked_at,
        // The academic year is a *local* civil-calendar fact (ADR-008 §8), so
        // it is taken at the university's +05:00 offset regardless of the
        // offset the record was serialized with.
        academic_year: AcademicYear::from_date(civil.date()).0,
        work_type_id,
        faculty_id,
        department_id,
        program_id,
        originality_hundredths: i32::from(originality.hundredths()),
        // The source's own verdict is authoritative in API mode (ADR-010 §3).
        status: status_label(record.status),
        escalated: record.escalated,
        initiator: initiator_label(record.initiator),
        duration_seconds: record
            .duration_seconds
            .and_then(|value| i32::try_from(value).ok())
            .filter(|value| *value >= 0),
        // No pepper, no HMAC: the refs stay NULL (ADR-010 §4).
        work_ref: None,
        reviewer_ref: None,
        self_citation_hundredths: optional(record.self_citation_pct)?,
        citation_hundredths: optional(record.citation_pct)?,
        match_hundredths: optional(record.match_pct)?,
        ai_content_hundredths: optional(record.ai_content_pct)?,
        suspicious: record.suspicious,
        suspicion_cleared: record.suspicion_cleared,
        deleted: record.deleted,
    })
}

/// A schema percentage (0–100, at most two decimals) → exact hundredths.
fn percentage(value: f64) -> Option<OriginalityPct> {
    if !value.is_finite() {
        return None;
    }
    let hundredths = (value * 100.0).round();
    if (hundredths - value * 100.0).abs() > 0.001 {
        return None;
    }
    u16::try_from(hundredths as i64)
        .ok()
        .and_then(|value| OriginalityPct::from_hundredths(value).ok())
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE: &str = r#"{
        "records": [{
            "check_id": "c-2025-000841",
            "checked_at": "2025-10-15T09:00:00+05:00",
            "attempt_no": 1,
            "work_type_code": "thesis",
            "faculty_code": "ENG",
            "department_code": "SE",
            "program_code": "6B06103",
            "originality_pct": 88.5,
            "self_citation_pct": 1.25,
            "citation_pct": 6.4,
            "match_pct": 11.5,
            "ai_content_pct": 3.0,
            "status": "accepted",
            "escalated": false,
            "suspicious": false,
            "suspicion_cleared": false,
            "initiator": "student",
            "duration_seconds": 42,
            "deleted": false
        }],
        "next_cursor": {"checked_at": "2025-10-15T09:00:00+05:00", "check_id": "c-2025-000841"}
    }"#;

    #[test]
    fn the_schema_example_deserializes() {
        let page: Page = serde_json::from_str(EXAMPLE).unwrap();
        assert_eq!(page.records.len(), 1);
        assert_eq!(page.records[0].status, CheckStatus::Accepted);
        assert_eq!(page.records[0].initiator, InitiatorRole::Student);
        assert_eq!(
            page.next_cursor.as_ref().map(|c| c.check_id.as_str()),
            Some("c-2025-000841")
        );
    }

    /// The closed property set is the anonymization assurance (ADR-010 §4): a
    /// source that starts sending a name must fail validation, not fill a
    /// column.
    #[test]
    fn an_unexpected_property_fails_the_page() {
        let with_author = EXAMPLE.replace(
            "\"check_id\": \"c-2025-000841\"",
            "\"check_id\": \"c-1\", \"author\": \"Иванов Иван Иванович\"",
        );
        let error = serde_json::from_str::<Page>(&with_author).unwrap_err();
        assert!(error.to_string().contains("unknown field"), "{error}");
    }

    #[test]
    fn a_null_cursor_is_the_end_of_stream() {
        let page: Page = serde_json::from_str(r#"{"records": [], "next_cursor": null}"#).unwrap();
        assert!(page.next_cursor.is_none());
    }

    #[test]
    fn optional_record_fields_default_rather_than_fail() {
        let minimal = r#"{"records": [{
            "check_id": "c-1", "checked_at": "2025-10-15T09:00:00+05:00", "attempt_no": 2,
            "work_type_code": "other", "faculty_code": "UNASSIGNED",
            "department_code": "UNASSIGNED", "originality_pct": 61.0,
            "status": "recheck", "escalated": true, "initiator": "staff_self"
        }], "next_cursor": null}"#;
        let page: Page = serde_json::from_str(minimal).unwrap();
        let record = &page.records[0];
        assert_eq!(record.program_code, None);
        assert_eq!(record.duration_seconds, None);
        assert!(!record.deleted);
        assert!(!record.suspicious);
    }

    #[test]
    fn percentages_convert_to_exact_hundredths() {
        assert_eq!(percentage(88.5).map(|p| p.hundredths()), Some(8_850));
        assert_eq!(percentage(0.0).map(|p| p.hundredths()), Some(0));
        assert_eq!(percentage(100.0).map(|p| p.hundredths()), Some(10_000));
        assert_eq!(percentage(1.25).map(|p| p.hundredths()), Some(125));
        // Out of the schema's 0..100 range, or more precise than two decimals.
        assert_eq!(percentage(100.01), None);
        assert_eq!(percentage(-0.5), None);
        assert_eq!(percentage(f64::NAN), None);
    }

    #[test]
    fn the_academic_year_is_taken_at_the_university_offset() {
        // 2025-09-01T02:00+05:00 is 2025-08-31T21:00Z: the local calendar date
        // decides the academic year, so this is AY 2025/26, not 2024/25.
        let stamp: jiff::Timestamp = "2025-09-01T02:00:00+05:00".parse().unwrap();
        let civil = jiff::tz::Offset::constant(SOURCE_OFFSET_HOURS).to_datetime(stamp);
        assert_eq!(AcademicYear::from_date(civil.date()), AcademicYear(2025));
        // The same instant expressed in UTC must classify identically.
        let utc: jiff::Timestamp = "2025-08-31T21:00:00Z".parse().unwrap();
        let civil = jiff::tz::Offset::constant(SOURCE_OFFSET_HOURS).to_datetime(utc);
        assert_eq!(AcademicYear::from_date(civil.date()), AcademicYear(2025));
    }
}
