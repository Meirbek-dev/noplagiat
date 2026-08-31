//! Administrative mutations for the reference tables (TZ §4.6).
//!
//! [`crate::dicts`] reads the dictionaries; this module writes them, together
//! with the three derivation tables `ingest` reads (`staff_units`,
//! `work_type_rules`, `initiator_rules`) and the `ingest_sources` registry.
//!
//! Nothing here touches `checks`, so nothing here takes a [`compliance::Scope`]:
//! there is no fact data to scope (AGENTS.md invariant #3 constrains
//! [`crate::q`], which does). Every statement is a compile-checked
//! `sqlx::query!` macro and every parent is resolved **by code inside SQL**, so
//! an unknown parent inserts nothing rather than guessing an id.
//!
//! **No PII.** `staff_units` stores an HMAC digest and the masked label the
//! caller derived (ADR-008 §2); the plaintext e-mail never reaches this crate.

use sqlx::types::time::OffsetDateTime;

use crate::{DbError, Pool};

/// The RU/KK/EN labels every dictionary row carries.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DictNames<'a> {
    pub name_ru: &'a str,
    pub name_kk: &'a str,
    pub name_en: &'a str,
}

// ── faculties ───────────────────────────────────────────────────────────────

/// Create or relabel a faculty. Idempotent on `code`.
pub async fn upsert_faculty(
    pool: &Pool,
    code: &str,
    names: &DictNames<'_>,
    active: bool,
) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO faculties (code, name_ru, name_kk, name_en, active)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (code) DO UPDATE
             SET name_ru = EXCLUDED.name_ru,
                 name_kk = EXCLUDED.name_kk,
                 name_en = EXCLUDED.name_en,
                 active = EXCLUDED.active
         RETURNING id",
        code,
        names.name_ru,
        names.name_kk,
        names.name_en,
        active,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

/// Delete a faculty. A faculty referenced by a check or a department is
/// protected by the foreign keys of migration 0001 - the delete fails rather
/// than orphaning facts, and the caller reports the conflict.
pub async fn delete_faculty(pool: &Pool, code: &str) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM faculties WHERE code = $1", code)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

// ── departments ─────────────────────────────────────────────────────────────

/// Create or relabel a department under `faculty_code`.
///
/// Returns `None` when the faculty does not exist: the parent is resolved in
/// SQL, so an unknown code inserts nothing.
pub async fn upsert_department(
    pool: &Pool,
    faculty_code: &str,
    code: &str,
    names: &DictNames<'_>,
    active: bool,
) -> Result<Option<i64>, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO departments (faculty_id, code, name_ru, name_kk, name_en, active)
         SELECT f.id, $2, $3, $4, $5, $6 FROM faculties f WHERE f.code = $1
         ON CONFLICT (code) DO UPDATE
             SET faculty_id = EXCLUDED.faculty_id,
                 name_ru = EXCLUDED.name_ru,
                 name_kk = EXCLUDED.name_kk,
                 name_en = EXCLUDED.name_en,
                 active = EXCLUDED.active
         RETURNING id",
        faculty_code,
        code,
        names.name_ru,
        names.name_kk,
        names.name_en,
        active,
    )
    .fetch_optional(pool.pg())
    .await?;
    Ok(id)
}

pub async fn delete_department(pool: &Pool, code: &str) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM departments WHERE code = $1", code)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

// ── programmes ──────────────────────────────────────────────────────────────

/// Create or relabel a programme under `department_code`. `None` when that
/// department does not exist.
pub async fn upsert_program(
    pool: &Pool,
    department_code: &str,
    code: &str,
    names: &DictNames<'_>,
    active: bool,
) -> Result<Option<i64>, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO programs (department_id, code, name_ru, name_kk, name_en, active)
         SELECT d.id, $2, $3, $4, $5, $6 FROM departments d WHERE d.code = $1
         ON CONFLICT (code) DO UPDATE
             SET department_id = EXCLUDED.department_id,
                 name_ru = EXCLUDED.name_ru,
                 name_kk = EXCLUDED.name_kk,
                 name_en = EXCLUDED.name_en,
                 active = EXCLUDED.active
         RETURNING id",
        department_code,
        code,
        names.name_ru,
        names.name_kk,
        names.name_en,
        active,
    )
    .fetch_optional(pool.pg())
    .await?;
    Ok(id)
}

