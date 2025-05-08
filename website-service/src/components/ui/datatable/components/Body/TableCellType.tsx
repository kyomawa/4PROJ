import EditableCellInput from "./EditableCells/EditableCellInput";
import EditableCellSelect from "./EditableCells/EditableCellSelect";
import EditableCellDatePicker from "./EditableCells/EditableCellDatePicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { flexRender } from "@tanstack/react-table";
import { ExtendedColumnDef } from "@/constants/type";
import { TableCellTypeProps } from "../../type";

function TableCellType<TData, TValue>({ cell, row, table }: TableCellTypeProps<TData, TValue>) {
  const column = cell.column.columnDef as ExtendedColumnDef<TData, TValue>;
  const options = column.needSelect ? column.options || [] : [];

  if (column.isEditable) {
    if (column.needSelect) {
      return (
        <EditableCellSelect cellValue={cell.getValue} row={row} column={cell.column} table={table} options={options} />
      );
    }
    if (column.needDatePicker || column.needRangeDatePicker) {
      return <EditableCellDatePicker cellValue={cell.getValue} row={row} column={cell.column} table={table} />;
    }
    if (column.needInput) {
      return <EditableCellInput cellValue={cell.getValue} row={row} column={cell.column} table={table} />;
    }
  }

  if (column.needDatePicker || column.needRangeDatePicker) {
    if (Date.parse(cell.getValue() as string)) {
      return <span>{format(cell.getValue() as Date, "PPP", { locale: fr })}</span>;
    } else {
      return <span>{cell.getValue() as string}</span>;
    }
  }

  return flexRender(cell.column.columnDef.cell, cell.getContext());
}

export default TableCellType;
