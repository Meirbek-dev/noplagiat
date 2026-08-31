//! Annual report scheduling (TZ §4.5, docs/PLAN.md W4.2, ADR-005).
//!
//! On September 1 - the first day of a new academic year - the Приложение-1
//! snapshot for the year that just finished is generated in both formats and
//! both mandatory locales, and recorded in `report_snapshots`. It is **not**
//! published: publication is an explicit administrative act (AGENTS.md §7,
//! `db::snapshots::set_published`), and this task never performs it.
//!
//! # Why this mirrors `ingest::scheduler`
//!
//! Same shape, same reasons (ADR-005): one deployable, one log stream, and a
//! Postgres advisory lock instead of an external scheduler, so several replicas
//! may tick in the same minute and only one writes. The key is deliberately
//! *distinct* from the ingest lock - the nightly 02:00 ingest and the 03:00
//! annual generation are hours apart by design, but a slow ingest on Sep 1 must
//! not block report generation, nor the reverse.
//!
//! # Idempotency across restarts
//!
//! The lock only settles a race between live runners. What makes a restart
//! harmless is the existence check, and its unit is the **(academic year,
//! locale) pair**, not the academic year: a tick generates exactly the locales
//! of [`ANNUAL_LOCALES`] that the year does not already have. Both RU and KK are
//! mandatory (TZ §7) and are rendered one after the other, so a crash in between
//! must not be able to lose the second one - with a year-wide check it was lost
//! for good, since the tick fires once a year and every later tick found the
//! year "already generated".
//!
//! The locale of a snapshot is `report_snapshots.locale` (migration 0005). A row
//! predating that column carries `NULL`, which cannot be attributed to a locale
//! and is therefore read as covering the year in all of them - the pre-0005
//! behaviour, so the column can never cause a duplicate generation of a snapshot
//! that is already on disk.

use std::path::{Path, PathBuf};
use std::time::Duration;

use db::Pool;
use domain::AcademicYear;

use crate::ReportError;
use crate::locale::Locale;
use crate::snapshot::{
    SnapshotKind, SnapshotRecord, SnapshotRequest, generate_snapshot, to_sql_date,
};

/// Advisory-lock key for the annual report job.
///
/// Distinct from `ingest::INGEST_ADVISORY_LOCK` (`0x6E70_6C67_0000_0001`) on
/// purpose: the two jobs are independent, and sharing a key would make a long
/// ingest and a long report render block each other for no reason.
pub const ANNUAL_REPORT_ADVISORY_LOCK: i64 = 0x6E70_6C67_0000_0002;

/// The university's fixed civil offset (+05:00). The tick is expressed in local
/// time for the same reason `checks.academic_year` is: «1 сентября» means the
/// local calendar day, not a UTC instant.
const UNIVERSITY_OFFSET_HOURS: i8 = 5;

/// Local hour of the annual tick. An hour after the nightly ingest tick
/// (`ingest::scheduler::NIGHTLY_HOUR` = 02:00), so the newly finished academic
/// year has been fed before it is reported on.
pub const ANNUAL_HOUR: i8 = 3;

/// Local month of the annual tick - September.
const ANNUAL_MONTH: i8 = 9;

/// Local day of the annual tick - the 1st.
const ANNUAL_DAY: i8 = 1;

/// Longest single nap the loop takes.
///
/// The wait to the next September 1 is up to a year, and a year-long timer is a
/// bad bet: a suspended host, a corrected clock or a leap second all invalidate
/// it, and `tokio`'s timer wheel is not the place to store one. The loop naps in
/// bounded steps and recomputes the target from the wall clock each time, so the
/// tick survives anything that moves the clock.
pub const MAX_NAP: Duration = Duration::from_secs(6 * 60 * 60);

/// The locales the annual report is generated in.
///
/// TZ §7 makes Russian and Kazakh mandatory and English merely desirable; the
/// scheduled artefact is the one handed to Комплаенс, so it ships the two
/// mandatory locales and nothing else. An English copy is a manual generation.
pub const ANNUAL_LOCALES: [Locale; 2] = [Locale::Ru, Locale::Kk];

