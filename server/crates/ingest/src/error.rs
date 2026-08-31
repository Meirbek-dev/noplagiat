//! Typed failures. Nothing in this module may carry source text.
//!
//! AGENTS.md invariant #1 forbids a name, an e-mail or a document title in any
//! column, log line or error message. Every variant below is therefore built
//! from constants (contract column labels), positions (row indices) and
//! machine-readable kinds - never from a field value read out of the source.

use crate::source_csv::DOCUMENTS_HEADER;

/// Why one source row could not become a fact.
///
/// The names match the `rejections` keys of `fixtures/out/<ay>/malformed.json`
/// so a golden test can compare them without a translation table.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, serde::Serialize)]
#[serde(rename_all = "snake_case")]
pub enum RejectionKind {
    /// The record does not have the 14 contract columns, or «Статус» does not
    /// carry «Не удален»/«Удален» - the observed shift defect (PLAN §1.4).
    ColumnShifted,
    /// A non-deleted row whose «Ссылка на полный отчет» yields no
    /// `{userId}:{reportId}` (ADR-008 §1). Never guessed.
    UnparseableReportLink,
    /// «Дата загрузки документа» is not `dd.MM.yyyy HH:mm`.
    InvalidTimestamp,
    /// A percentage column is not a decimal-comma number in `0,00`..`100,00`.
    InvalidPercentage,
    /// The derived `source_check_id` is not a valid [`domain::SourceCheckId`].
    InvalidCheckId,
    /// API mode: `attempt_no` is not ≥ 1.
    InvalidAttemptNo,
    /// API mode: a dictionary code is unknown to the warehouse and has no
    /// `dict_aliases` entry.
    UnknownDictionaryCode,
    /// API mode: `checked_at` is not RFC 3339 with an explicit offset.
    InvalidCursorTimestamp,
    /// More rejections occurred than `MAX_PERSISTED_REJECTIONS`; the surplus is
    /// counted, not listed.
    RejectionsTruncated,
}

/// One sanitized per-row failure, as persisted into `ingest_batches.errors`.
///
/// `column` is a *contract* label from [`DOCUMENTS_HEADER`] - a constant, never
/// a value. There is deliberately no field that could hold source text.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize)]
pub struct RowRejection {
    /// 0-based index over logical CSV records, header excluded (a record may
    /// span several physical lines). Matches `malformed.json.row_indices`.
    pub row_index: u64,
    pub kind: RejectionKind,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub column: Option<&'static str>,
}

impl RowRejection {
    #[must_use]
    pub const fn new(row_index: u64, kind: RejectionKind, column: Option<&'static str>) -> Self {
        Self {
            row_index,
            kind,
            column,
        }
    }

    /// Rejection attributed to one contract column, addressed by its index in
    /// [`DOCUMENTS_HEADER`].
    #[must_use]
    pub fn at_column(row_index: u64, kind: RejectionKind, column_index: usize) -> Self {
        Self {
            row_index,
            kind,
            column: DOCUMENTS_HEADER.get(column_index).copied(),
        }
    }
}

impl std::fmt::Display for RowRejection {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?} at record {}", self.kind, self.row_index)
    }
}

/// A failure that rejects the whole batch rather than one row.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, thiserror::Error)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum BatchError {
    /// The header does not have the ADR-008 §1 column count.
    #[error("header has {actual} columns, the ADR-008 §1 contract has {expected}")]
    HeaderColumnCount { expected: usize, actual: usize },
    /// A header cell differs from the contract. Only the position and the
    /// *expected* label are recorded - the observed text is never persisted.
    #[error("header column {index} must be the ADR-008 §1 label `{expected}`")]
    HeaderMismatch {
        index: usize,
        expected: &'static str,
    },
    /// The file has no header row at all.
    #[error("the documents file is empty - no header row")]
    EmptyFile,
    /// `system-usage.csv` header does not match ADR-008 §1.
    #[error("system-usage.csv header does not match the ADR-008 §1 contract")]
    UsageHeaderMismatch,
    /// `system-usage.csv` carries no aggregate row.
    #[error("system-usage.csv has no aggregate row")]
    UsageRowMissing,
}

