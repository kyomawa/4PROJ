"use client";

// ==================================================================================================================================

import { Dispatch, SetStateAction, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { sidebarLinks } from "../_constants/data";
import { SidebarLinkProps } from "../_constants/type";
import { LogOut } from "lucide-react";
import { deleteEmployeeSession } from "@/lib/sessionEmployee";

// ==================================================================================================================================

type SidebarMobileProps = {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function SidebarMobile({ showSidebar, setShowSidebar }: SidebarMobileProps) {
  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showSidebar]);

  return (
    <>
      {/* Sidebar Mobile */}
      <motion.section
        initial={{
          x: "-100%",
        }}
        animate={showSidebar ? "open" : "close"}
        variants={sidebarVariant}
        className="fixed bottom-0 left-0 top-0 z-[9999] flex w-56 flex-col justify-between border-r border-neutral-400/15 bg-neutral-50 dark:bg-primary-1000 text-neutral-50 sm:w-64"
      >
        {/* Logo + NavItems du Milieu */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center border-b border-neutral-400/15 p-4">
            <Logo className="dark:*:!fill-white" />
          </div>
          {/* NavItems */}
          <div className="flex flex-1 flex-col gap-y-1.5 p-4">
            {sidebarLinks.map((link, idx) => {
              return <Item key={idx} link={link} setShowSidebar={setShowSidebar} />;
            })}
          </div>
          {/* Logout */}
          <div onClick={deleteEmployeeSession} className="p-4">
            <Item
              link={{ path: "/panel/connexion", label: "Déconnexion", Icon: LogOut }}
              setShowSidebar={setShowSidebar}
            />
          </div>
        </div>
      </motion.section>

      {/* Black Filter */}
      <motion.div
        className="fixed inset-0 z-[9998] size-full bg-black/75 backdrop-blur-[2px]"
        onClick={() => setShowSidebar(false)}
        initial={{
          opacity: 0,
          display: "none",
        }}
        transition={{
          duration: 0,
        }}
        animate={showSidebar ? "open" : "close"}
        variants={blackFilterVariant}
      />
    </>
  );
}

// ==================================================================================================================================

type ItemProps = {
  link: SidebarLinkProps;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
};

function Item({ link, setShowSidebar }: ItemProps) {
  const { path, Icon, label } = link;
  const pathname = usePathname();
  const isActive = pathname.startsWith(path);

  return (
    <Link onClick={() => setShowSidebar(false)} href={path} className="flex items-center gap-x-3">
      <div
        className={cn(
          "p-2 rounded",
          isActive
            ? "text-white bg-primary-600 dark:bg-primary-700"
            : "text-black/35 dark:text-white/35 bg-black/5 dark:bg-white/10"
        )}
      >
        <Icon className="size-6" />
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          isActive ? "dark:text-white text-black" : "dark:text-white/50 text-black/50"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

// ==================================================================================================================================

const sidebarVariant = {
  open: {
    x: 0,
    transition: {
      type: "tween",
    },
  },
  close: {
    x: "-100%",
    display: "none",
  },
};

const blackFilterVariant = {
  open: {
    opacity: 100,
    display: "block",
  },
  close: {
    opacity: 0,
    display: "none",
  },
};

// ==================================================================================================================================
