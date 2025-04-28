import axiosClient from "./axiosClient";

// ========================================================================================================

const endpoint = "/api/incident";

export type Vote = {
  id: string;
  userId: string;
  reaction: "Like" | "Dislike";
};

export type Incident = {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
  creationDate: string;
  votes: Vote[];
};

export type IncidentPostData = {
  type: "Crash" | "Bottling" | "ClosedRoad" | "PoliceControl" | "Obstacle";
  latitude: number;
  longitude: number;
};

// ========================================================================================================

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
    return [];
  }
};

// ========================================================================================================

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

// ========================================================================================================

/**
 * Fetch only active incidents
 */
export const fetchActiveIncidents = async (): Promise<Incident[]> => {
  try {
    const response = await axiosClient.get(`${endpoint}/incident/active`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active incidents:", error);
    return [];
  }
};

// ========================================================================================================

/**
 * Report a new incident
 */
export const reportIncident = async (incidentData: IncidentPostData): Promise<Incident | null> => {
  try {
    const response = await axiosClient.post(`${endpoint}/incident`, incidentData);
    return response.data;
  } catch (error) {
    console.error("Error reporting incident:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * React to an incident (like or dislike)
 * Updated to use the new endpoint structure
 */
export const reactToIncident = async (incidentId: string, reaction: "Like" | "Dislike"): Promise<Incident | null> => {
  try {
    const response = await axiosClient.put(`${endpoint}/incident/${incidentId}/vote`, {
      reaction,
    });
    return response.data;
  } catch (error) {
    console.error("Error reacting to incident:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Get total likes and dislikes for an incident
 */
export const getIncidentVoteCounts = (incident: Incident): { likes: number; dislikes: number } => {
  if (!incident || !incident.votes) {
    return { likes: 0, dislikes: 0 };
  }

  const likes = incident.votes.filter((vote) => vote.reaction === "Like").length;
  const dislikes = incident.votes.filter((vote) => vote.reaction === "Dislike").length;

  return { likes, dislikes };
};

// ========================================================================================================
