import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import { FilterInputProps } from "../../../type";

function FilterInput<TData>({ header, isHeaderSticky, isScrolled }: FilterInputProps<TData>) {
  return (
    <div className="relative w-full min-w-40">
      <Input
        className="peer/inputsearch"
        placeholder={
          isHeaderSticky && isScrolled
            ? (flexRender(header.column.columnDef.header, header.getContext()) as string)
            : "Rechercher..."
        }
        value={(header.column.getFilterValue() as string) ?? ""}
        onChange={(e) => header.column.setFilterValue(e.target.value)}
        variant="datatableFilter"
      />
      <button
        className="absolute right-0 px-2.5 py-2 top-1/2 peer/buttonfilter -translate-y-1/2 bg-[#ECE9F9] text-neutral-800 hover:text-primary-800 duration-200 transition-colors"
        aria-label={`Trier par ${header.column.id}`}
        onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
      >
        <ArrowUpDown size={20} />
      </button>
      <Search
        className="absolute peer-focus/inputsearch:text-primary-800 left-3 top-1/2 transition-colors duration-200 -translate-y-1/2 text-neutral-800 pointer-events-none"
        size={20}
      />
    </div>
  );
}

export default FilterInput;
