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
  boundingBox?: BoundingBox;
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

export type BoundingBox = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

export type SavedItinerary = {
  id: string;
  departure: string;
  departureLon: number;
  departureLat: number;
  arrival: string;
  arrivalLon: number;
  arrivalLat: number;
  travelMode: string;
  distance: number;
  duration: number;
};

export type UserItineraries = {
  itineraries: SavedItinerary[];
};

export type CreateItineraryData = {
  departure: string;
  departureLon: number;
  departureLat: number;
  arrival: string;
  arrivalLon: number;
  arrivalLat: number;
  travelMode: string;
  distance: number;
  duration: number;
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
  routeType: "fastest" | "shortest" | "eco" | "thrilling" = "fastest",
  avoidTollRoads: boolean = false
): Promise<Itinerary | ItineraryError> => {
  try {
    const response = await axiosClient.get(`${endpoint}/itinerary/calculate`, {
      params: {
        departureLat,
        departureLon,
        arrivalLat,
        arrivalLon,
        travelMethod,
        routeType,
        avoidTollRoads,
      },
    });
    return response.data;
  } catch (error: any) {
    const isInvalidPoints =
      error.response?.data?.message?.includes("Invalid points") || error.response?.data?.includes("Invalid points");

    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Échec du calcul d'itinéraire",
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

/**
 * Save an itinerary for a user
 */
export const saveItinerary = async (itineraryData: CreateItineraryData): Promise<SavedItinerary | null> => {
  try {
    const response = await axiosClient.post(`${endpoint}/itinerary/save`, itineraryData);
    return response.data;
  } catch (error) {
    console.error("Error saving itinerary:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Get all saved itineraries for the current user
 */
export const getUserItineraries = async (): Promise<UserItineraries | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/itinerary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user itineraries:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Get a specific saved itinerary by ID
 */
export const getItineraryById = async (itineraryId: string): Promise<SavedItinerary | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/itinerary/${itineraryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching itinerary by ID:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Delete a saved itinerary
 */
export const deleteItinerary = async (itineraryId: string): Promise<SavedItinerary | null> => {
  try {
    const response = await axiosClient.delete(`${endpoint}/itinerary/${itineraryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    return null;
  }
};

// ========================================================================================================
