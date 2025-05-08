import { TableCell } from "@/components/ui/table";
import TableCellType from "./TableCellType";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCellGroupProps } from "../../type";
import { ExtendedColumnDef } from "@/constants/type";

function TableCellGroup<TData, TValue>({ cell, idx, row, table, needCheckbox }: TableCellGroupProps<TData, TValue>) {
  const column = cell.column.columnDef as ExtendedColumnDef<TData, TValue>;
  const textAlign = column.textAlign || "left";
  const textStyle = textAlign === "right" ? "justify-end" : textAlign === "center" ? "justify-center" : "justify-start";

  return (
    <TableCell className="first:pl-0" key={cell.id}>
      <div className={cn("flex items-center gap-x-4 w-full min-h-10", textStyle)}>
        {idx === 0 && needCheckbox && (
          <Checkbox
            className="mt-0.5"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Sélectionner la ligne"
          />
        )}
        <TableCellType cell={cell} row={row} table={table} />
      </div>
    </TableCell>
  );
}

export default TableCellGroup;
