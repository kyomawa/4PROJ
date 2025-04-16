import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import FormField from "../../../components/FormField";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import { useAuthContext } from "../../../contexts/AuthContext";

// ========================================================================================================

const editProfileSchema = z.object({
  username: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Veuillez entrer un numéro de téléphone valide" })
    .regex(/^\d+$/, { message: "Le numéro de téléphone doit contenir uniquement des chiffres" }),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ========================================================================================================

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const handleUpdateProfile = async (data: EditProfileFormData) => {
    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour mettre à jour votre profil.");
      return;
    }

    try {
      setIsLoading(true);

      const success = await updateProfile({
        username: data.username,
        phoneNumber: data.phoneNumber,
      });

      if (success) {
        Alert.alert("Profil mis à jour", "Vos informations ont été mises à jour avec succès.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Échec de la mise à jour", "Impossible de mettre à jour votre profil. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la mise à jour de votre profil. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
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
          <Text className="text-xl font-satoshi-Bold flex-1">Modifier le profil</Text>
        </View>

        {/* Form */}
        <View className="p-6 gap-6">
          <FormField control={control} name="username" placeholder="Votre nom" label="Nom" icon="User" />

          <FormField
            control={control}
            name="phoneNumber"
            placeholder="0612345678"
            label="Téléphone"
            icon="Phone"
            keyboardType="phone-pad"
          />

          <Button handlePress={handleSubmit(handleUpdateProfile)} isLoading={isLoading}>
            Enregistrer les modifications
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================================================================================
