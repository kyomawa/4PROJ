"use client";

// ===================================================================================================

import { SetStateAction, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ImageUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import TooltipComponent from "../TooltipComponent";
import Image from "../Image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

// ===================================================================================================

type FormImageFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  description?: string;
  isRequired?: boolean;
  disabled?: boolean;

  hasFile: boolean;
  existingFileUrl?: string;
  existingFileAlt?: string;
  existingFileFormat?: "16:9" | "4:3";
  existingFileOnDeleteLoading?: boolean;
  existingFileHandleDelete?: () => void;
};

export default function FormImageField<TFieldValues extends FieldValues>({
  title,
  name,
  form,
  isRequired,
  disabled,
  description,
  hasFile = false,
  existingFileUrl,
  existingFileAlt,
  existingFileFormat,
  existingFileOnDeleteLoading,
  existingFileHandleDelete,
}: FormImageFieldProps<TFieldValues>) {
  const [preview, setPreview] = useState<string>(existingFileUrl || "");
  const [image, setImage] = useState(hasFile);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, name, ref } }) => (
        <FormItem className="group/file relative min-h-full">
          {title && (
            <FormLabel>
              {title} {isRequired && <span className="text-red-600 dark:text-red-400">*</span>}
            </FormLabel>
          )}
          <FormControl>
            {image ? (
              <ExistingImage
                existingFileUrl={preview || existingFileUrl || ""}
                existingFileAlt={existingFileAlt || ""}
                existingFileFormat={existingFileFormat || "4:3"}
                onDelete={existingFileHandleDelete || (() => null)}
                isLoading={existingFileOnDeleteLoading || false}
              />
            ) : (
              <FileInputField
                name={name}
                refInput={ref}
                disabled={disabled}
                setImage={setImage}
                existingFileFormat={existingFileFormat || "4:3"}
                setPreview={(url: string) => {
                  setImage(true);
                  setPreview(url);
                }}
                onChange={(file: File) => onChange(file)}
                onBlur={onBlur}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// =============================================================================

type ExistingImageProps = {
  existingFileUrl: string;
  existingFileAlt: string;
  existingFileFormat: "16:9" | "4:3";
  onDelete: () => void;
  isLoading: boolean;
};

function ExistingImage({
  existingFileUrl,
  existingFileAlt,
  existingFileFormat,
  onDelete,
  isLoading,
}: ExistingImageProps) {
  return (
    <div className="relative overflow-hidden">
      <ExistingImageButtonDelete onDelete={onDelete} isLoading={isLoading} />
      <Image
        src={existingFileUrl}
        alt={existingFileAlt}
        sizes="100vw, (min-width: 768px) 50vw"
        className="object-cover"
        containerClassName={cn("h-auto w-full", existingFileFormat === "16:9" ? "aspect-video" : "aspect-square")}
      />
    </div>
  );
}

// =============================================================================

type ExistingImageButtonDeleteProps = {
  onDelete: () => void;
  isLoading: boolean;
};

function ExistingImageButtonDelete({ onDelete, isLoading }: ExistingImageButtonDeleteProps) {
  return (
    <AlertDialog>
      <TooltipComponent label="Supprimer l'image" side="bottom" className="bg-white">
        <AlertDialogTrigger className="absolute top-2 right-2 z-[1] p-2 rounded bg-white/20 backdrop-blur group/delete hover:bg-red-500/25 transition-colors duration-150">
          <X className="size-6 md:size-5 text-white group-hover/delete:text-red-500 transition-colors duration-150" />
        </AlertDialogTrigger>
      </TooltipComponent>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression de l&apos;image</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette image ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onDelete} isLoading={isLoading} type="submit">
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// =============================================================================

type FileInputFieldProps = {
  name: string;
  refInput: React.Ref<HTMLInputElement>;
  setImage: React.Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  existingFileFormat: "16:9" | "4:3";
  setPreview: (url: string) => void;
  onChange: (file: File) => void;
  onBlur: () => void;
};

function FileInputField({
  name,
  refInput,
  disabled,
  onChange,
  onBlur,
  setImage,
  setPreview,
  existingFileFormat,
}: FileInputFieldProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden px-3 py-1.5 min-h-40 w-full rounded-md border border-black/15 border-dashed cursor-pointer group/input-file",
        existingFileFormat === "16:9" ? "aspect-video" : "aspect-square"
      )}
    >
      <ImageUp className="text-black/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] size-7 group-hover/input-file:text-primary-500 transition-colors duration-150" />
      <div key="editing" className="absolute inset-x-1.5 inset-y-0 flex items-center z-[1]">
        <input
          className="flex w-full cursor-pointer opacity-0 size-full file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-neutral-200 file:px-4 file:py-1 file:text-sm file:text-neutral-900 file:transition-colors file:duration-300 group-hover/file:file:bg-primary-700 group-hover/file:file:text-white file:dark:bg-primary-800 file:dark:text-white group-hover/file:file:dark:bg-primary-700"
          type="file"
          name={name}
          ref={refInput}
          disabled={disabled}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files[0]) {
              const file = files[0];
              const previewUrl = URL.createObjectURL(file);
              onChange(file);
              setImage(true);
              setPreview(previewUrl);
            }
          }}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

// =============================================================================
