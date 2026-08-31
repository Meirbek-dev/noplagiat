import { renderToStaticMarkup } from "react-dom/server"

import { describe, expect, it } from "vite-plus/test"

import { GroupedBars } from "./GroupedBars"
import { KpiCard } from "./KpiCard"
import { OriginalityHistogram } from "./OriginalityHistogram"
import { TimeSeries } from "./TimeSeries"
import { UnitHeatmap } from "./UnitHeatmap"
import { YoYCompare } from "./YoYCompare"
import type {
  CategoryRow,
  HeatmapMetric,
  HeatmapRow,
  OriginalityBucket,
  TimeSeriesPoint,
} from "./types"

/**
 * Wrappers are rendered through `react-dom/server`: the SVG surface is produced
 * during React render (the adapter is SSR-first), so the real marks, axes and
 * accessible scaffolding are all in the output without a DOM emulator. Adding
 * `jsdom`/`happy-dom` would only exercise the post-mount host, which belongs to
 * the Playwright layer (W2.7).
 */
const render = (node: React.ReactElement) => renderToStaticMarkup(node)

/** The localized suppression marker, RU (the base locale). */
const MARKER = "недостаточно данных"

const months: TimeSeriesPoint[] = [
  { month: "2024-09", checks: 120, avg_originality: 71.2 },
  { month: "2024-10", checks: 260, avg_originality: 74.9 },
  { month: "2024-11", checks: 310, avg_originality: 76.1 },
  { month: "2024-12", checks: "insufficient_data", avg_originality: 72.4 },
]

const workTypes: CategoryRow[] = [
  { id: "thesis", label: "ВКР", values: { count: 420 } },
  { id: "course", label: "Курсовая", values: { count: 1180 } },
  { id: "article", label: "Статья", values: { count: "insufficient_data" } },
]

const buckets: OriginalityBucket[] = [
  { bucket: "lt_50", count: 40 },
  { bucket: "b50_70", count: 160 },
  { bucket: "b70_85", count: 300 },
  { bucket: "b85_95", count: 240 },
  { bucket: "gte_95", count: "insufficient_data" },
]

const metrics: HeatmapMetric[] = [
  { id: "checks", label: "Проверки", unit: "count" },
  { id: "avg", label: "Оригинальность", unit: "percent" },
]

const units: HeatmapRow[] = [
  {
    unit_id: "f1",
    unit_label: "Инженерный факультет",
    metrics: { checks: 940, avg: 78.5 },
  },
  {
    unit_id: "f2",
    unit_label: "Гуманитарный факультет",
    metrics: { checks: 410, avg: 71.2 },
  },
  {
    unit_id: "f3",
    unit_label: "Малое подразделение",
    metrics: { checks: "insufficient_data", avg: "insufficient_data" },
  },
]

describe("KpiCard", () => {
  it("renders the value, the delta and a sparkline", () => {
    const html = render(
      <KpiCard
        label="Проверки"
        value={1860}
        previous={1600}
        unit="count"
        spark={[
          { label: "сен", value: 120 },
          { label: "окт", value: 260 },
          { label: "ноя", value: 310 },
        ]}
      />
    )
    expect(html).toContain("Проверки")
    expect(html).toContain("▲")
    expect(html).toContain("рост на 260")
    expect(html).toContain("к предыдущему периоду")
    expect(html).toContain("<svg")
    // the sparkline's exact values are reachable without hovering
    expect(html).toContain("<table>")
  })

  it("renders the suppression marker instead of a value and no delta", () => {
    const html = render(
      <KpiCard label="Проверки" value="insufficient_data" previous={1600} />
    )
    expect(html).toContain(MARKER)
    expect(html).not.toContain("рост на")
    expect(html).not.toContain("снижение на")
  })

  it("counts a suppressed sparkline point in the note", () => {
    const html = render(
      <KpiCard
        label="Проверки"
        value={10}
        spark={[
          { label: "сен", value: 1 },
          { label: "окт", value: "insufficient_data" },
          { label: "ноя", value: 3 },
        ]}
      />
    )
    expect(html).toContain("Скрыто значений: 1 из 3")
  })
})

