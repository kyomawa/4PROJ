import { HeaderCellTypeProps } from "../../type";
import FilterDatePicker from "./Filters/FilterDatePicker";
import FilterInput from "./Filters/FilterInput";
import FilterMultiSelect from "./Filters/FilterMultiSelect";
import FilterRangeDatePicker from "./Filters/FilterRangeDatePicker";
import FilterSelect from "./Filters/FilterSelect";

function HeaderCellType<TData>({ column, header, isHeaderSticky, isScrolled }: HeaderCellTypeProps<TData>) {
  if (column.needSelect) {
    return <FilterSelect column={header.column} options={column.options || []} />;
  }

  if (column.needRangeDatePicker) {
    return <FilterRangeDatePicker header={header} />;
  }

  if (column.needDatePicker) {
    return <FilterDatePicker header={header} />;
  }

  if (column.needMultiSelect) {
    return <FilterMultiSelect column={header.column} options={column.options || []} />;
  }

  if (column.noFilter) {
    return null;
  }

  return <FilterInput header={header} isHeaderSticky={isHeaderSticky} isScrolled={isScrolled} />;
}

export default HeaderCellType;
