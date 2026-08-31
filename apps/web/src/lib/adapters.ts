import type {
  BreakdownItemDto,
  EscalationUnit,
  HistogramBucketDto,
  MatrixFaculty,
  RecheckUnit,
  TimeseriesPointDto,
  UsageMonth,
  YoyYearDto,
} from "../api/types.gen"
import type {
  CategoryRow,
  HeatmapRow,
  OriginalityBucket,
  OriginalityBucketId,
  SemesterBand,
  TimeSeriesPoint,
} from "../components/charts"
import { m } from "../paraglide/messages.js"
import type { Locale } from "../paraglide/runtime.js"

import { intlLocale } from "./format"
import { academicYearLabel } from "./period"
import type { SemesterSpan } from "./period"

/**
 * Generated DTO → chart-wrapper props.
 *
 * The wrappers deliberately declare their own prop types instead of importing
 * from the regenerated `src/api/` (see `components/charts/README.md`), so this
 * module is the seam that absorbs a contract change. It is also where a
 * dictionary code turns into a localized label - the wrappers never look one
 * up.
 */

/** Dictionary rows carry all three names; pick the active locale's. */
export function localizedName(
  item: Pick<BreakdownItemDto, "name_ru" | "name_kk" | "name_en" | "code">,
  locale: Locale
): string {
  const name =
    locale === "kk"
      ? item.name_kk
      : locale === "en"
        ? item.name_en
        : item.name_ru
  return name === "" ? item.code : name
}

/** Series ids shared by every breakdown chart. Colour follows the id. */
export const SERIES_CHECKS = "checks"
export const SERIES_ORIGINALITY = "avg_originality"

/**
 * The dictionary sentinel migration 0002 attributes a check to when the
 * reviewer is absent from `staff_units` (ADR-008 §6). A breakdown made only of
 * this code is not a breakdown, and the sections that render one say so.
 */
export const UNASSIGNED_CODE = "UNASSIGNED"

export function checksSeries(locale: Locale) {
  return {
    id: SERIES_CHECKS,
    label: m.chart_series_checks({}, { locale }),
    slot: 1,
    unit: "count",
  } as const
}

export function originalitySeries(locale: Locale) {
  return {
    id: SERIES_ORIGINALITY,
    label: m.chart_series_originality({}, { locale }),
    slot: 2,
    unit: "percent",
  } as const
}

/** Breakdown items → one `CategoryRow` per dictionary entry. */
export function breakdownRows(
  items: readonly BreakdownItemDto[],
  locale: Locale
): CategoryRow[] {
  return items.map((item) => ({
    id: item.code,
    label: localizedName(item, locale),
    values: {
      [SERIES_CHECKS]: item.checks,
      [SERIES_ORIGINALITY]: item.avg_originality,
    },
  }))
}

/** Faculty breakdown → heatmap rows (public grain is the faculty, TZ §4.2 §4). */
export function facultyHeatmapRows(
  items: readonly BreakdownItemDto[],
  locale: Locale
): HeatmapRow[] {
  return items.map((item) => ({
    unit_id: item.code,
    unit_label: localizedName(item, locale),
    metrics: {
      [SERIES_CHECKS]: item.checks,
      [SERIES_ORIGINALITY]: item.avg_originality,
    },
  }))
}

/**
 * What both contours' monthly points have in common.
 *
 * The public `TimeseriesPointDto` carries `escalated` and `rechecks`;
 * `InternalTimeseriesPoint` does not. Naming the shared shape here rather than
 * the public DTO keeps one adapter for both, and the chart draws the extra
 * panel only for the response that supplies the measures.
 */
type MonthlyPointDto = Pick<
  TimeseriesPointDto,
  "month" | "checks" | "avg_originality"
> &
  Partial<Pick<TimeseriesPointDto, "escalated" | "rechecks">>

/** `YYYY-MM-DD` month starts → the `YYYY-MM` keys the wrapper expects. */
export function timeSeriesPoints(
  months: readonly MonthlyPointDto[]
): TimeSeriesPoint[] {
  return months.map((point) => ({
    month: point.month.slice(0, 7),
    checks: point.checks,
    avg_originality: point.avg_originality,
    escalated: point.escalated,
    rechecks: point.rechecks,
  }))
}

