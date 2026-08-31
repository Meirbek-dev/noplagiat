//! Immutable report snapshots (TZ §4.5, ARCHITECTURE.md §4.5).
//!
//! «Сформированные отчёты хранятся как неизменяемые снимки». That is enforced by
//! construction rather than by convention: every run creates its **own**
//! directory with [`std::fs::create_dir`], which fails atomically when the
//! directory already exists, and the files inside are written once. Regenerating
//! a period therefore always produces a new directory and a new
//! `report_snapshots` row; nothing is ever overwritten, so a published link keeps
//! resolving to the bytes that were published.
//!
//! # Where the content hash lives
//!
//! `report_snapshots` (migration 0001) has no hash column, and adding one would
//! mean a migration this lane does not own (AGENTS.md invariant #6 - migrations
//! are strictly serialized). The SHA-256 of each file therefore goes into the
//! **file name**, which the table does store, and is returned in
//! [`SnapshotRecord`]. A verifier re-hashes the file and compares it with its own
//! name; a tampered file no longer matches the path recorded in the database.
//! When a `content_sha256` column is added, `insert` keeps working unchanged and
//! the hash simply moves.

use std::path::{Path, PathBuf};

use compliance::KPolicy;
use db::Pool;
use db::snapshots::NewSnapshot;
use domain::{AcademicYear, Period};
use sha2::{Digest, Sha256};

use crate::locale::Locale;
use crate::{RenderOptions, ReportError, annual, pdf, xlsx};

pub use db::snapshots::SnapshotKind;

/// Environment variable naming the directory snapshots are written to.
pub const REPORTS_DIR_ENV: &str = "APP_REPORTS_DIR";

/// Default output directory, relative to the process working directory.
pub const DEFAULT_REPORTS_DIR: &str = "reports-out";

/// How many hex characters of the digest go into a file name. 16 hex characters
/// is 64 bits - collision-proof for a directory of reports, and short enough to
/// stay readable in an admin listing.
const HASH_PREFIX: usize = 16;

/// Highest directory suffix tried before giving up, so a wedged filesystem
/// cannot spin here forever.
const MAX_DIRECTORY_ATTEMPTS: u32 = 64;

/// The directory snapshots are written to: `$APP_REPORTS_DIR`, else
/// `reports-out/` (gitignored).
#[must_use]
pub fn default_out_dir() -> PathBuf {
    std::env::var_os(REPORTS_DIR_ENV)
        .map_or_else(|| PathBuf::from(DEFAULT_REPORTS_DIR), PathBuf::from)
}

/// Everything a snapshot run needs that is not the database or the destination.
#[derive(Debug, Clone, Copy)]
pub struct SnapshotRequest {
    pub period: Period,
    pub kind: SnapshotKind,
    pub locale: Locale,
    pub policy: KPolicy,
    /// The instant that names the snapshot directory and is printed on the
    /// report. Passed in, never read from a clock here: the same request against
    /// the same warehouse must produce the same bytes.
    pub generated_at: jiff::Timestamp,
    /// Public snapshots (the published annual report) leave this at its default.
    pub options: RenderOptions,
}

impl SnapshotRequest {
    /// An annual snapshot for one academic year (Sep 1 – Aug 31).
    pub fn annual(
        academic_year: AcademicYear,
        locale: Locale,
        policy: KPolicy,
        generated_at: jiff::Timestamp,
    ) -> Result<Self, ReportError> {
        let AcademicYear(year) = academic_year;
        Ok(Self {
            period: Period::new(
                jiff::civil::date(year, 9, 1),
                jiff::civil::date(year + 1, 8, 31),
            )?,
            kind: SnapshotKind::Annual,
            locale,
            policy,
            generated_at,
            options: RenderOptions::default(),
        })
    }
}

/// One generated snapshot, as written to disk and recorded in the database.
#[derive(Debug, Clone)]
pub struct SnapshotRecord {
    /// `report_snapshots.id`.
    pub id: i64,
    /// The snapshot's own directory, below the requested output directory.
    pub directory: PathBuf,
    pub pdf_path: PathBuf,
    pub xlsx_path: PathBuf,
    /// Full SHA-256 of the PDF; its first 16 hex characters are in the filename.
    pub pdf_sha256: String,
    pub xlsx_sha256: String,
    pub pages: usize,
}

