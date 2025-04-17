import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "px-3 py-1 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "flex h-9 w-full rounded-md  border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-black/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        line: "flex h-9 w-full border-b-2 border-black/20 focus:border-black placeholder:text-black/50",
        lineFile:
          "border-b-2 h-10 border-black/20 focus:border-black placeholder:text-black/50 bg-white ring-offset-white placeholder:text-neutral-500",
        datatableFilter:
          "flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-primary-700/10 placeholder:text-primary-800/65 text-neutral-900 pl-10",
        datatableCell:
          "flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white bg-white/0 transition-colors duration-200 ease-in-out",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input, inputVariants };
