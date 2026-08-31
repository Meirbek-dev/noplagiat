import { Link } from "@tanstack/react-router"

import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

import { BrandLockup } from "./BrandMark"
import { LocaleSwitcher } from "./LocaleSwitcher"

/**
 * Brand header (TZ §8): the Toraighyrov University lockup, the page title and
 * the language switch on the navy brand bar.
 *
 * The lockup replaced the text stand-in when the brand materials arrived
 * (D10) - it renders the organization itself, so the wordmark is no longer
 * repeated in text beside it and `BrandLockup` carries that string as its alt.
 *
 * **Why `--brand-navy` and not `--primary` here.** They are the same colour in
 * light mode, and this bar used to take the shadcn pair. But the supplied
 * lockup is a *reverse* mark: it is white, and it is drawn for one background.
 * `--primary` lightens into a mid-tone in dark mode, which would leave the
 * white lockup at ~2.4:1 on the bar it sits on - so the masthead pins the brand
 * field instead and paints its ink with `--brand-navy-foreground`, the one
 * token that does not flip. Everything below the bar still follows the mode.
 *
 * Layout is responsive desktop → tablet: lockup, title and the language switch
 * sit on one row on wide viewports; the title drops under the lockup below
 * 40rem and the switch below 48rem.
 */
export function BrandHeader({ locale }: { locale: Locale }) {
  return (
    <header className="bg-[var(--brand-navy)] text-[var(--brand-navy-foreground)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        {/* The lockup is the way home from `/login` and `/app/request-access`,
            which otherwise offer no route back to the public dashboard. */}
        <Link
          to="/"
          className="flex flex-col items-start gap-2 rounded focus-visible:ring-3 focus-visible:ring-[var(--brand-navy-foreground)]/40 focus-visible:outline-none sm:flex-row sm:items-center sm:gap-4"
        >
          <BrandLockup locale={locale} />
          {/* Divider only where the two blocks are side by side; stacked, the
              gap already separates them. */}
          <span
            aria-hidden="true"
            className="hidden w-px self-stretch bg-[var(--brand-navy-foreground)]/25 sm:block"
          />
          <span className="flex flex-col gap-0.5">
            <h1 className="text-xl leading-tight font-semibold md:text-2xl">
              {m.app_title({}, { locale })}
            </h1>
            <p className="text-sm text-[var(--brand-navy-foreground)]/80">
              {m.public_contour_title({}, { locale })}
            </p>
          </span>
        </Link>
        <LocaleSwitcher active={locale} tone="on-brand" />
      </div>
      {/* TZ §8 names navy *and* orange; the orange lives in the chart palette,
          and this rule is the one place the brand accent appears in the
          chrome, so the pair reads as a lockup rather than a single colour. */}
      <div aria-hidden="true" className="h-1 bg-[var(--brand-orange)]" />
    </header>
  )
}