/// Configuration failures. Fail fast: an ingest that silently runs without a
/// pepper would write unusable references.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum ConfigError {
    #[error("APP_INGEST_PEPPER is required in CSV mode (ADR-008 §2) and is not set")]
    PepperMissing,
    #[error("APP_INGEST_PEPPER must not be empty")]
    PepperEmpty,
    #[error("APP_SOURCE_TOKEN is required for API-mode sources (ADR-010 §1) and is not set")]
    SourceTokenMissing,
    #[error("ingest source {id} has kind 'api' but no base_url")]
    ApiSourceWithoutBaseUrl { id: i64 },
    #[error("ingest source {id} has kind 'csv' but no watched directory in base_url")]
    CsvSourceWithoutDirectory { id: i64 },
    #[error("settings.{key} is not valid: {reason}")]
    Settings { key: &'static str, reason: String },
}

/// Failures while reading a CSV source.
#[derive(Debug, thiserror::Error)]
pub enum SourceError {
    #[error("cannot read {path}: {source}")]
    Io {
        path: String,
        #[source]
        source: std::io::Error,
    },
    #[error("csv error: {0}")]
    Csv(#[from] csv::Error),
    #[error("{0}")]
    Batch(#[from] BatchError),
    #[error("{path} is not an academic-year directory (expected `YYYY-YYYY`)")]
    NotAnAcademicYearDirectory { path: String },
    #[error("no academic-year directory (`YYYY-YYYY`) found under {path}")]
    NoAcademicYearDirectories { path: String },
}

/// Failures while pulling from the source system's REST endpoint (ADR-010).
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("source API transport error: {0}")]
    Transport(#[from] reqwest::Error),
    #[error("source API returned HTTP {status} after {attempts} attempt(s)")]
    Status { status: u16, attempts: u32 },
    /// The response did not match `contracts/ingest-source.schema.json`. The
    /// serde message names the offending *property*, never a value, because the
    /// record type is `deny_unknown_fields` over a PII-free property set.
    #[error("source API page does not match the ingest contract: {0}")]
    Contract(String),
    #[error("base_url is not a valid URL")]
    InvalidBaseUrl,
}

/// Database failures raised by [`crate::store`].
#[derive(Debug, thiserror::Error)]
pub enum StoreError {
    #[error("database error: {0}")]
    Sqlx(#[from] sqlx::Error),
    #[error("dictionary row `{code}` of kind `{kind}` is missing - migration 0002 seeds it")]
    MissingSentinel {
        kind: &'static str,
        code: &'static str,
    },
    #[error("setting `{key}` is missing")]
    MissingSetting { key: &'static str },
}

/// The crate-level error. Every variant is safe to log verbatim.
#[derive(Debug, thiserror::Error)]
pub enum IngestError {
    #[error("configuration: {0}")]
    Config(#[from] ConfigError),
    #[error("source: {0}")]
    Source(#[from] SourceError),
    #[error("api: {0}")]
    Api(#[from] ApiError),
    #[error("store: {0}")]
    Store(#[from] StoreError),
    #[error("batch rejected: {0}")]
    Batch(#[from] BatchError),
}

impl From<sqlx::Error> for IngestError {
    fn from(error: sqlx::Error) -> Self {
        Self::Store(StoreError::Sqlx(error))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejection_kinds_serialize_as_the_sidecar_keys() {
        // fixtures/out/<ay>/malformed.json names its buckets exactly this way.
        assert_eq!(
            serde_json::to_value(RejectionKind::ColumnShifted).unwrap(),
            serde_json::json!("column_shifted")
        );
        assert_eq!(
            serde_json::to_value(RejectionKind::UnparseableReportLink).unwrap(),
            serde_json::json!("unparseable_report_link")
        );
    }

    #[test]
    fn a_rejection_carries_position_and_contract_label_only() {
        let rejection = RowRejection::at_column(2981, RejectionKind::ColumnShifted, 11);
        let json = serde_json::to_value(rejection).unwrap();
        assert_eq!(
            json,
            serde_json::json!({
                "row_index": 2981,
                "kind": "column_shifted",
                "column": "Статус"
            })
        );
    }

    #[test]
    fn a_batch_error_never_echoes_the_observed_header() {
        let error = BatchError::HeaderMismatch {
            index: 1,
            expected: DOCUMENTS_HEADER[1],
        };
        let rendered = error.to_string();
        assert!(rendered.contains("Название документа"), "{rendered}");
        let json = serde_json::to_value(&error).unwrap();
        assert_eq!(json["kind"], serde_json::json!("header_mismatch"));
        assert_eq!(json["index"], serde_json::json!(1));
    }
}
