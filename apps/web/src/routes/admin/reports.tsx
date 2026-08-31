import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import * as v from "valibot"

import type { AdminReportDto } from "@/api/types.gen"
import {
  AdminCard,
  notifyError,
  notifySaved,
} from "@/components/admin/AdminCard"
import { AdminTable } from "@/components/admin/AdminTable"
import type { AdminColumn } from "@/components/admin/AdminTable"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { LabeledInput, LabeledSelect } from "@/components/forms/fields"
import { useCsrfToken } from "@/hooks/use-session"
import { reportDownloadUrl } from "@/lib/api"
import { adminApi } from "@/lib/api-admin"
import { formatDate, formatDateTime } from "@/lib/format"
import { academicYearRange, academicYearOf } from "@/lib/period"
import { adminQueries } from "@/lib/queries"
import { UI_LOCALES } from "@/lib/search"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Report snapshots (TZ.md §4.5).
 *
 * Snapshots are immutable: regenerating a period creates a *new* row rather
 * than overwriting one, which is why this list only ever grows and why the
 * publish flag - not the file - is what the public contour follows.
 */
export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_reports()) }] }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(adminQueries.reports())
  },
  component: ReportsPage,
})

function ReportsPage() {
  const locale = getLocale()
  return (
    <>
      <GenerateCard locale={locale} />
      <SnapshotsCard locale={locale} />
    </>
  )
}

function GenerateCard({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const defaults = academicYearRange(academicYearOf(new Date()))

  const form = useForm({
    defaultValues: {
      kind: "annual",
      period_start: defaults.from,
      period_end: defaults.to,
      locale: "ru",
    },
    validators: {
      onSubmit: v.object({
        kind: v.picklist(["annual", "manual"]),
        period_start: v.pipe(v.string(), v.isoDate()),
        period_end: v.pipe(v.string(), v.isoDate()),
        locale: v.picklist(UI_LOCALES),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await adminApi.generateReport(
          {
            kind: value.kind,
            period_start: value.period_start,
            period_end: value.period_end,
            locale: value.locale,
          },
          csrf ?? ""
        )
        notifySaved(locale, m.report_generated_ok({}, { locale }))
        await queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  return (
    <AdminCard
      title={m.report_generate({}, { locale })}
      description={m.report_generate_hint({}, { locale })}
    >
      <form
        className="grid grid-cols-1 items-end gap-3 @2xl:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="kind">
          {(field) => (
            <LabeledSelect
              id={field.name}
              label={m.report_kind({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              options={[
                {
                  value: "annual",
                  label: m.reports_kind_annual({}, { locale }),
                },
                {
                  value: "manual",
                  label: m.reports_kind_manual({}, { locale }),
                },
              ]}
            />
          )}
        </form.Field>
        <form.Field name="period_start">
          {(field) => (
            <LabeledInput
              id={field.name}
              label={m.filter_from({}, { locale })}
              type="date"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="period_end">
          {(field) => (
            <LabeledInput
              id={field.name}
              label={m.filter_to({}, { locale })}
              type="date"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="locale">
          {(field) => (
            <LabeledSelect
              id={field.name}
              label={m.report_locale({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              options={[
                { value: "ru", label: m.locale_name_ru({}, { locale }) },
                { value: "kk", label: m.locale_name_kk({}, { locale }) },
                { value: "en", label: m.locale_name_en({}, { locale }) },
              ]}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {isSubmitting
                ? m.form_saving({}, { locale })
                : m.report_generate({}, { locale })}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AdminCard>
  )
}

function SnapshotsCard({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const reports = useQuery(adminQueries.reports())

  const setPublished = useMutation({
    mutationFn: ({ id, publish }: { id: number; publish: boolean }) =>
      publish
        ? adminApi.publishReport(id, csrf ?? "")
        : adminApi.unpublishReport(id, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      // The public reports list is a different cache namespace and would
      // otherwise keep showing the previous publication state for an hour.
      void queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })
      void queryClient.invalidateQueries({ queryKey: ["public", "reports"] })
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const columns: readonly AdminColumn<AdminReportDto>[] = [
    {
      id: "period",
      header: m.report_period({}, { locale }),
      cell: (row) =>
        `${formatDate(row.period_start, locale)} - ${formatDate(row.period_end, locale)}`,
    },
    {
      id: "kind",
      header: m.report_kind({}, { locale }),
      cell: (row) =>
        row.kind === "annual"
          ? m.reports_kind_annual({}, { locale })
          : m.reports_kind_manual({}, { locale }),
    },
    {
      id: "generated",
      header: m.report_generated_at({}, { locale }),
      cell: (row) => formatDateTime(row.generated_at, locale),
    },
    {
      id: "published",
      header: m.report_published_state({}, { locale }),
      cell: (row) => (
        <Badge variant={row.published ? "default" : "secondary"}>
          {row.published
            ? m.report_published({}, { locale })
            : m.report_unpublished({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "files",
      header: m.report_files({}, { locale }),
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {/* Only a published snapshot is downloadable - the endpoint that
              serves the file is on the public contour. */}
          {row.published && row.has_pdf ? (
            <a
              className="text-sm underline"
              href={reportDownloadUrl(row.id, "pdf")}
              download
            >
              PDF
            </a>
          ) : null}
          {row.published && row.has_xlsx ? (
            <a
              className="text-sm underline"
              href={reportDownloadUrl(row.id, "xlsx")}
              download
            >
              XLSX
            </a>
          ) : null}
          {row.published ? null : (
            <span className="text-xs text-muted-foreground">
              {m.report_files_after_publish({}, { locale })}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      cell: (row) => (
        <Button
          size="sm"
          variant={row.published ? "outline" : "default"}
          disabled={csrf === undefined || setPublished.isPending}
          onClick={() => {
            // Publishing adds a file; unpublishing takes one away from the
            // public dashboard, where a visitor may already have the link.
            // Only the removing direction asks.
            if (
              !row.published ||
              window.confirm(m.confirm_unpublish_report({}, { locale }))
            )
              setPublished.mutate({ id: row.id, publish: !row.published })
          }}
        >
          {row.published
            ? m.report_unpublish({}, { locale })
            : m.report_publish({}, { locale })}
        </Button>
      ),
    },
  ]

  return (
    <AdminCard
      title={m.admin_reports({}, { locale })}
      description={m.admin_reports_hint({}, { locale })}
    >
      <AdminTable
        columns={columns}
        rows={reports.data?.items ?? []}
        empty={m.report_none({}, { locale })}
      />
    </AdminCard>
  )
}
