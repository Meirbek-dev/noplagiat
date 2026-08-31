import { describe, expect, it } from "vite-plus/test"
import * as v from "valibot"

import {
  DICTIONARY_QUERY,
  INTERNAL_DICTIONARY_QUERY,
  hasActiveFilters,
  mergeFilters,
  normalizeInternalQuery,
  normalizePublicQuery,
} from "./filters"
import { internalQueries, publicQueries } from "./queries"
import { dashboardSearchSchema } from "./search"

const parse = (input: Record<string, unknown>) =>
  v.parse(dashboardSearchSchema, input)

/**
 * The normalized query is both the request and the TanStack Query cache key
 * (ARCHITECTURE §5.1), so equal filter states must produce equal objects -
 * otherwise two identical views fetch twice and cache separately.
 */
describe("normalizePublicQuery", () => {
  it("sends the preset and nothing else for a quick pick", () => {
    expect(normalizePublicQuery(parse({ period: "3y" }))).toEqual({
      period: "3y",
    })
  })

  it("sends the range only for a complete custom period", () => {
    expect(
      normalizePublicQuery(
        parse({ period: "custom", from: "2025-11-01", to: "2025-11-30" })
      )
    ).toEqual({ period: "custom", from: "2025-11-01", to: "2025-11-30" })
  })

  it("degrades an incomplete custom period to the academic year", () => {
    expect(
      normalizePublicQuery(parse({ period: "custom", from: "2025-11-01" }))
    ).toEqual({ period: "year" })
  })

  it("renames the work-type filter to the contract's snake_case", () => {
    expect(normalizePublicQuery(parse({ workType: "thesis_master" }))).toEqual({
      period: "year",
      work_type: "thesis_master",
    })
  })

  it("never leaks internal-contour dimensions or the locale to a public endpoint", () => {
    const query = normalizePublicQuery(
      parse({
        faculty: "FAC03",
        department: "DEP11",
        program: "OP-1",
        lang: "kk",
      })
    )
    expect(query).toEqual({ period: "year", faculty: "FAC03" })
    expect(Object.keys(query)).not.toContain("department")
    expect(Object.keys(query)).not.toContain("program")
    expect(Object.keys(query)).not.toContain("lang")
  })

  it("treats a blank string as an absent filter", () => {
    expect(
      normalizePublicQuery(parse({ faculty: "  ", workType: "" }))
    ).toEqual({ period: "year" })
  })

  it("is order-independent: equal filter states normalize to equal objects", () => {
    const a = normalizePublicQuery(
      parse({ faculty: "FAC03", workType: "course" })
    )
    const b = normalizePublicQuery(
      parse({ workType: "course", faculty: "FAC03" })
    )
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })

  /**
   * ADR-016 §3. `DashboardSearch` still carries `status` for the internal
   * contour, so the only thing standing between a stale bookmark and a public
   * 422 is this normalizer dropping it.
   */
  it("never sends status to a public endpoint", () => {
    const query = normalizePublicQuery(
      parse({ faculty: "FAC03", status: "accepted" })
    )
    expect(query).toEqual({ period: "year", faculty: "FAC03" })
    expect(Object.keys(query)).not.toContain("status")
  })

  it("keeps status on the internal contour", () => {
    expect(normalizeInternalQuery(parse({ status: "accepted" }))).toEqual({
      period: "year",
      status: "accepted",
    })
  })
})

describe("publicQueries", () => {
  it("keys every section separately under the same filters", () => {
    const query = normalizePublicQuery(parse({ faculty: "FAC03" }))
    const keys = [
      publicQueries.summary(query).queryKey,
      publicQueries.timeseries(query).queryKey,
      publicQueries.workTypes(query).queryKey,
      publicQueries.faculties(query).queryKey,
      publicQueries.histogram(query).queryKey,
      publicQueries.yoy(query).queryKey,
    ].map((key) => JSON.stringify(key))
    expect(new Set(keys).size).toBe(keys.length)
    for (const key of keys) expect(key).toContain('"FAC03"')
  })

  it("caches identical filter states under one key", () => {
    const one = publicQueries.summary(normalizePublicQuery(parse({}))).queryKey
    const two = publicQueries.summary(
      normalizePublicQuery(parse({ period: "year" }))
    ).queryKey
    expect(JSON.stringify(one)).toBe(JSON.stringify(two))
  })

  it("populates the filter selects from the unfiltered dictionary query", () => {
    expect(publicQueries.facultyOptions().queryKey).toEqual([
      "public",
      "faculties",
      DICTIONARY_QUERY,
    ])
    expect(publicQueries.workTypeOptions().queryKey).toEqual([
      "public",
      "work-types",
      DICTIONARY_QUERY,
    ])
  })

  it("holds the public contour for an hour, matching Cache-Control", () => {
    expect(publicQueries.summary({ period: "year" }).staleTime).toBe(3600000)
  })
})

