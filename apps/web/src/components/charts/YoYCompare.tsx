import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"

import { GroupedBars } from "./GroupedBars"
import type { CategoryRow, ChartSeries, ChartUnit } from "./types"

export interface YoYCompareProps {
  /** One row per academic year; `label` is the printed form, e.g. "2024/25". */
  years: readonly CategoryRow[]
  /** Measures compared inside each year. They must share a unit. */
  series: readonly ChartSeries[]
  title: string
  description?: string
  unit?: ChartUnit
  valueAxisLabel?: string
  locale?: Locale
  height?: number
  className?: string
}

/**
 * Section 9: grouped bars per academic year.
 *
 * Deliberately a thin specialisation of {@link GroupedBars} - the academic year
 * is just the category axis - so year-over-year and by-work-type share one set
 * of bar geometry, colours, tooltip and table behaviour.
 */
export function YoYCompare({
  years,
  series,
  title,
  description,
  unit,
  valueAxisLabel,
  locale,
  height,
  className,
}: YoYCompareProps) {
  const active = locale ?? getLocale()
  return (
    <GroupedBars
      groups={years}
      series={series}
      title={title}
      description={description}
      unit={unit}
      valueAxisLabel={valueAxisLabel}
      categoryAxisLabel={m.chart_axis_academic_year({}, { locale: active })}
      locale={active}
      height={height}
      className={className}
    />
  )
}
