/**
 * Independent brute-force reducer — slice W0.3.
 *
 *   bun fixtures/expected.ts [--root DIR] [--print]
 *
 * Reads the generated source-shaped CSVs plus the fixture dictionaries and
 * recomputes every TZ §4.2 section by hand, then writes `expected.json`.
 *
 * INDEPENDENCE IS THE POINT (ARCHITECTURE §9, AGENTS.md §6): this file
 * contains NO SQL and imports nothing from `server/` or `apps/web/`. Its only
 * shared surface with the generator is `./rules.ts`, which holds *data*
 * (dictionaries, rule patterns, thresholds) and `norm()`. Every derivation —
 * CSV parsing, attempt grouping, the status ladder, buckets, semesters — is
 * written a second time here on purpose: a numeric disagreement with the Rust
 * ingest/SQL lanes is then a real bug, not a shared mistake.
 *
 * Never edit `expected.json` to make a test pass — recompute it and
 * investigate the diff (AGENTS.md §6).
 */

import { createHmac } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import {
  DEPARTMENTS,
  FACULTIES,
  INITIATOR_RULES,
  K_THRESHOLD,
  ORIGINALITY_THRESHOLD,
  PROGRAMS,
  STATUS_DELETED,
  STATUS_NOT_DELETED,
  TZ_OFFSET,
  UNASSIGNED,
  WORK_TYPES,
  WORK_TYPE_RULES,
  WORK_TYPE_RULES_ORDERED,
  academicYearDir,
  meanFromHundredths,
  norm,
  ratio4,
} from "./rules"

// ── A CSV reader written from scratch (RFC-4180 over `;`) ───────────────────

/** Splits into logical records; a record may span physical lines. */
function parseCsv(text: string): string[][] {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const records: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false
  let i = 0
  const endField = (): void => {
    row.push(field)
    field = ""
  }
  const endRecord = (): void => {
    endField()
    records.push(row)
    row = []
  }
  while (i < src.length) {
    const c = src[i] as string
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        quoted = false
        i++
        continue
      }
      field += c
      i++
      continue
    }
    if (c === '"' && field === "") {
      quoted = true
      i++
      continue
    }
    if (c === ";") {
      endField()
      i++
      continue
    }
    if (c === "\r" && src[i + 1] === "\n") {
      endRecord()
      i += 2
      continue
    }
    if (c === "\n" || c === "\r") {
      endRecord()
      i++
      continue
    }
    field += c
    i++
  }
  if (field !== "" || row.length > 0) endRecord()
  return records
}

/** `87,50` → 8750 integer hundredths. Rejects anything else. */
function parseDecimalComma(raw: string): number | null {
  const s = raw.trim()
  if (!/^-?\d+(,\d{1,2})?$/u.test(s)) return null
  const neg = s.startsWith("-")
  const body = neg ? s.slice(1) : s
  const [whole, frac = ""] = body.split(",")
  const cents = Number(`${whole}${frac.padEnd(2, "0")}`)
  return neg ? -cents : cents
}

/** `dd.MM.yyyy HH:mm` → civil parts, or null. */
function parseStamp(
  raw: string
): { y: number; mo: number; d: number; h: number; mi: number } | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/u.exec(raw.trim())
  if (!m) return null
  return {
    d: Number(m[1]),
    mo: Number(m[2]),
    y: Number(m[3]),
    h: Number(m[4]),
    mi: Number(m[5]),
  }
}

const pad = (n: number, w = 2): string => String(n).padStart(w, "0")

// ── Fixture dictionary files ────────────────────────────────────────────────

