import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import * as v from "valibot"

import type { AuditRowDto } from "@/api/types.gen"
import { AdminCard } from "@/components/admin/AdminCard"
import { AdminVirtualTable } from "@/components/admin/AdminTable"
import type { AdminColumn } from "@/components/admin/AdminTable"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import type { AuditQuery } from "@/lib/api-admin"
import { formatCount, formatDateTime } from "@/lib/format"
import { ADMIN_PAGE_SIZE, adminQueries } from "@/lib/queries"
import { ROLE_KINDS, roleLabel } from "@/lib/roles"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * The access journal (TZ.md §6.3). Append-only at the schema level, so there
 * is nothing to edit here and no delete control to offer - only filters and a
 * virtualized window over what was recorded.
 *
 * The filter state lives in the URL like every other filter in this app, so a
 * compliance officer can send a colleague the exact slice they are looking at.
 */
const auditSearchSchema = v.object({
  user_id: v.optional(v.number()),
  role: v.optional(v.string()),
  action: v.optional(v.string()),
  section: v.optional(v.string()),
  from: v.optional(v.string()),
  to: v.optional(v.string()),
})

type AuditSearch = v.InferOutput<typeof auditSearchSchema>

export const Route = createFileRoute("/admin/audit")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_audit()) }] }),
  validateSearch: auditSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(
      adminQueries.audit(toQuery(deps.search))
    )
  },
  component: AuditPage,
})

function toQuery(search: AuditSearch): AuditQuery {
  const query: AuditQuery = { limit: ADMIN_PAGE_SIZE, offset: 0 }
  if (search.user_id !== undefined) query.user_id = search.user_id
  if (search.role !== undefined && search.role !== "") query.role = search.role
  if (search.action !== undefined && search.action !== "")
    query.action = search.action
  if (search.section !== undefined && search.section !== "")
    query.section = search.section
  if (search.from !== undefined && search.from !== "") query.from = search.from
  if (search.to !== undefined && search.to !== "") query.to = search.to
  return query
}

function AuditPage() {
  const locale = getLocale()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const query = useMemo(() => toQuery(search), [search])
  const audit = useQuery(adminQueries.audit(query))

  const apply = (patch: Partial<AuditSearch>) => {
    void navigate({ search: (previous) => ({ ...previous, ...patch }) })
  }

  const columns: readonly AdminColumn<AuditRowDto>[] = [
    {
      id: "occurred_at",
      header: m.audit_time({}, { locale }),
      className: "minmax(11rem, 1.2fr)",
      cell: (row) => formatDateTime(row.occurred_at, locale),
    },
    {
      id: "user",
      header: m.audit_user({}, { locale }),
      // 5rem could not hold «Пользователь», and the grid header has no
      // truncation of its own - the word ran straight into «Роль».
      className: "minmax(7rem, 0.6fr)",
      cell: (row) => String(row.user_id),
    },
    {
      id: "role",
      header: m.audit_role({}, { locale }),
      className: "minmax(8rem, 0.8fr)",
      cell: (row) => roleLabel(row.role, locale),
    },
    {
      id: "action",
      header: m.audit_action({}, { locale }),
      className: "minmax(8rem, 0.8fr)",
      cell: (row) => (
        <Badge variant={row.action === "admin_change" ? "default" : "outline"}>
          {actionLabel(row.action, locale)}
        </Badge>
      ),
    },
    {
      id: "section",
      header: m.audit_section({}, { locale }),
      className: "minmax(8rem, 0.9fr)",
      cell: (row) => row.section,
    },
    {
      id: "filters",
      header: m.audit_filters({}, { locale }),
      className: "minmax(12rem, 2fr)",
      cell: (row) => (
        <code className="text-xs break-all">{JSON.stringify(row.filters)}</code>
      ),
    },
    {
      id: "ip",
      header: m.audit_ip({}, { locale }),
      className: "minmax(7rem, 0.7fr)",
      cell: (row) => row.ip ?? "-",
    },
  ]

  const actions = audit.data?.actions ?? []

  return (
    <AdminCard
      title={m.admin_audit({}, { locale })}
      description={m.admin_audit_hint({}, { locale })}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm" htmlFor="audit-user">
          {m.audit_user({}, { locale })}
          <Input
            id="audit-user"
            type="number"
            className="w-28"
            value={search.user_id === undefined ? "" : String(search.user_id)}
            onChange={(event) => {
              const parsed = Number(event.target.value)
              apply({
                user_id:
                  Number.isInteger(parsed) && parsed > 0 ? parsed : undefined,
              })
            }}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="audit-role">
          {m.audit_role({}, { locale })}
          <NativeSelect
            id="audit-role"
            className="w-48"
            value={search.role ?? ""}
            onChange={(event) => {
              apply({ role: event.target.value || undefined })
            }}
          >
            <NativeSelectOption value="">
              {m.audit_any({}, { locale })}
            </NativeSelectOption>
            {ROLE_KINDS.map((role) => (
              <NativeSelectOption key={role} value={role}>
                {roleLabel(role, locale)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="audit-action">
          {m.audit_action({}, { locale })}
          <NativeSelect
            id="audit-action"
            className="w-48"
            value={search.action ?? ""}
            onChange={(event) => {
              apply({ action: event.target.value || undefined })
            }}
          >
            <NativeSelectOption value="">
              {m.audit_any({}, { locale })}
            </NativeSelectOption>
            {actions.map((action) => (
              <NativeSelectOption key={action} value={action}>
                {actionLabel(action, locale)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="audit-section">
          {m.audit_section({}, { locale })}
          <Input
            id="audit-section"
            className="w-44"
            value={search.section ?? ""}
            onChange={(event) => {
              apply({ section: event.target.value || undefined })
            }}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="audit-from">
          {m.filter_from({}, { locale })}
          <Input
            id="audit-from"
            type="date"
            className="w-44"
            value={search.from ?? ""}
            onChange={(event) => {
              apply({ from: event.target.value || undefined })
            }}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="audit-to">
          {m.filter_to({}, { locale })}
          <Input
            id="audit-to"
            type="date"
            className="w-44"
            value={search.to ?? ""}
            onChange={(event) => {
              apply({ to: event.target.value || undefined })
            }}
          />
        </label>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            apply({
              user_id: undefined,
              role: undefined,
              action: undefined,
              section: undefined,
              from: undefined,
              to: undefined,
            })
          }}
        >
          {m.filter_reset({}, { locale })}
        </Button>
      </div>

      <AdminVirtualTable
        columns={columns}
        rows={audit.data?.items ?? []}
        empty={m.audit_none({}, { locale })}
        height={520}
        estimateRowHeight={52}
      />

      <p className="text-xs text-muted-foreground">
        {m.audit_footer(
          {
            total: formatCount(audit.data?.total ?? 0, locale),
            days: String(audit.data?.retention_days ?? 365),
          },
          { locale }
        )}
      </p>
    </AdminCard>
  )
}

function actionLabel(action: string, locale: Locale): string {
  switch (action) {
    case "view":
      return m.audit_action_view({}, { locale })
    case "export_pdf":
      return m.audit_action_export_pdf({}, { locale })
    case "export_xlsx":
      return m.audit_action_export_xlsx({}, { locale })
    case "admin_change":
      return m.audit_action_admin_change({}, { locale })
    default:
      return action
  }
}
