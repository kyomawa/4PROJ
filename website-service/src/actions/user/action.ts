"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/constants/api";

export interface UserData {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: "User" | "Admin";
  img?: string | null;
}

export interface UpdateUserProfileData {
  username?: string;
  email?: string;
  phoneNumber?: string;
  currentPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Récupère l'utilisateur connecté actuellement
 */
export const getConnectedUser = async (): Promise<ApiResponse<UserData>> => {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userToken")?.value;
  const session = cookieStore.get("session")?.value;

  if (!userToken || !session) {
    return {
      success: false,
      message: "Utilisateur non connecté",
      error: "Aucune session trouvée",
    };
  }

  return {
    success: true,
    message: "Utilisateur récupéré avec succès",
    data: JSON.parse(session) as UserData,
  };
};

/**
 * Récupère l'employé (admin) connecté actuellement
 */
export const getConnectedEmployee = async (): Promise<ApiResponse<UserData>> => {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("adminToken")?.value;
  const session = cookieStore.get("employeeSession")?.value;

  if (!adminToken || !session) {
    return {
      success: false,
      message: "Administrateur non connecté",
      error: "Aucune session d'administrateur trouvée",
    };
  }

  return {
    success: true,
    message: "Administrateur récupéré avec succès",
    data: JSON.parse(session) as UserData,
  };
};

/**
 * Met à jour le profil utilisateur
 */
export const updateUserProfile = async (userId: string, formData: FormData): Promise<ApiResponse<UserData>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Non autorisé, veuillez vous connecter",
        error: "Token manquant",
      };
    }

    // Extract data from formData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const currentPassword = formData.get("currentPassword") as string;

    // Create JSON payload
    const payload = {
      username,
      email,
      phoneNumber,
      currentPassword,
    };

    const response = await fetch(`${API_BASE_URL}/api/user/user/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Erreur lors de la mise à jour du profil (${response.status}): ${errorText}`,
        error: errorText,
      };
    }

    const data = (await response.json()) as UserData;

    const sessionData = cookieStore.get("session")?.value;
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      const updatedSession = {
        ...parsedSession,
        ...data,
      };

      cookieStore.set("session", JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 2, // 2 heures
        path: "/",
      });
    }

    return {
      success: true,
      message: "Profil mis à jour avec succès",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du profil",
      error,
    };
  }
};

/**
 * Change le mot de passe de l'utilisateur
 */
export const changePassword = async (userId: string, formData: FormData): Promise<ApiResponse<null>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Non autorisé, veuillez vous connecter",
        error: "Token manquant",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/user/user/${userId}/password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Erreur lors du changement de mot de passe (${response.status})`,
        error: await response.text(),
      };
    }

    return {
      success: true,
      message: "Mot de passe changé avec succès",
      data: null,
    };
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    return {
      success: false,
      message: "Erreur lors du changement de mot de passe",
      error,
    };
  }
};

/**
 * Supprime un compte utilisateur
 */
export const deleteAccount = async (userId: string): Promise<ApiResponse<null>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté pour supprimer votre compte",
        error: "Non authentifié",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/user/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la suppression du compte",
        error: `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    cookieStore.delete("userToken");
    cookieStore.delete("session");

    return {
      success: true,
      message: "Votre compte a été supprimé avec succès",
      data: null,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la suppression du compte",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
};
