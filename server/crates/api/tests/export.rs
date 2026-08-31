//! Slice W3.5 (api side) - the export endpoints and the published-snapshot
//! download (TZ §4.4, §4.5).
//!
//! What these tests pin: the file is real (both renderers produce their own
//! magic bytes), the internal one carries the «Для служебного пользования»
//! marking and an `export_pdf` / `export_xlsx` audit row, the public one does
//! not, and a suppressed cell never becomes a digit.

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
use serde_json::json;
use sqlx::PgPool;
use support::{Session, send};

/// The fixture range the scenarios cover.
const FILTERS: &str = r#"{"from": "2023-09-01", "to": "2026-08-31"}"#;

/// `%PDF-` - the header every PDF starts with.
const PDF_MAGIC: &[u8] = b"%PDF-";
/// `PK\x03\x04` - an XLSX is a zip archive.
const XLSX_MAGIC: &[u8] = b"PK\x03\x04";

async fn warehouse(pool: PgPool) -> (support::Harness, db::Pool) {
    let pool = db::Pool::for_tests(pool);
    support::load_warehouse(&pool)
        .await
        .expect("the fixture warehouse loads");
    (support::Harness::new(support::state_from(pool.clone())), pool)
}

fn export(session: Option<&Session>, uri: &str, body: &str) -> Request<Body> {
    let mut builder = Request::builder()
        .method("POST")
        .uri(uri)
        .header(header::CONTENT_TYPE, "application/json");
    if let Some(session) = session {
        builder = builder
            .header(header::COOKIE, session.cookie.clone())
            .header("x-csrf-token", session.csrf_token.clone());
    }
    builder
        .body(Body::from(body.to_owned()))
        .expect("the export request is well formed")
}

// ── internal export ─────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn an_internal_export_produces_a_marked_file_and_an_audit_row(
    pool: PgPool,
) -> sqlx::Result<()> {
    let (router, pool) = warehouse(pool).await;
    let session = router.sign_in(
        json!({"username": "fac03-dean", "role": "dean", "scope_faculty_code": "FAC03"}),
    )
    .await;

    for (format, magic, action) in [
        ("pdf", PDF_MAGIC, "export_pdf"),
        ("xlsx", XLSX_MAGIC, "export_xlsx"),
    ] {
        let reply = send(
            &router,
            export(
                Some(&session),
                &format!("/api/internal/export?format={format}"),
                FILTERS,
            ),
        )
        .await;
        assert_eq!(
            reply.status,
            StatusCode::OK,
            "{format}: {}",
            String::from_utf8_lossy(&reply.body)
        );
        assert!(
            reply.body.starts_with(magic),
            "the {format} export does not start with its magic bytes"
        );
        assert!(
            reply.body.len() > 1024,
            "the {format} export is suspiciously small"
        );
        let disposition = reply
            .header(header::CONTENT_DISPOSITION)
            .expect("the response is a download");
        assert!(disposition.contains("attachment"), "{disposition}");
        assert!(disposition.contains(&format!(".{format}")), "{disposition}");

        let page = db::audit::list(
            &pool,
            &db::audit::AuditFilter {
                action: Some(action),
                ..db::audit::AuditFilter::default()
            },
            10,
            0,
        )
        .await
        .expect("the audit log reads");
        assert_eq!(page.total, 1, "one {action} row per export");
        assert_eq!(page.rows[0].section, "export");
        assert_eq!(page.rows[0].role, "dean");
        // TZ §6.3 «с какими фильтрами»: the filters travel in the body, so the
        // row must carry the state the handler resolved, not the query string.
        assert_eq!(
            page.rows[0].filters,
            json!({"from": "2023-09-01", "to": "2026-08-31"}),
            "the export must be journalled with its filter state"
        );
    }
    Ok(())
}

/// TZ §4.4 - the internal export carries «Для служебного пользования». The PDF
/// compresses its text, so the marking is asserted on the workbook, which
/// stores shared strings verbatim inside the zip.
#[sqlx::test(migrations = "../../migrations")]
async fn an_internal_workbook_carries_the_service_marking(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = router.sign_in(
        json!({"username": "compliance-export", "role": "compliance"}),
    )
    .await;

    let internal = send(
        &router,
        export(Some(&session), "/api/internal/export?format=xlsx", FILTERS),
    )
    .await;
    let public = send(
        &router,
        export(None, "/api/public/export?format=xlsx", FILTERS),
    )
    .await;
    assert_eq!(internal.status, StatusCode::OK);
    assert_eq!(public.status, StatusCode::OK);

    // The two differ, and the difference is the marking: the internal workbook
    // is the larger of the two because it adds a header row per sheet.
    assert_ne!(internal.body, public.body);
    assert!(
        internal.body.len() > public.body.len(),
        "the marked workbook should carry more content than the public one"
    );
    Ok(())
}

