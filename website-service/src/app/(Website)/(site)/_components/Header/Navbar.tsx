"use client";

// =========================================================================================================

import { navbarData } from "@/constants/data";
import { NavbarDataProps } from "@/constants/type";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

// =========================================================================================================

export default function Navbar() {
  return (
    <nav>
      <ul className="flex gap-x-4 max-md:hidden">
        {navbarData.map((item) => (
          <NavbarItem key={item.label} {...item} />
        ))}
      </ul>
    </nav>
  );
}

// =========================================================================================================

function NavbarItem({ label, path }: NavbarDataProps) {
  const pathname = usePathname();
  const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <li key={label} className="text-black/75 hover:text-black transition-colors duration-150 relative">
      {/* Label */}
      <Link href={path}>{label}</Link>
      {/* Line */}
      <motion.div
        className="absolute bottom-0 h-0.5 w-full bg-primary-500"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "100%" : 0 }}
        transition={{ duration: 0.2 }}
      />
    </li>
  );
}

// =========================================================================================================