/** Pulls the first two single-quoted literals out of every `(...)` tuple. */
function sqlTuples(section: string): string[][] {
  const out: string[][] = []
  const re = /\(\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'/gu
  let m: RegExpExecArray | null
  while ((m = re.exec(section)) !== null) {
    out.push([
      (m[1] as string).replaceAll("''", "'"),
      (m[2] as string).replaceAll("''", "'"),
    ])
  }
  return out
}

function sqlSection(sql: string, table: string): string {
  const start = sql.indexOf(`INSERT INTO ${table} `)
  if (start < 0) throw new Error(`dictionaries.sql: no INSERT INTO ${table}`)
  const rest = sql.slice(start + 1)
  const next = rest.indexOf("INSERT INTO ")
  return next < 0 ? rest : rest.slice(0, next)
}

function assertSameSet(what: string, got: string[], want: string[]): void {
  const g = [...new Set(got)].sort().join(",")
  const w = [...new Set(want)].sort().join(",")
  if (g !== w) {
    throw new Error(
      `${what} drifted between rules.ts and the SQL fixture\n  sql:   ${g}\n  rules: ${w}`
    )
  }
}

/**
 * Cross-checks the committed SQL against `rules.ts`. The generator writes both
 * from the same source, so a mismatch means one of them was hand-edited.
 */
function loadDeclaredCodes(root: string): void {
  const sql = readFileSync(join(root, "dictionaries.sql"), "utf8")

  assertSameSet(
    "faculty codes",
    sqlTuples(sqlSection(sql, "faculties")).map((t) => t[0] as string),
    [...FACULTIES.map((f) => f.code), UNASSIGNED]
  )
  const depTuples = sqlTuples(sqlSection(sql, "departments"))
  assertSameSet(
    "department codes",
    depTuples.map((t) => t[1] as string),
    [...DEPARTMENTS.map((d) => d.code), UNASSIGNED]
  )
  for (const [facultyCode, code] of depTuples) {
    if (code === UNASSIGNED) continue
    const want = DEPARTMENTS.find((d) => d.code === code)
    if (!want || want.faculty_code !== facultyCode) {
      throw new Error(`department ${String(code)} maps to a different faculty`)
    }
  }
  assertSameSet(
    "programme codes",
    sqlTuples(sqlSection(sql, "programs")).map((t) => t[1] as string),
    PROGRAMS.map((p) => p.code)
  )
  assertSameSet(
    "work type codes",
    sqlTuples(sqlSection(sql, "work_types")).map((t) => t[0] as string),
    WORK_TYPES.map((w) => w.code)
  )

  const rulesSql = readFileSync(join(root, "work-type-rules.sql"), "utf8")
  assertSameSet(
    "work type rule patterns",
    sqlTuples(rulesSql).map((t) => `${t[0] as string}→${t[1] as string}`),
    WORK_TYPE_RULES.map((r) => `${r.pattern}→${r.work_type}`)
  )

  const initSql = readFileSync(join(root, "initiator-rules.sql"), "utf8")
  assertSameSet(
    "initiator rules",
    sqlTuples(initSql).map((t) => `${t[0] as string}→${t[1] as string}`),
    INITIATOR_RULES.map((r) => `${r.pattern}→${r.initiator}`)
  )
}

type Unit = { faculty: string; department: string }

function loadStaffUnits(root: string): Map<string, Unit> {
  const text = readFileSync(join(root, "staff-units.csv"), "utf8")
  const map = new Map<string, Unit>()
  const records = parseCsv(text)
  const known = new Map(DEPARTMENTS.map((d) => [d.code, d.faculty_code]))
  for (const rec of records.slice(1)) {
    if (rec.length < 3 || rec[0] === "") continue
    const faculty = rec[1] as string
    const department = rec[2] as string
    if (known.get(department) !== faculty) {
      throw new Error(
        `staff-units.csv: ${faculty}/${department} is not a declared dictionary pair`
      )
    }
    map.set(norm(rec[0] as string), { faculty, department })
  }
  return map
}

// ── Derivation (reimplemented here on purpose — see the file header) ────────

function classifyWorkType(title: string): string {
  const t = norm(title)
  for (const rule of WORK_TYPE_RULES_ORDERED) {
    if (t.includes(rule.pattern)) return rule.work_type
  }
  return "other"
}

function classifyInitiator(email: string): string {
  const e = norm(email)
  const at = e.lastIndexOf("@")
  const local = at < 0 ? e : e.slice(0, at)
  const domain = at < 0 ? "" : e.slice(at + 1)
  if (domain === "teachers.tou.edu.kz") return "staff_self"
  if (local.startsWith("registrar") || local.startsWith("reg.")) {
    return "registrar"
  }
  return "other"
}

function bucketOf(originality: number): string {
  if (originality < 5000) return "lt50"
  if (originality < 7000) return "b50_70"
  if (originality < 8500) return "b70_85"
  if (originality < 9500) return "b85_95"
  return "ge95"
}

type Fact = {
  sourceCheckId: string
  workKey: string
  reviewerKey: string
  /** `YYYY-MM-DDTHH:MM` — lexicographic order equals chronological order. */
  tsKey: string
  date: string
  month: string
  academicYear: number
  /** All percentages are integer hundredths; `null` when the field is blank. */
  originality: number
  selfCitation: number | null
  citation: number | null
  match: number | null
  aiContent: number | null
  workType: string
  faculty: string
  department: string
  suspicious: boolean
  cleared: boolean
  escalated: boolean
  initiator: string
  attemptNo: number
  status: string
}

type YearStats = {
  academic_year: number
  rows_total: number
  rows_deleted: number
  rows_rejected: number
  rejected_column_shifted: number
  rejected_bad_link: number
}

const LINK_RE = /\/report\/full\/(\d+)\?userId=(\d+)/u

function readYear(
  root: string,
  ay: number,
  units: Map<string, Unit>,
  facts: Fact[]
): YearStats {
  const dir = join(root, "out", academicYearDir(ay))
  const records = parseCsv(readFileSync(join(dir, "documents.csv"), "utf8"))
  const body = records.slice(1)

  const stats: YearStats = {
    academic_year: ay,
    rows_total: body.length,
    rows_deleted: 0,
    rows_rejected: 0,
    rejected_column_shifted: 0,
    rejected_bad_link: 0,
  }

  for (const rec of body) {
    if (rec.length !== 14) {
      stats.rows_rejected++
      stats.rejected_column_shifted++
      continue
    }
    const status = (rec[11] as string).trim()
    if (status !== STATUS_NOT_DELETED && status !== STATUS_DELETED) {
      // The observed shift defect: the report URL sits in «Статус».
      stats.rows_rejected++
      stats.rejected_column_shifted++
      continue
    }
    if (status === STATUS_DELETED) {
      // ADR-008 §4: excluded from facts, counted by the importer.
      stats.rows_deleted++
      continue
    }
    const link = LINK_RE.exec(rec[12] as string)
    if (!link) {
      stats.rows_rejected++
      stats.rejected_bad_link++
      continue
    }
    const ts = parseStamp(rec[0] as string)
    const originality = parseDecimalComma(rec[3] as string)
    if (!ts || originality === null) {
      stats.rows_rejected++
      stats.rejected_bad_link++
      continue
    }

    const email = rec[8] as string
    const unit = units.get(norm(email))
    const suspicious = norm(rec[9] as string) === "да"
    const cleared = norm(rec[10] as string) === "да"

    facts.push({
      sourceCheckId: `${link[2] as string}:${link[1] as string}`,
      // Plaintext stand-in for `work_ref`: ADR-008 §2 HMACs exactly
      // this string, and grouping survives any injective function,
      // so the reducer needs no pepper.
      workKey: `work\n${norm(rec[1] as string)}\n${norm(rec[2] as string)}`,
      reviewerKey: norm(email),
      tsKey: `${ts.y}-${pad(ts.mo)}-${pad(ts.d)}T${pad(ts.h)}:${pad(ts.mi)}`,
      date: `${ts.y}-${pad(ts.mo)}-${pad(ts.d)}`,
      month: `${ts.y}-${pad(ts.mo)}-01`,
      academicYear: ts.mo >= 9 ? ts.y : ts.y - 1,
      originality,
      // Extra columns TZ §3.1 does not require: stored, never surfaced
      // (PLAN §1.1). A blank field is a genuine NULL, not a zero.
      selfCitation: parseDecimalComma(rec[4] as string),
      citation: parseDecimalComma(rec[5] as string),
      match: parseDecimalComma(rec[6] as string),
      aiContent: parseDecimalComma(rec[13] as string),
      workType: classifyWorkType(rec[1] as string),
      faculty: unit?.faculty ?? UNASSIGNED,
      department: unit?.department ?? UNASSIGNED,
      suspicious,
      cleared,
      escalated: suspicious && !cleared,
      initiator: classifyInitiator(email),
      attemptNo: 0,
      status: "",
    })
  }
  return stats
}

/**
 * ADR-008 §3: within a `work_ref`, order by (checked_at, source_check_id) and
 * number attempts from 1. §4: status ladder, first match wins.
 */
function deriveAttemptsAndStatus(facts: Fact[]): void {
  const groups = new Map<string, Fact[]>()
  for (const f of facts) {
    const g = groups.get(f.workKey)
    if (g) g.push(f)
    else groups.set(f.workKey, [f])
  }
  for (const group of groups.values()) {
    group.sort(compareFacts)
    group.forEach((f, i) => {
      f.attemptNo = i + 1
    })
  }
  for (const f of facts) {
    f.status =
      f.attemptNo > 1
        ? "recheck"
        : f.escalated
          ? "rejected"
          : f.originality < ORIGINALITY_THRESHOLD * 100
            ? "needs_revision"
            : "accepted"
  }
}

function compareFacts(a: Fact, b: Fact): number {
  if (a.tsKey !== b.tsKey) return a.tsKey < b.tsKey ? -1 : 1
  if (a.sourceCheckId !== b.sourceCheckId) {
    return a.sourceCheckId < b.sourceCheckId ? -1 : 1
  }
  return 0
}

// ── Scenario matrix ─────────────────────────────────────────────────────────

export type ScenarioFilters = {
  from: string
  to: string
  faculty: string | null
  department: string | null
  program: string | null
  workType: string | null
  status: string | null
}

type ScenarioSpec = { name: string; filters: ScenarioFilters }

function scenarioSpecs(from: string, to: string): ScenarioSpec[] {
  /** Key order here is the key order in expected.json — keep it stable. */
  const q = (
    a: string,
    b: string,
    extra: Partial<ScenarioFilters> = {}
  ): ScenarioFilters => ({
    from: a,
    to: b,
    faculty: null,
    department: null,
    program: null,
    workType: null,
    status: null,
    ...extra,
  })

  return [
    // 1 — the whole fixture, no dimension pinned.
    { name: "all-time-no-filter", filters: q(from, to) },
    // 2 — one academic year (Sep 1 – Aug 31, ADR-008 §8).
    {
      name: "academic-year-2025-2026",
      filters: q("2025-09-01", "2026-08-31"),
    },
    // 3 — one calendar month.
    { name: "month-2025-11", filters: q("2025-11-01", "2025-11-30") },
    // 4 — autumn semester (Sep 1 – Jan 31).
    {
      name: "semester-autumn-2025",
      filters: q("2025-09-01", "2026-01-31"),
    },
    // 5 — faculty scope; pre-2025/26 rows are all UNASSIGNED (PLAN §1.2).
    { name: "faculty-fac03", filters: q(from, to, { faculty: "FAC03" }) },
    // 6 — faculty × work type.
    {
      name: "faculty-fac03-worktype-course",
      filters: q(from, to, { faculty: "FAC03", workType: "course" }),
    },
    // 7 — derived status filter (D6 ladder).
    {
      name: "status-needs-revision",
      filters: q(from, to, { status: "needs_revision" }),
    },
    // 8 — work type alone.
    {
      name: "worktype-thesis-bachelor",
      filters: q(from, to, { workType: "thesis_bachelor" }),
    },
    // 9 — custom range deliberately crossing a month boundary.
    {
      name: "custom-range-crossing-month",
      filters: q("2025-10-15", "2025-11-14"),
    },
    // 10 — department scope (internal contour only).
    {
      name: "department-dep11",
      filters: q(from, to, { department: "DEP11" }),
    },
  ]
}

function matches(f: Fact, q: ScenarioFilters): boolean {
  if (f.date < q.from || f.date > q.to) return false
  if (q.faculty !== null && f.faculty !== q.faculty) return false
  if (q.department !== null && f.department !== q.department) return false
  if (q.workType !== null && f.workType !== q.workType) return false
  if (q.status !== null && f.status !== q.status) return false
  // `program` is never populated: ОП is not derivable from the legacy export
  // (PLAN §1.1), so a program filter always yields an empty set.
  if (q.program !== null) return false
  return true
}

type Agg = { checks: number; sum: number }

function bump(m: Map<string, Agg>, key: string, originality: number): void {
  const a = m.get(key)
  if (a) {
    a.checks++
    a.sum += originality
  } else {
    m.set(key, { checks: 1, sum: originality })
  }
}

function sortedEntries(m: Map<string, Agg>): [string, Agg][] {
  return [...m.entries()].sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
  )
}

