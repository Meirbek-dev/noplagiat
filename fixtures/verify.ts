/**
 * Determinism gate for the fixture lane (W0.3).
 *
 *   bun fixtures/verify.ts
 *
 * Vitest is not wired for `fixtures/`, so this is a plain bun script; CI runs
 * it directly. It asserts five things:
 *
 *   1. regenerating with the committed seed/scale into a scratch directory is
 *      BYTE-IDENTICAL to a second scratch run (the generator is a pure
 *      function of its seed - no clock, no Math.random, no ambient state);
 *   2. the committed `fixtures/out/`, `dictionaries.sql`, `work-type-rules.sql`,
 *      `initiator-rules.sql` and `staff-units.csv` are exactly what that seed
 *      produces, so nobody hand-edited a generated artefact;
 *   3. `expected.json` is stable across two independent reductions and equals
 *      the committed file (AGENTS.md §6: never edit it to match the app);
 *   4. the `public_*` blocks satisfy the ADR-016 closure invariants - every
 *      roll-up of one filter sums to the same released total, and the five
 *      bands partition it;
 *   5. `out/facts.jsonl` - the pre-derived facts the db lane bulk-loads - is
 *      likewise stable, matches the committed file, and is sorted by
 *      (checked_at, source_check_id) as its contract promises.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, relative, sep } from "node:path"

import { computeExpected } from "./expected"
import { generate } from "./generate"
import type { Scale } from "./rules"

const ROOT = "fixtures"

/** Fixed scratch paths - no randomness, not even in the temp directory name. */
const SCRATCH_A = join(tmpdir(), "noplagiat-fixtures-verify-a")
const SCRATCH_B = join(tmpdir(), "noplagiat-fixtures-verify-b")

const failures: string[] = []

