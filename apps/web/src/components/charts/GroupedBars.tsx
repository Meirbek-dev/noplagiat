import { useMemo } from "react"

import { barX, barY, defineChart, group, text } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip } from "@tanstack/charts/tooltip"

import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"

import { ChartEmptyState, ChartFrame } from "./ChartFrame"
import type { ChartLegendItem } from "./ChartFrame"
import { formatUnit, niceMax, seriesColor } from "./format"
import type { PaletteSlot } from "./format"
import type { CategoryRow, ChartSeries, ChartUnit } from "./types"
import { isSuppressed } from "./types"

export interface GroupedBarsProps {
  /**
   * Series drawn side by side inside each category. They share ONE value axis,
   * so they must share a unit: count against count, percent against percent.
   * Two measures on different scales are two `GroupedBars` next to each other,
   * never a second y axis (see README.md).
   */
  series: readonly ChartSeries[]
  groups: readonly CategoryRow[]
  /** Accessible name of the chart. */
  title: string
  description?: string
  /** Unit of the shared value axis. */
  unit?: ChartUnit
  valueAxisLabel?: string
  categoryAxisLabel?: string
  /**
   * Which way the bars run.
   *
   * `"vertical"` (the default) puts the categories on the x axis, which is
   * right for short names - an academic year, a month.
   *
   * `"horizontal"` puts them on the y axis, one per row. That is the form the
   * `dataviz` guidance prescribes for **long-named categories**, and it is not
   * a stylistic preference: the work-type dictionary contains names up to 37
   * characters («Научно-исследовательская работа (НИР)» measures 226px), the
   * renderer thins colliding tick labels, and the vertical form therefore
   * printed **three** of the seven names - the other four bars had no visible
   * identity at all. Fitting them by rotation would need ~72°, which is
   * unreadable and taller than the plot.
   */
  orientation?: "vertical" | "horizontal"
  locale?: Locale
  height?: number
  className?: string
}

interface BarRow {
  key: string
  category: string
  categoryLabel: string
  seriesId: string
  seriesLabel: string
  color: string
  value: number
}

/** A category with nothing left to plot: the marker sits on the baseline. */
interface MarkerRow {
  categoryLabel: string
  zero: number
  marker: string
}

