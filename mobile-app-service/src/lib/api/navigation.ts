import axiosClient from "./axiosClient";
import { Incident } from "./incidents";

const endpoint = "/api/navigation";

// Types
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

// ID counter pour les mocks
let mockIdCounter = 1;

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
): Promise<Itinerary | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/navigation/itinerary`, {
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
  } catch (error) {
    console.error("Error fetching itinerary:", error);

    // Return mock data for development
    if (__DEV__) {
      return getMockItinerary(departureLat, departureLon, arrivalLat, arrivalLon);
    }

    return null;
  }
};

/**
 * Geocode a text location to coordinates
 */
export const geocodeLocation = async (textLocation: string): Promise<Location[] | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/navigation/location`, {
      params: {
        textLocation,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error geocoding location:", error);

    // Return mock data for development
    if (__DEV__) {
      return getMockLocations(textLocation);
    }

    return null;
  }
};

const generateMockId = () => {
  return `mock-id-${mockIdCounter++}`;
};

// Mock data functions for development
const getMockItinerary = (
  departureLat: number,
  departureLon: number,
  arrivalLat: number,
  arrivalLon: number
): Itinerary => {
  const coordinates: Coordinate[] = [];
  const steps = 10;

  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    coordinates.push({
      latitude: departureLat + (arrivalLat - departureLat) * ratio,
      longitude: departureLon + (arrivalLon - departureLon) * ratio,
    });
  }

  return {
    travelMode: "car",
    distance: 5000, // 5km mock distance
    duration: 600, // 10 minutes mock duration
    steps: [
      {
        distance: 500,
        duration: 60,
        instruction: "Continuer tout droit",
        type: "CONTINUE",
        wayPoints: coordinates[1],
      },
      {
        distance: 2000,
        duration: 240,
        instruction: "Tourner à droite sur Avenue principale",
        type: "TURN_RIGHT",
        wayPoints: coordinates[4],
      },
      {
        distance: 2500,
        duration: 300,
        instruction: "Tourner à gauche pour arriver à destination",
        type: "TURN_LEFT",
        wayPoints: coordinates[8],
      },
    ],
    coordinates,
    incidents: [
      {
        id: generateMockId(),
        type: "Accident",
        longitude: departureLon + (arrivalLon - departureLon) * 0.3,
        latitude: departureLat + (arrivalLat - departureLat) * 0.3,
        like: 5,
        dislike: 1,
        creationDate: new Date().toISOString(),
      },
    ],
  };
};

const getMockLocations = (textLocation: string): Location[] => {
  if (textLocation.toLowerCase().includes("paris")) {
    return [
      {
        placeId: "mock-place-id-paris",
        latitude: 48.8566,
        longitude: 2.3522,
        formatted: "Paris, France",
        city: "Paris",
        country: "France",
        boundingBox: [2.2522, 48.7566, 2.4522, 48.9566],
      },
    ];
  }

  if (textLocation.toLowerCase().includes("lyon")) {
    return [
      {
        placeId: "mock-place-id-lyon",
        latitude: 45.7578,
        longitude: 4.832,
        formatted: "Lyon, France",
        city: "Lyon",
        country: "France",
        boundingBox: [4.7718, 45.7073, 4.8983, 45.8082],
      },
    ];
  }

  // Mock par défaut
  const mockLocation: Location = {
    placeId: generateMockId(),
    latitude: 48.8566,
    longitude: 2.3522,
    formatted: textLocation || "Paris, France",
    city: "Paris",
    country: "France",
    boundingBox: [2.2522, 48.7566, 2.4522, 48.9566],
  };

  return [mockLocation];
};
