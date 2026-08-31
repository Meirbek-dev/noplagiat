//! API mode against an in-memory source (ADR-010).
//!
//! The pages are built here rather than fetched, and each one is validated
//! against `contracts/ingest-source.schema.json`'s constraints before the test
//! feeds it to the pipeline - so "the fixture disagrees with the source" stays
//! a schema diff rather than a debugging session. API mode is therefore
//! testable before the source endpoint exists (PLAN R1a).
// `server/clippy.toml` already declares `allow-expect-in-tests`; that lint
// config reaches `#[test]` functions but not the helpers they call. A helper
// here exists only to fail the test loudly on a malformed fixture - it is not a
// request path, which is what the workspace lint protects.
#![expect(
    clippy::expect_used,
    reason = "test scaffolding: a malformed fixture must abort the test"
)]

mod support;

use std::sync::Mutex;

use ingest::{ApiError, Cursor, Page, SourceApi};
use sqlx::PgPool;

/// A `SourceApi` fed from pre-built pages, recording every cursor it was asked
/// for so cursor advancement is observable.
struct InMemorySource {
    pages: Vec<Page>,
    requested: Mutex<Vec<Option<Cursor>>>,
}

impl InMemorySource {
    fn new(pages: Vec<Page>) -> Self {
        Self {
            pages,
            requested: Mutex::new(Vec::new()),
        }
    }

    fn requested(&self) -> Vec<Option<Cursor>> {
        self.requested.lock().expect("cursor log").clone()
    }
}

impl SourceApi for InMemorySource {
    async fn fetch_page(&self, cursor: Option<&Cursor>, _limit: u32) -> Result<Page, ApiError> {
        self.requested
            .lock()
            .expect("cursor log")
            .push(cursor.cloned());

        // Pages are keyed by the cursor they follow, exactly as ADR-010 §2
        // specifies: the next page starts strictly after `(checked_at, check_id)`.
        let index = match cursor {
            None => 0,
            Some(cursor) => self
                .pages
                .iter()
                .position(|page| page.next_cursor.as_ref() == Some(cursor))
                .map_or(self.pages.len(), |position| position + 1),
        };
        Ok(self.pages.get(index).cloned().unwrap_or(Page {
            records: Vec::new(),
            next_cursor: None,
        }))
    }
}

/// Build a page and assert it satisfies the schema's constraints by
/// construction before it is used.
fn page(records: Vec<serde_json::Value>, last: bool) -> Page {
    let next_cursor = if last {
        serde_json::Value::Null
    } else {
        let final_record = records.last().expect("a non-final page has records");
        serde_json::json!({
            "checked_at": final_record["checked_at"],
            "check_id": final_record["check_id"],
        })
    };
    let raw = serde_json::json!({ "records": records, "next_cursor": next_cursor });
    validate_against_schema(&raw);
    serde_json::from_value(raw).expect("the page matches the wire type")
}

