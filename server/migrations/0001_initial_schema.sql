-- Initial warehouse schema. See docs/ARCHITECTURE.md §3.
-- Invariant: no PII columns anywhere - the only identifier is the opaque
-- source_check_id from the source antiplagiarism system.

CREATE TYPE check_status AS ENUM ('accepted', 'needs_revision', 'rejected', 'recheck');
CREATE TYPE initiator_role AS ENUM ('student', 'staff_self', 'registrar', 'other');
CREATE TYPE role_kind AS ENUM ('staff', 'dept_head', 'dean', 'ethics', 'compliance', 'admin');

-- ── Dictionaries ────────────────────────────────────────────────────────────
CREATE TABLE faculties (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name_ru TEXT NOT NULL,
    name_kk TEXT NOT NULL,
    name_en TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE departments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    faculty_id BIGINT NOT NULL REFERENCES faculties(id),
    code TEXT NOT NULL UNIQUE,
    name_ru TEXT NOT NULL,
    name_kk TEXT NOT NULL,
    name_en TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE programs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_id BIGINT NOT NULL REFERENCES departments(id),
    code TEXT NOT NULL UNIQUE,
    name_ru TEXT NOT NULL,
    name_kk TEXT NOT NULL,
    name_en TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE work_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name_ru TEXT NOT NULL,
    name_kk TEXT NOT NULL,
    name_en TEXT NOT NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0
);

-- Source-system label → dictionary id mapping, editable by admins.
CREATE TABLE dict_aliases (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('faculty', 'department', 'program', 'work_type')),
    source_label TEXT NOT NULL,
    target_id BIGINT NOT NULL,
    UNIQUE (kind, source_label)
);

-- ── Operations ──────────────────────────────────────────────────────────────
CREATE TABLE ingest_batches (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    source TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('api', 'csv')),
    rows_read INT NOT NULL DEFAULT 0,
    rows_upserted INT NOT NULL DEFAULT 0,
    rows_rejected INT NOT NULL DEFAULT 0,
    errors JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'succeeded', 'failed'))
);

-- ── Fact table: one row per check attempt ───────────────────────────────────
CREATE TABLE checks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_check_id TEXT NOT NULL,
    attempt_no INT NOT NULL DEFAULT 1,
    checked_at TIMESTAMPTZ NOT NULL,
    -- 2024 = AY 2024/25 (Sep 1 – Aug 31), derived on ingest
    academic_year SMALLINT NOT NULL,
    work_type_id BIGINT NOT NULL REFERENCES work_types(id),
    faculty_id BIGINT NOT NULL REFERENCES faculties(id),
    department_id BIGINT NOT NULL REFERENCES departments(id),
    program_id BIGINT REFERENCES programs(id),
    originality_pct NUMERIC(5,2) NOT NULL CHECK (originality_pct >= 0 AND originality_pct <= 100),
    status check_status NOT NULL,
    escalated BOOLEAN NOT NULL DEFAULT FALSE,
    initiator initiator_role NOT NULL,
    duration_seconds INT,
    ingest_batch_id BIGINT NOT NULL REFERENCES ingest_batches(id),
    UNIQUE (source_check_id, attempt_no)
);

CREATE INDEX idx_checks_checked_at ON checks (checked_at);
CREATE INDEX idx_checks_year ON checks (academic_year);
CREATE INDEX idx_checks_unit_time ON checks (faculty_id, department_id, checked_at);
CREATE INDEX idx_checks_work_type_time ON checks (work_type_id, checked_at);
CREATE INDEX idx_checks_status ON checks (status);
CREATE INDEX idx_checks_escalated ON checks (id) WHERE escalated;

-- ── Auxiliary facts ─────────────────────────────────────────────────────────
CREATE TABLE submission_totals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    academic_year SMALLINT NOT NULL,
    work_type_id BIGINT NOT NULL REFERENCES work_types(id),
    total_submitted INT NOT NULL CHECK (total_submitted >= 0),
    UNIQUE (academic_year, work_type_id)
);

CREATE TABLE ethics_cases (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    academic_year SMALLINT NOT NULL,
    category TEXT NOT NULL,
    referred INT NOT NULL DEFAULT 0 CHECK (referred >= 0),
    reviewed_closed INT NOT NULL DEFAULT 0 CHECK (reviewed_closed >= 0)
);

CREATE TABLE usage_stats (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    period_month DATE NOT NULL UNIQUE,
    active_users INT NOT NULL CHECK (active_users >= 0),
    avg_check_seconds INT
);

-- ── Settings, users, RBAC ───────────────────────────────────────────────────
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT
);

INSERT INTO settings (key, value) VALUES
    ('k_threshold', '5'),
    ('originality_threshold', '70'),
    ('histogram_buckets', '[50, 70, 85, 95]');

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sso_subject TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL DEFAULT '',
    display_name TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id),
    role role_kind NOT NULL,
    scope_faculty_id BIGINT REFERENCES faculties(id),
    scope_department_id BIGINT REFERENCES departments(id),
    -- COALESCE trick keeps NULL scopes unique-comparable
    UNIQUE NULLS NOT DISTINCT (user_id, role, scope_faculty_id, scope_department_id)
);

-- ── Audit log: append-only, retention ≥ 1 year ──────────────────────────────
CREATE TABLE audit_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id BIGINT NOT NULL REFERENCES users(id),
    role role_kind NOT NULL,
    action TEXT NOT NULL,
    section TEXT NOT NULL,
    filters JSONB NOT NULL DEFAULT '{}',
    ip INET
);

CREATE INDEX idx_audit_log_occurred_at ON audit_log (occurred_at);
CREATE INDEX idx_audit_log_user ON audit_log (user_id, occurred_at);

-- Enforce append-only at the schema level, independent of grants.
CREATE FUNCTION audit_log_immutable() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'audit_log is append-only (AGENTS.md invariant #4)';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_immutable
    BEFORE UPDATE OR DELETE ON audit_log
    FOR EACH ROW EXECUTE FUNCTION audit_log_immutable();

-- ── Report snapshots ────────────────────────────────────────────────────────
CREATE TABLE report_snapshots (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('annual', 'manual')),
    pdf_path TEXT,
    xlsx_path TEXT,
    published BOOLEAN NOT NULL DEFAULT FALSE
);

-- ── Aggregates: request paths read these, never the fact table ──────────────
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
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8;

-- Unique index enables REFRESH MATERIALIZED VIEW CONCURRENTLY.
CREATE UNIQUE INDEX idx_agg_monthly_key
    ON agg_monthly (month, academic_year, faculty_id, department_id, program_id, work_type_id, status, initiator)
    NULLS NOT DISTINCT;
