"use client";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { inputVariants } from "@/components/ui/input";
import { useState } from "react";

// ===================================================================================================

type FormDateRangePickerFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  placeholder?: string;
  isRequired?: boolean;
  form: UseFormReturn<TFieldValues>;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
};

export default function FormDateRangePickerField<TFieldValues extends FieldValues>({
  title,
  name,
  placeholder,
  isRequired,
  form,
  minDate,
  maxDate,
  disabled,
}: FormDateRangePickerFieldProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultFromDate = new Date();
  const defaultToDate = new Date();

  defaultFromDate.setFullYear(defaultFromDate.getFullYear() - 3);
  defaultToDate.setFullYear(defaultToDate.getFullYear() + 3);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const { value } = field;
        const fromDate = value?.from;
        const toDate = value?.to;

        return (
          <FormItem>
            {title && (
              <FormLabel>
                {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
              </FormLabel>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    disabled={disabled}
                    aria-label={`Open date range picker for ${title}`}
                    className={cn(
                      inputVariants({ variant: "default" }),
                      "relative flex w-full cursor-pointer items-center justify-start rounded-md py-1.5 pl-[2.75rem] font-normal"
                    )}
                  >
                    {fromDate ? (
                      toDate ? (
                        <>
                          {format(fromDate, "PPP", { locale: fr })} - {format(toDate, "PPP", { locale: fr })}
                        </>
                      ) : (
                        format(fromDate, "PPP", { locale: fr })
                      )
                    ) : (
                      <span className="pt-1 text-neutral-500 blue:text-primary-100/65">
                        {placeholder || "Select a date range"}
                      </span>
                    )}
                    <CalendarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/75 transition-colors duration-300 blue:text-white/85" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={field.value}
                  onSelect={(range) => {
                    form.setValue(name, range as PathValue<TFieldValues, Path<TFieldValues>>);
                    setIsOpen(false);
                  }}
                  numberOfMonths={2}
                  toDate={maxDate || defaultToDate}
                  fromDate={minDate || defaultFromDate}
                  disabled={(date) => date > (maxDate || defaultToDate) || date < (minDate || defaultFromDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// ===================================================================================================
