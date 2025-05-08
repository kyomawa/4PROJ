import { fetchActiveIncidents } from "@/actions/incident/action";
import { incidentTypeLabels } from "@/types/incident";
import { Incident } from "@/actions/incident/types";
import Incidents from "./_components/Incidents";
import { incidentsMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = incidentsMetadata;

// =============================================================================================

type IncidentWithId = {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
  creationDate: string;
  likesCount: number;
  dislikesCount: number;
};

// =============================================================================================

export default async function IncidentsPage() {
  let incidents: IncidentWithId[] = [];
  let error: string | null = null;

  const response = await fetchActiveIncidents();

  if (response.success && response.data) {
    incidents = response.data.map((incident: Incident) => {
      const likesCount = incident.votes?.filter((v) => v.reaction === "Like").length ?? 0;
      const dislikesCount = incident.votes?.filter((v) => v.reaction === "Dislike").length ?? 0;
      return {
        id: incident.id,
        type: incidentTypeLabels[incident.type as keyof typeof incidentTypeLabels] || incident.type,
        latitude: incident.latitude,
        longitude: incident.longitude,
        status: incident.status,
        creationDate: incident.creationDate,
        likesCount,
        dislikesCount,
      };
    });
  } else {
    error = "Erreur lors du chargement des incidents.";
  }

  return <Incidents initialIncidents={incidents} error={error} />;
}

// =============================================================================================
