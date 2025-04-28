import { useEffect, useState, useCallback } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import { API_BASE_URL } from "../lib/config";
import { Incident } from "../lib/api/incidents";

// ========================================================================================================

export type BoundingBoxDto = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

export type CoordinatesDto = {
  latitude: number;
  longitude: number;
};

// ========================================================================================================

export function useAlertConnection() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [nearbyIncidents, setNearbyIncidents] = useState<Incident[]>([]);
  const [itineraryIncidents, setItineraryIncidents] = useState<Incident[]>([]);

  // ========================================================================================================

  useEffect(() => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hub`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    hubConnection.on("IncidentsNear", (data: string) => {
      try {
        const parsedData = JSON.parse(data);
        setNearbyIncidents(parsedData);
      } catch (error) {
        console.error("Error parsing nearby incidents:", error);
      }
    });

    hubConnection.on("ItineraryIncidents", (data: string) => {
      try {
        const parsedData = JSON.parse(data);
        setItineraryIncidents(parsedData);
      } catch (error) {
        console.error("Error parsing itinerary incidents:", error);
      }
    });

    // Start connection
    hubConnection
      .start()
      .then(() => {
        console.log("Connected to Alert hub");
        setIsConnected(true);
      })
      .catch((err) => console.error("Error connecting to Alert hub:", err));

    setConnection(hubConnection);

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, []);

  // ========================================================================================================

  /**
   * Check for incidents near a specific location
   */
  const checkNearIncidents = useCallback(
    async (coordinates: CoordinatesDto) => {
      if (connection && isConnected) {
        try {
          await connection.invoke("GetNearIncidents", coordinates);
        } catch (error) {
          console.error("Error checking for nearby incidents:", error);
        }
      }
    },
    [connection, isConnected]
  );

  // ========================================================================================================

  /**
   * Check for incidents within an itinerary's bounding box
   */
  const checkItineraryIncidents = useCallback(
    async (boundingBox: BoundingBoxDto) => {
      if (connection && isConnected) {
        try {
          await connection.invoke("GetItineraryIncidents", boundingBox);
        } catch (error) {
          console.error("Error checking for itinerary incidents:", error);
        }
      }
    },
    [connection, isConnected]
  );

  // ========================================================================================================

  return {
    isConnected,
    nearbyIncidents,
    itineraryIncidents,
    checkNearIncidents,
    checkItineraryIncidents,
  };
}

// ========================================================================================================
