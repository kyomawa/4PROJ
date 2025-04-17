import React from "react";
import { icons } from "lucide-react-native";
import { cssInterop } from "nativewind";

// ========================================================================================================

const StyledIcons: Record<keyof typeof icons, React.ComponentType<any>> = {} as Record<
  keyof typeof icons,
  React.ComponentType<any>
>;

(Object.keys(icons) as Array<keyof typeof icons>).forEach((iconName) => {
  const IconComponent = icons[iconName];
  cssInterop(IconComponent, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
        height: true,
        width: true,
        stroke: true,
      },
    },
  });
  StyledIcons[iconName] = IconComponent;
});

// ========================================================================================================

export type IconProps = {
  name: keyof typeof icons;
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  const LucideIcon = StyledIcons[name];

  if (!LucideIcon) {
    console.warn(`L'Icon "${name}" n'existe pas dans lucide-react-native.`);
    return null;
  }

  return <LucideIcon className={`text-black stroke-[1.75] ${className}`} />;
};

export default Icon;

// ========================================================================================================
