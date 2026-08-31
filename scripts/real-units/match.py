"""Match reviewer e-mails from stats/ against scraped tou.edu.kz staff.

Inputs:  stats/real-units-work/structure.json (scrape.py), stats/*/
Outputs: stats/real-staff-units.csv  (email;FAC;DEP)
         stats/real-units-work/match-report.txt (coverage, ambiguities, misses)
"""

import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

STATS = Path(__file__).resolve().parents[2] / "stats"
WORK = STATS / "real-units-work"
S = json.loads((WORK / "structure.json").read_text(encoding="utf-8"))

# Cyrillic surname -> latin email local-part heuristics
TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ж": "zh",
    "з": "z", "и": "i", "й": "i", "к": "k", "л": "l", "м": "m", "н": "n",
    "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f",
    "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch", "ъ": "",
    "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
    "ә": "a", "ғ": "g", "қ": "k", "ң": "n", "ө": "o", "ұ": "u", "ү": "u",
    "һ": "h", "і": "i",
}


def norm_name(s: str) -> str:
    s = s.replace("\u00a0", " ").strip().lower().replace("ё", "е")
    return re.sub(r"\s+", " ", s)


def translit(s: str) -> str:
    return "".join(TRANSLIT.get(c, c) for c in s)


# ── scraped staff: name -> units ────────────────────────────────────────────
# unit = (faculty_id, department_id|None); prefer department rows
name_units: dict[str, list[tuple[int, int | None]]] = defaultdict(list)
surname_units: dict[str, list[tuple[str, int, int | None]]] = defaultdict(list)
for row in S["staff"]:
    n = norm_name(row["name"])
    if not n:
        continue
    unit = (row["faculty"], row["department"])
    if unit not in name_units[n]:
        name_units[n].append(unit)
    parts = n.split()
    if parts:
        surname_units[parts[0]].append((n, *unit))

# two-token prefix (фамилия имя) index
prefix_units: dict[str, list[tuple[int, int | None]]] = defaultdict(list)
for n, units in name_units.items():
    parts = n.split()
    if len(parts) >= 2:
        key = " ".join(parts[:2])
        for u in units:
            if u not in prefix_units[key]:
                prefix_units[key].append(u)


def pick(units: list[tuple[int, int | None]]) -> tuple[int, int | None] | None:
    """Prefer a unique department posting; deanery only if it's all there is."""
    deps = sorted({u for u in units if u[1] is not None})
    if len(deps) == 1:
        return deps[0]
    if len(deps) > 1:
        facs = {u[0] for u in deps}
        if len(facs) == 1:  # same faculty, several chairs -> faculty-level
            return (deps[0][0], None)
        return None  # cross-faculty ambiguity
    facs = sorted({u[0] for u in units})
    if len(facs) == 1:
        return (facs[0], None)
    return None


# ── reviewer e-mails: candidate names ───────────────────────────────────────
email_names: dict[str, set[str]] = defaultdict(set)
email_checks: Counter[str] = Counter()

for year_dir in sorted(STATS.glob("*/")):
    ui = year_dir / "user-intensity.csv"
    if ui.is_file():
        with ui.open(encoding="utf-8-sig", newline="") as fh:
            for row in csv.DictReader(fh, delimiter=";"):
                email = (row.get("E-mail") or "").strip().lower()
                name = norm_name(row.get("ФИО") or "")
                if email and name:
                    email_names[email].add(name)
    docs = year_dir / "documents.csv"
    if docs.is_file():
        with docs.open(encoding="utf-8-sig", newline="") as fh:
            for row in csv.DictReader(fh, delimiter=";"):
                email = (row.get("Email проверяющего") or "").strip().lower()
                if not email:
                    continue
                email_checks[email] += 1
                name = norm_name(row.get("Проверяющий") or "")
                if name and len(name.split()) >= 2:
                    email_names[email].add(name)

# ── match ───────────────────────────────────────────────────────────────────
matches: dict[str, tuple[int, int | None, str]] = {}
report: list[str] = []

for email in sorted(email_checks, key=lambda e: -email_checks[e]):
    found: tuple[int, int | None] | None = None
    how = ""
    for name in sorted(email_names.get(email, ())):
        if name in name_units:
            found = pick(name_units[name])
            how = f"full-name {name!r}"
            if found:
                break
        parts = name.split()
        if len(parts) >= 2:
            key = " ".join(parts[:2])
            if key in prefix_units:
                found = pick(prefix_units[key])
                how = f"surname+name {key!r}"
                if found:
                    break
    if not found:
        # e-mail local part vs transliterated surname, e.g. kassenov.a
        local = email.split("@")[0]
        stem = re.split(r"[._\d]", local)[0]
        if len(stem) >= 5:
            cands = []
            for surname, rows in surname_units.items():
                if translit(surname) == stem:
                    cands.extend(rows)
            if cands:
                named = sorted({r[0] for r in cands})
                init = None
                m = re.match(r"^[a-z]+[._]([a-z])", local)
                if m:
                    init = m.group(1)
                    named = [
                        n for n in named
                        if len(n.split()) > 1 and translit(n.split()[1])[:1] == init
                    ] or named
                units = []
                for n in named:
                    for u in name_units[n]:
                        if u not in units:
                            units.append(u)
                if len(named) == 1 or len({(u[0], u[1]) for u in units}) == 1:
                    found = pick(units)
                    how = f"translit {stem!r} -> {named[0]!r}"
    if found:
        matches[email] = (*found, how)

# ── outputs ─────────────────────────────────────────────────────────────────
total = sum(email_checks.values())
covered = sum(email_checks[e] for e in matches)
dep_level = sum(1 for v in matches.values() if v[1] is not None)

lines = ["email;faculty;department"]
for email, (fac, dep, _) in sorted(matches.items()):
    lines.append(f"{email};FAC{fac};{'DEP' + str(dep) if dep else 'UNASSIGNED'}")
(STATS / "real-staff-units.csv").write_text("\n".join(lines) + "\n", encoding="utf-8")

report.append(
    f"reviewers: {len(email_checks)} | matched: {len(matches)} "
    f"(dept-level {dep_level}) | checks covered: {covered}/{total} "
    f"({100 * covered / total:.1f}%)"
)
report.append("\n-- matched --")
for email, (fac, dep, how) in sorted(matches.items(), key=lambda kv: -email_checks[kv[0]]):
    report.append(
        f"  {email_checks[email]:6d}  {email:45s} -> FAC{fac}/"
        f"{'DEP' + str(dep) if dep else '-'} [{how}]"
    )
report.append("\n-- unmatched (by volume) --")
for email in sorted(email_checks, key=lambda e: -email_checks[e]):
    if email not in matches:
        names = "; ".join(sorted(email_names.get(email, ())))[:70]
        report.append(f"  {email_checks[email]:6d}  {email:45s} ({names})")

(WORK / "match-report.txt").write_text("\n".join(report), encoding="utf-8")
print(report[0])
print(f"wrote {STATS / 'real-staff-units.csv'} and match-report.txt")
