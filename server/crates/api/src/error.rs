//! RFC 7807 `application/problem+json` responses.
//!
//! Every non-2xx this crate produces - handler errors, extractor rejections,
//! layer rejections, and the router fallbacks - is one [`Problem`] document
//! with `type`, `title`, `status`, `detail` and `instance`. `instance` is
//! filled in centrally by [`crate::layers::problem::fill_instance`], so no call
//! site has to know the request path.
//!
//! No `unwrap`/`expect` on request paths (clippy-denied in this crate).

use axum::Json;
use axum::http::{HeaderValue, StatusCode, header};
use axum::response::{IntoResponse, Response};
use serde::{Deserialize, Serialize};

/// Media type of every error body this crate emits.
pub const PROBLEM_CONTENT_TYPE: &str = "application/problem+json";

/// Base of the `type` URIs. Relative, so the document resolves against the
/// deployed origin without baking a hostname into the contract.
const PROBLEM_TYPE_BASE: &str = "/problems/";

/// One RFC 7807 problem document.
#[derive(Debug, Clone, Serialize, Deserialize, utoipa::ToSchema)]
pub struct Problem {
    /// Stable problem-type identifier, e.g. `/problems/validation-failed`.
    #[serde(rename = "type")]
    pub kind: String,
    /// Short, human-readable summary - the same for every occurrence of a type.
    pub title: String,
    pub status: u16,
    /// Explanation specific to this occurrence.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,
    /// Request path this problem occurred on.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub instance: Option<String>,
    /// Per-field detail for 422 responses.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub errors: Vec<FieldError>,
}

/// One rejected query parameter or body field.
#[derive(Debug, Clone, Serialize, Deserialize, utoipa::ToSchema)]
pub struct FieldError {
    /// Parameter name, or a `garde` path such as `to` or `items[0].code`.
    pub field: String,
    pub message: String,
}

impl Problem {
    fn new(kind: &str, title: &str, status: StatusCode) -> Self {
        Self {
            kind: format!("{PROBLEM_TYPE_BASE}{kind}"),
            title: title.to_owned(),
            status: status.as_u16(),
            detail: None,
            instance: None,
            errors: Vec::new(),
        }
    }
}

