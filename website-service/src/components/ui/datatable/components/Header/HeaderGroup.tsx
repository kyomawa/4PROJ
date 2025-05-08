import { TableRow } from "@/components/ui/table";
import HeaderCell from "./HeaderCell";
import { HeaderGroupProps } from "../../type";

function HeaderGroup<TData>({ headerGroup, table, isHeaderSticky, isScrolled, needCheckbox }: HeaderGroupProps<TData>) {
  return (
    <TableRow className="hover:bg-neutral-10" key={headerGroup.id}>
      {headerGroup.headers.map((header, idx) => (
        <HeaderCell
          key={header.id}
          header={header}
          needCheckbox={needCheckbox}
          idx={idx}
          table={table}
          isHeaderSticky={isHeaderSticky}
          isScrolled={isScrolled}
        />
      ))}
    </TableRow>
  );
}

export default HeaderGroup;
