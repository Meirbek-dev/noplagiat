//! Report generation: the annual anonymized report (the Приложение-1 form of
//! TZ §4.5) and filtered-view exports (TZ §4.4).
//!
//! # Shape of the crate
//!
//! ```text
//! db::q ──▶ annual ──▶ doc::ReportDoc ──┬─▶ xlsx::render_xlsx  ──▶ .xlsx
//!            (screens)                  └─▶ pdf::render_pdf    ──▶ .pdf
//!                                            snapshot ──▶ report_snapshots
//! ```
//!
//! Screening happens **once**, in [`annual`], and is carried by the document
//! model: every numeric cell is a [`Metric`] built from a
//! [`compliance::Screened`] value, so a renderer has no way to print a number
//! the k-anonymity policy withheld (AGENTS.md invariant #2). A suppressed cell
//! is «недостаточно данных» in both formats and never a digit.
//!
//! # Determinism
//!
//! Neither renderer reads a clock: the generation date is a parameter of
//! [`annual_report`], and the Typst world's `today()` returns `None`. Two runs
//! over the same warehouse state produce byte-identical files, which is what
//! makes the snapshot content hash meaningful (see [`snapshot`]).
//!
//! HTTP export endpoints are a later slice; this crate is the rendering engine
//! they will call.

pub mod annual;
pub mod brand;
pub mod doc;
pub mod locale;
pub mod pdf;
pub mod scheduler;
pub mod snapshot;
pub mod xlsx;

pub use annual::{annual_report, period_report};
pub use doc::{
    Align, Cell, CodeLabel, Column, Label, LabelError, Metric, MetricValue, ReportDoc,
    ReportSection, ReportTable, Row, RowKind,
};
pub use locale::{Locale, Strings};
pub use pdf::{RenderedPdf, render_pdf};
pub use scheduler::{
    ANNUAL_REPORT_ADVISORY_LOCK, AnnualRun, run_annual_snapshots,
    spawn_scheduler as spawn_annual_scheduler,
};
pub use snapshot::{
    DEFAULT_REPORTS_DIR, REPORTS_DIR_ENV, SnapshotKind, SnapshotRecord, SnapshotRequest,
    default_out_dir, generate_snapshot,
};
pub use xlsx::render_xlsx;

/// Rendering flags that are a property of the *export*, not of the document.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct RenderOptions {
    /// TZ §4.4: an export from the internal contour is marked «Для служебного
    /// пользования» - a page header and a diagonal watermark in the PDF, a
    /// header row and a print header in the workbook. Public exports, including
    /// the published annual report, leave this `false`.
    pub internal: bool,
}

impl RenderOptions {
    /// A public export: no service marking.
    #[must_use]
    pub fn public() -> Self {
        Self { internal: false }
    }

    /// An internal-contour export (TZ §4.4).
    #[must_use]
    pub fn internal() -> Self {
        Self { internal: true }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum ReportError {
    #[error("xlsx error: {0}")]
    Xlsx(#[from] rust_xlsxwriter::XlsxError),
    #[error("database error: {0}")]
    Db(#[from] db::DbError),
    #[error("period cannot be expressed as a calendar range: {0}")]
    Period(#[from] domain::PeriodError),
    #[error("k-anonymity screening failed: {0}")]
    Suppression(#[from] compliance::SuppressionError),
    #[error("report label rejected: {0}")]
    Label(#[from] LabelError),
    #[error("typst: {0}")]
    Typst(String),
    #[error("serializing the report payload: {0}")]
    Json(#[from] serde_json::Error),
    #[error("writing the snapshot: {0}")]
    Io(#[from] std::io::Error),
    #[error("date {0} is outside the range PostgreSQL can store")]
    DateOutOfRange(String),
    #[error("could not create a fresh snapshot directory for `{0}`")]
    SnapshotDirectory(String),
    /// A section whose rows do not all match its column count. Rendering one
    /// would silently shift values into the wrong column, so it is refused.
    #[error("a report section has rows that do not match its columns")]
    MalformedTable,
}
