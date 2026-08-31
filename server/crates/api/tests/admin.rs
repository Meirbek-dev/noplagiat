//! The administrative surface (TZ §4.6) and the audit trail it writes
//! (TZ §6.3, slice W3.4).

// `server/clippy.toml` allows `expect` in `#[test]` functions but not in the
// helpers they call. These helpers exist to abort a test loudly on a broken
// harness; they are not a request path, which is what the workspace lint
// protects (ARCHITECTURE.md §4.1).
#![expect(
    clippy::expect_used,
    reason = "test harness: a broken fixture must abort the test"
)]

mod support;

use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use serde_json::{Value, json};
use sqlx::PgPool;
use support::{Session, authenticated, dev_login, send};

async fn admin_router(pool: PgPool) -> (axum::Router, db::Pool, Session) {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("the fixture dictionaries load");
    let router = api::build_router(support::state_from(pool.clone()));
    let session = dev_login(&router, json!({"sso_subject": "root", "role": "admin"})).await;
    (router, pool, session)
}

/// A mutating admin request with its CSRF token and a JSON body.
fn mutate(session: &Session, method: &str, uri: &str, body: &Value) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header(header::COOKIE, session.cookie.clone())
        .header("x-csrf-token", session.csrf_token.clone())
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(body.to_string()))
        .expect("the admin request is well formed")
}

async fn audit_rows(pool: &db::Pool) -> Vec<db::audit::AuditRow> {
    db::audit::list(pool, &db::audit::AuditFilter::default(), 200, 0)
        .await
        .expect("the audit log reads")
        .rows
}

// ── settings ────────────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn settings_are_validated_through_the_domain_types(pool: PgPool) -> sqlx::Result<()> {
    let (router, pool, session) = admin_router(pool).await;

    let listing = send(
        &router,
        authenticated(&session, "GET", "/api/admin/settings"),
    )
    .await;
    assert_eq!(listing.status, StatusCode::OK);
    let body = listing.json();
    let keys: Vec<String> = body["items"]
        .as_array()
        .expect("items")
        .iter()
        .filter_map(|item| item["key"].as_str().map(str::to_owned))
        .collect();
    // Every editable key is offered, `role_mappings` included even though it
    // has never been written (ADR-014 §3).
    for key in ["k_threshold", "status_rules", "role_mappings"] {
        assert!(
            keys.contains(&key.to_owned()),
            "{key} missing from {keys:?}"
        );
    }

    // A malformed value is refused, and nothing is written.
    for (key, value) in [
        ("k_threshold", json!("5")),
        ("k_threshold", json!(0)),
        ("originality_threshold", json!(140)),
        ("histogram_buckets", json!("50,70")),
        ("exclude_deleted", json!("yes")),
        ("role_mappings", json!([{"group": "g", "role": "dean"}])),
        ("not_a_setting", json!(1)),
    ] {
        let reply = send(
            &router,
            mutate(&session, "PUT", "/api/admin/settings", &json!({key: value})),
        )
        .await;
        reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
    }
    assert_eq!(
        db::settings::k_threshold(&pool)
            .await
            .expect("k is still the seeded value")
            .threshold()
            .get(),
        5
    );

    // A well-formed write goes through, and the audit row names the key
    // without carrying its value.
    let reply = send(
        &router,
        mutate(
            &session,
            "PUT",
            "/api/admin/settings",
            &json!({"k_threshold": 9, "originality_threshold": 65}),
        ),
    )
    .await;
    assert_eq!(reply.status, StatusCode::OK);
    assert_eq!(
        db::settings::k_threshold(&pool)
            .await
            .expect("k reads back")
            .threshold()
            .get(),
        9
    );

    let rows = audit_rows(&pool).await;
    let row = rows
        .iter()
        .find(|row| row.section == "settings" && row.action == "admin_change")
        .expect("the settings write is audited as admin_change");
    assert_eq!(
        row.filters["change"]["keys"],
        json!(["k_threshold", "originality_threshold"])
    );
    assert!(
        !row.filters.to_string().contains('9'),
        "the audit summary must not carry the value written: {}",
        row.filters
    );
    Ok(())
}

