import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import {
  InternalHistogramSection,
  InternalWorkTypesSection,
} from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Section 3 at internal grain (TZ.md §4.2 §3), with section 5's originality
 * histogram beside it: both answer «what kind of work, and how original», and
 * the two together are what a head of department actually compares.
 */
export const Route = createFileRoute("/app/types")({
  head: () => ({ meta: [{ title: pageTitle(m.section_work_types()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(internalQueries.workTypes(query)),
      context.queryClient.ensureQueryData(internalQueries.histogram(query)),
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
  const breakdown = useQuery(internalQueries.workTypes(query))
  const resetKey = JSON.stringify(query)
  const describeError = (error: unknown) => describeInternalError(error, locale)

  return (
    <InternalPage
      title={m.section_work_types({}, { locale })}
      description={m.section_work_types_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={breakdown.data?.period}
      kThreshold={breakdown.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="work-types"
        title={m.section_work_types({}, { locale })}
        resetKey={resetKey}
        fallback={<SectionSkeleton height={280} locale={locale} />}
        describeError={describeError}
        locale={locale}
      >
        <InternalWorkTypesSection query={query} locale={locale} />
      </SectionFrame>

      <SectionFrame
        id="histogram"
        title={m.section_histogram({}, { locale })}
        description={m.section_histogram_hint({}, { locale })}
        resetKey={resetKey}
        fallback={<SectionSkeleton height={260} locale={locale} />}
        describeError={describeError}
        locale={locale}
      >
        <InternalHistogramSection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
