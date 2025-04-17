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

const signInSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

type SignInFormData = z.infer<typeof signInSchema>;

type SignInProps = {
  onSubmit?: (data: SignInFormData) => void;
  isLoading?: boolean;
};

// ========================================================================================================

export default function SignIn({ onSubmit, isLoading: parentIsLoading = false }: SignInProps) {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(parentIsLoading);
  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      const success = await login({
        email: data.email,
        password: data.password,
      });
      if (success) {
        if (onSubmit) {
          onSubmit(data);
        } else {
          router.replace("/home");
        }
      } else {
        Alert.alert(
          "Échec de connexion",
          "Impossible de se connecter avec les identifiants fournis. Veuillez vérifier votre email et mot de passe."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la tentative de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" className="flex flex-col mt-4 gap-y-4">
      <FormField control={control} name="email" placeholder="Votre adresse mail" label="Email" icon="Mail" />
      <FormField
        control={control}
        name="password"
        passwordField
        placeholder="************"
        label="Mot de passe"
        icon="Lock"
      />
      <Button handlePress={handleSubmit(handleLogin)} isLoading={isLoading || parentIsLoading}>
        Se connecter
      </Button>
    </Animatable.View>
  );
}

// ========================================================================================================
