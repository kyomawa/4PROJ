"use client";

import { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Textarea, textareaVariants } from "@/components/ui/textarea";
import { VariantProps } from "class-variance-authority";

type FormTextAreaFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  isRequired?: boolean;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  readonly?: boolean;
  variant?: VariantProps<typeof textareaVariants>["variant"];
  enableCharCounter?: boolean;
  maxCharLimit?: number;
};

export default function FormTextAreaField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  isRequired,
  placeholder,
  description,
  disabled,
  readonly,
  enableCharCounter = false,
  variant,
  maxCharLimit,
}: FormTextAreaFieldProps<TFieldValues>) {
  const [charCount, setCharCount] = useState(0);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              variant={variant}
              disabled={disabled}
              readOnly={readonly}
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                const value = e.target.value;

                // Si le compteur est activé et une limite est définie
                if (enableCharCounter && maxCharLimit) {
                  if (value.length <= maxCharLimit) {
                    setCharCount(value.length); // Mettre à jour le compteur
                    field.onChange(value); // Mettre à jour la valeur du champ
                  }
                } else {
                  // Sinon, autoriser la saisie sans limite
                  setCharCount(value.length); // Mettre à jour le compteur même si désactivé
                  field.onChange(value);
                }
              }}
            />
          </FormControl>
          {enableCharCounter && maxCharLimit && (
            <div className="mt-1 text-sm text-neutral-500">
              {charCount}/{maxCharLimit} caractères
            </div>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ===================================================================================================
