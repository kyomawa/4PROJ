import TooltipComponent from "@/components/TooltipComponent";
import { ChevronLeft } from "lucide-react";
import { Link } from "next-view-transitions";
import React from "react";

// ================================================================================================

type SubHeaderProps = {
  title: string;
  button: React.ReactNode | React.JSX.Element;
  backUrl?: string;
  backLabel?: string;
  hideButton?: boolean;
};

// ================================================================================================

export default function SubHeader({ title, button, hideButton, backUrl, backLabel }: SubHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-x-2.5 items-center">
        {backUrl && (
          <TooltipComponent label={backLabel || "Retour"}>
            <Link href={backUrl} className="rounded-full p-1 bg-neutral-200">
              <ChevronLeft className="size-5 text-neutral-800" />
            </Link>
          </TooltipComponent>
        )}
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>
      {!hideButton && button}
    </div>
  );
}
// ================================================================================================