pub async fn delete_program(pool: &Pool, code: &str) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM programs WHERE code = $1", code)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

// ── work types ──────────────────────────────────────────────────────────────

pub async fn upsert_work_type(
    pool: &Pool,
    code: &str,
    names: &DictNames<'_>,
    sort_order: i32,
) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO work_types (code, name_ru, name_kk, name_en, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (code) DO UPDATE
             SET name_ru = EXCLUDED.name_ru,
                 name_kk = EXCLUDED.name_kk,
                 name_en = EXCLUDED.name_en,
                 sort_order = EXCLUDED.sort_order
         RETURNING id",
        code,
        names.name_ru,
        names.name_kk,
        names.name_en,
        sort_order,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

pub async fn delete_work_type(pool: &Pool, code: &str) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM work_types WHERE code = $1", code)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

// ── staff units (ADR-008 §6) ────────────────────────────────────────────────

/// One reviewer → unit mapping, as the admin editor lists it. The digest is
/// hex-encoded for display; the masked label is the only human-readable field
/// and is masked by construction.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StaffUnitRow {
    /// Hex of the 32-byte HMAC digest - an opaque handle, not an address.
    pub email_hmac_hex: String,
    pub faculty_code: String,
    pub department_code: String,
    pub masked_label: String,
    pub updated_at: OffsetDateTime,
}

pub async fn staff_units(
    pool: &Pool,
    limit: i64,
    offset: i64,
) -> Result<Vec<StaffUnitRow>, DbError> {
    let rows = sqlx::query!(
        r#"SELECT encode(s.email_hmac, 'hex') AS "email_hmac_hex!",
                  f.code AS "faculty_code!",
                  d.code AS "department_code!",
                  s.masked_label,
                  s.updated_at
             FROM staff_units s
             JOIN faculties f ON f.id = s.faculty_id
             JOIN departments d ON d.id = s.department_id
            ORDER BY s.masked_label
            LIMIT $1 OFFSET $2"#,
        limit,
        offset,
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows
        .into_iter()
        .map(|row| StaffUnitRow {
            email_hmac_hex: row.email_hmac_hex,
            faculty_code: row.faculty_code,
            department_code: row.department_code,
            masked_label: row.masked_label,
            updated_at: row.updated_at,
        })
        .collect())
}

pub async fn delete_staff_unit(pool: &Pool, email_hmac: &[u8]) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM staff_units WHERE email_hmac = $1", email_hmac)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

// ── derivation rules (ADR-008 §5, §7) ───────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WorkTypeRuleRow {
    pub id: i64,
    /// Substring matched against the normalized (never persisted) title.
    pub pattern: String,
    pub work_type_code: String,
    pub priority: i32,
    pub active: bool,
}

pub async fn work_type_rules(pool: &Pool) -> Result<Vec<WorkTypeRuleRow>, DbError> {
    let rows = sqlx::query_as!(
        WorkTypeRuleRow,
        r#"SELECT r.id, r.pattern, w.code AS "work_type_code!", r.priority, r.active
             FROM work_type_rules r
             JOIN work_types w ON w.id = r.work_type_id
            ORDER BY r.priority, r.id"#
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

/// `None` when `work_type_code` is unknown.
pub async fn insert_work_type_rule(
    pool: &Pool,
    pattern: &str,
    work_type_code: &str,
    priority: i32,
    active: bool,
) -> Result<Option<i64>, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO work_type_rules (pattern, work_type_id, priority, active)
         SELECT $1, w.id, $3, $4 FROM work_types w WHERE w.code = $2
         RETURNING id",
        pattern,
        work_type_code,
        priority,
        active,
    )
    .fetch_optional(pool.pg())
    .await?;
    Ok(id)
}

