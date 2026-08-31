import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import { InternalUnitsSection } from "@/components/internal/sections"
import { describeInternalError } from "@/lib/errors"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Section 4 at internal grain (TZ.md §4.2 §4): faculty → department, heat map
 * over a TanStack Table, expanding a faculty into its departments.
 *
 * The ОП level the TZ also names is not reachable yet: `/api/internal/
 * departments-matrix` publishes two levels, and PLAN.md D2 - which programme a
 * check belongs to - is what a third would need. The footnote says so on the
 * page rather than leaving a reader to wonder.
 */
export const Route = createFileRoute("/app/units")({
  head: () => ({ meta: [{ title: pageTitle(m.section_units()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(
        internalQueries.departmentsMatrix(query)
      ),
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
  const matrix = useQuery(internalQueries.departmentsMatrix(query))

  return (
    <InternalPage
      title={m.section_units({}, { locale })}
      description={m.section_units_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={matrix.data?.period}
      kThreshold={matrix.data?.k_threshold}
      locale={locale}
    >
      <SectionFrame
        id="units"
        title={m.section_units({}, { locale })}
        resetKey={JSON.stringify(query)}
        fallback={<SectionSkeleton height={360} locale={locale} />}
        describeError={(error) => describeInternalError(error, locale)}
        locale={locale}
        footnote={
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <p>{m.units_program_footnote({}, { locale })}</p>
            <p>{m.units_margin_footnote({}, { locale })}</p>
            <p>{m.units_coverage_footnote({}, { locale })}</p>
          </div>
        }
      >
        <InternalUnitsSection query={query} locale={locale} />
      </SectionFrame>
    </InternalPage>
  )
}
