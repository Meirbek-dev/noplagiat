//! `AuditLayer` - one `audit_log` row per successful internal or admin request
//! (TZ §6.3, AGENTS.md invariant #4).
//!
//! The row is written **before** the response is returned, not from a spawned
//! task. ARCHITECTURE.md §4.2 sketched a spawn; the write is a single indexed
//! insert on a connection the request already holds, and doing it inline buys
//! two things a spawn cannot:
//!
//! * the acceptance evidence for TZ §10.6 is a test that reads the row straight
//!   after the response, with no polling and no flake;
//! * a failed audit write is observable. The response still goes out - refusing
//!   to serve because logging failed would be the wrong trade for a dashboard -
//!   but it is logged at `error` and will drive the `audit write failures`
//!   metric of slice W4.5.

use std::collections::BTreeMap;

use axum::extract::{FromRequestParts, MatchedPath, RawPathParams, Request, State};
use axum::middleware::Next;
use axum::response::Response;

use crate::auth::CurrentUser;
use crate::layers::rate_limit::client_address;
use crate::state::AppState;

/// The `audit_log.action` taxonomy (ARCHITECTURE.md §3.2, TZ §6.3).
///
/// A safe method is a `view`; a mutating one is an `admin_change` unless the
/// handler says otherwise through an [`AuditNote`]. Exports are the one case
/// that does - a `POST /export` changes nothing, and journalling it as a change
/// would misreport the very thing TZ §4.4 asks to be journalled.
pub const ACTION_VIEW: &str = "view";
pub const ACTION_ADMIN_CHANGE: &str = "admin_change";
pub const ACTION_EXPORT_PDF: &str = "export_pdf";
pub const ACTION_EXPORT_XLSX: &str = "export_xlsx";

/// Every action this system writes. The admin browser's filter vocabulary and
/// the guard test that stops a fifth one appearing unannounced.
pub const ACTIONS: [&str; 4] = [
    ACTION_VIEW,
    ACTION_EXPORT_PDF,
    ACTION_EXPORT_XLSX,
    ACTION_ADMIN_CHANGE,
];

/// **Retention: at least one year** (TZ §6.3, AGENTS.md invariant #4).
///
/// There is deliberately **no deletion job anywhere in this codebase** - not a
/// cron, not a migration, not a `DELETE` statement. `db::audit` exposes one
/// write, `append`, and migration 0001 installs a trigger that raises on UPDATE
/// and DELETE, so the retention floor is enforced by the schema rather than by
/// a policy document. Adding a rotation job later means removing that trigger,
/// which is a change no lane may make on its own (AGENTS.md §7).
pub const RETENTION_FLOOR_DAYS: u32 = 365;

/// A handler's amendment to the row the layer is about to write.
///
/// Attached to the **response** extensions, so a handler that knows more than
/// the request does - which export format was produced, which admin entity was
/// touched - can say so without the layer inspecting the body.
#[derive(Debug, Clone, Default)]
pub struct AuditNote {
    /// Overrides the method-derived action.
    pub action: Option<&'static str>,
    /// Merged into `audit_log.filters` under `change`.
    ///
    /// **Never a secret and never PII**: what changed, by key and entity code,
    /// not the values written. `PUT /api/admin/settings` records which keys
    /// were rewritten, not what they now hold; `POST /api/admin/staff-units`
    /// records the masked label, never the e-mail it was derived from.
    pub change: Option<serde_json::Value>,
    /// Replaces the query-derived filter state.
    ///
    /// TZ §6.3 journals «с какими фильтрами», and the export endpoints take
    /// their filters in the **body** - the query string carries only the format
    /// (ADR-014 §5). Without this, an export would be journalled as though it
    /// had been unfiltered, which is exactly the fact the log exists to record.
    pub filters: Option<serde_json::Value>,
}

impl AuditNote {
    #[must_use]
    pub fn action(action: &'static str) -> Self {
        Self {
            action: Some(action),
            change: None,
            filters: None,
        }
    }

    /// An `admin_change` with a summary of what it touched.
    #[must_use]
    pub fn change(summary: serde_json::Value) -> Self {
        Self {
            action: Some(ACTION_ADMIN_CHANGE),
            change: Some(summary),
            filters: None,
        }
    }

    /// Record the filter state the handler actually resolved.
    #[must_use]
    pub fn with_filters(mut self, filters: &domain::Filters) -> Self {
        // `Filters` serializes to the normalized shape this column stores.
        self.filters = serde_json::to_value(filters).ok();
        self
    }
}

