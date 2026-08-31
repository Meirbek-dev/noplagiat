import { useState } from "react"

import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as v from "valibot"

import { BrandHeader } from "@/components/dashboard/BrandHeader"
import { Button } from "@/components/button"
import { LabeledInput } from "@/components/forms/fields"
import { ApiError } from "@/lib/api"
import { authApi } from "@/lib/api-internal"
import { authQueries } from "@/lib/queries"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Sign-in (TZ.md §5, ARCHITECTURE §5.1, ADR-017).
 *
 * A login name and a password, both set by an administrator with the
 * `manage-users` CLI on the server host. There is no identity provider to
 * redirect to, no self-service registration and no password-reset link: the
 * operator who created the account is the reset path, and saying so is more
 * useful than a form that cannot help.
 *
 * The server answers every failed attempt the same way, so this page does too -
 * it never says which half was wrong.
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

function LoginPage() {
  const locale = getLocale()
  const { redirect } = Route.useSearch()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <BrandHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-sm flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-primary">
            {m.login_title({}, { locale })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {m.login_hint({}, { locale })}
          </p>
        </div>

        <SignInForm redirectTo={redirect} />
      </main>
    </div>
  )
}

function SignInForm({ redirectTo }: { redirectTo: string | undefined }) {
  const locale = getLocale()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: "", password: "" },
    validators: {
      onSubmit: v.object({
        username: v.pipe(
          v.string(),
          v.trim(),
          v.minLength(1, m.form_required({}, { locale }))
        ),
        password: v.pipe(
          v.string(),
          v.minLength(1, m.form_required({}, { locale }))
        ),
      }),
    },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await authApi.login({
          username: value.username.trim(),
          password: value.password,
        })
        // The session cookie changed: every cached answer belonged to the
        // previous identity and must not be shown to the new one.
        queryClient.clear()
        await queryClient.ensureQueryData(authQueries.me())
        await navigate({ to: redirectTo ?? "/app" })
      } catch (cause) {
        // The server refuses an unknown name and a wrong password with one
        // answer; repeating anything finer here would undo that.
        setError(
          cause instanceof ApiError && cause.status === 429
            ? m.login_throttled({}, { locale })
            : cause instanceof ApiError && cause.status === 401
              ? m.login_failed({}, { locale })
              : cause instanceof Error
                ? cause.message
                : m.form_error({}, { locale })
        )
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-4 rounded-lg border p-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field name="username">
        {(field) => (
          <LabeledInput
            id={field.name}
            label={m.login_username({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={field.state.meta.errors}
            autoComplete="username"
          />
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <LabeledInput
            id={field.name}
            type="password"
            label={m.login_password({}, { locale })}
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={field.state.meta.errors}
            autoComplete="current-password"
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? m.form_saving({}, { locale })
              : m.login_submit({}, { locale })}
          </Button>
        )}
      </form.Subscribe>

      {error === null ? null : (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        {m.login_no_account({}, { locale })}
      </p>
    </form>
  )
}
