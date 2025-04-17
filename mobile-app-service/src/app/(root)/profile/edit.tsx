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
import { StatusBar } from "expo-status-bar";

// ========================================================================================================

const editProfileSchema = z.object({
  username: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Veuillez entrer un numéro de téléphone valide" })
    .regex(/^\d+$/, { message: "Le numéro de téléphone doit contenir uniquement des chiffres" }),
  currentPassword: z.string().min(1, { message: "Veuillez entrer votre mot de passe actuel" }),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ========================================================================================================

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setValue } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      currentPassword: "",
    },
  });

  // ========================================================================================================

  const handleUpdateProfile = async (data: EditProfileFormData) => {
    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour mettre à jour votre profil.");
      return;
    }

    try {
      setIsLoading(true);

      const success = await updateProfile({
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        currentPassword: data.currentPassword,
      });

      if (success) {
        setValue("currentPassword", "");
        Alert.alert("Profil mis à jour", "Vos informations ont été mises à jour avec succès.", [{ text: "OK" }]);
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

  // ========================================================================================================

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-10">
        <StatusBar style="dark" />
        <Text className="text-red-500">Vous devez être connecté pour accéder à cette page.</Text>
        <TouchableOpacity onPress={() => router.replace("/")} className="mt-4 p-3 bg-primary-500 rounded-full">
          <Text className="text-white">Se connecter</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ========================================================================================================

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
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
            name="email"
            placeholder="votre@email.com"
            label="Email"
            icon="Mail"
            keyboardType="email-address"
          />
          <FormField
            control={control}
            name="phoneNumber"
            placeholder="0612345678"
            label="Téléphone"
            icon="Phone"
            keyboardType="phone-pad"
          />
          <FormField
            control={control}
            name="currentPassword"
            placeholder="Entrez votre mot de passe actuel"
            label="Mot de passe actuel"
            icon="Lock"
            passwordField
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
