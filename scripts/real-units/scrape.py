"""Scrape tou.edu.kz faculty/department structure and staff lists.

Output (JSON, UTF-8) to structure.json:
  faculties: {id: {names: {ru,kk,en}, departments: [ids]}}
  departments: {id: {names: {ru,kk,en}, faculty: id}}
  staff: [{name, position, faculty, department|None}]
"""

import json
import re
import sys
import time
import urllib.request
from pathlib import Path

BASE = "https://tou.edu.kz"
LOCALES = {"ru": "ru", "kk": "kz", "en": "en"}
FACULTY_IDS = [91, 92, 94, 95, 96, 97, 98, 211]
# Working files land under the gitignored stats/ so nothing scraped is committed.
OUT = Path(__file__).resolve().parents[2] / "stats" / "real-units-work"
CACHE = OUT / "cache"
CACHE.mkdir(parents=True, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (compatible; noplagiat-dashboard-mapping/1.0)"}


def fetch(path: str, key: str) -> str:
    cached = CACHE / (key + ".html")
    if cached.exists() and cached.stat().st_size > 0:
        return cached.read_text(encoding="utf-8", errors="replace")
    req = urllib.request.Request(BASE + path, headers=UA)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                html = resp.read().decode("utf-8", errors="replace")
            cached.write_text(html, encoding="utf-8")
            time.sleep(0.3)
            return html
        except Exception as e:  # noqa: BLE001
            print(f"  retry {attempt + 1} {path}: {e}", file=sys.stderr)
            time.sleep(2.0)
    raise RuntimeError(f"failed to fetch {path}")


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()


def faculty_links(html: str) -> dict[int, str]:
    out: dict[int, str] = {}
    for fid, body in re.findall(
        r'href="/component/university\?faculty=(\d+)"[^>]*>(.*?)</a>', html, re.S
    ):
        name = clean(body)
        # nav repeats; keep the longest non-trivial label
        if name and len(name) > len(out.get(int(fid), "")):
            out[int(fid)] = name
    return out


def department_links(html: str) -> dict[int, str]:
    out: dict[int, str] = {}
    for did, body in re.findall(
        r'href="/component/university\?department=(\d+)"[^>]*>(.*?)</a>', html, re.S
    ):
        name = clean(body)
        if name and len(name) > len(out.get(int(did), "")):
            out[int(did)] = name
    return out


def employees(html: str) -> list[tuple[str, str]]:
    names = [clean(m) for m in re.findall(r'class="employee-name"[^>]*>(.*?)<', html, re.S)]
    positions = [clean(m) for m in re.findall(r'class="employee-position"[^>]*>(.*?)<', html, re.S)]
    if len(positions) < len(names):
        positions += [""] * (len(names) - len(positions))
    return list(zip(names, positions))


def main() -> None:
    faculties: dict[int, dict] = {}
    departments: dict[int, dict] = {}
    staff: list[dict] = []

    # Locale-specific names come off each faculty page's nav + department list.
    for fid in FACULTY_IDS:
        for loc, prefix in LOCALES.items():
            html = fetch(f"/{prefix}/component/university?faculty={fid}", f"fac{fid}-{loc}")
            fnames = faculty_links(html)
            dnames = department_links(html)
            for k, v in fnames.items():
                faculties.setdefault(k, {"names": {}, "departments": set()})
                cur = faculties[k]["names"].get(loc, "")
                if len(v) > len(cur):
                    faculties[k]["names"][loc] = v
            for k, v in dnames.items():
                departments.setdefault(k, {"names": {}, "faculty": fid})
                cur = departments[k]["names"].get(loc, "")
                if len(v) > len(cur):
                    departments[k]["names"][loc] = v
                if loc == "ru":
                    departments[k]["faculty"] = fid
                    faculties.setdefault(fid, {"names": {}, "departments": set()})
                    faculties[fid]["departments"].add(k)
        # deanery staff (RU)
        html = fetch(
            f"/ru/component/university?faculty={fid}&section=employees", f"fac{fid}-emp"
        )
        for name, position in employees(html):
            staff.append(
                {"name": name, "position": position, "faculty": fid, "department": None}
            )
        print(f"faculty {fid}: departments so far {sorted(faculties.get(fid, {}).get('departments', []))}")

    for did, meta in sorted(departments.items()):
        html = fetch(
            f"/ru/component/university?department={did}&section=employees", f"dep{did}-emp"
        )
        emp = employees(html)
        for name, position in emp:
            staff.append(
                {"name": name, "position": position, "faculty": meta["faculty"], "department": did}
            )
        print(f"department {did} ({meta['names'].get('ru', '?')[:50]}): {len(emp)} staff")

    for f in faculties.values():
        f["departments"] = sorted(f["departments"])

    out = {
        "faculties": {str(k): v for k, v in sorted(faculties.items())},
        "departments": {str(k): v for k, v in sorted(departments.items())},
        "staff": staff,
    }
    (OUT / "structure.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(
        f"\nfaculties={len(faculties)} departments={len(departments)} staff rows={len(staff)}"
    )


if __name__ == "__main__":
    main()
