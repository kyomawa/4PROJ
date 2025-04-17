import axiosClient from "./axiosClient";
import { Incident } from "./incidents";

// ========================================================================================================

const endpoint = "/api/navigation";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Step = {
  distance: number;
  duration: number;
  instruction: string;
  type: string;
  wayPoints: Coordinate;
};

export type Itinerary = {
  travelMode: string;
  distance: number;
  duration: number;
  steps: Step[];
  coordinates: Coordinate[];
  incidents: Incident[];
};

export type Location = {
  placeId: string;
  latitude: number;
  longitude: number;
  formatted: string;
  wayNumber?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  borough?: string;
  area?: string;
  country?: string;
  boundingBox?: number[];
};

export type ItineraryError = {
  status: number;
  message: string;
  isInvalidPoints?: boolean;
};

// ========================================================================================================

/**
 * Get itinerary between two points
 */
export const getItinerary = async (
  departureLat: number,
  departureLon: number,
  arrivalLat: number,
  arrivalLon: number,
  travelMethod: "car" | "bike" | "foot" | "train" = "car",
  routeType: "fastest" | "shortest" | "eco" | "thrilling" = "fastest"
): Promise<Itinerary | ItineraryError> => {
  try {
    const response = await axiosClient.get(`${endpoint}/itinerary`, {
      params: {
        departureLat,
        departureLon,
        arrivalLat,
        arrivalLon,
        travelMethod,
        routeType,
      },
    });
    return response.data;
  } catch (error: any) {
    // Check for specific error message about invalid points
    const isInvalidPoints =
      error.response?.data?.message?.includes("Invalid points") || error.response?.data?.includes("Invalid points");

    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to fetch itinerary",
      isInvalidPoints: isInvalidPoints,
    };
  }
};

// ========================================================================================================

/**
 * Geocode a text location to coordinates
 */
export const geocodeLocation = async (textLocation: string): Promise<Location[] | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/location`, {
      params: {
        textLocation,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error geocoding location:", error);

    return null;
  }
};

// ========================================================================================================
