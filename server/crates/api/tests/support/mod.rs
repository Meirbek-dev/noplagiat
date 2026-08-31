//! Shared harness for the `api` integration tests.
//!
//! Everything goes through the real router built by [`api::build_router`], so a
//! layer that is mounted on the wrong contour, or not mounted at all, fails
//! these tests rather than passing them.

#![allow(dead_code, reason = "each test binary uses a different subset")]
// `server/clippy.toml` allows `expect` in `#[test]` functions but not in the
// helpers they call. These helpers exist to abort a test loudly on a malformed
// fixture or a broken harness; they are not a request path, which is what the
// workspace lint protects (ARCHITECTURE.md §4.1).
#![expect(
    clippy::expect_used,
    reason = "test harness: a broken fixture must abort the test"
)]

use std::path::{Path, PathBuf};

use api::state::{AppConfig, AppState, AuthMode};
use axum::Router;
use axum::body::{Body, Bytes};
use axum::http::{HeaderMap, HeaderValue, Request, StatusCode, header};
use serde_json::Value;
use sqlx::PgPool;
use tower::ServiceExt;

pub mod idp;

/// Application state wired for tests: dev auth mode, everything else default.
pub fn state(pool: PgPool) -> AppState {
    AppState::new(db::Pool::for_tests(pool), config(AuthMode::Dev))
}

/// The test configuration, with a scratch reports directory so a snapshot test
/// never writes into the repository.
pub fn config(auth_mode: AuthMode) -> AppConfig {
    AppConfig {
        auth_mode,
        reports_dir: scratch_reports_dir(),
        // The fixture seeder uses this pepper, so a `staff_units` mapping
        // written through the admin API lands on the same digest the importer
        // would have produced (`ingest::refs` known-answer test).
        ingest_pepper: ingest::Pepper::new("dev-pepper").ok(),
        ..AppConfig::new(
            "http://localhost:8080"
                .parse()
                .expect("the test base URL is absolute"),
        )
    }
}

/// A per-process scratch directory for generated snapshots.
pub fn scratch_reports_dir() -> PathBuf {
    let dir = std::env::temp_dir().join(format!("noplagiat-api-tests-{}", std::process::id()));
    let _ = std::fs::create_dir_all(&dir);
    dir
}

/// The same, over a pool the caller has already seeded.
pub fn state_from(pool: db::Pool) -> AppState {
    AppState::new(pool, config(AuthMode::Dev))
}

/// The production router over a test database.
pub fn router(pool: PgPool) -> Router {
    api::build_router(state(pool))
}

/// One HTTP round trip through the router.
pub struct Reply {
    pub status: StatusCode,
    pub headers: HeaderMap,
    pub body: Bytes,
}

impl Reply {
    /// The response body as JSON. Fails the test if it is not JSON - every
    /// endpoint in this crate answers JSON or an RFC 7807 problem.
    pub fn json(&self) -> Value {
        serde_json::from_slice(&self.body).unwrap_or_else(|error| {
            panic!(
                "response body is not JSON ({error}): {}",
                String::from_utf8_lossy(&self.body)
            )
        })
    }

    pub fn header(&self, name: header::HeaderName) -> Option<String> {
        self.headers
            .get(name)
            .and_then(|value| value.to_str().ok())
            .map(str::to_owned)
    }

    /// Assert the response is an RFC 7807 problem of the given status, and
    /// return it.
    pub fn problem(&self, status: StatusCode) -> Value {
        assert_eq!(
            self.status,
            status,
            "expected {status}, body: {}",
            String::from_utf8_lossy(&self.body)
        );
        assert_eq!(
            self.header(header::CONTENT_TYPE).as_deref(),
            Some(api::error::PROBLEM_CONTENT_TYPE),
            "a rejection must carry the problem media type"
        );
        let problem = self.json();
        assert_eq!(problem["status"], serde_json::json!(status.as_u16()));
        assert!(
            problem["type"]
                .as_str()
                .is_some_and(|kind| !kind.is_empty()),
            "problem carries no type: {problem}"
        );
        assert!(
            problem["title"].as_str().is_some_and(|t| !t.is_empty()),
            "problem carries no title: {problem}"
        );
        assert!(
            problem["instance"]
                .as_str()
                .is_some_and(|i| i.starts_with('/')),
            "problem carries no instance: {problem}"
        );
        problem
    }
}

