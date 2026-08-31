import type { ReactNode } from "react"

import { useQuery } from "@tanstack/react-query"

import { ExportButtons } from "@/components/internal/ExportButtons"
import { InternalFilterBar } from "@/components/internal/InternalFilterBar"
import type { InternalQuery } from "@/lib/api-internal"
import { internalQueries } from "@/lib/queries"
import type { DashboardSearch } from "@/lib/search"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The chrome every `/app/*` page shares: heading, the extended filter bar, the
 * export buttons and the k-anonymity note.
 *
 * The dictionaries behind the filter selects are read non-suspending on
 * purpose - the controls must be usable while a section is still loading, and
 * they must survive a section failing.
 */

export interface InternalPageProps {
  title: string
  description?: string
  search: DashboardSearch
  /**
   * Applies a filter change. Supplied by the route rather than derived here:
   * `useNavigate` is typed against the route it is bound to, and a shared
   * component has no route to bind to.
   */
  onFilterChange: (patch: Partial<DashboardSearch>) => void
  /** The normalized filters - request, cache key and export body in one. */
  query: InternalQuery
  /** The range the server actually queried, echoed back by the section. */
  appliedPeriod?: { from: string; to: string }
  /** Active k threshold, echoed by every internal response. */
  kThreshold?: number
  locale: Locale
  children: ReactNode
}

export function InternalPage({
  title,
  description,
  search,
  onFilterChange,
  query,
  appliedPeriod,
  kThreshold,
  locale,
  children,
}: InternalPageProps) {
  const units = useQuery(internalQueries.unitOptions())
  const workTypes = useQuery(internalQueries.workTypeOptions())

  return (
    <>
      {/* `min-w-0 flex-1` on the heading and `shrink-0` on the actions: with a
          plain `flex-wrap … justify-between`, a page whose description was a
          sentence longer pushed the export buttons onto their own row, so the
          control moved between the top right and under the title depending on
          which section you were reading. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-xl font-semibold text-primary">{title}</h1>
          {description === undefined ? null : (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="shrink-0">
          <ExportButtons query={query} locale={locale} />
        </div>
      </div>

      <InternalFilterBar
        search={search}
        onChange={onFilterChange}
        faculties={units.data?.faculties ?? []}
        workTypes={workTypes.data?.items ?? []}
        appliedPeriod={appliedPeriod}
        locale={locale}
      />

      {kThreshold === undefined ? null : (
        <p className="text-xs text-muted-foreground">
          {m.k_threshold_note({ k: String(kThreshold) }, { locale })}
        </p>
      )}

      {children}
    </>
  )
}
