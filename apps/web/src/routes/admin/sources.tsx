import { useState } from "react"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import * as v from "valibot"

import type { BatchDto, SourceDto } from "@/api/types.gen"
import {
  AdminCard,
  BatchStatusBadge,
  notifyError,
  notifySaved,
} from "@/components/admin/AdminCard"
import { AdminTable, AdminVirtualTable } from "@/components/admin/AdminTable"
import type { AdminColumn } from "@/components/admin/AdminTable"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import {
  FieldAction,
  LabeledInput,
  LabeledSelect,
} from "@/components/forms/fields"
import { useCsrfToken } from "@/hooks/use-session"
import { adminApi } from "@/lib/api-admin"
import { formatCount, formatDateTime } from "@/lib/format"
import { adminQueries } from "@/lib/queries"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Ingest sources and the import journal (TZ.md §3.3, §4.6).
 *
 * A run is started, not awaited: the endpoint answers `202` and the batch it
 * opens shows up in the journal below, which polls itself while anything is
 * running. Every rejected row is inspectable - the batch detail carries a
 * record index, a kind and a column name, never source text.
 */
export const Route = createFileRoute("/admin/sources")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_sources()) }] }),
  loader: async ({ context }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(adminQueries.sources()),
      context.queryClient.ensureQueryData(adminQueries.batches()),
    ])
  },
  component: SourcesPage,
})

function SourcesPage() {
  const locale = getLocale()
  return (
    <>
      <SourcesCard locale={locale} />
      <BatchesCard locale={locale} />
    </>
  )
}

/* ── Sources ──────────────────────────────────────────────────────────────── */

