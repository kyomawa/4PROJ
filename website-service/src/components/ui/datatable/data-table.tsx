"use client";

import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Table as TableType,
  RowData,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ExtendedColumnDef } from "@/constants/type";
import ColumnVisibilityTrigger from "./components/Buttons/ColumnVisibilityTrigger";
import NumberOfRows from "./components/Buttons/NumberOfRows";
import DeleteButton from "./components/Buttons/DeleteButton";
import SettingsButton from "./components/Buttons/SettingsButton";
import HeaderGroup from "./components/Header/HeaderGroup";
import TableRowContent from "./components/Body/TableRowContent";
import { DataWithId } from "./type";
import { motion, useAnimate, Variants } from "framer-motion";
import DatatableSkeleton from "./data-tableSkeleton";
import { Plus } from "lucide-react";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
    updateData: (_rowIndex: number, _columnId: string, _value: unknown) => void;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ExtendedColumnDef<TData, TValue>[];
  data: TData[];
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
  title?: string;
  needCheckbox?: boolean;
  modalAdd?: ReactNode;
  openModalAddFn?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  deleteMultiRowsFn?: (_selectedRowIds: string[]) => Promise<void>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setData,
  isLoading,
  title,
  needCheckbox,
  openModalAddFn,
  modalAdd,
  deleteMultiRowsFn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isHeaderSticky, setIsHeaderSticky] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [tableHeaderRef, tableHeaderAnimate] = useAnimate();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const tableRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex,
    meta: {
      setData,
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const maxHeight =
    isHeaderSticky && isScrolled
      ? windowWidth > 768
        ? "scrolled"
        : "scrolledTablet"
      : windowWidth > 768
      ? "initial"
      : "initialTablet";

  // Scroll event to detect if the user scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current && tableRef.current.scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading]);

  // Update window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    setWindowWidth(window.innerWidth);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animate table header when scrolled and header is sticky
  useEffect(() => {
    if (!isLoading) {
      tableHeaderAnimate(
        tableHeaderRef.current,
        isScrolled && isHeaderSticky ? tableHeaderAnimation.scrolling : tableHeaderAnimation.initial
      );
    }
  }, [isScrolled, tableHeaderAnimate, tableHeaderRef, isHeaderSticky, isLoading]);

  if (isLoading) {
    return (
      <DatatableSkeleton
        table={table}
        haveCheckbox={needCheckbox}
        buttonAdd={modalAdd || openModalAddFn ? true : false}
        windowWidth={windowWidth}
        maxHeight={maxHeight}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* Title + Buttons */}
      <motion.div
        initial="initial"
        animate={isScrolled ? (isHeaderSticky ? "scrolling" : "initial") : "initial"}
        transition={{ duration: 0.3 }}
        variants={headerAnimation}
        className="z-[1] mx-6 flex items-center justify-between bg-white transition-all duration-300 max-sm:flex-col max-sm:gap-y-2.5"
      >
        {/* Title */}
        <motion.h1
          initial="initial"
          animate={isScrolled ? "scrolling" : "initial"}
          transition={{ duration: 0.3 }}
          variants={titleAnimation}
          className="font-bold"
        >
          {title ?? ""}
        </motion.h1>

        {/* Buttons */}
        <div className="flex items-center gap-x-2">
          {modalAdd && modalAdd}
          {openModalAddFn && (
            <Button
              onClick={() => openModalAddFn(true)}
              variant="outlineBasic"
              size="none"
              className="ml-auto"
              aria-label="Ajouter"
            >
              <Plus className="text-neutral-600 !size-6" />
            </Button>
          )}
          <ColumnVisibilityTrigger table={table} />
          <SettingsButton isHeaderSticky={isHeaderSticky} setIsHeaderSticky={setIsHeaderSticky} />
          <DeleteButton table={table as unknown as TableType<DataWithId>} deleteMultiRowsFn={deleteMultiRowsFn} />
        </div>
      </motion.div>
      {/* Table + Pagination / Number of rows selected*/}
      <div className="flex flex-col gap-y-1 px-6 pb-6">
        {/* Table */}
        <div className="overflow-y-auto rounded" ref={tableRef}>
          <motion.div
            initial={windowWidth > 768 ? "initial" : "initialTablet"}
            animate={maxHeight}
            transition={{ duration: 0.5 }}
            variants={maxHeightAnimation}
          >
            <Table>
              <TableHeader ref={tableHeaderRef} className="bg-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <HeaderGroup
                    key={headerGroup.id}
                    headerGroup={headerGroup}
                    table={table}
                    needCheckbox={needCheckbox}
                    isHeaderSticky={isHeaderSticky}
                    isScrolled={isScrolled}
                  />
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <TableRowContent key={row.id} row={row} table={table} needCheckbox={needCheckbox} />
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <p>Aucuns résultats trouvés.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        </div>
        {/* Pagination + Number of rows selected */}
        <div className="flex items-center justify-between max-sm:mt-2.5 max-sm:flex-col">
          {/* Number of rows selected */}
          <div className="flex items-center gap-x-2.5">
            <NumberOfRows table={table} />
            <div className="flex flex-col text-[0.8125rem] leading-[1.125rem]">
              <p>
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}.
              </p>
              <p className="">
                {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
                sélectionnée(s).
              </p>
            </div>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="datatableOutline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button variant="default" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================== Functions ====================================================================

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

// ===================================================== Motion Variants ====================================================================

const maxHeightAnimation: Variants = {
  initial: {
    maxHeight: "calc(100vh - 20rem)",
  },
  initialTablet: {
    maxHeight: "calc(100vh - 22.5rem)",
  },
  scrolled: {
    maxHeight: "calc(100vh - 18rem)",
  },
  scrolledTablet: {
    maxHeight: "calc(100vh - 20.5rem)",
  },
};

const headerAnimation: Variants = {
  initial: {
    padding: "1.5rem 0",
    position: "static",
    top: "0",
  },
  scrolling: {
    padding: "1rem 0 0 0",
    position: "sticky",
    top: "3.5rem",
  },
};

const titleAnimation: Variants = {
  initial: {
    fontSize: "1.875rem",
    lineHeight: "2.25rem",
  },
  scrolling: {
    fontSize: "1.5rem",
    lineHeight: "2rem",
  },
};

const tableHeaderAnimation: Variants = {
  initial: {
    zIndex: 0,
    position: "static",
    transition: { duration: 0.3 },
  },
  scrolling: {
    top: "0rem",
    position: "sticky",
    zIndex: 1,
    transition: { duration: 0.3 },
  },
};
