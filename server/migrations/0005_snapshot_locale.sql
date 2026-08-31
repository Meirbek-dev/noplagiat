-- The locale a report snapshot was rendered in (TZ §4.5, §7; ADR-005).
--
-- `report_snapshots` (migration 0001) records the period and the kind of a
-- snapshot but not its language, so the annual scheduler could only ask "was
-- this academic year generated?" and never "was it generated in Kazakh?". Both
-- RU and KK are mandatory (TZ §7) and are generated in one tick; a crash
-- between them left the second locale ungenerated, and every later tick found
-- the year "already generated" and skipped it - for good, since the tick fires
-- once a year.
--
-- Additive-only (AGENTS.md invariant #6): a nullable column on an existing
-- table, no default, no backfill, no change to 0001–0004.
--
-- NULL means "written before this column existed", not "no locale". The
-- scheduler reads such a row as covering the year in every locale - exactly
-- what it did before - so introducing the column can never turn into a
-- duplicate generation of a snapshot that is already on disk.

ALTER TABLE report_snapshots
    -- The three locales `reports::Locale` renders, as BCP-47 tags. Constrained
    -- like `kind` above it: a snapshot in a language the renderer does not have
    -- a string table for is a bug, not a row.
    ADD COLUMN locale TEXT CHECK (locale IN ('ru', 'kk', 'en'));

COMMENT ON COLUMN report_snapshots.locale IS
    'BCP-47 tag the snapshot was rendered in; NULL for rows written before migration 0005.';
