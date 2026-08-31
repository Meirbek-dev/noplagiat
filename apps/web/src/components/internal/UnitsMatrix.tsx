import { useMemo, useState } from "react"

import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

import type { MatrixFaculty } from "@/api/types.gen"
import { Button } from "@/components/button"
import type { ScreenedNumber } from "@/components/charts"
import { ScreenedValue, UnitHeatmap } from "@/components/charts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table"
import {
  SERIES_CHECKS,
  SERIES_ORIGINALITY,
  checksSeries,
  localizedName,
  matrixHeatmapRows,
  originalitySeries,
} from "@/lib/adapters"
import { formatCount, formatPercentPoints } from "@/lib/format"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * Section 4 at internal grain (TZ.md §4.2 §4): the faculty→department matrix,
 * as a heat map over the same rows a TanStack Table lists underneath.
 *
 * A faculty row expands into its departments. The faculty margin is the
 * server's `total`, computed over every department including the ones its own
 * cells suppress, so the visible children do not have to add up to the parent -
 * that is complementary suppression working, not an arithmetic bug (ADR-002).
 *
 * The rows are hierarchical, so they are not sortable: re-ordering by a column
 * would tear the departments away from their faculty. Sorting belongs to the
 * flat per-unit tables in sections 6 and 7.
 */

export interface UnitsMatrixProps {
  faculties: readonly MatrixFaculty[]
  locale: Locale
}

interface MatrixRow {
  id: string
  kind: "faculty" | "department"
  label: string
  checks: ScreenedNumber
  avg_originality: ScreenedNumber
  /** Departments under this faculty, for the expander. `0` on a department. */
  children: number
}

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, MatrixRow>()

export function UnitsMatrix({ faculties, locale }: UnitsMatrixProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    () => new Set<string>()
  )

  const toggle = (code: string) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const rows = useMemo<MatrixRow[]>(() => {
    const flat: MatrixRow[] = []
    for (const faculty of faculties) {
      flat.push({
        id: faculty.code,
        kind: "faculty",
        label: localizedName(faculty, locale),
        checks: faculty.total.checks,
        avg_originality: faculty.total.avg_originality,
        children: faculty.departments.length,
      })
      if (!expanded.has(faculty.code)) continue
      for (const department of faculty.departments) {
        flat.push({
          id: `${faculty.code}/${department.code}`,
          kind: "department",
          label: localizedName(department, locale),
          checks: department.checks,
          avg_originality: department.avg_originality,
          children: 0,
        })
      }
    }
    return flat
  }, [faculties, expanded, locale])

  const columns = useMemo(
    () =>
      helper.columns([
        helper.accessor("label", {
          header: m.chart_heatmap_unit({}, { locale }),
        }),
        helper.accessor("checks", {
          header: m.chart_series_checks({}, { locale }),
        }),
        helper.accessor("avg_originality", {
          header: m.chart_series_originality({}, { locale }),
        }),
      ]),
    [locale]
  )

  const table = useTable({ features, columns, data: rows })

  const heatmapRows = useMemo(
    () => matrixHeatmapRows(faculties, expanded, locale),
    [faculties, expanded, locale]
  )

  const metrics = useMemo(
    () => [
      {
        id: SERIES_CHECKS,
        label: checksSeries(locale).label,
        unit: "count" as const,
      },
      {
        id: SERIES_ORIGINALITY,
        label: originalitySeries(locale).label,
        unit: "percent" as const,
      },
    ],
    [locale]
  )

  return (
    <div className="flex flex-col gap-4">
      <UnitHeatmap
        rows={heatmapRows}
        metrics={metrics}
        title={m.chart_units_title({}, { locale })}
        locale={locale}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "label" ? undefined : "text-right"}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const unit = row.original
              return (
                <TableRow
                  key={row.id}
                  data-unit-kind={unit.kind}
                  data-unit-code={unit.id}
                  className={unit.kind === "department" ? "bg-muted/30" : ""}
                >
                  <TableCell
                    className={
                      unit.kind === "department"
                        ? "ps-8 text-sm"
                        : "font-medium"
                    }
                  >
                    {unit.kind === "faculty" && unit.children > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ms-2 h-7 px-2"
                        aria-expanded={expanded.has(unit.id)}
                        onClick={() => {
                          toggle(unit.id)
                        }}
                      >
                        <span aria-hidden="true" className="me-1">
                          {expanded.has(unit.id) ? "▾" : "▸"}
                        </span>
                        {unit.label}
                      </Button>
                    ) : (
                      unit.label
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <ScreenedValue
                      value={unit.checks}
                      locale={locale}
                      format={(value) => formatCount(value, locale)}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <ScreenedValue
                      value={unit.avg_originality}
                      locale={locale}
                      format={(value) => formatPercentPoints(value, locale)}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
