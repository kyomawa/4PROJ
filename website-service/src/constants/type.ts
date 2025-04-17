import { ColumnDef } from "@tanstack/react-table";

// =========================================================================================================

export type NavbarDataProps = {
  label: string;
  path: string;
};

// =========================================================================================================

export type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  isEditable?: boolean;
  textAlign?: "left" | "center" | "right";
  needInput?: boolean;
  needSelect?: boolean;
  needMultiSelect?: boolean;
  needCombobox?: boolean;
  needDatePicker?: boolean;
  needRangeDatePicker?: boolean;
  noFilter?: boolean;
  options?: string[];
};

// =========================================================================================================
