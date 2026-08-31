import { intlLocale } from "../../lib/format"
import type { Locale } from "../../paraglide/runtime.js"

import type { ChartUnit, ScreenedNumber } from "./types"
import { isSuppressed } from "./types"

/** Palette slots, in fixed assignment order. Never cycled - see README.md. */
export const PALETTE_SLOTS = [1, 2, 3, 4, 5, 6] as const
export type PaletteSlot = (typeof PALETTE_SLOTS)[number]

/** The only way chart code names a series colour. */
export function seriesColor(slot: PaletteSlot): string {
  return `var(--chart-${String(slot)})`
}

/** The only way chart code names an ordinal/sequential ramp step (1..5). */
export function rampColor(step: 1 | 2 | 3 | 4 | 5): string {
  return `var(--chart-seq-${String(step)})`
}

/** Ink that stays ≥ 4.5:1 on the ramp step it sits on. */
export function rampInk(step: 1 | 2 | 3 | 4 | 5): string {
  return step <= 3 ? "var(--chart-seq-ink-low)" : "var(--chart-seq-ink-high)"
}

export function formatNumber(value: number, locale: Locale): string {
  // `intlLocale`, not the raw tag: some runtimes carry no `kk` number patterns
  // and fall back to the root locale, which both breaks the Kazakhstani
  // convention and desynchronises SSR from hydration (see lib/format.ts).
  return new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number, locale: Locale): string {
  return `${new Intl.NumberFormat(intlLocale(locale), {
    maximumFractionDigits: 1,
  }).format(value)}%`
}

export function formatUnit(
  value: number,
  unit: ChartUnit | undefined,
  locale: Locale
): string {
  return unit === "percent"
    ? formatPercent(value, locale)
    : formatNumber(value, locale)
}

/** `YYYY-MM` → `["сент.", "2025"]`, or `null` when the key is not a month. */
function monthParts(month: string, locale: Locale): [string, string] | null {
  const match = /^(\d{4})-(\d{2})$/.exec(month)
  if (!match) return null
  const year = Number(match[1])
  const index = Number(match[2]) - 1
  if (index < 0 || index > 11) return null
  const label = new Intl.DateTimeFormat(intlLocale(locale), {
    month: "short",
  }).format(new Date(Date.UTC(year, index, 1)))
  return [label, String(year)]
}

/**
 * `YYYY-MM` → a localized month label **carrying its year**. Falls back to the
 * raw key when the month is not parseable, so a bad server value degrades to
 * text rather than to `Invalid Date`.
 *
 * The year is not optional here. This is the label a tooltip and the screen
 * reader table print, and the dynamics series spans five academic years: a bare
 * «июнь» names five different months, and the reader has no axis to count along
 * inside a tooltip. `formatMonthShort` is the form for a dense axis that has
 * already been established to sit inside one calendar year.
 */
export function formatMonth(month: string, locale: Locale): string {
  const parts = monthParts(month, locale)
  return parts ? `${parts[0]} ${parts[1]}` : month
}

/** `YYYY-MM` → the month alone, with no year. */
export function formatMonthShort(month: string, locale: Locale): string {
  const parts = monthParts(month, locale)
  return parts ? parts[0] : month
}

/** `YYYY-MM` → a comparable integer, for range tests on semester bands. */
export function monthOrdinal(month: string): number {
  const match = /^(\d{4})-(\d{2})$/.exec(month)
  if (!match) return Number.NaN
  return Number(match[1]) * 12 + Number(match[2])
}

/** Steps, in months, an axis is allowed to advance by. */
const MONTH_TICK_STEPS = [1, 2, 3, 4, 6, 12] as const

/** Upper bound on tick candidates before the step is widened. */
const MAX_MONTH_TICKS = 12

