import { expect, test } from "@playwright/test"

import {
  RU,
  count,
  expectKpi,
  goto,
  normalizeSpace,
  percentPoints,
  publicFaculty,
  scenario,
} from "./support"

/**
 * TZ §10.1 - "все метрики п. 4.2 отображаются корректно и соответствуют
 * контрольным выгрузкам" - and TZ §10.2 - "фильтры работают корректно, в том
 * числе в любых комбинациях".
 *
 * Every number asserted here comes from the **`public_*`** blocks of
 * `fixtures/expected.json`, computed by the independent brute-force reducer in
 * `fixtures/expected.ts` under the ADR-016 release rule: sums over
 * `(month, faculty, work type)` cells holding at least `k` checks. The raw
 * `summary`/`units` blocks in the same file are what the *internal* contour
 * publishes, and asserting those here would be asserting the wrong contour.
 *
 * The suite never hard-codes a figure and never adjusts one to match the page.
 */

const AY = scenario("academic-year-2025-2026")
const ALL = scenario("all-time-no-filter")
const NOV = scenario("month-2025-11")
const FAC03 = scenario("faculty-fac03")
/** Every public dimension at once, for the round-trip test. */
const COMBO = scenario("faculty-fac03-worktype-course")

test.describe("public dashboard", () => {
  test("default view shows the current academic year", async ({ page }) => {
    await goto(page, "/")

    // `/` has no period, so the router fills in the default and rewrites the
    // URL - the filter state is always spelled out (TZ §4.3).
    await expect(page).toHaveURL(/[?&]period=year\b/)

    await expectKpi(page, "kpi-total-checks", count(AY.public_summary.checks))
    await expectKpi(
      page,
      "kpi-avg-originality",
      percentPoints(AY.public_summary.avg_originality)
    )

    // The server echoes the range it actually queried; it must be the academic
    // year the fixture scenario describes, not a rolling 12 months.
    await expect(page.getByTestId("applied-period")).toContainText("01.09.2025")
    await expect(page.getByTestId("applied-period")).toContainText("31.08.2026")
  })

  test("?period=5y widens to the whole fixture history", async ({ page }) => {
    await goto(page, "/?period=5y")

    await expectKpi(page, "kpi-total-checks", count(ALL.public_summary.checks))
    await expectKpi(
      page,
      "kpi-avg-originality",
      percentPoints(ALL.public_summary.avg_originality)
    )
  })

  test("a custom November 2025 range withholds the groups under k", async ({
    page,
  }) => {
    await goto(page, "/?period=custom&from=2025-11-01&to=2025-11-30")

    await expectKpi(page, "kpi-total-checks", count(NOV.public_summary.checks))

    const faculties = page.locator("#faculties")
    await expect(faculties).toBeVisible()

    // FAC08 ran three checks that month - below k = 5, so its only cube cell is
    // withheld and the faculty has nothing left to publish.
    const withheld = publicFaculty("month-2025-11", "FAC08")
    expect(withheld.checks, "FAC08 must have no released cell").toBe(0)
    const fac08 = faculties.locator('[data-unit-code="FAC08"]')
    await expect(fac08, "faculty FAC08 row").toHaveCount(1)
    await expect(fac08, "faculty FAC08 cells").toContainText(
      RU.insufficientData
    )

    // FAC05 is no longer collateral damage. Before ADR-016 the total contained
    // FAC08's three checks, so the smallest visible faculty had to be hidden
    // too or `total − Σ visible` would have recovered them. The total no longer
    // contains them, so FAC05 is published.
    const fac05 = publicFaculty("month-2025-11", "FAC05")
    expect(fac05.checks, "FAC05 must be released").toBeGreaterThan(0)
    const fac05Row = faculties.locator('[data-unit-code="FAC05"]')
    await expect(fac05Row).not.toContainText(RU.insufficientData)
    await expect(fac05Row).toContainText(count(fac05.checks))

    // A second faculty above the threshold, so the assertions above are about
    // suppression and not about an empty section.
    const fac04 = publicFaculty("month-2025-11", "FAC04")
    await expect(faculties.locator('[data-unit-code="FAC04"]')).toContainText(
      count(fac04.checks)
    )

    // Exactly one row is withheld, and the published rows sum to the published
    // total - the margin is closed (ADR-016 §2).
    const published = NOV.public_faculties.filter((row) => row.checks > 0)
    expect(NOV.public_faculties.length - published.length).toBe(1)
    expect(published.reduce((total, row) => total + row.checks, 0)).toBe(
      NOV.public_summary.checks
    )
  })

  test("a ragged custom range is answered as whole months", async ({
    page,
  }) => {
    // ADR-016 §1: the public contour snaps the window, and says so - the
    // reader is never misled about which period produced the numbers.
    const october = scenario("custom-range-crossing-month")
    expect(october.filters).toMatchObject({
      from: "2025-10-15",
      to: "2025-11-14",
    })
    expect(october.public_filters).toMatchObject({
      from: "2025-10-01",
      to: "2025-11-30",
    })

    await goto(page, "/?period=custom&from=2025-10-15&to=2025-11-14")

    await expect(page.getByTestId("applied-period")).toContainText("01.10.2025")
    await expect(page.getByTestId("applied-period")).toContainText("30.11.2025")
    await expectKpi(
      page,
      "kpi-total-checks",
      count(october.public_summary.checks)
    )
  })

  test("the faculty filter switches the page to that faculty", async ({
    page,
  }) => {
    await goto(page, "/?period=5y&faculty=FAC03")

    await expectKpi(
      page,
      "kpi-total-checks",
      count(FAC03.public_summary.checks)
    )
    await expectKpi(
      page,
      "kpi-avg-originality",
      percentPoints(FAC03.public_summary.avg_originality)
    )
  })

  test("combined filters produce the combined figure", async ({ page }) => {
    // The one combination the brute-force reducer also computes, so the page
    // is checked against a number nobody typed twice.
    const combo = scenario("faculty-fac03-worktype-course")
    expect(combo.public_filters).toMatchObject({
      faculty: "FAC03",
      work_type: "course",
    })

    await goto(page, "/?period=5y&faculty=FAC03&workType=course")

    await expectKpi(
      page,
      "kpi-total-checks",
      count(combo.public_summary.checks)
    )
    await expectKpi(
      page,
      "kpi-avg-originality",
      percentPoints(combo.public_summary.avg_originality)
    )
  })

  test("the public contour refuses a status filter", async ({ page }) => {
    // ADR-016 §3: `status` left the public filter set, because the released
    // cube cannot carry it without pushing ~5 % of all rows below k. The server
    // answers the parameter with a `422` naming it.
    const refusal = await page.request.get(
      "/api/public/summary?period=5y&status=needs_revision"
    )
    expect(refusal.status()).toBe(422)
    const problem = (await refusal.json()) as {
      type: string
      errors: { field: string }[]
    }
    expect(problem.type).toBe("/problems/validation-failed")
    expect(problem.errors.map((error) => error.field)).toContain("status")

    // And the page offers no way to send it: the control is gone from the
    // public filter bar (it remains on the internal one).
    await goto(page, "/?period=5y")
    await expect(page.getByTestId("filter-status")).toHaveCount(0)

    // A stale bookmark carrying it still renders the unfiltered view rather
    // than an error, because the search schema drops the parameter before the
    // request is built (`normalizePublicQuery`).
    await goto(page, "/?period=5y&status=needs_revision")
    await expectKpi(page, "kpi-total-checks", count(ALL.public_summary.checks))
    await expect(page.locator("#overview").getByRole("alert")).toHaveCount(0)
  })

  test("filter combinations round-trip through the URL and survive a reload", async ({
    page,
  }) => {
    await goto(page, "/")

    // Every public dimension at once (TZ §4.3 "в любых комбинациях"), each set
    // through its own control rather than by typing a URL.
    await page.getByRole("button", { name: "5 лет", exact: true }).click()
    await page.getByTestId("filter-faculty").selectOption("FAC03")

    // The last control is what makes the combination complete, so the wait is
    // armed on the response that carries all three dimensions at once. Reading
    // the card before that response lands would compare a stale headline
    // against a fresh one and pass or fail on timing.
    const combined = page.waitForResponse(
      (response) =>
        response.url().includes("/api/public/summary") &&
        ["period=5y", "faculty=FAC03", "work_type=course"].every((parameter) =>
          response.url().includes(parameter)
        ) &&
        response.ok()
    )
    await page.getByTestId("filter-work-type").selectOption("course")
    await combined

    const expectedParams = {
      period: "5y",
      faculty: "FAC03",
      workType: "course",
    }

    expect(paramsOf(page.url())).toMatchObject(expectedParams)

    // The awaited response is a *network* event; the card is re-rendered a
    // commit later. Reading `innerText` straight after it therefore races the
    // render, and on a loaded single-worker runner it loses - it caught the
    // pre-filter academic-year view and failed on chromium in CI while the
    // same test passed on the three slower engines.
    //
    // So settle on the figure the combination is supposed to produce, which
    // `expectKpi` polls for. That is also a stronger assertion than the
    // "different from the unfiltered page" it replaces: the number comes from
    // the same independent reducer as every other figure in this suite.
    await expectKpi(
      page,
      "kpi-total-checks",
      count(COMBO.public_summary.checks)
    )

    const headline = normalizeSpace(
      await page.getByTestId("kpi-total-checks").innerText()
    )
    // A combination that actually narrowed the data - otherwise "the same
    // number before and after a reload" would be a tautology about the
    // unfiltered page.
    expect(headline).not.toContain(count(AY.public_summary.checks))

    // Bookmarkability is the point of writing filters into the URL: the same
    // link must rebuild the same view from a cold load.
    await page.reload({ waitUntil: "networkidle" })

    expect(paramsOf(page.url())).toMatchObject(expectedParams)
    await expect(page.getByTestId("filter-faculty")).toHaveValue("FAC03")
    await expect(page.getByTestId("filter-work-type")).toHaveValue("course")
    await expect(
      page.getByRole("button", { name: "5 лет", exact: true })
    ).toHaveAttribute("aria-pressed", "true")

    await expect
      .poll(
        async () =>
          normalizeSpace(
            await page.getByTestId("kpi-total-checks").innerText()
          ),
        { message: "KPI after reload" }
      )
      .toBe(headline)
  })

  test("every view of one filter shows the same total", async ({ page }) => {
    // ADR-016 §2 on the wire: one cube, one rounding. The breakdown totals and
    // the overview headline are the same number, which is the property that
    // made the margin attacks arithmetic rather than disclosure.
    await goto(page, "/?period=5y")

    const total = ALL.public_summary.checks
    expect(ALL.public_faculties.reduce((sum, row) => sum + row.checks, 0)).toBe(
      total
    )
    expect(
      ALL.public_work_types.reduce((sum, row) => sum + row.checks, 0)
    ).toBe(total)
    expect(ALL.public_yoy.reduce((sum, row) => sum + row.checks, 0)).toBe(total)
    expect(
      ALL.public_timeseries.reduce((sum, row) => sum + row.checks, 0)
    ).toBe(total)

    await expectKpi(page, "kpi-total-checks", count(total))
    // The faculty heatmap prints the same released counts the sum above used,
    // so the headline and the breakdown cannot drift apart on screen either.
    const faculties = page.locator("#faculties")
    for (const row of ALL.public_faculties.filter((item) => item.checks > 0)) {
      await expect(
        faculties.locator(`[data-unit-code="${row.code}"]`),
        `faculty ${row.code}`
      ).toContainText(count(row.checks))
    }
  })

  test("every section of the public contour renders", async ({ page }) => {
    await goto(page, "/?period=year")

    // TZ §4.2 sections 1, 2, 3, 5 and 9 plus the faculty aggregate and the
    // published reports (PLAN.md W2.4).
    for (const id of [
      "overview",
      "dynamics",
      "work-types",
      "histogram",
      "faculties",
      "yoy",
      "reports",
    ]) {
      await expect(page.locator(`#${id}`), `section #${id}`).toBeVisible()
      await expect(
        page.locator(`#${id}`).getByRole("alert"),
        `section #${id} must not be in its error state`
      ).toHaveCount(0)
    }

    await expect(
      page.getByRole("heading", { name: RU.sectionOverview })
    ).toBeVisible()
  })
})

/** The search params of a URL as a plain object. */
function paramsOf(url: string): Record<string, string> {
  return Object.fromEntries(new URL(url).searchParams)
}
