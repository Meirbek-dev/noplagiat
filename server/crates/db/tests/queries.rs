//! Behavioural gates for the `db` modules that do not need the 60 000-row
//! fixture: idempotent upsert, the `exclude_deleted` toggle, settings typing,
//! dictionaries, audit, roles, batches, snapshots and the two documented
//! fact-table fallbacks.

mod support;

use compliance::Scope;
use db::Pool;
use db::checks::FactRow;
use db::q::{self, UnitDepth};
use domain::{
    BucketBoundaries, CheckStatus, DictionaryCode, Filters, InitiatorRole, Period, RoleKind,
};
use sqlx::PgPool;
use sqlx::Row as _;

/// A fact on the sentinel dictionary rows migration 0002 guarantees exist, so
/// these tests need no fixture dictionaries.
///
/// `clippy.toml` already allows `expect` in tests; the config reaches `#[test]`
/// functions but not the helpers they call, and a malformed literal here must
/// abort the test rather than be papered over.
#[expect(
    clippy::expect_used,
    reason = "test fixture construction from literals"
)]
fn fact(source_check_id: &str, checked_at: &str, originality: &str, deleted: bool) -> FactRow {
    FactRow {
        source_check_id: source_check_id.to_owned(),
        attempt_no: 1,
        checked_at: checked_at.parse().expect("RFC 3339 timestamp"),
        academic_year: 2025,
        work_type_code: "other".to_owned(),
        faculty_code: "UNASSIGNED".to_owned(),
        department_code: "UNASSIGNED".to_owned(),
        program_code: None,
        originality_pct: originality.to_owned(),
        status: CheckStatus::Accepted,
        escalated: false,
        initiator: InitiatorRole::Other,
        suspicious: false,
        suspicion_cleared: false,
        deleted,
        self_citation_pct: None,
        citation_pct: None,
        match_pct: None,
        ai_content_pct: None,
        work_ref: None,
        reviewer_ref: None,
    }
}

#[expect(
    clippy::expect_used,
    reason = "test fixture construction from literals"
)]
fn november_2025() -> Filters {
    Filters::new(
        Period::new(
            jiff::civil::date(2025, 11, 1),
            jiff::civil::date(2025, 11, 30),
        )
        .expect("ordered period"),
    )
}

async fn probe(pool: &PgPool) -> sqlx::Result<(i64, Option<String>)> {
    let row = sqlx::query(
        "SELECT count(*)::bigint AS n,
                md5(string_agg(source_check_id || ':' || attempt_no || ':'
                               || originality_pct::text || ':' || status::text || ':'
                               || deleted::text,
                               ',' ORDER BY source_check_id, attempt_no)) AS checksum
           FROM checks",
    )
    .fetch_one(pool)
    .await?;
    Ok((row.get("n"), row.get("checksum")))
}

/// Re-running a batch must converge, not duplicate: the upsert targets
/// `UNIQUE (source_check_id, attempt_no)` (ARCHITECTURE.md §4.4).
#[sqlx::test(migrations = "../../migrations")]
async fn insert_facts_is_idempotent(pool: PgPool) -> sqlx::Result<()> {
    let raw = pool.clone();
    let pool = Pool::for_tests(pool);
    support::load_dictionaries(&raw).await?;

    let facts = support::facts_path();
    support::require_fixture(&facts);
    let rows: Vec<FactRow> = std::fs::read_to_string(&facts)
        .expect("facts.jsonl is readable")
        .lines()
        .filter(|line| !line.trim().is_empty())
        .take(5_000)
        .map(|line| serde_json::from_str(line).expect("facts.jsonl row parses"))
        .collect();
    assert_eq!(rows.len(), 5_000);

    let first_batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    let first = db::checks::insert_facts(&pool, first_batch, &rows)
        .await
        .expect("first upsert");
    let after_first = probe(&raw).await?;

    let second_batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    let second = db::checks::insert_facts(&pool, second_batch, &rows)
        .await
        .expect("second upsert");
    let after_second = probe(&raw).await?;

    assert_eq!(first, 5_000);
    assert_eq!(second, 5_000, "a re-run touches the same rows");
    assert_eq!(
        after_first, after_second,
        "row count and content checksum must be unchanged by a re-run"
    );
    Ok(())
}

