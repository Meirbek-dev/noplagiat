//! `KAnonymityGuard` - defence in depth for TZ §6.2 (ARCHITECTURE.md §4.2).
//!
//! Primary suppression happens in `compliance` and is enforced by the type
//! system: a public DTO field is a [`compliance::Screened<T>`], and there is no
//! constructor outside `compliance` that turns a raw aggregate into one. This
//! layer exists for the one thing types cannot catch - a handler that builds a
//! DTO from *the wrong* observation count, or a new handler mounted under
//! `/api/public` that never went through screening at all.
//!
//! # What the guard checks
//!
//! Every public handler returns [`Guarded`], which attaches a [`KAnonWitness`]:
//! the active `k` plus, for every published metric, a JSON pointer to it and
//! the number of observations behind it.
//!
//! * **Release builds** verify the marker is present. A handler that forgot it
//!   returns `500`, never an unscreened body.
//! * **Debug and test builds** additionally walk the serialized response:
//!   1. every witnessed pointer must resolve - a witness that has drifted from
//!      the DTO proves nothing, so drift is a failure, not a pass;
//!   2. every pointer whose group holds fewer than `k` observations must
//!      resolve to the string `"insufficient_data"`. This is the check that
//!      catches "screened against the wrong n";
//!   3. no *unwitnessed* number may appear under a metric-shaped key. Keys are
//!      the vocabulary the public DTOs use for numbers derived from the fact
//!      table ([`METRIC_KEYS`]); a number under one of them that no witness
//!      covers means a handler published a metric it never screened.
//!
//! The reverse direction is deliberately not checked: a cell with `n >= k` may
//! legitimately be suppressed, because complementary suppression hides
//! large cells to protect small ones (`compliance::suppress_table`).

use axum::extract::Request;
use axum::http::{HeaderName, HeaderValue};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use serde::Serialize;
use serde_json::Value;

use crate::error::ApiError;
use crate::layers::{buffer_body, rebuild};

/// Marker header a handler may set instead of the extension. Stripped before
/// the response leaves the process - it is an internal assertion, not a
/// contract member.
pub const KANON_HEADER: HeaderName = HeaderName::from_static("x-kanon-checked");

/// Object keys whose numeric values must be backed by a witness. Anything the
/// public contour computes from `checks` is named from this vocabulary; a
/// number under any other key (an id, a year, a bucket edge, a count of
/// published report files) is not a fact-table aggregate.
pub const METRIC_KEYS: [&str; 12] = [
    "checks",
    "total_checks",
    "avg_originality",
    "below_threshold",
    "below_threshold_share",
    "escalated",
    "coverage",
    "share",
    "count",
    "value",
    "delta",
    "total",
];

/// Evidence that a response was screened, and against which group sizes.
#[derive(Debug, Clone, Default)]
pub struct KAnonWitness {
    k: u32,
    cells: Vec<(String, u64)>,
}

impl KAnonWitness {
    #[must_use]
    pub fn new(policy: compliance::KPolicy) -> Self {
        Self {
            k: policy.threshold().get(),
            cells: Vec::new(),
        }
    }

    /// Record one published metric: where it lands in the JSON body, and how
    /// many observations back it.
    pub fn field(&mut self, pointer: impl Into<String>, observations: u64) {
        self.cells.push((pointer.into(), observations));
    }

    /// Record every metric field of one published group at once.
    ///
    /// `base` is the JSON pointer of the object holding them, so
    /// `group("/months/3", n, &["checks", "avg_originality"])` witnesses
    /// `/months/3/checks` and `/months/3/avg_originality`.
    pub fn group(&mut self, base: &str, observations: u64, fields: &[&str]) {
        for field in fields {
            self.field(format!("{base}/{field}"), observations);
        }
    }

    #[must_use]
    pub fn k(&self) -> u32 {
        self.k
    }

    #[must_use]
    pub fn cells(&self) -> &[(String, u64)] {
        &self.cells
    }
}

/// A screened public response: the DTO plus its [`KAnonWitness`].
///
/// The only way a `/api/public` handler can produce a 2xx that survives the
/// guard.
#[derive(Debug)]
pub struct Guarded<T> {
    body: T,
    witness: KAnonWitness,
}

