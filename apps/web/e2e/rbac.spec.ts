import { expect, test } from "@playwright/test"

import {
  IDENTITIES,
  RU,
  captureApi,
  count,
  departmentsOf,
  expectKpi,
  facultyCodesIn,
  goto,
  scenario,
  signIn,
} from "./support"

/**
 * TZ §10.5, UI half: "пользователь каждой роли видит только предусмотренные
 * для него данные".
 *
 * The API half - every role × every endpoint × in/out-of-scope - is the
 * table-driven Rust matrix (PLAN.md W3.2), and that is the acceptance evidence
 * for authorization itself. What this file proves is the other half of the
 * W3.6 gate: a dean sees only their faculty **in the UI and in the network
 * responses**, and each role lands where the router says it should.
 */

const FAC03 = scenario("faculty-fac03")
const DEP11 = scenario("department-dep11")

test.describe("route guards", () => {
  test("an anonymous visitor is sent to sign-in", async ({ page }) => {
    await goto(page, "/app")

    await expect(page).toHaveURL(/\/login\b/)
    await expect(
      page.getByRole("heading", { name: "Вход во внутренний контур" })
    ).toBeVisible()
    // The guard remembers where the visitor was going.
    expect(new URL(page.url()).searchParams.get("redirect")).toContain("/app")
  })

  test("ППС land on the access-request page, not on a 403", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.staff)
    await goto(page, "/app")

    await expect(page).toHaveURL(/\/app\/request-access\b/)
    await expect(
      page.getByRole("heading", { name: "Доступ к внутреннему контуру" })
    ).toBeVisible()
  })

  test("an account with no grant lands on the access-request page", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.roleless)
    await goto(page, "/app")

    await expect(page).toHaveURL(/\/app\/request-access\b/)
  })

  test("a dean is bounced out of the admin area into their own contour", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.deanFac03)
    await goto(page, "/admin")

    await expect(page).toHaveURL(/\/app(\?|$)/)
  })

  test("an administrator reaches the admin area", async ({ page }) => {
    await signIn(page, IDENTITIES.admin)
    await goto(page, "/admin")

    await expect(page).toHaveURL(/\/admin\b/)
    await expect(page.getByRole("heading").first()).toBeVisible()
  })
})

test.describe("scope", () => {
  test("a dean sees their faculty's numbers and no other faculty's", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.deanFac03)
    const clientCalls = captureApi(page, "/api/internal/")

    // Two different wires carry this data and both have to be clean.
    //
    // The first load is server-rendered: the loaders run inside the Node
    // renderer and their answers reach the browser dehydrated into the HTML
    // document, so the document *is* the response for that hop.
    const document = await page.goto("/app?period=5y", {
      waitUntil: "networkidle",
    })
    expect(document?.status()).toBe(200)
    const ssrPayload = (await document?.text()) ?? ""

    await expectKpi(page, "kpi-total-checks", count(FAC03.summary.checks))

    expect(
      [...facultyCodesIn([ssrPayload])].sort(),
      "faculty codes in the server-rendered payload"
    ).toEqual(["FAC03"])

    // The second is the client hop. It is taken on the unit matrix, because
    // that is the endpoint that actually carries dictionary codes - asserting
    // "no foreign faculty" against `/summary`, which names no faculty at all,
    // would pass without proving anything.
    await goto(page, "/app/units?period=5y")
    clientCalls.length = 0

    await page.getByRole("button", { name: "3 года", exact: true }).click()
    await expect
      .poll(() => facultyCodesIn(clientCalls).size, {
        message: "faculty codes seen in browser-fetched internal responses",
      })
      .toBeGreaterThan(0)

    expect(
      [...facultyCodesIn(clientCalls)].sort(),
      "faculty codes in the client-fetched responses"
    ).toEqual(["FAC03"])
  })

  test("a dean's unit matrix lists exactly their own departments", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.deanFac03)
    await goto(page, "/app/units?period=5y")

    // One faculty row only - the dean's.
    const faculties = page.locator('tr[data-unit-kind="faculty"]')
    await expect(faculties).toHaveCount(1)
    await expect(faculties).toHaveAttribute("data-unit-code", "FAC03")

    // The matrix opens collapsed; the departments are behind the expander.
    await faculties.getByRole("button").click()

    const expectedCodes = departmentsOf("faculty-fac03", "FAC03").map(
      (code) => `FAC03/${code}`
    )
    expect(expectedCodes).toEqual([
      "FAC03/DEP11",
      "FAC03/DEP12",
      "FAC03/DEP13",
      "FAC03/DEP14",
      "FAC03/DEP15",
    ])

    const departments = page.locator('tr[data-unit-kind="department"]')
    await expect(departments).toHaveCount(expectedCodes.length)
    expect(
      await departments.evaluateAll((rows) =>
        rows.map((row) => row.getAttribute("data-unit-code"))
      )
    ).toEqual(expectedCodes)
  })

  test("a department head sees their department's numbers", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.headDep11)
    await goto(page, "/app?period=5y")

    await expectKpi(page, "kpi-total-checks", count(DEP11.summary.checks))
  })

  test("an out-of-scope filter explains itself instead of failing", async ({
    page,
  }) => {
    await signIn(page, IDENTITIES.deanFac03)

    // `ScopeGuard::narrow` refuses rather than quietly returning no rows, and
    // the section turns that 403 into a sentence (`lib/errors.ts`).
    await goto(page, "/app?period=5y&faculty=FAC01")

    const overview = page.locator("#overview")
    await expect(overview.getByRole("alert")).toBeVisible()
    await expect(overview).toContainText(RU.outOfScope)
    // And it must not have quietly shown someone else's numbers.
    await expect(page.getByTestId("kpi-total-checks")).toHaveCount(0)
  })
})
