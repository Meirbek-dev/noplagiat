//! A mock OpenID Provider, for the W3.1 gate.
//!
//! The real portal IdP is an external dependency with a long registration lead
//! time (PLAN.md D7, R3), so the acceptance evidence for the code flow is this:
//! a local axum server that serves a discovery document, a JWKS and a token
//! endpoint, and signs ID tokens with a fixed RSA test key. Every failure mode
//! the flow has to reject - a replayed `state`, a foreign `nonce`, another
//! client's `aud`, an expired token, an unknown key - is produced by handing
//! this server a differently-shaped token and watching the callback refuse it.
//!
//! The key below is a throwaway generated for the test suite. It signs nothing
//! outside this process and is committed on purpose so the tests are
//! deterministic and need no key generation at run time.

use std::sync::{Arc, Mutex, PoisonError};

use axum::extract::State;
use axum::routing::{get, post};
use axum::{Json, Router};
use serde_json::{Value, json};

/// Throwaway 2048-bit RSA key. **Test fixture only.**
pub const TEST_KEY_PEM: &str = "-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZEthSmV0Se5tc
u7yriy6I6wSb+lfvXUDQdNuu7uecnuod0c0dF8hMwvQg2qJaXVYoKTMklrroaTmT
0Vkqj6VWSceOmXLMn35JKfjfNw7XYfG0RQqCRsGJmeTN90kwCCm/KwWalG+KldRk
3SWx6U53C7MSKIdhq4jU0Ik9ZcBai+7eZK+hwC2bTZI26St6isLkIVsmNXYCz7f9
d6etqZf8uoiP0yNjhSKCJeQkLBaxzjwjI2fuQtkUqw7SelxxVlglDMUqwh6GS10F
qtGTq9pkpBObup5GSoOvRnJP2BdBqlwIPK0YcIMvvnO3udbPSm6ivWwhpgp/zM1c
Qz7RCMDXAgMBAAECggEADityv4GPV8OF0rnWiQQe14Uv2davospdjr3yESs7Jzgg
ZC3ry7hftNMNCI/9BRUOqLR3yC2mqcEkpweFYIfb7RQH2MEfg0fuAGyi+D8p0tlr
466WDwb7XzYSf3di6aW+w+HVDdAer9cz9BmTeleWbaLv34GRxMhjuDCcpMtdkQtu
k8DUDFcNLsRfIPG5zVXtff9eaFGJVB6t9qJCHmy3hqUNZW/+teYZ4WtnKUcnktma
9imxAgmAch9+HXv5LFhRMH3K7/XSQRA8HRzGZT1fCRXYbx6UCsY9Ay5swENPclC4
kff7bi10rUn4w6nttfuYDjbnqyi9jb+SfCyq7iIK0QKBgQDzNc+wDMijgYQlXhjc
DeH4HOUUiW2zX0NLdNOqSPWIuyw1BL91N1K5Oat3bdxEvLtGkr157NfadZqOjoi6
llzKwQxCQqpMvARHesjw/+bESXQ5pwLU3y18EUBez5o20dnHikXPad0UgoPLgNsu
cWX8tDFoUSfJhDhm6CBtbIIg3QKBgQDkfSxJ1aYvJzfHP3MnJdLe46sTxCi5UwCC
t02na7bvVtMkHq5rosDYnbwYakt16+hdGlpAH6rBmx5esipxIC56yqFl9VUVei5b
9GOFvNW0qFvsVEiIVZ9++Z09G/HGuj87pYvJU5CCQo22mRZY5zWWU57ugdZquPgU
2Hr1ITTTQwKBgQDmYZLasUFdoNIMk5X43S2wWa6mRYgk4ZhdYc0fAP2VB7hYgKbb
4gv6aSaDew2sDxtXPqk9VZ0i00QUxe++z7AWX8e8/GlVRsTG8QhnQgDW7r2p3wpP
mxj67VyMcxsh0qb43YJDd4R0aS1vGCCHXeO9/PLQXg/SU+0Zjckp3h9mAQKBgDQF
T7ULwIdRzYA+sPADy4vVl9irO35eKGqaY0Kv4nmBchbyKVH2PyPSXcXNRZr2d/Pi
kROyYgUsVPDIbaNN6WcphS+aeKGoLK/g51vGj31PK4aV9eGcZPDa0fLczuIo+0aQ
PVA8B1Ww42TkW9Mn6Opt5Wx2ASRRMqJEW1I+GjHTAoGAG5i1RyL1Di+Q4boIqhWT
O1ZflsLSW0jIoiGK4tox4i0yulWGn/MFOYbh1ZVIR74FZwCpbViKR0BsvyC9V/v8
ocmjUmBcad74siNO9nfiV6WM0fmNKsko2AuFJLEkidhy0lcarI6tbWQqpEz0vVMh
1roSe7hdR+erd5BT5jAFBUY=
-----END PRIVATE KEY-----";

