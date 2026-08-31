-- Local password accounts for the internal contour (ADR-017), replacing the
-- portal OIDC flow of ADR-014.
--
-- Accounts are created by the `manage-users` CLI on the server host. There is
-- no self-service registration, no identity provider, and no group claim: the
-- operator who can run a binary next to the database is the operator TZ §5
-- already trusts to assign roles.
--
-- Expand phase only (AGENTS.md invariant #6). `sso_subject` keeps every row it
-- has and keeps its unique constraint; it merely stops being NOT NULL, so an
-- account created by the CLI can omit it. Dropping the column is the contract
-- phase, and a separate change once no deployment holds SSO-era rows.

ALTER TABLE users ADD COLUMN username TEXT;

-- Backfill: an account that arrived through SSO keeps the subject it already
-- had as its login name, so an operator sets a password on the existing row
-- rather than recreating it and re-granting its roles.
UPDATE users SET username = sso_subject WHERE username IS NULL;

ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Case-insensitive uniqueness: `Admin` and `admin` must never be two accounts.
-- `db::users::by_username` matches on `lower(username)` too, so this index is
-- also the one the sign-in lookup rides on.
CREATE UNIQUE INDEX users_username_lower_key ON users (lower(username));

-- Argon2id PHC string (`$argon2id$v=19$m=...`), never a bare digest: the
-- parameters travel with the hash, so raising them later leaves existing
-- accounts verifiable.
--
-- NULL means «no password set». The account exists and may hold grants, but
-- nothing verifies against it, so it cannot sign in - which is what every row
-- backfilled above starts as.
ALTER TABLE users ADD COLUMN password_hash TEXT;

ALTER TABLE users ALTER COLUMN sso_subject DROP NOT NULL;
