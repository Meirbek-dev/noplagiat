import {
  defineCustomClientStrategy,
  defineCustomServerStrategy,
  isLocale,
} from "@/paraglide/runtime.js"

/**
 * Locale resolution (ARCHITECTURE.md §5.4): a `?lang=` query override wins over
 * the persisted `locale` cookie, which wins over the browser's preferred
 * language, which falls back to RU (TZ.md §7).
 *
 * The cookie and preferred-language steps are built-in paraglide strategies;
 * the override below is registered as `custom-lang-param` and must be imported
 * on both the server entry and the router so it exists before the first
 * locale lookup on either side.
 */
export const LANG_PARAM = "lang"

const STRATEGY = "custom-lang-param"

function localeFromSearch(search: string): string | undefined {
  const value = new URLSearchParams(search).get(LANG_PARAM)
  return value !== null && isLocale(value) ? value : undefined
}

defineCustomServerStrategy(STRATEGY, {
  getLocale: (request) =>
    request === undefined
      ? undefined
      : localeFromSearch(new URL(request.url).search),
})

defineCustomClientStrategy(STRATEGY, {
  getLocale: () =>
    typeof window === "undefined"
      ? undefined
      : localeFromSearch(window.location.search),
  setLocale: (locale) => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    // Only an explicit override is rewritten - otherwise the cookie strategy
    // carries the choice and the URL stays clean.
    if (url.searchParams.has(LANG_PARAM)) {
      url.searchParams.set(LANG_PARAM, locale)
      window.history.replaceState(null, "", url)
    }
  },
})
