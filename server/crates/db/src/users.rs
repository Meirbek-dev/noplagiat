//! Internal-contour users and their role assignments.
//!
//! Identity is local (ADR-017): an account exists because an operator ran the
//! `manage-users` CLI on the server host. There is no self-service
//! registration, so "unknown login name" and "no password set" are both simply
//! *no session*, and "sees nothing internal" stays the default for any account
//! that holds no grant (ARCHITECTURE.md §4.2).

use crate::filters::role_label;
use crate::{DbError, Pool};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UserRecord {
    pub id: i64,
    /// Login name. Unique case-insensitively; every lookup lowercases both
    /// sides, so `Admin` and `admin` are the same account and cannot both
    /// exist.
    pub username: String,
    pub email: String,
    pub display_name: String,
    pub active: bool,
}

/// A user together with the stored password verifier.
///
/// Separate from [`UserRecord`] so that the hash is only ever loaded by the one
/// caller that verifies against it. Nothing that renders a user - the admin
/// listing, `/api/auth/me`, the audit layer - can carry it by accident.
#[derive(Debug, Clone)]
pub struct Credentials {
    pub user: UserRecord,
    /// Argon2id PHC string, or `None` for an account with no password set.
    /// `None` never verifies (ADR-017 §4).
    pub password_hash: Option<String>,
}

/// One `(role, scope)` grant. A NULL scope means the whole university; the
/// `api` layer collapses a user's grants into a single [`compliance::Scope`].
///
/// The dictionary **codes** ride along beside the ids. The admin roles screen
/// has to say *which* faculty a dean governs, and resolving an id to a code
/// costs one LEFT JOIN here against one dictionary round trip per row in the
/// browser. Localized names deliberately do not: the code is the key the admin
/// UI already holds the trilingual dictionary for, and picking a locale in this
/// layer would be the wrong place to do it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RoleAssignment {
    pub role: String,
    pub scope_faculty_id: Option<i64>,
    pub scope_department_id: Option<i64>,
    pub scope_faculty_code: Option<String>,
    pub scope_department_code: Option<String>,
}

/// A user together with everything the session layer needs.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UserWithRoles {
    pub user: UserRecord,
    pub roles: Vec<RoleAssignment>,
}

/// Create an account. Fails rather than upserting: a repeated `create-user` is
/// an operator mistake, and silently rewriting an existing account's e-mail and
/// password is the wrong recovery from it - `set-password` is.
///
/// `password_hash` is `None` for an account that cannot sign in yet.
pub async fn create(
    pool: &Pool,
    username: &str,
    email: &str,
    display_name: &str,
    password_hash: Option<&str>,
) -> Result<UserRecord, DbError> {
    let user = sqlx::query_as!(
        UserRecord,
        r#"INSERT INTO users (username, email, display_name, password_hash)
           VALUES ($1, $2, $3, $4)
           RETURNING id, username, email, display_name, active"#,
        username,
        email,
        display_name,
        password_hash,
    )
    .fetch_one(pool.pg())
    .await
    .map_err(|error| match &error {
        sqlx::Error::Database(cause) if cause.is_unique_violation() => {
            DbError::UsernameTaken(username.to_owned())
        }
        _ => DbError::Sqlx(error),
    })?;
    Ok(user)
}

/// The stored verifier for one login name, matched case-insensitively.
///
/// Returns the row even when it is inactive or has no password: refusing those
/// two cases is the caller's job, and doing it there keeps every failed sign-in
/// on one code path - and therefore one response - with an unknown name
/// (ADR-017 §4).
pub async fn credentials_by_username(
    pool: &Pool,
    username: &str,
) -> Result<Option<Credentials>, DbError> {
    let row = sqlx::query!(
        r#"SELECT id, username, email, display_name, active, password_hash
             FROM users WHERE lower(username) = lower($1)"#,
        username,
    )
    .fetch_optional(pool.pg())
    .await?;
    Ok(row.map(|row| Credentials {
        user: UserRecord {
            id: row.id,
            username: row.username,
            email: row.email,
            display_name: row.display_name,
            active: row.active,
        },
        password_hash: row.password_hash,
    }))
}

pub async fn by_username(pool: &Pool, username: &str) -> Result<Option<UserWithRoles>, DbError> {
    let user = sqlx::query_as!(
        UserRecord,
        r#"SELECT id, username, email, display_name, active
             FROM users WHERE lower(username) = lower($1)"#,
        username,
    )
    .fetch_optional(pool.pg())
    .await?;

    let Some(user) = user else {
        return Ok(None);
    };
    let roles = roles(pool, user.id).await?;
    Ok(Some(UserWithRoles { user, roles }))
}

