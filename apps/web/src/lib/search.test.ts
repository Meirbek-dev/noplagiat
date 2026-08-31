import { describe, expect, it } from "vite-plus/test"
import * as v from "valibot"

import {
  EMBED_SECTIONS,
  PERIOD_PRESETS,
  dashboardSearchSchema,
  embedSearchSchema,
  publicSearchSchema,
} from "./search"

/**
 * TZ §4.3: every filter combination is encoded in the URL. These are the
 * round-trip gates - what `validateSearch` accepts must come back unchanged,
 * so a bookmarked or shared link renders the same view.
 */
describe("dashboardSearchSchema", () => {
  it("defaults to the academic-year period", () => {
    expect(v.parse(dashboardSearchSchema, {})).toEqual({ period: "year" })
  })

  it("round-trips every period preset", () => {
    for (const period of PERIOD_PRESETS) {
      const input =
        period === "custom"
          ? { period, from: "2025-11-01", to: "2025-11-30" }
          : { period }
      expect(v.parse(dashboardSearchSchema, input), period).toMatchObject(input)
    }
  })

  it("round-trips a full filter set", () => {
    const filters = {
      period: "custom",
      from: "2024-09-01",
      to: "2025-08-31",
      faculty: "FAC03",
      department: "DEP11",
      program: "OP-1",
      workType: "thesis_bachelor",
      status: "accepted",
      lang: "kk",
    }
    expect(v.parse(dashboardSearchSchema, filters)).toMatchObject(filters)
  })

  it("keeps the locale override so a navigation cannot drop it", () => {
    expect(v.parse(dashboardSearchSchema, { lang: "en" }).lang).toBe("en")
    expect(v.safeParse(dashboardSearchSchema, { lang: "de" }).success).toBe(
      false
    )
  })

  it("rejects malformed dates, unknown statuses and unknown presets", () => {
    expect(
      v.safeParse(dashboardSearchSchema, { from: "01.09.2024" }).success
    ).toBe(false)
    expect(
      v.safeParse(dashboardSearchSchema, { status: "unknown" }).success
    ).toBe(false)
    expect(
      v.safeParse(dashboardSearchSchema, { period: "decade" }).success
    ).toBe(false)
  })
})

describe("publicSearchSchema", () => {
  /**
   * ADR-016 §3: the public released cube cannot carry `status`, so the server
   * removed the parameter and answers it with a 422. The schema must not
   * carry it either - otherwise a bookmarked URL would put it back on the wire.
   */
  it("carries no internal-only dimension", () => {
    const parsed = v.parse(publicSearchSchema, {
      period: "year",
      faculty: "FAC03",
      workType: "course",
      status: "accepted",
      department: "DEP11",
      program: "PROG01",
    })
    expect(parsed).toEqual({
      period: "year",
      faculty: "FAC03",
      workType: "course",
    })
    expect(Object.keys(parsed)).not.toContain("status")
    expect(Object.keys(parsed)).not.toContain("department")
    expect(Object.keys(parsed)).not.toContain("program")
  })

  it("still carries the public dimensions and the locale override", () => {
    expect(
      v.parse(publicSearchSchema, {
        period: "custom",
        from: "2025-10-15",
        to: "2025-11-14",
        lang: "kk",
      })
    ).toEqual({
      period: "custom",
      from: "2025-10-15",
      to: "2025-11-14",
      lang: "kk",
    })
  })

  /** The internal schema is the public one plus the three extra dimensions. */
  it("is a subset of the internal schema", () => {
    const publicKeys = Object.keys(publicSearchSchema.entries)
    const internalKeys = Object.keys(dashboardSearchSchema.entries)
    for (const key of publicKeys) expect(internalKeys).toContain(key)
    expect(internalKeys).toEqual([
      ...publicKeys,
      "department",
      "program",
      "status",
    ])
  })
})

describe("embedSearchSchema", () => {
  it("defaults to the summary section and keeps the dashboard filters", () => {
    expect(v.parse(embedSearchSchema, {})).toEqual({
      period: "year",
      section: "summary",
    })
  })

  it("round-trips every embeddable section", () => {
    for (const section of EMBED_SECTIONS) {
      expect(
        v.parse(embedSearchSchema, { section, faculty: "FAC08" }),
        section
      ).toMatchObject({ section, faculty: "FAC08" })
    }
  })

  it("rejects a section the widget cannot render", () => {
    expect(
      v.safeParse(embedSearchSchema, { section: "rechecks" }).success
    ).toBe(false)
  })
})
