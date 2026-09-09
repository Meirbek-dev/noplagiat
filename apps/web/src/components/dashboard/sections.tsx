import { useSuspenseQuery } from "@tanstack/react-query"

import type { ScreenedFloat, ScreenedInt } from "@/api/types.gen"
import {
  GroupedBars,
  KpiCard,
  OriginalityHistogram,
  TimeSeries,
  UnitHeatmap,
  YoYCompare,
  isSuppressed,
} from "@/components/charts"
import type { PublicQuery } from "@/lib/api"
import { reportDownloadUrl } from "@/lib/api"
import {
  SERIES_CHECKS,
  SERIES_ORIGINALITY,
  UNASSIGNED_CODE,
  breakdownRows,
  checksSeries,
  facultyHeatmapRows,
  histogramBuckets,
  originalitySeries,
  semesterBands,
  timeSeriesPoints,
  yoyRows,
} from "@/lib/adapters"
import {
  formatCount,
  formatDate,
  formatDateTime,
  formatPercentPoints,
  formatShare,
} from "@/lib/format"
import { semesterSpans } from "@/lib/period"
import { publicQueries } from "@/lib/queries"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * One component per dashboard section (TZ §4.2 §§1, 2, 3, 5, 9 plus the
 * faculty aggregate and the published reports). Each reads exactly one query
 * through `useSuspenseQuery`, so it suspends and fails on its own inside the
 * `SectionFrame` boundary and never blocks a sibling.
 *
 * Every screened cell reaches a chart wrapper untouched: a suppressed value
 * stays `"insufficient_data"` all the way down and is rendered by the wrapper's
 * hatch or chip, never by a zero (ADR-002 / TZ §6.2).
 */

export interface SectionProps {
  query: PublicQuery
  locale: Locale
}

/* ── 1. Overview KPI cards ────────────────────────────────────────────────── */

export function OverviewSection({ query, locale }: SectionProps) {
  const { data } = useSuspenseQuery(publicQueries.summary(query))
  const count = (value: number) => formatCount(value, locale)
  const percentPoints = (value: number) => formatPercentPoints(value, locale)
  const share = (value: number) => formatShare(value, locale)

  return (
    <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4">
      <KpiCard
        label={m.kpi_total_checks({}, { locale })}
        testId="kpi-total-checks"
        value={data.total_checks}
        previous={data.previous.total_checks}
        format={count}
        description={m.kpi_total_checks_hint({}, { locale })}
        locale={locale}
      />
      <KpiCard
        label={m.kpi_avg_originality({}, { locale })}
        testId="kpi-avg-originality"
        value={data.avg_originality}
        previous={data.previous.avg_originality}
        format={percentPoints}
        description={m.kpi_avg_originality_hint({}, { locale })}
        locale={locale}
      />
      <KpiCard
        label={m.kpi_below_threshold({}, { locale })}
        testId="kpi-below-threshold"
        value={data.below_threshold_share}
        previous={data.previous.below_threshold_share}
        format={share}
        description={m.kpi_below_threshold_hint(
          { count: screenedText(data.below_threshold, count, locale) },
          { locale }
        )}
        locale={locale}
      />
      <KpiCard
        label={m.kpi_escalated({}, { locale })}
        testId="kpi-escalated"
        value={data.escalated}
        previous={data.previous.escalated}
        format={count}
        description={m.kpi_escalated_hint({}, { locale })}
        locale={locale}
      />
      {/* TZ §4.2 §1 «при наличии данных»: no denominators, no card. */}
      {data.coverage === null || data.coverage === undefined ? null : (
        <KpiCard
          label={m.kpi_coverage({}, { locale })}
          testId="kpi-coverage"
          value={data.coverage}
          format={share}
          description={m.kpi_coverage_hint({}, { locale })}
          locale={locale}
        />
      )}
    </div>
  )
}

/* ── 2. Dynamics ──────────────────────────────────────────────────────────── */

export function DynamicsSection({ query, locale }: SectionProps) {
  const { data } = useSuspenseQuery(publicQueries.timeseries(query))
  return (
    <TimeSeries
      points={timeSeriesPoints(data.months)}
      bands={semesterBands(
        semesterSpans(data.period.from, data.period.to),
        locale
      )}
      // The section heading already carries the name and the sentence; the
      // chart caption names the two measures instead of repeating them.
      title={m.chart_dynamics_title({}, { locale })}
      locale={locale}
    />
  )
}

/* ── 3. Work types ────────────────────────────────────────────────────────── */

