//! Schema-level gates for migration 0002 (PLAN W1.1).
//!
//! These assert the guarantees the SQL is supposed to give the other lanes:
//! the sentinel dictionary rows exist, the derived-reference columns cannot
//! hold anything but a 32-byte digest, deleted rows never reach the aggregates,
//! the seeded settings parse into the `domain` types that consume them, and the
//! audit log is still append-only (AGENTS.md invariant #4).
//!
//! Deliberately written with the runtime `sqlx::query` API rather than the
//! compile-checked macros: `.sqlx/` offline data is owned by the db lane and
//! does not exist yet, and a schema gate must not require it.

use domain::{BucketBoundaries, SemesterBoundaries, StatusRules};
use sqlx::{PgPool, Row};

/// Read one `settings` row as raw JSON.
async fn setting(pool: &PgPool, key: &str) -> sqlx::Result<serde_json::Value> {
    sqlx::query_scalar("SELECT value FROM settings WHERE key = $1")
        .bind(key)
        .fetch_one(pool)
        .await
}

/// Insert a batch and one check, returning the check id.
async fn seed_check(pool: &PgPool, deleted: bool) -> sqlx::Result<i64> {
    let batch_id: i64 = sqlx::query_scalar(
        "INSERT INTO ingest_batches (source, mode) VALUES ('test', 'csv') RETURNING id",
    )
    .fetch_one(pool)
    .await?;

    sqlx::query_scalar(
        "INSERT INTO checks (
             source_check_id, attempt_no, checked_at, academic_year,
             work_type_id, faculty_id, department_id,
             originality_pct, status, initiator, ingest_batch_id, deleted
         )
         SELECT $1, 1, TIMESTAMPTZ '2025-10-15 09:00:00+05', 2025,
                (SELECT id FROM work_types WHERE code = 'other'),
                f.id, d.id, 88.50, 'accepted', 'other', $2, $3
         FROM faculties f
         JOIN departments d ON d.faculty_id = f.id
         WHERE f.code = 'UNASSIGNED' AND d.code = 'UNASSIGNED'
         RETURNING id",
    )
    .bind(format!("check-{}", i32::from(deleted)))
    .bind(batch_id)
    .bind(deleted)
    .fetch_one(pool)
    .await
}