/// The constraints of `contracts/ingest-source.schema.json` that matter here.
fn validate_against_schema(page: &serde_json::Value) {
    const REQUIRED: [&str; 10] = [
        "check_id",
        "checked_at",
        "attempt_no",
        "work_type_code",
        "faculty_code",
        "department_code",
        "originality_pct",
        "status",
        "escalated",
        "initiator",
    ];
    const ALLOWED: [&str; 18] = [
        "check_id",
        "checked_at",
        "attempt_no",
        "work_type_code",
        "faculty_code",
        "department_code",
        "program_code",
        "originality_pct",
        "self_citation_pct",
        "citation_pct",
        "match_pct",
        "ai_content_pct",
        "status",
        "escalated",
        "suspicious",
        "suspicion_cleared",
        "initiator",
        "duration_seconds",
    ];
    let statuses = ["accepted", "needs_revision", "rejected", "recheck"];
    let initiators = ["student", "staff_self", "registrar", "other"];

    let object = page.as_object().expect("page is an object");
    assert!(object.contains_key("records") && object.contains_key("next_cursor"));
    assert_eq!(object.len(), 2, "additionalProperties: false on the page");

    for record in page["records"].as_array().expect("records is an array") {
        let fields = record.as_object().expect("record is an object");
        for key in REQUIRED {
            assert!(
                fields.contains_key(key),
                "required property `{key}` missing"
            );
        }
        for key in fields.keys() {
            assert!(
                ALLOWED.contains(&key.as_str()) || key == "deleted",
                "additionalProperties: false - unexpected `{key}`"
            );
        }
        let check_id = fields["check_id"].as_str().expect("check_id is a string");
        assert!((1..=256).contains(&check_id.chars().count()));
        assert!(!check_id.chars().any(|c| c.is_control()));

        let checked_at = fields["checked_at"]
            .as_str()
            .expect("checked_at is a string");
        assert!(
            checked_at.parse::<jiff::Timestamp>().is_ok(),
            "checked_at must be RFC 3339 with an explicit offset: {checked_at}"
        );
        assert!(fields["attempt_no"].as_i64().unwrap_or(0) >= 1);
        assert!(statuses.contains(&fields["status"].as_str().unwrap_or_default()));
        assert!(initiators.contains(&fields["initiator"].as_str().unwrap_or_default()));

        for key in [
            "originality_pct",
            "self_citation_pct",
            "citation_pct",
            "match_pct",
            "ai_content_pct",
        ] {
            let Some(value) = fields.get(key) else {
                continue;
            };
            if value.is_null() {
                continue;
            }
            let value = value.as_f64().expect("a percentage is a number");
            assert!((0.0..=100.0).contains(&value), "{key} out of range");
            assert!(
                ((value * 100.0).round() - value * 100.0).abs() < 1e-9,
                "{key} has more than two decimals"
            );
        }
        for key in ["work_type_code", "faculty_code", "department_code"] {
            let code = fields[key].as_str().expect("a dictionary code is a string");
            assert!((1..=128).contains(&code.len()));
            assert!(
                code.bytes()
                    .all(|b| b.is_ascii_alphanumeric() || b"._-".contains(&b)),
                "{key} must match the dictionary_code pattern"
            );
        }
    }
}

fn record(id: &str, checked_at: &str, attempt_no: i64) -> serde_json::Value {
    // The source assigns both the attempt number and the verdict (ADR-010 §3).
    let status = if attempt_no > 1 {
        "recheck"
    } else {
        "accepted"
    };
    serde_json::json!({
        "check_id": id,
        "checked_at": checked_at,
        "attempt_no": attempt_no,
        "work_type_code": "thesis_master",
        "faculty_code": "FAC01",
        "department_code": "DEP01",
        "program_code": null,
        "originality_pct": 88.5,
        "self_citation_pct": 1.25,
        "citation_pct": 6.4,
        "match_pct": 11.5,
        "ai_content_pct": 3.0,
        "status": status,
        "escalated": false,
        "suspicious": false,
        "suspicion_cleared": false,
        "initiator": "student",
        "duration_seconds": 42,
        "deleted": false
    })
}

fn three_pages() -> Vec<Page> {
    vec![
        page(
            vec![
                record("c-1", "2025-10-15T09:00:00+05:00", 1),
                record("c-2", "2025-10-15T09:00:00+05:00", 2),
            ],
            false,
        ),
        page(vec![record("c-3", "2025-10-16T10:30:00+05:00", 1)], false),
        page(Vec::new(), true),
    ]
}

