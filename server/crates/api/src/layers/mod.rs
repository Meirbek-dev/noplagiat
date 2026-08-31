//! Cross-cutting middleware (ARCHITECTURE.md §4.2).
//!
//! The topology assembled in [`crate::build_router`], outermost first:
//!
//! ```text
//! /healthz, /readyz  → (no layers)
//! /api/public/*      → trace → problem-instance → security headers
//!                      → rate limit → cache + ETag → KAnonymityGuard
//! /api/internal/*    → trace → problem-instance → security headers
//!                      → SessionAuth → RbacScope → CSRF → AuditLayer
//! /api/admin/*       → the internal stack + RequireRole(admin)
//! /api/auth/*        → trace → problem-instance → security headers (+ CSRF
//!                      on logout, which mutates session state)
//! ```

use axum::body::Bytes;
use axum::http::Response;
use axum::response::IntoResponse;

use crate::error::ApiError;

pub mod audit;
pub mod cache;
pub mod csrf;
pub mod kanon;
pub mod metrics;
pub mod problem;
pub mod rate_limit;
pub mod security;
pub mod session;

/// Upper bound on a response body this crate is willing to buffer in order to
/// hash it (ETag), re-serialize it (problem `instance`), or audit it
/// (`KAnonymityGuard`). Dashboard payloads are kilobytes; anything past this is
/// a bug, and buffering it would be a denial-of-service vector.
pub const MAX_BUFFERED_BODY: usize = 1024 * 1024;

/// Split a response into its parts and a fully buffered body.
///
/// A body that exceeds [`MAX_BUFFERED_BODY`] (or fails mid-stream) is reported
/// as an internal error rather than passed through unchecked: the layers that
/// call this are compliance controls, and "too big to check" must not mean
/// "sent without checking".
pub(crate) async fn buffer_body(
    response: axum::response::Response,
) -> Result<(axum::http::response::Parts, Bytes), ApiError> {
    let (parts, body) = response.into_parts();
    match axum::body::to_bytes(body, MAX_BUFFERED_BODY).await {
        Ok(bytes) => Ok((parts, bytes)),
        Err(error) => {
            tracing::error!(%error, "response body could not be buffered for inspection");
            Err(ApiError::Internal("response body could not be buffered"))
        }
    }
}

/// Rebuild a response from buffered parts, keeping `content-length` truthful.
pub(crate) fn rebuild(
    mut parts: axum::http::response::Parts,
    body: Bytes,
) -> axum::response::Response {
    let length = body.len();
    parts.headers.remove(axum::http::header::CONTENT_LENGTH);
    if let Ok(value) = axum::http::HeaderValue::try_from(length.to_string()) {
        parts
            .headers
            .insert(axum::http::header::CONTENT_LENGTH, value);
    }
    Response::from_parts(parts, axum::body::Body::from(body)).into_response()
}
