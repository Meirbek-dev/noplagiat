//! Database access: pool, migrations, and every SQL query the server runs.
//!
//! Two rules govern everything in this crate.
//!
//! 1. **Scope is a parameter, not a convention** (AGENTS.md invariant #3).
//!    Every function that reads check data takes a [`compliance::Scope`] and
//!    passes it to SQL; there is no unscoped read path. The canonical predicate
//!    lives once, inside the `agg_cells` / `fact_cells` functions created by
//!    migration 0003, so a query cannot silently omit it - the parameter has no
//!    default.
//! 2. **Request paths read aggregates, not facts** (ARCHITECTURE.md §3.3).
//!    `agg_cells` serves whole months from `agg_monthly`; the fact table is
//!    touched only for the boundary months of an arbitrary date range, for a
//!    histogram whose boundaries differ from the ADR-008 §8 defaults, and for
//!    the two non-additive metrics (distinct works, distinct reviewers). Each
//!    of those exceptions is documented at its call site.
//!
//! Everything returned from [`q`] is **raw, pre-suppression** data. It is an
//! internal-contour value: nothing here may reach a public response before it
//! has passed through [`compliance::KPolicy`] (invariant #2).

use std::ops::Deref;
use std::str::FromStr;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

use sqlx::PgPool;
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};

pub mod admin;
pub mod agg;
pub mod audit;
pub mod batches;
pub mod checks;
pub mod dicts;
pub mod filters;
pub mod manual;
pub mod q;
pub mod settings;
pub mod snapshots;
pub mod users;

const DATABASE_ACQUIRE_TIMEOUT: Duration = Duration::from_secs(3);

/// Validated PostgreSQL connection settings.
///
/// The parsed options are intentionally private so callers cannot accidentally
/// log the database URL (which may contain credentials).
#[derive(Clone)]
pub struct DatabaseConfig(PgConnectOptions);

impl FromStr for DatabaseConfig {
    type Err = DbError;

    fn from_str(database_url: &str) -> Result<Self, Self::Err> {
        Ok(Self(database_url.parse()?))
    }
}

/// Database pool plus process-local migration readiness state.
///
/// Readiness remains false until this process successfully runs the embedded
/// migrations. This prevents a later database recovery from making an
/// incompletely initialized process ready.
#[derive(Clone)]
pub struct Pool {
    inner: PgPool,
    migrations_applied: Arc<AtomicBool>,
}

impl Deref for Pool {
    type Target = PgPool;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl Pool {
    /// The underlying `sqlx` pool - the executor every query in this crate
    /// binds against.
    pub(crate) fn pg(&self) -> &PgPool {
        &self.inner
    }

    /// Wrap a pool created elsewhere (the `#[sqlx::test]` harness, which has
    /// already applied the migrations to a scratch database).
    #[cfg(any(test, feature = "test-support"))]
    #[must_use]
    pub fn for_tests(inner: PgPool) -> Self {
        Self {
            inner,
            migrations_applied: Arc::new(AtomicBool::new(true)),
        }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum DbError {
    #[error("database error: {0}")]
    Sqlx(#[from] sqlx::Error),
    #[error("migration error: {0}")]
    Migrate(#[from] sqlx::migrate::MigrateError),
    #[error("database migrations have not completed successfully")]
    MigrationsNotApplied,
    /// A `create-user` naming an account that already exists (ADR-017 §3).
    /// Typed rather than left as a unique-violation `Sqlx`, so the CLI can say
    /// which name is taken instead of printing a constraint name.
    #[error("a user named `{0}` already exists")]
    UsernameTaken(String),
    #[error("setting `{key}` is missing")]
    MissingSetting { key: &'static str },
    /// A malformed setting is an error, never a silent fallback to the default:
    /// suppression and status derivation must not weaken because an
    /// administrator typed the wrong JSON shape.
    #[error("setting `{key}` is invalid: {message}")]
    InvalidSetting { key: &'static str, message: String },
    #[error("period cannot be expressed as a calendar range: {0}")]
    Period(#[from] domain::PeriodError),
    #[error("date {0} is outside the range PostgreSQL can store")]
    DateOutOfRange(String),
    #[error("fixture input is not valid: {0}")]
    Fixture(String),
}

/// Eagerly connect to PostgreSQL.
///
/// The acquire timeout bounds pool-level connection attempts. The binary adds
/// an outer startup timeout so DNS and connector behavior are bounded too.
pub async fn connect(config: &DatabaseConfig) -> Result<Pool, DbError> {
    let inner = PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(DATABASE_ACQUIRE_TIMEOUT)
        .connect_with(config.0.clone())
        .await?;

    Ok(Pool {
        inner,
        migrations_applied: Arc::new(AtomicBool::new(false)),
    })
}

/// Apply pending migrations from `server/migrations`.
pub async fn migrate(pool: &Pool) -> Result<(), DbError> {
    pool.migrations_applied.store(false, Ordering::Release);
    sqlx::migrate!("../../migrations").run(&pool.inner).await?;
    pool.migrations_applied.store(true, Ordering::Release);
    Ok(())
}

/// Database readiness: migrations completed in this process and DB reachable.
pub async fn ping(pool: &Pool) -> Result<(), DbError> {
    if !pool.migrations_applied.load(Ordering::Acquire) {
        return Err(DbError::MigrationsNotApplied);
    }

    sqlx::query("SELECT 1").execute(&pool.inner).await?;
    Ok(())
}
