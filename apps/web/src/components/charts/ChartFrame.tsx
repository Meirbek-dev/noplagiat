import type { ReactNode } from "react"

import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"
import { cn } from "../../lib/utils"

import { ScreenedValue } from "./SuppressedCell"
import type { DataTableRow } from "./types"

export interface ChartLegendItem {
  id: string
  label: string
  /** A `var(--chart-*)` reference. Hex literals are rejected by the token test. */
  color: string
}

/** How many cells were withheld by k-anonymity, out of how many total. */
export interface SuppressionSummary {
  count: number
  total: number
}

/**
 * The visually hidden table that carries every exact value. Present on every
 * chart (TZ §8: each chart is duplicated by text values), so nothing in the
 * dashboard is hover-only.
 */
export function SrDataTable({
  caption,
  rowHeader,
  columns,
  rows,
  locale,
  formatCell,
}: {
  caption: string
  rowHeader: string
  columns: readonly string[]
  rows: readonly DataTableRow[]
  locale: Locale
  formatCell?: (value: number, columnIndex: number) => string
}) {
  return (
    <div className="sr-only">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{rowHeader}</th>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.header}>
              <th scope="row">{row.header}</th>
              {row.cells.map((cell, index) => (
                <td key={`${row.header}-${columns[index] ?? String(index)}`}>
                  <ScreenedValue
                    value={cell}
                    locale={locale}
                    format={
                      formatCell
                        ? (n: number) => formatCell(n, index)
                        : undefined
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Shown instead of a plot when the filtered result set is empty. */
export function ChartEmptyState({ locale }: { locale: Locale }) {
  return (
    <p className="rounded border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
      {m.chart_empty({}, { locale })}
    </p>
  )
}

/** The explicit «недостаточно данных» note shown under a chart. */
export function SuppressionNote({
  suppressed,
  locale,
}: {
  suppressed: SuppressionSummary | undefined
  locale: Locale
}) {
  if (!suppressed || suppressed.count <= 0) return null
  return (
    <p className="np-suppressed rounded px-2 py-1 text-xs">
      {m.chart_suppressed_note(
        { count: suppressed.count, total: suppressed.total },
        { locale }
      )}
    </p>
  )
}

export interface ChartFrameProps {
  /** Accessible name of the chart. Also the `<caption>` of the data table. */
  title: string
  /** One sentence of context: units, period, what is being compared. */
  description?: string
  /** Header of the first (row-header) column of the data table. */
  rowHeader: string
  /** Headers of the value columns of the data table. */
  columns: readonly string[]
  rows: readonly DataTableRow[]
  suppressed?: SuppressionSummary
  legend?: readonly ChartLegendItem[]
  locale?: Locale
  formatCell?: (value: number, columnIndex: number) => string
  className?: string
  children: ReactNode
}

/**
 * Everything every chart owes its reader, in one place (TZ §8, PLAN W2.3):
 *
 * - a visible caption and a one-line description;
 * - a legend whose identity is carried by text, not by colour alone;
 * - an explicit «недостаточно данных» note whenever cells were withheld;
 * - a visually hidden `<table>` with every exact value.
 *
 * The `np-chart` class republishes the brand palette under the names
 * `@tanstack/charts` reads (`tokens.css`).
 */
export function ChartFrame({
  title,
  description,
  rowHeader,
  columns,
  rows,
  suppressed,
  legend,
  locale,
  formatCell,
  className,
  children,
}: ChartFrameProps) {
  const active = locale ?? getLocale()
  return (
    <figure className={cn("np-chart flex flex-col gap-2", className)}>
      <figcaption className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        {description ? (
          <span className="text-xs text-muted-foreground">{description}</span>
        ) : null}
      </figcaption>

      {legend && legend.length > 0 ? (
        <ul
          aria-label={m.chart_legend({}, { locale: active })}
          className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
        >
          {legend.map((item) => (
            <li key={item.id} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}

      {children}

      <SuppressionNote suppressed={suppressed} locale={active} />

      <SrDataTable
        caption={`${m.chart_data_table({}, { locale: active })} - ${title}`}
        rowHeader={rowHeader}
        columns={columns}
        rows={rows}
        locale={active}
        formatCell={formatCell}
      />
    </figure>
  )
}
