//! Golden parse over the synthetic source fixture (slice W1.5 gate).
//!
//! The fixture reproduces the real export dialect of ADR-008 §1 - BOM,
//! `;`, decimal comma, RU dates, quoted fields carrying `;` and embedded
//! newlines - plus the four observed malformed shapes of PLAN §1.4. Its
//! `malformed.json` sidecar pins the exact expected counts and record indices,
//! so these assertions are equalities, not "some rows were rejected".

mod support;

use sqlx::PgPool;

#[sqlx::test(migrations = "../../migrations")]
async fn every_year_reproduces_its_sidecar_counts(pool: PgPool) {
    support::seed_all(&pool).await;
    let pepper = support::pepper();

    for year in support::SMALL_SCALE_YEARS {
        let expected = support::sidecar(year);
        let summary =
            ingest::run_csv_file(&pool, &support::documents(year), "golden-parse", &pepper)
                .await
                .unwrap_or_else(|error| panic!("{year}: {error}"));

        assert_eq!(
            summary.rows_read, expected.rows_total,
            "{year}: every logical record must be read, malformed ones included"
        );
        assert_eq!(
            summary.rows_rejected, expected.rows_rejected_expected,
            "{year}: rejections must match malformed.json exactly"
        );
        assert_eq!(
            summary.rows_skipped_deleted, expected.rows_deleted,
            "{year}: «Удален» rows are counted separately (ADR-008 §4)"
        );
        // Deleted rows are upserted with `deleted = true` rather than dropped,
        // so `exclude_deleted` stays a pure query-time toggle.
        assert_eq!(
            summary.rows_upserted,
            expected.rows_importable + expected.rows_deleted,
            "{year}: every well-formed record becomes a fact"
        );
        assert_eq!(summary.status, ingest::BatchStatus::Succeeded);
    }

    let total: u64 = support::SMALL_SCALE_YEARS
        .iter()
        .map(|year| {
            let sidecar = support::sidecar(year);
            sidecar.rows_importable + sidecar.rows_deleted
        })
        .sum();
    assert_eq!(support::count(&pool, "checks").await as u64, total);
}

#[sqlx::test(migrations = "../../migrations")]
async fn rejected_records_are_the_ones_the_sidecar_names(pool: PgPool) {
    support::seed_all(&pool).await;
    let year = "2025-2026";
    let expected = support::sidecar(year);

    let summary = ingest::run_csv_file(
        &pool,
        &support::documents(year),
        "golden-parse",
        &support::pepper(),
    )
    .await
    .expect("the year ingests");

    let errors: serde_json::Value =
        sqlx::query_scalar("SELECT errors FROM ingest_batches WHERE id = $1")
            .bind(summary.batch_id)
            .fetch_one(&pool)
            .await
            .expect("the batch row carries its error list");

    let entries = errors.as_array().expect("errors is a JSON array");
    let mut indices: Vec<u64> = entries
        .iter()
        .filter_map(|entry| entry["row_index"].as_u64())
        .collect();
    indices.sort_unstable();
    assert_eq!(
        indices, expected.row_indices,
        "the rejected record indices must be exactly the sidecar's"
    );

    let by_kind = |kind: &str| -> Vec<u64> {
        let mut found: Vec<u64> = entries
            .iter()
            .filter(|entry| entry["kind"] == serde_json::json!(kind))
            .filter_map(|entry| entry["row_index"].as_u64())
            .collect();
        found.sort_unstable();
        found
    };
    assert_eq!(
        by_kind("column_shifted"),
        expected.rejections.column_shifted.row_indices,
        "«Статус» carrying the report URL is a shift, never a guess"
    );
    assert_eq!(
        by_kind("unparseable_report_link"),
        expected.rejections.unparseable_report_link.row_indices,
        "a non-deleted row without a parseable link is a typed rejection"
    );
}

