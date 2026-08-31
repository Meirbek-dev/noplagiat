-- Migration 0003 - request-path aggregates (PLAN §W1.4, ADR-008 §1, §8, §9).
--
-- Append-only: 0001 and 0002 are never edited (AGENTS.md invariant #6). The
-- only DROP is `agg_monthly`, a pure projection of `checks` that is rebuilt in
-- the same transaction - no fact row is destroyed.
--
-- Three things change in `agg_monthly`, each for a reason stated at its line:
-- the month is truncated at the university's fixed +05:00 offset, `deleted`
-- becomes a grouping dimension instead of a filter, and the originality
-- aggregate is a SUM rather than an AVG.
--
-- The migration also installs the two set-returning functions every dashboard
-- query reads through (`agg_cells`, `fact_cells`). They exist so that the
-- period → month arithmetic, the `settings.exclude_deleted` toggle, the
-- dictionary-code filters and - above all - the canonical RBAC scope predicate
--
--     (p_scope_faculty_id    IS NULL OR faculty_id    = p_scope_faculty_id)
-- AND (p_scope_department_id IS NULL OR department_id = p_scope_department_id)
--
-- are written **once**, in SQL, and every `db::q::*` function is a short
-- `GROUP BY` over one of them (AGENTS.md invariant #3). A query that forgets a
-- scope cannot be written: the parameter has no default.

-- ── agg_monthly ─────────────────────────────────────────────────────────────
-- A materialized view cannot be altered in place; it is dropped and recreated.
DROP MATERIALIZED VIEW agg_monthly;

CREATE MATERIALIZED VIEW agg_monthly AS
SELECT
    -- (1) TIMEZONE. Source timestamps are naive local time interpreted at a
    -- fixed +05:00 for every year (ADR-008 §1); Asia/Almaty is *not* usable
    -- because it was +06:00 before 2024. Truncating in UTC moves every check
    -- made between 00:00 and 05:00 on the 1st of a month into the previous
    -- month - the fixture contains ~478 such rows precisely so that a UTC
    -- truncation provably diverges from fixtures/expected.json.
    date_trunc('month', c.checked_at AT TIME ZONE INTERVAL '+05:00')::date AS month,
    c.academic_year,
    c.faculty_id,
    c.department_id,
    c.program_id,
    c.work_type_id,
    c.status,
    c.initiator,
    -- (2) `deleted` IS A DIMENSION, not a filter. 0002 excluded «Удален» rows
    -- from the view body, which made `settings.exclude_deleted` a matview
    -- rebuild. Grouping by it instead turns the toggle into a query-time
    -- WHERE, so an administrator flipping the setting sees the change on the
    -- next request (ADR-008 §4).
    c.deleted,
    count(*)                                                                  AS checks,
    -- (3) SUM, NOT AVG. Every dashboard section rolls this view up across
    -- several groups; an average of averages is wrong unless the groups are
    -- equal-sized. Carrying the sum lets each caller compute the exact
    -- weighted mean as sum ÷ count (ADR-008 §9).
    sum(c.originality_pct)                                                    AS sum_originality,
    -- Bucket edges are the ADR-008 §8 defaults; a request that asks for other
    -- boundaries falls back to `fact_cells` (see db::q::histogram).
    count(*) FILTER (WHERE c.originality_pct < 50)                            AS b_lt50,
    count(*) FILTER (WHERE c.originality_pct >= 50 AND c.originality_pct < 70) AS b_50_70,
    count(*) FILTER (WHERE c.originality_pct >= 70 AND c.originality_pct < 85) AS b_70_85,
    count(*) FILTER (WHERE c.originality_pct >= 85 AND c.originality_pct < 95) AS b_85_95,
    count(*) FILTER (WHERE c.originality_pct >= 95)                           AS b_ge95,
    count(*) FILTER (WHERE c.escalated)                                       AS escalated,
    count(*) FILTER (WHERE c.attempt_no > 1)                                  AS rechecks
FROM checks c
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9;

-- Unique index over the full GROUP BY key enables REFRESH … CONCURRENTLY.
-- `program_id` is nullable, so NULLS NOT DISTINCT is required for uniqueness.
CREATE UNIQUE INDEX idx_agg_monthly_key
    ON agg_monthly (month, academic_year, faculty_id, department_id, program_id,
                    work_type_id, status, initiator, deleted)
    NULLS NOT DISTINCT;

CREATE INDEX idx_agg_monthly_month ON agg_monthly (month);
CREATE INDEX idx_agg_monthly_unit ON agg_monthly (faculty_id, department_id, month);

-- ── agg_rechecks_yearly ─────────────────────────────────────────────────────
-- ADR-008 §9 recheck metrics, precomputed at the grain the Приложение-1 annual
-- report (W4.1) publishes them at: one academic year × unit × work type.
--
-- Work identity: `work_ref` when the ingest derived one (CSV backfill,
-- ADR-008 §2). API-mode rows carry no derived key, so those rows fall back to
-- a digest of `source_check_id` - the attempts of one source check therefore
-- group together as one work, and a row that is the only attempt of its
-- source check counts as a single-attempt work. Both branches yield 32 bytes,
-- so the key space is uniform.
--
-- CAUTION for future callers: `works_total` is a DISTINCT count *within a
-- group*. Summing it across the view's key does **not** yield the distinct
-- work count of the union - a work whose attempts fall in two units or two
-- academic years is counted in both. In the `small` fixture 4 works span two
-- units and 3 span two academic years, so the roll-up overstates the
-- university-wide `works_total` by 4 and understates `works_rechecked` by 3.
-- `db::q::rechecks` therefore reads `fact_cells` and this view serves only
-- single-cell reads.
CREATE MATERIALIZED VIEW agg_rechecks_yearly AS
WITH work_attempts AS (
    SELECT
        c.academic_year,
        c.faculty_id,
        c.department_id,
        c.work_type_id,
        COALESCE(c.work_ref, sha256(convert_to('scid:' || c.source_check_id, 'UTF8'))) AS work_key,
        count(*) AS attempts,
        -- ADR-008 §3 ordering: (checked_at, source_check_id) ascending.
        (array_agg(c.originality_pct ORDER BY c.checked_at, c.source_check_id))[1]
            AS first_originality,
        (array_agg(c.originality_pct ORDER BY c.checked_at DESC, c.source_check_id DESC))[1]
            AS last_originality
    FROM checks c
    WHERE NOT c.deleted
    GROUP BY 1, 2, 3, 4, 5
)
SELECT
    w.academic_year,
    w.faculty_id,
    w.department_id,
    w.work_type_id,
    count(*)                                                     AS works_total,
    count(*) FILTER (WHERE w.attempts > 1)                       AS works_rechecked,
    count(*) FILTER (WHERE w.attempts > 1
                       AND w.last_originality > w.first_originality) AS improved
FROM work_attempts w
GROUP BY 1, 2, 3, 4;

CREATE UNIQUE INDEX idx_agg_rechecks_yearly_key
    ON agg_rechecks_yearly (academic_year, faculty_id, department_id, work_type_id);

-- ── agg_usage_monthly ───────────────────────────────────────────────────────
-- TZ §4.2 §8 / ADR-008 §9: monthly distinct reviewers. A distinct count is not
-- additive in general, so it cannot be derived from `agg_monthly` and needs its
-- own monthly grain. Rolling it up across units is exact because
-- `staff_units.email_hmac` is a primary key: one reviewer resolves to exactly
-- one (faculty, department).
--
-- «Удален» rows are excluded unconditionally here (unlike `agg_monthly`); a
-- request made with `settings.exclude_deleted = false` falls back to
-- `fact_cells` (see db::q::usage).
CREATE MATERIALIZED VIEW agg_usage_monthly AS
SELECT
    date_trunc('month', c.checked_at AT TIME ZONE INTERVAL '+05:00')::date AS month,
    c.faculty_id,
    c.department_id,
    count(DISTINCT c.reviewer_ref) AS active_reviewers
FROM checks c
WHERE NOT c.deleted AND c.reviewer_ref IS NOT NULL
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX idx_agg_usage_monthly_key
    ON agg_usage_monthly (month, faculty_id, department_id);

-- ── The one composition point every dashboard query reads through ───────────

-- Additive measures at the coarsest grain every TZ §4.2 section needs.
CREATE TYPE agg_cell AS (
    month           date,
    academic_year   smallint,
    faculty_id      bigint,
    department_id   bigint,
    work_type_id    bigint,
    checks          bigint,
    sum_originality numeric,
    b_lt50          bigint,
    b_50_70         bigint,
    b_70_85         bigint,
    b_85_95         bigint,
    b_ge95          bigint,
    escalated       bigint,
    rechecks        bigint
);

-- `agg_monthly` for whole months, `checks` for the boundary months of an
-- arbitrary date range - the ARCHITECTURE.md §3.3 rule ("never scan the fact
-- table on request paths") with its single documented exception.
--
-- The caller (db::filters::PeriodBinds) splits an inclusive [from, to] range of
-- **local +05:00 calendar days** into at most one whole-month span plus at most
-- two boundary day-ranges. When the period is month-aligned the two partial
-- parameters are NULL and the `checks` branch is a one-time-false filter.
CREATE FUNCTION agg_cells(
    p_full_from           date,     -- first day of the first wholly covered month
    p_full_to             date,     -- first day of the last wholly covered month
    p_partial1_from       date,     -- inclusive local day, leading boundary month
    p_partial1_to         date,
    p_partial2_from       date,     -- inclusive local day, trailing boundary month
    p_partial2_to         date,
    p_exclude_deleted     boolean,  -- settings.exclude_deleted
    p_scope_faculty_id    bigint,   -- compliance::Scope - invariant #3
    p_scope_department_id bigint,   -- compliance::Scope - invariant #3
    p_faculty_code        text,
    p_department_code     text,
    p_program_code        text,
    p_work_type_code      text,
    p_status              text,
    p_initiator           text
) RETURNS SETOF agg_cell
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
    SELECT a.month,
           a.academic_year,
           a.faculty_id,
           a.department_id,
           a.work_type_id,
           sum(a.checks)::bigint,
           sum(a.sum_originality),
           sum(a.b_lt50)::bigint,
           sum(a.b_50_70)::bigint,
           sum(a.b_70_85)::bigint,
           sum(a.b_85_95)::bigint,
           sum(a.b_ge95)::bigint,
           sum(a.escalated)::bigint,
           sum(a.rechecks)::bigint
    FROM agg_monthly a
    WHERE p_full_from IS NOT NULL
      AND a.month >= p_full_from
      AND a.month <= p_full_to
      AND (NOT COALESCE(p_exclude_deleted, TRUE) OR NOT a.deleted)
      -- Canonical RBAC scope predicate (compliance::Scope docs, invariant #3).
      AND (p_scope_faculty_id IS NULL OR a.faculty_id = p_scope_faculty_id)
      AND (p_scope_department_id IS NULL OR a.department_id = p_scope_department_id)
      -- Dictionary filters resolve the code inside SQL: an unknown code yields
      -- NULL and therefore an empty result, never an unfiltered one.
      AND (p_faculty_code IS NULL
           OR a.faculty_id = (SELECT f.id FROM faculties f WHERE f.code = p_faculty_code))
      AND (p_department_code IS NULL
           OR a.department_id = (SELECT d.id FROM departments d WHERE d.code = p_department_code))
      AND (p_program_code IS NULL
           OR a.program_id = (SELECT pr.id FROM programs pr WHERE pr.code = p_program_code))
      AND (p_work_type_code IS NULL
           OR a.work_type_id = (SELECT w.id FROM work_types w WHERE w.code = p_work_type_code))
      AND (p_status IS NULL OR a.status::text = p_status)
      AND (p_initiator IS NULL OR a.initiator::text = p_initiator)
    GROUP BY 1, 2, 3, 4, 5

    UNION ALL

    SELECT date_trunc('month', c.checked_at AT TIME ZONE INTERVAL '+05:00')::date,
           c.academic_year,
           c.faculty_id,
           c.department_id,
           c.work_type_id,
           count(*),
           sum(c.originality_pct),
           count(*) FILTER (WHERE c.originality_pct < 50),
           count(*) FILTER (WHERE c.originality_pct >= 50 AND c.originality_pct < 70),
           count(*) FILTER (WHERE c.originality_pct >= 70 AND c.originality_pct < 85),
           count(*) FILTER (WHERE c.originality_pct >= 85 AND c.originality_pct < 95),
           count(*) FILTER (WHERE c.originality_pct >= 95),
           count(*) FILTER (WHERE c.escalated),
           count(*) FILTER (WHERE c.attempt_no > 1)
    FROM checks c
    WHERE (
              (p_partial1_from IS NOT NULL
               AND c.checked_at >= (p_partial1_from::timestamp AT TIME ZONE INTERVAL '+05:00')
               AND c.checked_at < ((p_partial1_to + 1)::timestamp AT TIME ZONE INTERVAL '+05:00'))
           OR (p_partial2_from IS NOT NULL
               AND c.checked_at >= (p_partial2_from::timestamp AT TIME ZONE INTERVAL '+05:00')
               AND c.checked_at < ((p_partial2_to + 1)::timestamp AT TIME ZONE INTERVAL '+05:00'))
          )
      AND (NOT COALESCE(p_exclude_deleted, TRUE) OR NOT c.deleted)
      AND (p_scope_faculty_id IS NULL OR c.faculty_id = p_scope_faculty_id)
      AND (p_scope_department_id IS NULL OR c.department_id = p_scope_department_id)
      AND (p_faculty_code IS NULL
           OR c.faculty_id = (SELECT f.id FROM faculties f WHERE f.code = p_faculty_code))
      AND (p_department_code IS NULL
           OR c.department_id = (SELECT d.id FROM departments d WHERE d.code = p_department_code))
      AND (p_program_code IS NULL
           OR c.program_id = (SELECT pr.id FROM programs pr WHERE pr.code = p_program_code))
      AND (p_work_type_code IS NULL
           OR c.work_type_id = (SELECT w.id FROM work_types w WHERE w.code = p_work_type_code))
      AND (p_status IS NULL OR c.status::text = p_status)
      AND (p_initiator IS NULL OR c.initiator::text = p_initiator)
    GROUP BY 1, 2, 3, 4, 5
$$;

-- Row-level access for the three metrics that are not additive and therefore
-- cannot be answered from `agg_monthly`: distinct-work recheck counts
-- (ADR-008 §9), distinct reviewers under a non-unit filter, and a histogram
-- whose boundaries differ from the ADR-008 §8 defaults baked into
-- `agg_monthly`. The date range is exact here, so no month splitting is needed.
CREATE TYPE fact_cell AS (
    source_check_id text,
    attempt_no      integer,
    checked_at      timestamptz,
    month           date,
    academic_year   smallint,
    faculty_id      bigint,
    department_id   bigint,
    work_type_id    bigint,
    originality_pct numeric,
    escalated       boolean,
    work_key        bytea,
    reviewer_ref    bytea
);

CREATE FUNCTION fact_cells(
    p_from                date,     -- inclusive local +05:00 calendar day
    p_to                  date,     -- inclusive local +05:00 calendar day
    p_exclude_deleted     boolean,
    p_scope_faculty_id    bigint,   -- compliance::Scope - invariant #3
    p_scope_department_id bigint,   -- compliance::Scope - invariant #3
    p_faculty_code        text,
    p_department_code     text,
    p_program_code        text,
    p_work_type_code      text,
    p_status              text,
    p_initiator           text
) RETURNS SETOF fact_cell
LANGUAGE sql
STABLE
PARALLEL SAFE
AS $$
    SELECT c.source_check_id,
           c.attempt_no,
           c.checked_at,
           date_trunc('month', c.checked_at AT TIME ZONE INTERVAL '+05:00')::date,
           c.academic_year,
           c.faculty_id,
           c.department_id,
           c.work_type_id,
           c.originality_pct,
           c.escalated,
           COALESCE(c.work_ref, sha256(convert_to('scid:' || c.source_check_id, 'UTF8'))),
           c.reviewer_ref
    FROM checks c
    WHERE c.checked_at >= (p_from::timestamp AT TIME ZONE INTERVAL '+05:00')
      AND c.checked_at < ((p_to + 1)::timestamp AT TIME ZONE INTERVAL '+05:00')
      AND (NOT COALESCE(p_exclude_deleted, TRUE) OR NOT c.deleted)
      AND (p_scope_faculty_id IS NULL OR c.faculty_id = p_scope_faculty_id)
      AND (p_scope_department_id IS NULL OR c.department_id = p_scope_department_id)
      AND (p_faculty_code IS NULL
           OR c.faculty_id = (SELECT f.id FROM faculties f WHERE f.code = p_faculty_code))
      AND (p_department_code IS NULL
           OR c.department_id = (SELECT d.id FROM departments d WHERE d.code = p_department_code))
      AND (p_program_code IS NULL
           OR c.program_id = (SELECT pr.id FROM programs pr WHERE pr.code = p_program_code))
      AND (p_work_type_code IS NULL
           OR c.work_type_id = (SELECT w.id FROM work_types w WHERE w.code = p_work_type_code))
      AND (p_status IS NULL OR c.status::text = p_status)
      AND (p_initiator IS NULL OR c.initiator::text = p_initiator)
$$;

-- ── Aggregate refresh ───────────────────────────────────────────────────────
-- Enumerating `pg_matviews` rather than naming the three views keeps a future
-- aggregate covered without touching the ingest path. Identifiers come from the
-- catalog and are quoted with %I, so no user input reaches the statement.
-- CONCURRENTLY needs a populated view; the first refresh after CREATE falls
-- back to the blocking form.
CREATE FUNCTION refresh_aggregates() RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    view_row record;
    refreshed integer := 0;
BEGIN
    FOR view_row IN
        SELECT schemaname, matviewname, ispopulated
        FROM pg_matviews
        WHERE schemaname = current_schema()
        ORDER BY matviewname
    LOOP
        IF view_row.ispopulated THEN
            EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I.%I',
                           view_row.schemaname, view_row.matviewname);
        ELSE
            EXECUTE format('REFRESH MATERIALIZED VIEW %I.%I',
                           view_row.schemaname, view_row.matviewname);
        END IF;
        refreshed := refreshed + 1;
    END LOOP;
    RETURN refreshed;
END;
$$;
