//! Double-submit CSRF protection on mutating requests (ARCHITECTURE.md §6).
//!
//! `SameSite=Lax` already blocks cross-site POSTs in every browser that honours
//! it; this is the second lock. The token lives in the `sessions` row and is
//! handed to the client once, in the login response body, so a cross-site page
//! can neither read it (it is not in a cookie) nor guess it (32 CSPRNG bytes).
//!
//! Safe methods pass untouched. `POST /api/auth/dev-login` is not behind this
//! layer at all: it is the request that *creates* the session, so there is no
//! token to present yet.

use axum::extract::Request;
use axum::http::Method;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

use crate::auth::{CSRF_HEADER, CurrentUser};
use crate::error::ApiError;

/// Methods that may change state, and therefore need the token.
fn is_mutating(method: &Method) -> bool {
    !matches!(*method, Method::GET | Method::HEAD | Method::OPTIONS)
}

pub async fn protect(request: Request, next: Next) -> Response {
    if !is_mutating(request.method()) {
        return next.run(request).await;
    }

    let Some(user) = request.extensions().get::<CurrentUser>() else {
        return ApiError::Unauthorized("a valid portal session is required").into_response();
    };
    let presented = request
        .headers()
        .get(CSRF_HEADER)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| hex::decode(value.trim()).ok());

    match presented {
        Some(token) if constant_time_eq(&token, &user.csrf_token) => next.run(request).await,
        _ => {
            tracing::warn!(
                user_id = user.user_id,
                "mutating request rejected: missing or mismatched CSRF token"
            );
            ApiError::Forbidden("a valid x-csrf-token header is required for this request")
                .into_response()
        }
    }
}

/// Compare in time independent of where the first difference is, so a mismatch
/// leaks no prefix information.
fn constant_time_eq(left: &[u8], right: &[u8]) -> bool {
    if left.len() != right.len() {
        return false;
    }
    left.iter()
        .zip(right)
        .fold(0_u8, |difference, (a, b)| difference | (a ^ b))
        == 0
}

#[cfg(test)]
mod tests {
    use super::{constant_time_eq, is_mutating};
    use axum::http::Method;

    #[test]
    fn only_state_changing_methods_are_guarded() {
        assert!(!is_mutating(&Method::GET));
        assert!(!is_mutating(&Method::HEAD));
        assert!(!is_mutating(&Method::OPTIONS));
        assert!(is_mutating(&Method::POST));
        assert!(is_mutating(&Method::PUT));
        assert!(is_mutating(&Method::PATCH));
        assert!(is_mutating(&Method::DELETE));
    }

    #[test]
    fn token_comparison_is_exact() {
        assert!(constant_time_eq(b"abcd", b"abcd"));
        assert!(!constant_time_eq(b"abcd", b"abce"));
        assert!(!constant_time_eq(b"abcd", b"abc"));
        assert!(constant_time_eq(b"", b""));
    }
}
