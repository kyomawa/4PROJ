"use client";

import { useState } from "react";
import { updateUserProfile, UserData } from "@/actions/user/action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/FormFields/FormInputField";
import FormPasswordField from "@/components/FormFields/FormPasswordField";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import FormInputPhoneNumberField from "@/components/FormFields/FormInputPhoneNumberField";
import { UserIcon } from "lucide-react";
import { toE164 } from "@/utils/phone";

// =============================================================================================

const profileSchema = z.object({
  username: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  phoneNumber: z.string().min(8, "Numéro de téléphone invalide"),
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// =============================================================================================

type ProfileProps = {
  data: UserData;
};

export default function Profile({ data }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: data?.username || "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber ? toE164(data.phoneNumber) : "",
      currentPassword: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("currentPassword", values.currentPassword);

    const response = await updateUserProfile(data.id, formData);

    if (!response.success) {
      toast.error(response.message || "Erreur lors de la mise à jour du profil");
      setIsLoading(false);
      return;
    }

    toast.success("Profil mis à jour avec succès");
    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <div className="bg-primary-100 rounded-full p-4">
            <UserIcon className="size-12 text-primary-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mon Profil</h1>
            <p className="text-neutral-500">Gérez vos informations personnelles</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInputField form={form} name="username" title="Pseudo" placeholder="Votre pseudo" isRequired />

            <FormInputField
              form={form}
              name="email"
              title="Email"
              placeholder="Votre adresse email"
              type="email"
              isRequired
            />

            <FormInputPhoneNumberField
              form={form}
              name="phoneNumber"
              title="Téléphone"
              placeholder="Votre numéro de téléphone"
              isRequired
            />

            <FormPasswordField
              form={form}
              name="currentPassword"
              title="Mot de passe actuel"
              placeholder="Votre mot de passe actuel"
              isRequired
              description="Pour confirmer les modifications"
            />

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Mettre à jour le profil
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Autres actions</h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="text-primary-700 border-primary-200"
              onClick={() => router.push("/itineraires")}
            >
              Mes itinéraires
            </Button>

            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => {}}
            >
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================================================