pub async fn record(State(state): State<AppState>, request: Request, next: Next) -> Response {
    // `RawPathParams` reads an extension `axum` keeps private, so the values
    // have to be *extracted* rather than looked up; the parts go straight back
    // together afterwards and the request is otherwise untouched.
    let (mut parts, body) = request.into_parts();
    let path_parameters = resolved_path_parameters(&mut parts).await;
    let request = Request::from_parts(parts, body);

    let user = request.extensions().get::<CurrentUser>().cloned();
    let section = section_of(&request);
    let mut filters = normalized_filters(request.uri().query());
    let default_action = if request.method().is_safe() {
        ACTION_VIEW
    } else {
        ACTION_ADMIN_CHANGE
    };
    let ip = client_address(&request);

    let response = next.run(request).await;
    if !response.status().is_success() {
        return response;
    }

    let note = response.extensions().get::<AuditNote>().cloned();
    let action = note
        .as_ref()
        .and_then(|note| note.action)
        .unwrap_or(default_action);
    if let Some(note) = note {
        if let Some(resolved) = note.filters {
            filters = resolved;
        }
        if let Some(change) = note.change
            && let serde_json::Value::Object(map) = &mut filters
        {
            map.insert("change".to_owned(), change);
        }
    }

    let Some(user) = user else {
        tracing::error!(
            section,
            "internal response succeeded without an authenticated user - not audited"
        );
        return response;
    };
    // A user with no role cannot reach a 2xx on these routes
    // (`require_internal_access`), so this is unreachable in practice; the
    // fallback keeps the row honest rather than inventing a role.
    let Some(role) = user.effective_role else {
        tracing::error!(
            section,
            user_id = user.user_id,
            "role-less user reached a 2xx on the internal contour - not audited"
        );
        return response;
    };

    merge_path_parameters(&mut filters, &path_parameters);

    let ip = ip.to_string();
    let entry = db::audit::NewAuditEntry {
        user_id: user.user_id,
        role,
        action,
        section: &section,
        filters: &filters,
        ip: Some(&ip),
    };
    if let Err(error) = db::audit::append(&state.db, &entry).await {
        tracing::error!(%error, section, user_id = user.user_id, "audit write failed");
        state.metrics.record_audit_write_failure();
    }
    response
}

/// The route parameters `axum` resolved for this request, percent-decoded.
///
/// Missing for a request on its way to the 404/405 fallback, and empty for a
/// route with no placeholders; both are "nothing to record".
async fn resolved_path_parameters(
    parts: &mut axum::http::request::Parts,
) -> BTreeMap<String, String> {
    RawPathParams::from_request_parts(parts, &())
        .await
        .map(|params| {
            params
                .iter()
                .map(|(key, value)| (key.to_owned(), value.to_owned()))
                .collect()
        })
        .unwrap_or_default()
}

/// Merge the resolved route parameters into `audit_log.filters`.
///
/// [`section_of`] keeps the **template** (`dictionaries/{kind}`) so the section
/// vocabulary stays a bounded set an administrator can filter on. That leaves
/// the placeholder unresolved, and TZ §6.3 journals «с какими фильтрами» -
/// which dictionary, which report - so the value the placeholder stood for is
/// recorded here instead, beside the query-string keys.
///
/// Route parameters are structural, so they win over a same-named filter key;
/// no route in this crate has a placeholder that collides with a filter name.
fn merge_path_parameters(filters: &mut serde_json::Value, parameters: &BTreeMap<String, String>) {
    if parameters.is_empty() {
        return;
    }
    let serde_json::Value::Object(map) = filters else {
        return;
    };
    for (key, value) in parameters {
        map.insert(key.clone(), serde_json::Value::String(value.clone()));
    }
}

/// The dashboard section this request read: the matched route path with its
/// contour prefix removed, so `/api/internal/ping` audits as `ping` and
/// `/api/admin/settings` as `settings`.
fn section_of(request: &Request) -> String {
    let path = request.extensions().get::<MatchedPath>().map_or_else(
        || request.uri().path().to_owned(),
        |m| m.as_str().to_owned(),
    );
    for prefix in ["/api/internal/", "/api/admin/"] {
        if let Some(rest) = path.strip_prefix(prefix) {
            return rest.to_owned();
        }
    }
    path
}

/// Normalized filter state for `audit_log.filters`: the query parameters as a
/// JSON object, percent-decoded, empty values dropped, keys sorted.
///
/// Sorting is what makes "the same view" audit identically no matter what order
/// the client serialized its filters in.
fn normalized_filters(query: Option<&str>) -> serde_json::Value {
    let mut parameters: BTreeMap<String, String> = BTreeMap::new();
    for pair in query.unwrap_or_default().split('&') {
        if pair.is_empty() {
            continue;
        }
        let (key, value) = pair.split_once('=').unwrap_or((pair, ""));
        let key = percent_decode(key);
        let value = percent_decode(value);
        if key.is_empty() || value.is_empty() {
            continue;
        }
        parameters.insert(key, value);
    }
    serde_json::Value::Object(
        parameters
            .into_iter()
            .map(|(key, value)| (key, serde_json::Value::String(value)))
            .collect(),
    )
}

