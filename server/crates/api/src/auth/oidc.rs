//! OIDC authorization-code flow with PKCE against the portal IdP (PLAN.md D7,
//! ADR-014).
//!
//! The university portal fronts Active Directory with an OpenID Provider, so
//! the dashboard speaks OIDC rather than LDAP: one redirect, one code exchange,
//! one signed ID token, and the AD group membership arrives as a claim.
//!
//! # What this module is responsible for
//!
//! 1. **Discovery** - `{issuer}/.well-known/openid-configuration`, cached for
//!    [`DISCOVERY_TTL`]. Endpoints are never hard-coded; a provider that moves
//!    its token endpoint keeps working across a cache expiry.
//! 2. **Starting the flow** - `state`, `nonce` and a PKCE `code_verifier`, all
//!    32 bytes from the OS CSPRNG, and the S256 challenge derived from the
//!    verifier.
//! 3. **Finishing it** - code exchange at the token endpoint, then ID-token
//!    validation: RS256 signature against the JWKS, `iss`, `aud`, `exp`/`nbf`
//!    and `nonce`. Every one of those is a separate test.
//!
//! # Where the flow state lives
//!
//! In a short-lived `HttpOnly; Secure; SameSite=Lax` cookie
//! ([`FLOW_COOKIE`]), not in process memory and not in a table. The three
//! values are unguessable random tokens, the browser is the only party that
//! ever holds them, and comparing the callback's `state` against the cookie's
//! is exactly the double-submit check the parameter exists for. It also means a
//! login survives a restart and a second server process - an in-memory map
//! would have needed sticky sessions, and a table would have needed a migration
//! this slice does not own (ADR-014 §2).

use std::sync::{Arc, Mutex, PoisonError};
use std::time::{Duration, Instant};

use base64::Engine as _;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use rand::TryRngCore;
use serde::Deserialize;
use sha2::{Digest, Sha256};

/// How long a discovery document is reused before it is re-fetched.
pub const DISCOVERY_TTL: Duration = Duration::from_secs(3600);
/// How long a JWKS is reused. Shorter than discovery: a signing-key rotation is
/// the thing a stale cache breaks, and an unknown `kid` forces a refresh anyway.
pub const JWKS_TTL: Duration = Duration::from_secs(600);
/// Clock skew tolerated on `exp`/`nbf`, in seconds.
pub const CLOCK_SKEW_SECONDS: u64 = 60;

/// Name of the cookie carrying the in-flight authorization request.
pub const FLOW_COOKIE: &str = "np_oidc";
/// Lifetime of that cookie. A user who cannot finish the IdP dialogue in ten
/// minutes starts the flow again rather than replaying a stale `state`.
pub const FLOW_TTL_SECONDS: i64 = 600;

/// Bytes of entropy behind `state`, `nonce` and the PKCE verifier.
const TOKEN_BYTES: usize = 32;

/// Everything the deployment has to be told about the provider.
#[derive(Debug, Clone)]
pub struct OidcConfig {
    /// `APP_OIDC_ISSUER` - the `iss` value, and the discovery base.
    pub issuer: String,
    /// `APP_OIDC_CLIENT_ID`.
    pub client_id: String,
    /// `APP_OIDC_CLIENT_SECRET`. Never logged, never in a response.
    pub client_secret: String,
    /// Absolute callback URL, built from `APP_PUBLIC_BASE_URL`.
    pub redirect_uri: String,
    /// `APP_OIDC_SCOPES`, space separated.
    pub scopes: String,
    /// `APP_OIDC_GROUPS_CLAIM` - the ID-token claim carrying AD groups.
    pub groups_claim: String,
    /// Where the provider should return the browser after RP-initiated logout.
    pub post_logout_redirect_uri: Option<String>,
}

/// Scopes requested when `APP_OIDC_SCOPES` is unset. `groups` is what the AD
/// bridge maps role membership into.
pub const DEFAULT_SCOPES: &str = "openid profile email groups";
/// Claim inspected when `APP_OIDC_GROUPS_CLAIM` is unset.
pub const DEFAULT_GROUPS_CLAIM: &str = "groups";

impl OidcConfig {
    /// The callback URL for a deployment served at `public_base_url`.
    #[must_use]
    pub fn redirect_uri_for(public_base_url: &str) -> String {
        format!(
            "{}/api/auth/callback",
            public_base_url.trim_end_matches('/')
        )
    }
}

