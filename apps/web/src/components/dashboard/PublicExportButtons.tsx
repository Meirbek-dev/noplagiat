import { useState } from "react"

import { Button } from "@/components/button"
import { ApiError, publicApi } from "@/lib/api"
import type { ExportFormat, PublicQuery } from "@/lib/api"
import { saveBlob } from "@/lib/download"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * PDF / Excel export of the public view (TZ.md §4.4).
 *
 * The public counterpart of `internal/ExportButtons`, and deliberately not the
 * same component: there is no session here, so no CSRF token to attach and no
 * role to hide the buttons behind, and - the reason it carries no «Для
 * служебного пользования» line - the file it produces is the same anonymized
 * aggregate the page already shows to anyone.
 *
 * The filters are the normalized query the sections were rendered from, so the
 * file describes exactly the view the reader is looking at.
 */
export function PublicExportButtons({
  query,
  locale,
}: {
  query: PublicQuery
  locale: Locale
}) {
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = (format: ExportFormat) => {
    setError(null)
    setBusy(format)
    void (async () => {
      try {
        const file = await publicApi.export(query, format, locale)
        saveBlob(file.blob, file.filename)
      } catch (cause) {
        setError(
          cause instanceof ApiError && cause.problem?.detail !== undefined
            ? cause.problem.detail
            : m.export_error({}, { locale })
        )
      } finally {
        setBusy(null)
      }
    })()
  }

  return (
    <div
      className="flex flex-col gap-1 sm:items-end"
      aria-label={m.export_title({}, { locale })}
      role="group"
    >
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          data-testid="public-export-pdf"
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
          data-testid="public-export-xlsx"
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
        {m.export_public_hint({}, { locale })}
      </p>
      {error === null ? null : (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