#[sqlx::test(migrations = "../../migrations")]
async fn sentinel_dictionary_rows_keep_scope_filtering_total(pool: PgPool) -> sqlx::Result<()> {
    // Unmapped reviewers and unclassified titles resolve to these rows, so the
    // NOT NULL foreign keys on `checks` survive (ADR-008 §6, §7).
    let faculty = sqlx::query(
        "SELECT id, name_ru, name_kk, name_en FROM faculties WHERE code = 'UNASSIGNED'",
    )
    .fetch_one(&pool)
    .await?;
    assert_eq!(faculty.get::<String, _>("name_ru"), "Не распределено");
    assert_eq!(faculty.get::<String, _>("name_kk"), "Бөлінбеген");
    assert_eq!(faculty.get::<String, _>("name_en"), "Unassigned");

    let department = sqlx::query(
        "SELECT faculty_id, name_ru, name_kk FROM departments WHERE code = 'UNASSIGNED'",
    )
    .fetch_one(&pool)
    .await?;
    assert_eq!(
        department.get::<i64, _>("faculty_id"),
        faculty.get::<i64, _>("id"),
        "the sentinel department must hang off the sentinel faculty"
    );
    assert_eq!(department.get::<String, _>("name_ru"), "Не распределено");
    assert_eq!(department.get::<String, _>("name_kk"), "Бөлінбеген");

    let work_type =
        sqlx::query("SELECT name_ru, name_kk, name_en FROM work_types WHERE code = 'other'")
            .fetch_one(&pool)
            .await?;
    assert_eq!(work_type.get::<String, _>("name_ru"), "Иное");
    assert_eq!(work_type.get::<String, _>("name_kk"), "Өзге");
    assert_eq!(work_type.get::<String, _>("name_en"), "Other");

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn derived_references_must_be_full_digests(pool: PgPool) -> sqlx::Result<()> {
    let check_id = seed_check(&pool, false).await?;

    // 32 bytes is the only accepted length: a truncated digest would silently
    // collide across works (ADR-008 §2).
    let truncated = sqlx::query("UPDATE checks SET work_ref = decode('00ff', 'hex') WHERE id = $1")
        .bind(check_id)
        .execute(&pool)
        .await;
    assert!(truncated.is_err(), "a 2-byte work_ref must be rejected");

    let full = sqlx::query("UPDATE checks SET work_ref = decode($1, 'hex') WHERE id = $2")
        .bind("ab".repeat(32))
        .bind(check_id)
        .execute(&pool)
        .await?;
    assert_eq!(full.rows_affected(), 1);

    // NULL stays legal: API-mode rows carry the unit natively and need no
    // derived key.
    sqlx::query("UPDATE checks SET work_ref = NULL, reviewer_ref = NULL WHERE id = $1")
        .bind(check_id)
        .execute(&pool)
        .await?;

    let short_hmac = sqlx::query(
        "INSERT INTO staff_units (email_hmac, faculty_id, department_id, masked_label)
         SELECT decode('00', 'hex'), f.id, d.id, 'z***v.vn@teachers.tou.edu.kz'
         FROM faculties f JOIN departments d ON d.faculty_id = f.id
         WHERE f.code = 'UNASSIGNED' AND d.code = 'UNASSIGNED'",
    )
    .execute(&pool)
    .await;
    assert!(
        short_hmac.is_err(),
        "staff_units.email_hmac must be a full digest too"
    );

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn percentage_columns_stay_within_range(pool: PgPool) -> sqlx::Result<()> {
    let check_id = seed_check(&pool, false).await?;

    // sqlx 0.9 accepts only `&'static str` SQL, so the four columns are spelled
    // out rather than formatted into a template.
    let cases: [(&'static str, &'static str, &'static str, &'static str); 4] = [
        (
            "self_citation_pct",
            "UPDATE checks SET self_citation_pct = 100.01 WHERE id = $1",
            "UPDATE checks SET self_citation_pct = -0.01 WHERE id = $1",
            "UPDATE checks SET self_citation_pct = 12.34 WHERE id = $1",
        ),
        (
            "citation_pct",
            "UPDATE checks SET citation_pct = 100.01 WHERE id = $1",
            "UPDATE checks SET citation_pct = -0.01 WHERE id = $1",
            "UPDATE checks SET citation_pct = 12.34 WHERE id = $1",
        ),
        (
            "match_pct",
            "UPDATE checks SET match_pct = 100.01 WHERE id = $1",
            "UPDATE checks SET match_pct = -0.01 WHERE id = $1",
            "UPDATE checks SET match_pct = 12.34 WHERE id = $1",
        ),
        (
            "ai_content_pct",
            "UPDATE checks SET ai_content_pct = 100.01 WHERE id = $1",
            "UPDATE checks SET ai_content_pct = -0.01 WHERE id = $1",
            "UPDATE checks SET ai_content_pct = 12.34 WHERE id = $1",
        ),
    ];

    for (column, too_high, negative, valid) in cases {
        let rejected_high = sqlx::query(too_high).bind(check_id).execute(&pool).await;
        assert!(
            rejected_high.is_err(),
            "{column} must reject values above 100"
        );

        let rejected_negative = sqlx::query(negative).bind(check_id).execute(&pool).await;
        assert!(
            rejected_negative.is_err(),
            "{column} must reject negative values"
        );

        sqlx::query(valid).bind(check_id).execute(&pool).await?;
    }

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn deleted_rows_are_facts_but_never_metrics(pool: PgPool) -> sqlx::Result<()> {
    seed_check(&pool, false).await?;
    seed_check(&pool, true).await?;

    sqlx::query("REFRESH MATERIALIZED VIEW agg_monthly")
        .execute(&pool)
        .await?;

    let facts: i64 = sqlx::query_scalar("SELECT count(*) FROM checks")
        .fetch_one(&pool)
        .await?;
    // Migration 0002 kept «Удален» rows out of `agg_monthly` entirely; 0003
    // carries them as a `deleted` dimension instead, so that flipping
    // `settings.exclude_deleted` is a query-time predicate rather than a
    // matview rebuild. The invariant is unchanged - a deleted row must never
    // reach a metric (ADR-008 §4) - but it is now enforced one layer later, so
    // this gate asserts the metric, not the view body.
    let aggregated: i64 =
        sqlx::query_scalar("SELECT coalesce(sum(checks), 0)::bigint FROM agg_monthly")
            .fetch_one(&pool)
            .await?;
    let metric: i64 = sqlx::query_scalar(
        "SELECT coalesce(sum(checks), 0)::bigint FROM agg_monthly WHERE NOT deleted",
    )
    .fetch_one(&pool)
    .await?;

    assert_eq!(facts, 2);
    assert_eq!(
        aggregated, 2,
        "both rows are carried, partitioned by deleted"
    );
    assert_eq!(metric, 1, "the default metric excludes «Удален» rows");

    // The other two aggregates of 0003 exclude deleted rows unconditionally.
    sqlx::query("REFRESH MATERIALIZED VIEW agg_rechecks_yearly")
        .execute(&pool)
        .await?;
    let works: i64 =
        sqlx::query_scalar("SELECT coalesce(sum(works_total), 0)::bigint FROM agg_rechecks_yearly")
            .fetch_one(&pool)
            .await?;
    assert_eq!(works, 1);

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn seeded_settings_parse_into_the_domain_types(pool: PgPool) -> sqlx::Result<()> {
    // The migration seeds and the pinned defaults in `domain` are two
    // independent statements of ADR-008; this is where they have to agree.
    let boundaries =
        serde_json::from_value::<SemesterBoundaries>(setting(&pool, "semester_boundaries").await?)
            .map_err(|error| error.to_string());
    assert_eq!(boundaries, Ok(SemesterBoundaries::default()));

    let rules = serde_json::from_value::<StatusRules>(setting(&pool, "status_rules").await?)
        .map_err(|error| error.to_string());
    assert_eq!(rules, Ok(StatusRules::default()));

    let buckets =
        serde_json::from_value::<BucketBoundaries>(setting(&pool, "histogram_buckets").await?)
            .map_err(|error| error.to_string());
    assert_eq!(buckets, Ok(BucketBoundaries::default()));

    assert_eq!(
        setting(&pool, "exclude_deleted").await?,
        serde_json::json!(true)
    );
    assert_eq!(
        setting(&pool, "public_snapshot_quarter").await?,
        serde_json::json!("auto")
    );

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn audit_log_is_append_only(pool: PgPool) -> sqlx::Result<()> {
    let user_id: i64 =
        sqlx::query_scalar("INSERT INTO users (sso_subject) VALUES ('subject-1') RETURNING id")
            .fetch_one(&pool)
            .await?;

    sqlx::query(
        "INSERT INTO audit_log (user_id, role, action, section) VALUES ($1, 'dean', 'view', 'summary')",
    )
    .bind(user_id)
    .execute(&pool)
    .await?;

    // AGENTS.md invariant #4: enforced by trigger, independent of grants.
    let updated = sqlx::query("UPDATE audit_log SET action = 'tampered'")
        .execute(&pool)
        .await;
    assert!(updated.is_err(), "audit_log UPDATE must raise");

    let deleted = sqlx::query("DELETE FROM audit_log").execute(&pool).await;
    assert!(deleted.is_err(), "audit_log DELETE must raise");

    let rows: i64 = sqlx::query_scalar("SELECT count(*) FROM audit_log")
        .fetch_one(&pool)
        .await?;
    assert_eq!(rows, 1);

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn source_reality_tables_exist_with_their_constraints(pool: PgPool) -> sqlx::Result<()> {
    for table in [
        "staff_units",
        "work_type_rules",
        "initiator_rules",
        "ingest_sources",
        "source_control_totals",
    ] {
        let present: bool = sqlx::query_scalar("SELECT to_regclass($1) IS NOT NULL")
            .bind(table)
            .fetch_one(&pool)
            .await?;
        assert!(present, "migration 0002 must create {table}");
    }

    let bad_kind = sqlx::query("INSERT INTO ingest_sources (kind) VALUES ('ftp')")
        .execute(&pool)
        .await;
    assert!(bad_kind.is_err(), "ingest_sources.kind is api|csv only");

    sqlx::query("INSERT INTO ingest_sources (kind, base_url, cursor) VALUES ('api', 'https://noplagiat.tou.edu.kz', '{\"checked_at\": null, \"check_id\": null}')")
        .execute(&pool)
        .await?;

    sqlx::query(
        "INSERT INTO source_control_totals (academic_year, checks_total) VALUES (2024, 5457)",
    )
    .execute(&pool)
    .await?;
    let duplicate_year =
        sqlx::query("INSERT INTO source_control_totals (academic_year) VALUES (2024)")
            .execute(&pool)
            .await;
    assert!(
        duplicate_year.is_err(),
        "one control-total row per academic year"
    );

    // W1.5 reports «Удален» rows separately from rejections.
    let skipped: i32 = sqlx::query_scalar(
        "INSERT INTO ingest_batches (source, mode, rows_skipped_deleted) \
         VALUES ('csv-backfill', 'csv', 272) RETURNING rows_skipped_deleted",
    )
    .fetch_one(&pool)
    .await?;
    assert_eq!(skipped, 272);

    Ok(())
}