pub async fn update_work_type_rule(
    pool: &Pool,
    id: i64,
    pattern: &str,
    work_type_code: &str,
    priority: i32,
    active: bool,
) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE work_type_rules r
            SET pattern = $2,
                work_type_id = w.id,
                priority = $4,
                active = $5
           FROM work_types w
          WHERE r.id = $1 AND w.code = $3",
        id,
        pattern,
        work_type_code,
        priority,
        active,
    )
    .execute(pool.pg())
    .await?;
    Ok(result.rows_affected())
}

pub async fn delete_work_type_rule(pool: &Pool, id: i64) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM work_type_rules WHERE id = $1", id)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InitiatorRuleRow {
    pub id: i64,
    /// Regular expression matched against the normalized reviewer e-mail.
    pub pattern: String,
    pub initiator: String,
    pub priority: i32,
    pub active: bool,
}

pub async fn initiator_rules(pool: &Pool) -> Result<Vec<InitiatorRuleRow>, DbError> {
    let rows = sqlx::query_as!(
        InitiatorRuleRow,
        r#"SELECT id, pattern, initiator::text AS "initiator!", priority, active
             FROM initiator_rules
            ORDER BY priority, id"#
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

pub async fn insert_initiator_rule(
    pool: &Pool,
    pattern: &str,
    initiator: domain::InitiatorRole,
    priority: i32,
    active: bool,
) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO initiator_rules (pattern, initiator, priority, active)
         VALUES ($1, $2::text::initiator_role, $3, $4)
         RETURNING id",
        pattern,
        crate::filters::initiator_label(initiator),
        priority,
        active,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

pub async fn update_initiator_rule(
    pool: &Pool,
    id: i64,
    pattern: &str,
    initiator: domain::InitiatorRole,
    priority: i32,
    active: bool,
) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE initiator_rules
            SET pattern = $2, initiator = $3::text::initiator_role, priority = $4, active = $5
          WHERE id = $1",
        id,
        pattern,
        crate::filters::initiator_label(initiator),
        priority,
        active,
    )
    .execute(pool.pg())
    .await?;
    Ok(result.rows_affected())
}

pub async fn delete_initiator_rule(pool: &Pool, id: i64) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM initiator_rules WHERE id = $1", id)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}

// ── ingest sources ──────────────────────────────────────────────────────────

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SourceRow {
    pub id: i64,
    /// `api` or `csv` - the CHECK constraint of migration 0002.
    pub kind: String,
    /// Base URL for an API source, watched directory for a CSV one.
    pub base_url: Option<String>,
    pub schedule: Option<String>,
    pub enabled: bool,
    /// Opaque pull cursor. Never edited through the admin API - it is ingest
    /// bookkeeping, and rewriting it by hand would re-read or skip a window.
    pub cursor: Option<serde_json::Value>,
}

pub async fn sources(pool: &Pool) -> Result<Vec<SourceRow>, DbError> {
    let rows = sqlx::query_as!(
        SourceRow,
        "SELECT id, kind, base_url, schedule, enabled, cursor
           FROM ingest_sources ORDER BY id"
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

pub async fn insert_source(
    pool: &Pool,
    kind: &str,
    base_url: Option<&str>,
    schedule: Option<&str>,
    enabled: bool,
) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO ingest_sources (kind, base_url, schedule, enabled)
         VALUES ($1, $2, $3, $4) RETURNING id",
        kind,
        base_url,
        schedule,
        enabled,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

pub async fn update_source(
    pool: &Pool,
    id: i64,
    base_url: Option<&str>,
    schedule: Option<&str>,
    enabled: bool,
) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE ingest_sources SET base_url = $2, schedule = $3, enabled = $4 WHERE id = $1",
        id,
        base_url,
        schedule,
        enabled,
    )
    .execute(pool.pg())
    .await?;
    Ok(result.rows_affected())
}

pub async fn delete_source(pool: &Pool, id: i64) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM ingest_sources WHERE id = $1", id)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}
