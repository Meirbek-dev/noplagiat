//! Dictionaries (faculties, departments, programmes, work types) and the
//! source-label aliases that map a vendor string onto them (ADR-008 §6, §7).
//!
//! These tables hold no check data - only reference rows and their RU/KK/EN
//! labels - so the functions here take no [`compliance::Scope`]: there is
//! nothing here to scope. Everything that reads a *fact* lives in [`crate::q`]
//! and does take one (AGENTS.md invariant #3).

use std::collections::HashMap;

use crate::{DbError, Pool};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Faculty {
    pub id: i64,
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    pub active: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Department {
    pub id: i64,
    pub faculty_id: i64,
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    pub active: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Program {
    pub id: i64,
    pub department_id: i64,
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    pub active: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WorkType {
    pub id: i64,
    pub code: String,
    pub name_ru: String,
    pub name_kk: String,
    pub name_en: String,
    pub sort_order: i32,
}

/// The four dictionary kinds `dict_aliases` can point at.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AliasKind {
    Faculty,
    Department,
    Program,
    WorkType,
}

impl AliasKind {
    /// The `dict_aliases.kind` CHECK-constraint value.
    #[must_use]
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Faculty => "faculty",
            Self::Department => "department",
            Self::Program => "program",
            Self::WorkType => "work_type",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DictAlias {
    pub id: i64,
    pub kind: String,
    pub source_label: String,
    pub target_id: i64,
}

pub async fn faculties(pool: &Pool) -> Result<Vec<Faculty>, DbError> {
    let rows = sqlx::query_as!(
        Faculty,
        "SELECT id, code, name_ru, name_kk, name_en, active FROM faculties ORDER BY code"
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

pub async fn departments(pool: &Pool) -> Result<Vec<Department>, DbError> {
    let rows = sqlx::query_as!(
        Department,
        "SELECT id, faculty_id, code, name_ru, name_kk, name_en, active
         FROM departments ORDER BY code"
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

pub async fn programs(pool: &Pool) -> Result<Vec<Program>, DbError> {
    let rows = sqlx::query_as!(
        Program,
        "SELECT id, department_id, code, name_ru, name_kk, name_en, active
         FROM programs ORDER BY code"
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

pub async fn work_types(pool: &Pool) -> Result<Vec<WorkType>, DbError> {
    let rows = sqlx::query_as!(
        WorkType,
        "SELECT id, code, name_ru, name_kk, name_en, sort_order
         FROM work_types ORDER BY sort_order, code"
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

/// `code → id` for every faculty. Ingest resolves labels through
/// [`aliases`] first and falls back to these codes.
pub async fn faculty_ids(pool: &Pool) -> Result<HashMap<String, i64>, DbError> {
    let rows = sqlx::query!("SELECT code, id FROM faculties")
        .fetch_all(pool.pg())
        .await?;
    Ok(rows.into_iter().map(|row| (row.code, row.id)).collect())
}

pub async fn department_ids(pool: &Pool) -> Result<HashMap<String, i64>, DbError> {
    let rows = sqlx::query!("SELECT code, id FROM departments")
        .fetch_all(pool.pg())
        .await?;
    Ok(rows.into_iter().map(|row| (row.code, row.id)).collect())
}

pub async fn program_ids(pool: &Pool) -> Result<HashMap<String, i64>, DbError> {
    let rows = sqlx::query!("SELECT code, id FROM programs")
        .fetch_all(pool.pg())
        .await?;
    Ok(rows.into_iter().map(|row| (row.code, row.id)).collect())
}

pub async fn work_type_ids(pool: &Pool) -> Result<HashMap<String, i64>, DbError> {
    let rows = sqlx::query!("SELECT code, id FROM work_types")
        .fetch_all(pool.pg())
        .await?;
    Ok(rows.into_iter().map(|row| (row.code, row.id)).collect())
}

pub async fn aliases(pool: &Pool, kind: AliasKind) -> Result<Vec<DictAlias>, DbError> {
    let rows = sqlx::query_as!(
        DictAlias,
        "SELECT id, kind, source_label, target_id
         FROM dict_aliases WHERE kind = $1 ORDER BY source_label",
        kind.as_str(),
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

/// Create or repoint one alias. Idempotent on `(kind, source_label)`.
pub async fn upsert_alias(
    pool: &Pool,
    kind: AliasKind,
    source_label: &str,
    target_id: i64,
) -> Result<i64, DbError> {
    let id = sqlx::query_scalar!(
        "INSERT INTO dict_aliases (kind, source_label, target_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (kind, source_label) DO UPDATE SET target_id = EXCLUDED.target_id
         RETURNING id",
        kind.as_str(),
        source_label,
        target_id,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(id)
}

pub async fn delete_alias(pool: &Pool, id: i64) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM dict_aliases WHERE id = $1", id)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}
