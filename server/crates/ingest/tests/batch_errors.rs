//! Batch-error surfacing (TZ §3.3.5, PLAN §1.4).
//!
//! Rejected rows are never silently dropped: they land in
//! `ingest_batches.errors` with a kind and a record index, and - the point of
//! the whole design - without a single character of the source text that caused
//! them (AGENTS.md invariant #1).
// `server/clippy.toml` already declares `allow-expect-in-tests`; that lint
// config reaches `#[test]` functions but not the helpers they call. A helper
// here exists only to fail the test loudly on a malformed fixture - it is not a
// request path, which is what the workspace lint protects.
#![expect(
    clippy::expect_used,
    reason = "test scaffolding: a malformed fixture must abort the test"
)]

mod support;

use sqlx::PgPool;
use support::{SourceRow, link};

async fn errors_of(pool: &PgPool, batch_id: i64) -> serde_json::Value {
    sqlx::query_scalar("SELECT errors FROM ingest_batches WHERE id = $1")
        .bind(batch_id)
        .fetch_one(pool)
        .await
        .expect("the batch row carries its error list")
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_shifted_row_is_rejected_by_position_and_kind(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    // The observed defect: «Статус» is missing, so the report URL lands in it
    // and everything after shifts left. The record still has 14 fields, which
    // is why a column *count* check alone would not catch it.
    let good = SourceRow::new("01.10.2025 09:00", "Курсовая работа по физике", &link(1, 1));
    let shifted = format!(
        "02.10.2025 09:00;Смещенная работа;Автор А.А.;80,00;1,00;2,00;3,00;\
         Проверяющий П.П.;p.checker@teachers.tou.edu.kz;Нет;Нет;{};0,50;",
        link(1, 2)
    );
    let documents = support::write_documents_raw(
        "shifted",
        &ingest::source_csv::DOCUMENTS_HEADER.join(";"),
        &[good.render(), shifted],
    );

    let summary = ingest::run_csv_file(&pool, &documents, "batch-errors", &support::pepper())
        .await
        .expect("a shifted row rejects the row, not the batch");

    assert_eq!(summary.rows_read, 2);
    assert_eq!(summary.rows_upserted, 1);
    assert_eq!(summary.rows_rejected, 1);
    assert_eq!(summary.status, ingest::BatchStatus::Succeeded);

    let errors = errors_of(&pool, summary.batch_id).await;
    assert_eq!(
        errors,
        serde_json::json!([{
            "row_index": 1,
            "kind": "column_shifted",
            "column": "Статус"
        }]),
        "a rejection is a position, a kind and a contract label - nothing else"
    );
}

#[sqlx::test(migrations = "../../migrations")]
async fn an_unparseable_report_link_is_rejected_never_guessed(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "bad-link",
        &[
            SourceRow::new("01.10.2025 09:00", "Курсовая работа по физике", &link(1, 1)),
            // Exactly the two shapes the real export shows.
            SourceRow::new("02.10.2025 09:00", "Битая ссылка A", ""),
            SourceRow::new(
                "03.10.2025 09:00",
                "Битая ссылка B",
                "https://noplagiat.tou.edu.kz/report/full/?userId=",
            ),
        ],
    );
    let summary = ingest::run_csv_file(&pool, &documents, "batch-errors", &support::pepper())
        .await
        .expect("bad links reject rows, not the batch");

    assert_eq!(summary.rows_rejected, 2);
    assert_eq!(summary.rows_upserted, 1);

    let errors = errors_of(&pool, summary.batch_id).await;
    assert_eq!(
        errors,
        serde_json::json!([
            {"row_index": 1, "kind": "unparseable_report_link", "column": "Ссылка на полный отчет"},
            {"row_index": 2, "kind": "unparseable_report_link", "column": "Ссылка на полный отчет"}
        ])
    );
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_header_mismatch_fails_the_whole_batch(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    // One renamed column. ADR-008 §1: the batch is rejected wholesale rather
    // than shifted silently into the wrong columns.
    let mut header = ingest::source_csv::DOCUMENTS_HEADER.to_vec();
    header[3] = "Оригинальность, %";
    let documents = support::write_documents_raw(
        "bad-header",
        &header.join(";"),
        &[SourceRow::new("01.10.2025 09:00", "Курсовая работа", &link(1, 1)).render()],
    );

    let error = ingest::run_csv_file(&pool, &documents, "bad-header", &support::pepper())
        .await
        .expect_err("a header mismatch must fail the batch");
    assert!(
        error.to_string().contains("Оригинальность"),
        "the message names the expected contract label: {error}"
    );

    // No fact was written, and the failure is recorded rather than lost.
    assert_eq!(support::count(&pool, "checks").await, 0);
    let batch: (String, serde_json::Value) =
        sqlx::query_as("SELECT status, errors FROM ingest_batches WHERE source = 'bad-header'")
            .fetch_one(&pool)
            .await
            .expect("the failed batch is still journalled");
    assert_eq!(batch.0, "failed");
    assert_eq!(batch.1[0]["kind"], serde_json::json!("header_mismatch"));
    assert_eq!(batch.1[0]["index"], serde_json::json!(3));
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_missing_column_fails_the_whole_batch(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let header = ingest::source_csv::DOCUMENTS_HEADER[..13].join(";");
    let documents = support::write_documents_raw("short-header", &header, &[]);

    let error = ingest::run_csv_file(&pool, &documents, "short-header", &support::pepper())
        .await
        .expect_err("a 13-column header is not the contract");
    assert!(error.to_string().contains("13"), "{error}");

    let status: String =
        sqlx::query_scalar("SELECT status FROM ingest_batches WHERE source = 'short-header'")
            .fetch_one(&pool)
            .await
            .expect("the failed batch is journalled");
    assert_eq!(status, "failed");
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_record_with_too_few_fields_is_rejected(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents_raw(
        "short-record",
        &ingest::source_csv::DOCUMENTS_HEADER.join(";"),
        &[
            SourceRow::new("01.10.2025 09:00", "Курсовая работа", &link(1, 1)).render(),
            "02.10.2025 09:00;Обрезанная строка;Автор".to_owned(),
        ],
    );
    let summary = ingest::run_csv_file(&pool, &documents, "short-record", &support::pepper())
        .await
        .expect("the batch survives one bad record");

    assert_eq!(
        summary.rows_read, 2,
        "iteration must not stop at the bad record"
    );
    assert_eq!(summary.rows_upserted, 1);
    assert_eq!(summary.rows_rejected, 1);

    let errors = errors_of(&pool, summary.batch_id).await;
    assert_eq!(errors[0]["kind"], serde_json::json!("column_shifted"));
    assert_eq!(errors[0]["row_index"], serde_json::json!(1));
    assert!(
        errors[0].get("column").is_none(),
        "a record-shape failure is not attributable to one column"
    );
}

/// Rows that are *valid but tricky* - quoted fields with `;`, embedded
/// newlines and escaped quotes - must parse, not reject.
#[sqlx::test(migrations = "../../migrations")]
async fn quoted_fields_with_delimiters_and_newlines_are_valid(pool: PgPool) {
    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "tricky",
        &[
            SourceRow::new("01.10.2025 09:00", "Курсовая работа", &link(1, 1))
                .authors("Иванов И.И.; Петров П.П."),
            SourceRow::new(
                "02.10.2025 09:00",
                "Дипломная работа\nв двух строках",
                &link(1, 2),
            ),
            SourceRow::new("03.10.2025 09:00", "Работа \"в кавычках\"", &link(1, 3)),
        ],
    );
    let summary = ingest::run_csv_file(&pool, &documents, "tricky", &support::pepper())
        .await
        .expect("ingest");

    assert_eq!(summary.rows_read, 3);
    assert_eq!(summary.rows_rejected, 0);
    assert_eq!(summary.rows_upserted, 3);
}
