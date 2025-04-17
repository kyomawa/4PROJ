import { useState } from "react";
import { EditableCellSelectProps } from "../../../type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function EditableCellSelect<TData>({
  cellValue,
  row: { index },
  column: { id },
  table,
  options,
}: EditableCellSelectProps<TData>) {
  const initialValue = cellValue;
  const [value, setValue] = useState(initialValue);

  const handleSelect = (newValue: string) => {
    table.options.meta?.updateData(index, id, newValue);
    setValue(newValue);
  };

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue placeholder={String(value)} />
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

export default EditableCellSelect;
