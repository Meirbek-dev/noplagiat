//! Data ingestion for the analytics warehouse.
//!
//! Two modes, one fact table:
//!
//! * **API mode** ([`api`]) - the primary path once the in-house
//!   `noplagiat.tou.edu.kz` is live. A cursor-paged pull of records that already
//!   carry every TZ §3.1 field and, by contract, no PII at all
//!   ([ADR-010](../../../docs/adr/010-source-ingest-contract.md)).
//! * **CSV mode** ([`source_csv`], [`row`]) - the one-time historical backfill
//!   of the 2021–2026 legacy vendor exports and the TZ §3.3.2 fallback. Here the
//!   derivation layer of [ADR-008](../../../docs/adr/008-legacy-derivation-and-hmac.md)
//!   applies: HMAC references, attempt grouping, the status ladder, rule-driven
//!   work type / initiator / unit attribution.
//!
//! **PII boundary.** Raw legacy exports contain document titles, author names,
//! reviewer names and reviewer e-mails. This crate is the only place that ever
//! touches them, strictly in transit: [`row::parse_row`] borrows them from the
//! CSV record, feeds them to the HMAC and to the rule matchers, and returns a
//! [`row::ParsedRow`] that has no field capable of holding them. Nothing
//! nominative is persisted, logged, or put into a rejection payload - a
//! rejection carries a record index, a kind and a contract column label, all of
//! them constants or positions (AGENTS.md invariant #1).
//!
//! See [ADR-011](../../../docs/adr/011-ingest-pipeline.md) for the pipeline
//! design and the lane deviation that puts this crate's SQL in [`store`].

pub mod api;
pub mod attempts;
pub mod error;
pub mod norm;
pub mod pipeline;
pub mod refs;
pub mod row;
pub mod rules;
pub mod scheduler;
pub mod source_csv;
pub mod store;

pub use api::{Cursor, Page, RestSourceApi, SourceApi, SourceRecord, run_api_source};
pub use error::{
    ApiError, BatchError, ConfigError, IngestError, RejectionKind, RowRejection, SourceError,
    StoreError,
};
pub use norm::{masked_label, norm};
pub use pipeline::{BatchStatus, BatchSummary, YearReport, run_csv_file, run_csv_tree};
pub use refs::{PEPPER_ENV, Pepper};
pub use row::ParsedRow;
pub use scheduler::{SchedulerConfig, run_enabled_sources, run_source};
pub use store::INGEST_ADVISORY_LOCK;

/// Spawn the nightly ingest task (ADR-005).
///
/// The returned handle is detached by the server binary; the task logs its own
/// failures and never returns.
pub fn spawn_scheduler(pool: &db::Pool, config: SchedulerConfig) -> tokio::task::JoinHandle<()> {
    let pool = sqlx::PgPool::clone(pool);
    tokio::spawn(scheduler::run_forever(pool, config))
}