export function WorkTypesSection({ query, locale }: SectionProps) {
  const { data } = useSuspenseQuery(publicQueries.workTypes(query))
  const rows = breakdownRows(data.items, locale)

  // A bar chart of one category is not a distribution, it is a number wearing
  // an axis. The legacy export carries no work-type field and the title rules
  // classify ~0.2 % of rows (PLAN §1.1), so every surviving row is «иное» and
  // the section prints that number and says why, instead of drawing two
  // single-bar charts. An empty result still belongs to the charts, which
  // already have the «нет данных» state for it.
  const only = rows.length === 1 ? rows[0] : undefined
  if (only) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
          <KpiCard
            label={`${only.label} · ${m.chart_series_checks({}, { locale })}`}
            value={only.values[SERIES_CHECKS] ?? "insufficient_data"}
            unit="count"
            format={(value) => formatCount(value, locale)}
            locale={locale}
          />
          <KpiCard
            label={`${only.label} · ${m.chart_series_originality({}, { locale })}`}
            value={only.values[SERIES_ORIGINALITY] ?? "insufficient_data"}
            unit="percent"
            format={(value) => formatPercentPoints(value, locale)}
            locale={locale}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {m.work_types_single_bucket({}, { locale })}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-2">
      {/* Horizontal: work-type names are long enough that the vertical form
          could only label three of the seven bars. See `GroupedBars`. */}
      <GroupedBars
        series={[checksSeries(locale)]}
        groups={rows}
        orientation="horizontal"
        title={m.chart_work_types_counts({}, { locale })}
        unit="count"
        valueAxisLabel={m.chart_axis_count({}, { locale })}
        categoryAxisLabel={m.chart_axis_work_type({}, { locale })}
        locale={locale}
      />
      <GroupedBars
        series={[originalitySeries(locale)]}
        groups={rows}
        orientation="horizontal"
        title={m.chart_work_types_originality({}, { locale })}
        unit="percent"
        valueAxisLabel={m.chart_axis_originality({}, { locale })}
        categoryAxisLabel={m.chart_axis_work_type({}, { locale })}
        locale={locale}
      />
    </div>
  )
}

/* ── 5. Originality histogram ─────────────────────────────────────────────── */

export function HistogramSection({ query, locale }: SectionProps) {
  const { data } = useSuspenseQuery(publicQueries.histogram(query))
  return (
    <OriginalityHistogram
      buckets={histogramBuckets(data.buckets)}
      total={data.total}
      title={m.chart_histogram_title({}, { locale })}
      locale={locale}
    />
  )
}

/* ── 9. Year over year ────────────────────────────────────────────────────── */

export function YoySection({ query, locale }: SectionProps) {
  const { data } = useSuspenseQuery(publicQueries.yoy(query))
  const years = yoyRows(data.years)
  return (
    <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-2">
      <YoYCompare
        years={years}
        series={[checksSeries(locale)]}
        title={m.chart_series_checks({}, { locale })}
        unit="count"
        valueAxisLabel={m.chart_axis_count({}, { locale })}
        locale={locale}
      />
      <YoYCompare
        years={years}
        series={[originalitySeries(locale)]}
        title={m.chart_series_originality({}, { locale })}
        unit="percent"
        valueAxisLabel={m.chart_axis_originality({}, { locale })}
        locale={locale}
      />
    </div>
  )
}

/* ── 4. Faculty aggregate (public grain) ──────────────────────────────────── */

export function FacultiesSection({ query, locale }: SectionProps) {
  const { data } = useSuspenseQuery(publicQueries.faculties(query))

  // The footnote follows the data, exactly as `reports::annual` already does
  // for the same table: promising a breakdown «доступна с 2025/26» above a
  // table whose every row is the `UNASSIGNED` sentinel reads as a data error.
  // While nothing is attributed, the note says what is missing instead.
  const mapped = data.items.some((item) => item.code !== UNASSIGNED_CODE)
  const sentinel = data.items.some((item) => item.code === UNASSIGNED_CODE)

  return (
    <div className="flex flex-col gap-2">
      <UnitHeatmap
        rows={facultyHeatmapRows(data.items, locale)}
        metrics={[
          {
            id: checksSeries(locale).id,
            label: checksSeries(locale).label,
            unit: "count",
          },
          {
            id: originalitySeries(locale).id,
            label: originalitySeries(locale).label,
            unit: "percent",
          },
        ]}
        title={m.chart_faculties_title({}, { locale })}
        locale={locale}
      />
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <p>
          {mapped
            ? m.units_coverage_footnote({}, { locale })
            : m.units_pending_mapping_footnote({}, { locale })}
        </p>
        {sentinel ? <p>{m.units_unassigned_footnote({}, { locale })}</p> : null}
      </div>
    </div>
  )
}

/* ── Published reports ────────────────────────────────────────────────────── */

export function ReportsSection({ locale }: { locale: Locale }) {
  const { data } = useSuspenseQuery(publicQueries.reports())

  if (data.items.length === 0) {
    return (
      <p className="rounded border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
        {m.reports_empty({}, { locale })}
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y">
      {data.items.map((report) => (
        <li
          key={report.id}
          className="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">
              {report.kind === "annual"
                ? m.reports_kind_annual({}, { locale })
                : m.reports_kind_manual({}, { locale })}
              {" · "}
              {formatDate(report.period.from, locale)} -{" "}
              {formatDate(report.period.to, locale)}
            </span>
            <span className="text-xs text-muted-foreground">
              {m.reports_generated(
                { date: formatDateTime(report.generated_at, locale) },
                { locale }
              )}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.files.map((file) => (
              <a
                key={`${String(report.id)}-${file.format}`}
                href={reportDownloadUrl(report.id, file.format)}
                // Same-origin file stream from the public contour
                // (`GET /api/public/reports/{id}/download`).
                download
                className="inline-flex h-8 items-center rounded-2xl border border-border px-3 text-sm hover:bg-muted"
              >
                {m.reports_download(
                  { format: file.format.toUpperCase() },
                  { locale }
                )}
              </a>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}

/** A suppressed count reads as the marker inside a sentence, never as `0`. */
function screenedText(
  value: ScreenedInt | ScreenedFloat,
  format: (value: number) => string,
  locale: Locale
): string {
  return isSuppressed(value)
    ? m.insufficient_data({}, { locale })
    : format(value)
}