/// What one tick did.
#[derive(Debug)]
pub enum AnnualRun {
    /// Another runner holds the advisory lock and is doing exactly this work.
    Locked,
    /// Every locale in [`ANNUAL_LOCALES`] already has an `annual` snapshot for
    /// this academic year.
    AlreadyGenerated(AcademicYear),
    /// One record per locale that was *missing*, each carrying both formats -
    /// all of [`ANNUAL_LOCALES`] on a first run, only the tail of it after a
    /// crash that interrupted one.
    Generated(AcademicYear, Vec<SnapshotRecord>),
}

fn offset() -> jiff::tz::Offset {
    jiff::tz::Offset::constant(UNIVERSITY_OFFSET_HOURS)
}

/// `sqlx` errors reach this crate through `db`'s error type, which is the only
/// database error `ReportError` knows about.
fn db_error(error: sqlx::Error) -> ReportError {
    ReportError::Db(db::DbError::Sqlx(error))
}

/// The academic year that most recently *finished* at `now`.
///
/// [`AcademicYear::from_date`] names the year in progress, so the finished one is
/// always the one before it: at 2026-09-01 the year in progress is 2026/27 and
/// the finished one is 2025/26. Defined for every instant, not just the tick, so
/// a manual invocation of [`run_annual_snapshots`] on any day targets the last
/// complete year rather than a partial one.
#[must_use]
pub fn finished_academic_year(now: jiff::Timestamp) -> AcademicYear {
    let AcademicYear(in_progress) = AcademicYear::from_date(offset().to_datetime(now).date());
    AcademicYear(in_progress - 1)
}

/// Time until the next September 1 at [`ANNUAL_HOUR`] local, strictly positive.
///
/// Strictly positive matters: returning zero at the tick instant would make the
/// loop spin, and the September 1 tick is the one moment when the loop is
/// guaranteed to be awake.
#[must_use]
pub fn duration_until_next_tick(now: jiff::Timestamp) -> Duration {
    // A minute is the fallback everywhere below: a clock this crate cannot
    // reason about is a reason to look again soon, never a reason to stop.
    const RETRY: Duration = Duration::from_secs(60);

    let offset = offset();
    let local = offset.to_datetime(now);
    let target_for = |year: i16| {
        jiff::civil::Date::new(year, ANNUAL_MONTH, ANNUAL_DAY)
            .map(|date| date.at(ANNUAL_HOUR, 0, 0, 0))
            .ok()
    };

    let Some(this_year) = target_for(local.date().year()) else {
        return RETRY;
    };
    let target = if this_year > local {
        this_year
    } else {
        match target_for(local.date().year() + 1) {
            Some(next_year) => next_year,
            None => return RETRY,
        }
    };

    match offset.to_timestamp(target) {
        Ok(target) => {
            let seconds = target.as_second() - now.as_second();
            Duration::from_secs(u64::try_from(seconds).unwrap_or(60).max(1))
        }
        Err(_) => RETRY,
    }
}

/// How long the loop naps next, and whether waking from that nap *is* the tick.
///
/// Exposed so the boundary behaviour is testable against an injected clock
/// without a timer: the loop below contains no scheduling logic of its own, so a
/// test that drives this function drives the real thing.
#[must_use]
pub fn next_nap(now: jiff::Timestamp) -> (Duration, bool) {
    let wait = duration_until_next_tick(now);
    if wait <= MAX_NAP {
        (wait, true)
    } else {
        (MAX_NAP, false)
    }
}

