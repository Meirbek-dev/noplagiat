import { useMemo } from "react"

import { defineChart, lineY, rect } from "@tanstack/charts"
import type {
  ChartFocusResolveContext,
  ChartPoint,
  ChartValue,
} from "@tanstack/charts"
import { focusGroupX } from "@tanstack/charts/focus"
import { Chart } from "@tanstack/charts/react"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip } from "@tanstack/charts/tooltip"

import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"

import { ChartEmptyState, ChartFrame } from "./ChartFrame"
import type { ChartLegendItem } from "./ChartFrame"
import {
  formatMonth,
  formatNumber,
  formatPercent,
  gappedPoints,
  monthAxisFormat,
  monthAxisTicks,
  monthOrdinal,
  niceMax,
  seriesColor,
} from "./format"
import type { SemesterBand, TimeSeriesPoint } from "./types"

/**
 * `"stacked"` renders the two measures as synchronised panels over one shared
 * month axis; `"dual-axis"` renders the single plot with a second y axis on the
 * right that ARCHITECTURE §5.2 describes.
 *
 * The default is `"stacked"`: two y scales in one frame let the reader infer a
 * crossing point that is an artefact of the scale choice, which the `dataviz`
 * guidance rules out outright. Both are implemented so the section can be
 * switched without touching route code - see README.md.
 */
export type TimeSeriesLayout = "stacked" | "dual-axis"

export interface TimeSeriesProps {
  points: readonly TimeSeriesPoint[]
  /** Optional semester overlay drawn under the lines. */
  bands?: readonly SemesterBand[]
  layout?: TimeSeriesLayout
  /** Accessible name of the chart. */
  title: string
  description?: string
  locale?: Locale
  /** Height of one panel, in pixels. */
  height?: number
  className?: string
}

interface MonthValue {
  month: string
  label: string
  series: "checks" | "originality" | "escalated" | "rechecks"
  /** `null` marks a suppressed month - the line breaks instead of bridging it. */
  value: number | null
}

interface BandRow {
  id: string
  kind: SemesterBand["kind"]
  label: string
  from: string
  to: string
  lo: number
  hi: number
}

/** A focused datum that carries a measurement, as opposed to a band. */
function isMeasured(datum: MonthValue | BandRow): datum is MonthValue {
  return "value" in datum
}

/** The same test against an untyped focus point. */
function pointIsMeasured(point: { datum: unknown }): boolean {
  const datum: unknown = point.datum
  return typeof datum === "object" && datum !== null && "value" in datum
}

/**
 * `group-x`, with the semester bands demoted from answer to context.
 *
 * A band is a full-height rect and therefore a legitimate focus candidate: its
 * anchor sits at the middle of the semester, and a pointer near that anchor
 * made the *band* the primary point - the focus ring painted in the band colour
 * and the column was reported as «Осенний семестр 2023/24» rather than as a
 * number. Bands are filtered out of resolution and keyboard navigation, and
 * left in the group, so the tooltip can still name the semester it is over.
 */
const focusMeasuredGroupX = {
  resolve<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(
    points: readonly ChartPoint<TDatum, TXValue, TYValue>[],
    context: ChartFocusResolveContext
  ) {
    return focusGroupX.resolve(points.filter(pointIsMeasured), context)
  },
  group: focusGroupX.group,
  navigation<TDatum, TXValue extends ChartValue, TYValue extends ChartValue>(
    points: readonly ChartPoint<TDatum, TXValue, TYValue>[]
  ) {
    return focusGroupX.navigation(points.filter(pointIsMeasured))
  },
}