#[sqlx::test(migrations = "../../migrations")]
async fn a_paged_pull_stores_every_record_and_persists_the_cursor(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let source_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_sources (kind, base_url) VALUES ('api', 'https://example.invalid')
         RETURNING id",
    )
    .fetch_one(&pool)
    .await
    .expect("a configured api source");

    let api = InMemorySource::new(three_pages());
    let summary = ingest::run_api_source(&pool, source_id, "api-test", &api, 500)
        .await
        .expect("the pull succeeds");

    assert_eq!(summary.rows_read, 3);
    assert_eq!(summary.rows_upserted, 3);
    assert_eq!(summary.rows_rejected, 0);

    // The first request has no cursor; each later one carries the previous
    // page's `next_cursor`, and the run stops on `next_cursor: null`.
    let requested = api.requested();
    assert_eq!(requested.len(), 3);
    assert_eq!(requested[0], None);
    assert_eq!(
        requested[1].as_ref().map(|c| c.check_id.as_str()),
        Some("c-2")
    );
    assert_eq!(
        requested[2].as_ref().map(|c| c.check_id.as_str()),
        Some("c-3")
    );

    // End of stream stores `null`, so the next run starts from the beginning of
    // whatever is new rather than replaying the last page forever.
    let cursor: Option<serde_json::Value> =
        sqlx::query_scalar("SELECT cursor FROM ingest_sources WHERE id = $1")
            .bind(source_id)
            .fetch_one(&pool)
            .await
            .expect("cursor");
    assert_eq!(cursor, None);

    // No pepper, no HMAC: the derived references stay NULL (ADR-010 §4).
    let with_refs: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM checks WHERE work_ref IS NOT NULL OR reviewer_ref IS NOT NULL",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert_eq!(with_refs, 0);

    // `attempt_no` and the unit arrive natively; the source's own verdict is
    // authoritative (ADR-010 §3).
    let rows: Vec<(String, i32, String, i16)> = sqlx::query_as(
        "SELECT c.source_check_id, c.attempt_no, c.status::text, c.academic_year
         FROM checks c ORDER BY c.source_check_id",
    )
    .fetch_all(&pool)
    .await
    .expect("checks");
    assert_eq!(
        rows,
        vec![
            ("c-1".to_owned(), 1, "accepted".to_owned(), 2025),
            ("c-2".to_owned(), 2, "recheck".to_owned(), 2025),
            ("c-3".to_owned(), 1, "accepted".to_owned(), 2025),
        ]
    );

    let units: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM checks c
         JOIN faculties f ON f.id = c.faculty_id
         JOIN departments d ON d.id = c.department_id
         WHERE f.code = 'FAC01' AND d.code = 'DEP01'",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert_eq!(units, 3, "dictionary codes resolve to real units");
}

#[sqlx::test(migrations = "../../migrations")]
async fn re_running_the_same_pages_changes_nothing(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let source_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_sources (kind, base_url) VALUES ('api', 'https://example.invalid')
         RETURNING id",
    )
    .fetch_one(&pool)
    .await
    .expect("a configured api source");

    let first = ingest::run_api_source(
        &pool,
        source_id,
        "api-test",
        &InMemorySource::new(three_pages()),
        500,
    )
    .await
    .expect("first pull");
    let pairs_first = support::attempt_pairs(&pool).await;

    let second = ingest::run_api_source(
        &pool,
        source_id,
        "api-test",
        &InMemorySource::new(three_pages()),
        500,
    )
    .await
    .expect("second pull");
    let pairs_second = support::attempt_pairs(&pool).await;

    assert_eq!(first.rows_read, second.rows_read);
    assert_eq!(first.rows_upserted, second.rows_upserted);
    assert_eq!(pairs_first, pairs_second);
    assert_eq!(support::count(&pool, "checks").await, 3);
}

/// A run that starts from a stored cursor resumes rather than replaying.
#[sqlx::test(migrations = "../../migrations")]
async fn a_stored_cursor_resumes_the_pull(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let source_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_sources (kind, base_url, cursor)
         VALUES ('api', 'https://example.invalid',
                 '{\"checked_at\": \"2025-10-15T09:00:00+05:00\", \"check_id\": \"c-2\"}')
         RETURNING id",
    )
    .fetch_one(&pool)
    .await
    .expect("a source mid-stream");

    let api = InMemorySource::new(three_pages());
    let summary = ingest::run_api_source(&pool, source_id, "api-test", &api, 500)
        .await
        .expect("the pull succeeds");

    assert_eq!(
        summary.rows_read, 1,
        "the first page is already behind the cursor"
    );
    assert_eq!(
        api.requested()[0].as_ref().map(|c| c.check_id.as_str()),
        Some("c-2")
    );
    assert_eq!(support::count(&pool, "checks").await, 1);
}

