//! Shared application state and the typed runtime configuration behind it.

use std::path::PathBuf;
use std::sync::Arc;

use axum::http::Uri;
use compliance::KPolicyCache;
use domain::RoleKind;

use crate::auth::mapping::{self, RoleMapping};
use crate::auth::oidc::{OidcClient, OidcConfig};
use crate::error::ApiError;
use crate::layers::rate_limit::{RateLimitConfig, RateLimiter};
use crate::metrics::Metrics;

/// Shared application state. Cheap to clone (everything behind `Arc`/pools).
#[derive(Clone)]
pub struct AppState {
    pub db: db::Pool,
    pub config: Arc<AppConfig>,
    /// Active k-anonymity policy, reloaded from `settings.k_threshold` at most
    /// once per [`compliance::K_POLICY_TTL`] (ARCHITECTURE.md §4.3).
    pub k_policy: Arc<KPolicyCache>,
    /// Per-IP token bucket in front of the public contour (ADR-012 §5).
    pub rate_limiter: Arc<RateLimiter>,
    /// Prometheus registry behind `/metrics` (ARCHITECTURE.md §8).
    pub metrics: Arc<Metrics>,
    /// The portal IdP client. `None` in `APP_AUTH_MODE=dev` and whenever the
    /// OIDC environment is incomplete - `/api/auth/login` then says so rather
    /// than redirecting into a half-configured flow.
    pub oidc: Option<Arc<OidcClient>>,
}

impl AppState {
    #[must_use]
    pub fn new(db: db::Pool, config: AppConfig) -> Self {
        let rate_limiter = Arc::new(RateLimiter::new(config.public_rate_limit));
        let oidc = config
            .oidc
            .clone()
            .and_then(|oidc| match OidcClient::new(oidc) {
                Ok(client) => Some(Arc::new(client)),
                Err(error) => {
                    tracing::error!(%error, "the OIDC client could not be built");
                    None
                }
            });
        Self {
            db,
            config: Arc::new(config),
            k_policy: Arc::new(KPolicyCache::new()),
            rate_limiter,
            metrics: Arc::new(Metrics::new()),
            oidc,
        }
    }

    /// The active policy, from cache or from `settings`.
    ///
    /// A malformed `k_threshold` is an error, never a fallback to the default:
    /// suppression must not weaken because an administrator typed `"5"` instead
    /// of `5` (`db::settings::k_threshold`).
    pub async fn k_policy(&self) -> Result<compliance::KPolicy, db::DbError> {
        if let Some(policy) = self.k_policy.get() {
            return Ok(policy);
        }
        let policy = db::settings::k_threshold(&self.db).await?;
        self.k_policy.store(policy);
        Ok(policy)
    }

    /// The AD group → role table, or the shipped defaults when the setting has
    /// never been written (ADR-014 §3).
    ///
    /// A *malformed* stored table is an error, not a fallback to the defaults:
    /// silently ignoring a broken mapping would sign people in with fewer
    /// rights than the administrator believes they granted.
    pub async fn role_mappings(&self) -> Result<Vec<RoleMapping>, ApiError> {
        match db::settings::get(&self.db, mapping::ROLE_MAPPINGS_KEY).await? {
            None => Ok(mapping::defaults()),
            Some(value) => mapping::parse(&value).map_err(|error| {
                tracing::error!(%error, "settings.role_mappings is malformed");
                ApiError::Internal("settings.role_mappings is malformed")
            }),
        }
    }
}

/// How the internal contour authenticates.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AuthMode {
    /// Portal SSO through OIDC - the production mode (slice W3.1).
    Oidc,
    /// `POST /api/auth/dev-login` mints a session directly. Development, tests
    /// and e2e only; never a production deployment (PLAN.md D7).
    Dev,
}

impl AuthMode {
    /// Parses `APP_AUTH_MODE`. Unknown values are an error rather than a silent
    /// fallback - an environment typo must not open the dev login.
    pub fn parse(value: &str) -> Result<Self, UnknownAuthMode> {
        match value.trim() {
            "oidc" => Ok(Self::Oidc),
            "dev" => Ok(Self::Dev),
            other => Err(UnknownAuthMode(other.to_owned())),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("APP_AUTH_MODE must be `oidc` or `dev`, got `{0}`")]
pub struct UnknownAuthMode(pub String);

/// Whether a caller sees raw aggregates or k-screened ones (ADR-014 §4).
///
/// TZ §6.2 applies suppression «на публичном контуре, а также в агрегированных
/// представлениях внутреннего контура **для широкой аудитории**». The five
/// roles TZ §5 grants scoped internal access to are not a wide audience: their
/// SQL scope is the control, and screening a dean's own faculty back to
/// «недостаточно данных» would make the internal contour useless for the exact
/// oversight it exists for. Everyone else - today only `staff`, whose TZ §5
/// own-discipline view is the next thing to land here - reads the same numbers
/// through the active [`compliance::KPolicy`].
///
/// Two things are screened for **everyone**, regardless of this decision:
/// escalations broken down by unit (TZ §4.2 §7 «без указания конкретных кафедр
/// при малой выборке») and every export file.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Screening {
    /// Exact values, inside the caller's SQL-enforced scope.
    Raw,
    /// Screened through the active `KPolicy`.
    Screened,
}

impl Screening {
    /// The policy for one role.
    #[must_use]
    pub fn for_role(role: Option<RoleKind>) -> Self {
        match role {
            Some(
                RoleKind::DeptHead
                | RoleKind::Dean
                | RoleKind::Ethics
                | RoleKind::Compliance
                | RoleKind::Admin,
            ) => Self::Raw,
            Some(RoleKind::Staff) | None => Self::Screened,
        }
    }

