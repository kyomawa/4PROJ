import * as React from "react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { inputVariants } from "@/components/ui/input";
import { VariantProps } from "class-variance-authority";

type FormComboboxFieldProps<TFieldValues extends FieldValues> = {
  title?: string;
  placeholder: string;
  name: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  variant?: VariantProps<typeof inputVariants>["variant"];
  modal?: boolean;
  description?: string;
  disabled?: boolean;
  notFoundMessage: string;
  datas: { label: string; value: PathValue<TFieldValues, Path<TFieldValues>> }[];
  isRequired?: boolean;
};

export default function FormComboboxField<TFieldValues extends FieldValues>({
  datas,
  title,
  modal,
  notFoundMessage,
  description,
  placeholder,
  disabled,
  variant,
  name,
  form,
  isRequired,
}: FormComboboxFieldProps<TFieldValues>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef, containerRef.current?.offsetWidth]);

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
          <Popover open={isOpen} onOpenChange={setIsOpen} modal={modal || true}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  ref={containerRef}
                  disabled={disabled}
                  aria-label={`Bouton pour ouvrir la liste de ${title}`}
                  className={cn(
                    inputVariants({ variant }),
                    "relative flex w-full cursor-pointer items-center justify-start py-1.5 font-normal"
                  )}
                >
                  <span>
                    {field.value ? (
                      datas.find((data) => data.value === field.value)?.label
                    ) : (
                      <span className="pt-1 text-black/50">{placeholder}</span>
                    )}
                  </span>
                  <div className="absolute right-0 top-1/2 z-[1] shrink-0 -translate-y-1/2 bg-white pl-1 pr-3 blue:bg-primary-950">
                    <ChevronsUpDown className="size-4 text-black/50" />
                  </div>
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent style={{ width }} className="w-full p-0">
              <Command>
                <CommandInput placeholder={placeholder} className="h-9" />
                <CommandList>
                  <CommandEmpty>{notFoundMessage}</CommandEmpty>
                  <CommandGroup>
                    {datas.map((data, index) => (
                      <CommandItem
                        value={data.label}
                        key={`${data.value}-${index}`}
                        onSelect={async () => {
                          form.setValue(name, data.value);
                          await form.trigger(name);
                          setIsOpen(false);
                        }}
                      >
                        {data.label}
                        <Check
                          className={cn("ml-auto h-4 w-4", data.value === field.value ? "opacity-100" : "opacity-0")}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