function check(label: string, ok: boolean, detail = ""): void {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${detail ? ` - ${detail}` : ""}`)
  if (!ok) failures.push(label)
}

/**
 * `out/facts.jsonl` is written by the reducer, not the generator, so it is
 * excluded from the generator-tree comparison and checked separately below.
 */
const REDUCER_OUTPUTS = new Set(["out/facts.jsonl"])

/** Relative paths of every generator-produced artefact under `root`, sorted. */
function artefacts(root: string): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    if (!existsSync(dir)) return
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name < b.name ? -1 : 1
    )) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else {
        const rel = relative(root, p).split(sep).join("/")
        if (!REDUCER_OUTPUTS.has(rel)) out.push(rel)
      }
    }
  }
  walk(join(root, "out"))
  for (const f of [
    "dictionaries.sql",
    "work-type-rules.sql",
    "initiator-rules.sql",
    "staff-units.csv",
  ]) {
    if (existsSync(join(root, f))) out.push(f)
  }
  return out.sort()
}

function compareTrees(label: string, a: string, b: string): void {
  const fa = artefacts(a)
  const fb = artefacts(b)
  if (fa.join("\n") !== fb.join("\n")) {
    check(
      `${label}: same file set`,
      false,
      `${fa.length} vs ${fb.length} files`
    )
    return
  }
  check(`${label}: same file set`, true, `${fa.length} files`)

  const differing: string[] = []
  for (const rel of fa) {
    const ba = readFileSync(join(a, rel))
    const bb = readFileSync(join(b, rel))
    if (!ba.equals(bb))
      differing.push(`${rel} (${ba.length} vs ${bb.length} B)`)
  }
  check(
    `${label}: byte-identical`,
    differing.length === 0,
    differing.length === 0 ? "" : differing.slice(0, 5).join(", ")
  )
}

const HEX64 = /^[0-9a-f]{64}$/u
const PCT = /^-?\d+\.\d{2}$/u
const RFC3339_PLUS5 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+05:00$/u
const STATUSES = new Set(["accepted", "needs_revision", "rejected", "recheck"])
const INITIATORS = new Set(["student", "staff_self", "registrar", "other"])

/** The key order the db lane diffs against - changing it is a contract break. */
const FACT_KEYS = [
  "source_check_id",
  "attempt_no",
  "checked_at",
  "academic_year",
  "work_type_code",
  "faculty_code",
  "department_code",
  "program_code",
  "originality_pct",
  "status",
  "escalated",
  "initiator",
  "suspicious",
  "suspicion_cleared",
  "self_citation_pct",
  "citation_pct",
  "match_pct",
  "ai_content_pct",
  "work_ref",
  "reviewer_ref",
].join(",")

/**
 * Shape and ordering of `facts.jsonl`. Byte-stability alone would happily
 * preserve a contract violation, so the fields are checked too.
 */
function checkFactsContract(text: string, expectedLines: number): void {
  const lines = text.split("\n")
  if (lines.pop() !== "") {
    check("facts.jsonl: trailing newline", false)
    return
  }
  check(
    "facts.jsonl: one line per importable fact",
    lines.length === expectedLines,
    `${lines.length} lines, expected ${expectedLines}`
  )

  let prev = ""
  const problems: string[] = []
  const note = (i: number, why: string): void => {
    if (problems.length < 5) problems.push(`line ${i + 1}: ${why}`)
  }

  /** Fields are `unknown` off JSON.parse; a non-string is itself a violation. */
  const str = (v: unknown): string => (typeof v === "string" ? v : "")

  lines.forEach((line, i) => {
    const f = JSON.parse(line) as Record<string, unknown>
    if (Object.keys(f).join(",") !== FACT_KEYS) note(i, "key order/set drifted")

    // Sorted by (checked_at, source_check_id) - the db lane relies on it for
    // reproducible attempt ladders and stable COPY order.
    const key = `${str(f.checked_at)}|${str(f.source_check_id)}`
    if (key < prev) note(i, "out of (checked_at, source_check_id) order")
    prev = key

    if (!RFC3339_PLUS5.test(str(f.checked_at))) note(i, "checked_at offset")
    if (!HEX64.test(str(f.work_ref))) note(i, "work_ref not 64-hex")
    if (!HEX64.test(str(f.reviewer_ref))) note(i, "reviewer_ref not 64-hex")
    if (!STATUSES.has(str(f.status))) note(i, `status ${str(f.status)}`)
    if (!INITIATORS.has(str(f.initiator))) note(i, "initiator not a DB enum")
    if (f.program_code !== null) note(i, "program_code must be null")
    if (typeof f.attempt_no !== "number" || f.attempt_no < 1) {
      note(i, "attempt_no")
    }
    for (const k of [
      "originality_pct",
      "self_citation_pct",
      "citation_pct",
      "match_pct",
      "ai_content_pct",
    ]) {
      const v = f[k]
      if (v !== null && !PCT.test(str(v))) note(i, `${k} not a 2 dp string`)
    }
    // The status ladder and the escalation flag are independent (ADR-008 §4).
    if (
      f.escalated !== (f.suspicious === true && f.suspicion_cleared !== true)
    ) {
      note(i, "escalated disagrees with suspicious/suspicion_cleared")
    }
  })

  check(
    "facts.jsonl: field contract and ordering",
    problems.length === 0,
    problems.join("; ")
  )
}

/**
 * The ADR-016 closure invariants, checked on the reduction itself.
 *
 * These are properties of the *release rule*, not of the server: every public
 * view of one filter partitions the same released cells, so each roll-up must
 * sum to the same total, and the five bands must partition it too. A reducer
 * bug that let a withheld cell leak into one view but not another would show up
 * here rather than as a mystifying diff against the API.
 */
function checkClosure(json: Record<string, unknown>): void {
  type Row = { checks: number }
  type Scenario = {
    name: string
    filters: {
      from: string
      to: string
      status: string | null
      department: string | null
      program: string | null
    }
    summary: { checks: number }
    public_filters: { from: string; to: string }
    public_summary: { checks: number; suppressed_groups: number }
    public_timeseries: Row[]
    public_work_types: Row[]
    public_faculties: Row[]
    public_yoy: Row[]
    public_histogram: Record<string, number>
  }

  const scenarios = json.scenarios as Scenario[]
  const problems: string[] = []
  const sum = (rows: Row[]): number =>
    rows.reduce((total, row) => total + row.checks, 0)

  for (const s of scenarios) {
    const total = s.public_summary.checks
    for (const [view, rows] of [
      ["timeseries", s.public_timeseries],
      ["work_types", s.public_work_types],
      ["faculties", s.public_faculties],
      ["yoy", s.public_yoy],
    ] as const) {
      if (sum(rows) !== total) {
        problems.push(
          `${s.name}: public_${view} sums to ${sum(rows)} ≠ ${total}`
        )
      }
    }

    const { total: bandTotal, ...bands } = s.public_histogram
    const banded = Object.values(bands).reduce((a, b) => a + b, 0)
    if (banded !== total || bandTotal !== total) {
      problems.push(
        `${s.name}: public_histogram bands sum to ${banded} (total field ${bandTotal}) ≠ ${total}`
      )
    }

    // The public window is snapped outward, so a released total may exceed the
    // raw one for a ragged scenario. What must always hold is that withholding
    // and shortfall agree in direction: over an identical window, a scenario
    // with no withheld cell publishes its whole raw total.
    const sameWindow =
      s.public_filters.from === s.filters.from &&
      s.public_filters.to === s.filters.to &&
      s.filters.status === null &&
      s.filters.department === null &&
      s.filters.program === null
    if (sameWindow && s.public_summary.suppressed_groups === 0) {
      if (total !== s.summary.checks) {
        problems.push(
          `${s.name}: nothing withheld, yet ${total} ≠ raw ${s.summary.checks}`
        )
      }
    }
    if (sameWindow && total > s.summary.checks) {
      problems.push(`${s.name}: released ${total} > raw ${s.summary.checks}`)
    }
  }

  check(
    "expected.json: ADR-016 closure invariants",
    problems.length === 0,
    problems.slice(0, 5).join("; ")
  )
}

function main(): void {
  const manifestPath = join(ROOT, "out", "manifest.json")
  if (!existsSync(manifestPath)) {
    console.error(
      `no committed fixtures at ${manifestPath} - run \`bun fixtures/generate.ts\` first`
    )
    process.exit(1)
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
    seed: number
    scale: Scale
  }
  console.log(`verifying seed=${manifest.seed} scale=${manifest.scale}\n`)

  for (const dir of [SCRATCH_A, SCRATCH_B]) {
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
    generate({ ...manifest, root: dir, quiet: true })
  }

  // 1 - the generator is deterministic.
  compareTrees("regeneration", SCRATCH_A, SCRATCH_B)
  // 2 - the committed artefacts are that same output.
  compareTrees("committed tree", ROOT, SCRATCH_A)

  // 3 - the reducer is stable, and expected.json is the reducer's output.
  const ra = computeExpected(SCRATCH_A)
  const rb = computeExpected(SCRATCH_B)
  const a = JSON.stringify(ra.json, null, 2) + "\n"
  const b = JSON.stringify(rb.json, null, 2) + "\n"
  check("expected.json: stable across two reductions", a === b)

  const committed = join(ROOT, "expected.json")
  if (!existsSync(committed)) {
    check(
      "expected.json: committed",
      false,
      "missing - run bun fixtures/expected.ts"
    )
  } else {
    const c = readFileSync(committed, "utf8")
    check(
      "expected.json: matches a fresh reduction",
      c === a,
      c === a ? "" : "regenerate with `bun fixtures/expected.ts`"
    )
  }

  checkClosure(ra.json)

  // 4 - the pre-derived facts the db lane bulk-loads.
  check("facts.jsonl: stable across two reductions", ra.facts === rb.facts)

  const factsPath = join(ROOT, "out", "facts.jsonl")
  if (!existsSync(factsPath)) {
    check(
      "facts.jsonl: present",
      false,
      "missing - run bun fixtures/expected.ts"
    )
  } else {
    const onDisk = readFileSync(factsPath, "utf8")
    const same = onDisk === ra.facts
    check(
      "facts.jsonl: matches a fresh reduction",
      same,
      same
        ? `${ra.facts.split("\n").length - 1} lines, ${Buffer.byteLength(ra.facts, "utf8")} B`
        : "regenerate with `bun fixtures/expected.ts`"
    )
    const meta = ra.json.meta as Record<string, number>
    checkFactsContract(
      onDisk,
      (meta.rows_generated as number) -
        (meta.rows_deleted as number) -
        (meta.rows_malformed as number)
    )
  }

  for (const dir of [SCRATCH_A, SCRATCH_B]) {
    rmSync(dir, { recursive: true, force: true })
  }

  console.log()
  if (failures.length > 0) {
    console.error(`FAILED: ${failures.join("; ")}`)
    process.exit(1)
  }
  console.log("all fixture determinism checks passed")
}

main()