impl<T> Guarded<T> {
    #[must_use]
    pub fn new(body: T, witness: KAnonWitness) -> Self {
        Self { body, witness }
    }
}

impl<T: Serialize> IntoResponse for Guarded<T> {
    fn into_response(self) -> Response {
        let mut response = axum::Json(self.body).into_response();
        response.extensions_mut().insert(self.witness);
        response
            .headers_mut()
            .insert(KANON_HEADER, HeaderValue::from_static("1"));
        response
    }
}

/// Count the cells this response withheld, for
/// `suppression_screened_cells_total` (ARCHITECTURE.md §8).
///
/// A separate layer, mounted **inside** [`guard`], because the guard strips the
/// witness on its way out and because the guard itself must stay usable without
/// application state - its own tests mount it on a bare router.
///
/// Counted from the witness rather than from the body: that works in release
/// builds too, where the body is never buffered. It counts primary suppression
/// exactly; complementary suppression hides further cells this pass cannot see,
/// so the metric is a floor rather than a total.
pub async fn count_screened(
    axum::extract::State(state): axum::extract::State<crate::state::AppState>,
    request: Request,
    next: Next,
) -> Response {
    let response = next.run(request).await;
    if let Some(witness) = response.extensions().get::<KAnonWitness>() {
        let k = u64::from(witness.k());
        let withheld = witness
            .cells()
            .iter()
            .filter(|(_, observations)| *observations < k)
            .count();
        state
            .metrics
            .add_screened_cells(u64::try_from(withheld).unwrap_or_default());
    }
    response
}

/// The guard layer. Mounted on the JSON routes of `/api/public/*` only.
pub async fn guard(request: Request, next: Next) -> Response {
    let mut response = next.run(request).await;

    let witness = response.extensions_mut().remove::<KAnonWitness>();
    let marked = response.headers_mut().remove(KANON_HEADER).is_some();

    // Non-2xx responses (problems, 304) carry no aggregates.
    if !response.status().is_success() {
        return response;
    }

    if witness.is_none() && !marked {
        tracing::error!(
            "public handler produced a 2xx without passing k-anonymity screening \
             (AGENTS.md invariant #2) - response withheld"
        );
        return ApiError::Internal("public response was not k-anonymity screened").into_response();
    }

    if cfg!(debug_assertions) {
        let Some(witness) = witness else {
            tracing::error!(
                "public handler set the k-anonymity marker header without a witness; \
                 debug builds require the witness"
            );
            return ApiError::Internal("k-anonymity witness missing").into_response();
        };
        return verify(response, &witness).await;
    }

    response
}

/// Debug/test-build verification of the serialized body against the witness.
async fn verify(response: Response, witness: &KAnonWitness) -> Response {
    let Ok((parts, body)) = buffer_body(response).await else {
        return ApiError::Internal("public response could not be buffered").into_response();
    };
    let Ok(document) = serde_json::from_slice::<Value>(&body) else {
        tracing::error!("public response is not JSON; the k-anonymity guard cannot inspect it");
        return ApiError::Internal("public response is not inspectable JSON").into_response();
    };

    if let Err(violation) = inspect(&document, witness) {
        tracing::error!(
            violation,
            "k-anonymity guard tripped on a public response - response withheld"
        );
        return ApiError::Internal("k-anonymity guard tripped").into_response();
    }
    rebuild(parts, body)
}

/// The three checks of the module documentation. Separated from the HTTP layer
/// so the unit tests below exercise the real logic.
fn inspect(document: &Value, witness: &KAnonWitness) -> Result<(), String> {
    let k = u64::from(witness.k());

    for (pointer, observations) in witness.cells() {
        let Some(value) = document.pointer(pointer) else {
            return Err(format!(
                "witnessed pointer {pointer} does not exist in the response body"
            ));
        };
        if *observations < k && value != &Value::String(compliance::SUPPRESSED_MARKER.to_owned()) {
            return Err(format!(
                "{pointer} publishes a value for a group of {observations} observations (k = {k})"
            ));
        }
    }

    let witnessed: std::collections::HashSet<&str> = witness
        .cells()
        .iter()
        .map(|(pointer, _)| pointer.as_str())
        .collect();
    let mut unwitnessed = Vec::new();
    collect_unwitnessed(document, &mut String::new(), &witnessed, &mut unwitnessed);
    if let Some(pointer) = unwitnessed.first() {
        return Err(format!(
            "{pointer} publishes a metric-shaped number that no k-anonymity witness covers"
        ));
    }
    Ok(())
}