/// Generate the annual snapshot for the academic year that finished before
/// `generated_at`, unless one already exists.
///
/// The advisory lock is transaction-scoped and taken with `pg_try_…`: a runner
/// that does not get it returns [`AnnualRun::Locked`] instead of queueing, since
/// the holder is generating the very snapshot this call would then find already
/// present. The lock is released on commit - or on the rollback that dropping
/// the transaction performs when generation fails - so a crashed runner never
/// leaves it held.
pub async fn run_annual_snapshots(
    pool: &Pool,
    out_dir: &Path,
    generated_at: jiff::Timestamp,
) -> Result<AnnualRun, ReportError> {
    let academic_year = finished_academic_year(generated_at);
    let policy = db::settings::k_threshold(pool).await?;

    let mut tx = pool.begin().await.map_err(db_error)?;
    let acquired = sqlx::query_scalar!(
        "SELECT pg_try_advisory_xact_lock($1)",
        ANNUAL_REPORT_ADVISORY_LOCK
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(db_error)?
    .unwrap_or(false);
    if !acquired {
        return Ok(AnnualRun::Locked);
    }

    // The period is a property of the academic year, so any locale's request
    // names it; what the probe reads back is which locales it was rendered in.
    let probe = SnapshotRequest::annual(academic_year, Locale::Ru, policy, generated_at)?;
    let covered = sqlx::query_scalar!(
        // A `NULL` locale predates migration 0005 and cannot be attributed, so
        // it is read as covering every locale - see this module's header.
        "SELECT coalesce(locale, '*') AS \"locale!\"
           FROM report_snapshots
          WHERE kind = $1 AND period_start = $2 AND period_end = $3",
        SnapshotKind::Annual.as_str(),
        to_sql_date(probe.period.start())?,
        to_sql_date(probe.period.end())?,
    )
    .fetch_all(&mut *tx)
    .await
    .map_err(db_error)?;
    let generated = |locale: Locale| covered.iter().any(|tag| tag == "*" || tag == locale.tag());

    let mut records = Vec::with_capacity(ANNUAL_LOCALES.len());
    for locale in ANNUAL_LOCALES {
        if generated(locale) {
            continue;
        }
        let request = SnapshotRequest::annual(academic_year, locale, policy, generated_at)?;
        records.push(generate_snapshot(pool, &request, out_dir).await?);
    }
    if records.is_empty() {
        return Ok(AnnualRun::AlreadyGenerated(academic_year));
    }
    tx.commit().await.map_err(db_error)?;

    Ok(AnnualRun::Generated(academic_year, records))
}

/// The annual loop. Never returns; intended for `tokio::spawn`.
pub async fn run_forever(pool: Pool, out_dir: PathBuf) {
    loop {
        let (nap, is_tick) = next_nap(jiff::Timestamp::now());
        if is_tick {
            tracing::info!(seconds = nap.as_secs(), "next annual report tick scheduled");
        }
        tokio::time::sleep(nap).await;
        if !is_tick {
            continue;
        }
        match run_annual_snapshots(&pool, &out_dir, jiff::Timestamp::now()).await {
            Ok(AnnualRun::Generated(AcademicYear(year), records)) => tracing::info!(
                academic_year = year,
                snapshots = records.len(),
                "annual report snapshots generated (unpublished)"
            ),
            Ok(AnnualRun::AlreadyGenerated(AcademicYear(year))) => {
                tracing::info!(academic_year = year, "annual report already generated");
            }
            Ok(AnnualRun::Locked) => {
                tracing::info!("another runner holds the annual report lock");
            }
            // The message is built from typed variants only - no report content.
            Err(error) => tracing::error!(error = %error, "annual report tick failed"),
        }
    }
}

/// Spawn the annual report task (ADR-005).
///
/// The returned handle is detached by the server binary; the task logs its own
/// failures and never returns.
pub fn spawn_scheduler(pool: &Pool, out_dir: PathBuf) -> tokio::task::JoinHandle<()> {
    tokio::spawn(run_forever(pool.clone(), out_dir))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn at(text: &str) -> jiff::Timestamp {
        text.parse().unwrap_or(jiff::Timestamp::UNIX_EPOCH)
    }

    #[test]
    fn the_tick_is_september_first_at_three_in_the_morning_local() {
        // 23:00 on Aug 31 → four hours to go.
        assert_eq!(
            duration_until_next_tick(at("2026-08-31T23:00:00+05:00")).as_secs(),
            4 * 3_600
        );
        // One minute before.
        assert_eq!(
            duration_until_next_tick(at("2026-09-01T02:59:00+05:00")).as_secs(),
            60
        );
        // Exactly at the tick → the *next* year, never a zero-length sleep.
        // 2026-09-01 → 2027-09-01 spans no leap day (2027 is not a leap year and
        // February falls inside the span), so the wait is a plain 365 days.
        assert_eq!(
            duration_until_next_tick(at("2026-09-01T03:00:00+05:00")).as_secs(),
            365 * 86_400
        );
    }

    /// 22:00Z on Aug 31 is already 03:00 local on Sep 1 - the tick instant. A
    /// scheduler that reasoned in UTC would fire five hours late.
    #[test]
    fn the_tick_is_computed_in_local_time_not_utc() {
        assert_eq!(
            duration_until_next_tick(at("2026-08-31T21:59:00Z")).as_secs(),
            60
        );
    }

    #[test]
    fn the_wait_is_always_positive() {
        for day in ["2026-08-31", "2026-09-01", "2026-09-02", "2027-02-28"] {
            for hour in 0..24 {
                let stamp = format!("{day}T{hour:02}:30:00+05:00");
                assert!(duration_until_next_tick(at(&stamp)).as_secs() > 0);
            }
        }
    }

    #[test]
    fn the_finished_year_is_the_one_before_the_year_in_progress() {
        // At the tick, AY 2026/27 has just begun and AY 2025/26 has just ended.
        assert_eq!(
            finished_academic_year(at("2026-09-01T03:00:00+05:00")),
            AcademicYear(2025)
        );
        // The boundary is local midnight, not the tick hour: an hour *before*
        // the tick it is already Sep 1, so the answer is already 2025/26. The
        // tick fires at 03:00, comfortably inside that day, so the distinction
        // never matters in production - but a manual call at 00:30 on Sep 1
        // targets the year that ended overnight, which is the intent.
        assert_eq!(
            finished_academic_year(at("2026-09-01T00:30:00+05:00")),
            AcademicYear(2025)
        );
        // The last instant of the old academic year: 2025/26 is still in
        // progress, so the most recently finished one is 2024/25.
        assert_eq!(
            finished_academic_year(at("2026-08-31T23:59:59+05:00")),
            AcademicYear(2024)
        );
        // Mid-year, for a manual invocation.
        assert_eq!(
            finished_academic_year(at("2026-03-01T12:00:00+05:00")),
            AcademicYear(2024)
        );
    }

    /// Drive the real nap logic over a virtual year and count the firings. The
    /// loop body contains no scheduling of its own, so this is the loop.
    #[test]
    fn the_tick_fires_exactly_once_per_september_first() {
        let mut clock = at("2026-06-01T00:00:00+05:00");
        let stop = at("2027-01-01T00:00:00+05:00");
        let mut fired = Vec::new();

        // Bounded so a logic error cannot hang the test run: 214 days of
        // six-hour naps is ~856 steps, so 4 000 is generous headroom.
        for _ in 0..4_000 {
            if clock >= stop {
                break;
            }
            let (nap, is_tick) = next_nap(clock);
            let Ok(next) = clock.checked_add(nap) else {
                break;
            };
            clock = next;
            if is_tick {
                fired.push(clock);
            }
        }

        assert_eq!(fired.len(), 1, "expected one tick, got {fired:?}");
        assert_eq!(fired[0], at("2026-09-01T03:00:00+05:00"));
        assert_eq!(finished_academic_year(fired[0]), AcademicYear(2025));
    }

    /// A restart hours before the tick must still wake up on it, and a restart
    /// just after it must not immediately re-fire.
    #[test]
    fn a_restart_near_the_boundary_does_not_double_fire() {
        let (nap, is_tick) = next_nap(at("2026-09-01T00:30:00+05:00"));
        assert!(is_tick);
        assert_eq!(nap.as_secs(), 2 * 3_600 + 30 * 60);

        let (_, is_tick) = next_nap(at("2026-09-01T03:00:01+05:00"));
        assert!(!is_tick, "the next tick is a year away, not this nap");
    }

    #[test]
    fn the_annual_lock_key_differs_from_the_ingest_one() {
        // Hard-coded rather than imported: `reports` does not depend on
        // `ingest`, and the point of the test is that the two never collide.
        const INGEST_ADVISORY_LOCK: i64 = 0x6E70_6C67_0000_0001;
        assert_ne!(ANNUAL_REPORT_ADVISORY_LOCK, INGEST_ADVISORY_LOCK);
    }

    #[test]
    fn both_mandatory_locales_are_scheduled() {
        assert!(ANNUAL_LOCALES.contains(&Locale::Ru));
        assert!(ANNUAL_LOCALES.contains(&Locale::Kk));
    }
}
