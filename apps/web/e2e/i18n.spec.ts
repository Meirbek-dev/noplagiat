import { expect, test } from "@playwright/test"

import { KK, RU, goto } from "./support"

/**
 * RU ↔ KK (TZ §7, §10.8; PLAN.md W2.6 gate: "e2e switches RU↔KK and asserts
 * translated section titles").
 *
 * The two Kazakh strings asserted here are quoted from
 * `apps/web/messages/kk.json`; the key-parity test in `src/lib/i18n.test.ts`
 * is what guarantees the catalogue is complete, and this test is what
 * guarantees the running page actually reaches it.
 *
 * The resolution order is ADR-007: `?lang` → cookie → browser → RU.
 */

test.describe("localization", () => {
  test("Russian is the default and the document says so", async ({ page }) => {
    await goto(page, "/?period=year")

    await expect(page.locator("html")).toHaveAttribute("lang", "ru")
    await expect(
      page.getByRole("heading", { name: RU.sectionOverview })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: RU.sectionDynamics })
    ).toBeVisible()
  })

  test("the switch translates the page and persists in a cookie", async ({
    page,
    context,
  }) => {
    await goto(page, "/?period=year")

    // The switch is a real link (it must work without JavaScript), so the
    // click is a navigation and the target locale is server-rendered.
    await page.getByRole("link", { name: "Қазақша", exact: true }).click()
    await page.waitForLoadState("networkidle")

    await expect(page).toHaveURL(/[?&]lang=kk\b/)
    await expect(page.locator("html")).toHaveAttribute("lang", "kk")
    await expect(
      page.getByRole("heading", { name: KK.sectionOverview })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: KK.sectionDynamics })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: RU.sectionOverview })
    ).toHaveCount(0)

    // The click also writes paraglide's own cookie, so the choice outlives the
    // query parameter that made it.
    const cookie = (await context.cookies()).find(
      (item) => item.name === "locale"
    )
    expect(cookie?.value, "paraglide `locale` cookie").toBe("kk")

    // A fresh visit with no `?lang` must still be Kazakh.
    await goto(page, "/")
    expect(new URL(page.url()).searchParams.has("lang")).toBe(false)
    await expect(page.locator("html")).toHaveAttribute("lang", "kk")
    await expect(
      page.getByRole("heading", { name: KK.sectionOverview })
    ).toBeVisible()
  })

  test("?lang overrides the cookie", async ({ page, context }) => {
    await context.addCookies([
      { name: "locale", value: "kk", url: "http://localhost" },
    ])

    await goto(page, "/?period=year&lang=ru")

    await expect(page.locator("html")).toHaveAttribute("lang", "ru")
    await expect(
      page.getByRole("heading", { name: RU.sectionOverview })
    ).toBeVisible()
  })
})