/// Walk the document, collecting pointers of numbers under a [`METRIC_KEYS`]
/// name that the witness does not cover.
fn collect_unwitnessed(
    value: &Value,
    pointer: &mut String,
    witnessed: &std::collections::HashSet<&str>,
    found: &mut Vec<String>,
) {
    match value {
        Value::Object(map) => {
            for (key, child) in map {
                let length = pointer.len();
                pointer.push('/');
                pointer.push_str(&escape_pointer_token(key));
                if child.is_number()
                    && METRIC_KEYS.contains(&key.as_str())
                    && !witnessed.contains(pointer.as_str())
                {
                    found.push(pointer.clone());
                }
                collect_unwitnessed(child, pointer, witnessed, found);
                pointer.truncate(length);
            }
        }
        Value::Array(items) => {
            for (index, child) in items.iter().enumerate() {
                let length = pointer.len();
                pointer.push('/');
                pointer.push_str(&index.to_string());
                collect_unwitnessed(child, pointer, witnessed, found);
                pointer.truncate(length);
            }
        }
        _ => {}
    }
}

/// RFC 6901 §3 escaping.
fn escape_pointer_token(token: &str) -> String {
    token.replace('~', "~0").replace('/', "~1")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn witness(k: u32, cells: &[(&str, u64)]) -> KAnonWitness {
        let mut witness = KAnonWitness {
            k,
            cells: Vec::new(),
        };
        for (pointer, observations) in cells {
            witness.field(*pointer, *observations);
        }
        witness
    }

    #[test]
    fn a_screened_document_passes() {
        let document = serde_json::json!({
            "total_checks": 60_000,
            "faculties": [
                {"code": "FAC01", "checks": 2983, "avg_originality": 76.4},
                {"code": "FAC08", "checks": "insufficient_data",
                 "avg_originality": "insufficient_data"},
            ],
        });
        let witness = witness(
            5,
            &[
                ("/total_checks", 60_000),
                ("/faculties/0/checks", 2983),
                ("/faculties/0/avg_originality", 2983),
                ("/faculties/1/checks", 3),
                ("/faculties/1/avg_originality", 3),
            ],
        );
        assert_eq!(inspect(&document, &witness), Ok(()));
    }

    #[test]
    fn a_small_group_published_as_a_number_is_rejected() {
        let document = serde_json::json!({"checks": 3});
        let violation = inspect(&document, &witness(5, &[("/checks", 3)]))
            .expect_err("a group of 3 under k = 5 must not publish a number");
        assert!(violation.contains("/checks"), "{violation}");
    }

    #[test]
    fn a_metric_no_witness_covers_is_rejected() {
        let document = serde_json::json!({"checks": 12, "escalated": 7});
        let violation = inspect(&document, &witness(5, &[("/checks", 12)]))
            .expect_err("the unwitnessed `escalated` must be caught");
        assert!(violation.contains("/escalated"), "{violation}");
    }

    #[test]
    fn a_witness_that_has_drifted_from_the_dto_is_rejected() {
        let document = serde_json::json!({"checks": 12});
        let violation = inspect(&document, &witness(5, &[("/checks", 12), ("/renamed", 12)]))
            .expect_err("a stale witness pointer must be caught");
        assert!(violation.contains("/renamed"), "{violation}");
    }

    #[test]
    fn suppressing_a_large_group_is_allowed() {
        // Complementary suppression hides cells with n >= k on purpose.
        let document = serde_json::json!({"checks": "insufficient_data"});
        assert_eq!(inspect(&document, &witness(5, &[("/checks", 900)])), Ok(()));
    }

    #[test]
    fn non_metric_numbers_need_no_witness() {
        let document = serde_json::json!({
            "academic_year": 2025,
            "k": 5,
            "items": [{"id": 7, "checks": 90}],
        });
        assert_eq!(
            inspect(&document, &witness(5, &[("/items/0/checks", 90)])),
            Ok(())
        );
    }
}
