"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/datatable/data-table";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";
import { fetchActiveIncidents } from "@/actions/incident/action";
import { IncidentType, incidentTypeLabels } from "@/types/incident";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Incident } from "@/actions/incident/types";
import SubHeader from "../_components/SubHeader";
import { ExtendedColumnDef } from "@/constants/type";

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

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      setIsLoading(true);
      try {
        const response = await fetchActiveIncidents();
        if (response.success && response.data) {
          const transformedData = response.data.map((incident: Incident) => {
            const likesCount = incident.votes?.filter((v) => v.reaction === "Like").length || 0;
            const dislikesCount = incident.votes?.filter((v) => v.reaction === "Dislike").length || 0;

            return {
              id: incident.id,
              type: incident.type,
              latitude: incident.latitude,
              longitude: incident.longitude,
              status: incident.status,
              creationDate: incident.creationDate,
              likesCount,
              dislikesCount,
            };
          });

          setIncidents(transformedData);
        } else {
          toast.error("Erreur lors du chargement des incidents");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des incidents:", error);
        toast.error("Erreur lors du chargement des incidents");
      } finally {
        setIsLoading(false);
      }
    };

    loadIncidents();
  }, []);

  const columns: ExtendedColumnDef<IncidentWithId, string>[] = [
    {
      accessorKey: "type",
      header: "Type d'incident",
      cell: ({ row }) => {
        const type = row.getValue("type") as IncidentType;
        return (
          <div className="flex gap-2 items-center">
            <Badge
              variant="default"
              className={(() => {
                switch (type) {
                  case IncidentType.Crash:
                    return "bg-red-500";
                  case IncidentType.Bottling:
                    return "bg-orange-500";
                  case IncidentType.ClosedRoad:
                    return "bg-purple-500";
                  case IncidentType.PoliceControl:
                    return "bg-blue-500";
                  case IncidentType.Obstacle:
                    return "bg-yellow-500";
                  default:
                    return "bg-gray-500";
                }
              })()}
            >
              {incidentTypeLabels[type] || type}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "creationDate",
      header: "Date de création",
      cell: ({ row }) => {
        const date = new Date(row.getValue("creationDate"));
        return format(date, "PPP 'à' p", { locale: fr });
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={status === "Active" ? "default" : "secondary"}
            className={status === "Active" ? "bg-green-500" : "bg-red-500"}
          >
            {status === "Active" ? "Actif" : "Inactif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "coordinates",
      header: "Coordonnées",
      cell: ({ row }) => {
        const latitude = row.original.latitude;
        const longitude = row.original.longitude;
        return (
          <div className="font-mono text-xs">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </div>
        );
      },
    },
    {
      accessorKey: "likesCount",
      header: "Likes",
      cell: ({ row }) => row.getValue("likesCount"),
    },
    {
      accessorKey: "dislikesCount",
      header: "Dislikes",
      cell: ({ row }) => row.getValue("dislikesCount"),
    },
    {
      accessorKey: "position",
      header: "Actions",
      cell: ({ row }) => {
        const latitude = row.original.latitude;
        const longitude = row.original.longitude;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outlineBasic"
              size="sm"
              onClick={() => showOnMap(latitude, longitude)}
              className="!flex !flex-row items-center gap-1"
            >
              <MapPin className="size-4" />
              Voir sur la carte
            </Button>
            <Button
              variant="datatableOutlineDestructive"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </div>
        );
      },
    },
  ];

  const showOnMap = (latitude: number, longitude: number) => {
    window.open(`/?lat=${latitude}&lng=${longitude}`, "_blank");
  };

  const handleDelete = async (id: string) => {
    toast.success("Incident supprimé avec succès");
    setIncidents(incidents.filter((incident) => incident.id !== id));
  };

  return (
    <div className="flex flex-col gap-y-6">
      <SubHeader title="Incidents signalés" button={null} />

      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={incidents}
          setData={setIncidents}
          title="Incidents signalés"
          isLoading={isLoading}
          needCheckbox={true}
        />
      </div>
    </div>
  );
}

// ===================================================================================================