/// Changing `k` must take effect on the public contour immediately, not after
/// the 60-second cache TTL.
#[sqlx::test(migrations = "../../migrations")]
async fn raising_k_invalidates_the_policy_cache(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_warehouse(&pool)
        .await
        .expect("the fixture warehouse loads");
    let router = api::build_router(support::state_from(pool));
    let session = dev_login(&router, json!({"sso_subject": "root", "role": "admin"})).await;

    let before = support::get(&router, "/api/public/summary?from=2023-09-01&to=2026-08-31").await;
    assert_eq!(before.json()["k_threshold"], json!(5));
    assert!(
        before.json()["total_checks"].as_i64().is_some(),
        "the university total is well above k = 5"
    );

    send(
        &router,
        mutate(
            &session,
            "PUT",
            "/api/admin/settings",
            &json!({"k_threshold": 1_000_000}),
        ),
    )
    .await;

    let after = support::get(&router, "/api/public/summary?from=2023-09-01&to=2026-08-31").await;
    assert_eq!(after.json()["k_threshold"], json!(1_000_000));
    assert_eq!(
        after.json()["total_checks"],
        json!(compliance::SUPPRESSED_MARKER),
        "the new threshold must apply to the very next request"
    );
    Ok(())
}

// ── dictionaries and aliases ────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn dictionaries_round_trip_and_refuse_to_orphan_facts(pool: PgPool) -> sqlx::Result<()> {
    let (router, pool, session) = admin_router(pool).await;

    let created = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/dictionaries/faculties",
            &json!({
                "code": "FAC90", "name_ru": "Тестовый факультет",
                "name_kk": "Сынақ факультеті", "name_en": "Test Faculty",
            }),
        ),
    )
    .await;
    assert_eq!(created.status, StatusCode::OK);
    assert!(
        created.json()["items"]
            .as_array()
            .expect("items")
            .iter()
            .any(|item| item["code"] == json!("FAC90"))
    );

    // A department needs its parent, and an unknown parent is a field error.
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/dictionaries/departments",
            &json!({
                "code": "DEP90", "name_ru": "К", "name_kk": "К", "name_en": "D",
                "parent_code": "FAC-NOPE",
            }),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    let department = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/dictionaries/departments",
            &json!({
                "code": "DEP90", "name_ru": "Кафедра", "name_kk": "Кафедра",
                "name_en": "Department", "parent_code": "FAC90",
            }),
        ),
    )
    .await;
    assert_eq!(department.status, StatusCode::OK);

    // A faculty with a child cannot be removed - the foreign key says so, and
    // the API reports a conflict rather than a 500.
    send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/dictionaries/faculties/FAC90",
            &json!({}),
        ),
    )
    .await
    .problem(StatusCode::CONFLICT);

    // Remove the child first, then the parent.
    let removed = send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/dictionaries/departments/DEP90",
            &json!({}),
        ),
    )
    .await;
    assert_eq!(removed.status, StatusCode::NO_CONTENT);
    let removed = send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/dictionaries/faculties/FAC90",
            &json!({}),
        ),
    )
    .await;
    assert_eq!(removed.status, StatusCode::NO_CONTENT);

    // An unknown dictionary is a 404, and a code that is not there is too.
    send(
        &router,
        authenticated(&session, "GET", "/api/admin/dictionaries/planets"),
    )
    .await
    .problem(StatusCode::NOT_FOUND);
    send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/dictionaries/faculties/FAC90",
            &json!({}),
        ),
    )
    .await
    .problem(StatusCode::NOT_FOUND);

    let rows = audit_rows(&pool).await;
    assert!(
        rows.iter()
            .any(|row| row.section.starts_with("dictionaries")
                && row.action == "admin_change"
                && row.filters["change"]["code"] == json!("FAC90")),
        "the dictionary write is audited with the code it touched"
    );
    Ok(())
}

