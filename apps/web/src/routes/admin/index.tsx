import { useQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"

import { AdminCard, BatchStatusBadge } from "@/components/admin/AdminCard"
import { Badge } from "@/components/badge"
import { formatCount, formatDateTime } from "@/lib/format"
import { adminQueries } from "@/lib/queries"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Administrative overview: the one screen that answers «is the warehouse being
 * fed, and is anything waiting for me».
 *
 * The newest ingest batch and its age are the freshness signal `/readyz`
 * enforces (TZ §3.3.3 - the internal contour refreshes at least daily), so a
 * stale batch is called out here rather than left to be noticed.
 */
export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_overview()) }] }),
  loader: async ({ context }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(adminQueries.batches(20, 0)),
      context.queryClient.ensureQueryData(adminQueries.sources()),
      context.queryClient.ensureQueryData(adminQueries.reports(20, 0)),
      context.queryClient.ensureQueryData(adminQueries.dictionary("faculties")),
      context.queryClient.ensureQueryData(
        adminQueries.dictionary("departments")
      ),
    ])
  },
  component: OverviewPage,
})

/** Beyond this the newest succeeded batch is old enough to say so. */
const STALE_AFTER_HOURS = 26

function OverviewPage() {
  const locale = getLocale()
  const batches = useQuery(adminQueries.batches(20, 0))
  const sources = useQuery(adminQueries.sources())
  const reports = useQuery(adminQueries.reports(20, 0))
  const faculties = useQuery(adminQueries.dictionary("faculties"))
  const departments = useQuery(adminQueries.dictionary("departments"))

  const newest = batches.data?.items[0]
  const ageHours =
    newest === undefined
      ? null
      : (Date.now() - new Date(newest.started_at).getTime()) / 3_600_000
  const stale = ageHours !== null && ageHours > STALE_AFTER_HOURS

  const unpublished = (reports.data?.items ?? []).filter(
    (report) => !report.published
  ).length

  return (
    <>
      <AdminCard
        title={m.admin_last_batch({}, { locale })}
        description={m.admin_last_batch_hint({}, { locale })}
      >
        {newest === undefined ? (
          <p className="text-sm text-muted-foreground">
            {m.batches_empty({}, { locale })}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <BatchStatusBadge status={newest.status} locale={locale} />
            <span>{formatDateTime(newest.started_at, locale)}</span>
            <span className="text-muted-foreground">
              {m.admin_batch_rows(
                {
                  read: formatCount(newest.rows_read, locale),
                  upserted: formatCount(newest.rows_upserted, locale),
                  rejected: formatCount(newest.rows_rejected, locale),
                },
                { locale }
              )}
            </span>
            {stale ? (
              <Badge variant="destructive">
                {m.admin_batch_stale(
                  { hours: String(Math.round(ageHours)) },
                  { locale }
                )}
              </Badge>
            ) : null}
          </div>
        )}
      </AdminCard>

      <AdminCard
        title={m.admin_counts({}, { locale })}
        description={m.admin_counts_hint({}, { locale })}
      >
        <dl className="grid grid-cols-2 gap-4 @2xl:grid-cols-4">
          <Stat
            label={m.admin_sources({}, { locale })}
            value={sources.data?.items.length ?? 0}
            locale={locale}
          />
          <Stat
            label={m.dict_tab_faculties({}, { locale })}
            value={faculties.data?.items.length ?? 0}
            locale={locale}
          />
          <Stat
            label={m.dict_tab_departments({}, { locale })}
            value={departments.data?.items.length ?? 0}
            locale={locale}
          />
          <Stat
            label={m.admin_reports_unpublished({}, { locale })}
            value={unpublished}
            locale={locale}
          />
        </dl>
      </AdminCard>

      <AdminCard title={m.admin_quick_links({}, { locale })}>
        <nav className="flex flex-wrap gap-3 text-sm">
          <Link className="underline" to="/admin/sources">
            {m.admin_sources({}, { locale })}
          </Link>
          <Link className="underline" to="/admin/dictionaries">
            {m.admin_dictionaries({}, { locale })}
          </Link>
          <Link className="underline" to="/admin/roles">
            {m.admin_roles({}, { locale })}
          </Link>
          <Link className="underline" to="/admin/settings">
            {m.admin_settings({}, { locale })}
          </Link>
          <Link className="underline" to="/admin/reports">
            {m.admin_reports({}, { locale })}
          </Link>
          <Link className="underline" to="/admin/audit">
            {m.admin_audit({}, { locale })}
          </Link>
        </nav>
      </AdminCard>
    </>
  )
}

function Stat({
  label,
  value,
  locale,
}: {
  label: string
  value: number
  locale: Locale
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">
        {formatCount(value, locale)}
      </dd>
    </div>
  )
}
