"use client";

import { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { inputVariants } from "@/components/ui/input";
import { File as FileIcon, Pen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import TooltipComponent from "../TooltipComponent";
import { AnimatePresence, motion } from "framer-motion";
import Image from "../Image";

// ===================================================================================================

type FormFileFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  description?: string;
  isRequired?: boolean;
  disabled?: boolean;
  hasFile?: boolean;
  existingFileName?: string;
  existingFileUrl?: string;
  existingFileAlt?: string;
  accept?: string;
};

export default function FormFileField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  isRequired,
  disabled,
  description,
  hasFile = false,
  existingFileName,
  existingFileUrl,
  existingFileAlt,
  accept,
}: FormFileFieldProps<TFieldValues>) {
  const [isEditing, setIsEditing] = useState(!hasFile);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, name, ref } }) => (
        <FormItem className="group/file relative">
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 blue:text-red-400">*</span>}
            </FormLabel>
          )}
          {existingFileUrl && existingFileAlt && (
            <Image
              src={existingFileUrl}
              alt={existingFileAlt}
              quality={100}
              sizes="24rem"
              containerClassName="absolute bottom-0 -translate-x-1/2 left-1/2 h-auto w-96 aspect-video hidden group-hover/file:block"
            />
          )}
          <FormControl>
            <div className={cn(inputVariants({ variant: "lineFile" }), "relative overflow-hidden px-3 py-1.5")}>
              <AnimatePresence mode="wait" initial={false}>
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-x-1.5 inset-y-0 flex items-center"
                  >
                    <input
                      className="flex w-full cursor-pointer file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-neutral-200 file:px-4 file:py-1 file:text-sm file:text-neutral-900 file:transition-colors file:duration-300 group-hover/file:file:bg-primary-700 group-hover/file:file:text-white file:blue:bg-primary-800 file:blue:text-white group-hover/file:file:blue:bg-primary-700"
                      type="file"
                      name={name}
                      accept={accept}
                      ref={ref}
                      disabled={disabled}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          onChange(files[0]);
                        }
                      }}
                      onBlur={onBlur}
                    />
                    {existingFileName && (
                      <TooltipComponent label="Réinitialiser le fichier" side="bottom">
                        <button
                          className="group/deleteButton absolute -right-2 top-1/2 -translate-y-1/2 rounded-md bg-white px-3 py-2 blue:bg-primary-950"
                          onClick={handleEditClick}
                          type="button"
                        >
                          <X
                            className="size-[1.125rem] text-black/65 transition-colors duration-200 group-hover/deleteButton:text-red-600 blue:text-white/65 blue:group-hover/deleteButton:text-red-400"
                            strokeWidth={1.5}
                          />
                        </button>
                      </TooltipComponent>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="notEditing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-x-1.5 inset-y-0 flex items-center"
                  >
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-md bg-white px-2 py-2 blue:bg-primary-950">
                      <FileIcon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-1 items-center gap-2 pl-7">
                      {existingFileUrl ? (
                        <a
                          href={existingFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-1 text-blue-600 hover:underline"
                        >
                          {existingFileName || "Fichier existant"}
                        </a>
                      ) : (
                        <span className="line-clamp-1">{existingFileName || "Un fichier est déjà associé."}</span>
                      )}
                    </div>
                    <TooltipComponent label="Modifier le fichier" side="bottom">
                      <button
                        className="group/editButton absolute -right-2 top-1/2 -translate-y-1/2 rounded-md bg-white px-3 py-2 blue:bg-primary-950"
                        type="button"
                        onClick={handleEditClick}
                      >
                        <Pen
                          className="size-[1.125rem] text-black/65 transition-colors duration-200 group-hover/editButton:fill-yellow-500 group-hover/editButton:text-yellow-500 blue:text-white/65 blue:group-hover/editButton:text-yellow-400"
                          strokeWidth={1.5}
                        />
                      </button>
                    </TooltipComponent>
                  </motion.div>
                )}
              </AnimatePresence>
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