/// Every error the HTTP edge can produce.
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("resource not found")]
    NotFound,
    #[error("method not allowed")]
    MethodNotAllowed,
    /// No session, or a session that is unknown or expired.
    #[error("authentication required")]
    Unauthorized(&'static str),
    /// Authenticated, but the roles held do not reach this resource.
    #[error("forbidden")]
    Forbidden(&'static str),
    /// Authenticated and holding a role that reaches this resource, but the
    /// request named a **unit** outside the caller's scope.
    ///
    /// Its own `type` URI rather than a shade of [`Self::Forbidden`], because
    /// the two ask the client for opposite things: a role denial is final and
    /// the section should not be offered, while an out-of-scope filter is a
    /// filter the user can clear and retry (ADR-014 §7).
    #[error("unit outside the caller's scope")]
    OutOfScope(&'static str),
    /// Malformed filters (TZ §4.3 - never silently ignored).
    #[error("request validation failed")]
    Validation {
        detail: String,
        errors: Vec<FieldError>,
    },
    #[error("too many requests")]
    TooManyRequests { retry_after_seconds: u64 },
    /// A capability that is contracted but not yet implemented.
    #[error("service unavailable")]
    NotImplementedYet(&'static str),
    /// A resource exists but the request would break an invariant of it - a
    /// dictionary row still referenced by facts, a duplicate code.
    #[error("conflict")]
    Conflict(String),
    /// A dependency this server calls out to failed: the identity provider, and
    /// nothing else today. Distinguished from [`Self::Internal`] so an operator
    /// can tell "our bug" from "their outage" without reading logs.
    #[error("upstream failure")]
    Upstream(&'static str),
    #[error("database error")]
    Db(#[from] db::DbError),
    #[error("internal error")]
    Internal(&'static str),
}

impl ApiError {
    /// A 422 carrying exactly one field.
    pub fn field(field: impl Into<String>, message: impl Into<String>) -> Self {
        let field = FieldError {
            field: field.into(),
            message: message.into(),
        };
        Self::Validation {
            detail: format!("`{}` is invalid: {}", field.field, field.message),
            errors: vec![field],
        }
    }

    #[must_use]
    pub fn status(&self) -> StatusCode {
        match self {
            Self::NotFound => StatusCode::NOT_FOUND,
            Self::MethodNotAllowed => StatusCode::METHOD_NOT_ALLOWED,
            Self::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            Self::Forbidden(_) | Self::OutOfScope(_) => StatusCode::FORBIDDEN,
            Self::Validation { .. } => StatusCode::UNPROCESSABLE_ENTITY,
            Self::TooManyRequests { .. } => StatusCode::TOO_MANY_REQUESTS,
            Self::NotImplementedYet(_) => StatusCode::SERVICE_UNAVAILABLE,
            Self::Conflict(_) => StatusCode::CONFLICT,
            Self::Upstream(_) => StatusCode::BAD_GATEWAY,
            Self::Db(_) | Self::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn problem(&self) -> Problem {
        let status = self.status();
        match self {
            Self::NotFound => Problem::new("not-found", "Resource not found", status),
            Self::MethodNotAllowed => {
                Problem::new("method-not-allowed", "Method not allowed", status)
            }
            Self::Unauthorized(detail) => Problem {
                detail: Some((*detail).to_owned()),
                ..Problem::new("unauthorized", "Authentication required", status)
            },
            Self::Forbidden(detail) => Problem {
                detail: Some((*detail).to_owned()),
                ..Problem::new("forbidden", "Access denied", status)
            },
            Self::OutOfScope(detail) => Problem {
                detail: Some((*detail).to_owned()),
                ..Problem::new(
                    "out-of-scope",
                    "Unit outside your area of visibility",
                    status,
                )
            },
            Self::Validation { detail, errors } => Problem {
                detail: Some(detail.clone()),
                errors: errors.clone(),
                ..Problem::new("validation-failed", "Request validation failed", status)
            },
            Self::TooManyRequests { .. } => Problem {
                detail: Some("public API rate limit exceeded".to_owned()),
                ..Problem::new("rate-limited", "Too many requests", status)
            },
            Self::NotImplementedYet(detail) => Problem {
                detail: Some((*detail).to_owned()),
                ..Problem::new("not-implemented", "Not implemented yet", status)
            },
            Self::Conflict(detail) => Problem {
                detail: Some(detail.clone()),
                ..Problem::new("conflict", "Conflicting request", status)
            },
            Self::Upstream(detail) => Problem {
                detail: Some((*detail).to_owned()),
                ..Problem::new("upstream-failure", "Upstream failure", status)
            },
            // 5xx bodies never leak internals; the cause lives in tracing only.
            Self::Db(_) | Self::Internal(_) => {
                Problem::new("internal", "Internal server error", status)
            }
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        match &self {
            Self::Db(error) => tracing::error!(%error, "database error on request path"),
            Self::Internal(context) => tracing::error!(context, "internal error on request path"),
            Self::Upstream(context) => tracing::error!(context, "upstream dependency failed"),
            _ => {}
        }

        let status = self.status();
        let retry_after = match &self {
            Self::TooManyRequests {
                retry_after_seconds,
            } => Some(*retry_after_seconds),
            _ => None,
        };

        let mut response = (status, Json(self.problem())).into_response();
        set_problem_content_type(&mut response);
        if let Some(seconds) = retry_after
            && let Ok(value) = HeaderValue::try_from(seconds.to_string())
        {
            response.headers_mut().insert(header::RETRY_AFTER, value);
        }
        response
    }
}

/// Overwrite `application/json` with `application/problem+json` (RFC 7807 §3).
pub(crate) fn set_problem_content_type(response: &mut Response) {
    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static(PROBLEM_CONTENT_TYPE),
    );
}

/// Router fallback for an unmatched path.
pub async fn not_found() -> ApiError {
    ApiError::NotFound
}

/// Router fallback for a matched path with an unsupported method.
pub async fn method_not_allowed() -> ApiError {
    ApiError::MethodNotAllowed
}

#[cfg(test)]
mod tests {
    use super::{ApiError, StatusCode};

    /// The two 403s are the same status and deliberately **not** the same
    /// problem type: a client can offer «сбросить фильтр» for one and must not
    /// for the other (ADR-014 §7).
    #[test]
    fn a_role_denial_and_an_out_of_scope_unit_are_different_problem_types() {
        let role = ApiError::Forbidden("nope").problem();
        let unit =
            ApiError::OutOfScope("the requested unit is outside your area of visibility").problem();

        assert_eq!(role.status, StatusCode::FORBIDDEN.as_u16());
        assert_eq!(unit.status, StatusCode::FORBIDDEN.as_u16());
        assert_eq!(role.kind, "/problems/forbidden");
        assert_eq!(unit.kind, "/problems/out-of-scope");
        assert_ne!(role.title, unit.title);
        assert_eq!(
            unit.detail.as_deref(),
            Some("the requested unit is outside your area of visibility")
        );
    }

    /// Every problem type is a relative URI under the same base, so the contract
    /// carries no hostname (ADR-012 §8).
    #[test]
    fn every_problem_type_is_relative() {
        for error in [
            ApiError::NotFound,
            ApiError::MethodNotAllowed,
            ApiError::Unauthorized("x"),
            ApiError::Forbidden("x"),
            ApiError::OutOfScope("x"),
            ApiError::TooManyRequests {
                retry_after_seconds: 1,
            },
            ApiError::NotImplementedYet("x"),
            ApiError::Conflict("x".to_owned()),
            ApiError::Upstream("x"),
            ApiError::Internal("x"),
        ] {
            let problem = error.problem();
            assert!(problem.kind.starts_with("/problems/"), "{}", problem.kind);
            assert!(!problem.title.is_empty(), "{}", problem.kind);
        }
    }
}
