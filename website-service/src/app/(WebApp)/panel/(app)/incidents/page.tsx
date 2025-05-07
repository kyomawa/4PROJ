"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/datatable/data-table";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";
import { fetchActiveIncidents } from "@/actions/incident/action";
import { IncidentType, incidentTypeLabels } from "@/types/incident";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const router = useRouter();

  useEffect(() => {
    const loadIncidents = async () => {
      setIsLoading(true);
      try {
        const response = await fetchActiveIncidents();
        if (response.success && response.data) {
          const transformedData = response.data.map((incident) => {
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

  const columns = [
    {
      accessorKey: "type",
      header: "Type d'incident",
      cell: ({ row }) => {
        const type = row.getValue("type") as IncidentType;
        return (
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="bg-primary-100 text-primary-800 font-medium">
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
            className={status === "Active" ? "bg-green-200" : "bg-red-500"}
          >
            {status === "Active" ? "Actif" : "Inactif"}
          </Badge>
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
      header: "Position",
      cell: ({ row }) => {
        const latitude = row.original.latitude;
        const longitude = row.original.longitude;
        return (
          <div className="flex items-center">
            <Button
              variant="outlineBasic"
              size="sm"
              onClick={() => showOnMap(latitude, longitude)}
              className="!flex !flex-row items-center gap-1"
            >
              <MapPin className="size-4" />
              Voir sur la carte
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2">
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
    router.push(`/?lat=${latitude}&lng=${longitude}`);
  };

  const handleDelete = async (id: string) => {
    toast.success("Incident supprimé avec succès");
    setIncidents(incidents.filter((incident) => incident.id !== id));
  };

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={incidents}
          setData={setIncidents}
          title="Incidents signalés"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// =============================================================================================