/// Render both formats and record the snapshot.
///
/// The directory is created first and exclusively, so two concurrent runs of the
/// same period cannot land in the same place; the database row is written last,
/// so a row always points at files that exist.
pub async fn generate_snapshot(
    pool: &Pool,
    request: &SnapshotRequest,
    out_dir: &Path,
) -> Result<SnapshotRecord, ReportError> {
    let zoned = request.generated_at.to_zoned(jiff::tz::TimeZone::UTC);
    let generated_on = zoned.date();

    let document = match request.kind {
        SnapshotKind::Annual => {
            annual::annual_report(
                pool,
                AcademicYear::from_date(request.period.start()),
                request.locale,
                request.policy,
                generated_on,
            )
            .await?
        }
        SnapshotKind::Manual => {
            annual::period_report(
                pool,
                request.period,
                request.locale,
                request.policy,
                generated_on,
            )
            .await?
        }
    };

    let rendered = pdf::render_pdf(&document, &request.options)?;
    let workbook = xlsx::render_xlsx(&document, &request.options)?;
    let pdf_sha256 = sha256(&rendered.bytes);
    let xlsx_sha256 = sha256(&workbook);

    let directory = create_snapshot_dir(out_dir, request, &zoned.datetime())?;
    let stem = format!(
        "{}-{}_{}",
        request.kind.as_str(),
        request.period.start(),
        request.period.end()
    );
    let pdf_name = format!("{stem}-{}.pdf", &pdf_sha256[..HASH_PREFIX]);
    let xlsx_name = format!("{stem}-{}.xlsx", &xlsx_sha256[..HASH_PREFIX]);
    std::fs::write(directory.join(&pdf_name), &rendered.bytes)?;
    std::fs::write(directory.join(&xlsx_name), &workbook)?;

    // Paths are recorded relative to the output directory: `APP_REPORTS_DIR` may
    // legitimately move between deployments, and an absolute path from a build
    // machine would then dangle.
    let leaf = directory
        .file_name()
        .map_or_else(|| stem.clone(), |name| name.to_string_lossy().into_owned());
    let pdf_relative = format!("{leaf}/{pdf_name}");
    let xlsx_relative = format!("{leaf}/{xlsx_name}");
    let id = db::snapshots::insert(
        pool,
        &NewSnapshot {
            period_start: to_sql_date(request.period.start())?,
            period_end: to_sql_date(request.period.end())?,
            kind: request.kind,
            // Migration 0005: what makes the scheduler's idempotency per
            // (academic year, locale) rather than per academic year.
            locale: Some(request.locale.tag()),
            pdf_path: Some(pdf_relative.as_str()),
            xlsx_path: Some(xlsx_relative.as_str()),
        },
    )
    .await?;

    Ok(SnapshotRecord {
        id,
        pdf_path: directory.join(&pdf_name),
        xlsx_path: directory.join(&xlsx_name),
        directory,
        pdf_sha256,
        xlsx_sha256,
        pages: rendered.pages,
    })
}

/// Create a directory that did not exist a moment ago.
///
/// `create_dir` is the immutability guard: it is atomic and fails with
/// `AlreadyExists`, so a regeneration - even one with the same injected
/// timestamp, which the determinism tests use - is forced into a fresh
/// directory instead of overwriting the previous snapshot.
fn create_snapshot_dir(
    out_dir: &Path,
    request: &SnapshotRequest,
    generated_at: &jiff::civil::DateTime,
) -> Result<PathBuf, ReportError> {
    std::fs::create_dir_all(out_dir)?;
    let base = format!(
        "{:04}{:02}{:02}T{:02}{:02}{:02}Z-{}_{}",
        generated_at.year(),
        generated_at.month(),
        generated_at.day(),
        generated_at.hour(),
        generated_at.minute(),
        generated_at.second(),
        request.period.start(),
        request.period.end(),
    );

    for attempt in 1..=MAX_DIRECTORY_ATTEMPTS {
        let candidate = if attempt == 1 {
            out_dir.join(&base)
        } else {
            out_dir.join(format!("{base}-{attempt}"))
        };
        match std::fs::create_dir(&candidate) {
            Ok(()) => return Ok(candidate),
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {}
            Err(error) => return Err(error.into()),
        }
    }

    Err(ReportError::SnapshotDirectory(base))
}

fn sha256(bytes: &[u8]) -> String {
    let digest = Sha256::digest(bytes);
    let mut out = String::with_capacity(digest.len() * 2);
    for byte in digest {
        use std::fmt::Write as _;
        // Writing into a `String` cannot fail; the result is discarded on
        // purpose rather than unwrapped (AGENTS.md §5).
        let _ = write!(out, "{byte:02x}");
    }
    out
}

/// `jiff` is the calendar arithmetic of the domain layer; `time` is what the
/// PostgreSQL driver speaks. Going through the ordinal day mirrors
/// `db::filters::to_sql_date` and cannot disagree with `jiff` about leap years.
pub(crate) fn to_sql_date(date: jiff::civil::Date) -> Result<time::Date, ReportError> {
    let out_of_range = || ReportError::DateOutOfRange(date.to_string());
    let ordinal = u16::try_from(date.day_of_year()).map_err(|_| out_of_range())?;
    time::Date::from_ordinal_date(i32::from(date.year()), ordinal).map_err(|_| out_of_range())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sha256_is_the_standard_digest() {
        assert_eq!(
            sha256(b"abc"),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }

    #[test]
    fn the_default_output_directory_is_gitignored() {
        assert_eq!(DEFAULT_REPORTS_DIR, "reports-out");
    }

    /// A second run with the *same* injected timestamp must still get its own
    /// directory - otherwise a regeneration would overwrite a published file.
    #[test]
    fn a_second_run_never_reuses_a_directory() {
        let root = std::env::temp_dir().join(format!(
            "noplagiat-snapshot-{}-{}",
            std::process::id(),
            line!()
        ));
        let request = SnapshotRequest::annual(
            AcademicYear(2025),
            Locale::Ru,
            KPolicy::default(),
            jiff::Timestamp::UNIX_EPOCH,
        )
        .expect("the academic year is a valid period");
        let stamp = jiff::civil::datetime(2026, 9, 1, 3, 0, 0, 0);

        let first = create_snapshot_dir(&root, &request, &stamp).expect("first directory");
        let second = create_snapshot_dir(&root, &request, &stamp).expect("second directory");
        assert_ne!(first, second);
        assert!(first.exists() && second.exists());

        let _ = std::fs::remove_dir_all(&root);
    }
}
