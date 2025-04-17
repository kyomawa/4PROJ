import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import {
  fetchNearbyIncidents,
  reportIncident,
  reactToIncident,
  Incident,
  IncidentPostData,
} from "../lib/api/incidents";

// ========================================================================================================

type IncidentContextType = {
  incidents: Incident[];
  isLoading: boolean;
  fetchIncidents: (latitude: number, longitude: number, radiusKm?: number) => Promise<void>;
  clearIncidents: () => void;
  reportNewIncident: (data: IncidentPostData) => Promise<Incident | null>;
  reactToIncident: (incidentId: string, reaction: "Like" | "Dislike") => Promise<Incident | null>;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
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

  // ========================================================================================================

  const fetchIncidents = useCallback(async (latitude: number, longitude: number, radiusKm = 5) => {
    try {
      setIsLoading(true);
      const fetchedIncidents = await fetchNearbyIncidents(latitude, longitude, radiusKm);

      // Merge new incidents with existing ones, avoiding duplicates
      setIncidents((prevIncidents) => {
        const uniqueIncidents = new Map();

        // Add existing incidents to map using ID as key
        prevIncidents.forEach((incident) => {
          uniqueIncidents.set(incident.id, incident);
        });

        // Add or update with new incidents
        fetchedIncidents.forEach((incident) => {
          uniqueIncidents.set(incident.id, incident);
        });

        // Convert back to array
        return Array.from(uniqueIncidents.values());
      });
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================================================

  const clearIncidents = useCallback(() => {
    setIncidents([]);
  }, []);

  // ========================================================================================================

  const reportNewIncident = useCallback(async (data: IncidentPostData): Promise<Incident | null> => {
    try {
      const newIncident = await reportIncident(data);

      if (newIncident) {
        setIncidents((prevIncidents) => [...prevIncidents, newIncident]);
      }

      return newIncident;
    } catch (error) {
      console.error("Error reporting incident:", error);
      return null;
    }
  }, []);

  // ========================================================================================================

  const handleReactToIncident = useCallback(
    async (incidentId: string, reaction: "Like" | "Dislike"): Promise<Incident | null> => {
      try {
        const updatedIncident = await reactToIncident(incidentId, reaction);

        if (updatedIncident) {
          setIncidents((prevIncidents) =>
            prevIncidents.map((incident) => (incident.id === incidentId ? updatedIncident : incident))
          );
        }

        return updatedIncident;
      } catch (error) {
        console.error("Error reacting to incident:", error);
        return null;
      }
    },
    []
  );

  // ========================================================================================================

  const value = {
    incidents,
    isLoading,
    fetchIncidents,
    clearIncidents,
    reportNewIncident,
    reactToIncident: handleReactToIncident,
    selectedIncident,
    setSelectedIncident,
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
