//! `ingest-csv` - the historical-backfill CLI (ADR-008 §10).
//!
//! ```text
//! cargo run --manifest-path server/Cargo.toml --bin ingest-csv -- --dir fixtures/out
//! ```
//!
//! `--dir` accepts either the root holding `YYYY-YYYY` academic-year
//! directories or one such directory; `--documents` ingests a single file.
//! Reads `APP_DATABASE_URL` and `APP_INGEST_PEPPER` (both required - ADR-008 §2
//! makes the pepper mandatory in CSV mode, and a run without it would write
//! references nothing else can reproduce).
//!
//! Exits non-zero when any batch fails, so `fixtures/seed.ts` and the W4.3
//! runbook procedure can rely on the status code rather than on parsing output.

use std::path::PathBuf;
use std::time::Duration;

use anyhow::{Context, bail};
use ingest::{Pepper, YearReport};
use tracing_subscriber::EnvFilter;

const DATABASE_CONNECT_TIMEOUT: Duration = Duration::from_secs(5);
const DEFAULT_SOURCE: &str = "csv-backfill";

struct Args {
    dir: Option<PathBuf>,
    documents: Option<PathBuf>,
    source: String,
}

const USAGE: &str = "\
usage: ingest-csv [--dir <root-or-year-dir>] [--documents <file>] [--source <label>]

  --dir        directory holding YYYY-YYYY academic-year directories, or one of them
  --documents  a single documents.csv (its academic year comes from each row)
  --source     ingest_batches.source label (default: csv-backfill)

environment: APP_DATABASE_URL, APP_INGEST_PEPPER";

fn parse_args(raw: impl IntoIterator<Item = String>) -> anyhow::Result<Args> {
    let mut args = Args {
        dir: None,
        documents: None,
        source: DEFAULT_SOURCE.to_owned(),
    };
    let mut iter = raw.into_iter();
    while let Some(flag) = iter.next() {
        let value = || -> anyhow::Result<String> {
            bail!("{flag} needs a value\n\n{USAGE}");
        };
        match flag.as_str() {
            "--dir" => args.dir = Some(PathBuf::from(iter.next().map_or_else(value, Ok)?)),
            "--documents" => {
                args.documents = Some(PathBuf::from(iter.next().map_or_else(value, Ok)?));
            }
            "--source" => args.source = iter.next().map_or_else(value, Ok)?,
            "--help" | "-h" => {
                println!("{USAGE}");
                std::process::exit(0);
            }
            other => bail!("unknown argument `{other}`\n\n{USAGE}"),
        }
    }
    if args.dir.is_none() && args.documents.is_none() {
        bail!("one of --dir or --documents is required\n\n{USAGE}");
    }
    Ok(args)
}

fn required_env(name: &'static str) -> anyhow::Result<String> {
    let value = std::env::var(name)
        .with_context(|| format!("required environment variable {name} is not set"))?;
    if value.trim().is_empty() {
        bail!("required environment variable {name} is empty");
    }
    Ok(value)
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .init();

    let args = parse_args(std::env::args().skip(1))?;
    let database: db::DatabaseConfig = required_env("APP_DATABASE_URL")?
        .parse()
        .context("APP_DATABASE_URL must be a valid PostgreSQL connection URL")?;
    // Fail before touching the database: a half-ingested year with unusable
    // references is worse than no run at all.
    let pepper = Pepper::from_env().context("ADR-008 §2: CSV mode requires APP_INGEST_PEPPER")?;

    let pool = tokio::time::timeout(DATABASE_CONNECT_TIMEOUT, db::connect(&database))
        .await
        .context("timed out connecting to PostgreSQL")?
        .context("failed to connect to PostgreSQL")?;
    db::migrate(&pool)
        .await
        .context("failed to apply database migrations")?;

    let mut reports: Vec<YearReport> = Vec::new();
    let mut failed = false;

    if let Some(documents) = &args.documents {
        match ingest::run_csv_file(&pool, documents, &args.source, &pepper).await {
            Ok(summary) => reports.push(YearReport {
                directory: documents.display().to_string(),
                academic_year: None,
                summary,
            }),
            Err(error) => {
                failed = true;
                eprintln!("{}: {error}", documents.display());
            }
        }
    }

    if let Some(dir) = &args.dir {
        match ingest::run_csv_tree(&pool, dir, &args.source, &pepper).await {
            Ok(mut year_reports) => reports.append(&mut year_reports),
            Err(error) => {
                failed = true;
                eprintln!("{}: {error}", dir.display());
            }
        }
    }

    print_summary(&reports);
    if failed
        || reports
            .iter()
            .any(|r| r.summary.status != ingest::BatchStatus::Succeeded)
    {
        bail!("at least one ingest batch failed");
    }
    Ok(())
}

fn print_summary(reports: &[YearReport]) {
    let rule = "-".repeat(70);
    println!(
        "\n{:<12} {:>9} {:>9} {:>9} {:>9}  status",
        "year", "read", "upserted", "rejected", "deleted"
    );
    println!("{rule}");

    let (mut read, mut upserted, mut rejected, mut deleted) = (0_u64, 0_u64, 0_u64, 0_u64);
    for report in reports {
        let label = report
            .academic_year
            .map_or_else(|| short_name(&report.directory), |year| year.label());
        println!(
            "{:<12} {:>9} {:>9} {:>9} {:>9}  {}",
            label,
            report.summary.rows_read,
            report.summary.rows_upserted,
            report.summary.rows_rejected,
            report.summary.rows_skipped_deleted,
            report.summary.status.as_str()
        );
        read += report.summary.rows_read;
        upserted += report.summary.rows_upserted;
        rejected += report.summary.rows_rejected;
        deleted += report.summary.rows_skipped_deleted;
    }

    println!("{rule}");
    println!(
        "{:<12} {:>9} {:>9} {:>9} {:>9}",
        "TOTAL", read, upserted, rejected, deleted
    );
}

/// Last path segment, so the table stays narrow for `--documents`.
fn short_name(path: &str) -> String {
    std::path::Path::new(path).file_name().map_or_else(
        || path.to_owned(),
        |name| name.to_string_lossy().into_owned(),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    fn args(items: &[&str]) -> anyhow::Result<Args> {
        parse_args(items.iter().map(|s| (*s).to_owned()))
    }

    #[test]
    fn the_documented_invocation_parses() {
        let parsed = args(&["--dir", "fixtures/out"]).unwrap();
        assert_eq!(parsed.dir, Some(PathBuf::from("fixtures/out")));
        assert_eq!(parsed.source, "csv-backfill", "ADR-008 §10 default");
        assert_eq!(parsed.documents, None);
    }

    #[test]
    fn every_documented_flag_is_accepted() {
        let parsed = args(&[
            "--documents",
            "out/2025-2026/documents.csv",
            "--source",
            "manual-upload",
        ])
        .unwrap();
        assert_eq!(
            parsed.documents,
            Some(PathBuf::from("out/2025-2026/documents.csv"))
        );
        assert_eq!(parsed.source, "manual-upload");
    }

    #[test]
    fn an_invocation_without_a_target_is_refused() {
        assert!(args(&[]).is_err());
        assert!(args(&["--source", "x"]).is_err());
        assert!(args(&["--dir"]).is_err(), "a flag without its value");
        assert!(args(&["--unknown"]).is_err());
    }
}
