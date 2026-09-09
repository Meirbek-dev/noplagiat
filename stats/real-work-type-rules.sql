-- Real-world work-type rule extension for the tou.edu.kz exports.
-- The ADR-008 defaults (fixtures/work-type-rules.sql, priorities 10-62) expect
-- clean phrases; the actual источник titles are upload filenames: underscores
-- instead of spaces («дипломная_работа»), bare keywords («диплом», «статья»,
-- «дипломка», «мақала»). These land AFTER the specific phrases (priority 70+),
-- so a qualified title still classifies by its qualifier first.
-- Verified against stats/: «дипломат*» 0 rows, «конкурс*» 2 rows, so the bare
-- «диплом» substring is safe on this corpus. Admin-editable data (ADR-008 §7):
-- adjust in the admin rules editor, then re-ingest.
-- Idempotent: guarded by NOT EXISTS, never deletes admin-added rules.

BEGIN;

INSERT INTO work_type_rules (pattern, work_type_id, priority, active)
SELECT r.pattern, wt.id, r.priority, TRUE
FROM (VALUES
    -- underscore variants of the default phrases
    ('дипломная_работа', 'thesis_bachelor', 70),
    ('дипломный_проект', 'thesis_bachelor', 70),
    ('дипломдық_жұмыс', 'thesis_bachelor', 70),
    ('дипломдық жоба', 'thesis_bachelor', 70),
    ('дипломдық_жоба', 'thesis_bachelor', 70),
    ('докторская_диссертация', 'thesis_phd', 71),
    ('магистерская_диссертация', 'thesis_master', 72),
    ('магистрлік_диссертация', 'thesis_master', 72),
    ('курсовая_работа', 'course', 73),
    ('курсовой_проект', 'course', 73),
    ('курстық_жұмыс', 'course', 73),
    -- bare keywords, least specific last
    ('дипломн', 'thesis_bachelor', 80),
    ('дипломка', 'thesis_bachelor', 81),
    ('диплом', 'thesis_bachelor', 82),
    ('диссертац', 'thesis_master', 83),
    ('курсовая', 'course', 84),
    ('курсовой', 'course', 84),
    ('курстық', 'course', 84),
    ('статья', 'article', 86),
    ('мақала', 'article', 87),
    ('тезис', 'article', 88)
) AS r(pattern, work_type_code, priority)
JOIN work_types wt ON wt.code = r.work_type_code
WHERE NOT EXISTS (
    SELECT 1 FROM work_type_rules x
    WHERE x.pattern = r.pattern AND x.work_type_id = wt.id
);

COMMIT;