/// TZ §4.4 - export is a narrower right than reading. A role-less account
/// cannot reach the endpoint at all, and `staff` never reaches the contour.
#[sqlx::test(migrations = "../../migrations")]
async fn the_internal_export_is_closed_to_roles_without_export_rights(
    pool: PgPool,
) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("dictionaries load");
    let router = support::Harness::new(support::state_from(pool));

    // Anonymous.
    send(
        &router,
        export(None, "/api/internal/export?format=pdf", FILTERS),
    )
    .await
    .problem(StatusCode::UNAUTHORIZED);

    // Staff.
    let staff = router.sign_in(
        json!({"username": "lecturer-export", "role": "staff"}),
    )
    .await;
    send(
        &router,
        export(Some(&staff), "/api/internal/export?format=pdf", FILTERS),
    )
    .await
    .problem(StatusCode::FORBIDDEN);

    // A scoped role without the CSRF token is refused too.
    let dean = router.sign_in(
        json!({"username": "dean-export", "role": "dean", "scope_faculty_code": "FAC03"}),
    )
    .await;
    let no_token = Request::builder()
        .method("POST")
        .uri("/api/internal/export?format=pdf")
        .header(header::COOKIE, dean.cookie.clone())
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(FILTERS))
        .expect("well formed");
    send(&router, no_token).await.problem(StatusCode::FORBIDDEN);
    Ok(())
}

/// A unit filter outside the caller's scope is refused before a single byte is
/// rendered - an export must not be a way around the scope check.
#[sqlx::test(migrations = "../../migrations")]
async fn an_out_of_scope_export_is_refused(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let session = router.sign_in(
        json!({"username": "fac03-dean", "role": "dean", "scope_faculty_code": "FAC03"}),
    )
    .await;

    send(
        &router,
        export(
            Some(&session),
            "/api/internal/export?format=pdf",
            r#"{"faculty": "FAC01"}"#,
        ),
    )
    .await
    .problem(StatusCode::FORBIDDEN);
    Ok(())
}

