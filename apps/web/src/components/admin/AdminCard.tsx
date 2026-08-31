import type { ReactNode } from "react"

import { Badge } from "@/components/badge"
import { toast } from "@/components/toast"
import { ApiError } from "@/lib/api"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The card every admin area renders its lists and forms inside, plus the two
 * toasts a write can produce.
 *
 * Reporting a refusal verbatim matters here: `422` bodies carry per-field
 * detail (`Problem.errors`), and an administrator fixing a bad pattern needs
 * the server's reason, not «что-то пошло не так».
 */

export function AdminCard({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  /** Rendered at the top right - the area's primary action. */
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="@container flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-primary">{title}</h2>
          {description === undefined ? null : (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </header>
      {children}
    </section>
  )
}

/**
 * An ingest batch's state, as a word rather than the wire enum.
 *
 * Shared by the import journal and the overview card, which used to print the
 * raw `succeeded` - an untranslated English token on the first screen of the
 * admin area, next to a table that spelled the same state «Успешно».
 */
export function BatchStatusBadge({
  status,
  locale,
}: {
  status: string
  locale: Locale
}) {
  return (
    <Badge
      variant={
        status === "failed"
          ? "destructive"
          : status === "succeeded"
            ? "secondary"
            : "outline"
      }
    >
      {status === "succeeded"
        ? m.batch_status_succeeded({}, { locale })
        : status === "failed"
          ? m.batch_status_failed({}, { locale })
          : m.batch_status_running({}, { locale })}
    </Badge>
  )
}

export function notifySaved(locale: Locale, description?: string): void {
  toast.add({
    title: m.form_saved({}, { locale }),
    description,
    type: "success",
  })
}

export function notifyError(error: unknown, locale: Locale): void {
  toast.add({
    title: m.form_error({}, { locale }),
    description: describeWriteError(error, locale),
    type: "error",
    priority: "high",
  })
}

/** A `Problem` with field errors reads as «поле: причина», one per line. */
export function describeWriteError(error: unknown, locale: Locale): string {
  if (error instanceof ApiError) {
    const fields = error.problem?.errors ?? []
    if (fields.length > 0) {
      return fields
        .map((field) => `${field.field}: ${field.message}`)
        .join("; ")
    }
    return error.message
  }
  return error instanceof Error ? error.message : m.form_error({}, { locale })
}
