import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vite-plus/test"

import { baseLocale, locales } from "../paraglide/runtime.js"

/**
 * Paraglide falls back to the base locale for a missing message instead of
 * failing the build, so key parity is asserted here (AGENTS.md, TS
 * conventions: all locales ship in the same commit, with real KK/RU text).
 */
function messages(locale: string): Record<string, string> {
  const path = fileURLToPath(
    new URL(`../../messages/${locale}.json`, import.meta.url)
  )
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"))
  const entries = Object.entries(parsed as Record<string, unknown>).filter(
    ([key]) => key !== "$schema"
  )
  return Object.fromEntries(entries) as Record<string, string>
}

const placeholders = (value: string): string[] =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort()

describe("message catalogue", () => {
  it("ships RU and KK, with RU as the fallback (TZ.md §7)", () => {
    expect([...locales].sort()).toEqual(["en", "kk", "ru"])
    expect(baseLocale).toBe("ru")
  })

  it("has the same keys in every locale", () => {
    const base = Object.keys(messages(baseLocale)).sort()
    expect(base.length).toBeGreaterThan(0)
    for (const locale of locales) {
      expect(Object.keys(messages(locale)).sort(), locale).toEqual(base)
    }
  })

  it("has no empty translations", () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(messages(locale))) {
        expect(value.trim(), `${locale}.${key}`).not.toBe("")
      }
    }
  })

  it("keeps placeholders identical across locales", () => {
    const base = messages(baseLocale)
    for (const locale of locales) {
      for (const [key, value] of Object.entries(messages(locale))) {
        expect(placeholders(value), `${locale}.${key}`).toEqual(
          placeholders(base[key] ?? "")
        )
      }
    }
  })
})
