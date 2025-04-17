import React, { useState } from "react";
import { Alert } from "react-native";
import FormField from "./FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import * as Animatable from "react-native-animatable";
import Button from "./Button";
import { router } from "expo-router";
import { useAuthContext } from "../contexts/AuthContext";

// ========================================================================================================

const signUpSchema = z
  .object({
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirmPassword: z.string().min(1, { message: "Veuillez confirmer votre mot de passe" }),
    telephone: z
      .string()
      .min(8, { message: "Veuillez entrer un numéro de téléphone valide" })
      .regex(/^\d+$/, { message: "Le numéro de téléphone doit contenir uniquement des chiffres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

// ========================================================================================================

export default function SignUp() {
  const { register } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nom: "",
      email: "",
      password: "",
      confirmPassword: "",
      telephone: "",
    },
  });

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      const success = await register({
        username: data.nom,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.telephone,
      });

      if (success) {
        Alert.alert(
          "Inscription réussie",
          "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
          [
            {
              text: "Se connecter",
              onPress: () => router.replace("/"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Échec de l'inscription",
          "Impossible de créer votre compte. Veuillez vérifier vos informations et réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la tentative d'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" className="flex flex-col mt-4 gap-y-4">
      <FormField control={control} name="nom" placeholder="Votre nom" label="Nom" icon="User" />
      <FormField control={control} name="email" placeholder="Votre adresse mail" label="Email" icon="Mail" />
      <FormField
        control={control}
        name="password"
        passwordField
        placeholder="************"
        label="Mot de passe"
        icon="Lock"
      />
      <FormField
        control={control}
        passwordField
        name="confirmPassword"
        label="Confirmer le mot de passe"
        placeholder="************"
        icon="Lock"
      />
      <FormField
        control={control}
        name="telephone"
        placeholder="0612345678"
        label="Téléphone"
        icon="Phone"
        keyboardType="phone-pad"
      />
      <Button handlePress={handleSubmit(handleSignUp)} isLoading={isLoading}>
        S'inscrire
      </Button>
    </Animatable.View>
  );
}

// ========================================================================================================
