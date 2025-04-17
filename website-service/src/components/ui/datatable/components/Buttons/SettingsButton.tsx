import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import { SettingsButtonProps } from "../../type";

function SettingsButton({ isHeaderSticky, setIsHeaderSticky }: SettingsButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outlineBasic" size="none" className="ml-auto" aria-label="Afficher/masquer les filtres">
          <SlidersHorizontal className="text-neutral-600 !size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={isHeaderSticky} onCheckedChange={() => setIsHeaderSticky(!isHeaderSticky)}>
          Attacher les filtres
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsButton;
