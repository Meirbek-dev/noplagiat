import { readFileSync } from "node:fs"
import path from "node:path"

import type { Page } from "@playwright/test"
import { expect, test } from "@playwright/test"

import { count, goto, repoRoot, scenario } from "./support"

/**
 * The portal widget (TZ §8, PLAN.md W2.5).
 *
 * The host page under test is `deploy/embed-snippet.html` itself - the file
 * handed to the portal team - rather than a bespoke harness, so a change that
 * breaks the snippet breaks this test. Only the placeholder origin is
 * rewritten to the address the suite is actually serving; the markup, the
 * listener and its origin checks are the shipped ones.
 */

const AY = scenario("academic-year-2025-2026")
const SNIPPET = path.join(repoRoot, "deploy", "embed-snippet.html")

/** The origin the committed snippet points at, replaced with the live one. */
const SNIPPET_ORIGIN = "http://localhost:3000"

/** A path under the app's own origin, served by route interception. */
const HOST_PATH = "/__e2e__/embed-host.html"

/** The snippet's stylesheet height, kept as the no-JS fallback. */
const FALLBACK_HEIGHT = 420

/**
 * Serves the real snippet at {@link HOST_PATH}, optionally re-pointing the
 * iframe at another section.
 */
async function serveHost(
  page: Page,
  baseURL: string,
  search?: string
): Promise<void> {
  await page.route(`**${HOST_PATH}`, async (route) => {
    let html = readFileSync(SNIPPET, "utf8").replaceAll(SNIPPET_ORIGIN, baseURL)
    if (search !== undefined) {
      html = html.replace(/\/embed\?[^"]*/, `/embed?${search}`)
    }
    await route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: html,
    })
  })
}

test.describe("embed widget", () => {
  test("the host snippet resizes the iframe from np-embed-height messages", async ({
    page,
    baseURL,
  }) => {
    expect(baseURL).toBeTruthy()
    await serveHost(page, baseURL ?? "")

    // Record what the frame posts, so the assertion below is about the
    // message contract and not only about a box that happens to be tall.
    await page.addInitScript(() => {
      const heights: number[] = []
      Object.defineProperty(window, "__npHeights", { value: heights })
      window.addEventListener("message", (event: MessageEvent<unknown>) => {
        const data: unknown = event.data
        if (
          typeof data === "object" &&
          data !== null &&
          (data as { type?: unknown }).type === "np-embed-height"
        ) {
          heights.push(Number((data as { height?: unknown }).height))
        }
      })
    })

    await goto(page, HOST_PATH)

    const frame = page.locator("#np-embed-frame")
    await expect(frame).toBeVisible()

    // The widget must actually render before its height means anything.
    const widget = page.frameLocator("#np-embed-frame")
    await expect(widget.getByTestId("kpi-total-checks")).toContainText(
      count(AY.public_summary.checks)
    )

    await expect
      .poll(
        () =>
          page.evaluate(
            () => (window as unknown as { __npHeights: number[] }).__npHeights
          ),
        { message: "np-embed-height messages received by the host" }
      )
      .not.toHaveLength(0)

    // The snippet's stylesheet sizes the frame at 420px as a no-JS fallback;
    // an inline height can only have come from the message handler.
    await expect
      .poll(
        () =>
          frame.evaluate((element: HTMLIFrameElement) => element.style.height),
        { message: "inline height written by the host listener" }
      )
      .toMatch(/^\d+px$/)

    const inline = await frame.evaluate(
      (element: HTMLIFrameElement) => element.style.height
    )
    const height = Number.parseInt(inline, 10)

    // 420px is the stylesheet's no-JS fallback, so any other value can only
    // have been written by the height listener.
    expect(height).toBeGreaterThan(0)
    expect(height).not.toBe(FALLBACK_HEIGHT)

    // The frame is sized to its content, with no nested scrollbar.
    const rendered = (await frame.boundingBox())?.height ?? 0
    expect(Math.abs(rendered - height)).toBeLessThan(2)
    const content = await widget.locator("body > div").first().boundingBox()
    expect(Math.abs((content?.height ?? 0) - height)).toBeLessThan(2)
  })

  test("the reported height tracks the section being rendered", async ({
    page,
    baseURL,
  }) => {
    const measure = async (search: string): Promise<number> => {
      await serveHost(page, baseURL ?? "", search)
      await goto(page, HOST_PATH)
      const frame = page.locator("#np-embed-frame")
      await expect
        .poll(() =>
          frame.evaluate((element: HTMLIFrameElement) => element.style.height)
        )
        .toMatch(/^\d+px$/)
      return Number.parseInt(
        await frame.evaluate(
          (element: HTMLIFrameElement) => element.style.height
        ),
        10
      )
    }

    // Four KPI cards in a row against a nine-row heat map: if the widget
    // reported a constant, these would be equal.
    const summary = await measure("section=summary&period=year")
    await page.unrouteAll({ behavior: "ignoreErrors" })
    const faculties = await measure("section=faculties&period=year")

    expect(faculties).toBeGreaterThan(summary)
  })

  test("the widget carries no page chrome", async ({ page }) => {
    await goto(page, "/embed?section=summary&period=year")

    // TZ §8: chromeless. A header, a nav or the brand lockup inside an iframe
    // on the portal would duplicate the portal's own.
    await expect(page.locator("header")).toHaveCount(0)
    await expect(page.locator("nav")).toHaveCount(0)
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(0)
    // The filter bar belongs to the dashboard; the host controls the widget
    // through the query string instead.
    await expect(page.getByRole("button", { name: "5 лет" })).toHaveCount(0)
  })

  test("?section renders that section and nothing else", async ({ page }) => {
    await goto(page, "/embed?section=summary&period=year")
    await expect(page.getByTestId("kpi-total-checks")).toContainText(
      count(AY.public_summary.checks)
    )
    await expect(page.locator("[data-unit-code]")).toHaveCount(0)

    await goto(page, "/embed?section=faculties&period=year")
    await expect(page.locator('[data-unit-code="FAC01"]')).toHaveCount(1)
    await expect(page.getByTestId("kpi-total-checks")).toHaveCount(0)

    await goto(page, "/embed?section=histogram&period=year")
    await expect(page.locator("figure")).toHaveCount(1)
    await expect(page.getByTestId("kpi-total-checks")).toHaveCount(0)
    await expect(page.locator("[data-unit-code]")).toHaveCount(0)
  })

  test("the widget honours the filters the host puts in the query string", async ({
    page,
  }) => {
    await goto(page, "/embed?section=summary&period=5y")
    await expect(page.getByTestId("kpi-total-checks")).toContainText(
      count(scenario("all-time-no-filter").public_summary.checks)
    )
  })
})
