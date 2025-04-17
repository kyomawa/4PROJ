"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface BaseProps {
  children: React.ReactNode;
}

interface RootFuselyProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
}

interface FuselyProps extends BaseProps {
  className?: string;
  asChild?: true;
  disableOutsideClick?: boolean;
}

const desktop = "(min-width: 768px)";

const Fusely = ({ children, ...props }: RootFuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyComponent = isDesktop ? Sheet : Drawer;
  return <FuselyComponent {...props}>{children}</FuselyComponent>;
};

const FuselyTrigger = ({ className, children, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyTriggerComponent = isDesktop ? SheetTrigger : DrawerTrigger;
  return (
    <FuselyTriggerComponent className={className} {...props}>
      {children}
    </FuselyTriggerComponent>
  );
};

const FuselyClose = ({ className, children, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyCloseComponent = isDesktop ? SheetClose : DrawerClose;
  return (
    <FuselyCloseComponent className={className} {...props}>
      {children}
    </FuselyCloseComponent>
  );
};

const FuselyContent = ({ className, children, disableOutsideClick = true, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyContentComponent = isDesktop ? SheetContent : DrawerContent;
  const disableClick = isDesktop ? disableOutsideClick : undefined;
  return (
    <FuselyContentComponent disableOutsideClick={disableClick} className={className} {...props}>
      {children}
    </FuselyContentComponent>
  );
};

const FuselyDescription = ({ className, children, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyDescriptionComponent = isDesktop ? SheetDescription : DrawerDescription;
  return (
    <FuselyDescriptionComponent className={className} {...props}>
      {children}
    </FuselyDescriptionComponent>
  );
};

const FuselyHeader = ({ className, children, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyHeaderComponent = isDesktop ? SheetHeader : DrawerHeader;
  return (
    <FuselyHeaderComponent className={className} {...props}>
      {children}
    </FuselyHeaderComponent>
  );
};

const FuselyTitle = ({ className, children, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyTitleComponent = isDesktop ? SheetTitle : DrawerTitle;
  return (
    <FuselyTitleComponent className={className} {...props}>
      {children}
    </FuselyTitleComponent>
  );
};

const FuselyBody = ({ className, children, ...props }: FuselyProps) => {
  return (
    <div
      className={cn(
        "overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full p-6 [&::-webkit-scrollbar-thumb]:bg-neutral-200 blue:[&::-webkit-scrollbar-thumb]:bg-primary-200/65 [&::-webkit-scrollbar]:w-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const FuselyFooter = ({ className, children, ...props }: FuselyProps) => {
  const isDesktop = useMediaQuery(desktop);
  const FuselyFooterComponent = isDesktop ? SheetFooter : DrawerFooter;
  return (
    <FuselyFooterComponent className={className} {...props}>
      {children}
    </FuselyFooterComponent>
  );
};

export {
  Fusely,
  FuselyTrigger,
  FuselyClose,
  FuselyContent,
  FuselyDescription,
  FuselyHeader,
  FuselyTitle,
  FuselyBody,
  FuselyFooter,
};
