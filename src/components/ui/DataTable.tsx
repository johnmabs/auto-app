"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/* ── Props ───────────────────────────────────────────────── */
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  selectable?: boolean;
  onRowClick?: (row: TData) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  toolbar?: React.ReactNode;
}

/* ── Composant ───────────────────────────────────────────── */
export function DataTable<TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Rechercher...",
  pageSize = 10,
  selectable = false,
  onRowClick,
  className,
  emptyMessage = "Aucun résultat",
  loading = false,
  toolbar,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  /* Colonnes avec sélection optionnelle */
  const finalColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    if (!selectable) return columns;
    return [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="accent-(--gold) rounded"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Sélectionner tout"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="accent-(--gold) rounded"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Sélectionner la ligne"
          />
        ),
        enableSorting: false,
        size: 40,
      },
      ...columns,
    ];
  }, [columns, selectable]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className={cn("w-full", className)}>
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Search */}
          {searchKey && (
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--dim)" />
              <input
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn(searchKey)?.setFilterValue(e.target.value)
                }
                className={cn(
                  "w-full pl-9 pr-4 py-2 text-sm",
                  "bg-(--bg-3) border border-(--border) rounded-(--r)",
                  "text-(--text) placeholder:text-(--dim)",
                  "outline-none focus:border-(--gold) transition-colors",
                )}
              />
            </div>
          )}

          {/* Sélection info */}
          {selectable && selectedCount > 0 && (
            <span className="text-xs text-(--gold)">
              {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Custom toolbar */}
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-(--r-lg) border border-(--border)">
        <table className="w-full border-collapse">
          {/* Head */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-(--bg-3) border-b border-(--border)"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-5 py-3 text-left",
                        "text-[0.68rem] font-medium uppercase tracking-widest text-(--dim)",
                        canSort &&
                          "cursor-pointer select-none hover:text-(--text) transition-colors",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="text-(--dim)">
                            {sorted === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : sorted === "desc" ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronsUpDown className="h-3 w-3 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              /* Loading rows */
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-t border-(--border)">
                  {finalColumns.map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="skeleton h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              /* Empty state */
              <tr>
                <td
                  colSpan={finalColumns.length}
                  className="h-32 text-center text-(--muted) text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-(--border) transition-colors",
                    "hover:bg-(--bg-3)",
                    onRowClick && "cursor-pointer",
                    row.getIsSelected() && "bg-[rgba(201,168,76,0.06)]",
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-5 py-4 text-[0.83rem] text-(--text)"
                      onClick={
                        cell.column.id === "select"
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────── */}
      <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
        <p className="text-xs text-(--muted)">
          {table.getFilteredRowModel().rows.length} résultat
          {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
          {selectedCount > 0 &&
            ` · ${selectedCount} sélectionné${selectedCount > 1 ? "s" : ""}`}
        </p>

        <div className="flex items-center gap-1.5">
          <Button
            variant="subtle"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Première page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="subtle"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-xs text-(--muted) px-2">
            Page{" "}
            <span className="text-(--text) font-medium">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            / {table.getPageCount()}
          </span>

          <Button
            variant="subtle"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="subtle"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Dernière page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