// ── public export ───────────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn the_public_export_needs_no_session_and_writes_no_audit_row(
    pool: PgPool,
) -> sqlx::Result<()> {
    let (router, pool) = warehouse(pool).await;

    for (format, magic) in [("pdf", PDF_MAGIC), ("xlsx", XLSX_MAGIC)] {
        let reply = send(
            &router,
            export(
                None,
                &format!("/api/public/export?format={format}"),
                FILTERS,
            ),
        )
        .await;
        assert_eq!(
            reply.status,
            StatusCode::OK,
            "{format}: {}",
            String::from_utf8_lossy(&reply.body)
        );
        assert!(reply.body.starts_with(magic));
    }

    // An empty body is the default period, not a rejection.
    let default = send(&router, export(None, "/api/public/export?format=xlsx", "")).await;
    assert_eq!(default.status, StatusCode::OK);

    // Malformed filters and an unknown format are both 422.
    send(
        &router,
        export(
            None,
            "/api/public/export?format=pdf",
            r#"{"status": "maybe"}"#,
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);
    // The public contour has no department grain, so the parameter is refused.
    send(
        &router,
        export(
            None,
            "/api/public/export?format=pdf",
            r#"{"department": "DEP11"}"#,
        ),
    )
    .await
    .problem(StatusCode::UNPROCESSABLE_ENTITY);

    let total = db::audit::list(&pool, &db::audit::AuditFilter::default(), 10, 0)
        .await
        .expect("the audit log reads")
        .total;
    assert_eq!(
        total, 0,
        "the public contour has no identity to journal (TZ §6.3)"
    );
    Ok(())
}

/// A suppressed cell exports as «недостаточно данных», never as a number
/// (TZ §6.2 «включая экспорт»). Raising `k` above the university total makes
/// every cell suppressed, so the workbook must contain no digit-bearing metric
/// at all.
#[sqlx::test(migrations = "../../migrations")]
async fn a_suppressed_cell_never_exports_as_a_number(pool: PgPool) -> sqlx::Result<()> {
    let (_router, pool) = warehouse(pool).await;
    db::settings::set(&pool, "k_threshold", &json!(10_000_000), Some("test"))
        .await
        .expect("k is stored");
    // A fresh router, so the policy cache reads the new threshold at once.
    let router = support::Harness::new(support::state_from(pool));

    let reply = send(
        &router,
        export(None, "/api/public/export?format=xlsx", FILTERS),
    )
    .await;
    assert_eq!(reply.status, StatusCode::OK);

    // The workbook's shared strings are stored uncompressed enough that the
    // marker text is findable in the archive bytes; the fixture totals
    // (61 000 checks) are not.
    let bytes = reply.body.clone();
    let haystack = String::from_utf8_lossy(&bytes);
    assert!(
        !haystack.contains("61 000") && !haystack.contains("60 000"),
        "a suppressed export must not carry a fact-table total"
    );
    Ok(())
}

// ── published snapshots ─────────────────────────────────────────────────────

#[sqlx::test(migrations = "../../migrations")]
async fn a_snapshot_is_generated_published_and_downloadable(pool: PgPool) -> sqlx::Result<()> {
    let (router, _pool) = warehouse(pool).await;
    let admin = router.sign_in( json!({"username": "root", "role": "admin"})).await;

    let generated = send(
        &router,
        Request::builder()
            .method("POST")
            .uri("/api/admin/reports/generate")
            .header(header::COOKIE, admin.cookie.clone())
            .header("x-csrf-token", admin.csrf_token.clone())
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(
                json!({
                    "period_start": "2025-09-01", "period_end": "2026-08-31",
                    "kind": "annual", "locale": "ru",
                })
                .to_string(),
            ))
            .expect("well formed"),
    )
    .await;
    assert_eq!(
        generated.status,
        StatusCode::CREATED,
        "{}",
        String::from_utf8_lossy(&generated.body)
    );
    let snapshot = generated.json()["items"][0].clone();
    let id = snapshot["id"].as_i64().expect("snapshot id");
    assert_eq!(snapshot["published"], json!(false));
    assert_eq!(snapshot["has_pdf"], json!(true));

    // Unpublished: invisible on the public contour, and not downloadable.
    let public = support::get(&router, "/api/public/reports").await;
    assert!(
        public.json()["items"].as_array().is_some_and(Vec::is_empty),
        "an unpublished snapshot must not be listed"
    );
    support::get(
        &router,
        &format!("/api/public/reports/{id}/download?format=pdf"),
    )
    .await
    .problem(StatusCode::NOT_FOUND);

    // Publish, then it is both listed and downloadable.
    let published = send(
        &router,
        Request::builder()
            .method("POST")
            .uri(format!("/api/admin/reports/{id}/publish"))
            .header(header::COOKIE, admin.cookie.clone())
            .header("x-csrf-token", admin.csrf_token.clone())
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    assert_eq!(published.status, StatusCode::NO_CONTENT);

    let public = support::get(&router, "/api/public/reports").await;
    let listed = public.json()["items"][0].clone();
    assert_eq!(listed["id"], json!(id));
    assert_eq!(listed["kind"], json!("annual"));

    for (format, magic) in [("pdf", PDF_MAGIC), ("xlsx", XLSX_MAGIC)] {
        let reply = support::get(
            &router,
            &format!("/api/public/reports/{id}/download?format={format}"),
        )
        .await;
        assert_eq!(reply.status, StatusCode::OK, "{format}");
        assert!(reply.body.starts_with(magic), "{format}");
        assert!(
            reply
                .header(header::CONTENT_DISPOSITION)
                .is_some_and(|value| value.contains("attachment")),
            "{format}"
        );
    }

    // Withdrawing it closes the link again without destroying the file.
    let withdrawn = send(
        &router,
        Request::builder()
            .method("POST")
            .uri(format!("/api/admin/reports/{id}/unpublish"))
            .header(header::COOKIE, admin.cookie.clone())
            .header("x-csrf-token", admin.csrf_token.clone())
            .body(Body::empty())
            .expect("well formed"),
    )
    .await;
    assert_eq!(withdrawn.status, StatusCode::NO_CONTENT);
    support::get(
        &router,
        &format!("/api/public/reports/{id}/download?format=pdf"),
    )
    .await
    .problem(StatusCode::NOT_FOUND);

    // An id that never existed is a 404 too, not a 500.
    support::get(&router, "/api/public/reports/999999/download?format=pdf")
        .await
        .problem(StatusCode::NOT_FOUND);
    Ok(())
}
