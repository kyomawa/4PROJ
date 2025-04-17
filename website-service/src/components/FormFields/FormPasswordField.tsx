"use client";

import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { Input, inputVariants } from "@/components/ui/input";
import { VariantProps } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

// ===================================================================================================

type FormPasswordFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  description?: string;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: boolean;
  variant?: VariantProps<typeof inputVariants>["variant"];
};

export default function FormPasswordField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  description,
  isRequired,
  placeholder,
  disabled,
  variant,
}: FormPasswordFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                variant={variant}
                {...field}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 blue:text-primary-100/65"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
              </button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================
