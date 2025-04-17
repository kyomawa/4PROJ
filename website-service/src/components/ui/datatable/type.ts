import { ExtendedColumnDef } from "@/constants/type";
import { Cell, Column, Getter, Header, HeaderGroup, Row, Table } from "@tanstack/react-table";

// ===================================================== General Types ====================================================================

export type tableProps<TData> = {
  table: Table<TData>;
};

export type DataWithId = {
  id: string;
  [key: string]: string;
};

// ===================================================== Header Types ======================================================================

export type HeaderCellProps<TData> = {
  header: Header<TData, unknown>;
  idx: number;
  table: Table<TData>;
  isHeaderSticky: boolean;
  isScrolled: boolean;
  needCheckbox?: boolean;
};

export type HeaderCellTypeProps<TData> = {
  column: ExtendedColumnDef<TData, unknown>;
  header: Header<TData, unknown>;
  isHeaderSticky: boolean;
  isScrolled: boolean;
};

export type HeaderGroupProps<TData> = {
  headerGroup: HeaderGroup<TData>;
  table: Table<TData>;
  isHeaderSticky: boolean;
  isScrolled: boolean;
  needCheckbox?: boolean;
};

// Filters Types

export type FiltersProps<TData> = {
  header: Header<TData, unknown>;
};

export type FilterSelectProps<TData> = {
  column: Column<TData>;
  options: string[];
};

export type FilterInputProps<TData> = {
  header: Header<TData, unknown>;
  isHeaderSticky: boolean;
  isScrolled: boolean;
};

// ===================================================== Body Types ========================================================================

export type TableRowContentProps<TData> = {
  row: Row<TData>;
  table: Table<TData>;
  needCheckbox?: boolean;
  needEdition?: boolean;
};

export type TableCellGroupProps<TData, TValue> = {
  cell: Cell<TData, TValue>;
  idx: number;
  row: Row<TData>;
  table: Table<TData>;
  needCheckbox?: boolean;
  needEdition?: boolean;
};

export type TableCellTypeProps<TData, TValue> = {
  cell: Cell<TData, TValue>;
  row: Row<TData>;
  table: Table<TData>;
};

// Editable Cell Types

export type EditableCellInputProps<TData> = {
  cellValue: Getter<unknown>;
  row: Row<TData>;
  column: Column<TData>;
  table: Table<TData>;
};

export type EditableCellSelectProps<TData> = {
  cellValue: Getter<unknown>;
  row: Row<TData>;
  column: Column<TData>;
  table: Table<TData>;
  options: string[];
};

export type EditableCellDatePickerProps<TData, TValue> = {
  cellValue: () => TValue;
  row: Row<TData>;
  column: Column<TData>;
  table: Table<TData>;
};

// ===================================================== Buttons Types ====================================================================

export type ExportButtonProps<TData> = {
  table: Table<TData>;
  title: string;
};

export type SettingsButtonProps = {
  isHeaderSticky: boolean;
  setIsHeaderSticky: React.Dispatch<React.SetStateAction<boolean>>;
};

export type DeleteButtonProps<TData> = tableProps<TData> & {
  deleteMultiRowsFn?: (_selectedRowIds: string[]) => Promise<void>;
};
