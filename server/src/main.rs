use std::net::SocketAddr;
use std::time::Duration;

use anyhow::{Context, bail};
use api::state::{AppConfig, AppState};
use axum::http::Uri;
use tracing_subscriber::EnvFilter;

const DATABASE_CONNECT_TIMEOUT: Duration = Duration::from_secs(5);

struct RuntimeConfig {
    database: db::DatabaseConfig,
    listen_addr: SocketAddr,
    public_base_url: Uri,
}

impl RuntimeConfig {
    fn from_env() -> anyhow::Result<Self> {
        Self::parse(
            required_env("APP_DATABASE_URL")?,
            required_env("APP_LISTEN_ADDR")?,
            required_env("APP_PUBLIC_BASE_URL")?,
        )
    }

    fn parse(
        database_url: String,
        listen_addr: String,
        public_base_url: String,
    ) -> anyhow::Result<Self> {
        let database = database_url
            .parse()
            .context("APP_DATABASE_URL must be a valid PostgreSQL connection URL")?;
        let listen_addr = listen_addr
            .parse()
            .context("APP_LISTEN_ADDR must be a socket address such as 127.0.0.1:8080")?;
        let public_base_url: Uri = public_base_url
            .parse()
            .context("APP_PUBLIC_BASE_URL must be a valid absolute URL")?;

        match public_base_url.scheme_str() {
            Some("http" | "https") if public_base_url.authority().is_some() => {}
            _ => bail!("APP_PUBLIC_BASE_URL must be an absolute HTTP(S) URL"),
        }
        if public_base_url.query().is_some() {
            bail!("APP_PUBLIC_BASE_URL must not contain a query string");
        }

        Ok(Self {
            database,
            listen_addr,
            public_base_url,
        })
    }
}

