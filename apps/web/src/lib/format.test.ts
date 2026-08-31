import { describe, expect, it } from "vite-plus/test"

import {
  formatCount,
  formatDate,
  formatDateTime,
  formatDecimal,
  formatPercentPoints,
  formatShare,
} from "./format"

/**
 * The page's number precision is part of the acceptance surface: these are the
 * exact strings the KPI cards print for the `academic-year-2025-2026` scenario
 * in `fixtures/expected.json` - 20 800 checks, mean originality 76.4711, share
 * below the threshold 0.2936.
 *
 * KK is asserted against the Kazakhstani convention, not against whatever CLDR
 * data the runtime happens to carry for the `kk` tag (see `intlLocale`).
 */
const NBSP = " "

describe("format", () => {
  it("groups counts per locale", () => {
    expect(formatCount(20800, "ru")).toBe(`20${NBSP}800`)
    expect(formatCount(20800, "kk")).toBe(`20${NBSP}800`)
    expect(formatCount(20800, "en")).toBe("20,800")
  })

  it("prints a percentage-point value with two decimals", () => {
    expect(formatPercentPoints(76.4711, "ru")).toBe(`76,47${NBSP}%`)
    expect(formatPercentPoints(76.4711, "kk")).toBe(`76,47${NBSP}%`)
    expect(formatPercentPoints(76.4711, "en")).toBe("76.47%")
  })

  it("prints a 0..1 share as a percentage", () => {
    expect(formatShare(0.2936, "ru")).toBe(`29,36${NBSP}%`)
    expect(formatShare(0.2936, "en")).toBe("29.36%")
  })

  it("formats decimals with a fixed fraction width", () => {
    expect(formatDecimal(1.5, "ru", 2)).toBe("1,50")
    expect(formatDecimal(1.5, "en", 0)).toBe("2")
  })

  it("formats an ISO date per locale and echoes unparseable input", () => {
    expect(formatDate("2025-09-01", "ru")).toBe("01.09.2025")
    expect(formatDate("2026-08-31", "kk")).toBe("31.08.2026")
    expect(formatDate("2025-09-01", "en")).toBe("09/01/2025")
    expect(formatDate("not-a-date", "ru")).toBe("not-a-date")
  })

  it("echoes an unparseable instant rather than printing Invalid Date", () => {
    expect(formatDateTime("nonsense", "ru")).toBe("nonsense")
  })

  it("formats KK the Kazakhstani way even where the runtime lacks kk patterns", () => {
    // The `kk` CLDR data is absent in some browsers and falls back to the root
    // locale (`20,800`, `76.47%`), which would also desynchronise SSR from
    // hydration. `intlLocale` pins the convention instead.
    expect(formatCount(1234567, "kk")).toBe(formatCount(1234567, "ru"))
    expect(formatShare(0.5, "kk")).toBe(formatShare(0.5, "ru"))
    expect(formatDate("2025-11-30", "kk")).toBe(formatDate("2025-11-30", "ru"))
  })
})
