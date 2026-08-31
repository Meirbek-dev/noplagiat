import type { PublicQuery } from "./api"
import type { InternalQuery } from "./api-internal"
import type { DashboardSearch } from "./search"

/**
 * Search params → the public API's query string.
 *
 * Normalization is the whole point: the same filter state must produce the
 * same object every time, because that object is both the request and the
 * TanStack Query cache key (ARCHITECTURE §5.1). So keys are emitted in a fixed
 * order, empty strings collapse to "absent", and the internal-only dimensions
 * (`department`, `program`, `status`) and the locale override never reach a
 * public endpoint. `status` joined that list in ADR-016 §3: the public released
 * cube cannot carry it, and the server now answers it with a `422`.
 */

function trimmed(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  const text = value.trim()
  return text === "" ? undefined : text
}

/**
 * A `custom` period without both endpoints is not a period; it degrades to the
 * academic-year default rather than sending the server a 422.
 */
export function normalizePublicQuery(search: DashboardSearch): PublicQuery {
  const from = trimmed(search.from)
  const to = trimmed(search.to)
  const custom =
    search.period === "custom" && from !== undefined && to !== undefined

  const query: PublicQuery = {
    period: custom
      ? "custom"
      : search.period === "custom"
        ? "year"
        : search.period,
  }
  if (custom) {
    query.from = from
    query.to = to
  }

  const faculty = trimmed(search.faculty)
  if (faculty !== undefined) query.faculty = faculty

  const workType = trimmed(search.workType)
  if (workType !== undefined) query.work_type = workType

  return query
}

/**
 * Search params → the internal API's query string (TZ §4.3 «на внутреннем
 * контуре - дополнительно кафедра и ОП»).
 *
 * Same normalization contract as the public one, with the two extra unit
 * dimensions carried through. Sending a unit outside the caller's scope is a
 * `403`, not an empty result - that is deliberate server behaviour
 * (`InternalFilterQuery` in the contract), and the pages render it as an
 * explained state rather than a crash.
 */
export function normalizeInternalQuery(search: DashboardSearch): InternalQuery {
  const from = trimmed(search.from)
  const to = trimmed(search.to)
  const custom =
    search.period === "custom" && from !== undefined && to !== undefined

  const query: InternalQuery = {
    period: custom
      ? "custom"
      : search.period === "custom"
        ? "year"
        : search.period,
  }
  if (custom) {
    query.from = from
    query.to = to
  }

  const faculty = trimmed(search.faculty)
  if (faculty !== undefined) query.faculty = faculty

  const department = trimmed(search.department)
  if (department !== undefined) query.department = department

  const program = trimmed(search.program)
  if (program !== undefined) query.program = program

  const workType = trimmed(search.workType)
  if (workType !== undefined) query.work_type = workType

  if (search.status !== undefined) query.status = search.status

  return query
}

/**
 * The unfiltered query used to populate the filter selects: five academic
 * years of dictionary coverage, so a faculty that ran no checks this month is
 * still selectable.
 */
export const DICTIONARY_QUERY: PublicQuery = { period: "5y" }

/**
 * The same idea on the internal contour: the faculty/department options come
 * from an unfiltered `departments-matrix`, so the scope's units are all
 * offered even when the current filter empties one of them.
 */
export const INTERNAL_DICTIONARY_QUERY: InternalQuery = { period: "5y" }

/**
 * Merges a filter patch into the current search state.
 *
 * `period` never becomes `undefined`: a patch that does not mention it keeps
 * the one in force, so the URL always describes a period and the first request
 * after a change is never a 422. Every internal page navigates through this.
 */
export function mergeFilters(
  previous: DashboardSearch,
  patch: Partial<DashboardSearch>
): DashboardSearch {
  return { ...previous, ...patch, period: patch.period ?? previous.period }
}

/** `true` when the user has narrowed anything beyond the default period. */
export function hasActiveFilters(search: DashboardSearch): boolean {
  return (
    search.period !== "year" ||
    trimmed(search.faculty) !== undefined ||
    trimmed(search.department) !== undefined ||
    trimmed(search.program) !== undefined ||
    trimmed(search.workType) !== undefined ||
    search.status !== undefined
  )
}
