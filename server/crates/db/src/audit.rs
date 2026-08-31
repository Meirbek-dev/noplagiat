//! Access log (TZ §6.3, AGENTS.md invariant #4).
//!
//! **Append-only.** This module exposes exactly one write, [`append`]. There is
//! no update and no delete path, and there must never be one: migration 0001
//! additionally installs a trigger that raises on UPDATE or DELETE, so the
//! guarantee survives a mistake here.

use sqlx::types::time::OffsetDateTime;

use crate::filters::role_label;
use crate::{DbError, Pool};

/// One access event, as written by the `api` audit layer.
#[derive(Debug, Clone)]
pub struct NewAuditEntry<'a> {
    pub user_id: i64,
    pub role: domain::RoleKind,
    /// `view` | `export_pdf` | `export_xlsx` | `admin_change`.
    pub action: &'a str,
    /// Dashboard section or admin area.
    pub section: &'a str,
    /// Normalized filter state - the serialized form of [`domain::Filters`].
    pub filters: &'a serde_json::Value,
    /// Client address in textual form. `INET` is bound as text because the
    /// driver's network types are not compiled in; PostgreSQL still validates
    /// and stores it as `inet`.
    pub ip: Option<&'a str>,
}

#[derive(Debug, Clone)]
pub struct AuditRow {
    pub id: i64,
    pub occurred_at: OffsetDateTime,
    pub user_id: i64,
    pub role: String,
    pub action: String,
    pub section: String,
    pub filters: serde_json::Value,
    pub ip: Option<String>,
}

/// Filter for the admin audit browser. Every field is optional and they
/// compose; `None` means "any".
#[derive(Debug, Clone, Copy, Default)]
pub struct AuditFilter<'a> {
    pub user_id: Option<i64>,
    pub role: Option<domain::RoleKind>,
    pub action: Option<&'a str>,
    pub section: Option<&'a str>,
    pub from: Option<OffsetDateTime>,
    pub to: Option<OffsetDateTime>,
}

#[derive(Debug, Clone)]
pub struct AuditPage {
    pub rows: Vec<AuditRow>,
    pub total: i64,
}

/// Append one access event. The only write path in this module.
pub async fn append(pool: &Pool, entry: &NewAuditEntry<'_>) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO audit_log (user_id, role, action, section, filters, ip)
         VALUES ($1, $2::text::role_kind, $3, $4, $5, $6::text::inet)
         RETURNING id",
        entry.user_id,
        role_label(entry.role),
        entry.action,
        entry.section,
        entry.filters,
        entry.ip,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

/// Paginated, filtered read for the admin browser (TZ §4.6).
///
/// The filter parameters follow the same NULL-tolerant shape as the RBAC scope
/// predicate: an unset field binds NULL and the predicate short-circuits, so
/// there is no SQL string composition anywhere on this path.
pub async fn list(
    pool: &Pool,
    filter: &AuditFilter<'_>,
    limit: i64,
    offset: i64,
) -> Result<AuditPage, DbError> {
    let role = filter.role.map(role_label);

    let rows = sqlx::query_as!(
        AuditRow,
        r#"SELECT id,
                  occurred_at,
                  user_id,
                  role::text AS "role!",
                  action,
                  section,
                  filters,
                  host(ip) AS ip
             FROM audit_log
            WHERE ($1::bigint IS NULL OR user_id = $1)
              AND ($2::text IS NULL OR role::text = $2)
              AND ($3::text IS NULL OR action = $3)
              AND ($4::text IS NULL OR section = $4)
              AND ($5::timestamptz IS NULL OR occurred_at >= $5)
              AND ($6::timestamptz IS NULL OR occurred_at < $6)
            ORDER BY occurred_at DESC, id DESC
            LIMIT $7 OFFSET $8"#,
        filter.user_id,
        role,
        filter.action,
        filter.section,
        filter.from,
        filter.to,
        limit,
        offset,
    )
    .fetch_all(pool.pg())
    .await?;

    let total = sqlx::query_scalar!(
        "SELECT count(*)
           FROM audit_log
          WHERE ($1::bigint IS NULL OR user_id = $1)
            AND ($2::text IS NULL OR role::text = $2)
            AND ($3::text IS NULL OR action = $3)
            AND ($4::text IS NULL OR section = $4)
            AND ($5::timestamptz IS NULL OR occurred_at >= $5)
            AND ($6::timestamptz IS NULL OR occurred_at < $6)",
        filter.user_id,
        role,
        filter.action,
        filter.section,
        filter.from,
        filter.to,
    )
    .fetch_one(pool.pg())
    .await?;

    Ok(AuditPage {
        rows,
        total: total.unwrap_or_default(),
    })
}
