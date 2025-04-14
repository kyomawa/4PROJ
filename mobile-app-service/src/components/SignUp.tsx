import FormField from "./FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import * as Animatable from "react-native-animatable";
import Button from "./Button";

// ========================================================================================================

const signUpSchema = z
  .object({
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
    password: z.string().min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" }),
    confirmPassword: z.string().min(12, { message: "Le mot de passe doit contenir au moins 12 caractères" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// ========================================================================================================

export default function SignUp() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { nom: "", email: "", password: "", confirmPassword: "" },
  });

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
      <Button>S'inscrire</Button>
    </Animatable.View>
  );
}

// ========================================================================================================
