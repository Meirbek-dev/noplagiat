import { useEffect, useRef } from "react"

import { createFileRoute } from "@tanstack/react-router"

import {
  SectionBoundary,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import {
  DynamicsSection,
  FacultiesSection,
  HistogramSection,
  OverviewSection,
  WorkTypesSection,
  YoySection,
} from "@/components/dashboard/sections"
import { normalizePublicQuery } from "@/lib/filters"
import { pageTitle } from "@/lib/head"
import { publicQueries } from "@/lib/queries"
import { embedSearchSchema } from "@/lib/search"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Chromeless public widget for the portal «Академическая честность» page
 * (TZ.md §8). No header, no navigation, no filter chrome: the host chooses the
 * section and the filters through the query string, and the widget reports its
 * rendered height so the iframe can be sized without a scrollbar.
 *
 * The host snippet lives in `deploy/embed-snippet.html`.
 */
export const Route = createFileRoute("/embed")({
  head: () => ({ meta: [{ title: pageTitle(m.embed_title()) }] }),
  validateSearch: embedSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  // One section, one request - a widget never fetches what it does not draw.
  loader: async ({ context, deps }) => {
    const query = normalizePublicQuery(deps.search)
    const cache = context.queryClient
    switch (deps.search.section) {
      case "summary":
        await cache.ensureQueryData(publicQueries.summary(query))
        return
      case "dynamics":
        await cache.ensureQueryData(publicQueries.timeseries(query))
        return
      case "work-types":
        await cache.ensureQueryData(publicQueries.workTypes(query))
        return
      case "histogram":
        await cache.ensureQueryData(publicQueries.histogram(query))
        return
      case "yoy":
        await cache.ensureQueryData(publicQueries.yoy(query))
        return
      case "faculties":
        await cache.ensureQueryData(publicQueries.faculties(query))
        return
    }
  },
  component: EmbedWidget,
})

function EmbedWidget() {
  const search = Route.useSearch()
  const locale = getLocale()
  const query = normalizePublicQuery(search)
  const root = useRef<HTMLDivElement>(null)

  useEmbedHeight(root)

  return (
    <div ref={root} className="@container bg-background p-3">
      <SectionBoundary
        resetKey={`${search.section}:${JSON.stringify(query)}`}
        fallback={<SectionSkeleton height={240} locale={locale} />}
        locale={locale}
      >
        {search.section === "summary" ? (
          <OverviewSection query={query} locale={locale} />
        ) : search.section === "dynamics" ? (
          <DynamicsSection query={query} locale={locale} />
        ) : search.section === "work-types" ? (
          <WorkTypesSection query={query} locale={locale} />
        ) : search.section === "histogram" ? (
          <HistogramSection query={query} locale={locale} />
        ) : search.section === "yoy" ? (
          <YoySection query={query} locale={locale} />
        ) : (
          <FacultiesSection query={query} locale={locale} />
        )}
      </SectionBoundary>
    </div>
  )
}

/** The message the host page listens for. Keep in sync with the snippet. */
const HEIGHT_MESSAGE = "np-embed-height"

/**
 * Reports the rendered height to the parent frame on every layout change -
 * charts resize, a section streams in, the viewer rotates a tablet. The
 * message is posted to `*`: it carries no data beyond a pixel count, and the
 * portal's frame origin is not known at build time.
 */
function useEmbedHeight(target: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = target.current
    if (!element || typeof ResizeObserver === "undefined") return

    let last = -1
    const post = () => {
      const height = Math.ceil(element.getBoundingClientRect().height)
      if (height === last) return
      last = height
      window.parent.postMessage({ type: HEIGHT_MESSAGE, height }, "*")
    }

    const observer = new ResizeObserver(post)
    observer.observe(element)
    post()
    return () => {
      observer.disconnect()
    }
  }, [target])
}
