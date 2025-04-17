import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tableProps } from "../../type";

function NumberOfRows<TData>({ table }: tableProps<TData>) {
  const lines = [10, 25, 50, 100, 250];
  return (
    <Select onValueChange={(value) => table.setPageSize(Number(value))}>
      <SelectTrigger className="w-fit pl-3 pr-2 gap-x-1.5" aria-label="Nombre de lignes par page">
        <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
      <SelectContent>
        {lines.map((pageSize) => (
          <SelectItem key={pageSize} value={pageSize.toString()}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default NumberOfRows;
