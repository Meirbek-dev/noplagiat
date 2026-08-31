//! Runtime-editable configuration (`settings`), typed on the way out.
//!
//! Every default pinned by ADR-008 is stored here rather than compiled in, so
//! Комплаенс can change a rule without a redeploy. A malformed value is an
//! error, never a fallback to the default: a suppression threshold or status
//! ladder must not weaken because an administrator typed `"5"` instead of `5`.

use compliance::KPolicy;
use domain::{BucketBoundaries, OriginalityPct, SemesterBoundaries, StatusRules};
use serde::de::DeserializeOwned;

use crate::{DbError, Pool};

pub const K_THRESHOLD: &str = "k_threshold";
pub const ORIGINALITY_THRESHOLD: &str = "originality_threshold";
pub const HISTOGRAM_BUCKETS: &str = "histogram_buckets";
pub const SEMESTER_BOUNDARIES: &str = "semester_boundaries";
pub const STATUS_RULES: &str = "status_rules";
pub const EXCLUDE_DELETED: &str = "exclude_deleted";
pub const PUBLIC_SNAPSHOT_QUARTER: &str = "public_snapshot_quarter";

/// One setting as stored, for the admin editor.
#[derive(Debug, Clone)]
pub struct SettingRow {
    pub key: String,
    pub value: serde_json::Value,
    pub updated_at: sqlx::types::time::OffsetDateTime,
    pub updated_by: Option<String>,
}

/// Raw JSON of one setting, or `None` when the key was never written.
pub async fn get(pool: &Pool, key: &str) -> Result<Option<serde_json::Value>, DbError> {
    let value = sqlx::query_scalar!("SELECT value FROM settings WHERE key = $1", key)
        .fetch_optional(pool.pg())
        .await?;
    Ok(value)
}

/// Every setting, for the admin screen.
pub async fn list(pool: &Pool) -> Result<Vec<SettingRow>, DbError> {
    let rows = sqlx::query!("SELECT key, value, updated_at, updated_by FROM settings ORDER BY key")
        .fetch_all(pool.pg())
        .await?;
    Ok(rows
        .into_iter()
        .map(|row| SettingRow {
            key: row.key,
            value: row.value,
            updated_at: row.updated_at,
            updated_by: row.updated_by,
        })
        .collect())
}

/// Write a setting, recording who changed it (TZ §4.6 / §6.3).
pub async fn set(
    pool: &Pool,
    key: &str,
    value: &serde_json::Value,
    updated_by: Option<&str>,
) -> Result<(), DbError> {
    sqlx::query!(
        "INSERT INTO settings (key, value, updated_at, updated_by)
         VALUES ($1, $2, now(), $3)
         ON CONFLICT (key) DO UPDATE
             SET value = EXCLUDED.value,
                 updated_at = now(),
                 updated_by = EXCLUDED.updated_by",
        key,
        value,
        updated_by,
    )
    .execute(pool.pg())
    .await?;
    Ok(())
}

/// Active k-anonymity policy (TZ §6.2). The `api` layer caches this for 60 s.
pub async fn k_threshold(pool: &Pool) -> Result<KPolicy, DbError> {
    let value = required(pool, K_THRESHOLD).await?;
    KPolicy::from_settings(&value).map_err(|error| DbError::InvalidSetting {
        key: K_THRESHOLD,
        message: error.to_string(),
    })
}

/// Originality below this counts as «ниже порога» (ADR-008 §4, §9).
pub async fn originality_threshold(pool: &Pool) -> Result<OriginalityPct, DbError> {
    let value = required(pool, ORIGINALITY_THRESHOLD).await?;
    let percent = value.as_f64().ok_or_else(|| DbError::InvalidSetting {
        key: ORIGINALITY_THRESHOLD,
        message: "expected a JSON number of percent".into(),
    })?;
    let hundredths = (percent * 100.0).round();
    if !(0.0..=10_000.0).contains(&hundredths) {
        return Err(DbError::InvalidSetting {
            key: ORIGINALITY_THRESHOLD,
            message: "must be between 0 and 100 percent".into(),
        });
    }
    #[expect(
        clippy::cast_possible_truncation,
        clippy::cast_sign_loss,
        reason = "the range check above bounds the value to 0..=10_000"
    )]
    let hundredths = hundredths as u16;
    OriginalityPct::from_hundredths(hundredths).map_err(|error| DbError::InvalidSetting {
        key: ORIGINALITY_THRESHOLD,
        message: error.to_string(),
    })
}

/// Histogram band edges (ADR-008 §8, default `[50, 70, 85, 95]`).
pub async fn histogram_buckets(pool: &Pool) -> Result<BucketBoundaries, DbError> {
    typed(pool, HISTOGRAM_BUCKETS).await
}

/// Semester boundaries (ADR-008 §8, default autumn 09-01 / spring 02-01).
pub async fn semester_boundaries(pool: &Pool) -> Result<SemesterBoundaries, DbError> {
    typed(pool, SEMESTER_BOUNDARIES).await
}

/// The admin-editable status ladder (ADR-008 §4).
pub async fn status_rules(pool: &Pool) -> Result<StatusRules, DbError> {
    typed(pool, STATUS_RULES).await
}

/// Whether «Удален» rows are excluded from metrics (ADR-008 §4, default true).
///
/// Since migration 0003 this is a query-time predicate over the `deleted`
/// dimension of `agg_monthly`, so flipping it takes effect on the next request
/// rather than on the next aggregate rebuild.
pub async fn exclude_deleted(pool: &Pool) -> Result<bool, DbError> {
    typed(pool, EXCLUDE_DELETED).await
}

/// Which quarter the public snapshot is published for (`"auto"` by default).
pub async fn public_snapshot_quarter(pool: &Pool) -> Result<String, DbError> {
    typed(pool, PUBLIC_SNAPSHOT_QUARTER).await
}

async fn required(pool: &Pool, key: &'static str) -> Result<serde_json::Value, DbError> {
    get(pool, key).await?.ok_or(DbError::MissingSetting { key })
}

async fn typed<T: DeserializeOwned>(pool: &Pool, key: &'static str) -> Result<T, DbError> {
    let value = required(pool, key).await?;
    serde_json::from_value(value).map_err(|error| DbError::InvalidSetting {
        key,
        message: error.to_string(),
    })
}
