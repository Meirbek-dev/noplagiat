import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import {
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import { InternalPage } from "@/components/internal/InternalPage"
import { InternalEscalationsSection } from "@/components/internal/sections"
import { useSession } from "@/hooks/use-session"
import { describeInternalError } from "@/lib/errors"
import { canSeeEscalations } from "@/lib/roles"
import { mergeFilters, normalizeInternalQuery } from "@/lib/filters"
import { internalQueries } from "@/lib/queries"
import { dashboardSearchSchema } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Section 7 (TZ.md §4.2 §7): aggregated escalation counters and the Ethics
 * Council register - counts of cases, never a case and never a person.
 *
 * The per-unit breakdown arrives k-screened whatever the caller's role, which
 * is the TZ's «без указания конкретных кафедр при малой выборке» made
 * unconditional on the server; the page only renders what it is given.
 */
export const Route = createFileRoute("/app/escalations")({
  head: () => ({ meta: [{ title: pageTitle(m.section_escalations()) }] }),
  validateSearch: dashboardSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizeInternalQuery(deps.search)
    await Promise.allSettled([
      context.queryClient.ensureQueryData(internalQueries.escalations(query)),
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
  const session = useSession()
  const escalations = useQuery(internalQueries.escalations(query))

  /**
   * The sidebar does not offer this section to a dean or a head of department
   * (TZ §5 reserves it), but a bookmark or a pasted link still lands here. The
   * server answers `403`, and the section boundary would render it as «вне
   * вашей области видимости - измените фильтр», which sends the reader off to
   * adjust a filter that was never the problem. Saying whose section it is
   * instead is both true and actionable.
   */
  const restricted = session !== null && !canSeeEscalations(session.role)

  return (
    <InternalPage
      title={m.section_escalations({}, { locale })}
      description={m.section_escalations_hint({}, { locale })}
      search={search}
      onFilterChange={(patch) => {
        void navigate({
          search: (previous) => mergeFilters(previous, patch),
        })
      }}
      query={query}
      appliedPeriod={escalations.data?.period}
      kThreshold={escalations.data?.k_threshold}
      locale={locale}
    >
      {restricted ? (
        <p
          role="status"
          className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground"
        >
          {m.section_role_restricted({}, { locale })}
        </p>
      ) : (
        <SectionFrame
          id="escalations"
          title={m.section_escalations({}, { locale })}
          resetKey={JSON.stringify(query)}
          fallback={<SectionSkeleton height={300} locale={locale} />}
          describeError={(error) => describeInternalError(error, locale)}
          locale={locale}
        >
          <InternalEscalationsSection query={query} locale={locale} />
        </SectionFrame>
      )}
    </InternalPage>
  )
}
