import type { ReactNode } from "react"
import { Suspense } from "react"

import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { CatchBoundary } from "@tanstack/react-router"

import { Button } from "@/components/button"
import { Skeleton } from "@/components/skeleton"
import { ApiError } from "@/lib/api"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The frame every dashboard section renders inside: a titled card, its own
 * suspense boundary (so a slow section shows a skeleton instead of blocking
 * the page) and its own error boundary with a retry (so one failing endpoint
 * does not take the dashboard down). ARCHITECTURE §7.4 - one request per
 * section, sections load independently.
 */

export interface SectionFrameProps {
  /** Anchor id; also derives the heading id for `aria-labelledby`. */
  id: string
  title: string
  description?: string
  /** Rendered under the content - e.g. the unit-coverage footnote. */
  footnote?: ReactNode
  /** Changing this resets the error boundary (the filter state does). */
  resetKey: unknown
  /** Skeleton shown while the section's query is in flight. */
  fallback: ReactNode
  /**
   * Turns a caught error into the sentence to show. Used by the internal
   * contour to explain a `403` («вне вашей области видимости») instead of
   * echoing the server's English `detail`. Returning `undefined` falls back to
   * the error's own message.
   */
  describeError?: (error: unknown) => string | undefined
  locale: Locale
  children: ReactNode
}

export function SectionFrame({
  id,
  title,
  description,
  footnote,
  resetKey,
  fallback,
  describeError,
  locale,
  children,
}: SectionFrameProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="@container flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground"
    >
      <header className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="text-lg font-semibold text-primary">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>

      <SectionBoundary
        resetKey={resetKey}
        fallback={fallback}
        describeError={describeError}
        locale={locale}
      >
        {children}
      </SectionBoundary>

      {footnote}
    </section>
  )
}

export function SectionBoundary({
  resetKey,
  fallback,
  describeError,
  locale,
  children,
}: {
  resetKey: unknown
  fallback: ReactNode
  describeError?: (error: unknown) => string | undefined
  locale: Locale
  children: ReactNode
}) {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <CatchBoundary
      getResetKey={() => resetKey}
      errorComponent={({ error, reset: resetBoundary }) => (
        <SectionError
          error={error}
          describeError={describeError}
          locale={locale}
          onRetry={() => {
            // Clears the cached rejection first, otherwise the remounted
            // subtree suspends straight back onto the same error.
            reset()
            resetBoundary()
          }}
        />
      )}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </CatchBoundary>
  )
}

/**
 * What the reader is told when a section fails.
 *
 * A `Problem` body is the server explaining itself in a sentence meant for a
 * person, and it is shown verbatim. Anything else - a dropped connection, a
 * `502` from the proxy, a thrown `TypeError` - carries only a developer string
 * (`ApiError` falls back to `"summary: HTTP 502"`), and a public visitor is
 * given the localized sentence instead of an endpoint name and a status code.
 */
function errorSentence(error: unknown, locale: Locale): string {
  if (error instanceof ApiError) {
    const stated = error.problem?.detail ?? error.problem?.title
    return stated ?? m.section_error_unavailable({}, { locale })
  }
  return m.section_error_unavailable({}, { locale })
}

function SectionError({
  error,
  describeError,
  locale,
  onRetry,
}: {
  error: unknown
  describeError?: (error: unknown) => string | undefined
  locale: Locale
  onRetry: () => void
}) {
  const detail = describeError?.(error) ?? errorSentence(error, locale)
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-2 rounded border border-dashed px-3 py-6"
    >
      <p className="text-sm font-medium">
        {m.section_error_title({}, { locale })}
      </p>
      {detail ? (
        <p className="text-xs text-muted-foreground">{detail}</p>
      ) : null}
      <Button variant="outline" size="sm" onClick={onRetry}>
        {m.section_retry({}, { locale })}
      </Button>
    </div>
  )
}

/** A block skeleton sized like the chart it replaces. */
export function SectionSkeleton({
  height = 240,
  locale,
}: {
  height?: number
  locale: Locale
}) {
  return (
    <Skeleton
      role="status"
      aria-label={m.section_loading({}, { locale })}
      style={{ height }}
      className="w-full"
    />
  )
}

/** The KPI row's skeleton: four cards, not one big block. */
export function KpiSkeleton({ locale }: { locale: Locale }) {
  return (
    <div
      role="status"
      aria-label={m.section_loading({}, { locale })}
      className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4"
    >
      {[0, 1, 2, 3].map((index) => (
        <Skeleton key={index} className="h-28 w-full" />
      ))}
    </div>
  )
}