/// TZ §6.3 journals «с какими фильтрами». `section` stays the matched **route**
/// so the vocabulary an administrator filters on is a bounded set - which means
/// the placeholder has to be resolved somewhere, and that somewhere is
/// `filters` (ADR-012 §6).
#[sqlx::test(migrations = "../../migrations")]
async fn route_parameters_are_journalled_beside_the_query_filters(
    pool: PgPool,
) -> sqlx::Result<()> {
    let (router, pool, session) = admin_router(pool).await;

    let listing = send(
        &router,
        authenticated(&session, "GET", "/api/admin/dictionaries/faculties?q=FAC"),
    )
    .await;
    assert_eq!(listing.status, StatusCode::OK);

    let created = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/dictionaries/departments",
            &json!({
                "code": "DEP91", "name_ru": "Кафедра", "name_kk": "Кафедра",
                "name_en": "Department", "parent_code": "FAC03",
            }),
        ),
    )
    .await;
    assert_eq!(created.status, StatusCode::OK);

    let rows = audit_rows(&pool).await;

    let read = rows
        .iter()
        .find(|row| row.section == "dictionaries/{kind}" && row.action == "view")
        .expect("the dictionary listing is audited");
    assert_eq!(
        read.filters["kind"],
        json!("faculties"),
        "the section keeps the template, so the resolved parameter belongs in \
         filters: {}",
        read.filters
    );
    assert_eq!(
        read.filters["q"],
        json!("FAC"),
        "the query filters are still there: {}",
        read.filters
    );

    let write = rows
        .iter()
        .find(|row| row.section == "dictionaries/{kind}" && row.action == "admin_change")
        .expect("the dictionary write is audited");
    assert_eq!(
        write.filters["kind"],
        json!("departments"),
        "{}",
        write.filters
    );
    assert_eq!(
        write.filters["change"]["code"],
        json!("DEP91"),
        "a handler's own note survives the merge: {}",
        write.filters
    );

    // A route with no placeholders gains nothing.
    let ping = send(&router, authenticated(&session, "GET", "/api/admin/ping")).await;
    assert_eq!(ping.status, StatusCode::OK);
    let rows = audit_rows(&pool).await;
    let ping = rows
        .iter()
        .find(|row| row.section == "ping")
        .expect("the admin ping is audited");
    assert_eq!(ping.filters, json!({}), "{}", ping.filters);
    Ok(())
}

#[sqlx::test(migrations = "../../migrations")]
async fn aliases_map_source_labels_onto_dictionary_rows(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool, session) = admin_router(pool).await;

    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/aliases",
            &json!({"kind": "faculty", "source_label": "ЕН", "target_code": "FAC-NOPE"}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    let created = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/aliases",
            &json!({"kind": "faculty", "source_label": "ЕН", "target_code": "FAC03"}),
        ),
    )
    .await;
    assert_eq!(created.status, StatusCode::OK);
    let id = created.json()["items"]
        .as_array()
        .expect("items")
        .iter()
        .find(|item| item["source_label"] == json!("ЕН"))
        .and_then(|item| item["id"].as_i64())
        .expect("the alias was created");

    let removed = send(
        &router,
        mutate(
            &session,
            "DELETE",
            &format!("/api/admin/aliases/{id}"),
            &json!({}),
        ),
    )
    .await;
    assert_eq!(removed.status, StatusCode::NO_CONTENT);
    Ok(())
}

