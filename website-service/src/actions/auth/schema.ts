import { zfd } from "zod-form-data";
import { z } from "zod";

// =======================================================================================

export const registerSchema = z
  .object({
    username: z
      .string()
      .toLowerCase()
      .trim()
      .min(3, {
        message: "Le pseudo doit contenir au moins 3 caractères",
      })
      .max(32, {
        message: "Le pseudo ne doit pas dépasser 20 caractères",
      }),
    phoneNumber: z
      .string()
      .min(8, { message: "Veuillez entrer un numéro de téléphone valide" })
      .regex(/^\d+$/, { message: "Le numéro de téléphone doit contenir uniquement des chiffres" }),
    email: z
      .string()
      .toLowerCase()
      .trim()
      .min(1, {
        message: "L'adresse email est requise",
      })
      .email({ message: "L'adresse email est invalide" })
      .max(50, {
        message: "L'adresse email ne doit pas dépasser 50 caractères",
      }),
    password: z
      .string()
      .trim()
      .min(12, {
        message: "Le mot de passe doit contenir au moins 12 caractères",
      })
      .max(32, {
        message: "Le mot de passe ne doit pas dépasser 32 caractères",
      })
      .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{12,}$"), {
        message:
          "Le mot de passe doit contenir au moins 12 caractères, dont un chiffre, une lettre minuscule et une lettre majuscule",
      }),
    confirmPassword: z
      .string()
      .trim()
      .min(12, {
        message: "Le mot de passe doit contenir au moins 12 caractères",
      })
      .max(32, {
        message: "Le mot de passe ne doit pas dépasser 32 caractères",
      }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// =======================================================================================

export const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z
    .string()
    .trim()
    .min(1, {
      message: "Le mot de passe est requis",
    })
    .max(32, {
      message: "Veuillez entrer un mot de passe valide.",
    }),
});

// ====================================== FORMDATA =======================================

export const registerSchemaFormData = zfd.formData(registerSchema);

// =======================================================================================

export const loginSchemaFormData = zfd.formData(loginSchema);

// =======================================================================================
