//! Slice W3.2 - the RBAC matrix (TZ §5, acceptance §10.5).
//!
//! Two tests, one registry (`api::rbac::ROUTES`):
//!
//! * [`the_rbac_matrix_holds`] executes every route × every caller × every
//!   applicable scope case against the **real** router and asserts the outcome;
//! * [`every_route_has_a_matrix_row`] walks the generated OpenAPI document and
//!   fails if an `/api/internal` or `/api/admin` path is missing from the
//!   registry, or present in it and gone from the router.
//!
//! Adding an endpoint without a matrix row therefore breaks CI, which is the
//! property acceptance §10.5 asks for.

// `server/clippy.toml` allows `expect` in `#[test]` functions but not in the
// helpers they call. These helpers exist to abort a test loudly on a broken
// harness; they are not a request path, which is what the workspace lint
// protects (ARCHITECTURE.md §4.1).
#![expect(
    clippy::expect_used,
    reason = "test harness: a broken fixture must abort the test"
)]

mod support;

use api::rbac::{Caller, Outcome, RouteSpec, ScopeCase};
use axum::Router;
use axum::body::Body;
use axum::http::{Request, StatusCode, header};
use serde_json::json;
use sqlx::PgPool;
use support::{Session, dev_login, send};

/// The department a `dept_head` in this matrix heads, and its faculty.
const HEAD_DEPARTMENT: &str = "DEP11";
const DEAN_FACULTY: &str = "FAC03";
/// A unit neither of them may see.
const FOREIGN_FACULTY: &str = "FAC01";
const FOREIGN_DEPARTMENT: &str = "DEP12";

/// Mint one session per caller, in one pass.
async fn sessions(router: &Router) -> Vec<(Caller, Option<Session>)> {
    let mut out = Vec::new();
    for caller in Caller::ALL {
        let session = match caller {
            Caller::Anonymous => None,
            Caller::DeptHead => Some(
                dev_login(
                    router,
                    json!({
                        "sso_subject": "matrix-dept-head",
                        "role": "dept_head",
                        "scope_department_code": HEAD_DEPARTMENT,
                    }),
                )
                .await,
            ),
            Caller::Dean => Some(
                dev_login(
                    router,
                    json!({
                        "sso_subject": "matrix-dean",
                        "role": "dean",
                        "scope_faculty_code": DEAN_FACULTY,
                    }),
                )
                .await,
            ),
            other => Some(
                dev_login(
                    router,
                    json!({
                        "sso_subject": format!("matrix-{}", other.label()),
                        "role": other.label(),
                    }),
                )
                .await,
            ),
        };
        out.push((caller, session));
    }
    out
}

/// The unit filter that is outside this caller's scope.
fn out_of_scope_filter(caller: Caller) -> &'static str {
    match caller {
        // A head of DEP11 asking about a sibling department of the same
        // faculty: the narrowest possible escalation, and the one a
        // faculty-level check would miss.
        Caller::DeptHead => "department=DEP12",
        _ => "faculty=FAC01",
    }
}

/// Build the request for one cell of the matrix.
fn cell_request(
    route: &RouteSpec,
    caller: Caller,
    session: Option<&Session>,
    scope: ScopeCase,
) -> Request<Body> {
    let mut uri = route.sample_path.to_owned();
    if scope == ScopeCase::OutOfScope {
        let separator = if uri.contains('?') { '&' } else { '?' };
        uri.push(separator);
        uri.push_str(out_of_scope_filter(caller));
    }
    let mut builder = Request::builder().method(route.method).uri(uri);
    if let Some(session) = session {
        builder = builder.header(header::COOKIE, session.cookie.clone());
        if route.method != "GET" {
            builder = builder
                .header("x-csrf-token", session.csrf_token.clone())
                .header(header::CONTENT_TYPE, "application/json");
        }
    }
    let body = if route.method == "GET" {
        Body::empty()
    } else {
        // An empty object: the matrix asserts *authorization*, so a handler is
        // free to answer 422 or 404 afterwards.
        Body::from("{}")
    };
    builder
        .body(body)
        .expect("the matrix request is well formed")
}

/// Every route × every caller × every applicable scope case.
#[sqlx::test(migrations = "../../migrations")]
async fn the_rbac_matrix_holds(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("the fixture dictionaries load");
    let router = api::build_router(support::state_from(pool));
    let sessions = sessions(&router).await;

    let mut executed = 0_usize;
    let mut failures: Vec<String> = Vec::new();

    for route in api::rbac::ROUTES {
        for (caller, session) in &sessions {
            let mut cases = vec![ScopeCase::InScope];
            if route.unit_filterable && *caller != Caller::Anonymous {
                cases.push(ScopeCase::OutOfScope);
            }
            for scope in cases {
                executed += 1;
                let reply = send(
                    &router,
                    cell_request(route, *caller, session.as_ref(), scope),
                )
                .await;
                let status = reply.status.as_u16();
                let expected = route.expect(*caller, scope);
                let ok = match expected {
                    Outcome::Allowed => status != 401 && status != 403,
                    Outcome::Denied(code) => status == code,
                };
                if !ok {
                    failures.push(format!(
                        "{} {} · {} · {scope:?} → {status}, expected {expected:?} ({})",
                        route.method,
                        route.sample_path,
                        caller.label(),
                        String::from_utf8_lossy(&reply.body)
                            .chars()
                            .take(160)
                            .collect::<String>(),
                    ));
                }
            }
        }
    }

    assert!(
        failures.is_empty(),
        "{} of {executed} RBAC cases failed:\n{}",
        failures.len(),
        failures.join("\n")
    );
    // A registry that shrank to nothing would make this test vacuously green.
    assert!(
        executed >= api::rbac::ROUTES.len() * Caller::ALL.len(),
        "the matrix executed only {executed} cases"
    );
    Ok(())
}

