import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import { InternalRechecksSection } from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Section 6 (TZ.md §4.2 §6): how many works came back for a second check, and
 * how many of those improved. Internal contour only.
 */
export const Route = createFileRoute("/app/rechecks")({
  head: () => ({ meta: [{ title: pageTitle(m.section_rechecks()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(internalQueries.rechecks(query)),
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
  const rechecks = useQuery(internalQueries.rechecks(query))

  return (
    <InternalPage
      title={m.section_rechecks({}, { locale })}
      description={m.section_rechecks_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={rechecks.data?.period}
      kThreshold={rechecks.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="rechecks"
        title={m.section_rechecks({}, { locale })}
        resetKey={JSON.stringify(query)}
        fallback={<SectionSkeleton height={280} locale={locale} />}
        describeError={(error) => describeInternalError(error, locale)}
        locale={locale}
      >
        <InternalRechecksSection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
