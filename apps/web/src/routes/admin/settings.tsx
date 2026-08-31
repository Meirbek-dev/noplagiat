import { useForm } from "@tanstack/react-form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import * as v from "valibot"

import type { SettingDto, SettingsUpdate } from "@/api/types.gen"
import { vRoleMapping } from "@/api/valibot.gen"
import {
  AdminCard,
  notifyError,
  notifySaved,
} from "@/components/admin/AdminCard"
import { Button } from "@/components/button"
import {
  LabeledCheckbox,
  LabeledInput,
  LabeledTextarea,
} from "@/components/forms/fields"
import { useCsrfToken } from "@/hooks/use-session"
import { adminApi } from "@/lib/api-admin"
import { formatDateTime } from "@/lib/format"
import { adminQueries } from "@/lib/queries"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * System settings (TZ.md §4.6, §6.2).
 *
 * `PUT /api/admin/settings` is a *partial* write, so only the fields the
 * administrator actually changed are sent - an unchanged threshold does not
 * become an `admin_change` row in the audit journal, and the compare is what
 * decides, not the form being dirty.
 *
 * The two structured settings are edited as JSON and validated here against a
 * Valibot mirror of the shape the server accepts, so a typo is caught before it
 * becomes a `422` - the server still validates, this only shortens the loop.
 */
export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_settings()) }] }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(adminQueries.settings())
  },
  component: SettingsPage,
})

/** Mirror of the `status_rules` document (`domain::settings::StatusRules`). */
const statusRulesSchema = v.object({
  default: v.string(),
  escalate_when: v.string(),
  rules: v.array(v.object({ status: v.string(), when: v.string() })),
})

const roleMappingsSchema = v.array(vRoleMapping)

const semesterSchema = v.pipe(
  v.string(),
  v.trim(),
  v.regex(/^\d{2}-\d{2}$/, "MM-DD")
)

type SettingsFormValues = {
  k_threshold: string
  originality_threshold: string
  histogram_buckets: string
  autumn_start: string
  spring_start: string
  exclude_deleted: boolean
  public_snapshot_quarter: string
  status_rules: string
  role_mappings: string
}

function SettingsPage() {
  const locale = getLocale()
  const settings = useQuery(adminQueries.settings())
  const items = settings.data?.items ?? []

  if (settings.isPending) {
    return (
      <p className="text-sm text-muted-foreground">
        {m.section_loading({}, { locale })}
      </p>
    )
  }

  return (
    <SettingsForm
      key={items.map((item) => `${item.key}:${item.updated_at}`).join("|")}
      items={items}
      locale={locale}
    />
  )
}

