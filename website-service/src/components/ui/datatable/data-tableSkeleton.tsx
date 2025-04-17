import { ExtendedColumnDef } from "@/constants/type";
import { Button } from "../button";
import { Skeleton } from "../skeleton";
import { ChevronDown, Download, Eye, Plus, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table as TableType } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../table";
import HeaderGroup from "./components/Header/HeaderGroup";
import { Checkbox } from "../checkbox";
import { motion, Variants } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DatatableSkeletonProps<TData, _TValue> = {
  haveCheckbox?: boolean;
  buttonAdd?: boolean;
  windowWidth: number;
  maxHeight: "initial" | "scrolled" | "scrolledTablet" | "initialTablet";
  table: TableType<TData>;
};

export default function DatatableSkeleton<TData, TValue>({
  haveCheckbox,
  table,
  windowWidth,
  buttonAdd,
  maxHeight,
}: DatatableSkeletonProps<TData, TValue>) {
  const datatableSkeletonSize = Array.from({ length: 10 }, () => 10);
  const columnsArray = table
    .getAllColumns()
    .filter((column) => column.columnDef.header && (column.columnDef as { accessorKey?: string }).accessorKey);

  return (
    <div className="flex flex-col p-6">
      {/* Title + Buttons */}
      <div className="flex max-sm:flex-col max-sm:gap-y-2.5 z-[1] items-center justify-between bg-neutral-10 transition-all duration-300 mb-6">
        {/* Title */}
        <Skeleton className="h-10 w-64" />
        {/* Buttons */}
        <div className="flex items-center gap-x-2 pointer-events-none">
          {buttonAdd && (
            <Button variant="outlineBasic" className="ml-auto" aria-label="Exporter les données">
              <Plus className="text-neutral-600" />
            </Button>
          )}
          <Button variant="outlineBasic" className="ml-auto" aria-label="Afficher/masquer les colonnes">
            <Eye className="text-neutral-600" />
          </Button>
          <Button variant="outlineBasic" className="ml-auto" aria-label="Afficher/masquer les filtres">
            <SlidersHorizontal className="text-neutral-600" />
          </Button>
          <Button variant="outlineBasic" className="ml-auto" aria-label="Exporter les données">
            <Download className="text-neutral-600" />
          </Button>
        </div>
      </div>
      {/* Table + Pagination / Number of rows selected*/}
      <div className="flex flex-col gap-y-1">
        {/* Table */}
        <div className="rounded overflow-y-auto">
          <motion.div
            initial={windowWidth > 768 ? "initial" : "initialTablet"}
            animate={maxHeight}
            transition={{ duration: 0.5 }}
            variants={maxHeightAnimation}
          >
            <Table>
              <TableHeader className="bg-neutral-10 pointer-events-none">
                {table.getHeaderGroups().map((headerGroup) => (
                  <HeaderGroup
                    key={headerGroup.id}
                    headerGroup={headerGroup}
                    table={table}
                    needCheckbox={haveCheckbox}
                    isHeaderSticky={true}
                    isScrolled={false}
                  />
                ))}
              </TableHeader>
              <TableBody>
                {datatableSkeletonSize.map((_size, idx) => (
                  <TableRow className="hover:bg-transparent" key={idx}>
                    {columnsArray.map((column, idx) => {
                      const actualColumn = column.columnDef as ExtendedColumnDef<TData, TValue>;
                      if (actualColumn.needSelect) {
                        return (
                          <DatatableSkeletonCellType
                            key={idx}
                            idx={idx}
                            haveCheckbox={haveCheckbox}
                            className="w-full"
                          />
                        );
                      } else if (actualColumn.needDatePicker || actualColumn.needRangeDatePicker) {
                        return (
                          <DatatableSkeletonCellType
                            key={idx}
                            idx={idx}
                            haveCheckbox={haveCheckbox}
                            className="w-[60%]"
                          />
                        );
                      }
                      return <DatatableSkeletonCellType key={idx} idx={idx} haveCheckbox={haveCheckbox} />;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
        {/* Pagination + Number of rows selected */}
        <div className="flex justify-between max-sm:flex-col items-center max-sm:mt-2.5">
          {/* Number of rows selected */}
          <div className="flex items-center gap-x-2.5">
            <div className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-1.5 gap-x-1.5 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 w-[3.25rem]">
              <Skeleton className="size-5" />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
            <div className="flex flex-col text-[0.8125rem] leading-[1.125rem] gap-y-1">
              <Skeleton className="h-[1.125rem] w-[4.5rem]" />
              <Skeleton className="h-[1.125rem] w-48" />
            </div>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4 pointer-events-none">
            <Button variant="datatableOutline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="default" size="sm">
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================== Components ====================================================================

type DatatableSkeletonCellTypeProps = {
  idx: number;
  haveCheckbox?: boolean;
  className?: string;
};

function DatatableSkeletonCellType({ idx, haveCheckbox, className }: DatatableSkeletonCellTypeProps) {
  return (
    <TableCell className="first:pl-0">
      <div className="flex items-center gap-x-4 w-full min-h-10 pointer-events-none">
        {idx === 0 && haveCheckbox && <Checkbox className="mt-0.5" />}
        <div className="h-10 flex items-center w-full">
          <Skeleton className={cn("h-5 w-32", className)} />
        </div>
      </div>
    </TableCell>
  );
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
