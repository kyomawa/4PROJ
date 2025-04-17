import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "resize-none bg-white dark:border-white/5 dark:bg-white/10 ring-offset-white flex w-full px-3 py-2 text-base focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 bg-white dark:border-white/5 dark:bg-white/10 ring-offset-white placeholder:text-black/50 min-h-[5rem] rounded-md dark:placeholder:text-white/55 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1",
        line: "border-b-2 border-black/20 focus:border-black placeholder:text-black/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant, ...props }, ref) => {
  return <textarea className={cn(textareaVariants({ variant, className }))} ref={ref} {...props} />;
});

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
