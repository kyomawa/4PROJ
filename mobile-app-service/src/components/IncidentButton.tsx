import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "./Icon";

// ========================================================================================================

type IncidentButtonProps = {
  onPress: () => void;
};

// ========================================================================================================

export default function IncidentButton({ onPress }: IncidentButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-primary-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      activeOpacity={0.7}
    >
      <Icon name="Plus" className="text-white size-7" />
    </TouchableOpacity>
  );
}

// ========================================================================================================
