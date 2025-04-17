"use client";

// ===================================================================================================

import { ChevronDown, PanelRightClose, UserIcon } from "lucide-react";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "@/components/Image";
import { deleteEmployeeSession } from "@/lib/sessionEmployee";
import SidebarMobile from "./SidebarMobile";
import { User } from "@prisma/client";

// ===================================================================================================

type NavbarProps = {
  img: User["img"];
  pseudo: User["pseudo"];
};

export default function Navbar({ img, pseudo }: NavbarProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 w-full px-6 z-[50] h-16 flex max-lg:justify-between items-center backdrop-blur-sm bg-white/50">
        <button onClick={() => setShowSidebar(true)} className="lg:hidden">
          <PanelRightClose size={24} className="text-neutral-500" />
        </button>
        <NavbarLogo />
        <div className="flex gap-x-2 justify-end lg:flex-1 items-center">
          <UserProfile img={img} pseudo={pseudo} />
        </div>
      </header>
      {/* Navbar Height */}
      <div className="h-16" />
      {/* Sidebar Mobile */}
      <SidebarMobile setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
    </>
  );
}

// ===================================================================================================

function NavbarLogo() {
  return (
    <Link
      href="/panel/utilisateurs"
      className="flex gap-x-3 items-center hover:scale-105 transition-transform duration-150 lg:w-[14.5rem] max-lg:hidden"
    >
      <Logo noAnimation />
      <p className="text-lg">Akkor Hotel</p>
    </Link>
  );
}

// ===================================================================================================

function UserProfile({ img, pseudo }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    setShowDropdown(!showDropdown);
    await deleteEmployeeSession();
  };

  return (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger className="outline-none">
        <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-x-1.5">
          {/* User Image */}
          {img ? (
            <Image
              containerClassName="size-10 rounded-full"
              className="rounded-full bg-primary-1050 object-cover"
              src={img}
              alt={`Image de ${pseudo}`}
              fill
              sizes="2.5rem"
            />
          ) : (
            <div className="bg-black/5 dark:bg-primary-700 rounded-full size-10 overflow-hidden relative">
              <UserIcon
                className="absolute -bottom-1 left-1/2 size-[2.15rem] -translate-x-1/2 fill-black/65 text-black/65 dark:fill-white dark:text-white"
                strokeWidth={0.75}
              />
            </div>
          )}
          <ChevronDown
            className={cn(
              "text-black/35 dark:text-white/40 transition-transform duration-300",
              showDropdown && "rotate-180"
            )}
            size={18}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <DropdownMenuLabel className="text-neutral-500 dark:text-primary-200/75">{pseudo}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link onClick={() => setShowDropdown(!showDropdown)} href={"/panel/parametres"}>
            Paramètres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ===================================================================================================
