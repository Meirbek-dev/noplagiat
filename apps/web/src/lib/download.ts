/**
 * `attachment; filename="noplagiat-2025-09-01_2026-08-31.pdf"` → the name.
 *
 * Both export paths - the internal one and the public one - read the name the
 * server chose rather than inventing one, so the file on disk matches the
 * audit row and the report header.
 */
export function filenameFromDisposition(
  header: string | null
): string | undefined {
  if (header === null) return undefined
  const quoted = /filename="([^"]+)"/.exec(header)
  if (quoted?.[1] !== undefined) return quoted[1]
  const bare = /filename=([^;]+)/.exec(header)
  return bare?.[1]?.trim()
}

/**
 * Hand a fetched file to the browser.
 *
 * The export endpoints are `POST`s that need the CSRF header, so the file
 * cannot be a plain link - it arrives as a `Blob` and is saved here. The object
 * URL is revoked on the next frame: revoking it synchronously races the
 * download in WebKit, and never revoking it leaks the buffer for the life of
 * the document.
 */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.rel = "noopener"
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 0)
}
