"use client";

import { FormControl, FormDescription, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { InputPhone } from "@/components/ui/input-phone";

// ===================================================================================================

type FormInputPhoneNumberFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  isRequired?: boolean;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export default function FormInputPhoneNumberField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  isRequired,
  placeholder,
  description,
  disabled,
}: FormInputPhoneNumberFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start">
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl className="w-full">
            <InputPhone
              placeholder={placeholder || "Renseignez un numéro de téléphone"}
              {...field}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription className="text-left">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================
