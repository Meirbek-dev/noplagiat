import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as v from "valibot"

import type {
  AliasDto,
  DictionaryItem,
  InitiatorRuleDto,
  StaffUnitDto,
  WorkTypeRuleDto,
} from "@/api/types.gen"
import { AdminCard, notifyError, notifySaved } from "./AdminCard"
import { AdminTable, AdminVirtualTable } from "./AdminTable"
import type { AdminColumn } from "./AdminTable"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import {
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
} from "@/components/forms/fields"
import { useCsrfToken } from "@/hooks/use-session"
import { localizedName } from "@/lib/adapters"
import type { DictionaryKind } from "@/lib/api-admin"
import { adminApi } from "@/lib/api-admin"
import { formatDateTime } from "@/lib/format"
import { adminQueries } from "@/lib/queries"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The dictionary tabs of the admin area (TZ.md §4.6): the four unit
 * dictionaries and their source-label aliases, the reviewer→unit table, and
 * the two derivation rule sets.
 *
 * Every panel is list-then-form: what exists, and one form to add or replace an
 * entry. The upserts are idempotent on their natural key, so "add" and "edit"
 * are the same request and there is no second modal to keep in sync.
 */

/* ── Unit and work-type dictionaries ──────────────────────────────────────── */

const PARENT_OF: Record<DictionaryKind, DictionaryKind | null> = {
  faculties: null,
  departments: "faculties",
  programs: "departments",
  "work-types": null,
}

