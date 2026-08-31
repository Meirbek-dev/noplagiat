import { useMemo } from "react"

import { defineChart, lineY } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip } from "@tanstack/charts/tooltip"

import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"
import { cn } from "../../lib/utils"

import { SrDataTable, SuppressionNote } from "./ChartFrame"
import { ScreenedValue } from "./SuppressedCell"
import { formatUnit, numericPoints, seriesColor } from "./format"
import type { ChartUnit, ScreenedNumber, SparklinePoint } from "./types"
import { isSuppressed } from "./types"

export interface KpiCardProps {
  /** Already-localized metric name. */
  label: string
  value: ScreenedNumber
  /** Same metric over the previous period; omit when there is no comparison. */
  previous?: ScreenedNumber
  unit?: ChartUnit
  /** Optional inline sparkline. Suppressed points are skipped, never zeroed. */
  spark?: readonly SparklinePoint[]
  /** Extra context under the value (period, denominator, …). */
  description?: string
  /**
   * Overrides the unit formatter for the value, the delta and the data table.
   * A chart axis wants one decimal; a headline KPI compared against
   * `fixtures/expected.json` wants the page precision from `lib/format.ts`.
   */
  format?: (value: number) => string
  locale?: Locale
  className?: string
  /**
   * Stable hook for the e2e suite, which compares the printed headline against
   * `fixtures/expected.json`. The label is localized and the layout is a grid,
   * so neither text nor position identifies a card across locales.
   */
  testId?: string
}

/**
 * Overview KPI (ARCHITECTURE §5.2, section 1): headline value, delta against
 * the previous period, and an inline sparkline.
 *
 * The delta is deliberately *not* colour-coded. "More checks" is neither good
 * nor bad here, and a red/green pair would spend the status channel on a
 * judgement the data does not make; direction is carried by an arrow glyph and
 * by the words "рост"/"снижение" instead.
 */
export function KpiCard({
  label,
  value,
  previous,
  unit,
  spark,
  description,
  format: formatOverride,
  locale,
  className,
  testId,
}: KpiCardProps) {
  const active = locale ?? getLocale()
  const format = useMemo(
    () => formatOverride ?? ((n: number) => formatUnit(n, unit, active)),
    [formatOverride, unit, active]
  )

  const series = useMemo(
    () => numericPoints(spark ?? [], (point) => point.value),
    [spark]
  )
  const sparkRows = useMemo(
    () => series.points.map((point) => ({ ...point.row, value: point.value })),
    [series]
  )

  const definition = useMemo(() => {
    if (sparkRows.length < 2) return null
    return defineChart({
      marks: [
        lineY(sparkRows, {
          x: "label",
          y: "value",
          stroke: seriesColor(1),
          strokeWidth: 2,
        }),
      ],
      scales: {
        x: { scale: () => scalePoint<string>().padding(0.02), axis: false },
        y: { scale: scaleLinear, nice: true, axis: false },
      },
      guides: false,
      tooltip: {
        use: tooltip,
        format: (point) => `${point.datum.label}: ${format(point.datum.value)}`,
      },
    })
  }, [sparkRows, format])

  const delta = deltaOf(value, previous)

  return (
    <article
      data-testid={testId}
      className={cn(
        "np-chart flex flex-col gap-1 rounded-lg border bg-card p-4 text-card-foreground",
        className
      )}
    >
      <h3 className="text-xs font-medium text-muted-foreground">{label}</h3>
      <p
        data-testid="kpi-value"
        className="text-2xl leading-tight font-semibold"
      >
        <ScreenedValue value={value} locale={active} format={format} />
      </p>

      {delta === null ? null : (
        <p className="text-xs text-muted-foreground">
          <span aria-hidden="true">{DELTA_GLYPH[delta.direction]} </span>
          {deltaLabel(delta, format, active)}{" "}
          {m.chart_kpi_previous({}, { locale: active })}
        </p>
      )}

      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}

      {definition ? (
        <Chart
          definition={definition}
          height={40}
          initialWidth={240}
          className="mt-1"
          ariaLabel={`${m.chart_kpi_sparkline({}, { locale: active })} - ${label}`}
          ariaDescription={description ?? label}
        />
      ) : null}

      {spark && spark.length > 0 ? (
        <>
          <SuppressionNote
            suppressed={{ count: series.suppressed, total: spark.length }}
            locale={active}
          />
          <SrDataTable
            caption={`${m.chart_kpi_sparkline({}, { locale: active })} - ${label}`}
            rowHeader={m.chart_axis_month({}, { locale: active })}
            columns={[label]}
            rows={spark.map((point) => ({
              header: point.label,
              cells: [point.value],
            }))}
            locale={active}
            formatCell={format}
          />
        </>
      ) : null}
    </article>
  )
}

type DeltaDirection = "up" | "down" | "flat"

const DELTA_GLYPH: Record<DeltaDirection, string> = {
  up: "▲",
  down: "▼",
  flat: "-",
}

function deltaOf(
  value: ScreenedNumber,
  previous: ScreenedNumber | undefined
): { direction: DeltaDirection; magnitude: number } | null {
  if (isSuppressed(value) || isSuppressed(previous)) return null
  const difference = value - previous
  if (difference === 0) return { direction: "flat", magnitude: 0 }
  return {
    direction: difference > 0 ? "up" : "down",
    magnitude: Math.abs(difference),
  }
}

function deltaLabel(
  delta: { direction: DeltaDirection; magnitude: number },
  format: (n: number) => string,
  locale: Locale
): string {
  if (delta.direction === "flat") return m.chart_kpi_delta_flat({}, { locale })
  const inputs = { delta: format(delta.magnitude) }
  return delta.direction === "up"
    ? m.chart_kpi_delta_up(inputs, { locale })
    : m.chart_kpi_delta_down(inputs, { locale })
}
