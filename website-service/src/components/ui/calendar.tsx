import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { fr } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  fromDate?: Date;
  toDate?: Date;
};

function Calendar({ className, classNames, fromDate, toDate, showOutsideDays = true, ...props }: CalendarProps) {
  const defaultFromDate = new Date();
  const defaultToDate = new Date();
  defaultFromDate.setFullYear(defaultFromDate.getFullYear() - 10);
  defaultToDate.setFullYear(defaultToDate.getFullYear() + 3);

  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout="dropdown-buttons"
      fromDate={fromDate || defaultFromDate}
      toDate={toDate || defaultToDate}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(buttonVariants({ variant: "outline" }), "size-6  p-0 opacity-50 hover:opacity-100"),
        nav_button_previous: "absolute -left-1",
        nav_button_next: "absolute -right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-primary-700/10/50 [&:has([aria-selected])]:bg-primary-700/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-slate-800/50 dark:[&:has([aria-selected])]:bg-slate-800",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary-700 text-white hover:bg-primary-700 hover:text-slate-50 focus:bg-primary-700 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900",
        day_today: "bg-slate-100 !text-slate-900 dark:bg-primary-800 dark:text-slate-50",
        day_outside:
          "day-outside text-slate-500 opacity-50 aria-selected:bg-primary-700/10/50 aria-selected:text-slate-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400",
        day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
        day_range_middle:
          "aria-selected:bg-primary-700/10 rounded-none aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="size-4" />,
        IconRight: () => <ChevronRight className="size-4" />,
        CaptionLabel: () => null,
        Dropdown: ({ onChange, value, children }) => (
          <select
            onChange={onChange}
            value={value}
            className="dark:border-none dark:bg-primary-950 dark:text-slate-50 mx-0.5 rounded-md border border-neutral-150 px-2 py-1 text-sm"
          >
            {children}
          </select>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