export function DictionaryPanel({
  kind,
  locale,
}: {
  kind: DictionaryKind
  locale: Locale
}) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const dictionary = useQuery(adminQueries.dictionary(kind))
  const parentKind = PARENT_OF[kind]
  const parents = useQuery({
    ...adminQueries.dictionary(parentKind ?? "faculties"),
    enabled: parentKind !== null,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "dictionary"] })

  const remove = useMutation({
    mutationFn: (code: string) =>
      adminApi.deleteDictionary(kind, code, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void invalidate()
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const columns: readonly AdminColumn<DictionaryItem>[] = [
    {
      id: "code",
      header: m.dict_code({}, { locale }),
      cell: (row) => row.code,
    },
    {
      id: "name_ru",
      header: m.dict_name_ru({}, { locale }),
      cell: (row) => row.name_ru,
    },
    {
      id: "name_kk",
      header: m.dict_name_kk({}, { locale }),
      cell: (row) => row.name_kk,
    },
    {
      id: "name_en",
      header: m.dict_name_en({}, { locale }),
      cell: (row) => row.name_en,
    },
    ...(parentKind === null
      ? []
      : [
          {
            id: "parent",
            header: m.dict_parent({}, { locale }),
            cell: (row: DictionaryItem) => row.parent_code ?? "-",
          },
        ]),
    {
      id: "active",
      header: m.dict_active({}, { locale }),
      cell: (row) => (
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active
            ? m.dict_active_yes({}, { locale })
            : m.dict_active_no({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      cell: (row) => (
        <Button
          size="sm"
          variant="ghost"
          disabled={csrf === undefined || remove.isPending}
          onClick={() => {
            if (window.confirm(m.confirm_delete({}, { locale })))
              remove.mutate(row.code)
          }}
        >
          {m.action_delete({}, { locale })}
        </Button>
      ),
    },
  ]

  return (
    <AdminCard
      title={m.dict_entries({}, { locale })}
      description={m.dict_entries_hint({}, { locale })}
    >
      <AdminTable
        columns={columns}
        rows={dictionary.data?.items ?? []}
        empty={m.dict_none({}, { locale })}
      />
      <DictionaryForm
        kind={kind}
        parents={parentKind === null ? [] : (parents.data?.items ?? [])}
        hasParent={parentKind !== null}
        locale={locale}
      />
    </AdminCard>
  )
}

function DictionaryForm({
  kind,
  parents,
  hasParent,
  locale,
}: {
  kind: DictionaryKind
  parents: readonly DictionaryItem[]
  hasParent: boolean
  locale: Locale
}) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      code: "",
      name_ru: "",
      name_kk: "",
      name_en: "",
      parent_code: "",
      sort_order: "",
      active: true,
    },
    validators: {
      onSubmit: v.object({
        code: required(locale),
        name_ru: required(locale),
        name_kk: required(locale),
        name_en: v.string(),
        parent_code: v.string(),
        sort_order: v.string(),
        active: v.boolean(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const sortOrder = Number(value.sort_order)
        await adminApi.upsertDictionary(
          kind,
          {
            code: value.code.trim(),
            name_ru: value.name_ru.trim(),
            name_kk: value.name_kk.trim(),
            name_en: value.name_en.trim(),
            parent_code:
              value.parent_code.trim() === "" ? null : value.parent_code.trim(),
            active: value.active,
            ...(value.sort_order.trim() !== "" && Number.isFinite(sortOrder)
              ? { sort_order: sortOrder }
              : {}),
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await queryClient.invalidateQueries({
          queryKey: ["admin", "dictionary"],
        })
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  return (
    <form
      className="grid grid-cols-1 items-end gap-3 border-t pt-4 @2xl:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="code">
        {(field) => (
          <LabeledInput
            id={`${kind}-code`}
            label={m.dict_code({}, { locale })}
            description={m.dict_code_hint({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <form.Field name="name_ru">
        {(field) => (
          <LabeledInput
            id={`${kind}-name-ru`}
            label={m.dict_name_ru({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <form.Field name="name_kk">
        {(field) => (
          <LabeledInput
            id={`${kind}-name-kk`}
            label={m.dict_name_kk({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>
      <form.Field name="name_en">
        {(field) => (
          <LabeledInput
            id={`${kind}-name-en`}
            label={m.dict_name_en({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>

      {hasParent ? (
        <form.Field name="parent_code">
          {(field) => (
            <LabeledSelect
              id={`${kind}-parent`}
              label={m.dict_parent({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              placeholder={m.dict_parent_none({}, { locale })}
              options={parents.map((item) => ({
                value: item.code,
                label: localizedName(item, locale),
              }))}
            />
          )}
        </form.Field>
      ) : (
        <form.Field name="sort_order">
          {(field) => (
            <LabeledInput
              id={`${kind}-sort`}
              label={m.dict_sort_order({}, { locale })}
              type="number"
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
      )}

      <form.Field name="active">
        {(field) => (
          <LabeledCheckbox
            id={`${kind}-active`}
            label={m.dict_active({}, { locale })}
            checked={field.state.value}
            onChange={field.handleChange}
            errors={field.state.meta.errors}
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting || csrf === undefined}>
            {m.action_save({}, { locale })}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

/* ── Aliases ──────────────────────────────────────────────────────────────── */

const ALIAS_KINDS = ["faculty", "department", "program", "work_type"] as const

export function AliasesPanel({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const aliases = useQuery(adminQueries.aliases())

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteAlias(id, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void queryClient.invalidateQueries({ queryKey: ["admin", "aliases"] })
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const form = useForm({
    defaultValues: { kind: "faculty", source_label: "", target_code: "" },
    validators: {
      onSubmit: v.object({
        kind: v.picklist(ALIAS_KINDS),
        source_label: required(locale),
        target_code: required(locale),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await adminApi.upsertAlias(
          {
            kind: value.kind,
            source_label: value.source_label.trim(),
            target_code: value.target_code.trim(),
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await queryClient.invalidateQueries({ queryKey: ["admin", "aliases"] })
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  const columns: readonly AdminColumn<AliasDto>[] = [
    {
      id: "kind",
      header: m.alias_kind({}, { locale }),
      cell: (row) => row.kind,
    },
    {
      id: "source",
      header: m.alias_source_label({}, { locale }),
      cell: (row) => row.source_label,
    },
    {
      id: "target",
      header: m.alias_target({}, { locale }),
      cell: (row) => String(row.target_id),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      cell: (row) => (
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
      ),
    },
  ]

  return (
    <AdminCard
      title={m.aliases_title({}, { locale })}
      description={m.aliases_hint({}, { locale })}
    >
      <AdminTable
        columns={columns}
        rows={aliases.data?.items ?? []}
        empty={m.alias_none({}, { locale })}
      />
      <form
        className="grid grid-cols-1 items-end gap-3 border-t pt-4 @2xl:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="kind">
          {(field) => (
            <LabeledSelect
              id="alias-kind"
              label={m.alias_kind({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              options={ALIAS_KINDS.map((kind) => ({
                value: kind,
                label: kind,
              }))}
            />
          )}
        </form.Field>
        <form.Field name="source_label">
          {(field) => (
            <LabeledInput
              id="alias-source"
              label={m.alias_source_label({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="target_code">
          {(field) => (
            <LabeledInput
              id="alias-target"
              label={m.alias_target_code({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {m.action_save({}, { locale })}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AdminCard>
  )
}

/* ── Reviewer → unit table ────────────────────────────────────────────────── */

export function StaffUnitsPanel({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const staffUnits = useQuery(adminQueries.staffUnits())
  const faculties = useQuery(adminQueries.dictionary("faculties"))
  const departments = useQuery(adminQueries.dictionary("departments"))

  const remove = useMutation({
    mutationFn: (hmac: string) => adminApi.deleteStaffUnit(hmac, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff-units"] })
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const form = useForm({
    defaultValues: { email: "", faculty_code: "", department_code: "" },
    validators: {
      onSubmit: v.object({
        email: v.pipe(
          v.string(),
          v.trim(),
          v.email(m.form_invalid_email({}, { locale }))
        ),
        faculty_code: required(locale),
        department_code: required(locale),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await adminApi.upsertStaffUnit(
          {
            email: value.email.trim(),
            faculty_code: value.faculty_code,
            department_code: value.department_code,
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await queryClient.invalidateQueries({
          queryKey: ["admin", "staff-units"],
        })
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  const columns: readonly AdminColumn<StaffUnitDto>[] = [
    {
      id: "label",
      header: m.staff_unit_masked({}, { locale }),
      className: "minmax(14rem, 1.6fr)",
      cell: (row) => <code className="text-xs">{row.masked_label}</code>,
    },
    {
      id: "faculty",
      header: m.filter_faculty({}, { locale }),
      className: "minmax(7rem, 0.8fr)",
      cell: (row) => row.faculty_code,
    },
    {
      id: "department",
      header: m.filter_department({}, { locale }),
      className: "minmax(7rem, 0.8fr)",
      cell: (row) => row.department_code,
    },
    {
      id: "updated",
      header: m.staff_unit_updated({}, { locale }),
      className: "minmax(10rem, 1fr)",
      cell: (row) => formatDateTime(row.updated_at, locale),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      className: "minmax(7rem, 0.7fr)",
      cell: (row) => (
        <Button
          size="sm"
          variant="ghost"
          disabled={csrf === undefined || remove.isPending}
          onClick={() => {
            if (window.confirm(m.confirm_delete({}, { locale })))
              remove.mutate(row.email_hmac)
          }}
        >
          {m.action_delete({}, { locale })}
        </Button>
      ),
    },
  ]

  return (
    <AdminCard
      title={m.staff_units_title({}, { locale })}
      description={m.staff_units_hint({}, { locale })}
    >
      <AdminVirtualTable
        columns={columns}
        rows={staffUnits.data?.items ?? []}
        empty={m.staff_unit_none({}, { locale })}
        height={420}
      />
      <form
        className="grid grid-cols-1 items-end gap-3 border-t pt-4 @2xl:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="email">
          {(field) => (
            <LabeledInput
              id="staff-email"
              type="email"
              label={m.staff_unit_email({}, { locale })}
              // ADR-008 §2: HMAC'd and masked inside the handler; neither the
              // address nor the request body outlives the request.
              description={m.staff_unit_email_hint({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="faculty_code">
          {(field) => (
            <LabeledSelect
              id="staff-faculty"
              label={m.filter_faculty({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              placeholder={m.dict_parent_none({}, { locale })}
              options={(faculties.data?.items ?? []).map((item) => ({
                value: item.code,
                label: localizedName(item, locale),
              }))}
            />
          )}
        </form.Field>
        <form.Field name="department_code">
          {(field) => (
            <LabeledSelect
              id="staff-department"
              label={m.filter_department({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              placeholder={m.dict_parent_none({}, { locale })}
              options={(departments.data?.items ?? []).map((item) => ({
                value: item.code,
                label: localizedName(item, locale),
              }))}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {m.action_save({}, { locale })}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AdminCard>
  )
}

/* ── Derivation rules ─────────────────────────────────────────────────────── */

export function WorkTypeRulesPanel({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const rules = useQuery(adminQueries.workTypeRules())
  const workTypes = useQuery(adminQueries.dictionary("work-types"))

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "work-type-rules"] })

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteWorkTypeRule(id, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void invalidate()
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const toggle = useMutation({
    mutationFn: (rule: WorkTypeRuleDto) =>
      adminApi.updateWorkTypeRule(
        rule.id,
        {
          pattern: rule.pattern,
          work_type_code: rule.work_type_code,
          priority: rule.priority,
          active: !rule.active,
        },
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

  const form = useForm({
    defaultValues: { pattern: "", work_type_code: "", priority: "100" },
    validators: {
      onSubmit: v.object({
        pattern: required(locale),
        work_type_code: required(locale),
        priority: v.string(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await adminApi.createWorkTypeRule(
          {
            pattern: value.pattern.trim(),
            work_type_code: value.work_type_code,
            priority: Number(value.priority) || 100,
            active: true,
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await invalidate()
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  const columns: readonly AdminColumn<WorkTypeRuleDto>[] = [
    {
      id: "priority",
      header: m.rule_priority({}, { locale }),
      align: "end",
      cell: (row) => String(row.priority),
    },
    {
      id: "pattern",
      header: m.rule_pattern({}, { locale }),
      cell: (row) => <code className="text-xs">{row.pattern}</code>,
    },
    {
      id: "target",
      header: m.rule_work_type({}, { locale }),
      cell: (row) => row.work_type_code,
    },
    {
      id: "active",
      header: m.rule_active({}, { locale }),
      cell: (row) => (
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active
            ? m.dict_active_yes({}, { locale })
            : m.dict_active_no({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={csrf === undefined || toggle.isPending}
            onClick={() => {
              toggle.mutate(row)
            }}
          >
            {row.active
              ? m.rule_deactivate({}, { locale })
              : m.rule_activate({}, { locale })}
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
      title={m.work_type_rules_title({}, { locale })}
      description={m.work_type_rules_hint({}, { locale })}
    >
      <AdminTable
        columns={columns}
        rows={rules.data?.items ?? []}
        empty={m.rule_none({}, { locale })}
      />
      <form
        className="grid grid-cols-1 items-end gap-3 border-t pt-4 @2xl:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="pattern">
          {(field) => (
            <LabeledInput
              id="wtr-pattern"
              label={m.rule_pattern({}, { locale })}
              description={m.rule_pattern_hint({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="work_type_code">
          {(field) => (
            <LabeledSelect
              id="wtr-target"
              label={m.rule_work_type({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              placeholder={m.dict_parent_none({}, { locale })}
              options={(workTypes.data?.items ?? []).map((item) => ({
                value: item.code,
                label: localizedName(item, locale),
              }))}
            />
          )}
        </form.Field>
        <form.Field name="priority">
          {(field) => (
            <LabeledInput
              id="wtr-priority"
              type="number"
              label={m.rule_priority({}, { locale })}
              description={m.rule_priority_hint({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {m.action_add({}, { locale })}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AdminCard>
  )
}

const INITIATORS = ["student", "staff_self", "registrar", "other"] as const

export function InitiatorRulesPanel({ locale }: { locale: Locale }) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()
  const rules = useQuery(adminQueries.initiatorRules())

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "initiator-rules"] })

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteInitiatorRule(id, csrf ?? ""),
    onSuccess: () => {
      notifySaved(locale)
      void invalidate()
    },
    onError: (error: unknown) => {
      notifyError(error, locale)
    },
  })

  const toggle = useMutation({
    mutationFn: (rule: InitiatorRuleDto) =>
      adminApi.updateInitiatorRule(
        rule.id,
        {
          pattern: rule.pattern,
          initiator: rule.initiator,
          priority: rule.priority,
          active: !rule.active,
        },
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

  const form = useForm({
    defaultValues: { pattern: "", initiator: "staff_self", priority: "100" },
    validators: {
      onSubmit: v.object({
        pattern: required(locale),
        initiator: v.picklist(INITIATORS),
        priority: v.string(),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await adminApi.createInitiatorRule(
          {
            pattern: value.pattern.trim(),
            initiator: value.initiator,
            priority: Number(value.priority) || 100,
            active: true,
          },
          csrf ?? ""
        )
        notifySaved(locale)
        formApi.reset()
        await invalidate()
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  const columns: readonly AdminColumn<InitiatorRuleDto>[] = [
    {
      id: "priority",
      header: m.rule_priority({}, { locale }),
      align: "end",
      cell: (row) => String(row.priority),
    },
    {
      id: "pattern",
      header: m.rule_pattern({}, { locale }),
      cell: (row) => <code className="text-xs">{row.pattern}</code>,
    },
    {
      id: "initiator",
      header: m.rule_initiator({}, { locale }),
      cell: (row) => initiatorLabel(row.initiator, locale),
    },
    {
      id: "active",
      header: m.rule_active({}, { locale }),
      cell: (row) => (
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active
            ? m.dict_active_yes({}, { locale })
            : m.dict_active_no({}, { locale })}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: m.table_actions({}, { locale }),
      align: "end",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={csrf === undefined || toggle.isPending}
            onClick={() => {
              toggle.mutate(row)
            }}
          >
            {row.active
              ? m.rule_deactivate({}, { locale })
              : m.rule_activate({}, { locale })}
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
      title={m.initiator_rules_title({}, { locale })}
      description={m.initiator_rules_hint({}, { locale })}
    >
      <AdminTable
        columns={columns}
        rows={rules.data?.items ?? []}
        empty={m.rule_none({}, { locale })}
      />
      <form
        className="grid grid-cols-1 items-end gap-3 border-t pt-4 @2xl:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="pattern">
          {(field) => (
            <LabeledInput
              id="ir-pattern"
              label={m.rule_pattern({}, { locale })}
              description={m.rule_regex_hint({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="initiator">
          {(field) => (
            <LabeledSelect
              id="ir-initiator"
              label={m.rule_initiator({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              options={INITIATORS.map((initiator) => ({
                value: initiator,
                label: initiatorLabel(initiator, locale),
              }))}
            />
          )}
        </form.Field>
        <form.Field name="priority">
          {(field) => (
            <LabeledInput
              id="ir-priority"
              type="number"
              label={m.rule_priority({}, { locale })}
              description={m.rule_priority_hint({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {m.action_add({}, { locale })}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </AdminCard>
  )
}

function initiatorLabel(initiator: string, locale: Locale): string {
  switch (initiator) {
    case "student":
      return m.initiator_student({}, { locale })
    case "staff_self":
      return m.initiator_staff_self({}, { locale })
    case "registrar":
      return m.initiator_registrar({}, { locale })
    default:
      return m.initiator_other({}, { locale })
  }
}

function required(locale: Locale) {
  return v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, m.form_required({}, { locale }))
  )
}
