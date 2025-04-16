import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Icon from "../../../components/Icon";
import Button from "../../../components/Button";
import { useAuthContext } from "../../../contexts/AuthContext";

// ========================================================================================================

export default function AccountSettingsScreen() {
  const { user, deleteAccount } = useAuthContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour supprimer votre compte.");
      return;
    }

    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);

      const success = await deleteAccount();

      if (success) {
        Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.", [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]);
      } else {
        Alert.alert("Échec de la suppression", "Impossible de supprimer votre compte. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la tentative de suppression de votre compte. Veuillez réessayer."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-10">
        <Text className="text-red-500">Vous devez être connecté pour accéder à cette page.</Text>
        <TouchableOpacity onPress={() => router.replace("/")} className="mt-4 p-3 bg-primary-500 rounded-full">
          <Text className="text-white">Se connecter</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-neutral-200">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Icon name="ArrowLeft" className="size-6" />
          </TouchableOpacity>
          <Text className="text-xl font-satoshi-Bold flex-1">Paramètres du compte</Text>
        </View>

        <View className="flex-1 flex-col gap-y-4 mt-6">
          {/* Account Info */}
          <View className="px-6">
            <Text className="text-lg font-satoshi-Medium mb-1">Informations du compte</Text>
            <Text className="text-neutral-500 mb-4">
              Email: {user.email}
              {"\n"}
              Rôle: {user.role === "Admin" ? "Administrateur" : "Utilisateur"}
            </Text>
          </View>

          {/* Danger Zone */}
          <View className="px-6">
            <Text className="text-lg font-satoshi-Bold text-red-500 mb-2">Zone dangereuse</Text>
            <Text className="text-neutral-500 mb-8">
              Les actions ci-dessous sont permanentes et ne peuvent pas être annulées.
            </Text>

            <Button handlePress={handleDeleteAccount} containerClassName="bg-red-500" isLoading={isDeleting}>
              Supprimer mon compte
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================================================================================