    #[must_use]
    pub fn is_raw(self) -> bool {
        matches!(self, Self::Raw)
    }
}

/// Runtime configuration, parsed once at startup from environment variables.
#[derive(Debug, Clone)]
pub struct AppConfig {
    /// `APP_PUBLIC_BASE_URL` - external origin behind the portal proxy.
    pub public_base_url: Uri,
    /// `APP_AUTH_MODE` - `oidc` (default) or `dev`.
    pub auth_mode: AuthMode,
    /// Session lifetime in seconds (`APP_SESSION_TTL_SECONDS`, default 12 h).
    pub session_ttl_seconds: i64,
    pub public_rate_limit: RateLimitConfig,
    /// Portal IdP parameters (`APP_OIDC_*`). `None` when unconfigured.
    pub oidc: Option<OidcConfig>,
    /// Where `report_snapshots` files live (`APP_REPORTS_DIR`).
    pub reports_dir: PathBuf,
    /// `APP_INGEST_PEPPER`, needed to derive a `staff_units` key from an e-mail
    /// the admin types (ADR-008 §2). Absent on a host that runs API sources
    /// only; the route then answers 503 rather than writing a wrong digest.
    pub ingest_pepper: Option<ingest::Pepper>,
    /// Degradation threshold for `/readyz` - the newest succeeded ingest batch
    /// may be at most this old (ARCHITECTURE.md §8).
    pub ingest_max_age_seconds: i64,
    /// `APP_EMBED_FRAME_ANCESTORS` - the CSP `frame-ancestors` source list the
    /// **public** contour publishes (TZ §8, ADR-012 §9). A space-separated
    /// origin list, no trailing `;`. Defaults to
    /// [`crate::layers::security::DEFAULT_FRAME_ANCESTORS`]; a value that is
    /// empty or not a legal header value falls back to the same default with a
    /// warning rather than widening the policy.
    pub embed_frame_ancestors: String,
}

/// Twelve hours: one working day, so a session does not outlive the day it was
/// opened in but does not expire mid-shift either.
pub const DEFAULT_SESSION_TTL_SECONDS: i64 = 12 * 60 * 60;

/// TZ §3.3.3 requires a refresh at least once a day; 26 hours leaves the
/// nightly tick (02:00 +05:00) two hours of slack before readiness degrades.
pub const DEFAULT_INGEST_MAX_AGE_SECONDS: i64 = 26 * 60 * 60;

impl AppConfig {
    /// A configuration with production-shaped defaults, for tests and for the
    /// binary to override field by field.
    #[must_use]
    pub fn new(public_base_url: Uri) -> Self {
        Self {
            public_base_url,
            auth_mode: AuthMode::Oidc,
            session_ttl_seconds: DEFAULT_SESSION_TTL_SECONDS,
            public_rate_limit: RateLimitConfig::default(),
            oidc: None,
            reports_dir: reports::default_out_dir(),
            ingest_pepper: None,
            ingest_max_age_seconds: DEFAULT_INGEST_MAX_AGE_SECONDS,
            embed_frame_ancestors: crate::layers::security::DEFAULT_FRAME_ANCESTORS.to_owned(),
        }
    }

    /// The external origin as a string, without a trailing slash.
    #[must_use]
    pub fn public_origin(&self) -> String {
        self.public_base_url
            .to_string()
            .trim_end_matches('/')
            .to_owned()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_five_scoped_roles_read_raw_numbers_inside_their_scope() {
        for role in [
            RoleKind::DeptHead,
            RoleKind::Dean,
            RoleKind::Ethics,
            RoleKind::Compliance,
            RoleKind::Admin,
        ] {
            assert_eq!(Screening::for_role(Some(role)), Screening::Raw, "{role:?}");
        }
    }

    #[test]
    fn a_wide_audience_role_reads_screened_numbers() {
        assert_eq!(
            Screening::for_role(Some(RoleKind::Staff)),
            Screening::Screened
        );
        // The role-less case cannot reach a handler, but the default has to be
        // the safe one anyway.
        assert_eq!(Screening::for_role(None), Screening::Screened);
    }

    #[test]
    fn the_public_origin_has_no_trailing_slash() {
        let config = AppConfig::new(
            "https://tou.edu.kz"
                .parse()
                .expect("the test base URL is absolute"),
        );
        assert_eq!(config.public_origin(), "https://tou.edu.kz");
    }
}
