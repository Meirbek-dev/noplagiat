//! Security response headers (ARCHITECTURE.md §6).
//!
//! The two contours differ in exactly one respect - whether the response may be
//! framed:
//!
//! * **public** is embeddable, but only by the portal. TZ §8 requires the public
//!   widget to load in an iframe on `tou.edu.kz`, so slice **W2.5** replaced the
//!   original `frame-ancestors *` with a configured origin list
//!   ([`DEFAULT_FRAME_ANCESTORS`], overridable with `APP_EMBED_FRAME_ANCESTORS`).
//!   The `/embed` SSR route carries the same policy from the gateway.
//! * **internal/admin/auth** must never be framed: clickjacking against an
//!   authenticated dashboard is the attack `frame-ancestors 'none'` closes.
//!
//! Everything else is identical, and deliberately minimal: these are JSON API
//! responses, so a script/style policy would be inert. The SSR origin sets its
//! own document CSP.

use axum::http::{HeaderName, HeaderValue, header};
use tower_http::set_header::SetResponseHeaderLayer;

/// The `frame-ancestors` list the public contour publishes when
/// `APP_EMBED_FRAME_ANCESTORS` is unset, malformed, or empty.
///
/// `'self'` keeps the dashboard's own `/embed` route working; the two portal
/// hosts are the origins TZ §8 names. Anything wider is an operator decision,
/// taken in the environment and visible in the deployment, never a default.
pub const DEFAULT_FRAME_ANCESTORS: &str = "'self' https://tou.edu.kz https://www.tou.edu.kz";

/// [`DEFAULT_FRAME_ANCESTORS`] already spelled as a whole header value, so the
/// fallback path needs no allocation and no `unwrap` (clippy-denied here).
/// `default_csp_matches_the_default_origin_list` keeps the two in step.
const DEFAULT_PUBLIC_CSP: &str =
    "default-src 'none'; frame-ancestors 'self' https://tou.edu.kz https://www.tou.edu.kz";

/// `Content-Security-Policy` for authenticated contours - never framed.
const PRIVATE_CSP: &str = "default-src 'none'; frame-ancestors 'none'";

/// The public `Content-Security-Policy` for one configured origin list.
///
/// Total by construction: a value that is empty, carries a `;` (which would
/// smuggle a second directive into the policy), or is not a legal header value
/// falls back to [`DEFAULT_FRAME_ANCESTORS`] with a warning rather than
/// panicking or publishing a policy nobody chose.
fn public_csp(frame_ancestors: &str) -> HeaderValue {
    let configured = frame_ancestors.trim();
    if configured.is_empty() {
        return HeaderValue::from_static(DEFAULT_PUBLIC_CSP);
    }
    if configured.contains(';') {
        tracing::warn!(
            configured,
            "APP_EMBED_FRAME_ANCESTORS may name origins only, not further CSP directives; \
             falling back to the portal origins"
        );
        return HeaderValue::from_static(DEFAULT_PUBLIC_CSP);
    }
    match HeaderValue::try_from(format!("default-src 'none'; frame-ancestors {configured}")) {
        Ok(value) => value,
        Err(error) => {
            tracing::warn!(
                %error,
                configured,
                "APP_EMBED_FRAME_ANCESTORS is not a valid header value; \
                 falling back to the portal origins"
            );
            HeaderValue::from_static(DEFAULT_PUBLIC_CSP)
        }
    }
}

/// Headers every response carries, regardless of contour.
fn common() -> [(HeaderName, HeaderValue); 2] {
    [
        (
            header::X_CONTENT_TYPE_OPTIONS,
            HeaderValue::from_static("nosniff"),
        ),
        (
            header::REFERRER_POLICY,
            HeaderValue::from_static("no-referrer"),
        ),
    ]
}

/// Turn a header list into an ordered stack of `SetResponseHeader` layers.
///
/// `tower_http::set_header` handles one header per layer; collecting them into
/// a `ServiceBuilder` here keeps the router readable.
macro_rules! header_stack {
    ($router:expr, $headers:expr) => {{
        let mut router = $router;
        for (name, value) in $headers {
            router = router.layer(SetResponseHeaderLayer::overriding(name, value));
        }
        router
    }};
}

/// Apply the public-contour headers to a router.
///
/// `frame_ancestors` is `AppConfig::embed_frame_ancestors`, so the pinned origin
/// list is a deployment decision rather than a recompile.
pub fn public<S: Clone + Send + Sync + 'static>(
    router: axum::Router<S>,
    frame_ancestors: &str,
) -> axum::Router<S> {
    let headers = common().into_iter().chain(std::iter::once((
        header::CONTENT_SECURITY_POLICY,
        public_csp(frame_ancestors),
    )));
    header_stack!(router, headers)
}

/// Apply the authenticated-contour headers to a router.
pub fn private<S: Clone + Send + Sync + 'static>(router: axum::Router<S>) -> axum::Router<S> {
    let headers = common().into_iter().chain([
        (
            header::CONTENT_SECURITY_POLICY,
            HeaderValue::from_static(PRIVATE_CSP),
        ),
        (header::X_FRAME_OPTIONS, HeaderValue::from_static("DENY")),
        (header::CACHE_CONTROL, HeaderValue::from_static("no-store")),
    ]);
    header_stack!(router, headers)
}

#[cfg(test)]
mod tests {
    use super::{DEFAULT_FRAME_ANCESTORS, DEFAULT_PUBLIC_CSP, public_csp};

    #[test]
    fn default_csp_matches_the_default_origin_list() {
        assert_eq!(
            DEFAULT_PUBLIC_CSP,
            format!("default-src 'none'; frame-ancestors {DEFAULT_FRAME_ANCESTORS}")
        );
    }

    #[test]
    fn a_configured_origin_list_is_published_verbatim() {
        assert_eq!(
            public_csp("https://portal.example.edu"),
            "default-src 'none'; frame-ancestors https://portal.example.edu"
        );
    }

    /// Every rejected value lands on the documented default rather than on a
    /// policy the operator did not write - or a panic.
    #[test]
    fn an_unusable_value_falls_back_to_the_portal_origins() {
        for value in [
            "",
            "   ",
            // A smuggled second directive.
            "'self'; script-src 'unsafe-inline'",
            // Illegal header bytes.
            "https://a.example\nX-Injected: 1",
            "https://a.example\u{7f}",
        ] {
            assert_eq!(public_csp(value), DEFAULT_PUBLIC_CSP, "{value:?}");
        }
    }
}
