import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterSelectProps } from "../../../type";
import { Check, ChevronDown } from "lucide-react";

function FilterMultiSelect<TData>({ column, options }: FilterSelectProps<TData>) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option) ? prevSelected.filter((item) => item !== option) : [...prevSelected, option]
    );
  };

  useEffect(() => {
    if (selectedOptions.length > 0) {
      column.setFilterValue(selectedOptions);
    } else {
      column.setFilterValue(undefined);
    }
  }, [selectedOptions, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="!pr-6" variant="datatableFilter" aria-label="Choisir des options">
          {selectedOptions.length > 0 ? (
            <span className="text-neutral-900">{selectedOptions.join(", ")}</span>
          ) : (
            <span className="text-primary-800/65">Choisir des options</span>
          )}
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full overflow-y-auto max-h-96 h-fit min-w-fit p-1 bg-white">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);

          return (
            <div
              onClick={() => handleOptionToggle(option)}
              key={option}
              className="relative flex cursor-pointer items-center rounded-sm py-1.5 pl-8 hover:bg-primary-700 hover:text-white"
            >
              {isSelected && <Check className="absolute left-2 top-1/2 -translate-y-1/2" size={16} />}
              <span className="text-sm">{option}</span>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default FilterMultiSelect;
