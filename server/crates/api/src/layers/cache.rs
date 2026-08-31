//! `Cache-Control` and `ETag` for the public contour (ARCHITECTURE.md §7 §2).
//!
//! The public page is effectively static between ingest runs, so every public
//! response carries `Cache-Control: public, max-age=3600` and a strong ETag -
//! the SHA-256 of the rendered body. A conditional request whose
//! `If-None-Match` matches is answered `304 Not Modified` with the same
//! validators and no body.
//!
//! The ETag is computed **outside** the k-anonymity guard, so it is a digest of
//! exactly the bytes the client receives.

use axum::extract::Request;
use axum::http::{HeaderValue, StatusCode, header};
use axum::middleware::Next;
use axum::response::Response;
use sha2::{Digest, Sha256};

use crate::layers::{buffer_body, rebuild};

/// One hour (ARCHITECTURE.md §7): the public snapshot changes at most daily.
pub const PUBLIC_CACHE_CONTROL: &str = "public, max-age=3600";

pub async fn cache_and_etag(request: Request, next: Next) -> Response {
    let conditional = request
        .headers()
        .get(header::IF_NONE_MATCH)
        .and_then(|value| value.to_str().ok())
        .map(str::to_owned);

    let response = next.run(request).await;
    // Errors are not cacheable and carry no validator.
    if !response.status().is_success() {
        return response;
    }

    let Ok((mut parts, body)) = buffer_body(response).await else {
        return axum::response::IntoResponse::into_response(crate::error::ApiError::Internal(
            "public response could not be buffered",
        ));
    };

    let etag = format!("\"{}\"", hex::encode(Sha256::digest(&body)));
    if let Ok(value) = HeaderValue::try_from(etag.as_str()) {
        parts.headers.insert(header::ETAG, value);
    }
    parts.headers.insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static(PUBLIC_CACHE_CONTROL),
    );

    if conditional.is_some_and(|header| matches_etag(&header, &etag)) {
        parts.status = StatusCode::NOT_MODIFIED;
        // RFC 9110 §15.4.5: a 304 carries no content and no content headers.
        parts.headers.remove(header::CONTENT_TYPE);
        parts.headers.remove(header::CONTENT_LENGTH);
        return Response::from_parts(parts, axum::body::Body::empty());
    }

    rebuild(parts, body)
}

/// RFC 9110 §13.1.2: `*` matches anything; otherwise any list member equal to
/// the current tag under weak comparison matches.
fn matches_etag(header: &str, etag: &str) -> bool {
    let strip_weak = |tag: &str| tag.trim().trim_start_matches("W/").trim().to_owned();
    if header.trim() == "*" {
        return true;
    }
    let current = strip_weak(etag);
    header.split(',').any(|tag| strip_weak(tag) == current)
}

#[cfg(test)]
mod tests {
    use super::matches_etag;

    #[test]
    fn conditional_matching_follows_rfc_9110() {
        assert!(matches_etag("*", "\"abc\""));
        assert!(matches_etag("\"abc\"", "\"abc\""));
        assert!(matches_etag("W/\"abc\"", "\"abc\""));
        assert!(matches_etag("\"zzz\", \"abc\"", "\"abc\""));
        assert!(!matches_etag("\"zzz\"", "\"abc\""));
        assert!(!matches_etag("abc", "\"abc\""));
    }
}
