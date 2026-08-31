import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "@playwright/test"

import { goto } from "./support"

/**
 * TZ §10.8 / §8 - WCAG 2.1 AA - and the PLAN.md W2.7 gate: "zero axe
 * violations of impact ≥ serious" on the public and embed routes.
 *
 * The scan runs on the fully loaded page, after every section has resolved:
 * a skeleton has no chart in it, and scanning one would pass for the wrong
 * reason.
 *
 * Light palette only, deliberately. `tokens.css` defines a dark palette under
 * a `.dark` class, but nothing in the app sets that class - there is no theme
 * switch and no `prefers-color-scheme` binding - so dark is not a state a
 * visitor can reach and scanning it would gate the build on a surface that
 * does not ship. Forcing the class does surface a real latent defect, recorded
 * for the `app` lane rather than hidden here: in `.dark`, `--primary`
 * (`oklch(0.62 0.09 258)`) is tuned as a *foreground* navy, while
 * `BrandHeader` uses it as a background under white `--primary-foreground`,
 * which lands under 4.5:1. That is a token decision, not an e2e one.
 */

/** WCAG 2.1 A/AA, which is what the brandbook and the TZ actually require. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

const BLOCKING = new Set(["serious", "critical"])

interface Finding {
  id: string
  impact: string
  help: string
  nodes: string[]
}

async function scan(page: Page): Promise<Finding[]> {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  return results.violations
    .filter((violation) => BLOCKING.has(violation.impact ?? ""))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact ?? "unknown",
      help: violation.help,
      nodes: violation.nodes.slice(0, 4).map((node) => node.html),
    }))
}

test.describe("accessibility", () => {
  test("the public dashboard has no serious or critical violations", async ({
    page,
  }) => {
    await goto(page, "/?period=year")
    // The heat map is the last section to paint; scanning before it exists
    // would skip exactly the markup most likely to fail.
    await expect(page.locator('[data-unit-code="FAC01"]')).toHaveCount(1)

    expect(await scan(page)).toEqual([])
  })

  test("the embed widget has no serious or critical violations", async ({
    page,
  }) => {
    await goto(page, "/embed?section=summary&period=year")
    await expect(page.getByTestId("kpi-total-checks")).toBeVisible()

    expect(await scan(page)).toEqual([])
  })

  test("the embed heat map has no serious or critical violations", async ({
    page,
  }) => {
    // The heat map is hand-rolled SVG rather than a library mark
    // (`UnitHeatmap`), so it is the wrapper most worth scanning on its own.
    await goto(page, "/embed?section=faculties&period=year")
    await expect(page.locator('[data-unit-code="FAC01"]')).toHaveCount(1)

    expect(await scan(page)).toEqual([])
  })
})
