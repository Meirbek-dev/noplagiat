//! The annual report scheduler against a real database (W4.2, ADR-005).
//!
//! The clock-arithmetic half lives in `scheduler`'s own unit tests, which need
//! no database. What needs one is the property that keeps a restart harmless:
//! the second tick for an academic year does nothing.
//!
//! As in `snapshots.rs`, the warehouse is left empty on purpose - what is under
//! test is the bookkeeping, not the figures, which `annual_tables.rs` pins.

use std::path::PathBuf;

use db::Pool;
use domain::AcademicYear;
use reports::scheduler::{ANNUAL_LOCALES, AnnualRun, finished_academic_year, run_annual_snapshots};
use reports::{Locale, SnapshotRequest, generate_snapshot};
use sqlx::PgPool;

/// The Sep 1 tick that follows the end of AY 2025/26.
const TICK: &str = "2026-09-01T03:00:00+05:00";

fn scratch(name: &str) -> PathBuf {
    let root =
        std::env::temp_dir().join(format!("noplagiat-scheduler-{}-{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&root);
    root
}

fn tick() -> jiff::Timestamp {
    TICK.parse().unwrap_or(jiff::Timestamp::UNIX_EPOCH)
}

#[sqlx::test(migrations = "../../migrations")]
async fn the_tick_generates_the_finished_year_once_and_then_skips(
    pool: PgPool,
) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let out_dir = scratch("idempotent");
    let at = tick();

    // The tick targets the year that just ended, not the one that just began.
    assert_eq!(finished_academic_year(at), AcademicYear(2025));

    let first = run_annual_snapshots(&pool, &out_dir, at)
        .await
        .unwrap_or_else(|error| panic!("first tick: {error}"));
    let AnnualRun::Generated(year, records) = first else {
        panic!("the first tick must generate, got {first:?}");
    };
    assert_eq!(year, AcademicYear(2025));
    assert_eq!(
        records.len(),
        ANNUAL_LOCALES.len(),
        "one snapshot per mandatory locale"
    );
    for record in &records {
        assert!(record.pdf_path.exists(), "{:?}", record.pdf_path);
        assert!(record.xlsx_path.exists(), "{:?}", record.xlsx_path);
    }

    // The period is the academic year, Sep 1 through Aug 31.
    let rows = db::snapshots::list(&pool, false, 50, 0)
        .await
        .unwrap_or_else(|error| panic!("listing snapshots: {error}"));
    assert_eq!(rows.len(), ANNUAL_LOCALES.len());
    for row in &rows {
        assert_eq!(row.kind, "annual");
        assert_eq!(row.period_start.to_string(), "2025-09-01");
        assert_eq!(row.period_end.to_string(), "2026-08-31");
        // TZ §4.5 / AGENTS.md §7: generation is never publication.
        assert!(!row.published, "the scheduler must not publish");
    }

    // Restart: the same tick, and a later one in the same academic year. Both
    // must find the year already generated and write nothing.
    for (label, when) in [
        ("same instant", at),
        (
            "a day later",
            "2026-09-02T03:00:00+05:00"
                .parse()
                .unwrap_or(jiff::Timestamp::UNIX_EPOCH),
        ),
    ] {
        let again = run_annual_snapshots(&pool, &out_dir, when)
            .await
            .unwrap_or_else(|error| panic!("{label}: {error}"));
        assert!(
            matches!(again, AnnualRun::AlreadyGenerated(AcademicYear(2025))),
            "{label}: expected a skip, got {again:?}"
        );
    }

    let after = db::snapshots::list(&pool, false, 50, 0)
        .await
        .unwrap_or_else(|error| panic!("listing snapshots: {error}"));
    assert_eq!(
        after.len(),
        ANNUAL_LOCALES.len(),
        "a repeated tick must not add rows"
    );

    let _ = std::fs::remove_dir_all(&out_dir);
    Ok(())
}

/// The crash-between-locales case: RU is on disk, the process died before KK.
///
/// Idempotency is per (academic year, locale) - with a year-wide check the
/// Kazakh copy of a mandatory report (TZ §7) would be lost until the next
/// September, because every later tick would find the year "already generated".
#[sqlx::test(migrations = "../../migrations")]
async fn a_half_generated_year_is_finished_rather_than_skipped(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let out_dir = scratch("half-generated");
    let at = tick();

    // The RU half of a tick that then died.
    let policy = db::settings::k_threshold(&pool)
        .await
        .unwrap_or_else(|error| panic!("the k policy reads: {error}"));
    let request = SnapshotRequest::annual(AcademicYear(2025), Locale::Ru, policy, at)
        .unwrap_or_else(|error| panic!("the academic year is a valid period: {error}"));
    let russian = generate_snapshot(&pool, &request, &out_dir)
        .await
        .unwrap_or_else(|error| panic!("the RU snapshot generates: {error}"));

    let run = run_annual_snapshots(&pool, &out_dir, at)
        .await
        .unwrap_or_else(|error| panic!("the recovering tick: {error}"));
    let AnnualRun::Generated(year, records) = run else {
        panic!("the missing locale must still be generated, got {run:?}");
    };
    assert_eq!(year, AcademicYear(2025));
    assert_eq!(records.len(), 1, "only the locale that was missing");

    let rows = db::snapshots::list(&pool, false, 50, 0)
        .await
        .unwrap_or_else(|error| panic!("listing snapshots: {error}"));
    let mut locales: Vec<&str> = rows
        .iter()
        .filter_map(|row| row.locale.as_deref())
        .collect();
    locales.sort_unstable();
    let mut mandatory: Vec<&str> = ANNUAL_LOCALES.iter().map(|locale| locale.tag()).collect();
    mandatory.sort_unstable();
    assert_eq!(
        locales, mandatory,
        "the year ends up with exactly one snapshot per mandatory locale"
    );
    assert!(
        rows.iter().any(|row| row.id == russian.id),
        "the RU snapshot that already existed must not be regenerated"
    );

    // The year is complete now, so the next tick writes nothing.
    let again = run_annual_snapshots(&pool, &out_dir, at)
        .await
        .unwrap_or_else(|error| panic!("the following tick: {error}"));
    assert!(
        matches!(again, AnnualRun::AlreadyGenerated(AcademicYear(2025))),
        "expected a skip, got {again:?}"
    );

    let _ = std::fs::remove_dir_all(&out_dir);
    Ok(())
}

/// The *next* academic year is a different period, so the following September
/// generates again rather than being skipped by the previous year's row.
#[sqlx::test(migrations = "../../migrations")]
async fn the_following_september_targets_the_next_year(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let out_dir = scratch("next-year");

    let first = run_annual_snapshots(&pool, &out_dir, tick())
        .await
        .unwrap_or_else(|error| panic!("2026 tick: {error}"));
    assert!(matches!(first, AnnualRun::Generated(AcademicYear(2025), _)));

    let next = run_annual_snapshots(
        &pool,
        &out_dir,
        "2027-09-01T03:00:00+05:00"
            .parse()
            .unwrap_or(jiff::Timestamp::UNIX_EPOCH),
    )
    .await
    .unwrap_or_else(|error| panic!("2027 tick: {error}"));
    assert!(
        matches!(next, AnnualRun::Generated(AcademicYear(2026), _)),
        "got {next:?}"
    );

    let _ = std::fs::remove_dir_all(&out_dir);
    Ok(())
}
