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

use api::state::{AppConfig, AppState};
use axum::Router;
use axum::body::{Body, Bytes};
use axum::http::{HeaderMap, HeaderValue, Request, StatusCode, header};
use serde_json::Value;
use sqlx::PgPool;
use tower::ServiceExt;

/// Application state wired for tests.
pub fn state(pool: PgPool) -> AppState {
    AppState::new(db::Pool::for_tests(pool), config())
}

/// The test configuration, with a scratch reports directory so a snapshot test
/// never writes into the repository.
pub fn config() -> AppConfig {
    AppConfig {
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
    AppState::new(pool, config())
}

/// The production router over a test database.
pub fn router(pool: PgPool) -> Harness {
    Harness::new(state(pool))
}

/// The production router, plus the pool behind it.
///
/// Authentication is local (ADR-017) and nothing in the HTTP surface creates an
/// account, so a test that needs a signed-in caller has to reach the database
/// the way `manage-users` does. Carrying the pool beside the router is what
/// lets [`Harness::sign_in`] stay a one-liner at every call site.
///
/// Derefs to the router, so `send(&harness, ...)` and every other helper here
/// take it unchanged.
pub struct Harness {
    router: Router,
    pool: db::Pool,
}

impl Harness {
    pub fn new(state: AppState) -> Self {
        let pool = state.db.clone();
        Self {
            router: api::build_router(state),
            pool,
        }
    }

    pub fn pool(&self) -> &db::Pool {
        &self.pool
    }

    /// Create the account if it is missing, grant the role if one is named, and
    /// sign in through the real `POST /api/auth/login`.
    ///
    /// Additive and idempotent, exactly like the CLI: repeating it for one
    /// login name reuses the row and adds the grant if it is absent. It never
    /// revokes, so a test that needs a different role uses a different name.
    pub async fn sign_in(&self, identity: Value) -> Session {
        let username = identity["username"]
            .as_str()
            .expect("an identity names its account")
            .to_owned();
        provision(&self.pool, &identity).await;
        login(&self.router, &username, TEST_PASSWORD).await
    }
}

impl std::ops::Deref for Harness {
    type Target = Router;

    fn deref(&self) -> &Self::Target {
        &self.router
    }
}

/// The address [`Harness::sign_in`] gives an account it creates.
///
/// Defined once and asserted against rather than spelled out at a call site:
/// `tests/ops.rs` checks that an address appears on the admin roles screen and
/// nowhere else, and a hard-coded domain there drifts the moment the harness
/// changes its mind - which is exactly what happened to the `@dev.invalid` the
/// retired `dev-login` endpoint used to mint.
///
/// Non-routable by construction: these account fields exist so that grants can
/// be administered (TZ §6.1), not so that anyone can be written to.
#[must_use]
pub fn test_email(username: &str) -> String {
    format!("{username}@test.invalid")
}

/// The password every account created by [`Harness::sign_in`] holds.
///
/// Long enough to clear `api::auth::password::MIN_PASSWORD_LENGTH`, and
/// obviously not a secret: it exists only inside a scratch database that
/// `#[sqlx::test]` drops at the end of the test.
pub const TEST_PASSWORD: &str = "test-account-password";

/// Create the account and apply the grant, the way `manage-users` would.
async fn provision(pool: &db::Pool, identity: &Value) {
    let username = identity["username"]
        .as_str()
        .expect("an identity names its account");
    let user = match db::users::by_username(pool, username)
        .await
        .expect("user lookup")
    {
        Some(existing) => existing.user,
        None => {
            let hash = api::auth::password::hash(TEST_PASSWORD).expect("hashing succeeds");
            db::users::create(pool, username, &test_email(username), username, Some(&hash))
            .await
            .expect("account creation")
        }
    };

    let Some(label) = identity.get("role").and_then(Value::as_str) else {
        return;
    };
    let role = api::auth::parse_role(label).unwrap_or_else(|| panic!("unknown role `{label}`"));
    let faculty = match identity.get("scope_faculty_code").and_then(Value::as_str) {
        Some(code) => Some(
            *db::dicts::faculty_ids(pool)
                .await
                .expect("faculty dictionary")
                .get(code)
                .unwrap_or_else(|| panic!("no faculty `{code}` in the dictionaries")),
        ),
        None => None,
    };
    let department = match identity.get("scope_department_code").and_then(Value::as_str) {
        Some(code) => Some(
            *db::dicts::department_ids(pool)
                .await
                .expect("department dictionary")
                .get(code)
                .unwrap_or_else(|| panic!("no department `{code}` in the dictionaries")),
        ),
        None => None,
    };
    db::users::add_role(pool, user.id, role, faculty, department)
        .await
        .expect("role grant");
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

/// A signed-in session: everything a subsequent request needs.
pub struct Session {
    pub cookie: String,
    pub csrf_token: String,
    pub body: Value,
}

/// One sign-in request, for the tests that assert on the response themselves.
pub fn login_request(username: &str, password: &str) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri("/api/auth/login")
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(
            serde_json::json!({"username": username, "password": password}).to_string(),
        ))
        .expect("the login request is well formed")
}

/// `POST /api/auth/login`, returning the session cookie and CSRF token.
pub async fn login(router: &Router, username: &str, password: &str) -> Session {
    let reply = send(router, login_request(username, password)).await;
    assert_eq!(
        reply.status,
        StatusCode::OK,
        "login failed: {}",
        String::from_utf8_lossy(&reply.body)
    );

    let cookie = reply
        .headers
        .get(header::SET_COOKIE)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.split(';').next())
        .expect("login sets the session cookie")
        .to_owned();
    let payload = reply.json();
    let csrf_token = payload["csrf_token"]
        .as_str()
        .expect("login returns a CSRF token")
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