/// base64url modulus of [`TEST_KEY_PEM`].
pub const TEST_KEY_MODULUS: &str = "2RLYUpldEnubXLu8q4suiOsEm_pX711A0HTbru7nnJ7qHdHNHRfITML0INqiWl1WKCkzJJa66Gk5k9FZKo-lVknHjplyzJ9-SSn43zcO12HxtEUKgkbBiZnkzfdJMAgpvysFmpRvipXUZN0lselOdwuzEiiHYauI1NCJPWXAWovu3mSvocAtm02SNukreorC5CFbJjV2As-3_XenramX_LqIj9MjY4UigiXkJCwWsc48IyNn7kLZFKsO0npccVZYJQzFKsIehktdBarRk6vaZKQTm7qeRkqDr0ZyT9gXQapcCDytGHCDL75zt7nWz0puor1sIaYKf8zNXEM-0QjA1w";
/// base64url public exponent (65537).
pub const TEST_KEY_EXPONENT: &str = "AQAB";
/// `kid` the mock publishes and stamps into every token it signs.
pub const TEST_KEY_ID: &str = "test-key-1";

/// The client this provider issues tokens for.
pub const CLIENT_ID: &str = "noplagiat-dashboard";
pub const CLIENT_SECRET: &str = "test-secret";

/// Mutable knobs the tests turn between requests.
#[derive(Clone)]
pub struct MockState {
    /// The exact ID token `/token` will hand back.
    pub id_token: Arc<Mutex<String>>,
    /// Status the token endpoint answers with (200 unless a test says
    /// otherwise, so the "provider refused the exchange" path is reachable).
    pub token_status: Arc<Mutex<u16>>,
    /// The JWKS. A test can swap in an unrelated key to exercise the
    /// signature-mismatch path.
    pub jwks: Arc<Mutex<Value>>,
}

/// A running mock provider.
pub struct MockIdp {
    pub issuer: String,
    pub state: MockState,
}

impl MockIdp {
    /// Bind an ephemeral port and serve until the process ends.
    pub async fn start() -> Self {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0")
            .await
            .expect("the mock IdP binds a loopback port");
        let port = listener
            .local_addr()
            .expect("the mock IdP has a local address")
            .port();
        let issuer = format!("http://127.0.0.1:{port}");

        let state = MockState {
            id_token: Arc::new(Mutex::new(String::new())),
            token_status: Arc::new(Mutex::new(200)),
            jwks: Arc::new(Mutex::new(json!({
                "keys": [{
                    "kty": "RSA",
                    "use": "sig",
                    "alg": "RS256",
                    "kid": TEST_KEY_ID,
                    "n": TEST_KEY_MODULUS,
                    "e": TEST_KEY_EXPONENT,
                }]
            }))),
        };

        let router = Router::new()
            .route("/.well-known/openid-configuration", get(discovery))
            .route("/jwks", get(jwks))
            .route("/token", post(token))
            .with_state((issuer.clone(), state.clone()));

        tokio::spawn(async move {
            let _ = axum::serve(listener, router).await;
        });

        Self { issuer, state }
    }

    /// The `api` configuration pointing at this provider.
    pub fn oidc_config(&self, redirect_origin: &str) -> api::auth::oidc::OidcConfig {
        api::auth::oidc::OidcConfig {
            issuer: self.issuer.clone(),
            client_id: CLIENT_ID.to_owned(),
            client_secret: CLIENT_SECRET.to_owned(),
            redirect_uri: api::auth::oidc::OidcConfig::redirect_uri_for(redirect_origin),
            scopes: api::auth::oidc::DEFAULT_SCOPES.to_owned(),
            groups_claim: api::auth::oidc::DEFAULT_GROUPS_CLAIM.to_owned(),
            post_logout_redirect_uri: Some(format!("{redirect_origin}/")),
        }
    }

