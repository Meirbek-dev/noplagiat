import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import * as v from "valibot"

import type { AccountDto, RoleGrantRequest } from "@/api/types.gen"
import {
  AdminCard,
  notifyError,
  notifySaved,
} from "@/components/admin/AdminCard"
import { AdminTable } from "@/components/admin/AdminTable"
import type { AdminColumn } from "@/components/admin/AdminTable"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import {
  FieldAction,
  LabeledInput,
  LabeledSelect,
} from "@/components/forms/fields"
import { useCsrfToken } from "@/hooks/use-session"
import { adminApi, DICTIONARY_KINDS } from "@/lib/api-admin"
import { localizedName } from "@/lib/adapters"
import { adminQueries } from "@/lib/queries"
import { ROLE_KINDS, roleLabel } from "@/lib/roles"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Roles and areas of visibility (TZ.md §4.6, §5).
 *
 * `email` and `display_name` appear here and nowhere else: TZ §6.1 exempts the
 * *service* accounts of the dashboard from the PII ban precisely so grants can
 * be administered, and no analytic response, export or log line carries them.
 *
 * A grant is `(role, scope)`. `dean` needs a faculty and `dept_head` a
 * department; the scope pickers follow the chosen role, and the server refuses
 * a mismatch with a `422` in any case.
 */
export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_roles()) }] }),
  loader: async ({ context }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(adminQueries.roles()),
      context.queryClient.ensureQueryData(adminQueries.dictionary("faculties")),
      context.queryClient.ensureQueryData(
        adminQueries.dictionary("departments")
      ),
    ])
  },
  component: RolesPage,
})

