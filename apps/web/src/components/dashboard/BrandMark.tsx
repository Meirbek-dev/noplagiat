import { cn } from "@/lib/utils"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The Toraighyrov University marks (TZ §8: «логотип … в шапке публичной
 * страницы и внутренней панели»).
 *
 * The brand materials arrived on 31.08.2026 and closed D10, so the header no
 * longer draws the text lockup that stood in for them. Both marks are served
 * from `public/brand/`, derived from the masters in `apps/web/brand/` - see the
 * README there for the sizes and how they were cut.
 *
 * The emblem ships in both inks because the sidebar it sits in *darkens* in
 * dark mode, so one `<img>` per mode is what keeps it legible - swapped by the
 * `dark` variant rather than by a filter or a mask, either of which would shift
 * the brand colour or drop out of a printed page. Both are `aria-hidden`: the
 * wordmark stands beside them in text.
 *
 * The lockup needs no such pair. Its bar pins `--brand-navy` in both modes
 * (see `BrandHeader`), so the reverse mark is always the right one - which also
 * keeps the public dashboard from preloading a second copy it would never
 * paint, on the one page carrying an LCP budget (D9).
 */

/** Intrinsic pixels of `tou-lockup*.png` - reserved so the mark cannot shift. */
const LOCKUP = { width: 484, height: 160 }

/** Intrinsic pixels of `tou-emblem*.png`. */
const EMBLEM = { width: 121, height: 192 }

/**
 * The full lockup - emblem plus wordmark - for the navy public masthead.
 *
 * The image *is* the words «Toraighyrov University», so it takes the same
 * string the text lockup used as its alt text and the header no longer repeats
 * it below.
 */
export function BrandLockup({
  locale,
  className,
}: {
  locale: Locale
  className?: string
}) {
  return (
    <img
      {...LOCKUP}
      src="/brand/tou-lockup-white.png"
      alt={m.brand_lockup({}, { locale })}
      // The masthead is the first thing painted and the largest element in the
      // viewport until the KPI row arrives, so it is a genuine LCP candidate
      // and must not queue behind the section requests (D9 budget).
      fetchPriority="high"
      className={cn("h-9 w-auto sm:h-10 md:h-12", className)}
    />
  )
}

/**
 * The emblem alone, for the internal and admin sidebars, where the wordmark
 * already stands next to it in text. Decorative by construction: labelling it
 * would make a screen reader read the organization twice in one header.
 */
export function BrandEmblem({ className }: { className?: string }) {
  const shared = cn("h-7 w-auto", className)
  return (
    <>
      <img
        {...EMBLEM}
        src="/brand/tou-emblem.png"
        alt=""
        aria-hidden="true"
        className={cn(shared, "dark:hidden")}
      />
      <img
        {...EMBLEM}
        src="/brand/tou-emblem-white.png"
        alt=""
        aria-hidden="true"
        className={cn(shared, "hidden dark:block")}
      />
    </>
  )
}