// ── roles ───────────────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn roles_are_granted_and_revoked_by_an_administrator(pool: PgPool) -> sqlx::Result<()> {
    let (router, pool, session) = admin_router(pool).await;
    // The account exists because it has signed in once.
    dev_login(&router, json!({"sso_subject": "new.dean"})).await;

    // A dean grant without a faculty sees nothing, so it is refused outright.
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/roles",
            &json!({"sso_subject": "new.dean", "role": "dean"}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    // An account that has never signed in cannot be granted anything.
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/roles",
            &json!({"sso_subject": "ghost", "role": "ethics"}),
        ),
    )
    .await
    .problem(StatusCode::NOT_FOUND);

    let granted = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/roles",
            &json!({
                "sso_subject": "new.dean", "role": "dean", "scope_faculty_code": "FAC03",
            }),
        ),
    )
    .await;
    assert_eq!(granted.status, StatusCode::OK);
    let account = granted.json()["items"]
        .as_array()
        .expect("items")
        .iter()
        .find(|item| item["sso_subject"] == json!("new.dean"))
        .cloned()
        .expect("the account is listed");
    assert_eq!(account["roles"][0]["role"], json!("dean"));

    // The grant takes effect on the next request, not the next login.
    let dean = dev_login(&router, json!({"sso_subject": "new.dean"})).await;
    let ping = send(&router, authenticated(&dean, "GET", "/api/internal/ping")).await;
    assert_eq!(ping.status, StatusCode::OK);
    assert_eq!(ping.json()["scope"]["kind"], json!("faculty"));

    // And revocation closes it just as fast (TZ §5).
    let revoked = send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/roles",
            &json!({
                "sso_subject": "new.dean", "role": "dean", "scope_faculty_code": "FAC03",
            }),
        ),
    )
    .await;
    assert_eq!(revoked.status, StatusCode::NO_CONTENT);
    send(&router, authenticated(&dean, "GET", "/api/internal/ping"))
        .await
        .problem(StatusCode::FORBIDDEN);

    let rows = audit_rows(&pool).await;
    assert!(
        rows.iter()
            .any(|row| row.section == "roles" && row.filters["change"]["op"] == json!("revoke"))
    );
    Ok(())
}

// ── staff units ─────────────────────────────────────────────────────────────

/// The reviewer e-mail is HMAC'd and masked in the handler; nothing nominative
/// is persisted, echoed or journalled (AGENTS.md invariant #1, ADR-008 §2).
#[sqlx::test(migrations = "../../migrations")]
async fn a_staff_mapping_stores_a_digest_and_a_masked_label(pool: PgPool) -> sqlx::Result<()> {
    let (router, pool, session) = admin_router(pool).await;
    const EMAIL: &str = "n.balgulov@teachers.tou.edu.kz";

    let created = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/staff-units",
            &json!({
                "email": EMAIL, "faculty_code": "FAC03", "department_code": "DEP11",
            }),
        ),
    )
    .await;
    assert_eq!(created.status, StatusCode::OK);
    let body = created.body.clone();
    assert!(
        !String::from_utf8_lossy(&body).contains("n.balgulov"),
        "the response must not echo the address"
    );

    let item = created.json()["items"]
        .as_array()
        .expect("items")
        .first()
        .cloned()
        .expect("the mapping is listed");
    // The digest is the one `ingest::refs` pins in its known-answer test, so the
    // admin editor and the importer agree about the key.
    assert_eq!(
        item["email_hmac"],
        json!("366ba5686cfe8b73522660a4e70e1255a3de1c8ab962ec39dde835c4f609252e")
    );
    // `ingest::masked_label` keeps the first and last three characters of the
    // local part; the rest is stars (ADR-008 §2).
    assert_eq!(item["masked_label"], json!("n***ulov@teachers.tou.edu.kz"));
    assert_eq!(item["department_code"], json!("DEP11"));

    let rows = audit_rows(&pool).await;
    let row = rows
        .iter()
        .find(|row| row.section == "staff-units")
        .expect("the mapping is audited");
    assert!(
        !row.filters.to_string().contains("n.balgulov"),
        "the audit row must carry the masked label, not the address: {}",
        row.filters
    );

    // Removal takes the hex digest.
    let hmac = item["email_hmac"].as_str().unwrap_or_default().to_owned();
    let removed = send(
        &router,
        mutate(
            &session,
            "DELETE",
            &format!("/api/admin/staff-units/{hmac}"),
            &json!({}),
        ),
    )
    .await;
    assert_eq!(removed.status, StatusCode::NO_CONTENT);
    send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/staff-units/not-a-digest",
            &json!({}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    Ok(())
}