/// «Удален» rows stay in the warehouse and are filtered at query time, so
/// flipping `settings.exclude_deleted` changes the answer without a rebuild
/// (ADR-008 §4, migration 0003 change (2)).
#[sqlx::test(migrations = "../../migrations")]
async fn deleted_rows_appear_only_when_the_toggle_is_off(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    db::checks::insert_facts(
        &pool,
        batch,
        &[
            fact("live-1", "2025-11-03T14:07:00+05:00", "80.00", false),
            fact("deleted-1", "2025-11-04T09:00:00+05:00", "40.00", true),
        ],
    )
    .await
    .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");

    let filters = november_2025();
    let default = q::summary(&pool, &filters, Scope::All)
        .await
        .expect("summary");
    assert_eq!(default.checks, 1, "the default excludes «Удален» rows");
    assert_eq!(default.below_threshold, 0);

    db::settings::set(
        &pool,
        db::settings::EXCLUDE_DELETED,
        &serde_json::json!(false),
        Some("test"),
    )
    .await
    .expect("setting write");

    let included = q::summary(&pool, &filters, Scope::All)
        .await
        .expect("summary");
    assert_eq!(included.checks, 2, "the toggle takes effect immediately");
    assert_eq!(included.below_threshold, 1);
    let histogram = q::histogram(&pool, &filters, Scope::All)
        .await
        .expect("histogram");
    assert_eq!(histogram.lt50, 1);
    assert_eq!(histogram.b70_85, 1);

    Ok(())
}

/// A malformed setting is an error, never a silent fallback to a weaker
/// default (compliance depends on this).
#[sqlx::test(migrations = "../../migrations")]
async fn settings_are_typed_and_reject_malformed_values(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);

    assert_eq!(
        db::settings::k_threshold(&pool)
            .await
            .expect("seeded k")
            .threshold()
            .get(),
        5
    );
    assert_eq!(
        db::settings::originality_threshold(&pool)
            .await
            .expect("seeded threshold")
            .hundredths(),
        7_000
    );
    assert_eq!(
        db::settings::histogram_buckets(&pool)
            .await
            .expect("seeded buckets"),
        BucketBoundaries::default()
    );
    assert_eq!(
        db::settings::semester_boundaries(&pool)
            .await
            .expect("seeded semesters"),
        domain::SemesterBoundaries::default()
    );
    assert_eq!(
        db::settings::status_rules(&pool)
            .await
            .expect("seeded rules"),
        domain::StatusRules::default()
    );
    assert!(
        db::settings::exclude_deleted(&pool)
            .await
            .expect("seeded toggle")
    );
    assert_eq!(
        db::settings::public_snapshot_quarter(&pool)
            .await
            .expect("seeded quarter"),
        "auto"
    );

    db::settings::set(
        &pool,
        db::settings::K_THRESHOLD,
        &serde_json::json!("5"),
        Some("admin"),
    )
    .await
    .expect("setting write");
    assert!(
        db::settings::k_threshold(&pool).await.is_err(),
        "a string threshold must not be coerced into a number"
    );

    db::settings::set(
        &pool,
        db::settings::HISTOGRAM_BUCKETS,
        &serde_json::json!([50, 50, 85, 95]),
        Some("admin"),
    )
    .await
    .expect("setting write");
    assert!(
        db::settings::histogram_buckets(&pool).await.is_err(),
        "non-increasing boundaries must not be accepted"
    );

    let listed = db::settings::list(&pool).await.expect("settings list");
    assert!(listed.iter().any(|row| row.key == "k_threshold"));
    assert!(
        listed
            .iter()
            .any(|row| row.updated_by.as_deref() == Some("admin"))
    );

    Ok(())
}

