import type { PeriodPreset } from "./search"

/**
 * Academic-year and semester arithmetic, client side.
 *
 * The server resolves a preset into the range it actually queried and echoes
 * it back as `period: { from, to }` - that echo is the authority for anything
 * displayed. These helpers exist for the two things that must be known
 * *before* a response arrives: seeding the custom-range date pickers, and
 * drawing the semester bands behind the dynamics chart.
 *
 * Boundaries (PLAN.md D8): academic year 01.09 – 31.08; autumn semester
 * 01.09 – 31.01, spring semester 01.02 – 31.08 (summer folded into spring).
 */

export interface DateRange {
  /** `YYYY-MM-DD`, inclusive. */
  from: string
  /** `YYYY-MM-DD`, inclusive. */
  to: string
}

const ACADEMIC_YEAR_START_MONTH = 9 // September

function iso(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${String(year)}-${mm}-${dd}`
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** The academic year a date belongs to; `2025` means AY 2025/26. */
export function academicYearOf(date: Date): number {
  const year = date.getUTCFullYear()
  return date.getUTCMonth() + 1 >= ACADEMIC_YEAR_START_MONTH ? year : year - 1
}

/** `2025` → «2025/26». */
export function academicYearLabel(year: number): string {
  return `${String(year)}/${String((year + 1) % 100).padStart(2, "0")}`
}

/** The inclusive range of one academic year. */
export function academicYearRange(year: number): DateRange {
  return { from: iso(year, 9, 1), to: iso(year + 1, 8, 31) }
}

/**
 * The range a preset covers, mirroring the server's own resolution so the
 * pickers and the semester overlay agree with the response.
 */
export function resolvePreset(
  preset: Exclude<PeriodPreset, "custom">,
  today: Date
): DateRange {
  const academicYear = academicYearOf(today)
  const year = today.getUTCFullYear()
  const month = today.getUTCMonth() + 1

  switch (preset) {
    case "month":
      return {
        from: iso(year, month, 1),
        to: iso(year, month, lastDayOfMonth(year, month)),
      }
    case "semester":
      return month >= ACADEMIC_YEAR_START_MONTH || month === 1
        ? { from: iso(academicYear, 9, 1), to: iso(academicYear + 1, 1, 31) }
        : {
            from: iso(academicYear + 1, 2, 1),
            to: iso(academicYear + 1, 8, 31),
          }
    case "year":
      return academicYearRange(academicYear)
    case "3y":
      return {
        from: iso(academicYear - 2, 9, 1),
        to: iso(academicYear + 1, 8, 31),
      }
    case "5y":
      return {
        from: iso(academicYear - 4, 9, 1),
        to: iso(academicYear + 1, 8, 31),
      }
  }
}

/** One semester band, as month keys the `TimeSeries` wrapper understands. */
export interface SemesterSpan {
  id: string
  kind: "autumn" | "spring"
  /** Academic year the semester belongs to; `2025` means AY 2025/26. */
  academicYear: number
  /** First month, inclusive, `YYYY-MM`. */
  from: string
  /** Last month, inclusive, `YYYY-MM`. */
  to: string
}

function monthKeyOf(year: number, month: number): string {
  return `${String(year)}-${String(month).padStart(2, "0")}`
}

/**
 * The semesters overlapping `[from, to]`, clipped to it. Returns an empty list
 * for a range shorter than two months, where a band would be noise rather than
 * orientation.
 */
export function semesterSpans(from: string, to: string): SemesterSpan[] {
  const start = /^(\d{4})-(\d{2})/.exec(from)
  const end = /^(\d{4})-(\d{2})/.exec(to)
  if (!start || !end) return []

  const firstKey = `${start[1] ?? ""}-${start[2] ?? ""}`
  const lastKey = `${end[1] ?? ""}-${end[2] ?? ""}`
  if (firstKey >= lastKey) return []

  const firstAcademicYear = academicYearOf(new Date(`${firstKey}-01T00:00:00Z`))
  const lastAcademicYear = academicYearOf(new Date(`${lastKey}-01T00:00:00Z`))

  const spans: SemesterSpan[] = []
  for (let year = firstAcademicYear; year <= lastAcademicYear; year += 1) {
    const candidates: Omit<SemesterSpan, "id">[] = [
      {
        kind: "autumn",
        academicYear: year,
        from: monthKeyOf(year, 9),
        to: monthKeyOf(year + 1, 1),
      },
      {
        kind: "spring",
        academicYear: year,
        from: monthKeyOf(year + 1, 2),
        to: monthKeyOf(year + 1, 8),
      },
    ]
    for (const candidate of candidates) {
      const clippedFrom = candidate.from < firstKey ? firstKey : candidate.from
      const clippedTo = candidate.to > lastKey ? lastKey : candidate.to
      if (clippedFrom > clippedTo) continue
      spans.push({
        ...candidate,
        id: `${candidate.kind}-${String(year)}`,
        from: clippedFrom,
        to: clippedTo,
      })
    }
  }
  return spans
}