function reduceScenario(spec: ScenarioSpec, facts: readonly Fact[]): unknown {
  const rows = facts.filter((f) => matches(f, spec.filters))

  let sum = 0
  let below = 0
  const byMonth = new Map<string, Agg>()
  const byWorkType = new Map<string, Agg>()
  const byUnit = new Map<string, Agg>()
  const byYear = new Map<string, Agg>()
  const hist = { lt50: 0, b50_70: 0, b70_85: 0, b85_95: 0, ge95: 0 }
  const reviewersByMonth = new Map<string, Set<string>>()
  const works = new Map<string, Fact[]>()
  let escalated = 0

  for (const f of rows) {
    sum += f.originality
    if (f.originality < ORIGINALITY_THRESHOLD * 100) below++
    bump(byMonth, f.month, f.originality)
    bump(byWorkType, f.workType, f.originality)
    bump(byUnit, `${f.faculty}\u0000${f.department}`, f.originality)
    bump(byYear, String(f.academicYear), f.originality)
    hist[bucketOf(f.originality) as keyof typeof hist]++
    if (f.escalated) escalated++
    const set = reviewersByMonth.get(f.month)
    if (set) set.add(f.reviewerKey)
    else reviewersByMonth.set(f.month, new Set([f.reviewerKey]))
    const w = works.get(f.workKey)
    if (w) w.push(f)
    else works.set(f.workKey, [f])
  }

  // ADR-008 §9 rechecks: over the FILTERED rows, grouped by work_ref.
  let rechecked = 0
  let improved = 0
  for (const attempts of works.values()) {
    if (attempts.length < 2) continue
    rechecked++
    const ordered = [...attempts].sort(compareFacts)
    const first = ordered[0] as Fact
    const last = ordered[ordered.length - 1] as Fact
    if (last.originality > first.originality) improved++
  }

  return {
    name: spec.name,
    filters: spec.filters,
    summary: {
      checks: rows.length,
      avg_originality: meanFromHundredths(sum, rows.length),
      below_threshold: below,
      below_threshold_share: ratio4(below, rows.length),
    },
    timeseries: sortedEntries(byMonth).map(([month, a]) => ({
      month,
      checks: a.checks,
      avg_originality: meanFromHundredths(a.sum, a.checks),
    })),
    work_types: sortedEntries(byWorkType).map(([code, a]) => ({
      code,
      checks: a.checks,
      avg_originality: meanFromHundredths(a.sum, a.checks),
    })),
    units: sortedEntries(byUnit).map(([key, a]) => {
      const [faculty, department] = key.split("\u0000")
      return {
        faculty,
        department,
        checks: a.checks,
        avg_originality: meanFromHundredths(a.sum, a.checks),
      }
    }),
    histogram: hist,
    yoy: [...byYear.entries()]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, a]) => ({
        academic_year: Number(year),
        checks: a.checks,
        avg_originality: meanFromHundredths(a.sum, a.checks),
      })),
    rechecks: {
      works_total: works.size,
      works_rechecked: rechecked,
      improved,
    },
    escalations: { checks_escalated: escalated },
    usage: [...reviewersByMonth.entries()]
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([month, set]) => ({ month, active_reviewers: set.size })),
    // The same scenario as the *public* contour answers it (ADR-016): whole
    // months, no status/department/program dimension, and every number a sum
    // over cube cells of at least `k` checks.
    ...(publicView(spec, facts) as Record<string, unknown>),
  }
}