    /// Arm the token endpoint with the next ID token.
    pub fn issue(&self, token: String) {
        *self
            .state
            .id_token
            .lock()
            .unwrap_or_else(PoisonError::into_inner) = token;
    }

    pub fn set_token_status(&self, status: u16) {
        *self
            .state
            .token_status
            .lock()
            .unwrap_or_else(PoisonError::into_inner) = status;
    }

    /// Replace the published JWKS - used to prove an unknown `kid` is refused
    /// rather than silently trusted.
    pub fn set_jwks(&self, jwks: Value) {
        *self
            .state
            .jwks
            .lock()
            .unwrap_or_else(PoisonError::into_inner) = jwks;
    }

    /// Sign a claim set with the test key.
    pub fn sign(&self, claims: &Value) -> String {
        sign_with_kid(claims, TEST_KEY_ID)
    }

    /// A well-formed ID token for this provider: correct issuer, audience,
    /// expiry and the supplied nonce and groups.
    pub fn id_token(&self, subject: &str, nonce: &str, groups: &[&str]) -> String {
        self.sign(&self.claims(subject, nonce, groups))
    }

    /// The claim set behind [`Self::id_token`], for tests that need to bend one
    /// field before signing.
    pub fn claims(&self, subject: &str, nonce: &str, groups: &[&str]) -> Value {
        let now = now_seconds();
        json!({
            "iss": self.issuer,
            "aud": CLIENT_ID,
            "sub": subject,
            "nonce": nonce,
            "iat": now,
            "exp": now + 300,
            "email": format!("{subject}@tou.edu.kz"),
            "name": subject,
            "groups": groups,
        })
    }
}

/// Sign a claim set with the test key under an arbitrary `kid`.
pub fn sign_with_kid(claims: &Value, kid: &str) -> String {
    let mut header = jsonwebtoken::Header::new(jsonwebtoken::Algorithm::RS256);
    header.kid = Some(kid.to_owned());
    let key = jsonwebtoken::EncodingKey::from_rsa_pem(TEST_KEY_PEM.as_bytes())
        .expect("the test key is a valid RSA PEM");
    jsonwebtoken::encode(&header, claims, &key).expect("the test claims serialize")
}

pub fn now_seconds() -> i64 {
    jiff::Timestamp::now().as_second()
}

// ── handlers ────────────────────────────────────────────────────────────────

type Ctx = State<(String, MockState)>;

async fn discovery(State((issuer, _)): Ctx) -> Json<Value> {
    Json(json!({
        "issuer": issuer,
        "authorization_endpoint": format!("{issuer}/authorize"),
        "token_endpoint": format!("{issuer}/token"),
        "jwks_uri": format!("{issuer}/jwks"),
        "end_session_endpoint": format!("{issuer}/logout"),
        "response_types_supported": ["code"],
        "id_token_signing_alg_values_supported": ["RS256"],
        "code_challenge_methods_supported": ["S256"],
    }))
}

async fn jwks(State((_, state)): Ctx) -> Json<Value> {
    Json(
        state
            .jwks
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .clone(),
    )
}

async fn token(State((_, state)): Ctx, body: String) -> (axum::http::StatusCode, Json<Value>) {
    let status = *state
        .token_status
        .lock()
        .unwrap_or_else(PoisonError::into_inner);
    let status =
        axum::http::StatusCode::from_u16(status).unwrap_or(axum::http::StatusCode::BAD_REQUEST);
    if !status.is_success() {
        return (status, Json(json!({"error": "invalid_grant"})));
    }
    // The client must present PKCE and its credentials; a mock that accepted a
    // request without them would let the flow regress silently.
    for required in ["code_verifier=", "client_id=", "client_secret=", "code="] {
        assert!(
            body.contains(required),
            "the token request is missing `{required}`: {body}"
        );
    }
    let id_token = state
        .id_token
        .lock()
        .unwrap_or_else(PoisonError::into_inner)
        .clone();
    (
        status,
        Json(json!({
            "access_token": "mock-access-token",
            "token_type": "Bearer",
            "expires_in": 300,
            "id_token": id_token,
        })),
    )
}
