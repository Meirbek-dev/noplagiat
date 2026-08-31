//! Manual Приложение-1 snapshot generation (`vp run report:generate`).
//!
//! The in-process scheduler covers the automatic Sep-1 run (ADR-005/W4.2) and
//! the admin API covers interactive generation; this binary exists for the
//! operational path in deploy/RUNBOOK.md - most importantly the W4.3 real-data
//! backfill, where reports are generated on a workstation without a browser.
//!
//! Usage:
//!   generate-report --year 2024 [--locale ru|kk|en] [--out <dir>]
//!
//! `--year 2024` means AY 2024/25 (Sep 1 2024 – Aug 31 2025). Reads
//! `APP_DATABASE_URL`; the k threshold comes from the warehouse settings, so
//! the output is screened exactly like every other artifact.

use std::path::PathBuf;
use std::process::ExitCode;
use std::str::FromStr;

use domain::AcademicYear;
use reports::{Locale, SnapshotRequest, generate_snapshot};

struct Args {
    year: i16,
    locale: Locale,
    out: Option<PathBuf>,
}

fn parse_args() -> Result<Args, String> {
    let mut year: Option<i16> = None;
    let mut locale = Locale::Ru;
    let mut out: Option<PathBuf> = None;

    let mut argv = std::env::args().skip(1);
    while let Some(flag) = argv.next() {
        let mut value = |name: &str| {
            argv.next()
                .ok_or_else(|| format!("{name} requires a value"))
        };
        match flag.as_str() {
            "--year" => {
                let raw = value("--year")?;
                year = Some(raw.parse().map_err(|_| {
                    format!("--year expects the AY start year (e.g. 2024), got {raw}")
                })?);
            }
            "--locale" => {
                locale = match value("--locale")?.as_str() {
                    "ru" => Locale::Ru,
                    "kk" => Locale::Kk,
                    "en" => Locale::En,
                    other => return Err(format!("unknown locale {other}")),
                };
            }
            "--out" => out = Some(PathBuf::from(value("--out")?)),
            "--help" | "-h" => {
                return Err(
                    "usage: generate-report --year <YYYY> [--locale ru|kk|en] [--out <dir>]"
                        .to_owned(),
                );
            }
            other => return Err(format!("unknown argument {other}")),
        }
    }

    let year = year.ok_or("missing required --year (AY start year, e.g. 2024)")?;
    Ok(Args { year, locale, out })
}

async fn run(args: Args) -> anyhow::Result<()> {
    let database_url = std::env::var("APP_DATABASE_URL")
        .map_err(|_| anyhow::anyhow!("APP_DATABASE_URL is not set"))?;
    let config = db::DatabaseConfig::from_str(&database_url)?;
    let pool = db::connect(&config).await?;
    db::migrate(&pool).await?;

    let policy = db::settings::k_threshold(&pool).await?;
    let request = SnapshotRequest::annual(
        AcademicYear(args.year),
        args.locale,
        policy,
        jiff::Timestamp::now(),
    )?;
    let out_dir = args.out.unwrap_or_else(reports::default_out_dir);

    let record = generate_snapshot(&pool, &request, &out_dir).await?;
    println!(
        "snapshot {} (AY {}/{}, {}): {} pages\n  pdf:  {} (sha256 {})\n  xlsx: {} (sha256 {})",
        record.id,
        args.year,
        args.year + 1,
        request.locale.tag(),
        record.pages,
        record.pdf_path.display(),
        record.pdf_sha256,
        record.xlsx_path.display(),
        record.xlsx_sha256,
    );
    Ok(())
}

#[tokio::main]
async fn main() -> ExitCode {
    let args = match parse_args() {
        Ok(args) => args,
        Err(message) => {
            eprintln!("{message}");
            return ExitCode::from(2);
        }
    };
    if let Err(error) = run(args).await {
        eprintln!("report generation failed: {error:#}");
        return ExitCode::FAILURE;
    }
    ExitCode::SUCCESS
}
