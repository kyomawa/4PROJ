"use client";

// =============================================================================

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormInputField } from "@/components/FormFields/FormInputField";
import FormPasswordField from "@/components/FormFields/FormPasswordField";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { serialize } from "object-to-formdata";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/actions/auth/schema";
import { register } from "@/actions/auth/action";

// =============================================================================

export default function ClientSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const toastId = toast.loading("Inscription en cours.");
    console.log(values);
    const formData = serialize({ ...values }, { nullsAsUndefineds: true });
    const { success, message } = await register(formData);

    if (!success) {
      toast.error(message, { id: toastId });
      setIsLoading(false);
      return;
    }

    toast.success(message, { id: toastId });
    router.push("/");
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-4/5 xl:w-[65%] space-y-10">
        <div className="space-y-5">
          <FormInputField form={form} name="username" title="Nom" placeholder="Votre nom" variant="line" isRequired />
          <FormInputField
            form={form}
            name="email"
            title="Email"
            placeholder="Votre adresse mail"
            variant="line"
            isRequired
          />
          <FormInputField form={form} name="phoneNumber" title="Téléphone" placeholder="Votre téléphone" isRequired />
          <FormPasswordField
            form={form}
            name="password"
            title="Mot de passe"
            placeholder="Votre mot de passe"
            variant="line"
            isRequired
          />
          <FormPasswordField
            form={form}
            name="confirmPassword"
            title="Confirmer le mot de passe"
            placeholder="Confirmer votre mot de passe"
            variant="line"
            isRequired
          />
        </div>
        <Button type="submit" className="w-full rounded-full px-4 py-6" isLoading={isLoading}>
          S&apos;inscrire
        </Button>
      </form>
    </Form>
  );
}

// =============================================================================
