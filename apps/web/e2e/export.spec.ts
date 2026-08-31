import { Buffer } from "node:buffer"
import { readFileSync } from "node:fs"

import { expect, test } from "@playwright/test"

import { IDENTITIES, goto, signIn } from "./support"

/**
 * TZ §10.3 - "экспорт в PDF и Excel формирует корректные файлы с учётом
 * применённых фильтров" (PLAN.md W3.5 gate: "e2e download-and-parse").
 *
 * The file's *contents* are gated by the Rust snapshot tests and the
 * ФИО-shaped-string regex guard. What is asserted here is the part only a
 * browser can show: the button really produces a download, and the bytes that
 * arrive are a PDF and a real XLSX package rather than an error page saved
 * under a hopeful filename.
 */

/** `%PDF-` - the header every PDF starts with. */
const PDF_MAGIC = "%PDF-"

/** XLSX is a ZIP; `PK\x03\x04` is the local file header. */
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04])

/**
 * Every OOXML package names this part first, uncompressed in the local file
 * header, so finding it proves a real workbook rather than any old zip.
 */
const OOXML_PART = "[Content_Types].xml"

test.describe("export", () => {
  test("a dean downloads the current view as PDF", async ({ page }) => {
    await signIn(page, IDENTITIES.deanFac03)
    await goto(page, "/app?period=5y")

    const button = page.getByTestId("export-pdf")
    await expect(button).toBeVisible()

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      button.click(),
    ])

    const file = await download.path()
    expect(file, "downloaded PDF path").toBeTruthy()
    const bytes = readFileSync(file)

    expect(bytes.subarray(0, PDF_MAGIC.length).toString("latin1")).toBe(
      PDF_MAGIC
    )
    expect(bytes.byteLength).toBeGreaterThan(10_000)
    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  })

  test("a dean downloads the current view as XLSX", async ({ page }) => {
    await signIn(page, IDENTITIES.deanFac03)
    await goto(page, "/app?period=5y")

    const button = page.getByTestId("export-xlsx")
    await expect(button).toBeVisible()

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      button.click(),
    ])

    const file = await download.path()
    expect(file, "downloaded XLSX path").toBeTruthy()
    const bytes = readFileSync(file)

    expect(bytes.subarray(0, 4).equals(ZIP_MAGIC), "zip local header").toBe(
      true
    )
    expect(bytes.includes(Buffer.from(OOXML_PART, "latin1"))).toBe(true)
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
  })

  test("the public export needs no session", async ({ page }) => {
    // No sign-in: TZ §4.1 puts the anonymized contour in front of everyone,
    // and `POST /api/public/export` carries no audit row because there is no
    // identity to record.
    await goto(page, "/?period=year")

    for (const format of ["pdf", "xlsx"] as const) {
      const response = await page.request.post(
        `/api/public/export?format=${format}&locale=ru`,
        { data: { period: "year" } }
      )
      expect(
        response.status(),
        `public export ${format}: ${await response.text().catch(() => "")}`
      ).toBe(200)

      const bytes = Buffer.from(await response.body())
      if (format === "pdf") {
        expect(bytes.subarray(0, PDF_MAGIC.length).toString("latin1")).toBe(
          PDF_MAGIC
        )
        expect(bytes.byteLength).toBeGreaterThan(10_000)
      } else {
        expect(bytes.subarray(0, 4).equals(ZIP_MAGIC)).toBe(true)
        expect(bytes.includes(Buffer.from(OOXML_PART, "latin1"))).toBe(true)
      }
    }
  })
})
