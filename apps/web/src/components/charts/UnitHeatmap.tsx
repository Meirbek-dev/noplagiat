import { useId, useMemo } from "react"

import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"

import { ChartEmptyState, ChartFrame } from "./ChartFrame"
import { SuppressedPatternDefs, suppressedFill } from "./SuppressedCell"
import { formatUnit, rampColor, rampInk, rampStep } from "./format"
import type { HeatmapMetric, HeatmapRow, ScreenedNumber } from "./types"
import { isSuppressed } from "./types"

export interface UnitHeatmapProps {
  /**
   * Faculties (public contour) or departments (internal drill-down). The shape
   * is TanStack Table-ready: `unit_label` is a plain accessor column and each
   * metric is `accessorFn: (row) => row.metrics[metric.id]`, so the same array
   * backs the heat cells and the table under them.
   */
  rows: readonly HeatmapRow[]
  metrics: readonly HeatmapMetric[]
  title: string
  description?: string
  locale?: Locale
  className?: string
}

const ROW_HEIGHT = 34
const CELL_WIDTH = 128
const HEADER_HEIGHT = 34
const CELL_GAP = 2

/**
 * The unit column has to fit the longest row label, or the cells - which paint
 * after the labels - cover the tail of the name: «Гуманитарно-педагогический
 * факультет» measured 220px against the fixed 180px column and was cut
 * mid-word on the public dashboard at every viewport width.
 *
 * There is no text metrics API during SSR, so the width is estimated from the
 * character count. `LABEL_CHAR_WIDTH` is the measured mean advance of Cyrillic
 * text at `fontSize=11` in Inter (≈5.9px); the estimate is rounded up and
 * bounded, and `LABEL_CLIP` guarantees the invariant the estimate only
 * approximates - a label longer than the cap is clipped at the column edge
 * rather than allowed to run under the first cell.
 */
const UNIT_COLUMN_MIN = 180
const UNIT_COLUMN_MAX = 320
const LABEL_CHAR_WIDTH = 6.1
const LABEL_PADDING = 12

function unitColumnWidth(rows: readonly HeatmapRow[]): number {
  let longest = 0
  for (const row of rows) longest = Math.max(longest, row.unit_label.length)
  const estimate = Math.ceil(longest * LABEL_CHAR_WIDTH) + LABEL_PADDING
  return Math.min(UNIT_COLUMN_MAX, Math.max(UNIT_COLUMN_MIN, estimate))
}

interface Cell {
  metricId: string
  value: ScreenedNumber
  step: 1 | 2 | 3 | 4 | 5 | null
  text: string
}

/**
 * Section 4: faculty × metric heat cells.
 *
 * Hand-rolled typed SVG rather than a `@tanstack/charts` `cell` mark, for one
 * reason: the suppressed treatment has to be a hatch, and the 0.16 SVG
 * renderer only accepts *linear gradients* as declared chart resources
 * (`gradients: [...]`) - there is no way to register an SVG `<pattern>` and
 * reference it as a mark paint. Everything else about the wrapper (tokens-only
 * colour, `<title>`/`<desc>`, per-cell tooltip, the hidden data table) is
 * identical to the library-backed wrappers.
 *
 * Colour is *sequential* per column: each metric is normalised over its own
 * numeric values, because a share and a count do not share a magnitude scale.
 */