// ── The public release closure (ADR-016) ────────────────────────────────────
//
// The public contour publishes sums over the cube (month, faculty, work type)
// restricted to cells holding at least `k` checks, and nothing else. This is a
// second, independent implementation of that rule: no SQL, no server code, and
// deliberately not sharing a line with `reduceScenario` above, so a
// disagreement with the Rust `db::q::public_cube` is a real bug in one of them.
//
// Two things differ from the raw scenario reduction:
//
//   * the window is **snapped to whole months** (ADR-016 §1) — the public
//     contour cannot be walked a day at a time;
//   * `status`, `department` and `program` are **not public dimensions**
//     (ADR-016 §3, TZ §4.2 §4), so a scenario carrying one of them is reduced
//     here as if it had not been supplied. `public_filters` records exactly the
//     request the public contour would have received.

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function daysInMonth(year: number, month: number): number {
  if (month === 2 && isLeapYear(year)) return 29
  return MONTH_LENGTHS[month - 1] as number
}

/** `2025-10-15` → `2025-10-01`. */
function snapDown(date: string): string {
  return `${date.slice(0, 7)}-01`
}

/** `2025-11-14` → `2025-11-30`; February keeps its own year's length. */
function snapUp(date: string): string {
  const year = Number(date.slice(0, 4))
  const month = Number(date.slice(5, 7))
  return `${date.slice(0, 7)}-${pad(daysInMonth(year, month))}`
}