/// An optional non-empty setting, trimmed. Absent and blank are the same thing:
/// "not configured".
fn optional_env(name: &str) -> Option<String> {
    std::env::var(name)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn required_env(name: &'static str) -> anyhow::Result<String> {
    let value = std::env::var(name)
        .with_context(|| format!("required environment variable {name} is not set"))?;
    if value.trim().is_empty() {
        bail!("required environment variable {name} is empty");
    }
    Ok(value)
}

/// An optional positive-integer setting. A value that is present but not a
/// positive number is a startup failure, never a silent fallback to the
/// default: an operator who set `APP_SESSION_TTL_SECONDS=twelve` meant
/// something, and it was not "twelve hours".
fn optional_seconds(name: &'static str, default: i64) -> anyhow::Result<i64> {
    match std::env::var(name) {
        Err(_) => Ok(default),
        Ok(value) if value.trim().is_empty() => Ok(default),
        Ok(value) => {
            let seconds: i64 = value
                .trim()
                .parse()
                .with_context(|| format!("{name} must be a whole number of seconds"))?;
            if seconds <= 0 {
                bail!("{name} must be positive");
            }
            Ok(seconds)
        }
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .init();

    let config = RuntimeConfig::from_env()?;
    let pool = tokio::time::timeout(DATABASE_CONNECT_TIMEOUT, db::connect(&config.database))
        .await
        .context("timed out connecting to PostgreSQL")?
        .context("failed to connect to PostgreSQL")?;
    db::migrate(&pool)
        .await
        .context("failed to apply database migrations")?;
    tracing::info!("migrations up to date");

    // Nightly ingest (ADR-005): an in-process Tokio task, single-flighted
    // across processes by the Postgres advisory lock in `ingest::store`. A
    // missing pepper or source token is not a startup failure - the per-source
    // run reports it - but a malformed one is.
    match ingest::SchedulerConfig::from_env() {
        Ok(scheduler) => {
            ingest::spawn_scheduler(&pool, scheduler);
            tracing::info!("nightly ingest scheduler started");
        }
        Err(error) => bail!("invalid ingest configuration: {error}"),
    }

    // Annual Приложение-1 generation on Sep 1 for the finished academic year
    // (W4.2, TZ §4.5). Its own advisory lock, so it neither blocks nor is
    // blocked by the ingest tick an hour earlier. Generation is not
    // publication: the snapshot lands unpublished and an administrator decides
    // (AGENTS.md §7).
    let reports_dir = reports::default_out_dir();
    reports::spawn_annual_scheduler(&pool, reports_dir.clone());
    tracing::info!(
        reports_dir = %reports_dir.display(),
        "annual report scheduler started"
    );

    // A deployment with no accounts cannot be signed into, and nothing in the
    // HTTP surface can create the first one (ADR-017 §3). Say so at startup
    // rather than leaving an operator at a sign-in page that refuses every
    // attempt. Not a startup failure: the binary that fixes it needs the
    // migrations this process has just applied.
    match db::users::list(&pool, 1, 0).await {
        Ok(accounts) if accounts.is_empty() => tracing::warn!(
            "no accounts exist; create the first administrator with \
             `manage-users create-user --username <name> --role admin`"
        ),
        Ok(_) => {}
        Err(error) => tracing::warn!(%error, "could not check for existing accounts"),
    }

    // `APP_INGEST_PEPPER` is parsed once here so the admin staff-unit editor
    // derives keys with exactly the pepper the importer uses (ADR-008 §2).
    let ingest_pepper =
        ingest::Pepper::from_env_optional().context("APP_INGEST_PEPPER is present but empty")?;

    // TZ §8 - who may frame the public widget. Unset means the portal origins
    // (ADR-012 §9); an unusable value is warned about and falls back to the same
    // list inside `layers::security`, never to `*`.
    let embed_frame_ancestors = optional_env("APP_EMBED_FRAME_ANCESTORS")
        .unwrap_or_else(|| api::layers::security::DEFAULT_FRAME_ANCESTORS.to_owned());
    tracing::info!(
        frame_ancestors = %embed_frame_ancestors,
        "public contour embeddable by these origins"
    );

    let state = AppState::new(
        pool,
        AppConfig {
            ingest_pepper,
            reports_dir,
            embed_frame_ancestors,
            session_ttl_seconds: optional_seconds(
                "APP_SESSION_TTL_SECONDS",
                api::state::DEFAULT_SESSION_TTL_SECONDS,
            )?,
            ingest_max_age_seconds: optional_seconds(
                "APP_INGEST_MAX_AGE_SECONDS",
                api::state::DEFAULT_INGEST_MAX_AGE_SECONDS,
            )?,
            ..AppConfig::new(config.public_base_url)
        },
    );
    let router = api::build_router(state);

    let listener = tokio::net::TcpListener::bind(config.listen_addr).await?;
    tracing::info!(listen_addr = %config.listen_addr, "noplagiat-server listening");
    // `ConnectInfo` is what the rate limiter falls back to when the gateway has
    // not set a forwarded header (ADR-012 §5).
    axum::serve(
        listener,
        router.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::RuntimeConfig;

    fn parse(listen_addr: &str, public_base_url: &str) -> anyhow::Result<RuntimeConfig> {
        RuntimeConfig::parse(
            "postgres://user:secret@localhost/noplagiat".to_owned(),
            listen_addr.to_owned(),
            public_base_url.to_owned(),
        )
    }

    #[test]
    fn parses_typed_runtime_config() {
        let config =
            parse("127.0.0.1:8080", "https://analytics.example.edu").expect("valid configuration");

        assert_eq!(config.listen_addr.to_string(), "127.0.0.1:8080");
        assert_eq!(
            config.public_base_url.to_string(),
            "https://analytics.example.edu/"
        );
    }

    #[test]
    fn rejects_non_http_public_base_url() {
        assert!(parse("127.0.0.1:8080", "file:///tmp/noplagiat").is_err());
    }

    #[test]
    fn rejects_invalid_listen_address() {
        assert!(parse("localhost:8080", "https://analytics.example.edu").is_err());
    }
}
