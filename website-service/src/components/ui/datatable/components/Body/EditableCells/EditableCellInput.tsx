import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { EditableCellInputProps } from "../../../type";

function EditableCellInput<TData>({ cellValue, row: { index }, column, table }: EditableCellInputProps<TData>) {
  const initialValue = cellValue;
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const onBlur = () => {
    table.options.meta?.updateData(index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onBlur();
      inputRef.current?.blur();
    }
  };

  return (
    <Input
      ref={inputRef}
      value={(value as string) ?? ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      variant="datatableCell"
    />
  );
}

export default EditableCellInput;
