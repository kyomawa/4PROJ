import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { EditableCellDatePickerProps } from "../../../type";

function EditableCellDatePicker<TData, TValue>({
  cellValue,
  row: { index },
  column,
  table,
}: EditableCellDatePickerProps<TData, TValue>) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const initialDate = cellValue() ? parseISO(cellValue() as string) : undefined;
    setDate(initialDate);
  }, [cellValue]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outlineBasic"
          className="relative w-full min-w-fit pl-10 justify-start font-normal hover:bg-white hover:bg-opacity-75"
          aria-label="Choisir une date"
        >
          <CalendarIcon className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral-700" size={20} />{" "}
          <span>{date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            const isoDate = selectedDate ? selectedDate.toISOString() : "";
            table.options.meta?.updateData(index, column.id, isoDate);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default EditableCellDatePicker;
