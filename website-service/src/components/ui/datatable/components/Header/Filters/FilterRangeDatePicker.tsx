import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { FiltersProps } from "../../../type";

function FilterRangeDatePicker<TData>({ header }: FiltersProps<TData>) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const filterValue = header.column.getFilterValue();

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      header.column.setFilterValue([range.from.toISOString(), range.to.toISOString()]);
    } else {
      header.column.setFilterValue(undefined);
    }
  };

  // Clear the date when the filter value is cleared by the user
  useEffect(() => {
    if (filterValue === undefined) {
      setDateRange(undefined);
    }
  }, [filterValue]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="datatableFilter" className="pl-10" aria-label="Choisir une plage de dates">
          <CalendarIcon className="absolute top-1/2 -translate-y-1/2 left-3" size={20} />
          {dateRange?.from ? (
            dateRange.to ? (
              <span className="text-neutral-900">
                {format(dateRange.from, "PPP", { locale: fr })} - {format(dateRange.to, "PPP", { locale: fr })}
              </span>
            ) : (
              <span className="text-neutral-900">{format(dateRange.from, "PPP", { locale: fr })}</span>
            )
          ) : (
            <span className="text-primary-800/65">Choisir une plage de dates</span>
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
      <PopoverContent className="w-auto p-0 bg-white mx-4" align="center">
        <Calendar initialFocus mode="range" selected={dateRange} onSelect={handleDateRangeSelect} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}

export default FilterRangeDatePicker;
