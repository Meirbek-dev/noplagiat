-- Migration 0002 - source-reality schema (PLAN §1 + W1.1, ADR-008).
--
-- Append-only: migration 0001 is never edited (AGENTS.md invariant #6). Every
-- step below is additive; the single DROP is the `agg_monthly` materialized
-- view, which holds no facts of its own (it is a pure projection of `checks`
-- and is rebuilt in the same transaction) - no fact row is destroyed.
--
-- Invariant #1 still holds: `work_ref`/`reviewer_ref` are HMAC-SHA256 digests
-- computed inside the ingest parser with a server-side pepper that never
-- reaches this database (ADR-008 §2). No column here can hold a name, an
-- e-mail, a document title or document text.

-- ── Facts: columns the legacy export actually carries ───────────────────────
ALTER TABLE checks
    ADD COLUMN work_ref BYTEA,
    ADD COLUMN reviewer_ref BYTEA,
    ADD COLUMN self_citation_pct NUMERIC(5, 2),
    ADD COLUMN citation_pct NUMERIC(5, 2),
    ADD COLUMN match_pct NUMERIC(5, 2),
    ADD COLUMN ai_content_pct NUMERIC(5, 2),
    ADD COLUMN suspicious BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN suspicion_cleared BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Refs are nullable: API-mode rows (W1.0 contract) supply `attempt_no` and the
-- unit natively and need no derived keys. When present they are exactly the
-- 32 bytes of an HMAC-SHA256 digest - a shorter value would mean a truncated
-- or non-digest write.
ALTER TABLE checks
    ADD CONSTRAINT checks_work_ref_len CHECK (work_ref IS NULL OR octet_length(work_ref) = 32),
    ADD CONSTRAINT checks_reviewer_ref_len CHECK (reviewer_ref IS NULL OR octet_length(reviewer_ref) = 32),
    ADD CONSTRAINT checks_self_citation_pct_range
        CHECK (self_citation_pct IS NULL OR (self_citation_pct >= 0 AND self_citation_pct <= 100)),
    ADD CONSTRAINT checks_citation_pct_range
        CHECK (citation_pct IS NULL OR (citation_pct >= 0 AND citation_pct <= 100)),
    ADD CONSTRAINT checks_match_pct_range
        CHECK (match_pct IS NULL OR (match_pct >= 0 AND match_pct <= 100)),
    ADD CONSTRAINT checks_ai_content_pct_range
        CHECK (ai_content_pct IS NULL OR (ai_content_pct >= 0 AND ai_content_pct <= 100));

CREATE INDEX idx_checks_work_ref_time ON checks (work_ref, checked_at) WHERE work_ref IS NOT NULL;
CREATE INDEX idx_checks_reviewer_ref_time ON checks (reviewer_ref, checked_at) WHERE reviewer_ref IS NOT NULL;
-- Deleted rows are a small minority (272 of 5 429 in AY 2024/25) and are read
-- only by the ingest report, so a partial index keeps it tiny.
CREATE INDEX idx_checks_deleted ON checks (id) WHERE deleted;

-- ── Sentinel dictionary rows ────────────────────────────────────────────────
-- Pre-2025/26 checks are structurally unattributable to a unit (PLAN §1.2) and
-- the legacy export carries no work type (§1.1). These sentinels keep the
-- NOT NULL foreign keys on `checks` total, so scope filtering never has to
-- special-case NULL. `ON CONFLICT DO NOTHING` because the fixture dictionaries
-- may already have inserted them.
INSERT INTO faculties (code, name_ru, name_kk, name_en)
VALUES ('UNASSIGNED', 'Не распределено', 'Бөлінбеген', 'Unassigned')
ON CONFLICT (code) DO NOTHING;

INSERT INTO departments (faculty_id, code, name_ru, name_kk, name_en)
SELECT id, 'UNASSIGNED', 'Не распределено', 'Бөлінбеген', 'Unassigned'
FROM faculties
WHERE code = 'UNASSIGNED'
ON CONFLICT (code) DO NOTHING;

INSERT INTO work_types (code, name_ru, name_kk, name_en, sort_order)
VALUES ('other', 'Иное', 'Өзге', 'Other', 900)
ON CONFLICT (code) DO NOTHING;

-- ── Unit attribution (ADR-008 §6) ───────────────────────────────────────────
-- The digest of a reviewer e-mail maps to a unit. `masked_label` is the only
-- human-readable field and is masked by construction (ADR-008 §2:
-- `z***v.vn@teachers.tou.edu.kz`) so an administrator can maintain the mapping
-- without the warehouse holding a staff directory.
CREATE TABLE staff_units (
    email_hmac BYTEA PRIMARY KEY CHECK (octet_length(email_hmac) = 32),
    faculty_id BIGINT NOT NULL REFERENCES faculties(id),
    department_id BIGINT NOT NULL REFERENCES departments(id),
    masked_label TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_units_unit ON staff_units (faculty_id, department_id);

-- ── Derivation rule tables (ADR-008 §5, §7) ─────────────────────────────────
-- Matched against never-persisted strings during parsing; lowest `priority`
-- wins, inactive rows are skipped.
CREATE TABLE work_type_rules (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pattern TEXT NOT NULL,
    work_type_id BIGINT NOT NULL REFERENCES work_types(id),
    priority INT NOT NULL DEFAULT 100,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_work_type_rules_priority ON work_type_rules (priority, id) WHERE active;

CREATE TABLE initiator_rules (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pattern TEXT NOT NULL,
    initiator initiator_role NOT NULL,
    priority INT NOT NULL DEFAULT 100,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_initiator_rules_priority ON initiator_rules (priority, id) WHERE active;

-- ── Ingest sources and control totals ───────────────────────────────────────
CREATE TABLE ingest_sources (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('api', 'csv')),
    base_url TEXT,
    schedule TEXT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    -- Opaque pull cursor; for the W1.0 contract: {"checked_at":…,"check_id":…}
    cursor JSONB
);

-- `system-usage.csv` control figures (ADR-008 §1), used only by the W4.3
-- reconciliation: ingested totals must be explainable against these.
CREATE TABLE source_control_totals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    academic_year SMALLINT NOT NULL UNIQUE,
    users_total INT,
    active_users INT,
    storage_documents INT,
    index_documents INT,
    checks_total INT,
    avg_checks NUMERIC(10, 1)
);

-- «Удален» rows are excluded from facts but must stay visible in the batch
-- report (ADR-008 §4) - silently dropped rows are indistinguishable from bugs.
ALTER TABLE ingest_batches
    ADD COLUMN rows_skipped_deleted INT NOT NULL DEFAULT 0;

-- ── Settings seeds (defaults only; every one is admin-editable) ─────────────
INSERT INTO settings (key, value) VALUES
    ('semester_boundaries', '{"autumn_start": "09-01", "spring_start": "02-01"}'),
    ('status_rules', '{"rules": [{"when": "attempt_gt_1", "status": "recheck"}, {"when": "suspicious_not_cleared", "status": "rejected"}, {"when": "below_threshold", "status": "needs_revision"}], "default": "accepted", "escalate_when": "suspicious_not_cleared"}'),
    ('public_snapshot_quarter', '"auto"'),
    ('exclude_deleted', 'true')
ON CONFLICT (key) DO NOTHING;

-- ── Aggregates: exclude deleted rows ────────────────────────────────────────
-- A materialized view cannot be altered in place, so it is dropped and
-- recreated with the identical shape plus `WHERE NOT deleted`. This destroys
-- no facts (the view is derived from `checks`) and the unique index that
-- enables REFRESH … CONCURRENTLY is recreated with it.
DROP MATERIALIZED VIEW agg_monthly;

CREATE MATERIALIZED VIEW agg_monthly AS
SELECT date_trunc('month', checked_at)::date AS month,
       academic_year, faculty_id, department_id, program_id, work_type_id, status, initiator,
       count(*)                                                                  AS checks,
       avg(originality_pct)                                                      AS avg_originality,
       count(*) FILTER (WHERE originality_pct < 50)                              AS b_lt50,
       count(*) FILTER (WHERE originality_pct >= 50 AND originality_pct < 70)    AS b_50_70,
       count(*) FILTER (WHERE originality_pct >= 70 AND originality_pct < 85)    AS b_70_85,
       count(*) FILTER (WHERE originality_pct >= 85 AND originality_pct < 95)    AS b_85_95,
       count(*) FILTER (WHERE originality_pct >= 95)                             AS b_ge95,
       count(*) FILTER (WHERE escalated)                                         AS escalated,
       count(*) FILTER (WHERE attempt_no > 1)                                    AS rechecks
FROM checks
WHERE NOT deleted
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8;

CREATE UNIQUE INDEX idx_agg_monthly_key
    ON agg_monthly (month, academic_year, faculty_id, department_id, program_id, work_type_id, status, initiator)
    NULLS NOT DISTINCT;
