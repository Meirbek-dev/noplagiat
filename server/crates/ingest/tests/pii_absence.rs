//! **Acceptance evidence for TZ §6.1 / AGENTS.md invariant #1.**
//!
//! Ingest a source file whose titles, authors, reviewer names and e-mails are
//! deliberately name-shaped, then prove the markers exist nowhere afterwards:
//!
//! * (a) every `text`/`varchar`/`char`/`json`/`jsonb` column of every table in
//!   the schema is scanned - including `ingest_batches.errors`, the one place a
//!   naive importer would echo the offending row;
//! * (b) every line the run emitted through `tracing` is scanned, at `TRACE`
//!   level, with sqlx's own statement logging enabled.
//!
//! Zero hits is the pass condition. This file holds exactly one test because it
//! installs a process-global tracing subscriber.

mod support;

use std::io::Write;
use std::sync::{Arc, Mutex};

use sqlx::PgPool;
use support::{SourceRow, link};

/// Name-shaped markers. If any of these survives ingestion in a readable
/// column or a log line, the warehouse holds personal data.
const MARKERS: [&str; 7] = [
    "Иванов Иван Иванович",
    "Петрова Мария Сергеевна",
    "ivanov.ii@teachers.tou.edu.kz",
    "petrova.ms@teachers.tou.edu.kz",
    "Диссертация Иванова о морфологии почв",
    "Ivanov",
    "Petrova",
];

/// A `MakeWriter` that appends every emitted line to a shared buffer.
#[derive(Clone)]
struct CapturedLog(Arc<Mutex<Vec<u8>>>);

impl Write for CapturedLog {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        if let Ok(mut sink) = self.0.lock() {
            sink.extend_from_slice(buf);
        }
        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

impl<'a> tracing_subscriber::fmt::MakeWriter<'a> for CapturedLog {
    type Writer = Self;

    fn make_writer(&'a self) -> Self::Writer {
        self.clone()
    }
}

#[sqlx::test(migrations = "../../migrations")]
async fn no_marker_reaches_a_column_or_a_log_line(pool: PgPool) {
    let captured = Arc::new(Mutex::new(Vec::new()));
    let subscriber = tracing_subscriber::fmt()
        .with_writer(CapturedLog(Arc::clone(&captured)))
        .with_max_level(tracing::Level::TRACE)
        .with_ansi(false)
        .finish();
    // One test per binary, so a process-global default is safe and captures
    // everything the ingest emits - including sqlx's statement logging.
    let _ = tracing::subscriber::set_global_default(subscriber);

    support::seed_dictionaries(&pool).await;

    let documents = support::write_documents(
        "pii-markers",
        &[
            SourceRow::new(
                "01.10.2025 09:00",
                "Диссертация Иванова о морфологии почв",
                &link(9, 900),
            )
            .authors("Иванов Иван Иванович")
            .reviewer("Петрова Мария Сергеевна", "petrova.ms@teachers.tou.edu.kz"),
            // A second row through the *rejection* path: a rejection payload is
            // where source text is most tempting to include.
            SourceRow::new(
                "02.10.2025 09:00",
                "Диссертация Иванова о морфологии почв",
                "",
            )
            .authors("Иванов Иван Иванович")
            .reviewer("Иванов Иван Иванович", "ivanov.ii@teachers.tou.edu.kz"),
            // …and a third through the «Удален» path.
            SourceRow::new(
                "03.10.2025 09:00",
                "Диссертация Иванова о морфологии почв",
                &link(9, 902),
            )
            .authors("Петрова Мария Сергеевна")
            .reviewer("Петрова Мария Сергеевна", "petrova.ms@teachers.tou.edu.kz")
            .deleted(),
        ],
    );

    let summary = ingest::run_csv_file(&pool, &documents, "pii-absence", &support::pepper())
        .await
        .expect("ingest");
    assert_eq!(summary.rows_read, 3);
    assert_eq!(summary.rows_rejected, 1, "the crafted bad link is rejected");
    assert_eq!(summary.rows_upserted, 2);
    assert_eq!(summary.rows_skipped_deleted, 1);

    // ── (a) every readable column of every table ────────────────────────────
    let columns: Vec<(String, String)> = sqlx::query_as(
        "SELECT c.table_name::text, c.column_name::text
         FROM information_schema.columns c
         JOIN information_schema.tables t
           ON t.table_schema = c.table_schema AND t.table_name = c.table_name
         WHERE c.table_schema = current_schema()
           AND t.table_type = 'BASE TABLE'
           AND c.data_type IN ('text', 'character varying', 'character', 'json', 'jsonb')
         ORDER BY 1, 2",
    )
    .fetch_all(&pool)
    .await
    .expect("the information schema is readable");
    assert!(
        columns.len() > 20,
        "the scan must actually cover the schema, found {}",
        columns.len()
    );

    let mut hits: Vec<String> = Vec::new();
    for (table, column) in &columns {
        for marker in MARKERS {
            let sql = format!(
                "SELECT count(*) FROM \"{}\" WHERE \"{}\"::text ILIKE $1",
                table.replace('"', "\"\""),
                column.replace('"', "\"\"")
            );
            let found: i64 = sqlx::query_scalar(sqlx::AssertSqlSafe(sql))
                .bind(format!("%{marker}%"))
                .fetch_one(&pool)
                .await
                .unwrap_or_else(|error| panic!("scanning {table}.{column}: {error}"));
            if found > 0 {
                hits.push(format!("{table}.{column} × {found}"));
            }
        }
    }
    assert!(
        hits.is_empty(),
        "TZ §6.1: personal data reached the warehouse in {hits:?}"
    );

    // ── (b) every log line the run emitted ──────────────────────────────────
    let logs = String::from_utf8_lossy(&captured.lock().expect("log buffer").clone()).into_owned();
    assert!(
        !logs.is_empty(),
        "the subscriber captured nothing - the scan would prove nothing"
    );
    for marker in MARKERS {
        assert!(
            !logs.contains(marker),
            "TZ §6.1: `{marker}` was written to a log line"
        );
    }

    // The facts themselves did land - a scan that finds nothing because
    // nothing was ingested proves nothing.
    assert_eq!(support::count(&pool, "checks").await, 2);
    let refs: i64 =
        sqlx::query_scalar("SELECT count(*) FROM checks WHERE octet_length(work_ref) = 32")
            .fetch_one(&pool)
            .await
            .expect("count");
    assert_eq!(refs, 2, "the works are identified by digest, not by title");

    // The rejection is on record - with a position and a kind, and no text.
    let errors: serde_json::Value =
        sqlx::query_scalar("SELECT errors FROM ingest_batches WHERE id = $1")
            .bind(summary.batch_id)
            .fetch_one(&pool)
            .await
            .expect("errors");
    assert_eq!(
        errors,
        serde_json::json!([{
            "row_index": 1,
            "kind": "unparseable_report_link",
            "column": "Ссылка на полный отчет"
        }])
    );
}
