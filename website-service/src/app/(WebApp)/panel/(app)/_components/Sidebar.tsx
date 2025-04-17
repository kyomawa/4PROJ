"use client";

// =============================================================================================

import { SidebarLinkProps } from "../_constants/type";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "../_constants/data";
import { LogOut } from "lucide-react";
import { deleteEmployeeSession } from "@/lib/sessionEmployee";

// =============================================================================================

export default function Sidebar() {
  return (
    <>
      {/* Sidebar */}
      <aside className="max-lg:hidden mt-16 w-64 fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>
      {/* Sidebar Width */}
      <div className="w-64 max-lg:hidden" />
    </>
  );
}

// =============================================================================================

function SidebarContent() {
  return (
    <nav className="p-6 flex flex-col h-full">
      {/* Links */}
      <ul className="flex flex-col flex-1 gap-y-3 mt-8">
        {sidebarLinks.map((link, idx) => (
          <SidebarItemItem key={idx} link={link} />
        ))}
      </ul>
      {/* Logout */}
      <div onClick={deleteEmployeeSession}>
        <LogoutButton />
      </div>
    </nav>
  );
}
// =============================================================================================

type ItemProps = {
  link: SidebarLinkProps;
};

function SidebarItemItem({ link }: ItemProps) {
  const { path, Icon, label } = link;
  const pathname = usePathname();
  const isActive = pathname.startsWith(path);

  return (
    <Link href={path} className="flex items-center gap-x-3 group/link">
      <div
        className={cn(
          "rounded p-2 transition-colors duration-200 *:size-[1.25rem] 2k:*:size-[1.5rem]",
          isActive
            ? "bg-primary-600 text-white dark:bg-primary-700"
            : "bg-black/5 text-black/35 group-hover/link:bg-black/10 group-hover/link:text-black/55 dark:bg-white/10 dark:text-white/35 dark:group-hover/link:bg-white/25 dark:group-hover/link:text-white/75"
        )}
      >
        <Icon className="size-6" />
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          isActive
            ? "text-black dark:text-white"
            : "text-black/50 group-hover/link:text-black/85 dark:text-white/50 dark:group-hover/link:text-white/85"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

// ==================================================================================================================================

function LogoutButton() {
  const handleClick = async () => {
    await deleteEmployeeSession();
    window.location.reload();
  };

  return (
    <button onClick={handleClick} className="flex items-center gap-x-3 group/link">
      <div className="rounded p-2 transition-colors duration-200 *:size-[1.25rem] 2k:*:size-[1.5rem] bg-black/5 text-black/35 group-hover/link:bg-black/10 group-hover/link:text-black/55 dark:bg-white/10 dark:text-white/35 dark:group-hover/link:bg-white/25 dark:group-hover/link:text-white/75">
        <LogOut className="size-6" />
      </div>
      <span className="text-sm font-medium transition-colors duration-200text-black/50 group-hover/link:text-black/85 dark:text-white/50 dark:group-hover/link:text-white/85">
        Déconnexion
      </span>
    </button>
  );
}

// ==================================================================================================================================
