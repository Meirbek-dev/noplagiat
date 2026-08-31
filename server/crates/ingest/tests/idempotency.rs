//! Idempotency and attempt derivation (TZ §3.3.4, ADR-008 §3/§4).
//!
//! `ON CONFLICT (source_check_id, attempt_no) DO UPDATE` only makes a re-run a
//! no-op if the *attempt numbers* are reproduced identically - which is why the
//! ladder is computed over the union of the warehouse rows and the batch rows,
//! not over the batch alone.

mod support;

use sqlx::PgPool;
use support::{SourceRow, link};

#[sqlx::test(migrations = "../../migrations")]
async fn re_running_a_year_changes_nothing(pool: PgPool) {
    support::seed_all(&pool).await;
    let documents = support::documents("2025-2026");
    let pepper = support::pepper();

    let first = ingest::run_csv_file(&pool, &documents, "idempotency", &pepper)
        .await
        .expect("first run");
    let after_first = support::count(&pool, "checks").await;
    let pairs_first = support::attempt_pairs(&pool).await;

    let second = ingest::run_csv_file(&pool, &documents, "idempotency", &pepper)
        .await
        .expect("second run");
    let after_second = support::count(&pool, "checks").await;
    let pairs_second = support::attempt_pairs(&pool).await;

    assert_eq!(
        first.rows_read, second.rows_read,
        "the same file always reads the same number of records"
    );
    assert_eq!(
        first.rows_upserted, second.rows_upserted,
        "the second run upserts the same rows, it does not add any"
    );
    assert_eq!(first.rows_rejected, second.rows_rejected);
    assert_eq!(first.rows_skipped_deleted, second.rows_skipped_deleted);
    assert_eq!(after_first, after_second, "no new rows on the second run");
    assert_eq!(
        pairs_first, pairs_second,
        "the (source_check_id, attempt_no) set must be identical"
    );

    // Both runs are recorded - the journal is per run, not per file.
    let batches: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM ingest_batches WHERE source = 'idempotency' AND status = 'succeeded'",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert_eq!(batches, 2);
}

/// The ladder is 1-based, ordered by `(checked_at, source_check_id)`, and the
/// status ladder rides on it: attempt > 1 → recheck (ADR-008 §3, §4).
#[sqlx::test(migrations = "../../migrations")]
async fn attempts_are_numbered_within_a_work(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "ladder",
        &[
            SourceRow::new(
                "01.10.2025 09:00",
                "Курсовая работа по физике",
                &link(1, 100),
            )
            .originality("60,00"),
            SourceRow::new(
                "15.10.2025 09:00",
                "Курсовая работа по физике",
                &link(1, 101),
            )
            .originality("75,00"),
            // A different work at the same minute: its own ladder starts at 1.
            SourceRow::new(
                "15.10.2025 09:00",
                "Дипломная работа по химии",
                &link(1, 102),
            ),
        ],
    );
    ingest::run_csv_file(&pool, &documents, "ladder", &support::pepper())
        .await
        .expect("ingest");

    let rows: Vec<(String, i32, String)> = sqlx::query_as(
        "SELECT source_check_id, attempt_no, status::text FROM checks ORDER BY source_check_id",
    )
    .fetch_all(&pool)
    .await
    .expect("checks");

    assert_eq!(
        rows,
        vec![
            // 60 % on the first attempt is below the 70 % threshold.
            ("1:100".to_owned(), 1, "needs_revision".to_owned()),
            ("1:101".to_owned(), 2, "recheck".to_owned()),
            ("1:102".to_owned(), 1, "accepted".to_owned()),
        ]
    );
}

/// Two attempts sharing one report link (≈2 % of rechecked works in the legacy
/// export) must stay two facts, distinguished by `attempt_no`.
#[sqlx::test(migrations = "../../migrations")]
async fn a_shared_report_link_still_yields_two_attempts(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "shared-link",
        &[
            SourceRow::new("01.10.2025 09:00", "Отчет по НИР № 5", &link(2, 200)),
            SourceRow::new("20.10.2025 09:00", "Отчет по НИР № 5", &link(2, 200)),
        ],
    );
    let summary = ingest::run_csv_file(&pool, &documents, "shared-link", &support::pepper())
        .await
        .expect("ingest");

    assert_eq!(summary.rows_upserted, 2);
    assert_eq!(
        support::attempt_pairs(&pool).await,
        vec![("2:200".to_owned(), 1), ("2:200".to_owned(), 2)]
    );
}

