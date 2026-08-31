import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import type { Locator, Page, Response } from "@playwright/test"
import { expect } from "@playwright/test"

import {
  FIXTURE_ACCOUNTS,
  FIXTURE_PASSWORD,
  type FixtureAccount,
} from "../../../fixtures/accounts"

/**
 * Shared vocabulary for the e2e suite: the fixture truth, the numbers as the
 * page prints them, and the sign-in.
 *
 * Nothing here softens an assertion. `normalizeSpace` exists because `Intl`
 * groups thousands and separates a percent sign with U+00A0, so an expected
 * string written with an ordinary space would fail on the whitespace and say
 * nothing about the value. Both sides are normalized instead.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
export const repoRoot = path.resolve(here, "../../..")

/* ── fixtures/expected.json ───────────────────────────────────────────────── */

interface ScenarioFilters {
  from: string
  to: string
  faculty: string | null
  department: string | null
  program: string | null
  workType: string | null
  status: string | null
}

interface ScenarioSummary {
  checks: number
  avg_originality: number
  below_threshold: number
  below_threshold_share: number
}

interface ScenarioUnit {
  faculty: string
  department: string
  checks: number
  avg_originality: number
}

/**
 * One published row of the public contour (ADR-016). `checks: 0` means the
 * group had no released cube cell, so the page prints «недостаточно данных»
 * rather than a number.
 */
interface PublicRow {
  checks: number
  avg_originality: number
}

/**
 * The **public** view of a scenario, computed by the same independent reducer:
 * sums over `(month, faculty, work type)` cells of at least `k` checks, over a
 * window snapped to whole months. These are the numbers the public dashboard
 * must print; `summary`/`units` above are the *internal* contour's, and the two
 * differ by exactly the withheld cells.
 */
interface Scenario {
  name: string
  filters: ScenarioFilters
  summary: ScenarioSummary
  units: ScenarioUnit[]
  public_filters: {
    from: string
    to: string
    faculty: string | null
    work_type: string | null
  }
  public_summary: {
    checks: number
    avg_originality: number
    below_threshold: number
    below_threshold_share: number
    escalated: number
    suppressed_groups: number
  }
  public_timeseries: (PublicRow & { month: string })[]
  public_work_types: (PublicRow & { code: string })[]
  public_faculties: (PublicRow & { code: string })[]
  public_histogram: Record<string, number>
  public_yoy: (PublicRow & { academic_year: number })[]
}

interface Expected {
  meta: { seed: number; scale: string; rows_generated: number }
  scenarios: Scenario[]
}

const expected = JSON.parse(
  readFileSync(path.join(repoRoot, "fixtures", "expected.json"), "utf8")
) as Expected

/** The brute-force truth for one named scenario. Never edit it to pass. */
export function scenario(name: string): Scenario {
  const found = expected.scenarios.find((item) => item.name === name)
  if (!found) {
    throw new Error(
      `fixtures/expected.json has no scenario "${name}" (have: ${expected.scenarios
        .map((item) => item.name)
        .join(", ")})`
    )
  }
  return found
}

/**
 * The public row for one faculty of a scenario - the number the public page
 * must print, or `checks: 0` when every cell of that faculty was withheld.
 */
export function publicFaculty(
  scenarioName: string,
  code: string
): PublicRow & { code: string } {
  const row = scenario(scenarioName).public_faculties.find(
    (item) => item.code === code
  )
  if (!row) {
    throw new Error(
      `scenario "${scenarioName}" has no public faculty row for ${code}`
    )
  }
  return row
}

/** Department codes of one faculty, in the order the fixture lists them. */
export function departmentsOf(scenarioName: string, faculty: string): string[] {
  return scenario(scenarioName)
    .units.filter((unit) => unit.faculty === faculty)
    .map((unit) => unit.department)
}

/* ── The page's own formatting ────────────────────────────────────────────── */

/**
 * `lib/format.ts` formats every figure through `ru-KZ` - space grouping,
 * decimal comma - for all three locales, so the expected strings are built the
 * same way rather than hand-written.
 */
const INTL_TAG = "ru-KZ"

/** `20800` → `"20 800"`, as `formatCount` prints it. */
export function count(value: number): string {
  return normalizeSpace(
    new Intl.NumberFormat(INTL_TAG, { maximumFractionDigits: 0 }).format(value)
  )
}