/** Sections 2 and 9: checks per month against mean originality per month. */
export function TimeSeries({
  points,
  bands,
  layout = "stacked",
  title,
  description,
  locale,
  height = 240,
  className,
}: TimeSeriesProps) {
  const active = locale ?? getLocale()

  const seriesLabels = useMemo<Record<MonthValue["series"], string>>(
    () => ({
      checks: m.chart_series_checks({}, { locale: active }),
      originality: m.chart_series_originality({}, { locale: active }),
      escalated: m.chart_series_escalated({}, { locale: active }),
      rechecks: m.chart_series_rechecks({}, { locale: active }),
    }),
    [active]
  )

  const model = useMemo(() => {
    const months = points.map((point) => point.month)
    const checks = gappedPoints(points, (point) => point.checks)
    const originality = gappedPoints(points, (point) => point.avg_originality)
    const toRow =
      (series: MonthValue["series"]) =>
      (entry: { row: TimeSeriesPoint; value: number | null }): MonthValue => ({
        month: entry.row.month,
        label: formatMonth(entry.row.month, active),
        series,
        value: entry.value,
      })
    const checksRows: MonthValue[] = checks.points.map(toRow("checks"))
    const originalityRows: MonthValue[] = originality.points.map(
      toRow("originality")
    )
    const checksMax = niceMax(
      checksRows.flatMap((row) => (row.value === null ? [] : [row.value]))
    )

    // The flags panel exists only for a response that carries the measures -
    // the internal contour's timeseries does not - and «not supplied» is not
    // «suppressed», so an absent field is not counted against the frame's
    // suppression note.
    const hasFlags = points.some(
      (point) => point.escalated !== undefined || point.rechecks !== undefined
    )
    const escalated = gappedPoints(points, (point) => point.escalated)
    const rechecks = gappedPoints(points, (point) => point.rechecks)
    const flagRows: MonthValue[] = hasFlags
      ? [
          ...escalated.points.map(toRow("escalated")),
          ...rechecks.points.map(toRow("rechecks")),
        ]
      : []
    const flagsMax = niceMax(
      flagRows.flatMap((row) => (row.value === null ? [] : [row.value]))
    )

    return {
      months,
      checksRows,
      originalityRows,
      checksMax,
      hasFlags,
      flagRows,
      flagsMax,
      suppressed:
        checks.suppressed +
        originality.suppressed +
        (hasFlags ? escalated.suppressed + rechecks.suppressed : 0),
      total: points.length * (hasFlags ? 4 : 2),
    }
  }, [points, active])

  const bandRows = useMemo<BandRow[]>(() => {
    if (!bands || bands.length === 0 || model.months.length === 0) return []
    const first = monthOrdinal(model.months[0] ?? "")
    const last = monthOrdinal(model.months[model.months.length - 1] ?? "")
    return bands
      .filter((band) => {
        const from = monthOrdinal(band.from)
        const to = monthOrdinal(band.to)
        return (
          Number.isFinite(from) &&
          Number.isFinite(to) &&
          to >= first &&
          from <= last
        )
      })
      .map((band) => ({
        id: band.id,
        kind: band.kind,
        label: band.label,
        from: clampMonth(band.from, model.months),
        to: clampMonth(band.to, model.months),
        lo: 0,
        hi: 1,
      }))
  }, [bands, model.months])

  const xScale = useMemo(
    () => scalePoint<string>().domain(model.months).padding(0.04),
    [model.months]
  )

  /**
   * Candidates are chosen here rather than left to width-based thinning, which
   * over five years yields an irregular 2-3-4-month step. `thin` stays on as a
   * narrow-viewport backstop; it can only drop labels the step already spaced
   * out, never reintroduce an uneven one.
   */
  const monthAxis = useMemo(() => {
    const values = monthAxisTicks(model.months)
    return {
      ticks: { values, format: monthAxisFormat(values, active) },
      tickLabels: { thin: { minGap: 8, priority: "ends" as const } },
    }
  }, [model.months, active])

  const tooltipText = useMemo(
    () => groupTooltip(seriesLabels, active),
    [seriesLabels, active]
  )

  const flagsDefinition = useMemo(() => {
    return defineChart({
      marks: [
        ...bandMarks(bandRows, model.flagsMax),
        lineY(
          model.flagRows.filter((row) => row.series === "escalated"),
          {
            x: "month",
            y: "value",
            stroke: seriesColor(3),
            strokeWidth: 2,
            points: true,
          }
        ),
        lineY(
          model.flagRows.filter((row) => row.series === "rechecks"),
          {
            x: "month",
            y: "value",
            stroke: seriesColor(4),
            strokeWidth: 2,
            strokeDasharray: "6 4",
            points: true,
          }
        ),
      ],
      scales: {
        x: { scale: xScale, axis: monthAxis },
        y: {
          scale: scaleLinear().domain([0, model.flagsMax]),
          grid: true,
          axis: { label: m.chart_axis_count({}, { locale: active }) },
        },
      },
      focus: focusMeasuredGroupX,
      tooltip: { use: tooltip, formatGroup: tooltipText },
    })
  }, [
    bandRows,
    model.flagRows,
    model.flagsMax,
    xScale,
    monthAxis,
    tooltipText,
    active,
  ])

  const checksDefinition = useMemo(() => {
    return defineChart({
      marks: [
        ...bandMarks(bandRows, model.checksMax),
        lineY(model.checksRows, {
          x: "month",
          y: "value",
          stroke: seriesColor(1),
          strokeWidth: 2,
          points: true,
        }),
      ],
      scales: {
        x: { scale: xScale, axis: monthAxis },
        y: {
          scale: scaleLinear().domain([0, model.checksMax]),
          grid: true,
          axis: { label: m.chart_axis_count({}, { locale: active }) },
        },
      },
      focus: focusMeasuredGroupX,
      tooltip: { use: tooltip, formatGroup: tooltipText },
    })
  }, [
    bandRows,
    model.checksRows,
    model.checksMax,
    xScale,
    monthAxis,
    tooltipText,
    active,
  ])

  const originalityDefinition = useMemo(() => {
    return defineChart({
      marks: [
        ...bandMarks(bandRows, 100),
        lineY(model.originalityRows, {
          x: "month",
          y: "value",
          stroke: seriesColor(2),
          strokeWidth: 2,
          points: true,
        }),
      ],
      scales: {
        x: { scale: xScale, axis: monthAxis },
        y: {
          scale: scaleLinear().domain([0, 100]),
          grid: true,
          axis: { label: m.chart_axis_originality({}, { locale: active }) },
        },
      },
      focus: focusMeasuredGroupX,
      tooltip: { use: tooltip, formatGroup: tooltipText },
    })
  }, [bandRows, model.originalityRows, xScale, monthAxis, tooltipText, active])

  const dualDefinition = useMemo(() => {
    return defineChart({
      marks: [
        ...bandMarks(bandRows, model.checksMax),
        lineY(model.checksRows, {
          x: "month",
          y: "value",
          stroke: seriesColor(1),
          strokeWidth: 2,
          points: true,
        }),
        lineY(model.originalityRows, {
          x: "month",
          y: "value",
          yScale: "originality",
          stroke: seriesColor(2),
          strokeWidth: 2,
          strokeDasharray: "6 4",
          points: true,
        }),
      ],
      scales: {
        x: { scale: xScale, axis: monthAxis },
        y: {
          scale: scaleLinear().domain([0, model.checksMax]),
          grid: true,
          axis: { label: m.chart_axis_count({}, { locale: active }) },
        },
        originality: {
          channel: "y",
          scale: scaleLinear().domain([0, 100]),
          side: "right",
          axis: { label: m.chart_axis_originality({}, { locale: active }) },
        },
      },
      focus: focusMeasuredGroupX,
      tooltip: { use: tooltip, formatGroup: tooltipText },
    })
  }, [
    bandRows,
    model.checksRows,
    model.originalityRows,
    model.checksMax,
    xScale,
    monthAxis,
    tooltipText,
    active,
  ])

  const checksLabel = seriesLabels.checks
  const originalityLabel = seriesLabels.originality

  const legend: ChartLegendItem[] = [
    { id: "checks", label: checksLabel, color: seriesColor(1) },
    { id: "originality", label: originalityLabel, color: seriesColor(2) },
  ]
  if (model.hasFlags) {
    legend.push(
      { id: "escalated", label: seriesLabels.escalated, color: seriesColor(3) },
      { id: "rechecks", label: seriesLabels.rechecks, color: seriesColor(4) }
    )
  }
  if (bandRows.some((band) => band.kind === "autumn")) {
    legend.push({
      id: "bands",
      // The shading marks one semester of the pair, so the legend names *that*
      // semester. «Границы семестров» described a boundary the chart never drew.
      label: m.chart_semester_shading({}, { locale: active }),
      color: "var(--chart-band)",
    })
  }

  const columns = model.hasFlags
    ? [
        checksLabel,
        originalityLabel,
        seriesLabels.escalated,
        seriesLabels.rechecks,
      ]
    : [checksLabel, originalityLabel]

  const flagsPanel = model.hasFlags ? (
    <Chart
      definition={flagsDefinition}
      height={height}
      ariaLabel={`${title} - ${m.chart_dynamics_flags_title({}, { locale: active })}`}
      ariaDescription={`${seriesLabels.escalated} / ${seriesLabels.rechecks}`}
    />
  ) : null

  return (
    <ChartFrame
      title={title}
      description={description}
      rowHeader={m.chart_axis_month({}, { locale: active })}
      columns={columns}
      rows={points.map((point) => ({
        header: formatMonth(point.month, active),
        cells: model.hasFlags
          ? [
              point.checks,
              point.avg_originality,
              point.escalated ?? "insufficient_data",
              point.rechecks ?? "insufficient_data",
            ]
          : [point.checks, point.avg_originality],
      }))}
      suppressed={{ count: model.suppressed, total: model.total }}
      legend={legend}
      locale={active}
      formatCell={(value, index) =>
        index === 1 ? formatPercent(value, active) : formatNumber(value, active)
      }
      className={className}
    >
      {points.length === 0 ? (
        <ChartEmptyState locale={active} />
      ) : layout === "dual-axis" ? (
        <div className="flex flex-col gap-1">
          <Chart
            definition={dualDefinition}
            height={height}
            ariaLabel={title}
            ariaDescription={`${checksLabel} / ${originalityLabel}. ${description ?? ""}`.trim()}
          />
          {flagsPanel}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <Chart
            definition={checksDefinition}
            height={height}
            ariaLabel={`${title} - ${checksLabel}`}
            ariaDescription={description ?? checksLabel}
          />
          <Chart
            definition={originalityDefinition}
            height={height}
            ariaLabel={`${title} - ${originalityLabel}`}
            ariaDescription={description ?? originalityLabel}
          />
          {flagsPanel}
        </div>
      )}
    </ChartFrame>
  )
}

