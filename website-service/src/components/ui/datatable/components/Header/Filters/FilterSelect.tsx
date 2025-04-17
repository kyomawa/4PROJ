import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterSelectProps } from "../../../type";
import { useEffect, useState } from "react";

function FilterSelect<TData>({ column, options }: FilterSelectProps<TData>) {
  const headerName = column.columnDef?.header
    ? (column.columnDef.header as string).slice(0, 1).toUpperCase() + (column.columnDef.header as string).slice(1)
    : "";

  const [componentKey, setComponentKey] = useState(0);
  const filterValue = column.getFilterValue();

  // Remount the component select when the filter value is cleared by the user
  useEffect(() => {
    if (filterValue === undefined) {
      setComponentKey((prevKey) => prevKey + 1);
    }
  }, [filterValue]);

  return (
    <Select key={componentKey} onValueChange={(value) => column.setFilterValue(value)}>
      <SelectTrigger
        className="bg-primary-700/10 border-none text-primary-800/65"
        chevronClassName="text-black opacity-100"
        aria-label="Choisir une option"
      >
        <SelectValue placeholder={headerName} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FilterSelect;
