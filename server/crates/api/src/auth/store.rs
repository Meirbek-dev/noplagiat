//! Session persistence - the only SQL the `api` crate owns (ADR-012 §3).
//!
//! Sessions are an HTTP-edge concern (migration `0004_sessions.sql` landed with
//! this slice), and the `db` lane owns no session queries yet. When it next
//! opens, this module moves to `db::sessions` unchanged; nothing outside
//! [`crate::layers::session`] and [`crate::routes::auth`] calls it.
//!
//! Every statement goes through a compile-checked `sqlx::query!` macro
//! (AGENTS.md §5) and binds the session id as bytes, never as text.

use rand::TryRngCore;

/// Length of both the session id and the CSRF token, in bytes. Matches the
/// `octet_length` CHECK constraints of migration 0004.
pub const TOKEN_LEN: usize = 32;

/// A freshly minted session.
#[derive(Debug, Clone)]
pub struct NewSession {
    pub id: [u8; TOKEN_LEN],
    pub csrf_token: [u8; TOKEN_LEN],
}

impl NewSession {
    #[must_use]
    pub fn id_hex(&self) -> String {
        hex::encode(self.id)
    }

    #[must_use]
    pub fn csrf_hex(&self) -> String {
        hex::encode(self.csrf_token)
    }
}

/// A session as stored, once it has been proven live.
#[derive(Debug, Clone)]
pub struct SessionRecord {
    pub user_id: i64,
    pub csrf_token: Vec<u8>,
}

#[derive(Debug, thiserror::Error)]
pub enum SessionError {
    #[error(transparent)]
    Db(#[from] db::DbError),
    #[error("the operating system CSPRNG is unavailable: {0}")]
    Entropy(#[from] rand::rand_core::OsError),
}

impl From<sqlx::Error> for SessionError {
    fn from(error: sqlx::Error) -> Self {
        Self::Db(db::DbError::Sqlx(error))
    }
}

/// `db::Pool` derefs to the `sqlx` pool every query in this module binds
/// against.
fn pg(pool: &db::Pool) -> &sqlx::PgPool {
    pool
}

/// 32 bytes straight from the operating-system CSPRNG.
///
/// Not the thread RNG: a session id is a bearer secret, and a userspace
/// generator's state is one memory disclosure away from being predictable.
fn random_token() -> Result<[u8; TOKEN_LEN], SessionError> {
    let mut buffer = [0_u8; TOKEN_LEN];
    rand::rngs::OsRng.try_fill_bytes(&mut buffer)?;
    Ok(buffer)
}

/// Mint a session for `user_id`, valid for `ttl_seconds`.
pub async fn create(
    pool: &db::Pool,
    user_id: i64,
    ttl_seconds: i64,
) -> Result<NewSession, SessionError> {
    let session = NewSession {
        id: random_token()?,
        csrf_token: random_token()?,
    };
    sqlx::query!(
        "INSERT INTO sessions (id, user_id, expires_at, csrf_token)
         VALUES ($1, $2, now() + ($3::bigint * interval '1 second'), $4)",
        &session.id[..],
        user_id,
        ttl_seconds,
        &session.csrf_token[..],
    )
    .execute(pg(pool))
    .await?;
    Ok(session)
}

/// Load a live session. An expired row is invisible here and swept by
/// [`delete_expired`]; either way it never authenticates a request.
pub async fn load(pool: &db::Pool, id: &[u8]) -> Result<Option<SessionRecord>, SessionError> {
    let row = sqlx::query!(
        "SELECT user_id, csrf_token FROM sessions WHERE id = $1 AND expires_at > now()",
        id,
    )
    .fetch_optional(pg(pool))
    .await?;
    Ok(row.map(|row| SessionRecord {
        user_id: row.user_id,
        csrf_token: row.csrf_token,
    }))
}

/// Destroy one session (logout).
pub async fn delete(pool: &db::Pool, id: &[u8]) -> Result<u64, SessionError> {
    let result = sqlx::query!("DELETE FROM sessions WHERE id = $1", id)
        .execute(pg(pool))
        .await?;
    Ok(result.rows_affected())
}

/// Sweep expired rows. Called opportunistically on login rather than from a
/// timer: sessions expire in hours, logins happen at least as often, and one
/// fewer background task is one fewer thing to get wrong.
pub async fn delete_expired(pool: &db::Pool) -> Result<u64, SessionError> {
    let result = sqlx::query!("DELETE FROM sessions WHERE expires_at <= now()")
        .execute(pg(pool))
        .await?;
    Ok(result.rows_affected())
}
