import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import ActiveNavigationBanner from "../../../components/ActiveNavigationBanner";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useNavigation } from "../../../contexts/NavigationContext";
import { StatusBar } from "expo-status-bar";

// ========================================================================================================

export default function ProfileScreen() {
  const { user, loading, logout } = useAuthContext();
  const { hasActiveNavigation } = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ========================================================================================================

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const success = await logout();

      if (success) {
        router.replace("/");
      } else {
        Alert.alert("Erreur", "Un problème est survenu lors de la déconnexion. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Erreur", "Un problème est survenu lors de la déconnexion. Veuillez réessayer.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ========================================================================================================

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // ========================================================================================================

  const navigateToEditProfile = () => {
    router.push("/profile/edit");
  };

  // ========================================================================================================

  const navigateToAccountSettings = () => {
    router.push("/profile/account-settings");
  };

  // ========================================================================================================

  const resumeNavigation = () => {
    router.push("/navigation");
  };

  // ========================================================================================================

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-10">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Chargement du profil...</Text>
      </SafeAreaView>
    );
  }

  // ========================================================================================================

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      <ScrollView>
        {/* Header */}
        <View className="p-4 border-b border-neutral-200">
          <Text className="text-2xl font-satoshi-Bold">Profil</Text>
        </View>

        {/* Profile Info */}
        <View className="p-6 items-center">
          <View className="bg-primary-100 w-24 h-24 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl font-satoshi-Bold text-primary-500">
              {user ? getInitials(user.username) : "?"}
            </Text>
          </View>
          <Text className="text-xl font-satoshi-Bold mb-1">{user ? user.username : "Utilisateur"}</Text>
          <Text className="text-neutral-500 mb-1">{user ? user.email : "email@exemple.com"}</Text>
          <Text className="text-neutral-500 mb-4">{user ? user.phoneNumber : ""}</Text>
          <TouchableOpacity className="flex-row items-center" onPress={navigateToEditProfile}>
            <Icon name="Pen" className="size-4 text-primary-500 mr-2" />
            <Text className="text-primary-500">Modifier le Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Active Navigation Banner */}
        {hasActiveNavigation && (
          <View className="my-4 mx-4">
            <ActiveNavigationBanner onPress={resumeNavigation} />
          </View>
        )}

        {/* Account Settings */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-satoshi-Medium mb-3">Paramètres du compte</Text>
          <View className="bg-white rounded-xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-neutral-100">
              <Icon name="Bell" className="size-6 text-neutral-600 mr-4" />
              <Text className="text-base flex-1">Notifications</Text>
              <Icon name="ChevronRight" className="size-5 text-neutral-400" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-neutral-100"
              onPress={navigateToAccountSettings}
            >
              <Icon name="Settings" className="size-6 text-neutral-600 mr-4" />
              <Text className="text-base flex-1">Paramètres du compte</Text>
              <Icon name="ChevronRight" className="size-5 text-neutral-400" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Logout Button */}
        <View className="px-4 py-6 mt-4">
          <Button handlePress={handleLogout} containerClassName="bg-red-500" isLoading={isLoggingOut}>
            Se déconnecter
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================================================================================