function SettingsForm({
  items,
  locale,
}: {
  items: readonly SettingDto[]
  locale: Locale
}) {
  const csrf = useCsrfToken()
  const queryClient = useQueryClient()

  const boundaries = readObject(items, "semester_boundaries")
  const initial: SettingsFormValues = {
    k_threshold: String(readNumber(items, "k_threshold") ?? 5),
    originality_threshold: String(
      readNumber(items, "originality_threshold") ?? 70
    ),
    histogram_buckets: formatBuckets(readValue(items, "histogram_buckets")),
    autumn_start: readString(boundaries, "autumn_start") ?? "09-01",
    spring_start: readString(boundaries, "spring_start") ?? "02-01",
    exclude_deleted: readValue(items, "exclude_deleted") === true,
    public_snapshot_quarter:
      readStringValue(items, "public_snapshot_quarter") ?? "auto",
    status_rules: toJson(readValue(items, "status_rules")),
    role_mappings: toJson(readValue(items, "role_mappings")),
  }

  const form = useForm({
    defaultValues: initial,
    validators: {
      onSubmit: v.object({
        k_threshold: positiveInteger(locale, 1),
        originality_threshold: positiveInteger(locale, 0),
        histogram_buckets: v.pipe(
          v.string(),
          v.check(
            (value) => parseBuckets(value) !== null,
            m.setting_histogram_buckets_invalid({}, { locale })
          )
        ),
        autumn_start: semesterSchema,
        spring_start: semesterSchema,
        exclude_deleted: v.boolean(),
        public_snapshot_quarter: v.pipe(v.string(), v.trim()),
        status_rules: jsonSchema(statusRulesSchema, locale),
        role_mappings: jsonSchema(roleMappingsSchema, locale),
      }),
    },
    onSubmit: async ({ value }) => {
      const update: SettingsUpdate = {}
      const put = (key: string, next: unknown) => {
        if (JSON.stringify(next) !== JSON.stringify(readValue(items, key))) {
          update[key] = next
        }
      }

      put("k_threshold", Number(value.k_threshold))
      put("originality_threshold", Number(value.originality_threshold))
      put("histogram_buckets", parseBuckets(value.histogram_buckets) ?? [])
      put("semester_boundaries", {
        autumn_start: value.autumn_start.trim(),
        spring_start: value.spring_start.trim(),
      })
      put("exclude_deleted", value.exclude_deleted)
      put("public_snapshot_quarter", value.public_snapshot_quarter.trim())
      put("status_rules", JSON.parse(value.status_rules) as unknown)
      put("role_mappings", JSON.parse(value.role_mappings) as unknown)

      if (Object.keys(update).length === 0) {
        notifySaved(locale, m.settings_unchanged({}, { locale }))
        return
      }

      try {
        await adminApi.updateSettings(update, csrf ?? "")
        // The write invalidates the API's response cache immediately, so the
        // public contour shows a new k on its next request rather than after
        // the TTL - refetch everything the change could have moved.
        notifySaved(locale, m.settings_saved_hint({}, { locale }))
        await queryClient.invalidateQueries()
      } catch (error) {
        notifyError(error, locale)
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <AdminCard
        title={m.admin_settings({}, { locale })}
        description={m.admin_settings_hint({}, { locale })}
      >
        <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
          <form.Field name="k_threshold">
            {(field) => (
              <LabeledInput
                id={field.name}
                label={m.setting_k_threshold({}, { locale })}
                description={m.setting_k_threshold_hint({}, { locale })}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={field.state.meta.errors}
                type="number"
              />
            )}
          </form.Field>

          <form.Field name="originality_threshold">
            {(field) => (
              <LabeledInput
                id={field.name}
                label={m.setting_originality_threshold({}, { locale })}
                description={m.setting_originality_threshold_hint(
                  {},
                  { locale }
                )}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={field.state.meta.errors}
                type="number"
              />
            )}
          </form.Field>

          <form.Field name="histogram_buckets">
            {(field) => (
              <LabeledInput
                id={field.name}
                label={m.setting_histogram_buckets({}, { locale })}
                description={m.setting_histogram_buckets_hint({}, { locale })}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>

          <form.Field name="public_snapshot_quarter">
            {(field) => (
              <LabeledInput
                id={field.name}
                label={m.setting_snapshot_quarter({}, { locale })}
                description={m.setting_snapshot_quarter_hint({}, { locale })}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>

          <form.Field name="autumn_start">
            {(field) => (
              <LabeledInput
                id={field.name}
                label={m.setting_autumn_start({}, { locale })}
                description={m.setting_semester_hint({}, { locale })}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>

          <form.Field name="spring_start">
            {(field) => (
              <LabeledInput
                id={field.name}
                label={m.setting_spring_start({}, { locale })}
                description={m.setting_semester_hint({}, { locale })}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>

          <form.Field name="exclude_deleted">
            {(field) => (
              <LabeledCheckbox
                id={field.name}
                label={m.setting_exclude_deleted({}, { locale })}
                description={m.setting_exclude_deleted_hint({}, { locale })}
                checked={field.state.value}
                onChange={field.handleChange}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>
        </div>
      </AdminCard>

      <AdminCard
        title={m.setting_status_rules({}, { locale })}
        description={m.setting_status_rules_hint({}, { locale })}
      >
        <form.Field name="status_rules">
          {(field) => (
            <LabeledTextarea
              id={field.name}
              label={m.setting_status_rules({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
      </AdminCard>

      <AdminCard
        title={m.setting_role_mappings({}, { locale })}
        description={m.setting_role_mappings_hint({}, { locale })}
      >
        <form.Field name="role_mappings">
          {(field) => (
            <LabeledTextarea
              id={field.name}
              label={m.setting_role_mappings({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
      </AdminCard>

      <div className="flex flex-wrap items-center gap-3">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting || csrf === undefined}>
              {isSubmitting
                ? m.form_saving({}, { locale })
                : m.settings_save({}, { locale })}
            </Button>
          )}
        </form.Subscribe>
        <LastWritten items={items} locale={locale} />
      </div>
    </form>
  )
}

function LastWritten({
  items,
  locale,
}: {
  items: readonly SettingDto[]
  locale: Locale
}) {
  const written = [...items]
    .filter((item) => item.updated_at !== "")
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at))
  if (written.length === 0) return null
  const newest = written[0]
  return (
    <span className="text-xs text-muted-foreground">
      {m.settings_updated(
        {
          date: formatDateTime(newest.updated_at, locale),
          who:
            newest.updated_by ?? m.settings_updated_by_system({}, { locale }),
        },
        { locale }
      )}
    </span>
  )
}

/* ── Reading `SettingDto.value`, which the contract types as `unknown` ─────── */

function readValue(items: readonly SettingDto[], key: string): unknown {
  return items.find((item) => item.key === key)?.value
}

function readNumber(
  items: readonly SettingDto[],
  key: string
): number | undefined {
  const value = readValue(items, key)
  return typeof value === "number" ? value : undefined
}

function readStringValue(
  items: readonly SettingDto[],
  key: string
): string | undefined {
  const value = readValue(items, key)
  return typeof value === "string" ? value : undefined
}

function readObject(
  items: readonly SettingDto[],
  key: string
): Record<string, unknown> {
  const value = readValue(items, key)
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function readString(
  source: Record<string, unknown>,
  key: string
): string | undefined {
  const value = source[key]
  return typeof value === "string" ? value : undefined
}

function toJson(value: unknown): string {
  return value === undefined ? "" : JSON.stringify(value, null, 2)
}

/** `[50, 70, 85, 95]` → the `50, 70, 85, 95` the text field shows. */
function formatBuckets(value: unknown): string {
  return Array.isArray(value)
    ? value.filter((entry) => typeof entry === "number").join(", ")
    : ""
}

/** `50, 70, 85, 95` → `[50, 70, 85, 95]`; anything else is `null`. */
function parseBuckets(input: string): number[] | null {
  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "")
  if (parts.length === 0) return null
  const numbers = parts.map(Number)
  if (
    numbers.some((value) => !Number.isFinite(value) || value < 0 || value > 100)
  )
    return null
  const ascending = numbers.every(
    (value, index) => index === 0 || value > (numbers[index - 1] ?? 0)
  )
  return ascending ? numbers : null
}

function positiveInteger(locale: Locale, min: number) {
  return v.pipe(
    v.string(),
    v.trim(),
    v.check(
      (value) => {
        const parsed = Number(value)
        return Number.isInteger(parsed) && parsed >= min
      },
      m.form_invalid_number({}, { locale })
    )
  )
}

/** A textarea holding JSON that must also satisfy `schema`. */
function jsonSchema(schema: v.GenericSchema, locale: Locale) {
  return v.pipe(
    v.string(),
    v.check(
      (value) => {
        let parsed: unknown
        try {
          parsed = JSON.parse(value)
        } catch {
          return false
        }
        return v.safeParse(schema, parsed).success
      },
      m.form_invalid_json({}, { locale })
    )
  )
}
