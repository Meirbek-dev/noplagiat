import { Link } from "@tanstack/react-router"

import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The public page's closing block (TZ.md §1.2 «Доступность информации»).
 *
 * A first-time visitor arrives on a wall of numbers with nothing telling them
 * what the numbers are, who they cover, or why some cells say «недостаточно
 * данных» - the header lockup is a title, not an explanation. This states the
 * scope in one paragraph, repeats the two rules that shape every figure on the
 * page (aggregation and the k-anonymity floor), and gives the two navigations
 * the page otherwise lacks: the section anchors and the staff sign-in.
 *
 * It says nothing the application cannot back up: the scope sentence describes
 * what the public endpoints return, and the refresh cadence is the same
 * daily-freshness rule `/readyz` enforces (TZ §3.3.3).
 */

/** Anchors matching the `SectionFrame` ids the dashboard renders. */
const SECTIONS: readonly {
  id: string
  label: (locale: Locale) => string
}[] = [
  { id: "overview", label: (locale) => m.section_overview({}, { locale }) },
  { id: "dynamics", label: (locale) => m.section_dynamics({}, { locale }) },
  { id: "work-types", label: (locale) => m.section_work_types({}, { locale }) },
  { id: "histogram", label: (locale) => m.section_histogram({}, { locale }) },
  { id: "faculties", label: (locale) => m.section_faculties({}, { locale }) },
  { id: "yoy", label: (locale) => m.section_yoy({}, { locale }) },
  { id: "reports", label: (locale) => m.section_reports({}, { locale }) },
]

export function SiteFooter({
  locale,
  kThreshold,
}: {
  locale: Locale
  /** Active k threshold, echoed by the summary response. */
  kThreshold?: number
}) {
  return (
    <footer className="mt-4 border-t bg-muted/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="text-sm font-semibold text-primary">
            {m.footer_about_title({}, { locale })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {m.footer_about_body({}, { locale })}
          </p>
          {kThreshold === undefined ? null : (
            <p className="text-xs text-muted-foreground">
              {m.k_threshold_note({ k: String(kThreshold) }, { locale })}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {m.footer_updated({}, { locale })}
          </p>
        </div>

        <nav
          aria-label={m.footer_sections_title({}, { locale })}
          className="flex flex-col gap-2"
        >
          <h2 className="text-sm font-semibold text-primary">
            {m.footer_sections_title({}, { locale })}
          </h2>
          <ul className="flex flex-col gap-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="rounded text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  {section.label(locale)}
                </a>
              </li>
            ))}
          </ul>
          <Link
            to="/login"
            className="mt-2 rounded text-xs font-medium text-primary underline underline-offset-2 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            {m.footer_staff_link({}, { locale })}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