pub async fn send(router: &Router, request: Request<Body>) -> Reply {
    let response = router
        .clone()
        .oneshot(request)
        .await
        .expect("the router is infallible");
    let status = response.status();
    let headers = response.headers().clone();
    let body = axum::body::to_bytes(response.into_body(), 4 * 1024 * 1024)
        .await
        .expect("response body is readable");
    Reply {
        status,
        headers,
        body,
    }
}

pub async fn get(router: &Router, uri: &str) -> Reply {
    let request = Request::builder()
        .uri(uri)
        .body(Body::empty())
        .expect("the test request is well formed");
    send(router, request).await
}

/// A signed-in dev session: everything a subsequent request needs.
pub struct Session {
    pub cookie: String,
    pub csrf_token: String,
    pub body: Value,
}

/// `POST /api/auth/dev-login`, returning the session cookie and CSRF token.
pub async fn dev_login(router: &Router, body: Value) -> Session {
    let request = Request::builder()
        .method("POST")
        .uri("/api/auth/dev-login")
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(body.to_string()))
        .expect("the login request is well formed");
    let reply = send(router, request).await;
    assert_eq!(
        reply.status,
        StatusCode::OK,
        "dev-login failed: {}",
        String::from_utf8_lossy(&reply.body)
    );

    let cookie = reply
        .headers
        .get(header::SET_COOKIE)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.split(';').next())
        .expect("dev-login sets the session cookie")
        .to_owned();
    let payload = reply.json();
    let csrf_token = payload["csrf_token"]
        .as_str()
        .expect("dev-login returns a CSRF token")
        .to_owned();
    Session {
        cookie,
        csrf_token,
        body: payload,
    }
}

/// A request carrying the session cookie.
pub fn authenticated(session: &Session, method: &str, uri: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header(header::COOKIE, cookie_value(&session.cookie))
        .body(Body::empty())
        .expect("the authenticated request is well formed")
}

/// A mutating request carrying both the session cookie and the CSRF token.
pub fn mutating(session: &Session, method: &str, uri: &str, csrf: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header(header::COOKIE, cookie_value(&session.cookie))
        .header("x-csrf-token", csrf)
        .body(Body::empty())
        .expect("the mutating request is well formed")
}

fn cookie_value(cookie: &str) -> HeaderValue {
    HeaderValue::try_from(cookie).expect("the session cookie is header-safe")
}

// ── fixtures ────────────────────────────────────────────────────────────────

pub fn fixtures_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../fixtures")
}

/// Fail with the exact command that produces the missing artefact rather than
/// skipping the gate (AGENTS.md invariant #7).
pub fn require_fixture(path: &Path) {
    assert!(
        path.exists(),
        "missing fixture {}. Run:\n  bun fixtures/generate.ts --scale small && bun fixtures/expected.ts",
        path.display()
    );
}

/// The dictionaries alone, for tests that need unit codes but no facts.
pub async fn load_dictionaries(pool: &db::Pool) -> sqlx::Result<()> {
    let path = fixtures_root().join("dictionaries.sql");
    require_fixture(&path);
    let sql = std::fs::read_to_string(&path).expect("dictionaries.sql is readable");
    // Generated fixture SQL from the repository, never user input.
    sqlx::raw_sql(sqlx::AssertSqlSafe(sql))
        .execute(&**pool)
        .await?;
    Ok(())
}

/// Dictionaries plus the 60 000 fact rows plus a matview refresh - the same
/// loader the `db` integration tests use, so both lanes see identical numbers.
pub async fn load_warehouse(pool: &db::Pool) -> sqlx::Result<u64> {
    let dictionaries = fixtures_root().join("dictionaries.sql");
    require_fixture(&dictionaries);
    let sql = std::fs::read_to_string(&dictionaries).expect("dictionaries.sql is readable");
    // Generated fixture SQL from the repository, never user input.
    sqlx::raw_sql(sqlx::AssertSqlSafe(sql))
        .execute(&**pool)
        .await?;

    let facts = fixtures_root().join("out/facts.jsonl");
    require_fixture(&facts);
    let upserted = db::checks::load_facts_jsonl(pool, &facts, "fixture")
        .await
        .expect("fixture facts load");
    Ok(upserted)
}

