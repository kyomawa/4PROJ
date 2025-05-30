"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/constants/api";
import { RouteParams, SaveItineraryParams, LocationResult, Itinerary, SavedItinerary, UserItineraries } from "./types";

// =================================================================================================================

/**
 * Recherche un lieu par text
 */
export const searchLocation = async (query: string): Promise<ApiResponse<LocationResult[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/navigation/location?textLocation=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: "Aucun lieu trouvé",
          error: "Aucun lieu trouvé",
        };
      }
      throw new Error(`Erreur lors de la recherche de lieu: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: "Lieux trouvés avec succès",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la recherche de lieu:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la recherche de lieu",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la recherche de lieu",
    };
  }
};

// =================================================================================================================

/**
 * Calcule un itinéraire entre deux points
 */
export const calculateRoute = async (params: RouteParams): Promise<ApiResponse<Itinerary>> => {
  try {
    const queryParams = new URLSearchParams({
      departureLat: params.departureLat.toString(),
      departureLon: params.departureLon.toString(),
      arrivalLat: params.arrivalLat.toString(),
      arrivalLon: params.arrivalLon.toString(),
      travelMethod: params.travelMethod,
      routeType: params.routeType,
      avoidTollRoads: params.avoidTollRoads.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/navigation/itinerary/calculate?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Une erreur est survenue lors du calcul de l'itinéraire`,
        error: `Erreur lors du calcul de l'itinéraire (${response.status}): ${response.statusText}`,
      };
    }

    const data: Itinerary = await response.json();
    return {
      success: true,
      message: "Calcul de l'itinéraire réussi",
      data,
    };
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors du calcul de l'itinéraire",
      error: error instanceof Error ? error.message : "Erreur inconnue lors du calcul de l'itinéraire",
    };
  }
};

// =================================================================================================================

/**
 * Sauvegarde un itinéraire
 */
export const saveItinerary = async (params: SaveItineraryParams): Promise<ApiResponse<SavedItinerary>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté pour sauvegarder un itinéraire",
        error: "Vous devez être connecté pour sauvegarder un itinéraire",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/navigation/itinerary/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la sauvegarde de l'itinéraire",
        error: `Erreur lors de la sauvegarde de l'itinéraire (${response.status}): ${response.statusText}`,
      };
    }

    const data: SavedItinerary = await response.json();
    return {
      success: true,
      message: "Sauvegarde de l'itinéraire réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'itinéraire:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la sauvegarde de l'itinéraire",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la sauvegarde de l'itinéraire",
    };
  }
};

// =================================================================================================================

/**
 * Récupère les itinéraires sauvegardés de l'utilisateur
 */
export const getUserItineraries = async (): Promise<ApiResponse<UserItineraries>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté pour accéder à vos itinéraires",
        error: "Vous devez être connecté pour accéder à vos itinéraires",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/navigation/itinerary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la récupération des itinéraires",
        error: `Erreur lors de la récupération des itinéraires (${response.status}): ${response.statusText}`,
      };
    }

    const data: UserItineraries = await response.json();
    return {
      success: true,
      message: "Récupération des itinéraires réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des itinéraires:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des itinéraires",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la récupération des itinéraires",
    };
  }
};

// =================================================================================================================

/**
 * Supprime un itinéraire sauvegardé
 */
export const deleteItinerary = async (itineraryId: string): Promise<ApiResponse<SavedItinerary>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Vous devez être connecté pour supprimer un itinéraire",
        error: "Vous devez être connecté pour supprimer un itinéraire",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/navigation/itinerary/${itineraryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Une erreur est survenue lors de la suppression de l'itinéraire",
        error: `Erreur lors de la suppression de l'itinéraire (${response.status}): ${response.statusText}`,
      };
    }

    const data: SavedItinerary = await response.json();
    return {
      success: true,
      message: "Suppression de l'itinéraire réussie",
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'itinéraire:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la suppression de l'itinéraire",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la suppression de l'itinéraire",
    };
  }
};

// =================================================================================================================