/** `76.4711` → `"76,47 %"`, as `formatPercentPoints` prints it. */
export function percentPoints(value: number): string {
  return normalizeSpace(
    new Intl.NumberFormat(INTL_TAG, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  )
}

/**
 * Collapses runs of whitespace to a single ASCII space. JavaScript's `\s`
 * already covers U+00A0 and U+202F, which is exactly what `Intl` groups
 * thousands and separates a percent sign with.
 */
export function normalizeSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

/* ── Page vocabulary ──────────────────────────────────────────────────────── */

/** Russian copy the suite asserts on, quoted from `messages/ru.json`. */
export const RU = {
  insufficientData: "недостаточно данных",
  outOfScope: "вне вашей области видимости",
  sectionOverview: "Обзорная сводка",
  sectionDynamics: "Динамика во времени",
} as const

/** Kazakh copy, quoted from `messages/kk.json` (TZ §7). */
export const KK = {
  sectionOverview: "Шолу қорытындысы",
  sectionDynamics: "Уақыт бойынша динамика",
} as const

/** The headline value of one KPI card (`data-testid` set in `KpiCard`). */
export function kpi(page: Page, name: string): Locator {
  return page.getByTestId(name).getByTestId("kpi-value")
}

/** Asserts a KPI card prints exactly `text`, whitespace normalized. */
export async function expectKpi(
  page: Page,
  name: string,
  text: string
): Promise<void> {
  const locator = kpi(page, name)
  await expect(locator).toBeVisible()
  await expect
    .poll(async () => normalizeSpace(await locator.innerText()), {
      message: `KPI ${name}`,
    })
    .toBe(text)
}

/* ── Sessions ─────────────────────────────────────────────────────────────── */

/**
 * Signs in through the real `POST /api/auth/login` (ADR-017).
 *
 * The accounts were created by `fixtures/seed.ts` with the `manage-users` CLI,
 * because nothing in the HTTP surface creates one - which is the whole point of
 * the design, and is why the suite cannot mint an identity of its own.
 *
 * `page.request` shares the browser context's cookie jar, so the session cookie
 * this sets is the one the page then carries - the same cookie the sign-in form
 * would have produced, without driving a form that is not what most of these
 * tests are about. Coverage of the form itself lives in `rbac.spec.ts`.
 */
export async function signIn(
  page: Page,
  account: FixtureAccount
): Promise<{ csrf_token: string }> {
  const response = await page.request.post("/api/auth/login", {
    data: { username: account.username, password: FIXTURE_PASSWORD },
  })
  expect(
    response.ok(),
    `login failed for ${account.username}: ${String(response.status())} ` +
      `${await response.text()} - did \`bun fixtures/seed.ts\` run?`
  ).toBe(true)
  return (await response.json()) as { csrf_token: string }
}

/**
 * The seeded accounts, by role. One list, shared with the seeder, so a role
 * added here without a matching account fails to compile rather than at
 * sign-in.
 */
export const IDENTITIES = FIXTURE_ACCOUNTS

/* ── Network capture ──────────────────────────────────────────────────────── */

/**
 * Records the JSON bodies of every API response matching `pathFragment`, so a
 * test can assert on what actually crossed the wire rather than on what the
 * page chose to draw (PLAN.md W3.6 gate: "a dean sees only their faculty in
 * the UI **and** in the network responses").
 */
export function captureApi(page: Page, pathFragment: string): string[] {
  const bodies: string[] = []
  page.on("response", (response: Response) => {
    if (!response.url().includes(pathFragment)) return
    void response
      .text()
      .then((body) => {
        bodies.push(body)
      })
      .catch(() => {
        // A response body can be gone by the time it is asked for (navigation
        // cancelled the request). Nothing to assert about it.
      })
  })
  return bodies
}

/** Every distinct `FAC…` dictionary code mentioned in the captured bodies. */
export function facultyCodesIn(bodies: readonly string[]): Set<string> {
  const codes = new Set<string>()
  for (const body of bodies) {
    for (const match of body.matchAll(/FAC\d+/g)) codes.add(match[0])
  }
  return codes
}

/* ── Waiting ──────────────────────────────────────────────────────────────── */

/**
 * Navigates and waits for the router to settle. The public routes redirect
 * `/` → `/?period=year`, and every section fetches after hydration, so
 * `waitUntil: "networkidle"` is what "the page is showing its numbers" means
 * here - not a timeout.
 */
export async function goto(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: "networkidle" })
}