/// `application/x-www-form-urlencoded` decoding. Small enough to own outright;
/// pulling in a percent-encoding dependency for one audit field would be the
/// wrong trade (AGENTS.md §5).
fn percent_decode(raw: &str) -> String {
    let bytes = raw.as_bytes();
    let mut decoded = Vec::with_capacity(bytes.len());
    let mut index = 0;
    while index < bytes.len() {
        match bytes[index] {
            b'+' => {
                decoded.push(b' ');
                index += 1;
            }
            b'%' if index + 2 < bytes.len() => {
                let digits = std::str::from_utf8(&bytes[index + 1..index + 3])
                    .ok()
                    .and_then(|text| u8::from_str_radix(text, 16).ok());
                match digits {
                    Some(byte) => {
                        decoded.push(byte);
                        index += 3;
                    }
                    None => {
                        decoded.push(b'%');
                        index += 1;
                    }
                }
            }
            other => {
                decoded.push(other);
                index += 1;
            }
        }
    }
    String::from_utf8_lossy(&decoded).into_owned()
}

#[cfg(test)]
mod tests {
    use std::collections::BTreeMap;

    use super::{merge_path_parameters, normalized_filters, percent_decode};

    fn parameters(pairs: &[(&str, &str)]) -> BTreeMap<String, String> {
        pairs
            .iter()
            .map(|(key, value)| ((*key).to_owned(), (*value).to_owned()))
            .collect()
    }

    /// The `{kind}` an admin dictionary request resolved lands beside the query
    /// keys, so the row says *which* dictionary was touched even though the
    /// section stays the bounded template.
    #[test]
    fn resolved_route_parameters_join_the_filter_object() {
        let mut filters = normalized_filters(Some("period=year"));
        merge_path_parameters(&mut filters, &parameters(&[("kind", "faculties")]));
        assert_eq!(
            filters,
            serde_json::json!({"period": "year", "kind": "faculties"})
        );
    }

    #[test]
    fn a_route_without_placeholders_changes_nothing() {
        let mut filters = normalized_filters(Some("period=year"));
        merge_path_parameters(&mut filters, &BTreeMap::new());
        assert_eq!(filters, serde_json::json!({"period": "year"}));
    }

    /// A handler's `AuditNote` may replace the filter object outright (exports
    /// carry theirs in the body); the route parameters still have to survive.
    #[test]
    fn route_parameters_are_merged_into_a_handler_supplied_object() {
        let mut filters = serde_json::json!({"change": {"code": "FAC90"}});
        merge_path_parameters(&mut filters, &parameters(&[("kind", "faculties")]));
        assert_eq!(
            filters,
            serde_json::json!({"change": {"code": "FAC90"}, "kind": "faculties"})
        );
    }

    /// A non-object `filters` is never produced by this crate, but merging into
    /// one must not panic or replace the handler's own value.
    #[test]
    fn a_non_object_filter_value_is_left_alone() {
        let mut filters = serde_json::json!("unstructured");
        merge_path_parameters(&mut filters, &parameters(&[("kind", "faculties")]));
        assert_eq!(filters, serde_json::json!("unstructured"));
    }

    #[test]
    fn filters_are_sorted_decoded_and_stripped_of_empties() {
        assert_eq!(
            normalized_filters(Some("work_type=thesis_master&period=year&faculty=&to=")),
            serde_json::json!({"period": "year", "work_type": "thesis_master"})
        );
        assert_eq!(normalized_filters(None), serde_json::json!({}));
        assert_eq!(normalized_filters(Some("")), serde_json::json!({}));
    }

    #[test]
    fn the_same_view_audits_identically_whatever_the_parameter_order() {
        assert_eq!(
            normalized_filters(Some("a=1&b=2")),
            normalized_filters(Some("b=2&a=1"))
        );
    }

    #[test]
    fn percent_and_plus_escapes_are_decoded() {
        assert_eq!(percent_decode("a%2Fb"), "a/b");
        assert_eq!(percent_decode("one+two"), "one two");
        assert_eq!(percent_decode("100%"), "100%");
        assert_eq!(percent_decode("%zz"), "%zz");
        assert_eq!(percent_decode("%D0%9A"), "К");
    }
}