/**
 * The subset of `months` that should carry a tick.
 *
 * Left to itself the renderer thins tick labels by measured width, which over a
 * five-year series produces a *irregular* sequence - two months, then three,
 * then four - and the axis stops being countable. Choosing the candidates here
 * fixes the step, and anchoring it on the first September means every whole
 * academic year begins on a tick.
 *
 * Stepping is by calendar ordinal, not by array index: the server omits months
 * that hold no data, and index stepping would drift across such a gap.
 */
export function monthAxisTicks(
  months: readonly string[],
  max: number = MAX_MONTH_TICKS
): string[] {
  if (months.length === 0) return []
  const first = monthOrdinal(months[0])
  const last = monthOrdinal(months[months.length - 1])
  if (!Number.isFinite(first) || !Number.isFinite(last)) return [...months]

  const span = last - first + 1
  const step =
    MONTH_TICK_STEPS.find((candidate) => Math.ceil(span / candidate) <= max) ??
    12
  // Anchoring on September puts the start of every academic year on a tick.
  const anchor = monthOrdinal(
    months.find((month) => month.endsWith("-09")) ?? months[0]
  )
  const base = Number.isFinite(anchor) ? anchor : first

  return months.filter((month) => {
    const ordinal = monthOrdinal(month)
    return (
      Number.isFinite(ordinal) &&
      (((ordinal - base) % step) + step) % step === 0
    )
  })
}

/**
 * The label function for a month axis: the year is printed on every tick as
 * soon as the ticks span more than one calendar year, which is the only form
 * that survives the renderer's own label thinning - a year printed on one tick
 * alone disappears the moment that tick is dropped.
 */
export function monthAxisFormat(
  ticks: readonly string[],
  locale: Locale
): (month: string) => string {
  const years = new Set(ticks.map((month) => month.slice(0, 4)))
  return years.size > 1
    ? (month: string) => formatMonth(month, locale)
    : (month: string) => formatMonthShort(month, locale)
}

/** Numbers only. Suppressed cells are dropped and counted separately. */
export function numericPoints<T>(
  rows: readonly T[],
  value: (row: T) => ScreenedNumber | undefined
): { points: { row: T; value: number }[]; suppressed: number } {
  const points: { row: T; value: number }[] = []
  let suppressed = 0
  for (const row of rows) {
    const raw = value(row)
    if (isSuppressed(raw)) {
      suppressed += 1
      continue
    }
    points.push({ row, value: raw })
  }
  return { points, suppressed }
}

/**
 * Every row is kept, with `null` where the value was suppressed. Line marks
 * treat a null y as a *gap*, so a withheld month leaves a hole rather than a
 * segment interpolated straight through it - which would show the reader a
 * trend the server refused to publish.
 */
export function gappedPoints<T>(
  rows: readonly T[],
  value: (row: T) => ScreenedNumber | undefined
): { points: { row: T; value: number | null }[]; suppressed: number } {
  const points: { row: T; value: number | null }[] = []
  let suppressed = 0
  for (const row of rows) {
    const raw = value(row)
    if (isSuppressed(raw)) {
      suppressed += 1
      points.push({ row, value: null })
      continue
    }
    points.push({ row, value: raw })
  }
  return { points, suppressed }
}

/**
 * A round upper bound for a value axis. Computed here rather than through
 * `nice: true` so the semester band can span exactly the plotted range and so
 * server and client resolve the same domain.
 */
export function niceMax(values: readonly number[]): number {
  const max = values.length === 0 ? 0 : Math.max(...values)
  if (!(max > 0)) return 1
  const step = 10 ** Math.floor(Math.log10(max)) / 2
  return Math.ceil(max / step) * step
}

/** Bucket a value into 1..5 of the sequential ramp, against a domain. */
export function rampStep(
  value: number,
  min: number,
  max: number
): 1 | 2 | 3 | 4 | 5 {
  if (!(max > min)) return 3
  const ratio = (value - min) / (max - min)
  const index = Math.min(4, Math.max(0, Math.floor(ratio * 5)))
  return ([1, 2, 3, 4, 5] as const)[index] ?? 3
}
