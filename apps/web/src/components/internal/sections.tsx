import { useMemo, useState } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"

import type { EthicsCaseDto } from "@/api/types.gen"
import type { ScreenedNumber } from "@/components/charts"
import {
  GroupedBars,
  KpiCard,
  OriginalityHistogram,
  ScreenedValue,
  TimeSeries,
  YoYCompare,
  isSuppressed,
} from "@/components/charts"
import { UnitsMatrix } from "@/components/internal/UnitsMatrix"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table"
import type { InternalQuery } from "@/lib/api-internal"
import {
  activeReviewersSeries,
  breakdownRows,
  checksSeries,
  histogramBuckets,
  originalitySeries,
  semesterBands,
  timeSeriesPoints,
  unitLabel,
  usageRows,
  yoyRows,
} from "@/lib/adapters"
import {
  formatCount,
  formatDecimal,
  formatPercentPoints,
  formatShare,
} from "@/lib/format"
import { semesterSpans } from "@/lib/period"
import { internalQueries } from "@/lib/queries"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * One component per internal section (TZ.md §4.2 §§1–4, 6–9).
 *
 * Same contract as the public sections: exactly one query each, read through
 * `useSuspenseQuery` so the section suspends and fails inside its own
 * `SectionFrame` boundary, and every screened cell reaches a chart wrapper
 * untouched. The internal grain differs only in *what* the server returns -
 * suppression is still its decision, not the page's.
 */

export interface InternalSectionProps {
  query: InternalQuery
  locale: Locale
}

/* ── 1. Scoped overview ───────────────────────────────────────────────────── */

export function InternalOverviewSection({
  query,
  locale,
}: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.summary(query))
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

export function InternalDynamicsSection({
  query,
  locale,
}: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.timeseries(query))
  return (
    <TimeSeries
      points={timeSeriesPoints(data.months)}
      bands={semesterBands(
        semesterSpans(data.period.from, data.period.to),
        locale
      )}
      title={m.chart_dynamics_title({}, { locale })}
      locale={locale}
    />
  )
}

/* ── 3. Work types ────────────────────────────────────────────────────────── */

export function InternalWorkTypesSection({
  query,
  locale,
}: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.workTypes(query))
  const rows = breakdownRows(data.items, locale)
  return (
    <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-2">
      {/* Horizontal for the same reason as the public section: the work-type
          names are too long for a vertical category axis to label them all. */}
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

export function InternalHistogramSection({
  query,
  locale,
}: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.histogram(query))
  return (
    <OriginalityHistogram
      buckets={histogramBuckets(data.buckets)}
      total={data.total}
      title={m.chart_histogram_title({}, { locale })}
      locale={locale}
    />
  )
}

/* ── 4. Faculty → department matrix ───────────────────────────────────────── */

export function InternalUnitsSection({ query, locale }: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.departmentsMatrix(query))
  return <UnitsMatrix faculties={data.faculties} locale={locale} />
}

/* ── 9. Year over year ────────────────────────────────────────────────────── */

export function InternalYoySection({ query, locale }: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.yoy(query))
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

/* ── 6. Rechecks ──────────────────────────────────────────────────────────── */

