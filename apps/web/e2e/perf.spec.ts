import { expect, test } from "@playwright/test"

/**
 * TZ §7 / §10.7 - "время загрузки ≤ 3 с" - as the D9 CI budget (PLAN.md W2.7:
 * "LCP measured on a throttled profile", "LCP under the D9 budget").
 *
 * The measurement is Largest Contentful Paint on the public dashboard, taken
 * on a deliberately slow profile: 4× CPU throttling plus a Fast-3G-shaped
 * network. That is the point of the number - an unthrottled localhost figure
 * would pass on any machine and mean nothing about a phone on campus Wi-Fi.
 *
 * The suite is measured against a **production** build (`vp preview`); a
 * dev-server figure would be measuring Vite, not the application.
 */

/** Hard budget. Exceeding it fails the gate (D9). */
const LCP_BUDGET_MS = 3000

/** Soft budget: still green, but printed so the trend is visible. */
const LCP_WARN_MS = 2000

/** Chrome DevTools "Fast 3G". */
const FAST_3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
}

test.describe("performance", () => {
  test("LCP on the public dashboard stays inside the D9 budget", async ({
    page,
    browserName,
  }) => {
    // CDP is Chromium-only; the budget is asserted on the engine CI runs.
    test.skip(browserName !== "chromium", "CPU/network throttling needs CDP")
    // A throttled cold load has to be allowed to finish before it is judged.
    test.setTimeout(120_000)

    const client = await page.context().newCDPSession(page)
    await client.send("Network.enable")
    await client.send("Network.emulateNetworkConditions", FAST_3G)
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 })

    // Observing from `addInitScript` catches the very first LCP candidate,
    // which a post-load `PerformanceObserver` would miss.
    await page.addInitScript(() => {
      const store = { value: 0 }
      Object.defineProperty(window, "__lcp", { value: store })
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          store.value = Math.max(store.value, entry.startTime)
        }
      }).observe({ type: "largest-contentful-paint", buffered: true })
    })

    await page.goto("/?period=year", { waitUntil: "networkidle" })

    // LCP is only final once the page stops producing candidates; a real user
    // interaction is what freezes it, so nudge it the way the spec does.
    await page.evaluate(() => {
      window.dispatchEvent(new Event("beforeunload"))
    })

    const lcp = await page.evaluate(
      () => (window as unknown as { __lcp: { value: number } }).__lcp.value
    )

    expect(lcp, "an LCP candidate must have been recorded").toBeGreaterThan(0)

    const rounded = Math.round(lcp)
    if (lcp > LCP_WARN_MS) {
      console.warn(
        `[perf] LCP ${String(rounded)} ms exceeds the ${String(
          LCP_WARN_MS
        )} ms soft budget (hard budget ${String(LCP_BUDGET_MS)} ms)`
      )
    } else {
      console.log(
        `[perf] LCP ${String(rounded)} ms (budget ${String(LCP_BUDGET_MS)} ms)`
      )
    }

    expect(lcp).toBeLessThan(LCP_BUDGET_MS)

    await client.detach()
  })
})
