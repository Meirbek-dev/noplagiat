import type { Locale } from "../paraglide/runtime.js"

/**
 * Locale-aware number and date formatting (TZ §7 - RU/KK/EN). Every figure the
 * public page prints goes through one of these, so the decimal separator, the
 * thousands grouping and the date order follow the reader's locale rather than
 * the developer's.
 *
 * The chart wrappers do their own axis and tooltip formatting at one decimal
 * (`components/charts/format.ts`); these helpers carry the *page* precision -
 * two decimals on a percentage, so a KPI card can be compared against
 * `fixtures/expected.json` digit for digit.
 */

/**
 * The tag `Intl` is actually asked for - a formatting convention, not the
 * interface language.
 *
 * Chrome ships no CLDR number or date patterns for `kk`: it falls back to the
 * root locale and prints `20,800` and `76.47%`, neither of which is the
 * Kazakhstani convention, while Node's full ICU prints «20 800» and «76,47 %».
 * Formatting through the language tag would therefore also make SSR and
 * hydration disagree on the same page. `ru-KZ` carries exactly the conventions
 * Kazakhstan uses - space grouping, decimal comma, `dd.MM.yyyy` - and resolves
 * identically in both runtimes. Only separators and digit shapes come from it;
 * every word on the page still comes from the paraglide catalogue.
 */
export function intlLocale(locale: Locale): string {
  return locale === "kk" ? "ru-KZ" : locale
}

/** `Intl` instances are expensive to build and cheap to keep. */
const numberFormats = new Map<string, Intl.NumberFormat>()
const dateFormats = new Map<string, Intl.DateTimeFormat>()

function numberFormat(
  locale: Locale,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const tag = intlLocale(locale)
  const key = `${tag}:${JSON.stringify(options)}`
  const cached = numberFormats.get(key)
  if (cached) return cached
  const created = new Intl.NumberFormat(tag, options)
  numberFormats.set(key, created)
  return created
}

function dateFormat(
  locale: Locale,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const tag = intlLocale(locale)
  const key = `${tag}:${JSON.stringify(options)}`
  const cached = dateFormats.get(key)
  if (cached) return cached
  const created = new Intl.DateTimeFormat(tag, options)
  dateFormats.set(key, created)
  return created
}

/** A count: grouped, no fraction. `20800` → «20 800». */
export function formatCount(value: number, locale: Locale): string {
  return numberFormat(locale, { maximumFractionDigits: 0 }).format(value)
}

/** A decimal with a fixed number of fraction digits. */
export function formatDecimal(
  value: number,
  locale: Locale,
  digits = 2
): string {
  return numberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

/**
 * A share in `0..1` as a percentage. `0.2936` → «29,36 %».
 * The percent sign and its spacing come from `Intl`, not from a template.
 */
export function formatShare(value: number, locale: Locale, digits = 2): string {
  return numberFormat(locale, {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

/**
 * A value already expressed in percent (`76.4711` - the originality scale) as
 * a percentage: «76,47 %».
 */
export function formatPercentPoints(
  value: number,
  locale: Locale,
  digits = 2
): string {
  return formatShare(value / 100, locale, digits)
}

/** `YYYY-MM-DD` → a localized calendar date. Unparseable input is echoed. */
export function formatDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso)
  if (!date) return iso
  return dateFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

/** An RFC 3339 instant → a localized date and time. */
export function formatDateTime(iso: string, locale: Locale): string {
  const value = new Date(iso)
  if (Number.isNaN(value.getTime())) return iso
  return dateFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value)
}

function parseIsoDate(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined
  const value = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(value.getTime()) ? undefined : value
}