const BUCKET_ORDER = ["lt50", "b50_70", "b70_85", "b85_95", "ge95"] as const

type CubeCell = {
  month: string
  faculty: string
  workType: string
  academicYear: number
  checks: number
  /** Integer hundredths, exactly as the source carries them. */
  sum: number
  buckets: number[]
  escalated: number
}

/** A roll-up of released cells: everything one display group may publish. */
type CubeGroup = {
  checks: number
  sum: number
  buckets: number[]
  escalated: number
  withheldCells: number
}

function emptyGroup(): CubeGroup {
  return {
    checks: 0,
    sum: 0,
    buckets: [0, 0, 0, 0, 0],
    escalated: 0,
    withheldCells: 0,
  }
}

function addCell(group: CubeGroup, cell: CubeCell): void {
  group.checks += cell.checks
  group.sum += cell.sum
  group.escalated += cell.escalated
  for (let i = 0; i < group.buckets.length; i++) {
    group.buckets[i] =
      (group.buckets[i] as number) + (cell.buckets[i] as number)
  }
}

/** The public projection of a scenario's filters, after month snapping. */
function publicFilters(q: ScenarioFilters): {
  from: string
  to: string
  faculty: string | null
  work_type: string | null
} {
  return {
    from: snapDown(q.from),
    to: snapUp(q.to),
    faculty: q.faculty,
    work_type: q.workType,
  }
}

