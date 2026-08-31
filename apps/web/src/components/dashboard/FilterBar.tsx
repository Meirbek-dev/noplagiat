import type { ReactNode } from "react"
import { useId } from "react"

import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import type { BreakdownItemDto } from "@/api/types.gen"
import { localizedName } from "@/lib/adapters"
import { hasActiveFilters } from "@/lib/filters"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { resolvePreset } from "@/lib/period"
import type { CheckStatus, DashboardSearch, PeriodPreset } from "@/lib/search"
import { CHECK_STATUSES, PERIOD_PRESETS } from "@/lib/search"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The filter bar (TZ §4.3). Every control writes straight into the URL search
 * params - nothing is held in component state - so a filtered view is
 * bookmarkable, shareable, and rendered by SSR exactly as the link describes.
 */

export interface FilterBarProps {
  search: DashboardSearch
  /** Patch applied to the current search params; `undefined` clears a key. */
  onChange: (patch: Partial<DashboardSearch>) => void
  faculties: readonly BreakdownItemDto[]
  workTypes: readonly BreakdownItemDto[]
  /** The range the server actually queried, echoed back in the response. */
  appliedPeriod?: { from: string; to: string }
  /**
   * Active k threshold. Stated inside the bar rather than under it: the rule
   * describes what the filters below are allowed to reveal, and as a loose
   * paragraph between two cards it read as an orphan nobody attributed to
   * anything.
   */
  kThreshold?: number
  /**
   * Rendered in the bar's footer, opposite the applied period. The public
   * page puts its export buttons here: the file is exactly the view these
   * controls describe, so it belongs to the same card rather than floating
   * beside it.
   */
  actions?: ReactNode
  locale: Locale
  className?: string
}

/**
 * Native selects truncate their own text, and the label a select shows by
 * default is the «все …» option - which in Kazakh is the longest string in the
 * set («Жұмыстың барлық түрлері»). These widths fit that option in all three
 * locales; `max-w-full` keeps them inside the card on a narrow tablet.
 */
export const SELECT_WIDTHS = {
  faculty: "w-full max-w-full sm:w-72",
  workType: "w-full max-w-full sm:w-64",
  status: "w-full max-w-full sm:w-56",
} as const

/** Shared with the internal contour's filter bar, which adds two dimensions. */
export const PERIOD_LABELS: Record<PeriodPreset, (locale: Locale) => string> = {
  month: (locale) => m.filter_period_month({}, { locale }),
  semester: (locale) => m.filter_period_semester({}, { locale }),
  year: (locale) => m.filter_period_year({}, { locale }),
  "3y": (locale) => m.filter_period_3y({}, { locale }),
  "5y": (locale) => m.filter_period_5y({}, { locale }),
  custom: (locale) => m.filter_period_custom({}, { locale }),
}

export const STATUS_LABELS: Record<CheckStatus, (locale: Locale) => string> = {
  accepted: (locale) => m.status_accepted({}, { locale }),
  needs_revision: (locale) => m.status_needs_revision({}, { locale }),
  rejected: (locale) => m.status_rejected({}, { locale }),
  recheck: (locale) => m.status_recheck({}, { locale }),
}