describe("TimeSeries", () => {
  it("renders two synchronised panels by default", () => {
    const html = render(
      <TimeSeries points={months} title="Динамика" description="за 4 месяца" />
    )
    expect(html.match(/<svg/g)).toHaveLength(2)
    expect(html).toContain("Проверки")
    expect(html).toContain("Средняя оригинальность")
    // suppressed checks for 2024-12 are not plotted, and are declared instead
    expect(html).toContain("Скрыто значений: 1 из 8")
    expect(html).toContain(MARKER)
  })

  it("breaks the line at a withheld month instead of bridging it", () => {
    const withGap: TimeSeriesPoint[] = [
      ...months,
      { month: "2025-01", checks: 180, avg_originality: 70 },
    ]
    const html = render(<TimeSeries points={withGap} title="Динамика" />)
    // one path segment before the withheld month and one after it - a single
    // segment would mean the line was interpolated across suppressed data
    expect(html).toContain("segment:0")
    expect(html).toContain("segment:1")
    // the withheld month still keeps its slot on the axis
    expect(html).toContain("2024-12")
  })

  it("renders a single plot with a right-hand axis on request", () => {
    const html = render(
      <TimeSeries points={months} layout="dual-axis" title="Динамика" />
    )
    expect(html.match(/<svg/g)).toHaveLength(1)
    expect(html).toContain("originality-label")
  })

  it("draws the semester overlay from a token", () => {
    const html = render(
      <TimeSeries
        points={months}
        bands={[
          {
            id: "s1",
            kind: "autumn",
            label: "Осенний семестр",
            from: "2024-09",
            to: "2024-12",
          },
        ]}
        title="Динамика"
      />
    )
    expect(html).toContain("var(--chart-band)")
    expect(html).toContain("Затенение - осенний семестр")
  })

  it("shades one semester of the pair, not both", () => {
    // Two adjacent bands in the same fill tile the plot end to end and the
    // boundary between them disappears - the opposite of orientation.
    const html = render(
      <TimeSeries
        points={months}
        bands={[
          {
            id: "a",
            kind: "autumn",
            label: "Осенний семестр 2024/25",
            from: "2024-09",
            to: "2024-11",
          },
          {
            id: "s",
            kind: "spring",
            label: "Весенний семестр 2024/25",
            from: "2024-12",
            to: "2024-12",
          },
        ]}
        title="Динамика"
      />
    )
    // one shaded rect per panel, from the autumn band only - the legend swatch
    // and the focus ring reuse the token, so the rects themselves are counted
    expect(
      html.match(/<rect[^>]*var\(--chart-band\)[^>]*>/g) ?? []
    ).toHaveLength(2)
    expect(html).not.toContain("Весенний семестр 2024/25")
  })

  it("carries the year on the month axis of a multi-year series", () => {
    const years: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, index) => {
      const month = ((index + 8) % 12) + 1
      const year = 2023 + Math.floor((index + 8) / 12)
      return {
        month: `${String(year)}-${String(month).padStart(2, "0")}`,
        checks: 100 + index,
        avg_originality: 70,
      }
    })
    const html = render(<TimeSeries points={years} title="Динамика" />)
    // a bare «сент.» names three different months across this range
    expect(html).toContain("сент. 2023")
    expect(html).toContain("сент. 2024")
  })

  it("adds a third panel only when the response carries the flag measures", () => {
    // The internal contour's timeseries has no `escalated`/`rechecks`, and an
    // absent measure is not a suppressed one.
    expect(
      render(<TimeSeries points={months} title="Д" />).match(/<svg/g)
    ).toHaveLength(2)

    const withFlags: TimeSeriesPoint[] = months.map((point, index) => ({
      ...point,
      escalated: index * 4,
      rechecks: index * 2,
    }))
    const html = render(<TimeSeries points={withFlags} title="Д" />)
    expect(html.match(/<svg/g)).toHaveLength(3)
    expect(html).toContain("Эскалации")
    expect(html).toContain("Повторные проверки")
    // four measures a month now, and 2024-12's suppressed count is still the
    // only withheld cell
    expect(html).toContain("Скрыто значений: 1 из 16")
  })

  it("declares an empty result set explicitly", () => {
    const html = render(<TimeSeries points={[]} title="Динамика" />)
    expect(html).toContain("Нет данных по выбранным фильтрам")
    expect(html).not.toContain("<svg")
  })
})

describe("GroupedBars", () => {
  it("plots one bar per category and lists suppressed ones", () => {
    const html = render(
      <GroupedBars
        series={[{ id: "count", label: "Проверки", slot: 1 }]}
        groups={workTypes}
        title="По типам работ"
        unit="count"
        categoryAxisLabel="Тип работы"
      />
    )
    expect(html).toContain("var(--chart-1)")
    expect(html).toContain("ВКР")
    expect(html).toContain("Скрыто значений: 1 из 3")
    expect(html).toContain(MARKER)
  })

  it("prints the marker on the baseline of a fully withheld category", () => {
    const html = render(
      <GroupedBars
        series={[{ id: "count", label: "Проверки", slot: 1 }]}
        groups={workTypes}
        title="По типам работ"
      />
    )
    // an empty band would read as a zero, so the plot says why it is empty
    expect(html).toContain('fill="var(--suppressed-fg)"')
    expect(html).toContain("Статья")
  })

  it("keeps a series on its own slot when another one is filtered out", () => {
    const html = render(
      <GroupedBars
        series={[
          { id: "count", label: "Проверки", slot: 1 },
          { id: "avg", label: "Оригинальность", slot: 2 },
        ]}
        groups={[
          { id: "thesis", label: "ВКР", values: { count: 10, avg: 80 } },
        ]}
        title="По типам работ"
      />
    )
    expect(html).toContain("var(--chart-1)")
    expect(html).toContain("var(--chart-2)")
  })
})