#[derive(Debug, thiserror::Error)]
pub enum OidcError {
    #[error("the identity provider is not configured for this deployment")]
    NotConfigured,
    #[error("could not reach the identity provider: {0}")]
    Transport(String),
    #[error("the identity provider returned a malformed {document}")]
    Malformed { document: &'static str },
    #[error("the identity provider rejected the code exchange: {0}")]
    TokenExchange(String),
    #[error("the sign-in request could not be matched to this browser")]
    FlowState,
    #[error("the ID token is not acceptable: {0}")]
    IdToken(&'static str),
}

// ── discovery ───────────────────────────────────────────────────────────────

/// The subset of the discovery document this client uses.
#[derive(Debug, Clone, Deserialize)]
pub struct Discovery {
    pub issuer: String,
    pub authorization_endpoint: String,
    pub token_endpoint: String,
    pub jwks_uri: String,
    #[serde(default)]
    pub end_session_endpoint: Option<String>,
}

/// One RSA verification key from the provider's JWKS.
#[derive(Debug, Clone, Deserialize)]
struct Jwk {
    #[serde(default)]
    kid: Option<String>,
    #[serde(default)]
    kty: String,
    #[serde(default)]
    alg: Option<String>,
    /// base64url modulus.
    #[serde(default)]
    n: Option<String>,
    /// base64url exponent.
    #[serde(default)]
    e: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
struct Jwks {
    keys: Vec<Jwk>,
}

// ── flow state ──────────────────────────────────────────────────────────────

/// The three secrets of one in-flight authorization request.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FlowState {
    pub state: String,
    pub nonce: String,
    pub code_verifier: String,
}

impl FlowState {
    /// Three fresh CSPRNG tokens.
    pub fn generate() -> Result<Self, rand::rand_core::OsError> {
        Ok(Self {
            state: random_token()?,
            nonce: random_token()?,
            code_verifier: random_token()?,
        })
    }

    /// Cookie payload: three base64url tokens, dot separated. None of the three
    /// can contain a dot, so the split is unambiguous.
    #[must_use]
    pub fn to_cookie_value(&self) -> String {
        format!("{}.{}.{}", self.state, self.nonce, self.code_verifier)
    }

    /// Parse a cookie payload back. A malformed value is a failed flow, never a
    /// partially trusted one.
    #[must_use]
    pub fn from_cookie_value(value: &str) -> Option<Self> {
        let mut parts = value.split('.');
        let state = parts.next()?.to_owned();
        let nonce = parts.next()?.to_owned();
        let code_verifier = parts.next()?.to_owned();
        if parts.next().is_some()
            || state.is_empty()
            || nonce.is_empty()
            || code_verifier.is_empty()
        {
            return None;
        }
        Some(Self {
            state,
            nonce,
            code_verifier,
        })
    }

    /// RFC 7636 S256 challenge: `base64url(sha256(ascii(code_verifier)))`.
    #[must_use]
    pub fn code_challenge(&self) -> String {
        URL_SAFE_NO_PAD.encode(Sha256::digest(self.code_verifier.as_bytes()))
    }
}

fn random_token() -> Result<String, rand::rand_core::OsError> {
    let mut buffer = [0_u8; TOKEN_BYTES];
    rand::rngs::OsRng.try_fill_bytes(&mut buffer)?;
    Ok(URL_SAFE_NO_PAD.encode(buffer))
}

/// Compare two flow tokens without leaking where they first differ.
#[must_use]
pub fn tokens_match(left: &str, right: &str) -> bool {
    let (left, right) = (left.as_bytes(), right.as_bytes());
    if left.len() != right.len() {
        return false;
    }
    left.iter()
        .zip(right)
        .fold(0_u8, |difference, (a, b)| difference | (a ^ b))
        == 0
}

// ── claims ──────────────────────────────────────────────────────────────────

/// The ID-token claims this system consumes.
///
/// `sub` is the only identifier that reaches the warehouse as a key; `email`
/// and `name` fill the administrative `users` row (TZ §6.1 exempts service
/// accounts that are not surfaced in analytics) and are never logged.
#[derive(Debug, Clone, Deserialize)]
pub struct IdClaims {
    pub sub: String,
    #[serde(default)]
    pub email: Option<String>,
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub preferred_username: Option<String>,
    #[serde(default)]
    pub nonce: Option<String>,
    /// Every other claim, so the configurable group claim can be read without
    /// naming it at compile time.
    #[serde(flatten)]
    pub extra: std::collections::BTreeMap<String, serde_json::Value>,
}

impl IdClaims {
    /// Group memberships from the configured claim.
    ///
    /// Providers spell this either as an array of strings or as one
    /// space-separated string; both are accepted, anything else is no groups
    /// (which fails closed - the account lands on the request-access path).
    #[must_use]
    pub fn groups(&self, claim: &str) -> Vec<String> {
        match self.extra.get(claim) {
            Some(serde_json::Value::Array(items)) => items
                .iter()
                .filter_map(|item| item.as_str().map(str::to_owned))
                .collect(),
            Some(serde_json::Value::String(value)) => {
                value.split_whitespace().map(str::to_owned).collect()
            }
            _ => Vec::new(),
        }
    }

    /// A display name for the administrative `users` row, falling back to the
    /// opaque subject rather than inventing one.
    #[must_use]
    pub fn display_name(&self) -> &str {
        self.name
            .as_deref()
            .or(self.preferred_username.as_deref())
            .unwrap_or(&self.sub)
    }
}

// ── client ──────────────────────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
struct TokenResponse {
    id_token: String,
}

/// The provider client: HTTP, plus the two caches.
#[derive(Debug)]
pub struct OidcClient {
    config: OidcConfig,
    http: reqwest::Client,
    discovery: Mutex<Option<(Instant, Arc<Discovery>)>>,
    jwks: Mutex<Option<(Instant, Arc<Jwks>)>>,
}

impl OidcClient {
    pub fn new(config: OidcConfig) -> Result<Self, OidcError> {
        let http = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .build()
            .map_err(|error| OidcError::Transport(error.to_string()))?;
        Ok(Self {
            config,
            http,
            discovery: Mutex::new(None),
            jwks: Mutex::new(None),
        })
    }

    #[must_use]
    pub fn config(&self) -> &OidcConfig {
        &self.config
    }

    /// The discovery document, from cache or from the provider.
    pub async fn discovery(&self) -> Result<Arc<Discovery>, OidcError> {
        if let Some(cached) = read_cache(&self.discovery, DISCOVERY_TTL) {
            return Ok(cached);
        }
        let url = format!(
            "{}/.well-known/openid-configuration",
            self.config.issuer.trim_end_matches('/')
        );
        let document: Discovery = self
            .http
            .get(&url)
            .send()
            .await
            .map_err(|error| OidcError::Transport(error.to_string()))?
            .error_for_status()
            .map_err(|error| OidcError::Transport(error.to_string()))?
            .json()
            .await
            .map_err(|_| OidcError::Malformed {
                document: "discovery document",
            })?;

        // The document's own `issuer` is what the ID token must carry; a
        // provider that advertises a different one than we asked for is a
        // misconfiguration, not something to paper over.
        if document.issuer.trim_end_matches('/') != self.config.issuer.trim_end_matches('/') {
            return Err(OidcError::Malformed {
                document: "discovery document (issuer mismatch)",
            });
        }

        let document = Arc::new(document);
        write_cache(&self.discovery, Arc::clone(&document));
        Ok(document)
    }

    async fn jwks(&self, force_refresh: bool) -> Result<Arc<Jwks>, OidcError> {
        if !force_refresh && let Some(cached) = read_cache(&self.jwks, JWKS_TTL) {
            return Ok(cached);
        }
        let discovery = self.discovery().await?;
        let keys: Jwks = self
            .http
            .get(&discovery.jwks_uri)
            .send()
            .await
            .map_err(|error| OidcError::Transport(error.to_string()))?
            .error_for_status()
            .map_err(|error| OidcError::Transport(error.to_string()))?
            .json()
            .await
            .map_err(|_| OidcError::Malformed { document: "JWKS" })?;
        let keys = Arc::new(keys);
        write_cache(&self.jwks, Arc::clone(&keys));
        Ok(keys)
    }

    /// The URL the browser is redirected to, for a freshly generated flow.
    pub async fn authorization_url(&self, flow: &FlowState) -> Result<String, OidcError> {
        let discovery = self.discovery().await?;
        let separator = if discovery.authorization_endpoint.contains('?') {
            '&'
        } else {
            '?'
        };
        Ok(format!(
            "{}{separator}response_type=code&client_id={}&redirect_uri={}&scope={}&state={}&nonce={}&code_challenge={}&code_challenge_method=S256",
            discovery.authorization_endpoint,
            form_encode(&self.config.client_id),
            form_encode(&self.config.redirect_uri),
            form_encode(&self.config.scopes),
            form_encode(&flow.state),
            form_encode(&flow.nonce),
            form_encode(&flow.code_challenge()),
        ))
    }

    /// Exchange the authorization code and validate the ID token it carries.
    pub async fn exchange_and_verify(
        &self,
        code: &str,
        flow: &FlowState,
    ) -> Result<IdClaims, OidcError> {
        let discovery = self.discovery().await?;
        let response = self
            .http
            .post(&discovery.token_endpoint)
            .form(&[
                ("grant_type", "authorization_code"),
                ("code", code),
                ("redirect_uri", self.config.redirect_uri.as_str()),
                ("client_id", self.config.client_id.as_str()),
                ("client_secret", self.config.client_secret.as_str()),
                ("code_verifier", flow.code_verifier.as_str()),
            ])
            .send()
            .await
            .map_err(|error| OidcError::Transport(error.to_string()))?;

        if !response.status().is_success() {
            // The provider's error body may echo the code; only the status
            // reaches a log or a response.
            return Err(OidcError::TokenExchange(response.status().to_string()));
        }
        let tokens: TokenResponse = response.json().await.map_err(|_| OidcError::Malformed {
            document: "token response",
        })?;

        self.verify_id_token(&tokens.id_token, &flow.nonce, &discovery)
            .await
    }

    /// Validate signature, issuer, audience, expiry and nonce.
    async fn verify_id_token(
        &self,
        id_token: &str,
        nonce: &str,
        discovery: &Discovery,
    ) -> Result<IdClaims, OidcError> {
        let header = jsonwebtoken::decode_header(id_token)
            .map_err(|_| OidcError::IdToken("the token header is not readable"))?;
        if header.alg != jsonwebtoken::Algorithm::RS256 {
            // Pinned rather than taken from the token: `alg: none` and the
            // HMAC-with-the-public-key confusion both live in that gap.
            return Err(OidcError::IdToken("only RS256 ID tokens are accepted"));
        }

        let key = match self.decoding_key(header.kid.as_deref(), false).await? {
            Some(key) => key,
            // An unknown `kid` is the ordinary shape of a signing-key rotation:
            // refetch once before rejecting.
            None => self
                .decoding_key(header.kid.as_deref(), true)
                .await?
                .ok_or(OidcError::IdToken("no JWKS key matches the token's key id"))?,
        };

        let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
        validation.set_issuer(&[discovery.issuer.as_str()]);
        validation.set_audience(&[self.config.client_id.as_str()]);
        validation.set_required_spec_claims(&["exp", "iss", "aud", "sub"]);
        validation.leeway = CLOCK_SKEW_SECONDS;
        validation.validate_nbf = true;

        let token = jsonwebtoken::decode::<IdClaims>(id_token, &key, &validation)
            .map_err(|error| id_token_error(&error))?;

        // The nonce binds the token to *this* browser's authorization request;
        // without it a token minted for another session would be accepted.
        match token.claims.nonce.as_deref() {
            Some(value) if tokens_match(value, nonce) => {}
            _ => return Err(OidcError::IdToken("the nonce does not match this sign-in")),
        }
        if token.claims.sub.trim().is_empty() {
            return Err(OidcError::IdToken("the token carries no subject"));
        }
        Ok(token.claims)
    }

    async fn decoding_key(
        &self,
        kid: Option<&str>,
        force_refresh: bool,
    ) -> Result<Option<jsonwebtoken::DecodingKey>, OidcError> {
        let jwks = self.jwks(force_refresh).await?;
        let candidate = jwks.keys.iter().find(|key| {
            key.kty == "RSA"
                && key.alg.as_deref().is_none_or(|alg| alg == "RS256")
                && match (kid, key.kid.as_deref()) {
                    (Some(wanted), Some(have)) => wanted == have,
                    // A single-key JWKS may omit `kid`; a token without one
                    // matches whatever RSA key the provider publishes.
                    (None, _) | (_, None) => true,
                }
        });
        let Some(jwk) = candidate else {
            return Ok(None);
        };
        let (Some(n), Some(e)) = (jwk.n.as_deref(), jwk.e.as_deref()) else {
            return Err(OidcError::Malformed {
                document: "JWKS (RSA key without modulus or exponent)",
            });
        };
        jsonwebtoken::DecodingKey::from_rsa_components(n, e)
            .map(Some)
            .map_err(|_| OidcError::Malformed {
                document: "JWKS (unusable RSA key)",
            })
    }

    /// RP-initiated logout URL, when the provider advertises one.
    pub async fn end_session_url(&self) -> Option<String> {
        let discovery = self.discovery().await.ok()?;
        let endpoint = discovery.end_session_endpoint.clone()?;
        let separator = if endpoint.contains('?') { '&' } else { '?' };
        let mut url = format!(
            "{endpoint}{separator}client_id={}",
            form_encode(&self.config.client_id)
        );
        if let Some(redirect) = &self.config.post_logout_redirect_uri {
            url.push_str(&format!(
                "&post_logout_redirect_uri={}",
                form_encode(redirect)
            ));
        }
        Some(url)
    }
}

/// Map a `jsonwebtoken` rejection onto a message that names the failed check
/// without echoing the token.
fn id_token_error(error: &jsonwebtoken::errors::Error) -> OidcError {
    use jsonwebtoken::errors::ErrorKind;
    OidcError::IdToken(match error.kind() {
        ErrorKind::InvalidSignature => "the signature does not verify against the provider's JWKS",
        ErrorKind::ExpiredSignature => "the token has expired",
        ErrorKind::InvalidAudience => "the token was issued for another client",
        ErrorKind::InvalidIssuer => "the token was issued by another provider",
        ErrorKind::ImmatureSignature => "the token is not valid yet",
        ErrorKind::MissingRequiredClaim(_) => "the token is missing a required claim",
        _ => "the token could not be validated",
    })
}

fn read_cache<T>(cache: &Mutex<Option<(Instant, Arc<T>)>>, ttl: Duration) -> Option<Arc<T>> {
    let guard = cache.lock().unwrap_or_else(PoisonError::into_inner);
    guard
        .as_ref()
        .filter(|(stored, _)| stored.elapsed() < ttl)
        .map(|(_, value)| Arc::clone(value))
}

fn write_cache<T>(cache: &Mutex<Option<(Instant, Arc<T>)>>, value: Arc<T>) {
    let mut guard = cache.lock().unwrap_or_else(PoisonError::into_inner);
    *guard = Some((Instant::now(), value));
}

/// `application/x-www-form-urlencoded` encoding for one query value.
///
/// Fifteen lines against a `percent-encoding` dependency, the same trade
/// ADR-012 §11 already took for the audit layer's decoder.
#[must_use]
pub fn form_encode(value: &str) -> String {
    let mut out = String::with_capacity(value.len());
    for byte in value.as_bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'.' | b'_' | b'~' => {
                out.push(char::from(*byte));
            }
            other => out.push_str(&format!("%{other:02X}")),
        }
    }
    out
}

