import { TableHead } from "@/components/ui/table";
import HeaderCellType from "./HeaderCellType";
import { cn } from "@/lib/utils";
import { HeaderCellProps } from "../../type";
import { ExtendedColumnDef } from "@/constants/type";
import { Checkbox } from "@/components/ui/checkbox";
import { flexRender } from "@tanstack/react-table";
import { CircleX } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";

function HeaderCell<TData>({ header, idx, table, isHeaderSticky, isScrolled, needCheckbox }: HeaderCellProps<TData>) {
  const column = header.column.columnDef as ExtendedColumnDef<TData, unknown>;
  const filtersMode = column.needDatePicker || column.needRangeDatePicker || column.needSelect;

  const handleFilterChange = () => {
    header.column.setFilterValue(undefined);
  };

  return (
    <TableHead className={cn("first:pl-0", idx === 0 && "flex items-center mr-2 gap-x-4 h-full")} key={header.id}>
      {/* Checkbox only on first column */}
      {idx === 0 && needCheckbox && (
        <motion.div
          initial="initial"
          animate={isHeaderSticky && isScrolled ? "scrolled" : "initial"}
          transition={{ duration: 0.3 }}
          variants={checkboxAnimation}
        >
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Tous sélectionner"
          />
        </motion.div>
      )}
      {header.isPlaceholder ? null : (
        <div className="w-full">
          {/* Column Header Title + Column Header Filters */}
          <div className="flex flex-col gap-y-1.5 mb-3.5">
            {/* Title + Clear Filter Button */}
            <motion.div
              initial="initial"
              animate={isHeaderSticky && isScrolled ? "scrolled" : "initial"}
              variants={titleAnimation}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-x-1"
            >
              {/* Title */}
              <p className="text-neutral-900 font-medium line-clamp-1">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </p>
              {/* Clear Filter Button */}
              <AnimatePresence>
                {header.column.getCanFilter() && header.column.getFilterValue() !== undefined && filtersMode && (
                  <motion.button
                    initial="initial"
                    animate="visible"
                    exit="initial"
                    variants={buttonFilterAnimation}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-x-2"
                    onClick={handleFilterChange}
                  >
                    <CircleX className="size-4 text-neutral-400 hover:text-red-500 transition-colors duration-300" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Filters */}
            {header.column.getCanFilter() && (
              <motion.div
                className="flex gap-x-2"
                initial="initial"
                animate={isHeaderSticky && isScrolled ? "scrolled" : "initial"}
                transition={{ duration: 0.3 }}
                variants={filterAnimation}
              >
                <HeaderCellType
                  column={column}
                  header={header}
                  isHeaderSticky={isHeaderSticky}
                  isScrolled={isScrolled}
                />
              </motion.div>
            )}
          </div>
        </div>
      )}
    </TableHead>
  );
}

export default HeaderCell;

// ===================================================== Motion Variants ====================================================================

const titleAnimation: Variants = {
  initial: {
    opacity: 1,
    transform: "translateY(0)",
  },
  scrolled: {
    opacity: 0,
    transform: "translateY(-0.5rem)",
  },
};

const buttonFilterAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const filterAnimation: Variants = {
  initial: {
    marginTop: 0,
  },
  scrolled: {
    marginTop: "-0.8125rem",
  },
};

const checkboxAnimation: Variants = {
  initial: {
    marginTop: "0.875rem",
  },
  scrolled: {
    marginTop: "0.125rem",
  },
};