function SourcesCard({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const sources = useQuery(adminQueries.sources())

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "sources"] })

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteSource(id, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void invalidate()
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const toggle = useMutation({
    mutationFn: (source: SourceDto) =>
      adminApi.updateSource(
        source.id,
        { enabled: !source.enabled },
        csrf ?? ""
      ),
    onSuccess: () => {
      notifySaved(locale)
      void invalidate()
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const run = useMutation({
    mutationFn: (id: number) => adminApi.runIngest(id, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale, m.source_run_started({}, { locale }))
      void queryClient.invalidateQueries({ queryKey: ["admin", "batches"] })
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const columns: readonly AdminColumn<SourceDto>[] = [
    {
      id: "kind",
      header: m.source_kind({}, { locale }),
      cell: (row) => (
        <Badge variant="outline">
          {row.kind === "api"
            ? m.source_kind_api({}, { locale })
            : m.source_kind_csv({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "base_url",
      header: m.source_base_url({}, { locale }),
      cell: (row) => <span className="break-all">{row.base_url ?? "-"}</span>,
    },
    {
      id: "schedule",
      header: m.source_schedule({}, { locale }),
      cell: (row) => row.schedule ?? "-",
    },
    {
      id: "cursor",
      header: m.source_cursor({}, { locale }),
      cell: (row) =>
        row.has_cursor
          ? m.source_cursor_present({}, { locale })
          : m.source_cursor_absent({}, { locale }),
    },
    {
      id: "state",
      header: m.source_enabled({}, { locale }),
      cell: (row) => (
        <Badge variant={row.enabled ? "default" : "secondary"}>
          {row.enabled
            ? m.source_enabled_yes({}, { locale })
            : m.source_enabled_no({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      cell: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            size="sm"
            disabled={csrf === undefined || run.isPending}
            onClick={() => {
              run.mutate(row.id)
            }}
          >
            {m.source_run({}, { locale })}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={csrf === undefined || toggle.isPending}
            onClick={() => {
              toggle.mutate(row)
            }}
          >
            {row.enabled
              ? m.source_disable({}, { locale })
              : m.source_enable({}, { locale })}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={csrf === undefined || remove.isPending}
            onClick={() => {
              if (window.confirm(m.confirm_delete({}, { locale })))
                remove.mutate(row.id)
            }}
          >
            {m.action_delete({}, { locale })}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminCard
      title={m.admin_sources({}, { locale })}
      description={m.admin_sources_hint({}, { locale })}
    >
      <AdminTable
        columns={columns}
        rows={sources.data?.items ?? []}
        empty={m.source_none({}, { locale })}
      />
      <NewSourceForm locale={locale} />
    </AdminCard>
  )
}

function NewSourceForm({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: { kind: "csv", base_url: "", schedule: "" },
    validators: {
      onSubmit: v.object({
        kind: v.picklist(["api", "csv"], m.form_required({}, { locale })),
        base_url: v.pipe(
          v.string(),
          v.trim(),
          v.minLength(1, m.form_required({}, { locale }))
        ),
        schedule: v.string(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await adminApi.createSource(
          {
            kind: value.kind,
            base_url: value.base_url.trim(),
            schedule:
              value.schedule.trim() === "" ? null : value.schedule.trim(),
            enabled: true,
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await queryClient.invalidateQueries({ queryKey: ["admin", "sources"] })
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  return (
    <form
      className="grid grid-cols-1 items-start gap-3 border-t pt-4 @2xl:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="kind">
        {(field) => (
          <LabeledSelect
            id={field.name}
            label={m.source_kind({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            errors={field.state.meta.errors}
            options={[
              { value: "csv", label: m.source_kind_csv({}, { locale }) },
              { value: "api", label: m.source_kind_api({}, { locale }) },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="base_url">
        {(field) => (
          <LabeledInput
            id={field.name}
            label={m.source_base_url({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={field.state.meta.errors}
            description={m.source_base_url_hint({}, { locale })}
          />
        )}
      </form.Field>
      <form.Field name="schedule">
        {(field) => (
          <LabeledInput
            id={field.name}
            label={m.source_schedule({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            errors={field.state.meta.errors}
            description={m.source_schedule_hint({}, { locale })}
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <FieldAction>
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {m.action_add({}, { locale })}
            </Button>
          </FieldAction>
        )}
      </form.Subscribe>
    </form>
  )
}

/* ── Import journal ───────────────────────────────────────────────────────── */

function BatchesCard({ locale }: { locale: Locale }) {
  const batches = useQuery(adminQueries.batches())
  const [openBatch, setOpenBatch] = useState<number | null>(null)

  const columns: readonly AdminColumn<BatchDto>[] = [
    {
      id: "started",
      header: m.batch_started({}, { locale }),
      className: "minmax(11rem, 1.4fr)",
      cell: (row) => formatDateTime(row.started_at, locale),
    },
    {
      id: "source",
      header: m.batch_source({}, { locale }),
      className: "minmax(8rem, 1fr)",
      cell: (row) => `${row.source} · ${row.mode}`,
    },
    {
      id: "status",
      header: m.batch_status({}, { locale }),
      className: "minmax(7rem, 0.7fr)",
      cell: (row) => <BatchStatusBadge status={row.status} locale={locale} />,
    },
    {
      id: "read",
      header: m.batch_rows_read({}, { locale }),
      align: "end",
      className: "minmax(5rem, 0.6fr)",
      cell: (row) => formatCount(row.rows_read, locale),
    },
    {
      id: "upserted",
      header: m.batch_rows_upserted({}, { locale }),
      align: "end",
      className: "minmax(5rem, 0.6fr)",
      cell: (row) => formatCount(row.rows_upserted, locale),
    },
    {
      id: "rejected",
      header: m.batch_rows_rejected({}, { locale }),
      align: "end",
      className: "minmax(5rem, 0.6fr)",
      cell: (row) => formatCount(row.rows_rejected, locale),
    },
    {
      id: "skipped",
      header: m.batch_rows_skipped({}, { locale }),
      align: "end",
      className: "minmax(5rem, 0.6fr)",
      cell: (row) => formatCount(row.rows_skipped_deleted, locale),
    },
    {
      id: "errors",
      header: m.table_actions({}, { locale }),
      align: "end",
      className: "minmax(7rem, 0.8fr)",
      cell: (row) => (
        <Button
          size="sm"
          variant="ghost"
          aria-expanded={openBatch === row.id}
          onClick={() => {
            setOpenBatch((previous) => (previous === row.id ? null : row.id))
          }}
        >
          {openBatch === row.id
            ? m.batch_errors_hide({}, { locale })
            : m.batch_errors_show({}, { locale })}
        </Button>
      ),
    },
  ]

  return (
    <AdminCard
      title={m.batches_title({}, { locale })}
      description={m.batches_hint({}, { locale })}
    >
      <AdminVirtualTable
        columns={columns}
        rows={batches.data?.items ?? []}
        empty={m.batches_empty({}, { locale })}
        height={360}
      />
      {openBatch === null ? null : (
        <BatchErrors id={openBatch} locale={locale} />
      )}
    </AdminCard>
  )
}

/**
 * The rejects of one batch, verbatim from `ingest_batches.errors`. Rendered as
 * pretty JSON rather than parsed into columns: the shape is the ingest lane's
 * to change, and an administrator forwarding a defect to it wants exactly what
 * was recorded.
 */
function BatchErrors({ id, locale }: { id: number; locale: Locale }) {
  const batch = useQuery(adminQueries.batch(id))

  if (batch.isPending) {
    return (
      <p className="text-sm text-muted-foreground">
        {m.section_loading({}, { locale })}
      </p>
    )
  }
  const errors = batch.data?.errors
  const empty = errors == null || (Array.isArray(errors) && errors.length === 0)

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <p className="text-sm font-medium">
        {m.batch_errors_title({ id: String(id) }, { locale })}
      </p>
      {empty ? (
        <p className="text-sm text-muted-foreground">
          {m.batch_errors_empty({}, { locale })}
        </p>
      ) : (
        <pre className="max-h-80 overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(errors, null, 2)}
        </pre>
      )}
    </div>
  )
}