describe("OriginalityHistogram", () => {
  it("renders five buckets as shares of the total", () => {
    const html = render(
      <OriginalityHistogram
        buckets={buckets}
        total={800}
        title="Распределение"
      />
    )
    expect(html).toContain("ниже 50%")
    expect(html).toContain("95% и выше")
    // ordinal buckets take the single-hue ramp, not the categorical slots
    expect(html).toContain("var(--chart-seq-1)")
    expect(html).toContain("var(--chart-seq-4)")
    expect(html).not.toContain("var(--chart-3)")
    expect(html).toContain("Скрыто значений: 1 из 5")
    expect(html).toContain(MARKER)
  })
})

describe("UnitHeatmap", () => {
  it("names the chart with a title and a desc", () => {
    const html = render(
      <UnitHeatmap rows={units} metrics={metrics} title="По факультетам" />
    )
    expect(html).toContain("<title")
    expect(html).toContain("<desc")
    expect(html).toContain("Инженерный факультет")
    expect(html).toContain("var(--chart-seq-")
  })

  it("renders a suppressed cell as the hatch plus the explicit text", () => {
    const html = render(
      <UnitHeatmap rows={units} metrics={metrics} title="По факультетам" />
    )
    expect(html).toContain("suppressed-hatch")
    expect(html).toContain("var(--suppressed-hatch)")
    expect(html).toContain(`fill="url(#`)
    expect(html).toContain(MARKER)
    expect(html).toContain("Скрыто значений: 2 из 6")
  })

  it("normalises each metric column independently", () => {
    const html = render(
      <UnitHeatmap
        rows={[
          { unit_id: "a", unit_label: "A", metrics: { checks: 1, avg: 99 } },
          { unit_id: "b", unit_label: "B", metrics: { checks: 100, avg: 10 } },
        ]}
        metrics={metrics}
        title="По факультетам"
      />
    )
    // the low end of one column and the high end of the other both appear
    expect(html).toContain("var(--chart-seq-1)")
    expect(html).toContain("var(--chart-seq-5)")
  })
})

describe("YoYCompare", () => {
  it("groups bars by academic year", () => {
    const html = render(
      <YoYCompare
        years={[
          {
            id: "2023",
            label: "2023/24",
            values: { count: 4100, rechecks: 220 },
          },
          {
            id: "2024",
            label: "2024/25",
            values: { count: 5200, rechecks: "insufficient_data" },
          },
        ]}
        series={[
          { id: "count", label: "Проверки", slot: 1 },
          { id: "rechecks", label: "Повторные", slot: 2 },
        ]}
        title="Год к году"
      />
    )
    expect(html).toContain("Учебный год")
    expect(html).toContain("2024/25")
    expect(html).toContain("Скрыто значений: 1 из 4")
    expect(html).toContain(MARKER)
  })
})

describe("localization", () => {
  it("takes every string from the message catalogue", () => {
    const kk = render(
      <OriginalityHistogram
        buckets={buckets}
        total={800}
        title="Үлестірім"
        locale="kk"
      />
    )
    expect(kk).toContain("Бірегейлік ауқымы")
    expect(kk).toContain("50%-дан төмен")
    expect(kk).toContain("деректер жеткіліксіз")

    const en = render(
      <OriginalityHistogram
        buckets={buckets}
        total={800}
        title="Distribution"
        locale="en"
      />
    )
    expect(en).toContain("Originality range")
    expect(en).toContain("below 50%")
    expect(en).toContain("insufficient data")
  })
})

describe("accessibility scaffolding", () => {
  it("gives every chart a name, a description and a hidden data table", () => {
    const html = render(
      <TimeSeries points={months} title="Динамика" description="за 4 месяца" />
    )
    expect(html).toContain('aria-label="Динамика - Проверки"')
    expect(html).toContain("<desc>за 4 месяца</desc>")
    expect(html).toContain('class="sr-only"')
    expect(html).toContain("Таблица данных - Динамика")
  })
})
