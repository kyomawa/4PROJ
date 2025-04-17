import { TableRow } from "@/components/ui/table";
import TableCellGroup from "./TableCellGroup";
import { TableRowContentProps } from "../../type";

function TableRowContent<TData>({ row, table, needCheckbox, needEdition }: TableRowContentProps<TData>) {
  return (
    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell, idx) => (
        <TableCellGroup
          key={cell.id}
          cell={cell}
          idx={idx}
          row={row}
          table={table}
          needCheckbox={needCheckbox}
          needEdition={needEdition}
        />
      ))}
    </TableRow>
  );
}

export default TableRowContent;
