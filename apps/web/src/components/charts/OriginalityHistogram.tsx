import { useMemo } from "react"

import { barY, defineChart, text } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip } from "@tanstack/charts/tooltip"

import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"

import { ChartEmptyState, ChartFrame } from "./ChartFrame"
import { formatPercent, rampColor } from "./format"
import type {
  OriginalityBucket,
  OriginalityBucketId,
  ScreenedNumber,
} from "./types"
import { ORIGINALITY_BUCKETS, isSuppressed } from "./types"

export interface OriginalityHistogramProps {
  /** The five fixed buckets; missing buckets render as suppressed. */
  buckets: readonly OriginalityBucket[]
  /**
   * Denominator for the share. Defaults to the sum of the numeric buckets -
   * pass the server's total when some buckets were suppressed, otherwise the
   * shares silently renormalise over the visible ones.
   */
  total?: ScreenedNumber
  title: string
  description?: string
  locale?: Locale
  height?: number
  className?: string
}

interface BucketRow {
  bucket: OriginalityBucketId
  label: string
  step: 1 | 2 | 3 | 4 | 5
  color: string
  count: number
  share: number
}

/** A withheld bucket: the marker sits on the baseline of its own slot. */
interface MarkerRow {
  label: string
  zero: number
  marker: string
}

const BUCKET_LABEL: Record<OriginalityBucketId, (locale: Locale) => string> = {
  lt_50: (locale) => m.chart_bucket_lt_50({}, { locale }),
  b50_70: (locale) => m.chart_bucket_50_70({}, { locale }),
  b70_85: (locale) => m.chart_bucket_70_85({}, { locale }),
  b85_95: (locale) => m.chart_bucket_85_95({}, { locale }),
  gte_95: (locale) => m.chart_bucket_gte_95({}, { locale }),
}

const BUCKET_STEP: Record<OriginalityBucketId, 1 | 2 | 3 | 4 | 5> = {
  lt_50: 1,
  b50_70: 2,
  b70_85: 3,
  b85_95: 4,
  gte_95: 5,
}

/**
 * Section 5: share of checks per originality bucket.
 *
 * The buckets are *ordinal* - reordering them would change the meaning - so
 * they take the single-hue navy ramp (`--chart-seq-1..5`) rather than six
 * categorical identities. Each bar is directly labelled with its share, which
 * is also the relief channel for the two ramp steps that sit below 3:1.
 */
export function OriginalityHistogram({
  buckets,
  total,
  title,
  description,
  locale,
  height = 240,
  className,
}: OriginalityHistogramProps) {
  const active = locale ?? getLocale()

  const model = useMemo(() => {
    const byId = new Map(buckets.map((bucket) => [bucket.bucket, bucket.count]))
    const counts = ORIGINALITY_BUCKETS.map((id) => ({
      id,
      count: byId.get(id) ?? "insufficient_data",
    }))
    const visible = counts.filter(
      (entry): entry is { id: OriginalityBucketId; count: number } =>
        !isSuppressed(entry.count)
    )
    const denominator = isSuppressed(total)
      ? visible.reduce((sum, entry) => sum + entry.count, 0)
      : total
    const rows: BucketRow[] = visible.map((entry) => ({
      bucket: entry.id,
      label: BUCKET_LABEL[entry.id](active),
      step: BUCKET_STEP[entry.id],
      color: rampColor(BUCKET_STEP[entry.id]),
      count: entry.count,
      share: denominator > 0 ? (entry.count / denominator) * 100 : 0,
    }))
    const marker = m.insufficient_data({}, { locale: active })
    const withheld: MarkerRow[] = counts
      .filter((entry) => isSuppressed(entry.count))
      .map((entry) => ({
        label: BUCKET_LABEL[entry.id](active),
        zero: 0,
        marker,
      }))
    return {
      rows,
      counts,
      withheld,
      suppressed: counts.length - visible.length,
      labels: ORIGINALITY_BUCKETS.map((id) => BUCKET_LABEL[id](active)),
      shareById: new Map(rows.map((row) => [row.bucket, row.share])),
    }
  }, [buckets, total, active])

  const definition = useMemo(() => {
    return defineChart({
      marks: [
        barY(model.rows, {
          x: "label",
          y: "share",
          key: "bucket",
          fill: (row: BucketRow) => row.color,
          radius: 4,
          maxThickness: 72,
        }),
        text(model.rows, {
          x: "label",
          y: "share",
          text: (row: BucketRow) => formatPercent(row.share, active),
          fill: "var(--chart-ink)",
          fontSize: 11,
          dy: -9,
        }),
        // A withheld bucket keeps its slot on the axis and says why it is empty.
        text(model.withheld, {
          x: "label",
          y: "zero",
          text: "marker",
          fill: "var(--suppressed-fg)",
          fontSize: 9,
          dy: -10,
        }),
      ],
      scales: {
        x: {
          scale: scaleBand<string>().domain(model.labels).padding(0.22),
          axis: {
            label: m.chart_histogram_bucket({}, { locale: active }),
          },
        },
        y: {
          scale: scaleLinear().domain([0, 100]),
          grid: true,
          axis: { label: m.chart_axis_share({}, { locale: active }) },
        },
      },
      tooltip: {
        use: tooltip,
        format: (point) => {
          const datum = point.datum
          return "share" in datum
            ? `${datum.label}: ${formatPercent(datum.share, active)} (${datum.count.toLocaleString(active)})`
            : `${datum.label}: ${datum.marker}`
        },
      },
    })
  }, [model.rows, model.withheld, model.labels, active])

  return (
    <ChartFrame
      title={title}
      description={description}
      rowHeader={m.chart_histogram_bucket({}, { locale: active })}
      columns={[
        m.chart_axis_count({}, { locale: active }),
        m.chart_axis_share({}, { locale: active }),
      ]}
      rows={model.counts.map((entry) => ({
        header: BUCKET_LABEL[entry.id](active),
        cells: [
          entry.count,
          model.shareById.get(entry.id) ?? "insufficient_data",
        ],
      }))}
      suppressed={{
        count: model.suppressed,
        total: ORIGINALITY_BUCKETS.length,
      }}
      locale={active}
      formatCell={(value, index) =>
        index === 1
          ? formatPercent(value, active)
          : value.toLocaleString(active)
      }
      className={className}
    >
      {model.rows.length === 0 ? (
        <ChartEmptyState locale={active} />
      ) : (
        <Chart
          definition={definition}
          height={height}
          ariaLabel={title}
          ariaDescription={
            description ?? m.chart_axis_share({}, { locale: active })
          }
        />
      )}
    </ChartFrame>
  )
}
