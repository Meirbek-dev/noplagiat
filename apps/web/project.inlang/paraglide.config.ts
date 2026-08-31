import { defineConfig } from "@inlang/paraglide-js"

/**
 * Single source of truth for the paraglide compiler - read by both the Vite
 * plugin (`vp dev`/`vp build`/`vp test`) and the CLI (`vp run i18n`), so the
 * two can never drift.
 *
 * Locale resolution (TZ.md §7, ARCHITECTURE.md §5.4): `?lang=` override →
 * persisted cookie → browser preference → RU fallback. The override is
 * registered as `custom-lang-param` in `src/lib/locale.ts`.
 */
export default defineConfig({
  outdir: "./src/paraglide",
  strategy: ["custom-lang-param", "cookie", "preferredLanguage", "baseLocale"],
  cookieName: "locale",
  // `src/paraglide/` is committed like every other generated artefact
  // (AGENTS.md invariant #5), so `vp check` works on a fresh clone.
  emitGitIgnore: false,
  emitTsDeclarations: true,
})
