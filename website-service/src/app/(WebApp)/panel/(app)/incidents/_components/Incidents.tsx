"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable/data-table";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { ExtendedColumnDef } from "@/constants/type";
import { dateFilter, multiSelectFilter } from "@/lib/datatableFunctions";
import { FilterFn } from "@tanstack/react-table";
import { deleteIncident } from "@/actions/incident/action";

// =============================================================================================

export type IncidentWithId = {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
  creationDate: string;
  likesCount: number;
  dislikesCount: number;
};

type IncidentsProps = {
  initialIncidents: IncidentWithId[];
  error: string | null;
};

// =============================================================================================

export default function Incidents({ initialIncidents, error }: IncidentsProps) {
  const [incidents, setIncidents] = useState<IncidentWithId[]>(initialIncidents);
  const [isLoading] = useState(false);

  const handleDelete = async (id: string) => {
    const res = await deleteIncident(id);
    if (!res.success) {
      toast.error("Une erreur est survenue lors de la suppression de l'incident");
      return;
    }
    toast.success("Incident supprimé avec succès");
    setIncidents((prev) => prev.filter((inc) => inc.id !== id));
  };

  const columns: ExtendedColumnDef<IncidentWithId, unknown>[] = [
    {
      accessorKey: "type",
      header: "Type d'incident",
      needMultiSelect: true,
      filterFn: multiSelectFilter as unknown as FilterFn<IncidentWithId>,
      options: ["Obstacle", "Embouteillage", "Route fermée", "Contrôle policier", "Accident"],
      cell: ({ row }) => {
        const label = row.getValue("type") as string;
        const bg = colorMap[label] ?? "bg-gray-500";
        return (
          <div className="flex gap-2 items-center">
            <Badge variant="default" className={bg}>
              {label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "creationDate",
      header: "Date de création",
      needDatePicker: true,
      filterFn: dateFilter as FilterFn<IncidentWithId>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      needSelect: true,
      options: Object.values(statusLabels),
      filterFn: (row, columnId, filterValue) => {
        const rawValue = statusValuesByLabel[filterValue];
        return row.getValue(columnId) === rawValue;
      },
      cell: ({ row }) => {
        const raw = row.getValue("status") as "Active" | "Inactive";
        return (
          <Badge className={raw === "Active" ? "bg-green-300 text-green-800" : "bg-red-500 text-red-950"}>
            {statusLabels[raw]}
          </Badge>
        );
      },
    },
    { accessorKey: "likesCount", header: "Likes", cell: ({ row }) => row.getValue("likesCount") },
    { accessorKey: "dislikesCount", header: "Dislikes", cell: ({ row }) => row.getValue("dislikesCount") },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { latitude, longitude, id } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outlineBasic"
              size="sm"
              onClick={() => window.open(`/?lat=${latitude}&lng=${longitude}`, "_blank")}
            >
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>Voir sur la carte</span>
              </div>
            </Button>

            <Button
              variant="datatableOutlineDestructive"
              size="sm"
              onClick={() => handleDelete(id)}
              className="items-center gap-1"
            >
              <div className="flex items-center gap-1">
                <Trash2 className="size-4" />
                <span>Supprimer</span>
              </div>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <main className="flex flex-col gap-y-6 lg:max-w-[calc(100vw-16rem)] max-w-[calc(100vw-2rem)]">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{error}</div>}
      <div className="bg-white rounded-lg">
        <DataTable
          columns={columns}
          data={incidents}
          setData={setIncidents}
          title="Incidents signalés"
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}

// =============================================================================================

const colorMap: Record<string, string> = {
  Accident: "bg-red-300 text-red-950",
  Embouteillage: "bg-orange-300 text-orange-900",
  "Route fermée": "bg-purple-300 text-purple-900",
  "Contrôle policier": "bg-blue-300 text-blue-900",
  Obstacle: "bg-yellow-300 text-yellow-900",
};

const statusLabels: Record<"Active" | "Inactive", string> = {
  Active: "Actif",
  Inactive: "Inactif",
};

const statusValuesByLabel = Object.fromEntries(
  Object.entries(statusLabels).map(([val, label]) => [label, val])
) as Record<string, "Active" | "Inactive">;

// =============================================================================================
