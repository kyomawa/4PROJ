import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "./Icon";

// ========================================================================================================

type ActiveNavigationBannerProps = {
  className?: string;
  destination: string;
  onPress: () => void;
};

export default function ActiveNavigationBanner({ destination, onPress, className }: ActiveNavigationBannerProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-primary-500 rounded-lg p-3 flex-row items-center shadow-md ${className}`}
    >
      <Icon name="Navigation" className="text-white size-5 mr-3" />
      <View className="flex-1">
        <Text className="text-white font-satoshi-Bold">Navigation en cours</Text>
        <Text className="text-white/80 text-sm" numberOfLines={1}>
          Vers {destination}
        </Text>
      </View>
      <Icon name="ChevronRight" className="text-white size-5" />
    </TouchableOpacity>
  );
}

// ========================================================================================================
