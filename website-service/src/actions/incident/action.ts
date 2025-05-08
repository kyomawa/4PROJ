"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/constants/api";
import { Incident, ReportIncidentParams, BoundingBoxParams } from "./types";
import { ReactionType } from "@/types/incident";

// =================================================================================================================

/**
 * Récupère les incidents dans une zone géographique
 */
export const fetchIncidents = async (params: BoundingBoxParams): Promise<ApiResponse<Incident[]>> => {
  try {
    const queryParams = new URLSearchParams({
      minLat: params.minLat.toString(),
      maxLat: params.maxLat.toString(),
      minLon: params.minLon.toString(),
      maxLon: params.maxLon.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/incident/incident/bounding-box?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Une erreur est survenue lors de la récupération des incidents`,
        error: `Erreur lors de la récupération des incidents (${response.status}): ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Récupération des incidents réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des incidents:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des incidents",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la récupération des incidents",
    };
  }
};

// =================================================================================================================

/**
 * Récupère tous les incidents actifs
 */
export const fetchActiveIncidents = async (): Promise<ApiResponse<Incident[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incident/incident/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Une erreur est survenue lors de la récupération des incidents actifs`,
        error: `Erreur lors de la récupération des incidents actifs (${response.status}): ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Récupération des incidents actifs réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des incidents actifs:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des incidents actifs",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la récupération des incidents actifs",
    };
  }
};

// =================================================================================================================

/**
 * Signale un nouvel incident
 */
export const reportIncident = async (params: ReportIncidentParams): Promise<ApiResponse<Incident>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté pour signaler un incident",
        error: "Vous devez être connecté pour signaler un incident",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/incident/incident`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      if (response.status === 409) {
        return {
          success: false,
          message: "Un incident de ce type existe déjà à cet endroit",
          error: "Un incident de ce type existe déjà à cet endroit",
        };
      }

      return {
        success: false,
        message: "Une erreur est survenue lors du signalement de l'incident",
        error: `Erreur lors du signalement de l'incident (${response.status}): ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Signalement de l'incident réussi",
      data,
    };
  } catch (error) {
    console.error("Erreur lors du signalement de l'incident:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors du signalement de l'incident",
      error: error instanceof Error ? error.message : "Erreur inconnue lors du signalement de l'incident",
    };
  }
};

// =================================================================================================================

/**
 * Vote pour un incident (Like ou Dislike)
 */
export const reactToIncident = async (incidentId: string, reaction: ReactionType): Promise<ApiResponse<Incident>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté pour voter sur un incident",
        error: "Vous devez être connecté pour voter sur un incident",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/incident/incident/${incidentId}/vote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reaction }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors du vote",
        error: `Erreur lors du vote (${response.status}): ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Vote réussi",
      data,
    };
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors du vote",
      error: error instanceof Error ? error.message : "Erreur inconnue lors du vote",
    };
  }
};

// =================================================================================================================

/**
 * Supprime un incident (admin seulement)
 */
export const deleteIncident = async (incidentId: string): Promise<ApiResponse<Incident>> => {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;

    if (!adminToken) {
      return {
        success: false,
        message: "Vous devez être connecté en tant qu'administrateur pour supprimer un incident",
        error: "Vous devez être connecté en tant qu'administrateur pour supprimer un incident",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/incident/incident/${incidentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Une erreur est survenue lors de la suppression de l'incident (${response.status})`,
        error: `Erreur lors de la suppression de l'incident (${response.status}): ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Suppression de l'incident réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'incident:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la suppression de l'incident",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la suppression de l'incident",
    };
  }
};

// =================================================================================================================