pub async fn by_id(pool: &Pool, id: i64) -> Result<Option<UserWithRoles>, DbError> {
    let user = sqlx::query_as!(
        UserRecord,
        r#"SELECT id, username, email, display_name, active
             FROM users WHERE id = $1"#,
        id,
    )
    .fetch_optional(pool.pg())
    .await?;

    let Some(user) = user else {
        return Ok(None);
    };
    let roles = roles(pool, user.id).await?;
    Ok(Some(UserWithRoles { user, roles }))
}

/// Every account with its grants, for the admin roles screen (TZ §4.6).
///
/// Paginated because it is an administrative listing, not a request-path read.
pub async fn list(pool: &Pool, limit: i64, offset: i64) -> Result<Vec<UserWithRoles>, DbError> {
    let users = sqlx::query_as!(
        UserRecord,
        r#"SELECT id, username, email, display_name, active
             FROM users ORDER BY lower(username) LIMIT $1 OFFSET $2"#,
        limit,
        offset,
    )
    .fetch_all(pool.pg())
    .await?;

    let mut out = Vec::with_capacity(users.len());
    for user in users {
        let roles = roles(pool, user.id).await?;
        out.push(UserWithRoles { user, roles });
    }
    Ok(out)
}

pub async fn roles(pool: &Pool, user_id: i64) -> Result<Vec<RoleAssignment>, DbError> {
    let rows = sqlx::query_as!(
        RoleAssignment,
        r#"SELECT ur.role::text AS "role!",
                  ur.scope_faculty_id,
                  ur.scope_department_id,
                  f.code AS "scope_faculty_code?",
                  d.code AS "scope_department_code?"
             FROM user_roles ur
             LEFT JOIN faculties f ON f.id = ur.scope_faculty_id
             LEFT JOIN departments d ON d.id = ur.scope_department_id
            WHERE ur.user_id = $1
            ORDER BY ur.role,
                     ur.scope_faculty_id NULLS FIRST,
                     ur.scope_department_id NULLS FIRST"#,
        user_id,
    )
    .fetch_all(pool.pg())
    .await?;
    Ok(rows)
}

/// Grant a role, optionally scoped to a faculty or a department. Idempotent -
/// the `UNIQUE NULLS NOT DISTINCT` key of migration 0001 makes a repeat grant a
/// no-op rather than a duplicate row.
pub async fn add_role(
    pool: &Pool,
    user_id: i64,
    role: domain::RoleKind,
    scope_faculty_id: Option<i64>,
    scope_department_id: Option<i64>,
) -> Result<(), DbError> {
    sqlx::query!(
        "INSERT INTO user_roles (user_id, role, scope_faculty_id, scope_department_id)
         VALUES ($1, $2::text::role_kind, $3, $4)
         ON CONFLICT DO NOTHING",
        user_id,
        role_label(role),
        scope_faculty_id,
        scope_department_id,
    )
    .execute(pool.pg())
    .await?;
    Ok(())
}

/// Revoke exactly one grant. `IS NOT DISTINCT FROM` so a NULL scope matches the
/// unscoped grant rather than matching nothing.
pub async fn remove_role(
    pool: &Pool,
    user_id: i64,
    role: domain::RoleKind,
    scope_faculty_id: Option<i64>,
    scope_department_id: Option<i64>,
) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "DELETE FROM user_roles
          WHERE user_id = $1
            AND role = $2::text::role_kind
            AND scope_faculty_id IS NOT DISTINCT FROM $3
            AND scope_department_id IS NOT DISTINCT FROM $4",
        user_id,
        role_label(role),
        scope_faculty_id,
        scope_department_id,
    )
    .execute(pool.pg())
    .await?;
    Ok(result.rows_affected())
}

/// Replace the stored verifier. `None` withdraws the ability to sign in without
/// touching the account's grants or its audit history.
///
/// Every live session of the user is destroyed with it: a password change that
/// leaves the old cookie working is not a password change (ADR-017 §4).
pub async fn set_password(
    pool: &Pool,
    user_id: i64,
    password_hash: Option<&str>,
) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE users SET password_hash = $2 WHERE id = $1",
        user_id,
        password_hash,
    )
    .execute(pool.pg())
    .await?;
    delete_sessions(pool, user_id).await?;
    Ok(result.rows_affected())
}

/// Deactivate or reactivate an account. The session layer refuses a
/// deactivated user on its next request anyway; dropping the rows here makes it
/// immediate rather than one request late.
pub async fn set_active(pool: &Pool, user_id: i64, active: bool) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE users SET active = $2 WHERE id = $1",
        user_id,
        active
    )
    .execute(pool.pg())
    .await?;
    if !active {
        delete_sessions(pool, user_id).await?;
    }
    Ok(result.rows_affected())
}

/// Sign one account out everywhere.
pub async fn delete_sessions(pool: &Pool, user_id: i64) -> Result<u64, DbError> {
    let result = sqlx::query!("DELETE FROM sessions WHERE user_id = $1", user_id)
        .execute(pool.pg())
        .await?;
    Ok(result.rows_affected())
}