// ── derivation rules and sources ────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn derivation_rules_and_sources_round_trip(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool, session) = admin_router(pool).await;

    let rule = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/work-type-rules",
            &json!({"pattern": "курсовая", "work_type_code": "course", "priority": 10}),
        ),
    )
    .await;
    assert_eq!(rule.status, StatusCode::OK);
    let rule_id = rule.json()["items"][0]["id"].as_i64().expect("rule id");

    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/work-type-rules",
            &json!({"pattern": "", "work_type_code": "course"}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/work-type-rules",
            &json!({"pattern": "x", "work_type_code": "no-such-type"}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    let updated = send(
        &router,
        mutate(
            &session,
            "PUT",
            &format!("/api/admin/work-type-rules/{rule_id}"),
            &json!({
                "pattern": "курсовая работа", "work_type_code": "course",
                "priority": 5, "active": false,
            }),
        ),
    )
    .await;
    assert_eq!(updated.status, StatusCode::OK);
    assert_eq!(updated.json()["items"][0]["active"], json!(false));

    let initiator = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/initiator-rules",
            &json!({"pattern": "@teachers\\.tou\\.edu\\.kz$", "initiator": "staff_self"}),
        ),
    )
    .await;
    assert_eq!(initiator.status, StatusCode::OK);
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/initiator-rules",
            &json!({"pattern": "x", "initiator": "professor"}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    // Sources: create, list, then trigger a run for one that does not exist.
    let source = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/ingest/sources",
            &json!({"kind": "csv", "base_url": "/srv/imports", "enabled": false}),
        ),
    )
    .await;
    assert_eq!(source.status, StatusCode::OK);
    assert_eq!(source.json()["items"][0]["kind"], json!("csv"));
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/ingest/sources",
            &json!({"kind": "ftp"}),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/ingest/run",
            &json!({"source_id": 999_999}),
        ),
    )
    .await
    .problem(StatusCode::NOT_FOUND);

    // The import journal is readable and empty on a fresh database.
    let batches = send(
        &router,
        authenticated(&session, "GET", "/api/admin/ingest/batches"),
    )
    .await;
    assert_eq!(batches.status, StatusCode::OK);
    assert_eq!(batches.json()["total"], json!(0));
    Ok(())
}

// ── manual registers ────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn the_manual_registers_round_trip(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool, session) = admin_router(pool).await;

    // Ethics counters: closed cases cannot exceed referred ones.
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/ethics-cases",
            &json!({
                "academic_year": 2025, "category": "plagiarism",
                "referred": 3, "reviewed_closed": 4,
            }),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    let created = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/ethics-cases",
            &json!({
                "academic_year": 2025, "category": "plagiarism",
                "referred": 12, "reviewed_closed": 9,
            }),
        ),
    )
    .await;
    assert_eq!(created.status, StatusCode::OK);
    let case_id = created.json()["items"][0]["id"].as_i64().expect("case id");

    let updated = send(
        &router,
        mutate(
            &session,
            "PUT",
            &format!("/api/admin/ethics-cases/{case_id}"),
            &json!({
                "academic_year": 2025, "category": "ghostwriting",
                "referred": 4, "reviewed_closed": 4,
            }),
        ),
    )
    .await;
    assert_eq!(updated.status, StatusCode::OK);
    assert_eq!(
        updated.json()["items"][0]["category"],
        json!("ghostwriting")
    );

    // Coverage denominators.
    send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/submission-totals",
            &json!({
                "academic_year": 2025, "work_type_code": "no-such-type",
                "total_submitted": 10,
            }),
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    let totals = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/submission-totals",
            &json!({
                "academic_year": 2025, "work_type_code": "course", "total_submitted": 900,
            }),
        ),
    )
    .await;
    assert_eq!(totals.status, StatusCode::OK);
    assert_eq!(totals.json()["items"][0]["total_submitted"], json!(900));

    // Usage figures, stored at the first day of the month.
    let usage = send(
        &router,
        mutate(
            &session,
            "POST",
            "/api/admin/usage-stats",
            &json!({
                "period_month": "2025-11-17", "active_users": 172,
                "avg_check_seconds": 45,
            }),
        ),
    )
    .await;
    assert_eq!(usage.status, StatusCode::OK);
    assert_eq!(
        usage.json()["items"][0]["period_month"],
        json!("2025-11-01"),
        "any day in the month normalizes to its first"
    );

    let deleted = send(
        &router,
        mutate(
            &session,
            "DELETE",
            "/api/admin/usage-stats",
            &json!({"period_month": "2025-11-01"}),
        ),
    )
    .await;
    assert_eq!(deleted.status, StatusCode::NO_CONTENT);
    Ok(())
}

