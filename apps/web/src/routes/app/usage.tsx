import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import { InternalUsageSection } from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Section 8 (TZ.md §4.2 §8): active reviewers per month, and the average check
 * duration - which the vendor export does not carry, so it reads «нет данных»
 * until Комплаенс enters it (ADR-008 §9). It never reads as zero.
 */
export const Route = createFileRoute("/app/usage")({
  head: () => ({ meta: [{ title: pageTitle(m.section_usage()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(internalQueries.usage(query)),
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
  const usage = useQuery(internalQueries.usage(query))

  return (
    <InternalPage
      title={m.section_usage({}, { locale })}
      description={m.section_usage_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={usage.data?.period}
      kThreshold={usage.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="usage"
        title={m.section_usage({}, { locale })}
        resetKey={JSON.stringify(query)}
        fallback={<SectionSkeleton height={300} locale={locale} />}
        describeError={(error) => describeInternalError(error, locale)}
        locale={locale}
      >
        <InternalUsageSection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