/// A histogram whose boundaries differ from the ADR-008 §8 defaults cannot use
/// the `agg_monthly` FILTER columns and re-reads the fact table.
#[sqlx::test(migrations = "../../migrations")]
async fn custom_histogram_boundaries_fall_back_to_facts(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    db::checks::insert_facts(
        &pool,
        batch,
        &[
            fact("a", "2025-11-01T10:00:00+05:00", "39.99", false),
            fact("b", "2025-11-02T10:00:00+05:00", "40.00", false),
            fact("c", "2025-11-03T10:00:00+05:00", "60.00", false),
            fact("d", "2025-11-04T10:00:00+05:00", "80.00", false),
            fact("e", "2025-11-05T10:00:00+05:00", "90.00", false),
        ],
    )
    .await
    .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");

    let filters = november_2025();
    let default = q::histogram(&pool, &filters, Scope::All)
        .await
        .expect("histogram");
    assert_eq!(default.counts(), [2, 1, 1, 1, 0]);
    assert_eq!(default.total(), 5);

    db::settings::set(
        &pool,
        db::settings::HISTOGRAM_BUCKETS,
        &serde_json::json!([40, 60, 80, 90]),
        Some("admin"),
    )
    .await
    .expect("setting write");

    // Lower-inclusive: 40.00, 60.00, 80.00 and 90.00 each land in the band
    // above their edge (domain::Bucket).
    let custom = q::histogram(&pool, &filters, Scope::All)
        .await
        .expect("histogram");
    assert_eq!(custom.counts(), [1, 1, 1, 1, 1]);

    // The below-threshold count follows the same rule: a threshold that is not
    // an aggregate bucket edge is counted from facts.
    db::settings::set(
        &pool,
        db::settings::ORIGINALITY_THRESHOLD,
        &serde_json::json!(60),
        Some("admin"),
    )
    .await
    .expect("setting write");
    let summary = q::summary(&pool, &filters, Scope::All)
        .await
        .expect("summary");
    assert_eq!(
        summary.below_threshold, 2,
        "39.99 and 40.00 are below 60, 60.00 itself is not"
    );

    Ok(())
}

/// An unknown dictionary code must yield an empty result, never an unfiltered
/// one - the failure mode a naive "resolve in Rust, bind None" would have.
#[sqlx::test(migrations = "../../migrations")]
async fn an_unknown_filter_code_returns_nothing(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    db::checks::insert_facts(
        &pool,
        batch,
        &[fact("a", "2025-11-01T10:00:00+05:00", "80.00", false)],
    )
    .await
    .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");

    let unfiltered = q::summary(&pool, &november_2025(), Scope::All)
        .await
        .expect("summary");
    assert_eq!(unfiltered.checks, 1);

    let unknown = november_2025()
        .with_faculty(DictionaryCode::new("NO-SUCH-FACULTY".into()).expect("valid code"));
    let filtered = q::summary(&pool, &unknown, Scope::All)
        .await
        .expect("summary");
    assert_eq!(filtered.checks, 0);

    // Programmes are never populated by the legacy backfill (PLAN §1.1), so a
    // programme filter is always empty too.
    let programme =
        november_2025().with_program(DictionaryCode::new("6B06103".into()).expect("valid code"));
    assert_eq!(
        q::summary(&pool, &programme, Scope::All)
            .await
            .expect("summary")
            .checks,
        0
    );

    Ok(())
}

/// Coverage is hidden without denominators and computed once they exist.
#[sqlx::test(migrations = "../../migrations")]
async fn coverage_appears_only_with_denominators(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    db::checks::insert_facts(
        &pool,
        batch,
        &[
            fact("a", "2025-11-01T10:00:00+05:00", "80.00", false),
            fact("b", "2025-11-02T10:00:00+05:00", "90.00", false),
        ],
    )
    .await
    .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");

    let filters = november_2025();
    assert!(
        q::coverage(&pool, &filters, Scope::All)
            .await
            .expect("coverage")
            .is_empty()
    );

    db::manual::submission_totals::upsert(&pool, 2025, "other", 8)
        .await
        .expect("denominator write");
    let coverage = q::coverage(&pool, &filters, Scope::All)
        .await
        .expect("coverage");
    assert_eq!(coverage.len(), 1);
    assert_eq!(coverage[0].checks, 2);
    assert_eq!(coverage[0].total_submitted, 8);
    assert_eq!(coverage[0].coverage(), Some(0.25));

    Ok(())
}