/** Section 3: one measure per work type, one bar per series. */
export function GroupedBars({
  series,
  groups,
  title,
  description,
  unit,
  valueAxisLabel,
  categoryAxisLabel,
  orientation = "vertical",
  locale,
  height,
  className,
}: GroupedBarsProps) {
  const active = locale ?? getLocale()
  const format = useMemo(
    () => (n: number) => formatUnit(n, unit, active),
    [unit, active]
  )

  const model = useMemo(() => {
    const rows: BarRow[] = []
    let suppressed = 0
    for (const category of groups) {
      for (const [index, item] of series.entries()) {
        const value = category.values[item.id]
        if (isSuppressed(value)) {
          suppressed += 1
          continue
        }
        rows.push({
          key: `${category.id}:${item.id}`,
          category: category.id,
          categoryLabel: category.label,
          seriesId: item.id,
          seriesLabel: item.label,
          color: seriesColor(slotOf(item, index)),
          value,
        })
      }
    }
    // A category whose every series was withheld would otherwise leave an
    // empty slot that reads as a zero. It gets the marker printed on the
    // baseline instead (TZ §8: suppression is always explicit).
    const marker = m.insufficient_data({}, { locale: active })
    const emptyCategories: MarkerRow[] = groups
      .filter((category) =>
        series.every((item) => isSuppressed(category.values[item.id]))
      )
      .map((category) => ({
        categoryLabel: category.label,
        zero: 0,
        marker,
      }))
    return {
      rows,
      emptyCategories,
      suppressed,
      total: groups.length * series.length,
      max: niceMax(rows.map((row) => row.value)),
      categories: groups.map((category) => category.label),
    }
  }, [groups, series, active])

  /**
   * The two orientations are two chart *types*, not one chart with a flag:
   * `barY` binds a string x and a numeric y, `barX` the reverse, and the
   * generated definitions therefore have incompatible value types. They are
   * built separately and one of them is rendered.
   */
  const shared = useMemo(() => {
    // Direct labels only make sense with a single bar per band; with several
    // they all land on the band centre and collide. The data table carries the
    // exact values in every other case.
    const labelled = series.length === 1 && model.rows.length <= 12
    return {
      labelled,
      categoryScale: {
        scale: scaleBand<string>().domain(model.categories).padding(0.24),
        // Every category is named. `thin: false` is the point of the
        // horizontal form: rows never collide, so nothing has to be dropped.
        axis: {
          label: categoryAxisLabel,
          tickLabels: { thin: false as const },
        },
      },
      valueScale: {
        scale: scaleLinear().domain([0, model.max]),
        grid: true,
        axis: {
          label: valueAxisLabel ?? m.chart_axis_value({}, { locale: active }),
        },
      },
      tooltip: {
        use: tooltip,
        format: (point: { datum: BarRow | MarkerRow }) => {
          const datum = point.datum
          return "seriesLabel" in datum
            ? `${datum.categoryLabel} · ${datum.seriesLabel}: ${format(datum.value)}`
            : `${datum.categoryLabel}: ${datum.marker}`
        },
      },
    }
  }, [
    model.categories,
    model.max,
    model.rows.length,
    series.length,
    format,
    valueAxisLabel,
    categoryAxisLabel,
    active,
  ])

  const horizontal = useMemo(
    () =>
      defineChart({
        marks: [
          barX(model.rows, {
            y: "categoryLabel",
            x: "value",
            z: "seriesId",
            key: "key",
            fill: (row: BarRow) => row.color,
            layout: group({ padding: 0.14 }),
            radius: 4,
            maxThickness: 28,
          }),
          text(shared.labelled ? model.rows : ([] as BarRow[]), {
            y: "categoryLabel",
            x: "value",
            text: (row: BarRow) => format(row.value),
            fill: "var(--chart-ink)",
            fontSize: 11,
            // Past the bar end rather than above it.
            dx: 6,
            anchor: "start",
          }),
          text(model.emptyCategories, {
            y: "categoryLabel",
            x: "zero",
            text: "marker",
            fill: "var(--suppressed-fg)",
            fontSize: 9,
            dx: 6,
            anchor: "start",
          }),
        ],
        scales: { y: shared.categoryScale, x: shared.valueScale },
        tooltip: shared.tooltip,
      }),
    [model.rows, model.emptyCategories, shared, format]
  )

  const vertical = useMemo(
    () =>
      defineChart({
        marks: [
          barY(model.rows, {
            x: "categoryLabel",
            y: "value",
            z: "seriesId",
            key: "key",
            fill: (row: BarRow) => row.color,
            layout: group({ padding: 0.14 }),
            radius: 4,
            maxThickness: 56,
          }),
          text(shared.labelled ? model.rows : ([] as BarRow[]), {
            x: "categoryLabel",
            y: "value",
            text: (row: BarRow) => format(row.value),
            fill: "var(--chart-ink)",
            fontSize: 11,
            dy: -9,
          }),
          text(model.emptyCategories, {
            x: "categoryLabel",
            y: "zero",
            text: "marker",
            fill: "var(--suppressed-fg)",
            fontSize: 9,
            dy: -10,
          }),
        ],
        scales: { x: shared.categoryScale, y: shared.valueScale },
        tooltip: shared.tooltip,
      }),
    [model.rows, model.emptyCategories, shared, format]
  )

  const legend: ChartLegendItem[] = series.map((item, index) => ({
    id: item.id,
    label: item.label,
    color: seriesColor(slotOf(item, index)),
  }))

  return (
    <ChartFrame
      title={title}
      description={description}
      rowHeader={
        categoryAxisLabel ?? m.chart_axis_category({}, { locale: active })
      }
      columns={series.map((item) => item.label)}
      rows={groups.map((category) => ({
        header: category.label,
        cells: series.map(
          (item) => category.values[item.id] ?? "insufficient_data"
        ),
      }))}
      suppressed={{ count: model.suppressed, total: model.total }}
      legend={series.length > 1 ? legend : undefined}
      locale={active}
      formatCell={format}
      className={className}
    >
      {groups.length === 0 ? (
        <ChartEmptyState locale={active} />
      ) : orientation === "horizontal" ? (
        <Chart
          definition={horizontal}
          // A horizontal chart grows with its rows rather than fitting a fixed
          // box, or seven work types would be seven slivers in 260px.
          height={height ?? Math.max(200, 56 + groups.length * 34)}
          ariaLabel={title}
          ariaDescription={
            description ?? series.map((item) => item.label).join(", ")
          }
        />
      ) : (
        <Chart
          definition={vertical}
          height={height ?? 260}
          ariaLabel={title}
          ariaDescription={
            description ?? series.map((item) => item.label).join(", ")
          }
        />
      )}
    </ChartFrame>
  )
}

/**
 * Slot order is fixed and explicit, so a filtered-out series never repaints the
 * survivors. Slots are assigned in order and never cycled: past six series the
 * caller folds the tail into an "Other" row or facets the chart, rather than
 * reusing slot 1 for a seventh identity.
 */
export function slotOf(item: ChartSeries, index: number): PaletteSlot {
  if (item.slot) return item.slot
  return ([1, 2, 3, 4, 5, 6] as const)[Math.min(index, 5)] ?? 1
}