/// `Set-Cookie` establishing the in-flight authorization request.
#[must_use]
pub fn set_flow_cookie(value: &str) -> String {
    format!(
        "{FLOW_COOKIE}={value}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; \
         Max-Age={FLOW_TTL_SECONDS}"
    )
}

/// `Set-Cookie` clearing it. Sent on every callback, successful or not: a flow
/// is single use.
#[must_use]
pub fn clear_flow_cookie() -> String {
    format!("{FLOW_COOKIE}=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0")
}

/// Read the flow cookie out of a request's headers.
#[must_use]
pub fn flow_cookie(headers: &axum::http::HeaderMap) -> Option<String> {
    headers
        .get_all(axum::http::header::COOKIE)
        .iter()
        .filter_map(|value| value.to_str().ok())
        .flat_map(|value| value.split(';'))
        .filter_map(|pair| pair.split_once('='))
        .find(|(name, _)| name.trim() == FLOW_COOKIE)
        .map(|(_, value)| value.trim().to_owned())
}

/// Where the browser goes after a successful callback.
///
/// Only a same-origin absolute path is honoured; `//evil.example` and
/// `https://evil.example` are open redirects and are refused in favour of the
/// dashboard root.
#[must_use]
pub fn safe_next(next: Option<&str>, default: &'static str) -> String {
    match next {
        Some(path)
            if path.starts_with('/')
                && !path.starts_with("//")
                && !path.starts_with("/\\")
                && !path.contains('\n')
                && !path.contains('\r') =>
        {
            path.to_owned()
        }
        _ => default.to_owned(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_pkce_challenge_is_the_s256_of_the_verifier() {
        // RFC 7636 appendix B known answer.
        let flow = FlowState {
            state: "s".to_owned(),
            nonce: "n".to_owned(),
            code_verifier: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk".to_owned(),
        };
        assert_eq!(
            flow.code_challenge(),
            "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
        );
    }

    #[test]
    fn the_flow_cookie_round_trips_and_rejects_malformed_values() {
        let flow = FlowState::generate().expect("the OS CSPRNG is available");
        let encoded = flow.to_cookie_value();
        assert_eq!(FlowState::from_cookie_value(&encoded), Some(flow));

        for malformed in ["", "only", "two.parts", "a.b.c.d", ".b.c", "a..c"] {
            assert!(
                FlowState::from_cookie_value(malformed).is_none(),
                "`{malformed}` must not parse as a flow"
            );
        }
    }

    #[test]
    fn flow_tokens_are_unguessable_and_distinct() {
        let flow = FlowState::generate().expect("the OS CSPRNG is available");
        assert_ne!(flow.state, flow.nonce);
        assert_ne!(flow.nonce, flow.code_verifier);
        // 32 bytes base64url with no padding.
        assert_eq!(flow.state.len(), 43);
        assert!(
            !flow.state.contains('.'),
            "the cookie split must stay total"
        );
    }

    #[test]
    fn token_comparison_is_length_and_content_exact() {
        assert!(tokens_match("abc", "abc"));
        assert!(!tokens_match("abc", "abd"));
        assert!(!tokens_match("abc", "ab"));
    }

    #[test]
    fn the_group_claim_accepts_both_provider_spellings() {
        let claims = |value: serde_json::Value| -> IdClaims {
            serde_json::from_value(serde_json::json!({
                "sub": "s", "groups": value,
            }))
            .expect("claims deserialize")
        };
        assert_eq!(
            claims(serde_json::json!(["a", "b"])).groups("groups"),
            vec!["a".to_owned(), "b".to_owned()]
        );
        assert_eq!(
            claims(serde_json::json!("a b")).groups("groups"),
            vec!["a".to_owned(), "b".to_owned()]
        );
        assert!(claims(serde_json::json!(7)).groups("groups").is_empty());
        assert!(claims(serde_json::json!(["a"])).groups("roles").is_empty());
    }

    #[test]
    fn the_display_name_falls_back_to_the_subject() {
        let claims: IdClaims =
            serde_json::from_value(serde_json::json!({"sub": "abc"})).expect("claims");
        assert_eq!(claims.display_name(), "abc");
        let claims: IdClaims =
            serde_json::from_value(serde_json::json!({"sub": "abc", "preferred_username": "u"}))
                .expect("claims");
        assert_eq!(claims.display_name(), "u");
    }

    #[test]
    fn the_return_path_cannot_be_an_open_redirect() {
        assert_eq!(safe_next(Some("/app/units"), "/app"), "/app/units");
        for hostile in [
            "//evil.example",
            "https://evil.example",
            "/\\evil.example",
            "/app\nSet-Cookie: x=1",
        ] {
            assert_eq!(safe_next(Some(hostile), "/app"), "/app", "{hostile}");
        }
        assert_eq!(safe_next(None, "/app"), "/app");
    }

    #[test]
    fn query_values_are_percent_encoded() {
        assert_eq!(form_encode("a b&c=d"), "a%20b%26c%3Dd");
        assert_eq!(form_encode("Aa0-._~"), "Aa0-._~");
    }

    #[test]
    fn the_redirect_uri_is_derived_from_the_public_origin() {
        assert_eq!(
            OidcConfig::redirect_uri_for("https://tou.edu.kz/"),
            "https://tou.edu.kz/api/auth/callback"
        );
    }
}
