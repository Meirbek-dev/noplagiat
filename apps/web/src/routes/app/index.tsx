import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  KpiSkeleton,
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import {
  InternalDynamicsSection,
  InternalOverviewSection,
} from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Internal overview (TZ.md §4.2 §1 at the caller's scope, plus the dynamics
 * chart that gives the KPIs a shape).
 *
 * Same loading contract as the public dashboard: one request per section, all
 * of them dispatched together during SSR, `allSettled` so a failing section
 * lands in its own boundary instead of taking the route down.
 */
export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: pageTitle(m.section_overview()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(internalQueries.summary(query)),
      context.queryClient.ensureQueryData(internalQueries.timeseries(query)),
      context.queryClient.ensureQueryData(internalQueries.unitOptions()),
      context.queryClient.ensureQueryData(internalQueries.workTypeOptions()),
    ])
  },
  component: Page,
})

function Page() {
  const search = Route.useSearch()
  const locale = getLocale()
  const navigate = Route.useNavigate()
  const query = normalizeInternalQuery(search)
  const summary = useQuery(internalQueries.summary(query))
  const resetKey = JSON.stringify(query)
  const describeError = (error: unknown) => describeInternalError(error, locale)

  return (
    <InternalPage
      title={m.internal_contour_title({}, { locale })}
      description={m.internal_overview_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={summary.data?.period}
      kThreshold={summary.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="overview"
        title={m.section_overview({}, { locale })}
        description={m.section_overview_hint({}, { locale })}
        resetKey={resetKey}
        fallback={<KpiSkeleton locale={locale} />}
        describeError={describeError}
        locale={locale}
      >
        <InternalOverviewSection query={query} locale={locale} />
      </SectionFrame>

      <SectionFrame
        id="dynamics"
        title={m.section_dynamics({}, { locale })}
        description={m.section_dynamics_hint({}, { locale })}
        resetKey={resetKey}
        fallback={<SectionSkeleton height={280} locale={locale} />}
        describeError={describeError}
        locale={locale}
      >
        <InternalDynamicsSection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