/// Escalations report the derived flag and the manual Ethics Council counters
/// side by side, never summed (ADR-008 §9).
#[sqlx::test(migrations = "../../migrations")]
async fn escalations_report_facts_and_ethics_cases_separately(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    let mut escalated = fact("a", "2025-11-01T10:00:00+05:00", "20.00", false);
    escalated.escalated = true;
    escalated.suspicious = true;
    escalated.status = CheckStatus::Rejected;
    db::checks::insert_facts(
        &pool,
        batch,
        &[
            escalated,
            fact("b", "2025-11-02T10:00:00+05:00", "90.00", false),
        ],
    )
    .await
    .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");
    db::manual::ethics::insert(&pool, 2025, "plagiarism", 3, 1)
        .await
        .expect("ethics row");

    let got = q::escalations(&pool, &november_2025(), Scope::All)
        .await
        .expect("escalations");
    assert_eq!(got.checks_escalated, 1);
    assert_eq!(got.ethics_cases.len(), 1);
    assert_eq!(got.ethics_cases[0].referred, 3);
    assert_eq!(got.ethics_cases[0].reviewed_closed, 1);

    Ok(())
}

/// Usage combines the derived distinct-reviewer count with the manual
/// `usage_stats` row, and reports «нет данных» when the latter is absent.
#[sqlx::test(migrations = "../../migrations")]
async fn usage_counts_distinct_reviewers_and_surfaces_manual_duration(
    pool: PgPool,
) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    let mut first = fact("a", "2025-11-01T10:00:00+05:00", "80.00", false);
    first.reviewer_ref = Some("aa".repeat(32));
    let mut second = fact("b", "2025-11-02T10:00:00+05:00", "80.00", false);
    second.reviewer_ref = Some("aa".repeat(32));
    let mut third = fact("c", "2025-11-03T10:00:00+05:00", "80.00", false);
    third.reviewer_ref = Some("bb".repeat(32));
    db::checks::insert_facts(&pool, batch, &[first, second, third])
        .await
        .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");

    let filters = november_2025();
    let usage = q::usage(&pool, &filters, Scope::All).await.expect("usage");
    assert_eq!(usage.len(), 1);
    assert_eq!(usage[0].active_reviewers, 2, "one reviewer checked twice");
    assert_eq!(usage[0].avg_check_seconds, None);

    let month = usage[0].month;
    db::manual::usage_stats::upsert(&pool, month, 9, Some(412))
        .await
        .expect("usage_stats row");
    let usage = q::usage(&pool, &filters, Scope::All).await.expect("usage");
    assert_eq!(usage[0].avg_check_seconds, Some(412));
    assert_eq!(usage[0].reported_active_users, Some(9));

    // A work-type filter is outside `agg_usage_monthly`'s key, so the same
    // question is answered from facts - and must give the same answer here.
    let by_type = filters.with_work_type(DictionaryCode::new("other".into()).expect("valid code"));
    let usage = q::usage(&pool, &by_type, Scope::All).await.expect("usage");
    assert_eq!(usage.len(), 1);
    assert_eq!(usage[0].active_reviewers, 2);

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn dictionaries_and_aliases_round_trip(pool: PgPool) -> sqlx::Result<()> {
    let raw = pool.clone();
    let pool = Pool::for_tests(pool);
    support::load_dictionaries(&raw).await?;

    let faculties = db::dicts::faculties(&pool).await.expect("faculties");
    assert!(faculties.iter().any(|row| row.code == "FAC03"));
    assert!(faculties.iter().any(|row| row.code == "UNASSIGNED"));

    let departments = db::dicts::departments(&pool).await.expect("departments");
    let dep11 = departments
        .iter()
        .find(|row| row.code == "DEP11")
        .expect("DEP11 exists");
    let fac03 = faculties
        .iter()
        .find(|row| row.code == "FAC03")
        .expect("FAC03 exists");
    assert_eq!(dep11.faculty_id, fac03.id);

    assert!(
        !db::dicts::programs(&pool)
            .await
            .expect("programs")
            .is_empty()
    );
    let work_types = db::dicts::work_types(&pool).await.expect("work types");
    assert!(work_types.iter().any(|row| row.code == "other"));

    let ids = db::dicts::faculty_ids(&pool).await.expect("faculty ids");
    assert_eq!(ids.get("FAC03"), Some(&fac03.id));
    assert!(
        !db::dicts::department_ids(&pool)
            .await
            .expect("ids")
            .is_empty()
    );
    assert!(!db::dicts::program_ids(&pool).await.expect("ids").is_empty());
    assert!(
        !db::dicts::work_type_ids(&pool)
            .await
            .expect("ids")
            .is_empty()
    );

    let alias = db::dicts::upsert_alias(
        &pool,
        db::dicts::AliasKind::Faculty,
        "Факультет естественных наук",
        fac03.id,
    )
    .await
    .expect("alias insert");
    let repeat = db::dicts::upsert_alias(
        &pool,
        db::dicts::AliasKind::Faculty,
        "Факультет естественных наук",
        fac03.id,
    )
    .await
    .expect("alias upsert");
    assert_eq!(alias, repeat, "an alias upsert repoints, never duplicates");

    let aliases = db::dicts::aliases(&pool, db::dicts::AliasKind::Faculty)
        .await
        .expect("aliases");
    assert_eq!(aliases.len(), 1);
    assert_eq!(aliases[0].target_id, fac03.id);
    assert_eq!(
        db::dicts::delete_alias(&pool, alias)
            .await
            .expect("alias delete"),
        1
    );

    Ok(())
}