/// The derivations of ADR-008 §4/§6/§7 land as row values, not as NULLs.
#[sqlx::test(migrations = "../../migrations")]
async fn derived_columns_are_populated_for_every_fact(pool: PgPool) {
    support::seed_all(&pool).await;
    ingest::run_csv_file(
        &pool,
        &support::documents("2025-2026"),
        "golden-parse",
        &support::pepper(),
    )
    .await
    .expect("the year ingests");

    // Every fact carries both derived references (32 bytes each, enforced by
    // the CHECK constraints of migration 0002).
    let missing_refs: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM checks WHERE work_ref IS NULL OR reviewer_ref IS NULL",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert_eq!(missing_refs, 0, "CSV mode always derives both references");

    // The academic year comes from the +05:00 civil date, so a whole year
    // directory lands in exactly one academic year (fixtures/README.md §2).
    let years: Vec<i16> =
        sqlx::query_scalar("SELECT DISTINCT academic_year FROM checks ORDER BY 1")
            .fetch_all(&pool)
            .await
            .expect("academic years");
    assert_eq!(years, vec![2025]);

    // Unit attribution exists from AY 2025/26 (PLAN §1.2): the mapping must
    // actually bite, otherwise every faculty breakdown is a single bucket.
    let attributed: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM checks c
         JOIN faculties f ON f.id = c.faculty_id
         WHERE f.code <> 'UNASSIGNED'",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert!(
        attributed > 0,
        "staff_units must resolve reviewers to real faculties in AY 2025/26"
    );

    // Work-type classification: `other` is the documented fallback, not the
    // only outcome.
    let classified: i64 = sqlx::query_scalar(
        "SELECT count(DISTINCT w.code) FROM checks c
         JOIN work_types w ON w.id = c.work_type_id
         WHERE w.code <> 'other'",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert!(classified >= 5, "work_type_rules must classify real titles");

    // The status ladder produced more than one verdict, and every escalated
    // row is exactly a suspicious-and-uncleared one (ADR-008 §4).
    let statuses: Vec<String> =
        sqlx::query_scalar("SELECT DISTINCT status::text FROM checks ORDER BY 1")
            .fetch_all(&pool)
            .await
            .expect("statuses");
    assert!(
        statuses.len() > 1,
        "the ladder must not collapse: {statuses:?}"
    );

    let escalation_mismatch: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM checks
         WHERE escalated <> (suspicious AND NOT suspicion_cleared)",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert_eq!(escalation_mismatch, 0);
}

/// Unit attribution is exactly `staff_units` membership (ADR-008 §6): a
/// reviewer in the map gets their unit, everyone else gets the sentinels. The
/// early years are overwhelmingly «Не распределено» because their central
/// operator accounts are not in the map (PLAN §1.2).
#[sqlx::test(migrations = "../../migrations")]
async fn unit_attribution_is_exactly_staff_unit_membership(pool: PgPool) {
    support::seed_all(&pool).await;
    ingest::run_csv_file(
        &pool,
        &support::documents("2023-2024"),
        "golden-parse",
        &support::pepper(),
    )
    .await
    .expect("the year ingests");

    let mismatched: i64 = sqlx::query_scalar(
        "SELECT count(*)
         FROM checks c
         JOIN faculties f ON f.id = c.faculty_id
         JOIN departments d ON d.id = c.department_id
         LEFT JOIN staff_units s ON s.email_hmac = c.reviewer_ref
         WHERE (s.email_hmac IS NULL) <> (f.code = 'UNASSIGNED')
            OR (s.email_hmac IS NOT NULL
                AND (s.faculty_id <> c.faculty_id OR s.department_id <> c.department_id))
            OR (s.email_hmac IS NULL AND d.code <> 'UNASSIGNED')",
    )
    .fetch_one(&pool)
    .await
    .expect("count");
    assert_eq!(
        mismatched, 0,
        "an unmapped reviewer must land on both sentinels, a mapped one on their unit"
    );

    let unassigned_share: f64 = sqlx::query_scalar(
        "SELECT count(*) FILTER (WHERE f.code = 'UNASSIGNED')::float8 / count(*)
         FROM checks c JOIN faculties f ON f.id = c.faculty_id",
    )
    .fetch_one(&pool)
    .await
    .expect("share");
    assert!(
        unassigned_share > 0.9,
        "AY 2023/24 is structurally unattributable (PLAN §1.2); got {unassigned_share}"
    );
}

