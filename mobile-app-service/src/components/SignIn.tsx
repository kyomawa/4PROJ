import { View } from "react-native";
import FormField from "./FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import * as Animatable from "react-native-animatable";
import Button from "./Button";

// ========================================================================================================

const signInSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string(),
});

type SignInFormData = z.infer<typeof signInSchema>;

type SignInProps = {
  onSubmit?: (data: SignInFormData) => void;
  isLoading?: boolean;
};

// ========================================================================================================

export default function SignIn({ onSubmit, isLoading = false }: SignInProps) {
  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const submitForm = (data: SignInFormData) => {
    if (onSubmit) {
      onSubmit(data);
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
      <Button handlePress={handleSubmit(submitForm)} isLoading={isLoading}>
        Se connecter
      </Button>
    </Animatable.View>
  );
}

// ========================================================================================================
