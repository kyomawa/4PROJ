import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";

export default function ProfileScreen() {
  const [avoidTolls, setAvoidTolls] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [voiceNavigation, setVoiceNavigation] = React.useState(true);

  const handleLogout = () => {
    // Clear any auth state
    // For example: await AsyncStorage.removeItem('userToken');

    // Navigate to login screen
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <ScrollView>
        {/* Header */}
        <View className="p-4 border-b border-neutral-200">
          <Text className="text-2xl font-satoshi-Bold">Profil</Text>
        </View>

        {/* Profile Info */}
        <View className="p-6 items-center">
          <View className="bg-primary-100 w-24 h-24 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl font-satoshi-Bold text-primary-500">JD</Text>
          </View>
          <Text className="text-xl font-satoshi-Bold mb-1">John Doe</Text>
          <Text className="text-neutral-500 mb-4">john.doe@example.com</Text>

          <TouchableOpacity className="flex-row items-center">
            <Icon name="Pen" className="size-4 text-primary-500 mr-2" />
            <Text className="text-primary-500">Modifier le Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View className="px-4 py-6">
          <Button handlePress={handleLogout} containerClassName="bg-red-500">
            Se déconnecter
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
