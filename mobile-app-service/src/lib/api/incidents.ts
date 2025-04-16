import axios from "axios/dist/axios.js";
import { API_URL } from "../config";

// Types
export type Incident = {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  like: number;
  dislike: number;
  creationDate: string;
};

export type IncidentPostData = {
  type: "Crash" | "Bottling" | "ClosedRoad" | "PoliceControl" | "Obstacle";
  latitude: number;
  longitude: number;
};

/**
 * Fetch incidents within a bounding box
 */
export const fetchIncidentsByBoundingBox = async (
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number
): Promise<Incident[]> => {
  try {
    // const response = await axios.get(`${API_URL}/incident/bounding-box`, {
    //   params: {
    //     minLat,
    //     maxLat,
    //     minLon,
    //     maxLon,
    //   },
    // });
    // return response.data;
    return [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        type: "ClosedRoad",
        longitude: 0,
        latitude: 0,
        like: 0,
        dislike: 0,
        creationDate: "2025-04-16T07:30:41.811Z",
      },
    ];
  } catch (error) {
    console.error("Error fetching incidents by bounding box:", error);
    return [];
  }
};

/**
 * Fetch incidents near a specific location (with radius in km)
 */
export const fetchNearbyIncidents = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<Incident[]> => {
  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.cos(latitude * (Math.PI / 180)));

  return fetchIncidentsByBoundingBox(
    latitude - latDelta,
    latitude + latDelta,
    longitude - lonDelta,
    longitude + lonDelta
  );
};

/**
 * Report a new incident
 */
export const reportIncident = async (incidentData: IncidentPostData): Promise<Incident | null> => {
  try {
    // const response = await axios.post(`${API_URL}/incident`, incidentData);
    // return response.data;
    return {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      type: "string",
      longitude: 0,
      latitude: 0,
      like: 0,
      dislike: 0,
      creationDate: "2025-04-16T07:55:31.268Z",
    };
  } catch (error) {
    console.error("Error reporting incident:", error);
    return null;
  }
};

/**
 * React to an incident (like or dislike)
 */
export const reactToIncident = async (incidentId: string, reaction: "Like" | "Dislike"): Promise<Incident | null> => {
  try {
    // const response = await axios.put(`${API_URL}/incident/${incidentId}`, {
    //   reaction,
    // });
    // return response.data;
    return {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      type: "string",
      longitude: 0,
      latitude: 0,
      like: 0,
      dislike: 0,
      creationDate: "2025-04-16T07:56:06.730Z",
    };
  } catch (error) {
    console.error("Error reacting to incident:", error);
    return null;
  }
};
