import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ======================================================================================================================

type DropdownMenuComponentProps = {
  children: React.ReactNode;
  label: string;
  separator?: boolean;
  options: string[] | React.ReactNode[];
  className?: string;
};

export default function DropdownMenuComponent({
  children,
  label,
  separator,
  options,
  className,
}: DropdownMenuComponentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className={cn("", className)}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {separator && <DropdownMenuSeparator />}
        {options.map((option, index) =>
          typeof option === "string" ? (
            <DropdownMenuItem key={index}>{option}</DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild key={index}>
              {option}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ======================================================================================================================