/// The committed reference aggregates.
pub fn expected_json() -> Value {
    let path = fixtures_root().join("expected.json");
    require_fixture(&path);
    let raw = std::fs::read_to_string(&path).expect("expected.json is readable");
    serde_json::from_str(&raw).expect("expected.json is valid JSON")
}

/// One scenario of `fixtures/expected.json` by name.
pub fn scenario(expected: &Value, name: &str) -> Value {
    expected["scenarios"]
        .as_array()
        .expect("expected.json carries a scenario array")
        .iter()
        .find(|scenario| scenario["name"] == serde_json::json!(name))
        .unwrap_or_else(|| panic!("expected.json has no scenario `{name}`"))
        .clone()
}

/// The query string that reproduces a scenario's filters on a public endpoint.
pub fn scenario_query(scenario: &Value) -> String {
    let filters = &scenario["filters"];
    let mut parameters = vec![
        format!(
            "from={}",
            filters["from"].as_str().expect("scenario has a start date")
        ),
        format!(
            "to={}",
            filters["to"].as_str().expect("scenario has an end date")
        ),
    ];
    if let Some(faculty) = filters["faculty"].as_str() {
        parameters.push(format!("faculty={faculty}"));
    }
    if let Some(work_type) = filters["workType"].as_str() {
        parameters.push(format!("work_type={work_type}"));
    }
    if let Some(status) = filters["status"].as_str() {
        parameters.push(format!("status={status}"));
    }
    parameters.join("&")
}

/// The query string that reproduces a scenario's filters on a **public**
/// endpoint (ADR-016).
///
/// It reads the scenario's `public_filters` block rather than its raw
/// `filters`, because the two are deliberately different: the public window is
/// snapped to whole months, and `status`, `department` and `program` are not
/// public dimensions at all - sending one is a `422`, which
/// `tests/closure.rs` asserts separately.
pub fn public_query(scenario: &Value) -> String {
    let filters = &scenario["public_filters"];
    let mut parameters = vec![
        format!(
            "from={}",
            filters["from"]
                .as_str()
                .expect("scenario has a public start date")
        ),
        format!(
            "to={}",
            filters["to"]
                .as_str()
                .expect("scenario has a public end date")
        ),
    ];
    if let Some(faculty) = filters["faculty"].as_str() {
        parameters.push(format!("faculty={faculty}"));
    }
    if let Some(work_type) = filters["work_type"].as_str() {
        parameters.push(format!("work_type={work_type}"));
    }
    parameters.join("&")
}

/// `expected.json` rounds means half-up to 4 dp, so a computed mean may differ
/// from the published one by at most half of the last digit.
pub const MEAN_TOLERANCE: f64 = 5e-5 + 1e-9;

/// Assert a screened JSON cell holds the expected number.
pub fn assert_visible_int(context: &str, value: &Value, want: i64) {
    assert_eq!(
        value.as_i64(),
        Some(want),
        "{context}: expected {want}, got {value}"
    );
}

pub fn assert_visible_close(context: &str, value: &Value, want: f64) {
    assert_visible_close_within(context, value, want, MEAN_TOLERANCE);
}

/// An expectation recombined from several already-rounded `expected.json`
/// figures (a faculty mean from its department means) carries their rounding
/// error as well as the response's own, so it is compared a little wider.
pub const DERIVED_MEAN_TOLERANCE: f64 = 2e-4;

pub fn assert_visible_close_within(context: &str, value: &Value, want: f64, tolerance: f64) {
    let got = value
        .as_f64()
        .unwrap_or_else(|| panic!("{context}: expected a number, got {value}"));
    assert!(
        (got - want).abs() <= tolerance,
        "{context}: got {got}, expected {want} (tolerance {tolerance})"
    );
}

/// Assert a screened JSON cell is the suppression marker.
pub fn assert_suppressed(context: &str, value: &Value) {
    assert_eq!(
        value.as_str(),
        Some(compliance::SUPPRESSED_MARKER),
        "{context}: expected the suppression marker, got {value}"
    );
}
