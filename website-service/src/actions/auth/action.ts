"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchemaFormData, registerSchemaFormData } from "./schema";
import { API_BASE_URL } from "@/constants/api";

// =================================================================================================================

export async function register(formData: FormData): Promise<ApiResponse<null>> {
  const { success, data, error } = registerSchemaFormData.safeParse(formData);

  if (!success) {
    return {
      success: false,
      message: "Erreur lors de la validation des données.",
      error: error.errors[0].message,
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/user/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 409) {
      return {
        success: false,
        message: "Cet email est déjà utilisé",
        error: "Cet email est déjà utilisé",
      };
    }

    return {
      success: false,
      message: `Erreur lors de l'inscription (${response.status}): ${response.statusText}`,
      error: "Une erreur est survenue lors de l'inscription",
    };
  }

  await response.json();

  return {
    success: true,
    message: "Inscription réussie. Vous pouvez maintenant vous connecter.",
    data: null,
  };
}

// =================================================================================================================

export async function login(formData: FormData): Promise<ApiResponse<null>> {
  const { success, data, error } = loginSchemaFormData.safeParse(formData);

  if (!success) {
    return {
      success: false,
      message: "Données de formulaire invalides",
      error: error.errors[0].message,
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        success: false,
        message: "Email ou mot de passe incorrect",
        error: "Email ou mot de passe incorrect",
      };
    }

    return {
      success: false,
      message: `Une erreur est survenue lors de la connexion`,
      error: `Erreur lors de la connexion (${response.status}): ${response.statusText}`,
    };
  }

  const apiData = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("userToken", apiData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2, // 2 heures
    path: "/",
  });

  cookieStore.set("session", JSON.stringify(apiData.data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2, // 2 heures
    path: "/",
  });

  return {
    success: true,
    message: "Connexion réussie",
    data: null,
  };
}
// =================================================================================================================

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("userToken");
  cookieStore.delete("session");

  redirect("/");
}

// =================================================================================================================

export async function loginAdmin(formData: FormData): Promise<ApiResponse<null>> {
  const { success, data, error } = loginSchemaFormData.safeParse(formData);

  if (!success) {
    return {
      success: false,
      message: "Données de formulaire invalides",
      error: error.errors[0].message,
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        success: false,
        message: "Email ou mot de passe incorrect",
        error: "Email ou mot de passe incorrect",
      };
    }

    return {
      success: false,
      message: `Une erreur est survenue lors de la connexion`,
      error: `Erreur lors de la connexion (${response.status}): ${response.statusText}`,
    };
  }

  const apiData = await response.json();

  if (apiData.data.role !== "Admin") {
    return {
      success: false,
      message: "Accès refusé. Vous n'avez pas les droits d'administration nécessaires.",
      error: null,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("adminToken", apiData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2, // 2 heures
    path: "/",
  });

  cookieStore.set("employeeSession", JSON.stringify(apiData.data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2, // 2 heures
    path: "/",
  });

  return {
    success: true,
    message: "Connexion admin réussie",
    data: null,
  };
}

// =================================================================================================================

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("adminToken");
  cookieStore.delete("employeeSession");

  redirect("/panel/connexion");
}

// =================================================================================================================
