"use client";

// =============================================================================

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/actions/authentication/schema";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormInputField } from "@/components/FormFields/FormInputField";
import FormPasswordField from "@/components/FormFields/FormPasswordField";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { serialize } from "object-to-formdata";
import toast from "react-hot-toast";
import { employeeLogin } from "@/actions/authentication/action";
import { useRouter } from "next/navigation";

// =============================================================================

export default function EmployeeSignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const toastId = toast.loading("Connexion en cours");
    const formData = serialize({ ...values });
    const { success, message } = await employeeLogin(formData);

    if (!success) {
      toast.error(message, { id: toastId });
      setIsLoading(false);
      return;
    }

    toast.success(message, { id: toastId });
    router.push("/panel/tableau-de-bord");
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-4/5 xl:w-[65%] space-y-10">
        <div className="space-y-5">
          <FormInputField
            form={form}
            name="email"
            title="Email"
            placeholder="Votre adresse mail"
            variant="line"
            isRequired
          />
          <FormPasswordField
            form={form}
            name="password"
            title="Mot de passe"
            placeholder="Votre mot de passe"
            variant="line"
            isRequired
          />
        </div>
        <Button type="submit" className="w-full rounded-full px-4 py-6" isLoading={isLoading}>
          Se Connecter
        </Button>
      </form>
    </Form>
  );
}

// =============================================================================
