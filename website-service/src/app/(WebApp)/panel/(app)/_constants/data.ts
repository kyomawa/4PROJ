import { LayoutDashboard, Siren } from "lucide-react";
import { SidebarLinkProps } from "./type";

// =============================================================================================

export const sidebarLinks: SidebarLinkProps[] = [
  { path: "/panel/tableau-de-bord", Icon: LayoutDashboard, label: "Tableau de bord" },
  { path: "/panel/incidents", Icon: Siren, label: "Incident" },
];

// =============================================================================================