/** Wire band key → the wrapper's bucket id. Unknown keys are dropped. */
const BUCKET_IDS: Readonly<Record<string, OriginalityBucketId>> = {
  b_lt50: "lt_50",
  b_50_70: "b50_70",
  b_70_85: "b70_85",
  b_85_95: "b85_95",
  b_ge95: "gte_95",
}

export function histogramBuckets(
  buckets: readonly HistogramBucketDto[]
): OriginalityBucket[] {
  const mapped: OriginalityBucket[] = []
  for (const bucket of buckets) {
    const id = BUCKET_IDS[bucket.key]
    if (!id) continue
    mapped.push({ bucket: id, count: bucket.checks })
  }
  return mapped
}

/** Academic years → category rows, newest last so the axis reads left to right. */
export function yoyRows(years: readonly YoyYearDto[]): CategoryRow[] {
  return years.map((year) => ({
    id: String(year.academic_year),
    label: academicYearLabel(year.academic_year),
    values: {
      [SERIES_CHECKS]: year.checks,
      [SERIES_ORIGINALITY]: year.avg_originality,
    },
  }))
}

/* ── Internal contour ─────────────────────────────────────────────────────── */

/**
 * The faculty→department matrix (TZ §4.2 §4, internal grain).
 *
 * One row per faculty, and - when the faculty is expanded - one indented row
 * per department under it. The faculty margin is `faculty.total`, which the
 * server computes over *all* its departments, visible and suppressed alike, so
 * the rows below a margin need not add up to it and that is correct
 * (complementary suppression, ADR-002).
 */
export function matrixHeatmapRows(
  faculties: readonly MatrixFaculty[],
  expanded: ReadonlySet<string>,
  locale: Locale
): HeatmapRow[] {
  const rows: HeatmapRow[] = []
  for (const faculty of faculties) {
    rows.push({
      unit_id: faculty.code,
      unit_label: localizedName(faculty, locale),
      metrics: {
        [SERIES_CHECKS]: faculty.total.checks,
        [SERIES_ORIGINALITY]: faculty.total.avg_originality,
      },
    })
    if (!expanded.has(faculty.code)) continue
    for (const department of faculty.departments) {
      rows.push({
        unit_id: `${faculty.code}/${department.code}`,
        unit_label: `- ${localizedName(department, locale)}`,
        metrics: {
          [SERIES_CHECKS]: department.checks,
          [SERIES_ORIGINALITY]: department.avg_originality,
        },
      })
    }
  }
  return rows
}

/** Series id of the usage measure (TZ §4.2 §8). */
export const SERIES_ACTIVE_REVIEWERS = "active_reviewers"

export function activeReviewersSeries(locale: Locale) {
  return {
    id: SERIES_ACTIVE_REVIEWERS,
    label: m.chart_series_active_reviewers({}, { locale }),
    slot: 3,
    unit: "count",
  } as const
}

/**
 * Usage months → one category per month.
 *
 * Section 8 measures one thing - distinct reviewers active in the month - so it
 * gets one value axis, the same rule `GroupedBars` follows for the work-type
 * section (charts/README.md).
 */
export function usageRows(
  months: readonly UsageMonth[],
  locale: Locale
): CategoryRow[] {
  return months.map((point) => ({
    id: point.month,
    label: monthLabel(point.month, locale),
    values: { [SERIES_ACTIVE_REVIEWERS]: point.active_reviewers },
  }))
}

/** `YYYY-MM-DD` month start → a localized «сентябрь 2025» style label. */
export function monthLabel(month: string, locale: Locale): string {
  const parsed = new Date(`${month.slice(0, 7)}-01T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return month
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed)
}

/**
 * The per-unit rows of sections 6 and 7.
 *
 * `RecheckUnit` and `EscalationUnit` carry `name_ru` only - the contract does
 * not localize them (gap noted in the slice report), so the Russian name is the
 * label in every locale rather than an empty string.
 */
export function unitLabel(unit: RecheckUnit | EscalationUnit): string {
  return unit.name_ru === "" ? unit.code : unit.name_ru
}

/** Semester spans → localized bands for the dynamics overlay. */
export function semesterBands(
  spans: readonly SemesterSpan[],
  locale: Locale
): SemesterBand[] {
  return spans.map((span) => {
    const year = academicYearLabel(span.academicYear)
    return {
      id: span.id,
      kind: span.kind,
      label:
        span.kind === "autumn"
          ? m.chart_semester_autumn({ year }, { locale })
          : m.chart_semester_spring({ year }, { locale }),
      from: span.from,
      to: span.to,
    }
  })
}