/**
 * Only the autumn half of each pair is painted. Shading both in one fill tiles
 * the plot end to end and the boundary between two semesters disappears; every
 * other semester leaves the 1 September edge visible, which is the orientation
 * the band exists to give.
 *
 * The rect spans the *centres* of the first and last month of the semester -
 * `scalePoint` has no bandwidth to extend to - so the shading sits half a month
 * inside the semester at each end. At the density this chart runs at (one point
 * per month over several years) that is a hairline, and the alternative is a
 * band scale the lines would then have to be re-fitted to.
 */
function bandMarks(bands: readonly BandRow[], top: number) {
  const rows = bands
    .filter((band) => band.kind === "autumn")
    .map((band) => ({ ...band, lo: 0, hi: top }))
  if (rows.length === 0) return []
  return [
    rect(rows, {
      x1: "from",
      x2: "to",
      y1: "lo",
      y2: "hi",
      fill: "var(--chart-band)",
      fillOpacity: 0.1,
    }),
  ]
}

/**
 * One tooltip for the whole focused month.
 *
 * `focus: "group-x"` collects every mark under the cursor, bands included, and
 * a per-point `format` therefore had the band answering for the column: hovering
 * printed «Осенний семестр 2023/24» where the reader asked for a number. The
 * group is formatted once instead - measurements first, the semester kept as
 * trailing context rather than as the answer.
 */
function groupTooltip(
  labels: Record<MonthValue["series"], string>,
  locale: Locale
) {
  return (points: readonly { datum: MonthValue | BandRow }[]): string => {
    const parts: string[] = []
    let month = ""
    let band = ""
    let withheld = false

    for (const point of points) {
      const datum = point.datum
      if (!isMeasured(datum)) {
        band ||= datum.label
        continue
      }
      month ||= datum.label
      if (datum.value === null) {
        withheld = true
        continue
      }
      const value =
        datum.series === "originality"
          ? formatPercent(datum.value, locale)
          : formatNumber(datum.value, locale)
      parts.push(`${labels[datum.series]}: ${value}`)
    }

    if (parts.length === 0 && withheld) {
      parts.push(m.insufficient_data({}, { locale }))
    }
    const head = [month, ...parts].filter(Boolean).join(" · ")
    return band === "" ? head : `${head} · ${band}`
  }
}

/** Keeps a band inside the rendered month domain; scales reject unknown keys. */
function clampMonth(month: string, months: readonly string[]): string {
  if (months.includes(month)) return month
  const target = monthOrdinal(month)
  const first = months[0] ?? month
  const last = months[months.length - 1] ?? month
  if (target <= monthOrdinal(first)) return first
  return last
}