/** The cube cells of one public request, released and withheld alike. */
function buildCube(facts: readonly Fact[], q: ScenarioFilters): CubeCell[] {
  const filters = publicFilters(q)
  const cells = new Map<string, CubeCell>()
  for (const f of facts) {
    if (f.date < filters.from || f.date > filters.to) continue
    if (filters.faculty !== null && f.faculty !== filters.faculty) continue
    if (filters.work_type !== null && f.workType !== filters.work_type) continue

    const key = `${f.month} ${f.faculty} ${f.workType}`
    let cell = cells.get(key)
    if (!cell) {
      cell = {
        month: f.month,
        faculty: f.faculty,
        workType: f.workType,
        academicYear: f.academicYear,
        checks: 0,
        sum: 0,
        buckets: [0, 0, 0, 0, 0],
        escalated: 0,
      }
      cells.set(key, cell)
    }
    cell.checks++
    cell.sum += f.originality
    const band = BUCKET_ORDER.indexOf(
      bucketOf(f.originality) as (typeof BUCKET_ORDER)[number]
    )
    cell.buckets[band] = (cell.buckets[band] as number) + 1
    if (f.escalated) cell.escalated++
  }
  return [...cells.values()].sort((a, b) => {
    const ka = `${a.month} ${a.faculty} ${a.workType}`
    const kb = `${b.month} ${b.faculty} ${b.workType}`
    return ka < kb ? -1 : ka > kb ? 1 : 0
  })
}

/**
 * Roll released cells up by `label`, keeping groups whose every cell was
 * withheld so the UI still shows «недостаточно данных» for them.
 */
function rollUp(
  cells: readonly CubeCell[],
  released: (cell: CubeCell) => boolean,
  label: (cell: CubeCell) => string
): Map<string, CubeGroup> {
  const groups = new Map<string, CubeGroup>()
  const at = (key: string): CubeGroup => {
    let group = groups.get(key)
    if (!group) {
      group = emptyGroup()
      groups.set(key, group)
    }
    return group
  }
  for (const cell of cells) {
    if (cell.checks === 0) continue
    const group = at(label(cell))
    if (released(cell)) addCell(group, cell)
    else group.withheldCells++
  }
  return groups
}

function sortedGroups(groups: Map<string, CubeGroup>): [string, CubeGroup][] {
  return [...groups.entries()].sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
  )
}

/** The count-and-mean pair every public row publishes. */
function publicRow(group: CubeGroup): {
  checks: number
  avg_originality: number
} {
  return {
    checks: group.checks,
    avg_originality: meanFromHundredths(group.sum, group.checks),
  }
}

