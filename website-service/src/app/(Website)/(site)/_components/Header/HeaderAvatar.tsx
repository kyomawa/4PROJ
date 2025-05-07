"use client";

import Image from "@/components/Image";
import { UserData } from "@/actions/user/action";
// =========================================================================================================

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { ChevronDown, UserIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { useState } from "react";

// =========================================================================================================

type HeaderAvatarProps = {
  user: UserData;
};

export default function HeaderAvatar({ user }: HeaderAvatarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { img, username } = user;

  return (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger id="avatarButton" className="outline-none">
        <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-x-1.5">
          {/* User Image */}
          {img ? (
            <Image
              containerClassName="size-10 rounded-full"
              className="rounded-full bg-primary-1050 object-cover"
              src={img}
              alt={`Image de ${username || "profil"}`}
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
      <DropdownMenuContent side="bottom" className="mr-2 z-[50000]">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/5 transition-colors duration-150">
          <Link href="/profil">Mon profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/5 transition-colors duration-150">
          <Link href="/itineraires">Mes itinéraires</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-black/5 transition-colors duration-150"
          onClick={deleteSession}
        >
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ===================================================================================================
