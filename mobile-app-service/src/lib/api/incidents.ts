import axiosClient from "./axiosClient";

const endpoint = "/api/incident";

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
    const response = await axiosClient.get(`${endpoint}/incident/bounding-box`, {
      params: {
        minLat,
        maxLat,
        minLon,
        maxLon,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching incidents by bounding box:", error);

    // Return mock data for development
    if (__DEV__) {
      return getMockIncidents();
    }

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
  // Calculate bounding box based on radius (approximate)
  const latDelta = radiusKm / 111; // 1 degree latitude is approximately 111 km
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
    const response = await axiosClient.post(`${endpoint}/incident`, incidentData);
    return response.data;
  } catch (error) {
    console.error("Error reporting incident:", error);

    // Return mock data for development
    if (__DEV__) {
      return getMockIncident(incidentData);
    }

    return null;
  }
};

/**
 * React to an incident (like or dislike)
 */
export const reactToIncident = async (incidentId: string, reaction: "Like" | "Dislike"): Promise<Incident | null> => {
  try {
    const response = await axiosClient.put(`${endpoint}incident/${incidentId}`, {
      reaction,
    });
    return response.data;
  } catch (error) {
    console.error("Error reacting to incident:", error);

    // Pour le développement, on simule la mise à jour
    if (__DEV__) {
      return getMockUpdatedIncident(incidentId, reaction);
    }

    return null;
  }
};

let mockIdCounter = 1;
const mockIncidents: Incident[] = [];

const generateMockId = () => {
  return `mock-incident-${mockIdCounter++}`;
};

const getMockIncidents = (): Incident[] => {
  if (mockIncidents.length === 0) {
    const types = ["Crash", "Bottling", "ClosedRoad", "PoliceControl", "Obstacle"];

    for (let i = 0; i < 5; i++) {
      const incident: Incident = {
        id: generateMockId(),
        type: types[Math.floor(Math.random() * types.length)],
        // Paris, France (approximativement)
        latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
        longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
        like: Math.floor(Math.random() * 10),
        dislike: Math.floor(Math.random() * 5),
        creationDate: new Date().toISOString(),
      };
      mockIncidents.push(incident);
    }
  }

  return [...mockIncidents];
};

const getMockIncident = (data: IncidentPostData): Incident => {
  const newIncident: Incident = {
    id: generateMockId(),
    type: data.type,
    latitude: data.latitude,
    longitude: data.longitude,
    like: 0,
    dislike: 0,
    creationDate: new Date().toISOString(),
  };

  mockIncidents.push(newIncident);
  return newIncident;
};

const getMockUpdatedIncident = (id: string, reaction: "Like" | "Dislike"): Incident | null => {
  const index = mockIncidents.findIndex((incident) => incident.id === id);

  if (index === -1) return null;

  const incident = { ...mockIncidents[index] };

  if (reaction === "Like") {
    incident.like += 1;
  } else {
    incident.dislike += 1;
  }

  mockIncidents[index] = incident;
  return incident;
};