function publicView(spec: ScenarioSpec, facts: readonly Fact[]): unknown {
  const k = K_THRESHOLD
  const cells = buildCube(facts, spec.filters)
  const isReleased = (cell: CubeCell): boolean => cell.checks >= k
  const withheld = cells.filter((c) => c.checks > 0 && !isReleased(c)).length

  const total = emptyGroup()
  total.withheldCells = withheld
  for (const cell of cells) if (isReleased(cell)) addCell(total, cell)

  // ADR-008 §9 / ADR-016 §2: the default threshold is 70 %, which is the
  // upper edge of the second band, so «ниже порога» is `lt50 + b50_70`.
  const belowBands = BUCKET_ORDER.indexOf("b50_70") + 1
  const below = total.buckets.slice(0, belowBands).reduce((a, b) => a + b, 0)

  const byMonth = rollUp(cells, isReleased, (c) => c.month)
  const byWorkType = rollUp(cells, isReleased, (c) => c.workType)
  const byFaculty = rollUp(cells, isReleased, (c) => c.faculty)
  const byYear = rollUp(cells, isReleased, (c) => String(c.academicYear))

  const histogram: Record<string, number> = {}
  BUCKET_ORDER.forEach((band, index) => {
    histogram[band] = total.buckets[index] as number
  })

  return {
    public_filters: publicFilters(spec.filters),
    public_summary: {
      checks: total.checks,
      avg_originality: meanFromHundredths(total.sum, total.checks),
      below_threshold: below,
      below_threshold_share: ratio4(below, total.checks),
      escalated: total.escalated,
      suppressed_groups: withheld,
    },
    public_timeseries: sortedGroups(byMonth).map(([month, group]) => ({
      month,
      ...publicRow(group),
    })),
    public_work_types: sortedGroups(byWorkType).map(([code, group]) => ({
      code,
      ...publicRow(group),
    })),
    public_faculties: sortedGroups(byFaculty).map(([code, group]) => ({
      code,
      ...publicRow(group),
    })),
    public_histogram: { ...histogram, total: total.checks },
    public_yoy: [...byYear.entries()]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, group]) => ({
        academic_year: Number(year),
        ...publicRow(group),
      })),
  }
}

// ── Pre-derived facts for the db lane ───────────────────────────────────────

/**
 * The pepper `facts.jsonl` is pinned to. The file ships pre-HMACed so
 * `#[sqlx::test]` can COPY the warehouse in without re-implementing ADR-008's
 * derivation — which means the digests have to be reproducible from the repo
 * alone, so the pepper cannot be a secret here. That is sound only because
 * every fixture e-mail, title and author is synthetic: there is nothing to
 * recover. Real ingest still reads `APP_INGEST_PEPPER` and must never use
 * this value (ADR-008 §2). `fixtures/seed.ts` defaults to the same constant,
 * so `staff_units.email_hmac` joins these `reviewer_ref`s out of the box.
 */
export const FIXTURE_PEPPER = "dev-pepper"

const hmac = (message: string): string =>
  createHmac("sha256", FIXTURE_PEPPER).update(message).digest("hex")

/** Integer hundredths → a 2 dp decimal STRING that Postgres NUMERIC accepts. */
function pct(hundredths: number | null): string | null {
  if (hundredths === null) return null
  const neg = hundredths < 0
  const s = String(Math.abs(hundredths)).padStart(3, "0")
  return `${neg ? "-" : ""}${s.slice(0, -2)}.${s.slice(-2)}`
}

/** `2025-11-03T14:07:00+05:00` — naive source time at the ADR's fixed offset. */
function rfc3339(tsKey: string): string {
  return `${tsKey}:00${TZ_OFFSET}`
}

/**
 * One line per importable fact, in (checked_at, source_check_id) order. Key
 * order is part of the contract — keep it stable, the db lane diffs this file.
 */
function renderFacts(facts: readonly Fact[]): string {
  const lines: string[] = []
  for (const f of facts) {
    lines.push(
      JSON.stringify({
        source_check_id: f.sourceCheckId,
        attempt_no: f.attemptNo,
        checked_at: rfc3339(f.tsKey),
        academic_year: f.academicYear,
        work_type_code: f.workType,
        faculty_code: f.faculty,
        department_code: f.department,
        // ОП is not derivable from the legacy export (PLAN §1.1).
        program_code: null,
        originality_pct: pct(f.originality),
        status: f.status,
        escalated: f.escalated,
        initiator: f.initiator,
        suspicious: f.suspicious,
        suspicion_cleared: f.cleared,
        self_citation_pct: pct(f.selfCitation),
        citation_pct: pct(f.citation),
        match_pct: pct(f.match),
        ai_content_pct: pct(f.aiContent),
        work_ref: hmac(f.workKey),
        reviewer_ref: hmac(`reviewer\n${f.reviewerKey}`),
      })
    )
  }
  return lines.join("\n") + "\n"
}

// ── Entry point ─────────────────────────────────────────────────────────────

