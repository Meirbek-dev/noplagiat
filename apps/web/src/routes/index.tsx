import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { BrandHeader } from "@/components/dashboard/BrandHeader"
import { FilterBar } from "@/components/dashboard/FilterBar"
import { PublicExportButtons } from "@/components/dashboard/PublicExportButtons"
import { SiteFooter } from "@/components/dashboard/SiteFooter"
import {
  KpiSkeleton,
  SectionFrame,
  SectionSkeleton,
} from "@/components/dashboard/SectionFrame"
import {
  DynamicsSection,
  FacultiesSection,
  HistogramSection,
  OverviewSection,
  ReportsSection,
  WorkTypesSection,
  YoySection,
} from "@/components/dashboard/sections"
import { normalizePublicQuery } from "@/lib/filters"
import { publicQueries } from "@/lib/queries"
import type { PublicSearch } from "@/lib/search"
import { publicSearchSchema } from "@/lib/search"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Public contour (TZ.md §4.1): anonymized university-level aggregates only.
 * Sections 1, 2, 3, 5 and 9 of TZ §4.2 plus the faculty aggregate and the
 * published reports; k-anonymity is applied server-side and arrives as
 * «недостаточно данных» cells (ADR-002).
 */
export const Route = createFileRoute("/")({
  validateSearch: publicSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const query = normalizePublicQuery(deps.search)
    // Every section's request leaves at once - one per section, no waterfall
    // (ARCHITECTURE §7.4) - and SSR therefore renders real numbers rather than
    // a skeleton. `allSettled`, not `all`: a failing endpoint must surface in
    // that section's error boundary, not take the whole route down.
    await Promise.allSettled([
      context.queryClient.ensureQueryData(publicQueries.summary(query)),
      context.queryClient.ensureQueryData(publicQueries.timeseries(query)),
      context.queryClient.ensureQueryData(publicQueries.workTypes(query)),
      context.queryClient.ensureQueryData(publicQueries.faculties(query)),
      context.queryClient.ensureQueryData(publicQueries.histogram(query)),
      context.queryClient.ensureQueryData(publicQueries.yoy(query)),
      context.queryClient.ensureQueryData(publicQueries.reports()),
      context.queryClient.ensureQueryData(publicQueries.facultyOptions()),
      context.queryClient.ensureQueryData(publicQueries.workTypeOptions()),
    ])
  },
  component: PublicDashboard,
})

function PublicDashboard() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const locale = getLocale()
  const query = normalizePublicQuery(search)

  // Non-suspending reads: the filter chrome must render even while a section
  // is still loading, and the dictionaries are cached for an hour.
  const summary = useQuery(publicQueries.summary(query))
  const facultyOptions = useQuery(publicQueries.facultyOptions())
  const workTypeOptions = useQuery(publicQueries.workTypeOptions())

  const applyFilters = (patch: Partial<PublicSearch>) => {
    void navigate({ search: (previous) => ({ ...previous, ...patch }) })
  }

  // Every section resets its error boundary when the filters change.
  const resetKey = JSON.stringify(query)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <a
        href="#dashboard"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {m.header_skip_link({}, { locale })}
      </a>

      <BrandHeader locale={locale} />

      <main
        id="dashboard"
        className="@container mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6"
      >
        {/* Filters and the export of what they select belong together: the
            file *is* the view on screen, so the control that produces it sits
            in the same card as the controls that shaped it. */}
        <FilterBar
          search={search}
          onChange={applyFilters}
          faculties={facultyOptions.data?.items ?? []}
          workTypes={workTypeOptions.data?.items ?? []}
          appliedPeriod={summary.data?.period}
          kThreshold={summary.data?.k_threshold}
          locale={locale}
          actions={<PublicExportButtons query={query} locale={locale} />}
        />

        <SectionFrame
          id="overview"
          title={m.section_overview({}, { locale })}
          description={m.section_overview_hint({}, { locale })}
          resetKey={resetKey}
          fallback={<KpiSkeleton locale={locale} />}
          locale={locale}
        >
          <OverviewSection query={query} locale={locale} />
        </SectionFrame>

        <SectionFrame
          id="dynamics"
          title={m.section_dynamics({}, { locale })}
          description={m.section_dynamics_hint({}, { locale })}
          resetKey={resetKey}
          fallback={<SectionSkeleton height={280} locale={locale} />}
          locale={locale}
        >
          <DynamicsSection query={query} locale={locale} />
        </SectionFrame>

        <SectionFrame
          id="work-types"
          title={m.section_work_types({}, { locale })}
          description={m.section_work_types_hint({}, { locale })}
          resetKey={resetKey}
          fallback={<SectionSkeleton height={280} locale={locale} />}
          locale={locale}
        >
          <WorkTypesSection query={query} locale={locale} />
        </SectionFrame>

        <SectionFrame
          id="histogram"
          title={m.section_histogram({}, { locale })}
          description={m.section_histogram_hint({}, { locale })}
          resetKey={resetKey}
          fallback={<SectionSkeleton height={260} locale={locale} />}
          locale={locale}
        >
          <HistogramSection query={query} locale={locale} />
        </SectionFrame>

        <SectionFrame
          id="faculties"
          title={m.section_faculties({}, { locale })}
          description={m.section_faculties_hint({}, { locale })}
          resetKey={resetKey}
          fallback={<SectionSkeleton height={260} locale={locale} />}
          locale={locale}
          // PLAN.md §1.2: per-unit attribution does not exist before AY
          // 2025/26, and the page says so rather than hiding it. The note is
          // rendered by the section itself, not here: which of the two
          // sentences is true depends on the response, and this frame sits
          // outside the boundary that awaits it.
        >
          <FacultiesSection query={query} locale={locale} />
        </SectionFrame>

        <SectionFrame
          id="yoy"
          title={m.section_yoy({}, { locale })}
          description={m.section_yoy_hint({}, { locale })}
          resetKey={resetKey}
          fallback={<SectionSkeleton height={260} locale={locale} />}
          locale={locale}
        >
          <YoySection query={query} locale={locale} />
        </SectionFrame>

        <SectionFrame
          id="reports"
          title={m.section_reports({}, { locale })}
          description={m.section_reports_hint({}, { locale })}
          resetKey="reports"
          fallback={<SectionSkeleton height={120} locale={locale} />}
          locale={locale}
        >
          <ReportsSection locale={locale} />
        </SectionFrame>
      </main>

      <SiteFooter locale={locale} kThreshold={summary.data?.k_threshold} />
    </div>
  )
}
