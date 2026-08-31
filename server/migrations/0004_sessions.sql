-- Database-backed sessions for the internal contour (ARCHITECTURE.md §4.2,
-- slice W1.6). The browser only ever holds the opaque 32-byte session id, hex
-- encoded, in the `np_session` cookie (HttpOnly, Secure, SameSite=Lax); every
-- authorization decision is made from this table, never from cookie content.
--
-- Additive-only (AGENTS.md invariant #6): a new table, no change to 0001–0003.

CREATE TABLE sessions (
    -- 32 bytes from the operating-system CSPRNG. Not a UUID: a session id is a
    -- bearer secret, so it is sized for unguessability rather than for sorting.
    id BYTEA PRIMARY KEY CHECK (octet_length(id) = 32),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    -- Double-submit token for mutating requests (ARCHITECTURE.md §6). Stored
    -- per session rather than derived from the session id, so that leaking one
    -- does not yield the other.
    csrf_token BYTEA NOT NULL CHECK (octet_length(csrf_token) = 32)
);

-- Logout-everywhere and role-revocation sweeps.
CREATE INDEX idx_sessions_user ON sessions (user_id);
-- Expiry sweep; also keeps the "delete expired" statement off a seq scan.
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);
