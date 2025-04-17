import { LucideProps } from "lucide-react";

// =============================================================================================

export type SidebarLinkProps = {
  path: string;
  label: string;
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
};

// =============================================================================================