type Manifest = {
  seed: number
  scale: string
  years: { academic_year: number }[]
}

export function computeExpected(root: string): {
  json: Record<string, unknown>
  facts: string
  years: YearStats[]
} {
  const outRoot = join(root, "out")
  if (!existsSync(join(outRoot, "manifest.json"))) {
    throw new Error(
      `no fixtures at ${outRoot} — run \`bun fixtures/generate.ts\` first`
    )
  }
  const manifest = JSON.parse(
    readFileSync(join(outRoot, "manifest.json"), "utf8")
  ) as Manifest

  loadDeclaredCodes(root)
  const units = loadStaffUnits(root)

  const facts: Fact[] = []
  const years: YearStats[] = []
  for (const y of manifest.years) {
    const stats = readYear(root, y.academic_year, units, facts)
    years.push(stats)

    // The sidecar is the contract the ingest lane asserts against; if the
    // reducer disagrees with it, one of the two is wrong — fail loudly.
    const sidecar = JSON.parse(
      readFileSync(
        join(outRoot, academicYearDir(y.academic_year), "malformed.json"),
        "utf8"
      )
    ) as { rows_rejected_expected: number; rows_deleted: number }
    if (
      sidecar.rows_rejected_expected !== stats.rows_rejected ||
      sidecar.rows_deleted !== stats.rows_deleted
    ) {
      throw new Error(
        `AY ${y.academic_year}: malformed.json says ` +
          `${sidecar.rows_rejected_expected} rejected / ${sidecar.rows_deleted} deleted, ` +
          `reducer found ${stats.rows_rejected} / ${stats.rows_deleted}`
      )
    }
  }

  deriveAttemptsAndStatus(facts)
  facts.sort(compareFacts)

  let from = facts[0]?.date ?? "1970-01-01"
  let to = from
  for (const f of facts) {
    if (f.date < from) from = f.date
    if (f.date > to) to = f.date
  }

  const rowsTotal = years.reduce((a, y) => a + y.rows_total, 0)
  const rowsDeleted = years.reduce((a, y) => a + y.rows_deleted, 0)
  const rowsRejected = years.reduce((a, y) => a + y.rows_rejected, 0)

  return {
    json: {
      meta: {
        seed: manifest.seed,
        scale: manifest.scale,
        rows_generated: rowsTotal,
        rows_deleted: rowsDeleted,
        rows_malformed: rowsRejected,
      },
      scenarios: scenarioSpecs(from, to).map((s) => reduceScenario(s, facts)),
    },
    facts: renderFacts(facts),
    years,
  }
}

if (import.meta.main) {
  const argv = process.argv.slice(2)
  let root = "fixtures"
  let print = false
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--root") root = String(argv[++i])
    else if (argv[i] === "--print") print = true
    else throw new Error(`unknown argument: ${String(argv[i])}`)
  }

  const { json, facts, years } = computeExpected(root)
  const target = join(root, "expected.json")
  writeFileSync(target, JSON.stringify(json, null, 2) + "\n", "utf8")

  // One command produces both artefacts — they are two views of one reduction
  // and must never be regenerated separately.
  const factsTarget = join(root, "out", "facts.jsonl")
  writeFileSync(factsTarget, facts, "utf8")

  const meta = json.meta as Record<string, number | string>
  console.log(`expected: ${target}`)
  console.log(
    `  rows_generated=${meta.rows_generated}` +
      `  rows_deleted=${meta.rows_deleted}` +
      `  rows_malformed=${meta.rows_malformed}`
  )
  console.log(
    `facts:    ${factsTarget}` +
      `  lines=${facts === "\n" ? 0 : facts.split("\n").length - 1}` +
      `  bytes=${Buffer.byteLength(facts, "utf8")}`
  )
  for (const y of years) {
    console.log(
      `  AY ${y.academic_year}: total=${y.rows_total} deleted=${y.rows_deleted}` +
        ` rejected=${y.rows_rejected}` +
        ` (shifted=${y.rejected_column_shifted}, bad_link=${y.rejected_bad_link})`
    )
  }
  const scenarios = json.scenarios as { name: string; summary: unknown }[]
  for (const s of scenarios) {
    const sum = s.summary as { checks: number; avg_originality: number }
    console.log(
      `  ${s.name.padEnd(30)} checks=${String(sum.checks).padStart(6)}` +
        `  avg=${sum.avg_originality}`
    )
  }
  if (print) console.log(JSON.stringify(json, null, 2))
}