/// A later batch continues an existing ladder rather than restarting it.
#[sqlx::test(migrations = "../../migrations")]
async fn a_later_batch_continues_the_ladder(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let pepper = support::pepper();

    let first = support::write_documents(
        "cross-batch-1",
        &[SourceRow::new(
            "01.10.2025 09:00",
            "Магистерская диссертация по экономике",
            &link(3, 300),
        )],
    );
    ingest::run_csv_file(&pool, &first, "cross-batch", &pepper)
        .await
        .expect("first batch");

    let second = support::write_documents(
        "cross-batch-2",
        &[SourceRow::new(
            "20.10.2025 09:00",
            "Магистерская диссертация по экономике",
            &link(3, 301),
        )],
    );
    ingest::run_csv_file(&pool, &second, "cross-batch", &pepper)
        .await
        .expect("second batch");

    let rows: Vec<(String, i32, String)> = sqlx::query_as(
        "SELECT source_check_id, attempt_no, status::text FROM checks ORDER BY attempt_no",
    )
    .fetch_all(&pool)
    .await
    .expect("checks");
    assert_eq!(
        rows,
        vec![
            ("3:300".to_owned(), 1, "accepted".to_owned()),
            ("3:301".to_owned(), 2, "recheck".to_owned()),
        ]
    );
}

/// A late-arriving *earlier* attempt renumbers the stored ladder - otherwise
/// the work would carry two `attempt_no = 1` rows and TZ §4.2 §6's recheck rate
/// would be wrong.
#[sqlx::test(migrations = "../../migrations")]
async fn a_late_earlier_attempt_renumbers_the_stored_row(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let pepper = support::pepper();

    let late = support::write_documents(
        "renumber-late",
        &[SourceRow::new(
            "20.10.2025 09:00",
            "Научная статья о сплавах",
            &link(4, 401),
        )],
    );
    ingest::run_csv_file(&pool, &late, "renumber", &pepper)
        .await
        .expect("first batch");
    assert_eq!(
        support::attempt_pairs(&pool).await,
        vec![("4:401".to_owned(), 1)]
    );

    let early = support::write_documents(
        "renumber-early",
        &[SourceRow::new(
            "01.10.2025 09:00",
            "Научная статья о сплавах",
            &link(4, 400),
        )],
    );
    ingest::run_csv_file(&pool, &early, "renumber", &pepper)
        .await
        .expect("second batch");

    let rows: Vec<(String, i32, String)> = sqlx::query_as(
        "SELECT source_check_id, attempt_no, status::text FROM checks ORDER BY attempt_no",
    )
    .fetch_all(&pool)
    .await
    .expect("checks");
    assert_eq!(
        rows,
        vec![
            ("4:400".to_owned(), 1, "accepted".to_owned()),
            // The stored row moved to 2, and its status moved with it.
            ("4:401".to_owned(), 2, "recheck".to_owned()),
        ]
    );
}

/// «Удален» rows are upserted with `deleted = true`, never dropped, so
/// `settings.exclude_deleted` stays a pure query-time toggle.
#[sqlx::test(migrations = "../../migrations")]
async fn deleted_rows_are_stored_and_counted(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "deleted",
        &[
            SourceRow::new(
                "01.10.2025 09:00",
                "Курсовая работа по химии",
                &link(5, 500),
            ),
            SourceRow::new("02.10.2025 09:00", "Отозванная работа", &link(5, 501)).deleted(),
        ],
    );
    let summary = ingest::run_csv_file(&pool, &documents, "deleted", &support::pepper())
        .await
        .expect("ingest");

    assert_eq!(summary.rows_read, 2);
    assert_eq!(summary.rows_skipped_deleted, 1);
    assert_eq!(
        summary.rows_upserted, 2,
        "the deleted row is still a fact row"
    );

    let stored: i64 = sqlx::query_scalar("SELECT count(*) FROM checks WHERE deleted")
        .fetch_one(&pool)
        .await
        .expect("count");
    assert_eq!(stored, 1);
}

/// The status ladder's remaining rungs, end to end through the database.
#[sqlx::test(migrations = "../../migrations")]
async fn the_status_ladder_is_applied_on_ingest(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "ladder-rungs",
        &[
            // suspicious ∧ ¬cleared → rejected + escalated, whatever the score.
            SourceRow::new("01.10.2025 09:00", "Работа A", &link(6, 600))
                .originality("99,00")
                .suspicious(true, false),
            // a cleared suspicion falls through the rung.
            SourceRow::new("01.10.2025 09:01", "Работа B", &link(6, 601))
                .originality("99,00")
                .suspicious(true, true),
            // below the threshold.
            SourceRow::new("01.10.2025 09:02", "Работа C", &link(6, 602)).originality("69,99"),
            // exactly at the threshold is not below it.
            SourceRow::new("01.10.2025 09:03", "Работа D", &link(6, 603)).originality("70,00"),
        ],
    );
    ingest::run_csv_file(&pool, &documents, "ladder-rungs", &support::pepper())
        .await
        .expect("ingest");

    let rows: Vec<(String, String, bool)> = sqlx::query_as(
        "SELECT source_check_id, status::text, escalated FROM checks ORDER BY source_check_id",
    )
    .fetch_all(&pool)
    .await
    .expect("checks");
    assert_eq!(
        rows,
        vec![
            ("6:600".to_owned(), "rejected".to_owned(), true),
            ("6:601".to_owned(), "accepted".to_owned(), false),
            ("6:602".to_owned(), "needs_revision".to_owned(), false),
            ("6:603".to_owned(), "accepted".to_owned(), false),
        ]
    );
}
