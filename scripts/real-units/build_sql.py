"""Generate real-dictionaries.sql and real-staff-units.sql for the deploy DB.

Reads: stats/real-units-work/structure.json, stats/real-staff-units.csv,
       deploy/.env (pepper).
Writes: stats/real-dictionaries.sql, stats/real-staff-units.sql
Both idempotent (ON CONFLICT). The staff-units file carries HMACs and masked
labels only - no plaintext e-mail reaches the database (ADR-008 s2).
"""

import hashlib
import hmac as hmac_mod
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STATS = ROOT / "stats"
ENV = ROOT / "deploy" / ".env"

S = json.loads((STATS / "real-units-work" / "structure.json").read_text(encoding="utf-8"))


def sq(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", s).strip()).lower()


def reviewer_ref(pepper: str, email: str) -> str:
    return hmac_mod.new(
        pepper.encode(), f"reviewer\n{norm(email)}".encode(), hashlib.sha256
    ).hexdigest()


def masked_label(email: str) -> str:
    at = email.rfind("@")
    local, domain = (email[:at], email[at + 1 :]) if at >= 0 else (email, "")
    head = local[:1]
    masked = f"{head}***" if len(local) < 6 else f"{head}***{local[-4:]}"
    return f"{masked}@{domain}"


# ── pepper ──────────────────────────────────────────────────────────────────
pepper = ""
for line in ENV.read_text(encoding="utf-8").splitlines():
    m = re.match(r"^APP_INGEST_PEPPER=(.*)$", line.strip())
    if m:
        pepper = m.group(1).strip().strip('"').strip("'")
if not pepper:
    raise SystemExit("APP_INGEST_PEPPER not found in deploy/.env")

# ── dictionaries ────────────────────────────────────────────────────────────
# Faculty and department names as published on tou.edu.kz (fetched today);
# COLLEGE is curated: the college shows up in the exports as a reviewer whose
# name field literally says the unit, but it has no page in the university
# component.
# Orthography fixes over the site's verbatim EN strings ("Faculties of ...",
# lowercase "engineering") so print and dashboard agree on one spelling.
EN_FIXES = {
    "94": "Faculty of Humanities and Social Sciences",
    "97": "Faculty of Engineering",
}

fac_rows = []
for fid, f in sorted(S["faculties"].items(), key=lambda kv: int(kv[0])):
    n = f["names"]
    ru = n.get("ru") or n.get("kk") or n.get("en")
    en = EN_FIXES.get(fid) or n.get("en") or ru
    fac_rows.append(
        f"    ('FAC{fid}', {sq(ru)}, {sq(n.get('kk') or ru)}, {sq(en)})"
    )
fac_rows.append(
    "    ('COLLEGE', 'Высший колледж Торайгыров университета', "
    "'Торайғыров университетінің жоғары колледжі', "
    "'Higher College of Toraighyrov University')"
)

dep_rows = []
for did, d in sorted(S["departments"].items(), key=lambda kv: int(kv[0])):
    n = d["names"]
    ru = n.get("ru") or n.get("kk") or n.get("en")
    dep_rows.append(
        f"    ('FAC{d['faculty']}', 'DEP{did}', {sq(ru)}, "
        f"{sq(n.get('kk') or ru)}, {sq(n.get('en') or ru)})"
    )

dict_sql = f"""-- GENERATED from tou.edu.kz public structure pages - interim until the
-- registrar office answers request D2 (docs/REQUESTS.md). Codes carry the
-- site's component ids (faculty=NN / department=NN) so rows stay traceable
-- to their source. Idempotent: ON CONFLICT (code) DO NOTHING.

BEGIN;

INSERT INTO faculties (code, name_ru, name_kk, name_en) VALUES
{",\n".join(fac_rows)}
ON CONFLICT (code) DO NOTHING;

INSERT INTO departments (faculty_id, code, name_ru, name_kk, name_en)
SELECT f.id, d.code, d.name_ru, d.name_kk, d.name_en
FROM (VALUES
{",\n".join(dep_rows)}
) AS d(faculty_code, code, name_ru, name_kk, name_en)
JOIN faculties f ON f.code = d.faculty_code
ON CONFLICT (code) DO NOTHING;

-- Work types (TZ per 4.2; the `other` sentinel already exists - migration 0002)
INSERT INTO work_types (code, name_ru, name_kk, name_en, sort_order) VALUES
    ('course', 'Курсовая работа', 'Курстық жұмыс', 'Course paper', 10),
    ('thesis_bachelor', 'Дипломная работа (ВКР)', 'Дипломдық жұмыс', 'Bachelor thesis', 20),
    ('thesis_master', 'Магистерская диссертация', 'Магистрлік диссертация', 'Master thesis', 30),
    ('thesis_phd', 'Докторская диссертация (PhD)', 'Докторлық диссертация (PhD)', 'PhD thesis', 40),
    ('article', 'Статья ППС', 'ПОҚ мақаласы', 'Faculty article', 50),
    ('research_report', 'Научно-исследовательская работа (НИР)', 'Ғылыми-зерттеу жұмысы', 'Research report', 60),
    ('other', 'Иное', 'Өзге', 'Other', 90)
ON CONFLICT (code) DO NOTHING;

COMMIT;
"""
(STATS / "real-dictionaries.sql").write_text(dict_sql, encoding="utf-8")

# ── staff units ─────────────────────────────────────────────────────────────
CURATED = {
    # documents.csv carries this reviewer as the unit itself
    "sharapidenovna_n77@mail.ru": ("COLLEGE", "UNASSIGNED"),
}

rows = []
seen = set()
with (STATS / "real-staff-units.csv").open(encoding="utf-8") as fh:
    next(fh)
    for line in fh:
        email, fac, dep = line.strip().split(";")
        if email in CURATED or email in seen:
            continue
        seen.add(email)
        rows.append((email, fac, dep))
rows.extend((e, f, d) for e, (f, d) in CURATED.items())

values = []
for email, fac, dep in rows:
    values.append(
        f"    ('\\x{reviewer_ref(pepper, email)}'::bytea,\n"
        f"     (SELECT id FROM faculties WHERE code = {sq(fac)}),\n"
        f"     (SELECT id FROM departments WHERE code = {sq(dep)}),\n"
        f"     {sq(masked_label(email))})"
    )

staff_sql = (
    "-- GENERATED by scripts/real-units/build_sql.py - HMACs and masked labels only.\n"
    "-- No plaintext reviewer e-mail is ever written here (ADR-008 s2).\n"
    "BEGIN;\n"
    "INSERT INTO staff_units (email_hmac, faculty_id, department_id, masked_label)\n"
    "VALUES\n" + ",\n".join(values) + "\n"
    "ON CONFLICT (email_hmac) DO UPDATE SET\n"
    "    faculty_id    = EXCLUDED.faculty_id,\n"
    "    department_id = EXCLUDED.department_id,\n"
    "    masked_label  = EXCLUDED.masked_label;\n"
    "COMMIT;\n"
)
(STATS / "real-staff-units.sql").write_text(staff_sql, encoding="utf-8")
print(f"dictionaries: {len(fac_rows)} faculties, {len(dep_rows)} departments")
print(f"staff units: {len(rows)} rows -> stats/real-staff-units.sql")
