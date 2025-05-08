"use client";

import * as React from "react";
import { useCallback } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

export const InputComponent = cn(Input, "rounded-e-lg rounded-s-none");

const WrappedInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentPropsWithoutRef<typeof Input>>(
  ({ className, ...props }, ref) => (
    <Input ref={ref} className={cn(className, "rounded-e-lg rounded-s-none")} {...props} />
  )
);
WrappedInput.displayName = "WrappedInput";

export const InputPhone = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
      onChange?: (_value: RPNInput.Value) => void;
    }
>(({ className, onChange, ...props }, ref) => {
  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      // ← on passe notre vrai composant React, pas une string
      inputComponent={WrappedInput}
      onChange={(value) => {
        if (value) onChange?.(value);
      }}
      {...props}
    />
  );
});
InputPhone.displayName = "InputPhone";

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                     ✨ FUNCTIONS ✨                        */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// 1. CountrySelect
const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn("flex gap-1 rounded-e-none rounded-s-lg px-2")}
          disabled={disabled}
        >
          <div className="flex gap-1">
            <FlagComponent country={value} countryName={value} />
            <ChevronsUpDown className={cn("-mr-1 size-4 opacity-50", disabled ? "hidden" : "opacity-100")} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Rechercher un pays..." />
              <CommandEmpty>Aucun pays trouvés.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem className="gap-2" key={option.value} onSelect={() => handleSelect(option.value)}>
                      <FlagComponent country={option.value} countryName={option.label} />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">{`+${RPNInput.getCountryCallingCode(
                          option.value
                        )}`}</span>
                      )}
                      <CheckIcon
                        className={cn("ml-auto size-4", option.value === value ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// 2. FlagComponent
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 h-4 w-6 overflow-hidden rounded-sm">{Flag && <Flag title={countryName} />}</span>
  );
};
FlagComponent.displayName = "FlagComponent";

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                       ✨ TYPES ✨                          */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (_value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};
