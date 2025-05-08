"use client";

import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input, inputVariants } from "@/components/ui/input";
import { VariantProps } from "class-variance-authority";

// ===================================================================================================

type FormInputFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  variant?: VariantProps<typeof inputVariants>["variant"];
  className?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  isRequired?: boolean;
  type?: "text" | "email" | "time" | "number" | "date";
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
};

export function FormInputField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  className,
  isRequired,
  type,
  description,
  placeholder,
  disabled,
  variant,
  readonly,
}: FormInputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              type={type || "text"}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readonly}
              className={className}
              variant={variant}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================