/// The audit log has exactly one write path here, and the schema trigger backs
/// it up (AGENTS.md invariant #4).
#[sqlx::test(migrations = "../../migrations")]
async fn audit_entries_are_appended_and_filterable(pool: PgPool) -> sqlx::Result<()> {
    let raw = pool.clone();
    let pool = Pool::for_tests(pool);

    let user = db::users::create(&pool, "subject-1", "u@tou.edu.kz", "U", None)
        .await
        .expect("account creation");
    let filters = serde_json::json!({"from": "2025-09-01", "to": "2026-08-31"});

    db::audit::append(
        &pool,
        &db::audit::NewAuditEntry {
            user_id: user.id,
            role: RoleKind::Dean,
            action: "view",
            section: "summary",
            filters: &filters,
            ip: Some("192.0.2.10"),
        },
    )
    .await
    .expect("audit append");
    db::audit::append(
        &pool,
        &db::audit::NewAuditEntry {
            user_id: user.id,
            role: RoleKind::Admin,
            action: "export_pdf",
            section: "units",
            filters: &filters,
            ip: None,
        },
    )
    .await
    .expect("audit append");

    let all = db::audit::list(&pool, &db::audit::AuditFilter::default(), 50, 0)
        .await
        .expect("audit list");
    assert_eq!(all.total, 2);
    assert_eq!(all.rows.len(), 2);
    assert!(
        all.rows
            .iter()
            .any(|row| row.ip.as_deref() == Some("192.0.2.10"))
    );
    assert!(all.rows.iter().any(|row| row.role == "admin"));

    let deans = db::audit::list(
        &pool,
        &db::audit::AuditFilter {
            role: Some(RoleKind::Dean),
            ..db::audit::AuditFilter::default()
        },
        50,
        0,
    )
    .await
    .expect("audit list");
    assert_eq!(deans.total, 1);
    assert_eq!(deans.rows[0].section, "summary");
    assert_eq!(deans.rows[0].filters, filters);

    let paged = db::audit::list(&pool, &db::audit::AuditFilter::default(), 1, 1)
        .await
        .expect("audit list");
    assert_eq!(paged.rows.len(), 1);
    assert_eq!(paged.total, 2, "the total ignores the page window");

    assert!(
        sqlx::query("UPDATE audit_log SET action = 'tampered'")
            .execute(&raw)
            .await
            .is_err(),
        "the append-only trigger must still raise"
    );

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn user_roles_are_granted_and_revoked_by_scope(pool: PgPool) -> sqlx::Result<()> {
    let raw = pool.clone();
    let pool = Pool::for_tests(pool);
    support::load_dictionaries(&raw).await?;
    let faculty = support::faculty_id(&raw, "FAC03").await?;

    let user = db::users::create(&pool, "subject-2", "d@tou.edu.kz", "Dean", None)
        .await
        .expect("account creation");
    // Creation is not an upsert: a repeat is an operator mistake, and silently
    // rewriting the e-mail and password of a live account is the wrong recovery
    // from it (ADR-017 §3). The same name in a different case is the same
    // account, so it is refused too.
    assert!(
        matches!(
            db::users::create(&pool, "subject-2", "new@tou.edu.kz", "Dean 2", None).await,
            Err(db::DbError::UsernameTaken(_))
        ),
        "a duplicate login name must be a typed refusal"
    );
    assert!(
        matches!(
            db::users::create(&pool, "SUBJECT-2", "new@tou.edu.kz", "Dean 2", None).await,
            Err(db::DbError::UsernameTaken(_))
        ),
        "login names are unique without regard to case"
    );

    db::users::add_role(&pool, user.id, RoleKind::Dean, Some(faculty), None)
        .await
        .expect("grant");
    db::users::add_role(&pool, user.id, RoleKind::Dean, Some(faculty), None)
        .await
        .expect("repeat grant");
    db::users::add_role(&pool, user.id, RoleKind::Ethics, None, None)
        .await
        .expect("grant");

    let loaded = db::users::by_username(&pool, "Subject-2")
        .await
        .expect("lookup")
        .expect("user exists");
    assert_eq!(loaded.roles.len(), 2, "a repeat grant is a no-op");
    assert!(
        loaded
            .roles
            .iter()
            .any(|role| role.role == "dean" && role.scope_faculty_id == Some(faculty))
    );

    assert_eq!(
        db::users::remove_role(&pool, user.id, RoleKind::Ethics, None, None)
            .await
            .expect("revoke"),
        1,
        "an unscoped grant is matched by NULL, not missed by it"
    );
    assert_eq!(
        db::users::by_id(&pool, user.id)
            .await
            .expect("lookup")
            .expect("user exists")
            .roles
            .len(),
        1
    );

    assert_eq!(
        db::users::set_active(&pool, user.id, false)
            .await
            .expect("deactivate"),
        1
    );
    assert!(
        db::users::by_username(&pool, "nobody")
            .await
            .expect("lookup")
            .is_none()
    );

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn batches_record_counters_and_errors(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let id = db::batches::start(&pool, "csv-backfill", db::batches::Mode::Csv)
        .await
        .expect("batch starts");

    let errors = serde_json::json!([{"row": 17, "kind": "unparseable_report_link"}]);
    db::batches::finish(
        &pool,
        id,
        &db::batches::BatchOutcome {
            rows_read: 5_429,
            rows_upserted: 5_156,
            rows_rejected: 1,
            rows_skipped_deleted: 272,
            errors: errors.clone(),
            status: db::batches::BatchStatus::Succeeded,
        },
    )
    .await
    .expect("batch finishes");

    let listed = db::batches::list(&pool, 10, 0).await.expect("batch list");
    assert_eq!(listed.len(), 1);
    assert_eq!(listed[0].rows_skipped_deleted, 272);
    assert_eq!(listed[0].status, "succeeded");
    assert!(listed[0].finished_at.is_some());
    assert_eq!(db::batches::count(&pool).await.expect("count"), 1);

    let detail = db::batches::get(&pool, id)
        .await
        .expect("batch get")
        .expect("batch exists");
    assert_eq!(detail.errors, errors);
    assert!(
        db::batches::get(&pool, id + 1_000)
            .await
            .expect("batch get")
            .is_none()
    );

    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn snapshots_are_published_explicitly(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let start = sqlx::types::time::Date::from_ordinal_date(2025, 244).expect("2025-09-01");
    let end = sqlx::types::time::Date::from_ordinal_date(2026, 243).expect("2026-08-31");

    let id = db::snapshots::insert(
        &pool,
        &db::snapshots::NewSnapshot {
            period_start: start,
            period_end: end,
            kind: db::snapshots::SnapshotKind::Annual,
            locale: Some("ru"),
            pdf_path: Some("reports/2025-2026.pdf"),
            xlsx_path: None,
        },
    )
    .await
    .expect("snapshot insert");

    let all = db::snapshots::list(&pool, false, 10, 0)
        .await
        .expect("snapshot list");
    assert_eq!(all.len(), 1);
    assert!(!all[0].published, "generation does not publish");
    // Migration 0005: the locale is what makes the annual scheduler idempotent
    // per (academic year, locale) rather than per academic year.
    assert_eq!(all[0].locale.as_deref(), Some("ru"));
    assert!(
        db::snapshots::list(&pool, true, 10, 0)
            .await
            .expect("snapshot list")
            .is_empty()
    );

    assert_eq!(
        db::snapshots::set_published(&pool, id, true)
            .await
            .expect("publish"),
        1
    );
    let published = db::snapshots::list(&pool, true, 10, 0)
        .await
        .expect("snapshot list");
    assert_eq!(published.len(), 1);
    assert_eq!(published[0].kind, "annual");
    assert_eq!(
        db::snapshots::get(&pool, id)
            .await
            .expect("snapshot get")
            .expect("snapshot exists")
            .pdf_path
            .as_deref(),
        Some("reports/2025-2026.pdf")
    );

    Ok(())
}

/// The refresh enumerates `pg_matviews`, so all three aggregates of migration
/// 0003 are covered, and a second call uses the CONCURRENTLY path.
#[sqlx::test(migrations = "../../migrations")]
async fn refresh_covers_every_aggregate(pool: PgPool) -> sqlx::Result<()> {
    let raw = pool.clone();
    let pool = Pool::for_tests(pool);
    assert_eq!(db::agg::refresh_all(&pool).await.expect("refresh"), 3);
    assert_eq!(db::agg::refresh_all(&pool).await.expect("refresh"), 3);

    let views: Vec<String> =
        sqlx::query_scalar("SELECT matviewname::text FROM pg_matviews ORDER BY 1")
            .fetch_all(&raw)
            .await?;
    assert_eq!(
        views,
        vec![
            "agg_monthly".to_owned(),
            "agg_rechecks_yearly".to_owned(),
            "agg_usage_monthly".to_owned(),
        ]
    );

    Ok(())
}

/// Units roll up to faculty grain (the public level) and to department grain
/// (internal), carrying raw counts either way so the caller can screen them.
#[sqlx::test(migrations = "../../migrations")]
async fn units_roll_up_to_both_grains(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let batch = db::batches::start(&pool, "test", db::batches::Mode::Csv)
        .await
        .expect("batch starts");
    db::checks::insert_facts(
        &pool,
        batch,
        &[
            fact("a", "2025-11-01T10:00:00+05:00", "80.00", false),
            fact("b", "2025-11-02T10:00:00+05:00", "60.00", false),
        ],
    )
    .await
    .expect("upsert");
    db::agg::refresh_all(&pool).await.expect("refresh");

    let filters = november_2025();
    let faculties = q::units(&pool, &filters, Scope::All, UnitDepth::Faculty)
        .await
        .expect("units");
    assert_eq!(faculties.len(), 1);
    assert_eq!(faculties[0].faculty_code, "UNASSIGNED");
    assert_eq!(faculties[0].department_code, None);
    assert_eq!(faculties[0].checks, 2);
    assert_eq!(faculties[0].avg_originality(), Some(70.0));

    let departments = q::units(&pool, &filters, Scope::All, UnitDepth::Department)
        .await
        .expect("units");
    assert_eq!(departments.len(), 1);
    assert_eq!(
        departments[0].department_code.as_deref(),
        Some("UNASSIGNED")
    );

    Ok(())
}
