"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { ChevronDown, Plus, Search } from "lucide-react";

import useSWR from "swr";
import { useLanguage } from "@/hooks/use-language";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import getColumns from "./columns";

import { Project } from "@/lib/types/project";
import { Paginator } from "@/lib/types/paginator";
import { apiClient } from "@/lib/api/client";

interface DataTableProps {
  initialData: Paginator<Project> | null;
}

export function DataTable({ initialData }: DataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Read from URL, fallback to default
  const [currentPage, setCurrentPage] = React.useState(Number(searchParams.get("page")) || 1);
  const [perPage, setPerPage] = React.useState(Number(searchParams.get("per_page")) || 20);
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  const columns = getColumns(t);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Sync state to URL every time it changes
  React.useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (perPage !== 20) params.set("per_page", perPage.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);

    const newUrl = params.toString() ? `?${params.toString()}` : "/dashboard/project";

    router.push(newUrl, { scroll: false });
  }, [currentPage, perPage, debouncedSearch, router]);

  // Build API URL with query params
  const buildApiUrl = React.useCallback(() => {
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("per_page", perPage.toString());

    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }

    return `/api/projects?${params.toString()}`;
  }, [currentPage, perPage, debouncedSearch]);

  // Fetch data with SWR
  const { data, error, isLoading } = useSWR<Paginator<Project>>([buildApiUrl(), language], ([url]) => apiClient.get(url), {
    fallbackData: initialData || undefined,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  // Reset to page 1 when language changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [language]);

  // Extract project data
  const project = data?.data || [];
  const meta = data;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: project,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: meta?.last_page || 1,
  });

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("table.project.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          {/* Per Page Select */}
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("datatable.perPage")}</SelectLabel>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t("datatable.columns")} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add */}
          <Button asChild>
            <Link href="/dashboard/project/add">
              {t("datatable.add")}
              <Plus className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-primary hover:bg-primary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                  Error loading data. Please try again.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("datatable.showing")} {meta?.from || 0} {t("datatable.to")} {meta?.to || 0} of {meta?.total || 0} {t("projects.lowercase")}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1 || isLoading}>
            {t("datatable.previous")}
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm">
              {t("datatable.page")} {currentPage} {t("datatable.of")} {meta?.last_page || 1}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage >= (meta?.last_page || 1) || isLoading}>
            {t("datatable.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
