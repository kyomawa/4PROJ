"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/constants/api";

// =================================================================================================================

export type MonthlyUserStats = {
  month: string;
  count: number;
};

export type IncidentTypeStats = {
  type: string;
  count: number;
};

export type HourlyIncidentStats = {
  hour: number;
  count: number;
};

// =================================================================================================================

/**
 * Récupère les statistiques d'utilisateurs par mois
 */
export async function getUserCountByMonth(): Promise<ApiResponse<MonthlyUserStats[]>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté en tant qu'administrateur pour accéder à ces statistiques",
        error: "Authentification requise",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/statistics/statistic/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la récupération des statistiques utilisateurs",
        error: `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Récupération des statistiques utilisateurs réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques utilisateurs:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// =================================================================================================================

/**
 * Récupère les statistiques d'incidents par type
 */
export async function getIncidentCountByType(): Promise<ApiResponse<IncidentTypeStats[]>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté en tant qu'administrateur pour accéder à ces statistiques",
        error: "Authentification requise",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/statistics/statistic/incidents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la récupération des statistiques d'incidents",
        error: `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Récupération des statistiques d'incidents réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques d'incidents:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// =================================================================================================================

/**
 * Récupère les statistiques de congestion par heure
 */
export async function getCongestionPeriodByHour(): Promise<ApiResponse<HourlyIncidentStats[]>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté en tant qu'administrateur pour accéder à ces statistiques",
        error: "Authentification requise",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/statistics/statistic/congestion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la récupération des statistiques de congestion",
        error: `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Récupération des statistiques de congestion réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques de congestion:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// =================================================================================================================
