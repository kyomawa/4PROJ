import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";
import {
  fetchNearbyIncidents,
  fetchActiveIncidents,
  reportIncident,
  reactToIncident,
  Incident,
  IncidentPostData,
  getIncidentVoteCounts,
} from "../lib/api/incidents";

// ========================================================================================================

type IncidentContextType = {
  incidents: Incident[];
  isLoading: boolean;
  fetchIncidents: (latitude: number, longitude: number, radiusKm?: number) => Promise<void>;
  fetchAllActiveIncidents: () => Promise<void>;
  clearIncidents: () => void;
  reportNewIncident: (data: IncidentPostData) => Promise<Incident | null>;
  reactToIncident: (incidentId: string, reaction: "Like" | "Dislike") => Promise<Incident | null>;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  getVoteCounts: (incident: Incident) => { likes: number; dislikes: number };
};

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

// ========================================================================================================

type IncidentProviderProps = {
  children: ReactNode;
};

export function IncidentProvider({ children }: IncidentProviderProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [lastFetchCoordinates, setLastFetchCoordinates] = useState<{
    latitude: number;
    longitude: number;
    radiusKm: number;
  } | null>(null);

  // ========================================================================================================

  const fetchIncidents = useCallback(async (latitude: number, longitude: number, radiusKm = 5) => {
    try {
      setIsLoading(true);
      // Store the coordinates for auto-refresh
      setLastFetchCoordinates({ latitude, longitude, radiusKm });

      const fetchedIncidents = await fetchNearbyIncidents(latitude, longitude, radiusKm);
      setIncidents(fetchedIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================================================

  const refreshIncidents = useCallback(async () => {
    if (!lastFetchCoordinates) return;

    try {
      const { latitude, longitude, radiusKm } = lastFetchCoordinates;
      const fetchedIncidents = await fetchNearbyIncidents(latitude, longitude, radiusKm);

      setIncidents(fetchedIncidents);

      if (selectedIncident && !fetchedIncidents.some((incident) => incident.id === selectedIncident.id)) {
        setSelectedIncident(null);
      }
    } catch (error) {
      console.error("Error refreshing incidents:", error);
    }
  }, [lastFetchCoordinates, selectedIncident]);

  // ========================================================================================================

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshIncidents();
    }, 6500);

    return () => clearInterval(intervalId);
  }, [refreshIncidents]);

  // ========================================================================================================

  const fetchAllActiveIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      const activeIncidents = await fetchActiveIncidents();
      setIncidents(activeIncidents);
      setLastFetchCoordinates(null);
    } catch (error) {
      console.error("Error fetching active incidents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================================================

  const clearIncidents = useCallback(() => {
    setIncidents([]);
    setLastFetchCoordinates(null);
  }, []);

  // ========================================================================================================

  const reportNewIncident = useCallback(
    async (data: IncidentPostData): Promise<Incident | null> => {
      try {
        const newIncident = await reportIncident(data);

        if (newIncident && lastFetchCoordinates) {
          // After reporting, trigger a refresh to get the complete updated list
          const { latitude, longitude, radiusKm } = lastFetchCoordinates;
          await fetchIncidents(latitude, longitude, radiusKm);
        }

        return newIncident;
      } catch (error) {
        console.error("Error reporting incident:", error);
        return null;
      }
    },
    [fetchIncidents, lastFetchCoordinates]
  );

  // ========================================================================================================

  const handleReactToIncident = useCallback(
    async (incidentId: string, reaction: "Like" | "Dislike"): Promise<Incident | null> => {
      try {
        const updatedIncident = await reactToIncident(incidentId, reaction);

        if (updatedIncident) {
          setIncidents((prevIncidents) =>
            prevIncidents.map((incident) => (incident.id === incidentId ? updatedIncident : incident))
          );

          if (selectedIncident?.id === incidentId) {
            setSelectedIncident(updatedIncident);
          }

          // Force a refresh after a short delay to get the latest status
          // (in case the incident was automatically disabled due to dislikes)
          setTimeout(() => {
            if (lastFetchCoordinates) {
              const { latitude, longitude, radiusKm } = lastFetchCoordinates;
              refreshIncidents();
            }
          }, 2000);
        }

        return updatedIncident;
      } catch (error) {
        console.error("Error reacting to incident:", error);
        return null;
      }
    },
    [selectedIncident, lastFetchCoordinates, refreshIncidents]
  );

  // ========================================================================================================

  const getVoteCounts = useCallback((incident: Incident) => {
    return getIncidentVoteCounts(incident);
  }, []);

  // ========================================================================================================

  // Effect to handle selected incident deletion
  useEffect(() => {
    if (selectedIncident && !incidents.some((incident) => incident.id === selectedIncident.id)) {
      setSelectedIncident(null);
    }
  }, [incidents, selectedIncident]);

  // ========================================================================================================

  const value = {
    incidents,
    isLoading,
    fetchIncidents,
    fetchAllActiveIncidents,
    clearIncidents,
    reportNewIncident,
    reactToIncident: handleReactToIncident,
    selectedIncident,
    setSelectedIncident,
    getVoteCounts,
  };

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
}

// ========================================================================================================

export function useIncidents() {
  const context = useContext(IncidentContext);

  if (context === undefined) {
    throw new Error("useIncidents must be used within an IncidentProvider");
  }

  return context;
}

// ========================================================================================================
