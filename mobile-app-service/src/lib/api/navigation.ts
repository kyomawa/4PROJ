import axios from "axios/dist/axios.js";
import { Incident } from "./incidents";
import { API_URL } from "../config";

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
    // const response = await axios.get(`${API_URL}/itinerary`, {
    //   params: {
    //     departureLat,
    //     departureLon,
    //     arrivalLat,
    //     arrivalLon,
    //     travelMethod,
    //     routeType,
    //   },
    // });
    // return response.data;
    return {
      travelMode: "string",
      distance: 0,
      duration: 0,
      steps: [
        {
          distance: 0,
          duration: 0,
          instruction: "string",
          type: "string",
          wayPoints: {
            latitude: 0,
            longitude: 0,
          },
        },
      ],
      coordinates: [
        {
          latitude: 0,
          longitude: 0,
        },
      ],
      incidents: [
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          type: "string",
          longitude: 0,
          latitude: 0,
          like: 0,
          dislike: 0,
          creationDate: "2025-04-16T07:38:53.530Z",
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return null;
  }
};

/**
 * Geocode a text location to coordinates
 */
export const geocodeLocation = async (textLocation: string): Promise<Location[] | null> => {
  try {
    // const response = await axios.get(`${API_URL}/location`, {
    //   params: {
    //     textLocation,
    //   },
    // });
    // return response.data;
    return [
      {
        placeId: "51c198e3cbfa53134059fafa100a00e14640f00101f90185d8010000000000c00208",
        latitude: 45.7578137,
        longitude: 4.8320114,
        formatted: "Lyon, ARA, France",
        wayNumber: undefined,
        street: undefined,
        postalCode: undefined,
        city: "Lyon",
        borough: undefined,
        area: "Auvergne-Rhône-Alpes",
        country: "France",
        boundingBox: [4.7718132, 45.7073666, 4.8983774, 45.8082628],
      },
    ];
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
};
