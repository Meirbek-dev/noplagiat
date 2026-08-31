import type { ReactNode } from "react"
import { useMemo, useRef } from "react"

import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table"

/**
 * The admin area's list rendering, on TanStack Table (TZ.md §9).
 *
 * Every admin list is a *display* table - the values are already formatted,
 * masked or localized by the page - so the columns are display columns and the
 * cell renderer takes the row itself. `AdminVirtualTable` is the same
 * declaration virtualized through TanStack Virtual, for the two lists that grow
 * without bound: the ingest batches and the audit journal.
 */

const features = tableFeatures({})

/**
 * Rows are records: `table-core`'s `RowData` admits an object or an array, and
 * every list here is a generated DTO - an object type alias, which satisfies
 * the index signature structurally.
 */
export type AdminRow = Record<string, unknown>

export interface AdminColumn<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  /** Numbers read right-aligned; everything else starts at the text edge. */
  align?: "end"
  className?: string
}

export interface AdminTableProps<T> {
  columns: readonly AdminColumn<T>[]
  rows: T[]
  caption?: string
  /** Shown instead of the table when there is nothing to list. */
  empty: string
}

export function AdminTable<T extends AdminRow>({
  columns,
  rows,
  caption,
  empty,
}: AdminTableProps<T>) {
  const table = useAdminTable(columns, rows)

  if (rows.length === 0) return <EmptyState message={empty} />

  return (
    <div className="overflow-x-auto">
      <Table>
        {caption === undefined ? null : (
          <caption className="caption-top pb-2 text-start text-sm font-medium">
            {caption}
          </caption>
        )}
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={alignClass(columns, header.id)}
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={alignClass(columns, cell.column.id)}
                >
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export interface AdminVirtualTableProps<T> extends AdminTableProps<T> {
  /** Viewport height in pixels; the list scrolls inside it. */
  height?: number
  /** Row height estimate - rows are measured, this only seeds the scrollbar. */
  estimateRowHeight?: number
}

/**
 * The same table with a windowed body. Plain elements rather than `<tr>`s:
 * absolute positioning inside a `<tbody>` is not something browsers lay out,
 * so the virtualized form is a grid, and the header is a matching grid row.
 */
export function AdminVirtualTable<T extends AdminRow>({
  columns,
  rows,
  caption,
  empty,
  height = 480,
  estimateRowHeight = 44,
}: AdminVirtualTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
  })

  const template = columns
    .map((column) => column.className ?? "minmax(6rem, 1fr)")
    .join(" ")

  if (rows.length === 0) return <EmptyState message={empty} />

  return (
    <div className="flex flex-col gap-1">
      {caption === undefined ? null : (
        <p className="text-sm font-medium">{caption}</p>
      )}
      <div className="rounded-md border">
        <div
          role="table"
          aria-rowcount={rows.length}
          aria-label={caption}
          className="text-sm"
        >
          <div
            role="row"
            className="grid gap-2 border-b bg-muted/50 px-3 py-2 font-medium"
            style={{ gridTemplateColumns: template }}
          >
            {columns.map((column) => (
              <div
                key={column.id}
                role="columnheader"
                // `min-w-0` + wrapping: a grid track narrower than its header
                // otherwise lets the word overflow onto the next column.
                className={
                  column.align === "end"
                    ? "min-w-0 text-right break-words"
                    : "min-w-0 break-words"
                }
              >
                {column.header}
              </div>
            ))}
          </div>

          <div ref={scrollRef} style={{ height, overflow: "auto" }}>
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
                width: "100%",
              }}
            >
              {virtualizer.getVirtualItems().map((item) => {
                const row = rows[item.index]
                return (
                  <div
                    key={item.key}
                    role="row"
                    data-index={item.index}
                    ref={virtualizer.measureElement}
                    className="grid items-start gap-2 border-b px-3 py-2"
                    style={{
                      gridTemplateColumns: template,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${String(item.start)}px)`,
                    }}
                  >
                    {columns.map((column) => (
                      <div
                        key={column.id}
                        role="cell"
                        className={
                          column.align === "end"
                            ? "text-right tabular-nums"
                            : "min-w-0 break-words"
                        }
                      >
                        {column.cell(row)}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function useAdminTable<T extends AdminRow>(
  columns: readonly AdminColumn<T>[],
  rows: T[]
) {
  const columnDefs = useMemo(() => {
    const helper = createColumnHelper<typeof features, T>()
    return columns.map((column) =>
      helper.display({
        id: column.id,
        header: column.header,
        cell: (context) => column.cell(context.row.original),
      })
    )
  }, [columns])

  return useTable({ features, columns: columnDefs, data: rows })
}

function alignClass<T extends AdminRow>(
  columns: readonly AdminColumn<T>[],
  id: string
): string | undefined {
  return columns.find((column) => column.id === id)?.align === "end"
    ? "text-right tabular-nums"
    : undefined
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
      {message}
    </p>
  )
}
