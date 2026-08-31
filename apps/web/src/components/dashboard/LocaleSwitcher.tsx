import { useLocation } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { cookieMaxAge, cookieName, locales } from "@/paraglide/runtime.js"

/**
 * The surface the switch is painted on. The public `BrandHeader` is the navy
 * brand bar, so its links wear `--brand-navy-foreground` - the ink that stays
 * white because the bar stays navy in both colour modes; the internal and admin
 * shells put the switch in a `bg-background` toolbar, where those same classes
 * would render white-on-white and disappear entirely.
 */
export type LocaleSwitcherTone = "on-brand" | "default"

const TONE_CLASSES: Record<
  LocaleSwitcherTone,
  { current: string; other: string }
> = {
  "on-brand": {
    current:
      "bg-[var(--brand-navy-foreground)]/20 text-[var(--brand-navy-foreground)]",
    other:
      "text-[var(--brand-navy-foreground)]/70 hover:text-[var(--brand-navy-foreground)]",
  },
  default: {
    current: "bg-primary/10 text-primary",
    other: "text-muted-foreground hover:text-foreground",
  },
}

/**
 * RU / KK / EN switch (TZ §7).
 *
 * Each choice is a real link carrying the current filters plus `?lang=…`, so
 * the switch works without JavaScript and SSR renders the target locale
 * directly. The click handler additionally calls paraglide's `setLocale`,
 * which persists the `locale` cookie so the choice survives a later visit with
 * no query parameter (ADR-007: `?lang` → cookie → browser → RU).
 */
export function LocaleSwitcher({
  active,
  className,
  tone = "default",
}: {
  active: Locale
  className?: string
  /** Which surface the switch sits on. Defaults to a light toolbar. */
  tone?: LocaleSwitcherTone
}) {
  const location = useLocation()

  const names: Record<Locale, string> = {
    ru: m.locale_name_ru({}, { locale: active }),
    kk: m.locale_name_kk({}, { locale: active }),
    en: m.locale_name_en({}, { locale: active }),
  }

  const hrefFor = (locale: Locale): string => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(location.search)) {
      if (key === "lang" || value === undefined || value === null) continue
      params.set(key, String(value))
    }
    params.set("lang", locale)
    return `${location.pathname}?${params.toString()}`
  }

  return (
    <nav
      aria-label={m.header_locale_label({}, { locale: active })}
      className={cn("flex items-center gap-1", className)}
    >
      {locales.map((locale) => {
        const current = locale === active
        return (
          <a
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            lang={locale}
            aria-current={current ? "true" : undefined}
            onClick={() => {
              // The link is allowed to navigate: a full request is what makes
              // SSR render the target locale (`?lang=` is the highest-priority
              // strategy). The click only persists the choice, so a later
              // visit without the parameter still lands in it - that is the
              // cookie step of the ADR-007 chain, written with paraglide's own
              // cookie name and lifetime.
              if (typeof document === "undefined") return
              document.cookie = `${cookieName}=${locale};path=/;max-age=${String(cookieMaxAge)};samesite=lax`
            }}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium transition-colors",
              "focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
              current ? TONE_CLASSES[tone].current : TONE_CLASSES[tone].other
            )}
          >
            {names[locale]}
          </a>
        )
      })}
    </nav>
  )
}