export function InternalRechecksSection({
  query,
  locale,
}: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.rechecks(query))
  const count = (value: number) => formatCount(value, locale)
  const share = (value: number) => formatShare(value, locale)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4">
        <KpiCard
          label={m.kpi_works_total({}, { locale })}
          value={data.works_total}
          format={count}
          description={m.kpi_works_total_hint({}, { locale })}
          locale={locale}
        />
        <KpiCard
          label={m.kpi_works_rechecked({}, { locale })}
          value={data.works_rechecked}
          format={count}
          description={m.kpi_works_rechecked_hint({}, { locale })}
          locale={locale}
        />
        <KpiCard
          label={m.kpi_recheck_share({}, { locale })}
          value={data.recheck_share}
          format={share}
          description={m.kpi_recheck_share_hint({}, { locale })}
          locale={locale}
        />
        <KpiCard
          label={m.kpi_improved_share({}, { locale })}
          value={data.improved_share}
          format={share}
          description={m.kpi_improved_share_hint(
            { count: screenedText(data.improved, count, locale) },
            { locale }
          )}
          locale={locale}
        />
      </div>

      {data.units.length === 0 ? (
        // A head of department is their own row; the total above already is it.
        <p className="text-sm text-muted-foreground">
          {m.units_own_scope_only({}, { locale })}
        </p>
      ) : (
        <UnitTable
          locale={locale}
          caption={m.rechecks_units_title({}, { locale })}
          columns={[
            m.kpi_works_total({}, { locale }),
            m.kpi_works_rechecked({}, { locale }),
            m.kpi_recheck_share({}, { locale }),
            m.kpi_improved({}, { locale }),
          ]}
          rows={data.units.map((unit) => ({
            id: unit.code,
            label: unitLabel(unit),
            values: [
              unit.works_total,
              unit.works_rechecked,
              unit.recheck_share,
              unit.improved,
            ],
            formats: ["count", "count", "share", "count"],
          }))}
        />
      )}
    </div>
  )
}

/* ── 7. Escalations ───────────────────────────────────────────────────────── */

export function InternalEscalationsSection({
  query,
  locale,
}: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.escalations(query))
  const count = (value: number) => formatCount(value, locale)
  const share = (value: number) => formatShare(value, locale)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
        <KpiCard
          label={m.kpi_escalated({}, { locale })}
          value={data.escalated}
          format={count}
          description={m.kpi_escalated_hint({}, { locale })}
          locale={locale}
        />
        <KpiCard
          label={m.kpi_escalated_share({}, { locale })}
          value={data.escalated_share}
          format={share}
          description={m.kpi_escalated_share_hint({}, { locale })}
          locale={locale}
        />
      </div>

      <EthicsCasesTable cases={data.ethics_cases} locale={locale} />

      {data.units.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {m.units_own_scope_only({}, { locale })}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <UnitTable
            locale={locale}
            caption={m.escalations_units_title({}, { locale })}
            columns={[m.kpi_escalated({}, { locale })]}
            rows={data.units.map((unit) => ({
              id: unit.code,
              label: unitLabel(unit),
              values: [unit.escalated],
              formats: ["count"],
            }))}
          />
          {/* TZ §4.2 §7 «без указания конкретных кафедр при малой выборке»:
              this breakdown is screened for every role, not only wide ones. */}
          <p className="text-xs text-muted-foreground">
            {m.escalations_units_note({}, { locale })}
          </p>
        </div>
      )}
    </div>
  )
}

