import { describe, expect, it } from "vite-plus/test"

import { formatMonth, formatMonthShort, monthAxisTicks } from "./format"

describe("formatMonth", () => {
  it("always names the year", () => {
    // The dynamics series spans five academic years; a bare «июнь» in a
    // tooltip or in the screen-reader table names five different months.
    expect(formatMonth("2024-06", "ru")).toBe("июнь 2024")
    expect(formatMonth("2024-01", "ru")).toBe("янв. 2024")
  })

  it("degrades to the raw key rather than to an invalid date", () => {
    expect(formatMonth("nonsense", "ru")).toBe("nonsense")
    expect(formatMonth("2024-13", "ru")).toBe("2024-13")
  })

  it("drops the year in the short form", () => {
    expect(formatMonthShort("2024-06", "ru")).toBe("июнь")
  })
})

describe("monthAxisTicks", () => {
  const range = (from: string, count: number): string[] => {
    const [year, month] = from.split("-").map(Number)
    return Array.from({ length: count }, (_, index) => {
      const ordinal = year * 12 + month - 1 + index
      return `${String(Math.floor(ordinal / 12))}-${String((ordinal % 12) + 1).padStart(2, "0")}`
    })
  }

  it("keeps every month while they fit", () => {
    const months = range("2025-09", 12)
    expect(monthAxisTicks(months)).toEqual(months)
  })

  it("uses one fixed step over a long range", () => {
    // The defect this replaces: width-based thinning produced a 2-3-4-month
    // step, and the axis could not be counted along.
    const ticks = monthAxisTicks(range("2021-12", 57))
    const gaps = new Set(
      ticks.slice(1).map((month, index) => {
        const previous = ticks[index] ?? ""
        return (
          (Number(month.slice(0, 4)) - Number(previous.slice(0, 4))) * 12 +
          (Number(month.slice(5)) - Number(previous.slice(5)))
        )
      })
    )
    expect([...gaps]).toEqual([6])
    expect(ticks.length).toBeLessThanOrEqual(12)
  })

  it("anchors the step on September so academic years start on a tick", () => {
    const ticks = monthAxisTicks(range("2021-12", 57))
    expect(ticks).toContain("2022-09")
    expect(ticks).toContain("2025-09")
  })

  it("steps by calendar month, not by array index", () => {
    // The server omits months that hold no data; index stepping would drift
    // across such a gap and the axis would silently mislabel itself.
    // Sep, Oct, Nov, [Dec missing], Jan, Feb. Index stepping by two would end
    // at February; stepping by calendar month lands on January.
    const withGap = range("2024-09", 6).filter((month) => month !== "2024-12")
    expect(monthAxisTicks(withGap, 3)).toEqual([
      "2024-09",
      "2024-11",
      "2025-01",
    ])
  })

  it("returns nothing for an empty series", () => {
    expect(monthAxisTicks([])).toEqual([])
  })
})
