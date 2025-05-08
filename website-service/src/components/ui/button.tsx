import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white font-bold rounded-full hover:bg-primary-600/90 hover:scale-105 transition-all duration-200",
        outline:
          "border border-primary-500 text-primary-600 rounded-full font-bold hover:text-white hover:bg-primary-600/90 hover:scale-105 transition-all duration-200",
        outlineBasic:
          "inline-flex outline-none items-center justify-center whitespace-nowrap rounded-md text-sm font-medium duration-200 transition-all disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-primary-100/15 dark:hover:border-primary-950 dark:bg-primary-1050 dark:hover:bg-primary-950 dark:text-neutral-50",
        destructive: "!bg-red-600 text-white shadow-sm",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        datatableOutline:
          "inline-flex outline-none items-center justify-center whitespace-nowrap rounded-md text-sm font-medium duration-200 transition-all disabled:pointer-events-none disabled:opacity-50 border text-primary-700 disabled:text-primary-800 border-primary-800/45 bg-white hover:bg-primary-700 hover:text-neutral-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        datatableOutlineDestructive:
          "inline-flex outline-none items-center justify-center whitespace-nowrap rounded-md text-sm font-medium duration-200 transition-all disabled:pointer-events-none disabled:opacity-50 border text-red-500 disabled:text-red-800 border-red-500/55 bg-white hover:bg-red-500 hover:text-neutral-50",
        datatableFilter:
          "inline-flex outline-none items-center whitespace-nowrap rounded-md text-sm font-medium duration-200 transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary-700/10 placeholder:text-primary-800/65 text-neutral-900 w-full justify-start relative",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        none: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} disabled={isLoading} ref={ref} {...props}>
        <span className={cn(isLoading && "hidden")}>{props.children}</span>
        <Loader className={cn("size-6", !isLoading ? "hidden" : "animate-loading")} />
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
