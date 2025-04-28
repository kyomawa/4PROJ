import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from "./Icon";
import { IconProps } from "./Icon";

// ========================================================================================================

export type TransportMode = "car" | "bike" | "foot" | "train";

const TRANSPORT_MODES: {
  value: TransportMode;
  label: string;
  icon: IconProps["name"];
}[] = [
  { value: "car", label: "Voiture", icon: "Car" },
  { value: "bike", label: "Vélo", icon: "Bike" },
  { value: "foot", label: "À pied", icon: "Footprints" },
  { value: "train", label: "Transport", icon: "TrainFront" },
];

// ========================================================================================================

type TransportModeSelectorProps = {
  visible: boolean;
  onClose: () => void;
  selectedMode: TransportMode;
  onSelect: (mode: TransportMode) => void;
};

// ========================================================================================================

export default function TransportModeSelector({
  visible,
  onClose,
  selectedMode,
  onSelect,
}: TransportModeSelectorProps) {
  const handleSelect = (mode: TransportMode) => {
    onSelect(mode);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end items-center bg-black/30">
        <View className="bg-white w-full p-5 rounded-t-3xl">
          <View className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-satoshi-Bold">Mode de transport</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Icon name="X" className="size-5 text-neutral-500" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            {TRANSPORT_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                onPress={() => handleSelect(mode.value)}
                className={`flex-row items-center p-4 mb-2 rounded-xl ${
                  selectedMode === mode.value ? "bg-primary-100 border border-primary-500" : "bg-neutral-50"
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    selectedMode === mode.value ? "bg-primary-500" : "bg-neutral-200"
                  }`}
                >
                  <Icon
                    name={mode.icon}
                    className={`size-5 ${selectedMode === mode.value ? "text-white" : "text-neutral-600"}`}
                  />
                </View>
                <Text
                  className={`text-lg ${
                    selectedMode === mode.value ? "font-satoshi-Bold text-primary-500" : "text-neutral-700"
                  }`}
                >
                  {mode.label}
                </Text>
                {selectedMode === mode.value && (
                  <View className="ml-auto">
                    <Icon name="Check" className="size-5 text-primary-500" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ========================================================================================================

export const getTransportModeLabel = (mode: TransportMode): string => {
  return TRANSPORT_MODES.find((m) => m.value === mode)?.label || "Voiture";
};

export const getTransportModeIcon = (mode: TransportMode): IconProps["name"] => {
  return TRANSPORT_MODES.find((m) => m.value === mode)?.icon || "Car";
};

// ========================================================================================================
