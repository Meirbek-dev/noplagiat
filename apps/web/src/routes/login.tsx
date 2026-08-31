import { useState } from "react"

import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as v from "valibot"

import { BrandHeader } from "@/components/dashboard/BrandHeader"
import { Button } from "@/components/button"
import { LabeledInput, LabeledSelect } from "@/components/forms/fields"
import { ApiError, apiBaseUrl } from "@/lib/api"
import { authApi } from "@/lib/api-internal"
import { authQueries } from "@/lib/queries"
import { ROLE_KINDS, roleLabel } from "@/lib/roles"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Sign-in (TZ.md §5, ARCHITECTURE §5.1).
 *
 * Two paths, and only one of them exists on a given deployment. The portal SSO
 * button is a *navigation*, not a fetch: `/api/auth/login` answers `303` to the
 * identity provider and sets the PKCE flow cookie on the way, so the browser
 * has to follow it itself.
 *
 * The development form below it mints a session without an identity provider
 * and exists only where the API runs `APP_AUTH_MODE=dev`; it is labelled as
 * such, and the endpoint answers `404` anywhere else.
 */

const searchSchema = v.object({
  /** Where to return after a successful sign-in. */
  redirect: v.optional(v.string()),
})

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: pageTitle(m.login_title()) }] }),
  validateSearch: searchSchema,
  component: LoginPage,
})

const DEV_AUTH_OFFERED =
  import.meta.env.DEV || import.meta.env.VITE_AUTH_MODE === "dev"

function LoginPage() {
  const locale = getLocale()
  const { redirect } = Route.useSearch()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <BrandHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-primary">
            {m.login_title({}, { locale })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {m.login_hint({}, { locale })}
          </p>
        </div>

        <a
          href={`${apiBaseUrl()}/api/auth/login`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          {m.login_sso_button({}, { locale })}
        </a>

        {DEV_AUTH_OFFERED ? <DevLoginForm redirectTo={redirect} /> : null}
      </main>
    </div>
  )
}

function DevLoginForm({ redirectTo }: { redirectTo: string | undefined }) {
  const locale = getLocale()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

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
        role: v.string(),
        scope_faculty_code: v.string(),
        scope_department_code: v.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await authApi.devLogin({
          sso_subject: value.sso_subject.trim(),
          role: value.role === "" ? null : value.role,
          scope_faculty_code:
            value.scope_faculty_code.trim() === ""
              ? null
              : value.scope_faculty_code.trim(),
          scope_department_code:
            value.scope_department_code.trim() === ""
              ? null
              : value.scope_department_code.trim(),
        })
        // The session cookie changed: every cached answer belonged to the
        // previous identity and must not be shown to the new one.
        queryClient.clear()
        await queryClient.ensureQueryData(authQueries.me())
        await navigate({ to: redirectTo ?? "/app" })
      } catch (cause) {
        setError(
          cause instanceof ApiError && cause.status === 404
            ? m.login_dev_unavailable({}, { locale })
            : cause instanceof Error
              ? cause.message
              : m.form_error({}, { locale })
        )
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border border-dashed p-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold">
          {m.login_dev_title({}, { locale })}
        </h2>
        <p className="text-xs text-muted-foreground">
          {m.login_dev_warning({}, { locale })}
        </p>
      </div>

      <form.Field name="sso_subject">
        {(field) => (
          <LabeledInput
            id={field.name}
            label={m.login_subject({}, { locale })}
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
            label={m.login_role({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            errors={field.state.meta.errors}
            placeholder={m.login_role_none({}, { locale })}
            options={ROLE_KINDS.map((role) => ({
              value: role,
              label: roleLabel(role, locale),
            }))}
          />
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <form.Field name="scope_faculty_code">
          {(field) => (
            <LabeledInput
              id={field.name}
              label={m.login_scope_faculty({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              placeholder="FAC03"
            />
          )}
        </form.Field>
        <form.Field name="scope_department_code">
          {(field) => (
            <LabeledInput
              id={field.name}
              label={m.login_scope_department({}, { locale })}
              value={field.state.value}
              onChange={field.handleChange}
              errors={field.state.meta.errors}
              placeholder="DEP11"
            />
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting} className="self-start">
            {isSubmitting
              ? m.form_saving({}, { locale })
              : m.login_dev_submit({}, { locale })}
          </Button>
        )}
      </form.Subscribe>

      {error === null ? null : (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
