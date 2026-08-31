import { useState } from "react"

import { Button } from "@/components/button"
import { useSession } from "@/hooks/use-session"
import { ApiError } from "@/lib/api"
import type { ExportFormat, InternalQuery } from "@/lib/api-internal"
import { internalApi } from "@/lib/api-internal"
import { saveBlob } from "@/lib/download"
import { canExport } from "@/lib/roles"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * PDF / Excel export of the current view (TZ.md §4.4).
 *
 * The filters travel in the request body exactly as the page applied them, so
 * the file and the screen describe the same period and the same units. The
 * «Для служебного пользования» line is stated here as well as stamped on the
 * file: the reader is about to put an internal document on a disk, and should
 * be told before the download, not only after opening it.
 *
 * The buttons are hidden for roles the RBAC matrix denies. That is courtesy
 * only - `POST /api/internal/export` refuses them regardless, and the refusal
 * is what the acceptance test asserts.
 */

export interface ExportButtonsProps {
  /** The normalized filter state the page is showing. */
  query: InternalQuery
  locale: Locale
}

export function ExportButtons({ query, locale }: ExportButtonsProps) {
  const session = useSession()
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (session === null || !canExport(session.role)) return null

  const run = (format: ExportFormat) => {
    setError(null)
    setBusy(format)
    void (async () => {
      try {
        const file = await internalApi.export(
          query,
          format,
          locale,
          session.csrf_token
        )
        saveBlob(file.blob, file.filename)
      } catch (cause) {
        setError(
          cause instanceof ApiError
            ? cause.message
            : m.export_error({}, { locale })
        )
      } finally {
        setBusy(null)
      }
    })()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          data-testid="export-pdf"
          disabled={busy !== null}
          onClick={() => {
            run("pdf")
          }}
        >
          {busy === "pdf"
            ? m.export_busy({}, { locale })
            : m.export_pdf({}, { locale })}
        </Button>
        <Button
          variant="outline"
          size="sm"
          data-testid="export-xlsx"
          disabled={busy !== null}
          onClick={() => {
            run("xlsx")
          }}
        >
          {busy === "xlsx"
            ? m.export_busy({}, { locale })
            : m.export_xlsx({}, { locale })}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {m.export_official_use({}, { locale })}
      </p>
      {error === null ? null : (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