function RolesPage() {
  const locale = getLocale()
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const accounts = useQuery(adminQueries.roles())
  // Already loaded for the grant form below, so naming a dean's faculty in the
  // table costs no extra request.
  const faculties = useQuery(adminQueries.dictionary(DICTIONARY_KINDS[0]))
  const departments = useQuery(adminQueries.dictionary(DICTIONARY_KINDS[1]))

  /**
   * The unit a grant is scoped to, named rather than numbered.
   *
   * `RoleGrantDto` carries the dictionary *code* beside the id, so this
   * resolves without a lookup by id; the code itself is the fallback when the
   * dictionary has not loaded or the row has since been deleted, because a
   * dean's faculty going unnamed is worse than showing `FAC03`.
   */
  const scopeUnit = (
    grant: AccountDto["roles"][number]
  ): string | undefined => {
    const [code, rows] = grant.scope_department_code
      ? [grant.scope_department_code, departments.data?.items]
      : [grant.scope_faculty_code, faculties.data?.items]
    if (!code) return undefined
    const row = rows?.find((item) => item.code === code)
    return row === undefined ? code : localizedName(row, locale)
  }

  const revoke = useMutation({
    mutationFn: (body: RoleGrantRequest) =>
      adminApi.revokeRole(body, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void queryClient.invalidateQueries({ queryKey: ["admin", "roles"] })
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const columns: readonly AdminColumn<AccountDto>[] = [
    {
      id: "account",
      header: m.roles_account({}, { locale }),
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.display_name}</span>
          <span className="text-xs break-all text-muted-foreground">
            {row.email}
          </span>
          <span className="text-xs break-all text-muted-foreground">
            {row.sso_subject}
          </span>
        </div>
      ),
    },
    {
      id: "active",
      header: m.roles_active({}, { locale }),
      cell: (row) => (
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active
            ? m.roles_active_yes({}, { locale })
            : m.roles_active_no({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "grants",
      header: m.roles_grants({}, { locale }),
      cell: (row) =>
        row.roles.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            {m.role_none({}, { locale })}
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {row.roles.map((grant) => (
              <span
                key={`${grant.role}-${String(grant.scope_faculty_id)}-${String(grant.scope_department_id)}`}
                className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs"
              >
                {roleLabel(grant.role, locale)}
                {/*
                  Which faculty a dean actually governs. The contract carries
                  the dictionary *code* (`RoleGrantDto.scope_faculty_code`) and
                  not a localized name, because the code is what the grant form
                  above takes and what an administrator matches against the
                  dictionaries screen - a translated name here would be a second
                  identifier for the same row.
                */}
                {scopeUnit(grant) === undefined ? null : (
                  <span className="font-mono text-muted-foreground">
                    {scopeUnit(grant)}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  // 20px was under every pointer-target guideline; the chip
                  // grows with it rather than the glyph.
                  className="size-6 p-0"
                  disabled={csrf === undefined || revoke.isPending}
                  aria-label={`${m.roles_revoke({}, { locale })} - ${roleLabel(grant.role, locale)}${
                    scopeUnit(grant) === undefined ? "" : ` ${scopeUnit(grant)}`
                  }`}
                  onClick={() => {
                    // Revoking a grant takes an account out of the internal
                    // contour immediately. Every other destructive control in
                    // the admin area asks first; this one did not.
                    if (window.confirm(m.confirm_revoke_role({}, { locale })))
                      revoke.mutate({
                        sso_subject: row.sso_subject,
                        role: grant.role,
                      })
                  }}
                >
                  <span aria-hidden="true">×</span>
                </Button>
              </span>
            ))}
          </div>
        ),
    },
  ]

  return (
    <>
      <AdminCard
        title={m.admin_roles({}, { locale })}
        description={m.admin_roles_hint({}, { locale })}
      >
        <AdminTable
          columns={columns}
          rows={accounts.data?.items ?? []}
          empty={m.roles_none({}, { locale })}
        />
      </AdminCard>
      <GrantCard locale={locale} />
    </>
  )
}

function GrantCard({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const faculties = useQuery(adminQueries.dictionary(DICTIONARY_KINDS[0]))
  const departments = useQuery(adminQueries.dictionary(DICTIONARY_KINDS[1]))

  const form = useForm({
    defaultValues: {
      sso_subject: "",
      role: "dean",
      scope_faculty_code: "",
      scope_department_code: "",
    },
    validators: {
      onSubmit: v.object({
        sso_subject: v.pipe(
          v.string(),
          v.trim(),
          v.minLength(1, m.form_required({}, { locale }))
        ),
        role: v.picklist(ROLE_KINDS),
        scope_faculty_code: v.string(),
        scope_department_code: v.string(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await adminApi.grantRole(
          {
            sso_subject: value.sso_subject.trim(),
            role: value.role,
            scope_faculty_code:
              value.scope_faculty_code === "" ? null : value.scope_faculty_code,
            scope_department_code:
              value.scope_department_code === ""
                ? null
                : value.scope_department_code,
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await queryClient.invalidateQueries({ queryKey: ["admin", "roles"] })
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  return (
    <AdminCard
      title={m.roles_grant({}, { locale })}
      description={m.roles_grant_hint({}, { locale })}
    >
      <form
        className="grid grid-cols-1 items-start gap-3 @2xl:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="sso_subject">
          {(field) => (
            <LabeledInput
              id={field.name}
              label={m.roles_subject({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>

        <form.Field name="role">
          {(field) => (
            <LabeledSelect
              id={field.name}
              label={m.roles_role({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              options={ROLE_KINDS.map((role) => ({
                value: role,
                label: roleLabel(role, locale),
              }))}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.role}>
          {(role) => (
            <>
              <form.Field name="scope_faculty_code">
                {(field) => (
                  <LabeledSelect
                    id={field.name}
                    label={m.roles_scope_faculty({}, { locale })}
                    value={field.state.value}
                    onChange={field.handleChange}
                    errors={field.state.meta.errors}
                    placeholder={m.roles_scope_none({}, { locale })}
                    description={
                      role === "dean"
                        ? m.roles_scope_faculty_required({}, { locale })
                        : undefined
                    }
                    options={(faculties.data?.items ?? []).map((item) => ({
                      value: item.code,
                      label: localizedName(item, locale),
                    }))}
                  />
                )}
              </form.Field>
              <form.Field name="scope_department_code">
                {(field) => (
                  <LabeledSelect
                    id={field.name}
                    label={m.roles_scope_department({}, { locale })}
                    value={field.state.value}
                    onChange={field.handleChange}
                    errors={field.state.meta.errors}
                    placeholder={m.roles_scope_none({}, { locale })}
                    description={
                      role === "dept_head"
                        ? m.roles_scope_department_required({}, { locale })
                        : undefined
                    }
                    options={(departments.data?.items ?? []).map((item) => ({
                      value: item.code,
                      label: localizedName(item, locale),
                    }))}
                  />
                )}
              </form.Field>
            </>
          )}
        </form.Subscribe>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <FieldAction>
              <Button
                type="submit"
                disabled={isSubmitting || csrf === undefined}
              >
                {m.roles_grant_submit({}, { locale })}
              </Button>
            </FieldAction>
          )}
        </form.Subscribe>
      </form>
    </AdminCard>
  )
}