describe("hasActiveFilters", () => {
  it("is false for the default view and true once anything narrows it", () => {
    expect(hasActiveFilters(parse({}))).toBe(false)
    expect(hasActiveFilters(parse({ lang: "kk" }))).toBe(false)
    expect(hasActiveFilters(parse({ period: "month" }))).toBe(true)
    expect(hasActiveFilters(parse({ faculty: "FAC08" }))).toBe(true)
    expect(hasActiveFilters(parse({ department: "DEP11" }))).toBe(true)
    expect(hasActiveFilters(parse({ program: "PROG01" }))).toBe(true)
    expect(hasActiveFilters(parse({ status: "rejected" }))).toBe(true)
  })
})

/**
 * The internal contour adds the two unit dimensions TZ §4.3 asks for. It has
 * the same normalization contract as the public one - the object is both the
 * request and the cache key - so the same properties are asserted here.
 */
describe("normalizeInternalQuery", () => {
  it("carries the department and programme the public query drops", () => {
    expect(
      normalizeInternalQuery(
        parse({ faculty: "FAC03", department: "DEP11", program: "PROG01" })
      )
    ).toEqual({
      period: "year",
      faculty: "FAC03",
      department: "DEP11",
      program: "PROG01",
    })
  })

  it("never sends the locale override to an endpoint", () => {
    expect(Object.keys(normalizeInternalQuery(parse({ lang: "kk" })))).toEqual([
      "period",
    ])
  })

  it("degrades an incomplete custom period to the academic year", () => {
    expect(
      normalizeInternalQuery(parse({ period: "custom", to: "2026-08-31" }))
    ).toEqual({ period: "year" })
  })

  it("treats a blank unit code as an absent filter, not an empty unit", () => {
    expect(
      normalizeInternalQuery(parse({ department: "   ", program: "" }))
    ).toEqual({ period: "year" })
  })

  it("is order-independent: equal filter states normalize to equal objects", () => {
    const a = normalizeInternalQuery(
      parse({ department: "DEP11", faculty: "FAC03", workType: "course" })
    )
    const b = normalizeInternalQuery(
      parse({ workType: "course", faculty: "FAC03", department: "DEP11" })
    )
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })
})

describe("internalQueries", () => {
  it("keys every internal section separately under the same filters", () => {
    const query = normalizeInternalQuery(parse({ department: "DEP11" }))
    const keys = [
      internalQueries.summary(query).queryKey,
      internalQueries.timeseries(query).queryKey,
      internalQueries.workTypes(query).queryKey,
      internalQueries.histogram(query).queryKey,
      internalQueries.yoy(query).queryKey,
      internalQueries.departmentsMatrix(query).queryKey,
      internalQueries.rechecks(query).queryKey,
      internalQueries.escalations(query).queryKey,
      internalQueries.usage(query).queryKey,
    ].map((key) => JSON.stringify(key))
    expect(new Set(keys).size).toBe(keys.length)
    for (const key of keys) expect(key).toContain('"DEP11"')
  })

  it("never collides with a public key carrying the same filters", () => {
    const query = { period: "year" as const }
    expect(JSON.stringify(internalQueries.summary(query).queryKey)).not.toBe(
      JSON.stringify(publicQueries.summary(query).queryKey)
    )
  })

  it("holds the internal contour for five minutes (ARCHITECTURE §5.1)", () => {
    expect(internalQueries.summary({ period: "year" }).staleTime).toBe(300000)
  })

  it("derives the scope-aware unit options from the unfiltered matrix", () => {
    expect(internalQueries.unitOptions().queryKey).toEqual([
      "internal",
      "departments-matrix",
      INTERNAL_DICTIONARY_QUERY,
    ])
  })
})

describe("mergeFilters", () => {
  it("keeps a period in force when the patch does not mention one", () => {
    expect(
      mergeFilters(parse({ period: "3y" }), { faculty: "FAC03" }).period
    ).toBe("3y")
  })

  it("clears a filter the patch sets to undefined", () => {
    const next = mergeFilters(parse({ period: "3y", faculty: "FAC03" }), {
      faculty: undefined,
    })
    expect(next.faculty).toBeUndefined()
    expect(next.period).toBe("3y")
  })
})