export function UnitHeatmap({
  rows,
  metrics,
  title,
  description,
  locale,
  className,
}: UnitHeatmapProps) {
  const active = locale ?? getLocale()
  const idPrefix = useId().replace(/[^a-zA-Z0-9_-]/g, "-")
  const titleId = `${idPrefix}-title`
  const descId = `${idPrefix}-desc`

  const model = useMemo(() => {
    const extents = new Map<string, { min: number; max: number }>()
    for (const metric of metrics) {
      let min = Number.POSITIVE_INFINITY
      let max = Number.NEGATIVE_INFINITY
      for (const row of rows) {
        const value = row.metrics[metric.id]
        if (isSuppressed(value)) continue
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
      if (Number.isFinite(min)) extents.set(metric.id, { min, max })
    }

    let suppressed = 0
    const grid = rows.map((row) => ({
      row,
      cells: metrics.map<Cell>((metric) => {
        const value = row.metrics[metric.id]
        if (isSuppressed(value)) {
          suppressed += 1
          return {
            metricId: metric.id,
            value: "insufficient_data",
            step: null,
            text: m.insufficient_data({}, { locale: active }),
          }
        }
        const extent = extents.get(metric.id) ?? { min: value, max: value }
        return {
          metricId: metric.id,
          value,
          step: rampStep(value, extent.min, extent.max),
          text: formatUnit(value, metric.unit, active),
        }
      }),
    }))

    return {
      grid,
      suppressed,
      total: rows.length * metrics.length,
      extents,
    }
  }, [rows, metrics, active])

  const unitColumn = unitColumnWidth(rows)
  const width = unitColumn + metrics.length * CELL_WIDTH
  const height = HEADER_HEIGHT + rows.length * ROW_HEIGHT
  const labelClipId = `${idPrefix}-label-clip`
  const descriptionText =
    description ?? m.chart_heatmap_scale({}, { locale: active })

  return (
    <ChartFrame
      title={title}
      description={description}
      rowHeader={m.chart_heatmap_unit({}, { locale: active })}
      columns={metrics.map((metric) => metric.label)}
      rows={rows.map((row) => ({
        header: row.unit_label,
        cells: metrics.map(
          (metric) => row.metrics[metric.id] ?? "insufficient_data"
        ),
      }))}
      suppressed={{ count: model.suppressed, total: model.total }}
      locale={active}
      formatCell={(value, index) =>
        formatUnit(value, metricUnit(metrics, index), active)
      }
      className={className}
    >
      {rows.length === 0 || metrics.length === 0 ? (
        <ChartEmptyState locale={active} />
      ) : (
        <div className="w-full overflow-x-auto">
          <svg
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
            viewBox={`0 0 ${String(width)} ${String(height)}`}
            width="100%"
            height={height}
            preserveAspectRatio="xMinYMin meet"
            style={{ minWidth: width, display: "block" }}
          >
            <title id={titleId}>{title}</title>
            <desc id={descId}>{descriptionText}</desc>
            <SuppressedPatternDefs idPrefix={idPrefix} />
            <defs>
              <clipPath id={labelClipId}>
                <rect
                  x={0}
                  y={0}
                  width={unitColumn - LABEL_PADDING}
                  height={height}
                />
              </clipPath>
            </defs>

            {metrics.map((metric, column) => (
              <text
                key={metric.id}
                x={unitColumn + column * CELL_WIDTH + CELL_WIDTH / 2}
                y={HEADER_HEIGHT - 12}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--chart-ink-muted)"
              >
                {metric.label}
              </text>
            ))}

            {model.grid.map((entry, rowIndex) => {
              const y = HEADER_HEIGHT + rowIndex * ROW_HEIGHT
              return (
                // `data-unit-code` carries the dictionary code, so a test can
                // name a row whose visible label is localized.
                <g key={entry.row.unit_id} data-unit-code={entry.row.unit_id}>
                  <text
                    x={0}
                    y={y + ROW_HEIGHT / 2}
                    dominantBaseline="middle"
                    fontSize={11}
                    fill="var(--chart-ink)"
                    clipPath={`url(#${labelClipId})`}
                  >
                    {/* The full name for a reader who cannot see the clip. */}
                    <title>{entry.row.unit_label}</title>
                    {entry.row.unit_label}
                  </text>
                  {entry.cells.map((cell, column) => {
                    const step = cell.step
                    const x = unitColumn + column * CELL_WIDTH
                    const fill =
                      step === null ? suppressedFill(idPrefix) : rampColor(step)
                    const ink =
                      step === null ? "var(--suppressed-fg)" : rampInk(step)
                    return (
                      <g key={cell.metricId}>
                        <rect
                          x={x}
                          y={y}
                          width={CELL_WIDTH - CELL_GAP}
                          height={ROW_HEIGHT - CELL_GAP}
                          rx={3}
                          fill={fill}
                        >
                          <title>
                            {`${entry.row.unit_label} · ${metricLabel(metrics, column, cell.metricId)}: ${cell.text}`}
                          </title>
                        </rect>
                        <text
                          x={x + (CELL_WIDTH - CELL_GAP) / 2}
                          y={y + (ROW_HEIGHT - CELL_GAP) / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={step === null ? 9 : 11}
                          fontStyle={step === null ? "italic" : undefined}
                          fill={ink}
                          pointerEvents="none"
                        >
                          {cell.text}
                        </text>
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>

          <HeatmapScaleLegend idPrefix={idPrefix} locale={active} />
        </div>
      )}
    </ChartFrame>
  )
}

function metricUnit(
  metrics: readonly HeatmapMetric[],
  column: number
): HeatmapMetric["unit"] {
  const metric: HeatmapMetric | undefined = metrics[column]
  return metric ? metric.unit : undefined
}

function metricLabel(
  metrics: readonly HeatmapMetric[],
  column: number,
  fallback: string
): string {
  const metric: HeatmapMetric | undefined = metrics[column]
  return metric ? metric.label : fallback
}

function HeatmapScaleLegend({
  idPrefix,
  locale,
}: {
  idPrefix: string
  locale: Locale
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span>{m.chart_heatmap_scale({}, { locale })}</span>
      <svg
        width={96}
        height={12}
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <SuppressedPatternDefs idPrefix={`${idPrefix}-legend`} />
        {([1, 2, 3, 4, 5] as const).map((step, index) => (
          <rect
            key={step}
            x={index * 16}
            y={0}
            width={14}
            height={12}
            rx={2}
            fill={rampColor(step)}
          />
        ))}
        <rect
          x={5 * 16 + 2}
          y={0}
          width={14}
          height={12}
          rx={2}
          fill={suppressedFill(`${idPrefix}-legend`)}
        />
      </svg>
      <span className="np-suppressed rounded px-1.5 py-0.5 italic">
        {m.insufficient_data({}, { locale })}
      </span>
    </div>
  )
}
