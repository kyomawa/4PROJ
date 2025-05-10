"use client";

import { useState } from "react";
import { deleteAccount, updateUserProfile, UserData } from "@/actions/user/action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/FormFields/FormInputField";
import FormPasswordField from "@/components/FormFields/FormPasswordField";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: data?.username || "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber ? data.phoneNumber : "",
      currentPassword: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    const formData = new FormData();

    // Add data to FormData
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("currentPassword", values.currentPassword);

    try {
      const response = await updateUserProfile(data.id, formData);

      if (!response.success) {
        toast.error(response.message || "Erreur lors de la mise à jour du profil");
        console.error("Profile update error:", response.error);
        setIsLoading(false);
        return;
      }

      toast.success("Profil mis à jour avec succès");
      router.refresh();
    } catch (error) {
      console.error("Error during profile update:", error);
      toast.error("Une erreur technique est survenue lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await deleteAccount(data.id);

      if (response.success) {
        toast.success(response.message);
        router.push("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      toast.error("Une erreur inattendue est survenue lors de la suppression du compte");
    } finally {
      setIsDeletingAccount(false);
    }
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
            <FormInputField form={form} name="phoneNumber" title="Téléphone" placeholder="Votre téléphone" isRequired />
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

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                  Supprimer mon compte
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmation de suppression du compte</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte et toutes les données
                    associées ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={handleDeleteAccount} isLoading={isDeletingAccount}>
                      Supprimer définitivement
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================================================