export function FilterBar({
  search,
  onChange,
  faculties,
  workTypes,
  appliedPeriod,
  kThreshold,
  actions,
  locale,
  className,
}: FilterBarProps) {
  const ids = useId()
  const facultyId = `${ids}-faculty`
  const workTypeId = `${ids}-work-type`
  const fromId = `${ids}-from`
  const toId = `${ids}-to`

  /**
   * Switching to «произвольный» seeds the pickers with the academic year, so
   * the range is valid the moment the preset changes and the first request is
   * never a 422.
   */
  const selectPreset = (preset: PeriodPreset) => {
    if (preset !== "custom") {
      onChange({ period: preset, from: undefined, to: undefined })
      return
    }
    const seeded = resolvePreset("year", new Date())
    onChange({
      period: "custom",
      from: search.from ?? seeded.from,
      to: search.to ?? seeded.to,
    })
  }

  return (
    <section
      aria-label={m.filter_bar_title({}, { locale })}
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground",
        className
      )}
    >
      <div
        role="group"
        aria-label={m.filter_period({}, { locale })}
        className="flex flex-wrap items-center gap-1.5"
      >
        <span className="mr-1 text-sm font-medium">
          {m.filter_period({}, { locale })}
        </span>
        {PERIOD_PRESETS.map((preset) => (
          <Button
            key={preset}
            size="sm"
            variant={search.period === preset ? "default" : "outline"}
            aria-pressed={search.period === preset}
            onClick={() => {
              selectPreset(preset)
            }}
          >
            {PERIOD_LABELS[preset](locale)}
          </Button>
        ))}
      </div>

      {search.period === "custom" ? (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm" htmlFor={fromId}>
            {m.filter_from({}, { locale })}
            <Input
              id={fromId}
              type="date"
              className="w-44"
              value={search.from ?? ""}
              onChange={(event) => {
                onChange({ from: event.target.value || undefined })
              }}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm" htmlFor={toId}>
            {m.filter_to({}, { locale })}
            <Input
              id={toId}
              type="date"
              className="w-44"
              value={search.to ?? ""}
              onChange={(event) => {
                onChange({ to: event.target.value || undefined })
              }}
            />
          </label>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm" htmlFor={facultyId}>
          {m.filter_faculty({}, { locale })}
          <NativeSelect
            id={facultyId}
            data-testid="filter-faculty"
            className={SELECT_WIDTHS.faculty}
            value={search.faculty ?? ""}
            onChange={(event) => {
              onChange({ faculty: event.target.value || undefined })
            }}
          >
            <NativeSelectOption value="">
              {m.filter_all_faculties({}, { locale })}
            </NativeSelectOption>
            {faculties.map((faculty) => (
              <NativeSelectOption key={faculty.code} value={faculty.code}>
                {localizedName(faculty, locale)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor={workTypeId}>
          {m.filter_work_type({}, { locale })}
          <NativeSelect
            id={workTypeId}
            data-testid="filter-work-type"
            className={SELECT_WIDTHS.workType}
            value={search.workType ?? ""}
            onChange={(event) => {
              onChange({ workType: event.target.value || undefined })
            }}
          >
            <NativeSelectOption value="">
              {m.filter_all_work_types({}, { locale })}
            </NativeSelectOption>
            {workTypes.map((workType) => (
              <NativeSelectOption key={workType.code} value={workType.code}>
                {localizedName(workType, locale)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>

        {/*
          No status select: ADR-016 §3 removed `status` from the public filter
          set, and the server answers it with a `422`. The control lives on in
          `InternalFilterBar`, which is why `STATUS_LABELS`, `isCheckStatus` and
          `SELECT_WIDTHS.status` are still exported from here.
        */}

        {hasActiveFilters(search) ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange({
                period: "year",
                from: undefined,
                to: undefined,
                faculty: undefined,
                workType: undefined,
              })
            }}
          >
            {m.filter_reset({}, { locale })}
          </Button>
        ) : null}
      </div>

      {appliedPeriod === undefined &&
      kThreshold === undefined &&
      actions === undefined ? null : (
        <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            {appliedPeriod ? (
              <p
                className="text-xs text-muted-foreground"
                data-testid="applied-period"
              >
                {m.filter_period_shown(
                  {
                    from: formatDate(appliedPeriod.from, locale),
                    to: formatDate(appliedPeriod.to, locale),
                  },
                  { locale }
                )}
              </p>
            ) : null}
            {kThreshold === undefined ? null : (
              <p className="text-xs text-muted-foreground">
                {m.k_threshold_note({ k: String(kThreshold) }, { locale })}
              </p>
            )}
          </div>
          {actions === undefined ? null : (
            <div className="shrink-0">{actions}</div>
          )}
        </div>
      )}
    </section>
  )
}

export function isCheckStatus(value: string): value is CheckStatus {
  return (CHECK_STATUSES as readonly string[]).includes(value)
}
