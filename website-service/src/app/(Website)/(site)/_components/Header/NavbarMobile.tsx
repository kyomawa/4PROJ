"use client";

// =========================================================================================================

import Logo from "@/components/Logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navbarData } from "@/constants/data";
import { NavbarDataProps } from "@/constants/type";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SetStateAction, useState } from "react";
import { Menu } from "lucide-react";

// =========================================================================================================

export default function SidebarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden">
        <div className="p-2 rounded bg-primary-500">
          <Menu className="size-6 text-white" />
        </div>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-x-3">
              <Logo isLink className="size-10" />
              <p className="text-lg font-semibold">AkkorHotel</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <Navbar setIsOpen={setIsOpen} />
      </SheetContent>
    </Sheet>
  );
}

// =========================================================================================================

type NavbarProps = {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};

function Navbar({ setIsOpen }: NavbarProps) {
  return (
    <nav className="p-10">
      <ul className="flex flex-col gap-y-10 items-center w-full">
        {navbarData.map((item) => (
          <NavbarItem key={item.label} setIsOpen={setIsOpen} {...item} />
        ))}
      </ul>
    </nav>
  );
}

// =========================================================================================================

type NavbarItemProps = {
  label: NavbarDataProps["label"];
  path: NavbarDataProps["path"];
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};

function NavbarItem({ label, path, setIsOpen }: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <li
      onClick={() => setIsOpen(false)}
      key={label}
      className="text-black/75 hover:text-black text-xl transition-colors duration-150 flex justify-center w-full"
    >
      {/* Label */}
      <Link className="relative" href={path}>
        {label}
        {/* Line */}
        <motion.div
          className="absolute bottom-0 h-0.5 w-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: isActive ? "100%" : 0 }}
          transition={{ duration: 0.2 }}
        />
      </Link>
    </li>
  );
}

// =========================================================================================================
