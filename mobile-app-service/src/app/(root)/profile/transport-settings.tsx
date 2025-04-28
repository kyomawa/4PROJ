import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Icon from "../../../components/Icon";
import { usePreferences } from "../../../contexts/PreferencesContext";
import { getTransportModeIcon, getTransportModeLabel, TransportMode } from "../../../components/TransportModeSelector";
import TransportModeSelector from "../../../components/TransportModeSelector";

// ========================================================================================================

export default function TransportSettingsScreen() {
  const { defaultTransportMode, setDefaultTransportMode } = usePreferences();
  const [showModeSelector, setShowModeSelector] = useState(false);

  // ========================================================================================================

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // ========================================================================================================

  // Handle transport mode change
  const handleTransportModeChange = async (mode: TransportMode) => {
    await setDefaultTransportMode(mode);
  };

  // ========================================================================================================

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />

      <View className="flex-row items-center p-4 border-b border-neutral-200">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <Icon name="ArrowLeft" className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-satoshi-Bold flex-1">Mode de transport</Text>
      </View>

      <View className="p-4">
        <Text className="text-neutral-500 mb-4">
          Sélectionnez votre mode de transport par défaut pour la navigation. Ce paramètre sera utilisé lors du calcul
          de vos itinéraires.
        </Text>

        <TouchableOpacity
          onPress={() => setShowModeSelector(true)}
          className="flex-row items-center p-4 bg-white rounded-xl mb-4"
        >
          <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
            <Icon name={getTransportModeIcon(defaultTransportMode)} className="size-5 text-primary-500" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-neutral-500">Mode de transport actuel</Text>
            <Text className="text-lg font-satoshi-Medium">{getTransportModeLabel(defaultTransportMode)}</Text>
          </View>
          <Icon name="ChevronRight" className="size-5 text-neutral-400" />
        </TouchableOpacity>
      </View>

      <TransportModeSelector
        visible={showModeSelector}
        onClose={() => setShowModeSelector(false)}
        selectedMode={defaultTransportMode}
        onSelect={handleTransportModeChange}
      />
    </SafeAreaView>
  );
}

// ========================================================================================================
