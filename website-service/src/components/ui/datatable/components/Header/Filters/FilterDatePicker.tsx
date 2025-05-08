import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FiltersProps } from "../../../type";

function FilterDatePicker<TData>({ header }: FiltersProps<TData>) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const filterValue = header.column.getFilterValue();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      header.column.setFilterValue(date.toISOString());
    } else {
      header.column.setFilterValue(undefined);
    }
  };

  // Clear the date when the filter value is cleared by the user
  useEffect(() => {
    if (filterValue === undefined) {
      setSelectedDate(undefined);
    }
  }, [filterValue]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="datatableFilter" className="pl-10" aria-label="Choisir une date">
          <CalendarIcon className="absolute top-1/2 -translate-y-1/2 left-3" size={20} />
          {selectedDate ? (
            <span className="text-neutral-900">{format(selectedDate, "PPP", { locale: fr })}</span>
          ) : (
            <span className="text-primary-800/65">Choisir une date</span>
          )}
          <span
            className="absolute right-0 px-2.5 py-2 top-1/2 -translate-y-1/2 bg-[#ECE9F9] text-neutral-800 hover:text-primary-800 duration-200 transition-colors"
            aria-label={`Trier par ${header.column.id}`}
            onClick={(e) => {
              header.column.toggleSorting(header.column.getIsSorted() === "asc");
              e.stopPropagation();
            }}
          >
            <ArrowUpDown size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="center">
        <Calendar initialFocus mode="single" selected={selectedDate} onSelect={handleDateSelect} numberOfMonths={1} />
      </PopoverContent>
    </Popover>
  );
}

export default FilterDatePicker;
