import { useId } from "react"

import type {
  InternalBreakdownItem,
  MatrixDepartment,
  MatrixFaculty,
} from "@/api/types.gen"
import { Button } from "@/components/button"
import {
  PERIOD_LABELS,
  SELECT_WIDTHS,
  STATUS_LABELS,
  isCheckStatus,
} from "@/components/dashboard/FilterBar"
import { Input } from "@/components/input"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import { localizedName } from "@/lib/adapters"
import { hasActiveFilters } from "@/lib/filters"
import { formatDate } from "@/lib/format"
import { resolvePreset } from "@/lib/period"
import type { DashboardSearch, PeriodPreset } from "@/lib/search"
import { CHECK_STATUSES, PERIOD_PRESETS } from "@/lib/search"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The internal filter bar (TZ.md §4.3: period, faculty, **department**, **ОП**,
 * work type, status).
 *
 * Scope-awareness is not a client rule here. The faculty and department
 * options are exactly the units `/api/internal/departments-matrix` returned for
 * this caller, so a dean is offered their own faculty and its departments and
 * nothing else; the server would answer a wider filter with a 403 in any case.
 */

export interface InternalFilterBarProps {
  search: DashboardSearch
  onChange: (patch: Partial<DashboardSearch>) => void
  /** Visible units, straight from the caller's `departments-matrix`. */
  faculties: readonly MatrixFaculty[]
  workTypes: readonly InternalBreakdownItem[]
  appliedPeriod?: { from: string; to: string }
  locale: Locale
}

export function InternalFilterBar({
  search,
  onChange,
  faculties,
  workTypes,
  appliedPeriod,
  locale,
}: InternalFilterBarProps) {
  const ids = useId()
  const facultyId = `${ids}-faculty`
  const departmentId = `${ids}-department`
  const programId = `${ids}-program`
  const workTypeId = `${ids}-work-type`
  const statusId = `${ids}-status`
  const fromId = `${ids}-from`
  const toId = `${ids}-to`

  // Narrowing to a faculty narrows the department list with it; with no
  // faculty chosen every visible department is offered, because the scope has
  // already limited what "every" means.
  const departments: MatrixDepartment[] =
    search.faculty === undefined || search.faculty === ""
      ? faculties.flatMap((faculty) => faculty.departments)
      : (faculties.find((faculty) => faculty.code === search.faculty)
          ?.departments ?? [])

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
      className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground"
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
            className={SELECT_WIDTHS.faculty}
            value={search.faculty ?? ""}
            onChange={(event) => {
              // Changing faculty drops a department that no longer belongs to
              // it - otherwise the pair would be a guaranteed 403.
              onChange({
                faculty: event.target.value || undefined,
                department: undefined,
              })
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

        <label className="flex flex-col gap-1 text-sm" htmlFor={departmentId}>
          {m.filter_department({}, { locale })}
          <NativeSelect
            id={departmentId}
            className={SELECT_WIDTHS.faculty}
            value={search.department ?? ""}
            onChange={(event) => {
              onChange({ department: event.target.value || undefined })
            }}
          >
            <NativeSelectOption value="">
              {m.filter_all_departments({}, { locale })}
            </NativeSelectOption>
            {departments.map((department) => (
              <NativeSelectOption key={department.code} value={department.code}>
                {localizedName(department, locale)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor={programId}>
          {m.filter_program({}, { locale })}
          <Input
            id={programId}
            className="w-full max-w-full sm:w-48"
            placeholder={m.filter_program_placeholder({}, { locale })}
            value={search.program ?? ""}
            onChange={(event) => {
              onChange({ program: event.target.value || undefined })
            }}
            aria-describedby={`${programId}-hint`}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor={workTypeId}>
          {m.filter_work_type({}, { locale })}
          <NativeSelect
            id={workTypeId}
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

        <label className="flex flex-col gap-1 text-sm" htmlFor={statusId}>
          {m.filter_status({}, { locale })}
          <NativeSelect
            id={statusId}
            className={SELECT_WIDTHS.status}
            value={search.status ?? ""}
            onChange={(event) => {
              const value = event.target.value
              onChange({ status: isCheckStatus(value) ? value : undefined })
            }}
          >
            <NativeSelectOption value="">
              {m.filter_all_statuses({}, { locale })}
            </NativeSelectOption>
            {CHECK_STATUSES.map((status) => (
              <NativeSelectOption key={status} value={status}>
                {STATUS_LABELS[status](locale)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>

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
                department: undefined,
                program: undefined,
                workType: undefined,
                status: undefined,
              })
            }}
          >
            {m.filter_reset({}, { locale })}
          </Button>
        ) : null}
      </div>

      {/* PLAN.md D2: the ОП dictionary is not published on the internal
          contour, so the programme filter takes the code the API accepts. */}
      <p id={`${programId}-hint`} className="text-xs text-muted-foreground">
        {m.filter_program_hint({}, { locale })}
      </p>

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
    </section>
  )
}