/// `system-usage.csv` becomes the W4.3 reconciliation baseline;
/// `user-intensity.csv` is never read (ADR-008 §1 - it carries ФИО).
#[sqlx::test(migrations = "../../migrations")]
async fn the_control_totals_are_imported_per_year(pool: PgPool) {
    support::seed_all(&pool).await;
    let reports = ingest::run_csv_tree(
        &pool,
        &support::year_dir("2025-2026"),
        "golden-parse",
        &support::pepper(),
    )
    .await
    .expect("the year directory ingests");
    assert_eq!(reports.len(), 1);
    assert_eq!(reports[0].academic_year, Some(domain::AcademicYear(2025)));

    let row: (i16, Option<i32>, Option<i32>) = sqlx::query_as(
        "SELECT academic_year, active_users, checks_total FROM source_control_totals",
    )
    .fetch_one(&pool)
    .await
    .expect("one control-total row per academic year");
    assert_eq!(row.0, 2025);
    assert_eq!(row.1, Some(172), "«Активные пользователи»");

    // fixtures/README.md: «Совершенных проверок» is what a correct importer
    // ingests - non-deleted and well-formed. This is the W4.3 reconciliation.
    let sidecar = support::sidecar("2025-2026");
    assert_eq!(row.2, Some(sidecar.rows_importable as i32));

    let ingested_facts: i64 = sqlx::query_scalar("SELECT count(*) FROM checks WHERE NOT deleted")
        .fetch_one(&pool)
        .await
        .expect("count");
    assert_eq!(
        ingested_facts, sidecar.rows_importable as i64,
        "a clean import must reconcile with the control figure exactly"
    );
}

/// Aggregates are refreshed after the commit - every one of them.
///
/// The view set is enumerated from `pg_matviews`, not hard-coded, so the two
/// views migration 0003 added are refreshed without an ingest code change.
#[sqlx::test(migrations = "../../migrations")]
async fn every_materialized_view_is_refreshed_after_the_batch(pool: PgPool) {
    support::seed_all(&pool).await;
    ingest::run_csv_file(
        &pool,
        &support::documents("2024-2025"),
        "golden-parse",
        &support::pepper(),
    )
    .await
    .expect("the year ingests");

    let sidecar = support::sidecar("2024-2025");
    let all: i64 = sqlx::query_scalar("SELECT coalesce(sum(checks), 0)::bigint FROM agg_monthly")
        .fetch_one(&pool)
        .await
        .expect("agg_monthly is populated");
    assert_eq!(
        all,
        (sidecar.rows_importable + sidecar.rows_deleted) as i64,
        "«Удален» is a dimension of agg_monthly, so every fact appears once"
    );

    let live: i64 = sqlx::query_scalar(
        "SELECT coalesce(sum(checks), 0)::bigint FROM agg_monthly WHERE NOT deleted",
    )
    .fetch_one(&pool)
    .await
    .expect("agg_monthly is populated");
    assert_eq!(live, sidecar.rows_importable as i64);

    // The views migration 0003 added must be populated too, or ingest is
    // silently leaving the rechecks and usage sections stale.
    let unpopulated: Vec<String> = sqlx::query_scalar(
        "SELECT matviewname::text FROM pg_matviews
         WHERE schemaname = current_schema() AND NOT ispopulated",
    )
    .fetch_all(&pool)
    .await
    .expect("pg_matviews");
    assert!(unpopulated.is_empty(), "still unpopulated: {unpopulated:?}");

    for view in ["agg_rechecks_yearly", "agg_usage_monthly"] {
        assert!(
            support::count(&pool, view).await > 0,
            "{view} must hold rows after a batch"
        );
    }
}