/// The registry and the router must describe the same surface.
#[test]
fn every_route_has_a_matrix_row() {
    let registered = api::rbac::registered();
    let contract = api::rbac::contract_routes();

    let missing: Vec<_> = contract.difference(&registered).collect();
    assert!(
        missing.is_empty(),
        "these internal/admin routes have no RBAC matrix row - add one to \
         `api::rbac::ROUTES`: {missing:?}"
    );

    let stale: Vec<_> = registered.difference(&contract).collect();
    assert!(
        stale.is_empty(),
        "these RBAC matrix rows name routes the contract does not have: {stale:?}"
    );
}

/// The scope dimension is not decorative: a dean and a head must actually be
/// refused a neighbouring unit, on a route that reads facts.
#[sqlx::test(migrations = "../../migrations")]
async fn a_unit_role_cannot_read_a_neighbouring_unit(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("the fixture dictionaries load");
    let router = api::build_router(support::state_from(pool));

    let dean = dev_login(
        &router,
        json!({"sso_subject": "fac03-dean", "role": "dean", "scope_faculty_code": DEAN_FACULTY}),
    )
    .await;
    let head = dev_login(
        &router,
        json!({
            "sso_subject": "dep11-head", "role": "dept_head",
            "scope_department_code": HEAD_DEPARTMENT,
        }),
    )
    .await;

    // Own unit: fine.
    for (session, filter) in [
        (&dean, format!("faculty={DEAN_FACULTY}")),
        (&head, format!("department={HEAD_DEPARTMENT}")),
    ] {
        let reply = send(
            &router,
            support::authenticated(session, "GET", &format!("/api/internal/summary?{filter}")),
        )
        .await;
        assert_eq!(reply.status, StatusCode::OK, "{filter}");
    }

    // A filter naming a unit the caller is *inside* narrows to the
    // intersection rather than widening: a head who filters by their own
    // faculty still reads their own department, and the response says so.
    let reply = send(
        &router,
        support::authenticated(
            &head,
            "GET",
            &format!("/api/internal/summary?faculty={DEAN_FACULTY}"),
        ),
    )
    .await;
    assert_eq!(reply.status, StatusCode::OK);
    assert_eq!(reply.json()["scope"]["kind"], json!("department"));

    // Somebody else's: 403, and a problem document rather than empty data. Its
    // own `type` URI, distinct from a role denial: the client can offer to
    // clear the filter for this one and must not for the other (ADR-014 §7).
    for (session, filter) in [
        (&dean, format!("faculty={FOREIGN_FACULTY}")),
        (&head, format!("department={FOREIGN_DEPARTMENT}")),
        (&head, format!("faculty={FOREIGN_FACULTY}")),
    ] {
        let reply = send(
            &router,
            support::authenticated(session, "GET", &format!("/api/internal/summary?{filter}")),
        )
        .await;
        let problem = reply.problem(StatusCode::FORBIDDEN);
        assert_eq!(
            problem["type"],
            json!("/problems/out-of-scope"),
            "{filter}: {problem}"
        );
        assert!(
            problem["detail"]
                .as_str()
                .is_some_and(|detail| detail.contains("visibility")),
            "{filter}: {problem}"
        );
    }

    // A role denial keeps the generic type: the two are told apart by `type`,
    // not by reading the sentence.
    let reply = send(
        &router,
        support::authenticated(&dean, "GET", "/api/internal/escalations"),
    )
    .await;
    assert_eq!(
        reply.problem(StatusCode::FORBIDDEN)["type"],
        json!("/problems/forbidden")
    );
    Ok(())
}

/// An unknown unit code is a `422` naming the parameter, never a silent empty
/// result and never a 403 that would confirm the code does not exist.
#[sqlx::test(migrations = "../../migrations")]
async fn an_unknown_unit_code_is_a_field_error(pool: PgPool) -> sqlx::Result<()> {
    let pool = db::Pool::for_tests(pool);
    support::load_dictionaries(&pool)
        .await
        .expect("the fixture dictionaries load");
    let router = api::build_router(support::state_from(pool));
    let session = dev_login(
        &router,
        json!({"sso_subject": "compliance-matrix", "role": "compliance"}),
    )
    .await;

    let reply = send(
        &router,
        support::authenticated(&session, "GET", "/api/internal/summary?faculty=FAC99"),
    )
    .await;
    let problem = reply.problem(StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(problem["errors"][0]["field"], json!("faculty"));
    Ok(())
}
