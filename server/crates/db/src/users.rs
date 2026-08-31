//! Internal-contour users and their role assignments.
//!
//! Identity comes from the portal SSO; an unknown subject becomes an
//! authenticated but role-less user, which is what makes "sees nothing
//! internal" the default (ARCHITECTURE.md §4.2).

use crate::filters::role_label;
use crate::{DbError, Pool};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UserRecord {
    pub id: i64,
    pub sso_subject: String,
    pub email: String,
    pub display_name: String,
    pub active: bool,
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

/// Create or refresh a user from the SSO claims. Idempotent on `sso_subject`.
pub async fn upsert_by_sso_subject(
    pool: &Pool,
    sso_subject: &str,
    email: &str,
    display_name: &str,
) -> Result<UserRecord, DbError> {
    let user = sqlx::query_as!(
        UserRecord,
        "INSERT INTO users (sso_subject, email, display_name)
         VALUES ($1, $2, $3)
         ON CONFLICT (sso_subject) DO UPDATE
             SET email = EXCLUDED.email,
                 display_name = EXCLUDED.display_name
         RETURNING id, sso_subject, email, display_name, active",
        sso_subject,
        email,
        display_name,
    )
    .fetch_one(pool.pg())
    .await?;
    Ok(user)
}

pub async fn by_sso_subject(
    pool: &Pool,
    sso_subject: &str,
) -> Result<Option<UserWithRoles>, DbError> {
    let user = sqlx::query_as!(
        UserRecord,
        "SELECT id, sso_subject, email, display_name, active
           FROM users WHERE sso_subject = $1",
        sso_subject,
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
        "SELECT id, sso_subject, email, display_name, active FROM users WHERE id = $1",
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
        "SELECT id, sso_subject, email, display_name, active
           FROM users ORDER BY sso_subject LIMIT $1 OFFSET $2",
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

pub async fn set_active(pool: &Pool, user_id: i64, active: bool) -> Result<u64, DbError> {
    let result = sqlx::query!(
        "UPDATE users SET active = $2 WHERE id = $1",
        user_id,
        active
    )
    .execute(pool.pg())
    .await?;
    Ok(result.rows_affected())
}