// ── audit browser ───────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn the_audit_browser_paginates_and_filters(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool, session) = admin_router(pool).await;
    let compliance = dev_login(
        &router,
        json!({"sso_subject": "compliance-browser", "role": "compliance"}),
    )
    .await;

    // Two different actors, two different sections.
    for _ in 0..3 {
        send(
            &router,
            authenticated(&compliance, "GET", "/api/internal/ping"),
        )
        .await;
    }
    send(&router, authenticated(&session, "GET", "/api/admin/ping")).await;

    let all = send(&router, authenticated(&session, "GET", "/api/admin/audit")).await;
    assert_eq!(all.status, StatusCode::OK);
    let body = all.json();
    assert!(body["total"].as_i64().unwrap_or_default() >= 4, "{body}");
    // TZ §6.3 - the retention floor is reported, and there is no deletion job.
    assert_eq!(body["retention_days"], json!(365));
    assert_eq!(
        body["actions"],
        json!(["view", "export_pdf", "export_xlsx", "admin_change"])
    );

    let by_role = send(
        &router,
        authenticated(
            &session,
            "GET",
            "/api/admin/audit?role=compliance&section=ping",
        ),
    )
    .await;
    let rows = by_role.json();
    assert_eq!(rows["total"], json!(3), "{rows}");
    for row in rows["items"].as_array().expect("items") {
        assert_eq!(row["role"], json!("compliance"));
        assert_eq!(row["action"], json!("view"));
    }

    // Pagination is bounded and the filters are a closed vocabulary.
    let page = send(
        &router,
        authenticated(&session, "GET", "/api/admin/audit?limit=1"),
    )
    .await;
    assert_eq!(page.json()["items"].as_array().map(Vec::len), Some(1));
    send(
        &router,
        authenticated(&session, "GET", "/api/admin/audit?action=delete"),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    send(
        &router,
        authenticated(&session, "GET", "/api/admin/audit?role=root"),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    send(
        &router,
        authenticated(&session, "GET", "/api/admin/audit?from=yesterday"),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    // A date filter accepts a bare calendar day, in the +05:00 calendar.
    let today = send(
        &router,
        authenticated(&session, "GET", "/api/admin/audit?from=2020-01-01"),
    )
    .await;
    assert_eq!(today.status, StatusCode::OK);
    Ok(())
}

/// The audit log is append-only at the schema level: there is no API that
/// mutates it, and the trigger of migration 0001 refuses one anyway
/// (AGENTS.md invariant #4).
#[sqlx::test(migrations = "../../migrations")]
async fn the_audit_log_cannot_be_rewritten(pool: PgPool) -> sqlx::Result<()> {
    let (router, pool, session) = admin_router(pool).await;
    send(&router, authenticated(&session, "GET", "/api/admin/ping")).await;

    for statement in [
        "UPDATE audit_log SET action = 'view'",
        "DELETE FROM audit_log",
    ] {
        let result = sqlx::query(statement).execute(&*pool).await;
        assert!(
            result.is_err(),
            "`{statement}` must be refused by the append-only trigger"
        );
    }

    // No route mutates it either.
    for method in ["POST", "PUT", "DELETE", "PATCH"] {
        let reply = send(
            &router,
            mutate(&session, method, "/api/admin/audit", &json!({})),
        )
        .await;
        assert_eq!(
            reply.status,
            StatusCode::METHOD_NOT_ALLOWED,
            "{method} /api/admin/audit should not exist"
        );
    }
    Ok(())
}