function EthicsCasesTable({
  cases,
  locale,
}: {
  cases: readonly EthicsCaseDto[]
  locale: Locale
}) {
  if (cases.length === 0) {
    // The heading has to survive the empty case. Without it the sentence
    // «Реестр Совета по этике … пуст» sat directly under a KPI reading «872
    // эскалации» and read as a contradiction, when the two count different
    // things: flagged checks, and cases the council actually opened.
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {m.ethics_cases_title({}, { locale })}
        </p>
        <p className="rounded border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
          {m.ethics_cases_empty({}, { locale })}
        </p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <caption className="caption-top pb-2 text-start text-sm font-medium">
          {m.ethics_cases_title({}, { locale })}
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead>{m.ethics_year({}, { locale })}</TableHead>
            <TableHead>{m.ethics_category({}, { locale })}</TableHead>
            <TableHead className="text-right">
              {m.ethics_referred({}, { locale })}
            </TableHead>
            <TableHead className="text-right">
              {m.ethics_closed({}, { locale })}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{academicYearCell(row.academic_year)}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(row.referred, locale)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCount(row.reviewed_closed, locale)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function academicYearCell(year: number): string {
  return `${String(year)}/${String((year + 1) % 100).padStart(2, "0")}`
}

/* ── 8. Usage ─────────────────────────────────────────────────────────────── */

export function InternalUsageSection({ query, locale }: InternalSectionProps) {
  const { data } = useSuspenseQuery(internalQueries.usage(query))

  // ADR-008 §9: the vendor export carries no duration. A month without one says
  // «нет данных»; it never becomes a zero.
  const durations = data.months.flatMap((month) =>
    month.avg_check_seconds == null ? [] : [month.avg_check_seconds]
  )
  const averageSeconds =
    durations.length === 0
      ? null
      : durations.reduce((sum, value) => sum + value, 0) / durations.length

  return (
    <div className="flex flex-col gap-4">
      <GroupedBars
        series={[activeReviewersSeries(locale)]}
        groups={usageRows(data.months, locale)}
        title={m.chart_usage_title({}, { locale })}
        unit="count"
        valueAxisLabel={m.chart_axis_active_reviewers({}, { locale })}
        categoryAxisLabel={m.chart_axis_month({}, { locale })}
        locale={locale}
      />
      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium">
          {m.usage_avg_duration({}, { locale })}
        </p>
        <p className="text-lg tabular-nums">
          {averageSeconds === null
            ? m.usage_no_data({}, { locale })
            : m.usage_seconds(
                { value: formatDecimal(averageSeconds, locale, 0) },
                { locale }
              )}
        </p>
        <p className="text-xs text-muted-foreground">
          {m.usage_avg_duration_hint({}, { locale })}
        </p>
      </div>
    </div>
  )
}

/* ── Shared per-unit table ────────────────────────────────────────────────── */

type CellFormat = "count" | "share"

interface UnitTableRow {
  id: string
  label: string
  values: readonly ScreenedNumber[]
  formats: readonly CellFormat[]
}

/**
 * The flat per-unit tables of sections 6 and 7. Sortable, because these rows
 * have no hierarchy to tear apart - unlike the units matrix.
 *
 * A suppressed cell sorts last whichever way the column runs: it has no
 * magnitude, so pretending it is a zero would rank a hidden unit as the
 * smallest one.
 */
function UnitTable({
  caption,
  columns,
  rows,
  locale,
}: {
  caption: string
  columns: readonly string[]
  rows: readonly UnitTableRow[]
  locale: Locale
}) {
  const [sort, setSort] = useState<{ column: number; desc: boolean } | null>(
    null
  )

  const sorted = useMemo(() => {
    if (sort === null) return rows
    const index = sort.column
    return [...rows].sort((left, right) => {
      const a = left.values[index]
      const b = right.values[index]
      if (isSuppressed(a) && isSuppressed(b)) return 0
      if (isSuppressed(a)) return 1
      if (isSuppressed(b)) return -1
      return sort.desc ? b - a : a - b
    })
  }, [rows, sort])

  const cell = (value: ScreenedNumber, format: CellFormat) => (
    <ScreenedValue
      value={value}
      locale={locale}
      format={(n) =>
        format === "share" ? formatShare(n, locale) : formatCount(n, locale)
      }
    />
  )

  return (
    <div className="overflow-x-auto">
      <Table>
        <caption className="caption-top pb-2 text-start text-sm font-medium">
          {caption}
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead>{m.chart_heatmap_unit({}, { locale })}</TableHead>
            {columns.map((column, index) => (
              <TableHead
                key={column}
                className="text-right"
                aria-sort={
                  sort?.column === index
                    ? sort.desc
                      ? "descending"
                      : "ascending"
                    : "none"
                }
              >
                <button
                  type="button"
                  className="w-full text-right hover:underline"
                  onClick={() => {
                    setSort((previous) =>
                      previous?.column === index && previous.desc
                        ? { column: index, desc: false }
                        : { column: index, desc: true }
                    )
                  }}
                >
                  {column}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.label}</TableCell>
              {row.values.map((value, index) => (
                <TableCell
                  key={`${row.id}-${String(index)}`}
                  className="text-right tabular-nums"
                >
                  {cell(value, row.formats[index] ?? "count")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/** A suppressed count reads as the marker inside a sentence, never as `0`. */
function screenedText(
  value: ScreenedNumber,
  format: (value: number) => string,
  locale: Locale
): string {
  return isSuppressed(value)
    ? m.insufficient_data({}, { locale })
    : format(value)
}
