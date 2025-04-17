import { FilterFn } from "@tanstack/react-table";
import { isSameDay, isWithinInterval, parseISO, startOfDay } from "date-fns";

// =============================================================================================================================================

export const dateFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const filterDate = startOfDay(parseISO(filterValue));
  const rowDate = startOfDay(parseISO(row.getValue(columnId)));
  return isSameDay(rowDate, filterDate);
};

export const dateRangeFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (!filterValue || !Array.isArray(filterValue)) return true;
  const [start, end] = filterValue.map((date) => startOfDay(parseISO(date)));
  const rowDate = startOfDay(parseISO(row.getValue(columnId)));
  return isWithinInterval(rowDate, { start, end });
};

export const multiSelectFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (filterValue.length === 0) return true;

  const rowValue = row.getValue(columnId);

  return filterValue.includes(String(rowValue));
};

// =============================================================================================================================================
