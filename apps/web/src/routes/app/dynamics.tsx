import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import { InternalDynamicsSection } from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/** Section 2 at internal grain (TZ.md §4.2 §2): checks and mean originality. */
export const Route = createFileRoute("/app/dynamics")({
  head: () => ({ meta: [{ title: pageTitle(m.section_dynamics()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
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
  const series = useQuery(internalQueries.timeseries(query))

  return (
    <InternalPage
      title={m.section_dynamics({}, { locale })}
      description={m.section_dynamics_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={series.data?.period}
      kThreshold={series.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="dynamics"
        title={m.chart_dynamics_title({}, { locale })}
        resetKey={JSON.stringify(query)}
        fallback={<SectionSkeleton height={300} locale={locale} />}
        describeError={(error) => describeInternalError(error, locale)}
        locale={locale}
      >
        <InternalDynamicsSection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
