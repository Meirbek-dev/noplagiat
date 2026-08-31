import { describe, expect, it } from "vite-plus/test"

import {
  academicYearLabel,
  academicYearOf,
  academicYearRange,
  resolvePreset,
  semesterSpans,
} from "./period"

/**
 * The academic year runs 1 September – 31 August and the semesters split it
 * 01.09–31.01 / 01.02–31.08 (PLAN.md D8). The presets resolved here must agree
 * with the server's own resolution, which the responses echo back.
 */
const IN_AUTUMN = new Date("2025-11-15T00:00:00Z")
const IN_SPRING = new Date("2026-03-10T00:00:00Z")
const ON_THE_BOUNDARY = new Date("2026-08-30T00:00:00Z")

describe("academic year", () => {
  it("starts on 1 September", () => {
    expect(academicYearOf(new Date("2025-08-31T00:00:00Z"))).toBe(2024)
    expect(academicYearOf(new Date("2025-09-01T00:00:00Z"))).toBe(2025)
    expect(academicYearOf(ON_THE_BOUNDARY)).toBe(2025)
  })

  it("labels the year the way the reports do", () => {
    expect(academicYearLabel(2025)).toBe("2025/26")
    expect(academicYearLabel(2099)).toBe("2099/00")
  })

  it("spans September to August", () => {
    expect(academicYearRange(2025)).toEqual({
      from: "2025-09-01",
      to: "2026-08-31",
    })
  })
})

describe("resolvePreset", () => {
  it("resolves the academic year the dashboard defaults to", () => {
    expect(resolvePreset("year", ON_THE_BOUNDARY)).toEqual({
      from: "2025-09-01",
      to: "2026-08-31",
    })
  })

  it("resolves the calendar month", () => {
    expect(resolvePreset("month", IN_AUTUMN)).toEqual({
      from: "2025-11-01",
      to: "2025-11-30",
    })
  })

  it("resolves the semester the date falls in", () => {
    expect(resolvePreset("semester", IN_AUTUMN)).toEqual({
      from: "2025-09-01",
      to: "2026-01-31",
    })
    expect(resolvePreset("semester", IN_SPRING)).toEqual({
      from: "2026-02-01",
      to: "2026-08-31",
    })
  })

  it("resolves the multi-year picks as whole academic years", () => {
    expect(resolvePreset("3y", ON_THE_BOUNDARY)).toEqual({
      from: "2023-09-01",
      to: "2026-08-31",
    })
    expect(resolvePreset("5y", ON_THE_BOUNDARY)).toEqual({
      from: "2021-09-01",
      to: "2026-08-31",
    })
  })
})

describe("semesterSpans", () => {
  it("splits an academic year into two bands", () => {
    expect(semesterSpans("2025-09-01", "2026-08-31")).toEqual([
      {
        id: "autumn-2025",
        kind: "autumn",
        academicYear: 2025,
        from: "2025-09",
        to: "2026-01",
      },
      {
        id: "spring-2025",
        kind: "spring",
        academicYear: 2025,
        from: "2026-02",
        to: "2026-08",
      },
    ])
  })

  it("clips the bands to a range that starts mid-semester", () => {
    expect(semesterSpans("2025-11-01", "2026-03-31")).toEqual([
      {
        id: "autumn-2025",
        kind: "autumn",
        academicYear: 2025,
        from: "2025-11",
        to: "2026-01",
      },
      {
        id: "spring-2025",
        kind: "spring",
        academicYear: 2025,
        from: "2026-02",
        to: "2026-03",
      },
    ])
  })

  it("covers a multi-year range with one band per semester", () => {
    const spans = semesterSpans("2023-09-01", "2026-08-31")
    expect(spans).toHaveLength(6)
    expect(spans[0]?.id).toBe("autumn-2023")
    expect(spans.at(-1)?.id).toBe("spring-2025")
  })

  it("draws no band for a range shorter than two months", () => {
    expect(semesterSpans("2025-11-01", "2025-11-30")).toEqual([])
    expect(semesterSpans("bad", "worse")).toEqual([])
  })
})
