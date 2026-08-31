import { m } from "../../paraglide/messages.js"
import type { Locale } from "../../paraglide/runtime.js"
import { getLocale } from "../../paraglide/runtime.js"
import { cn } from "../../lib/utils"

import type { ScreenedNumber } from "./types"

/**
 * The ONLY way a k-anonymity-suppressed value renders anywhere in the app
 * (ARCHITECTURE.md §5.2). Numeric values pass through `format`; the
 * suppression marker renders as a localized muted badge with the hatched
 * treatment, so it is never mistaken for a zero or a missing bar.
 */
export function ScreenedValue({
  value,
  locale,
  format,
  className,
}: {
  value: ScreenedNumber
  locale?: Locale
  format?: (n: number) => string
  className?: string
}) {
  const active = locale ?? getLocale()
  if (value === "insufficient_data") {
    const label = m.insufficient_data({}, { locale: active })
    return (
      <span
        className={cn(
          "np-suppressed rounded px-1.5 py-0.5 text-xs italic",
          className
        )}
        title={label}
      >
        {label}
      </span>
    )
  }
  return (
    <span className={className}>
      {(format ?? ((n: number) => n.toLocaleString(active)))(value)}
    </span>
  )
}

/** Suffix appended to `idPrefix` to name the hatch pattern of one chart. */
const SUPPRESSED_PATTERN_SUFFIX = "suppressed-hatch"

/** The `fill` value for a suppressed SVG cell of the chart owning `idPrefix`. */
export function suppressedFill(idPrefix: string): string {
  return `url(#${idPrefix}-${SUPPRESSED_PATTERN_SUFFIX})`
}

/**
 * The `<defs>` block backing {@link suppressedFill}. One per SVG; `idPrefix`
 * must be unique in the document (use React's `useId`). Both paints come from
 * `tokens.css`, so the hatch follows light/dark like every other token.
 */
export function SuppressedPatternDefs({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      <pattern
        id={`${idPrefix}-${SUPPRESSED_PATTERN_SUFFIX}`}
        width={6}
        height={6}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width={6} height={6} fill="var(--suppressed-bg)" />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={6}
          stroke="var(--suppressed-hatch)"
          strokeWidth={2}
        />
      </pattern>
    </defs>
  )
}
