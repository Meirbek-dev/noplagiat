import * as v from "valibot"

/**
 * Shared dashboard filter state (TZ.md §4.3). Every dashboard route validates
 * its search params against this schema - filters are bookmarkable, the URL
 * round-trips, and the export endpoints serialize the same object.
 */

/** Quick period picks (TZ §4.3; boundaries per PLAN.md D8). */
export const PERIOD_PRESETS = [
  "month",
  "semester",
  "year",
  "3y",
  "5y",
  "custom",
] as const

export type PeriodPreset = (typeof PERIOD_PRESETS)[number]

/** Check statuses (TZ §3.1). */
export const CHECK_STATUSES = [
  "accepted",
  "needs_revision",
  "rejected",
  "recheck",
] as const

export type CheckStatus = (typeof CHECK_STATUSES)[number]

/** Sections the embed widget can render on its own (TZ §8). */
export const EMBED_SECTIONS = [
  "summary",
  "dynamics",
  "work-types",
  "histogram",
  "yoy",
  "faculties",
] as const

export type EmbedSection = (typeof EMBED_SECTIONS)[number]

export const UI_LOCALES = ["ru", "kk", "en"] as const

/**
 * The **public** filter set (ADR-016 §3).
 *
 * `status` is deliberately absent. The public contour publishes sums over
 * `(month, faculty, work type)` cube cells of at least `k` checks, and adding
 * status to that key would push ~5 % of all rows below the threshold - so the
 * server removed the parameter and now answers it with a `422`. `department`
 * and `program` are absent for the older reason: TZ §4.2 §4 puts unit
 * drill-down on the internal contour.
 *
 * `from`/`to` are still day-precise here because that is what a date picker
 * produces; the server snaps them to whole months and echoes the range it
 * actually answered, which the filter bar displays.
 */
export const publicSearchSchema = v.object({
  period: v.optional(v.picklist(PERIOD_PRESETS), "year"),
  from: v.optional(v.pipe(v.string(), v.isoDate())),
  to: v.optional(v.pipe(v.string(), v.isoDate())),
  faculty: v.optional(v.string()),
  workType: v.optional(v.string()),
  /**
   * Locale override, read by paraglide's `custom-lang-param` strategy
   * (`src/lib/locale.ts`). Declared here so that `validateSearch` keeps it in
   * the URL instead of dropping it on the next navigation.
   */
  lang: v.optional(v.picklist(UI_LOCALES)),
})

export type PublicSearch = v.InferOutput<typeof publicSearchSchema>

/**
 * The **internal** filter set: the public dimensions plus the three TZ §4.3
 * grants only to the internal contour (кафедра, ОП, статус).
 *
 * Every field is optional, so a [`PublicSearch`] value is assignable to this
 * type - which is what lets the two contours share `FilterBar`'s props,
 * `mergeFilters` and `hasActiveFilters` without a second copy of each.
 */
export const dashboardSearchSchema = v.object({
  ...publicSearchSchema.entries,
  department: v.optional(v.string()),
  program: v.optional(v.string()),
  status: v.optional(v.picklist(CHECK_STATUSES)),
})

export type DashboardSearch = v.InferOutput<typeof dashboardSearchSchema>

/** The embed route takes the public filters plus the section to render. */
export const embedSearchSchema = v.object({
  ...publicSearchSchema.entries,
  section: v.optional(v.picklist(EMBED_SECTIONS), "summary"),
})

export type EmbedSearch = v.InferOutput<typeof embedSearchSchema>
