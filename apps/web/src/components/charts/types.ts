/**
 * Chart prop types.
 *
 * These mirror the *wire* shapes the API will emit (see `src/api/client.ts`
 * for the screened-union convention) but are declared here, not imported from
 * `src/api/`: that directory is regenerated wholesale (AGENTS.md invariant #5)
 * and the chart layer must not break every time the generator runs. Route and
 * page code adapts generated API types into these props - see README.md.
 */

/**
 * A k-anonymity screened cell: a number, or the suppression marker the server
 * substitutes when a group is smaller than k (ADR-002, TZ §6.2). The marker is
 * the only suppressed representation; it never becomes `null`, `0`, or `NaN`
 * on the way to a chart.
 */
export type ScreenedNumber = number | "insufficient_data"

/** `true` when the cell was suppressed rather than carrying a number. */
export function isSuppressed(
  value: ScreenedNumber | undefined
): value is "insufficient_data" | undefined {
  return value === undefined || value === "insufficient_data"
}

/** How a numeric channel should be formatted and described. */
export type ChartUnit = "count" | "percent"

/** One named series: identity for colour, legend, table header and tooltip. */
export interface ChartSeries {
  /** Stable identity - colour follows this, never the series' rank. */
  id: string
  /** Already-localized label. */
  label: string
  /** 1-based slot in the `--chart-N` palette. Assigned in order, never cycled. */
  slot?: 1 | 2 | 3 | 4 | 5 | 6
  unit?: ChartUnit
}

/* ── TimeSeries ───────────────────────────────────────────────────────────── */

/** One month of the dynamics series (ARCHITECTURE §5.2, section 2). */
export interface TimeSeriesPoint {
  /** Month key, `YYYY-MM`. */
  month: string
  /** Number of checks in the month. */
  checks: ScreenedNumber
  /** Mean originality percentage, 0..100. */
  avg_originality: ScreenedNumber
  /**
   * Escalated checks in the month. Optional: the internal contour's own
   * timeseries does not carry it, and a panel is only drawn when at least one
   * month does.
   */
  escalated?: ScreenedNumber
  /** Checks that were not the first attempt on their work. Optional as above. */
  rechecks?: ScreenedNumber
}

/**
 * A semester behind the lines.
 *
 * Both semesters are supplied so a focused month can always be named, but only
 * `"autumn"` is shaded: two adjacent bands in one fill tile the whole plot into
 * an even tint with no visible boundary between them, which is the opposite of
 * orientation. Shading every other semester leaves a boundary at each 1
 * September - the date the reader is actually looking for.
 */
export interface SemesterBand {
  id: string
  kind: "autumn" | "spring"
  /** Already-localized label, e.g. "Осенний семестр 2025/26". */
  label: string
  /** First month of the band, inclusive, `YYYY-MM`. */
  from: string
  /** Last month of the band, inclusive, `YYYY-MM`. */
  to: string
}

/* ── GroupedBars / YoYCompare ─────────────────────────────────────────────── */

/**
 * One category (work type, academic year, …) with one value per series.
 * Table-shaped on purpose: this is directly usable as a TanStack Table row.
 */
export interface CategoryRow {
  /** Stable identity of the category. */
  id: string
  /** Already-localized label. */
  label: string
  /** Series id → screened value. Missing keys render as suppressed. */
  values: Readonly<Record<string, ScreenedNumber>>
}

/* ── OriginalityHistogram ─────────────────────────────────────────────────── */

/** The five fixed originality buckets (TZ §4.2 §5). Order is meaningful. */
export const ORIGINALITY_BUCKETS = [
  "lt_50",
  "b50_70",
  "b70_85",
  "b85_95",
  "gte_95",
] as const

export type OriginalityBucketId = (typeof ORIGINALITY_BUCKETS)[number]

export interface OriginalityBucket {
  bucket: OriginalityBucketId
  /** Checks falling in the bucket. */
  count: ScreenedNumber
}

/* ── UnitHeatmap ──────────────────────────────────────────────────────────── */

/** One column of the heatmap. */
export interface HeatmapMetric {
  id: string
  /** Already-localized label. */
  label: string
  unit?: ChartUnit
}

/**
 * One row of the heatmap - a faculty or a department.
 *
 * Shaped for TanStack Table: `unit_label` is a plain accessor column and each
 * metric is reachable with `accessorFn: (row) => row.metrics[metric.id]`, so
 * the same array backs the heat cells and the drill-down table under them
 * (ARCHITECTURE §5.2).
 */
export interface HeatmapRow {
  /** Opaque unit identifier - never a person, never free text. */
  unit_id: string
  /** Already-localized unit label. */
  unit_label: string
  /** Metric id → screened value. A missing key renders as suppressed. */
  metrics: Readonly<Record<string, ScreenedNumber>>
}

/* ── KpiCard ──────────────────────────────────────────────────────────────── */

/** One point of a KPI sparkline. */
export interface SparklinePoint {
  /** Already-localized point label (month, week, …). */
  label: string
  value: ScreenedNumber
}

/* ── Shared frame props ───────────────────────────────────────────────────── */

/** A row of the screen-reader data table every chart ships. */
export interface DataTableRow {
  header: string
  cells: readonly ScreenedNumber[]
}
