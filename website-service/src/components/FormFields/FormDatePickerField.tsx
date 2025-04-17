"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { inputVariants } from "@/components/ui/input";

// ===================================================================================================

type FormDatePickerFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  placeholder?: string;
  isRequired?: boolean;
  form: UseFormReturn<TFieldValues>;
  minDate?: Date;
  maxDate?: Date;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
};

export default function FormDatePickerField<TFieldValues extends FieldValues>({
  title,
  name,
  placeholder,
  isRequired,
  description,
  form,
  minDate,
  maxDate,
  disabled,
  readonly,
}: FormDatePickerFieldProps<TFieldValues>) {
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultFromDate = new Date();
  const defaultToDate = new Date();
  defaultFromDate.setFullYear(defaultFromDate.getFullYear() - 3);
  defaultToDate.setFullYear(defaultToDate.getFullYear() + 3);

  function isDate(value: unknown): value is Date {
    return value instanceof Date;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        let fieldValue: Date | undefined;
        if (field.value) {
          if (isDate(field.value)) {
            fieldValue = field.value;
          } else if (typeof field.value === "string") {
            const [year, month, day] = (field.value as string).split("-").map(Number);
            fieldValue = new Date(year, month - 1, day);
          }
        }

        return (
          <FormItem>
            {title && (
              <FormLabel>
                {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
              </FormLabel>
            )}
            <Popover open={!readonly && isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    disabled={disabled || readonly}
                    aria-label={`Bouton pour ouvrir la date de ${title}`}
                    className={cn(
                      inputVariants({ variant: "line" }),
                      "relative flex w-full cursor-pointer items-center justify-start py-1.5 pl-[2.75rem] font-normal",
                      readonly && "cursor-not-allowed bg-neutral-200 text-neutral-500"
                    )}
                  >
                    {fieldValue ? (
                      format(fieldValue, "PPP", { locale: fr })
                    ) : (
                      <span className="pt-1 text-neutral-500 blue:text-primary-100/65">
                        {placeholder || "Choisir une date"}
                      </span>
                    )}
                    <CalendarIcon className="absolute left-3 top-1/2 size-[1.375rem] -translate-y-1/2 text-black/75 transition-colors duration-300 blue:text-white/85" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={fieldValue}
                  onSelect={(date) => {
                    if (date) {
                      const selectedDate = new Date(date);
                      form.setValue(name, selectedDate as PathValue<TFieldValues, Path<TFieldValues>>);
                      setIsOpen(false);
                    }
                  }}
                  toDate={maxDate || defaultToDate}
                  fromDate={minDate || defaultFromDate}
                  disabled={(date) => date > (maxDate || defaultToDate) || date < (minDate || defaultFromDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// ===================================================================================================
