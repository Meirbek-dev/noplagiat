import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import { InternalYoySection } from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Section 9 at internal grain (TZ.md §4.2 §9): the caller's scope compared
 * across academic years (1 September – 31 August).
 */
export const Route = createFileRoute("/app/yoy")({
  head: () => ({ meta: [{ title: pageTitle(m.section_yoy()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(internalQueries.yoy(query)),
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
  const yoy = useQuery(internalQueries.yoy(query))

  return (
    <InternalPage
      title={m.section_yoy({}, { locale })}
      description={m.section_yoy_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={yoy.data?.period}
      kThreshold={yoy.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="yoy"
        title={m.section_yoy({}, { locale })}
        resetKey={JSON.stringify(query)}
        fallback={<SectionSkeleton height={280} locale={locale} />}
        describeError={(error) => describeInternalError(error, locale)}
        locale={locale}
      >
        <InternalYoySection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