/// A record the schema forbids must fail the page rather than fill a column -
/// the closed property set is the anonymization assurance (ADR-010 §4).
#[sqlx::test(migrations = "../../migrations")]
async fn a_record_carrying_a_name_is_refused(_pool: PgPool) {
    let raw = serde_json::json!({
        "records": [{
            "check_id": "c-1",
            "checked_at": "2025-10-15T09:00:00+05:00",
            "attempt_no": 1,
            "work_type_code": "thesis_master",
            "faculty_code": "FAC01",
            "department_code": "DEP01",
            "originality_pct": 88.5,
            "status": "accepted",
            "escalated": false,
            "initiator": "student",
            "author": "Иванов Иван Иванович"
        }],
        "next_cursor": null
    });
    let error = serde_json::from_value::<Page>(raw).expect_err("the page must be refused");
    assert!(error.to_string().contains("unknown field"), "{error}");
}

/// An unknown dictionary code is a typed rejection, never a guess.
#[sqlx::test(migrations = "../../migrations")]
async fn an_unknown_dictionary_code_is_rejected(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let source_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_sources (kind, base_url) VALUES ('api', 'https://example.invalid')
         RETURNING id",
    )
    .fetch_one(&pool)
    .await
    .expect("a configured api source");

    let mut unknown = record("c-9", "2025-10-15T09:00:00+05:00", 1);
    unknown["faculty_code"] = serde_json::json!("FAC99");
    let api = InMemorySource::new(vec![page(vec![unknown], true)]);

    let summary = ingest::run_api_source(&pool, source_id, "api-test", &api, 500)
        .await
        .expect("one bad code does not fail the batch");
    assert_eq!(summary.rows_read, 1);
    assert_eq!(summary.rows_upserted, 0);
    assert_eq!(summary.rows_rejected, 1);

    let errors: serde_json::Value =
        sqlx::query_scalar("SELECT errors FROM ingest_batches WHERE id = $1")
            .bind(summary.batch_id)
            .fetch_one(&pool)
            .await
            .expect("errors");
    assert_eq!(
        errors,
        serde_json::json!([{"row_index": 0, "kind": "unknown_dictionary_code"}])
    );
}

/// `dict_aliases` resolves a label the dictionary itself does not carry.
#[sqlx::test(migrations = "../../migrations")]
async fn a_dictionary_alias_resolves_a_source_label(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    sqlx::query(
        "INSERT INTO dict_aliases (kind, source_label, target_id)
         SELECT 'faculty', 'ENGINEERING', id FROM faculties WHERE code = 'FAC01'",
    )
    .execute(&pool)
    .await
    .expect("an admin-maintained alias");

    let source_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_sources (kind, base_url) VALUES ('api', 'https://example.invalid')
         RETURNING id",
    )
    .fetch_one(&pool)
    .await
    .expect("a configured api source");

    let mut aliased = record("c-8", "2025-10-15T09:00:00+05:00", 1);
    aliased["faculty_code"] = serde_json::json!("ENGINEERING");
    let api = InMemorySource::new(vec![page(vec![aliased], true)]);

    let summary = ingest::run_api_source(&pool, source_id, "api-test", &api, 500)
        .await
        .expect("the alias resolves");
    assert_eq!(summary.rows_upserted, 1);
    assert_eq!(summary.rows_rejected, 0);

    let code: String =
        sqlx::query_scalar("SELECT f.code FROM checks c JOIN faculties f ON f.id = c.faculty_id")
            .fetch_one(&pool)
            .await
            .expect("faculty");
    assert_eq!(code, "FAC01");
}

/// «Удален» records are counted and stored, exactly as in CSV mode.
#[sqlx::test(migrations = "../../migrations")]
async fn deleted_records_are_counted_and_stored(pool: PgPool) {
    support::seed_dictionaries(&pool).await;
    let source_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_sources (kind, base_url) VALUES ('api', 'https://example.invalid')
         RETURNING id",
    )
    .fetch_one(&pool)
    .await
    .expect("a configured api source");

    let mut deleted = record("c-7", "2025-10-15T09:00:00+05:00", 1);
    deleted["deleted"] = serde_json::json!(true);
    let api = InMemorySource::new(vec![page(vec![deleted], true)]);

    let summary = ingest::run_api_source(&pool, source_id, "api-test", &api, 500)
        .await
        .expect("the pull succeeds");
    assert_eq!(summary.rows_skipped_deleted, 1);
    assert_eq!(summary.rows_upserted, 1);
    assert_eq!(support::count(&pool, "checks").await, 1);
}
