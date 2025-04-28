import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Icon from "../../../components/Icon";
import SavedItineraries from "../../../components/SavedItineraries";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

// ========================================================================================================

export default function SavedItinerariesScreen() {
  const { isLoggedIn } = useAuthContext();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ========================================================================================================

  useFocusEffect(
    useCallback(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, [])
  );

  // ========================================================================================================

  const handleBack = () => {
    router.back();
  };

  // ========================================================================================================

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-10">
        <StatusBar style="dark" />

        <View className="flex-row items-center p-4 border-b border-neutral-200">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <Icon name="ArrowLeft" className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-satoshi-Bold flex-1">Itinéraires sauvegardés</Text>
        </View>

        <View className="flex-1 items-center justify-center p-6">
          <Icon name="Lock" className="size-16 text-neutral-300 mb-4" />
          <Text className="text-lg text-center mb-4">
            Vous devez être connecté pour voir vos itinéraires sauvegardés
          </Text>
          <TouchableOpacity onPress={() => router.replace("/")} className="bg-primary-500 px-6 py-3 rounded-full">
            <Text className="text-white font-satoshi-Medium">Se connecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================================================================================

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />

      <View className="flex-row items-center p-4 border-b border-neutral-200">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <Icon name="ArrowLeft" className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-satoshi-Bold flex-1">Itinéraires sauvegardés</Text>
      </View>

      <SavedItineraries refreshTrigger={refreshTrigger} />
    </SafeAreaView>
  );
}

// ========================================================================================================
