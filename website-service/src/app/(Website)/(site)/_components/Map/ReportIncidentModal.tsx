"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { IncidentType, incidentTypeLabels } from "@/types/incident";
import { reportIncident } from "@/actions/incident/action";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Fusely,
  FuselyBody,
  FuselyContent,
  FuselyDescription,
  FuselyFooter,
  FuselyHeader,
  FuselyTitle,
} from "@/components/ui/fusely";
import Image from "@/components/Image";

// =============================================================================================

type ReportIncidentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  position: { lat: number; lng: number };
};

// =============================================================================================

export default function ReportIncidentModal({ isOpen, onClose, position }: ReportIncidentModalProps) {
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error("Veuillez sélectionner un type d'incident");
      return;
    }

    setIsLoading(true);
    try {
      const response = await reportIncident({
        type: selectedType,
        latitude: position.lat,
        longitude: position.lng,
      });

      if (response.success) {
        toast.success("Incident signalé avec succès");
        onClose();
        router.refresh();
      } else {
        if (response.message.includes("connecté")) {
          toast.error("Vous devez être connecté pour signaler un incident");
        } else {
          toast.error(response.message || "Erreur lors du signalement de l'incident");
        }
      }
    } catch (error) {
      console.error("Erreur lors du signalement de l'incident:", error);
      toast.error("Une erreur est survenue lors du signalement de l'incident");
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: IncidentType) => {
    switch (type) {
      case IncidentType.Crash:
        return <Image containerClassName="size-8" src="/icons/crash.svg" alt="Accident" />;
      case IncidentType.ClosedRoad:
        return <Image containerClassName="size-8" src="/icons/closed-road.svg" alt="Route fermée" />;
      case IncidentType.Bottling:
        return <Image containerClassName="size-8" src="/icons/bottling.svg" alt="Embouteillage" />;
      case IncidentType.PoliceControl:
        return <Image containerClassName="size-8" src="/icons/police-control.svg" alt="Contrôle policier" />;
      case IncidentType.Obstacle:
        return <Image containerClassName="size-8" src="/icons/obstacle.svg" alt="Obstacle" />;
      default:
        return <AlertTriangle className="size-5" />;
    }
  };

  return (
    <Fusely open={isOpen} onOpenChange={onClose}>
      <FuselyContent className="sm:max-w-md">
        <FuselyHeader>
          <FuselyTitle>Signaler un incident</FuselyTitle>
          <FuselyDescription>
            Aidez les autres conducteurs en signalant un problème de circulation à cet endroit.
          </FuselyDescription>
        </FuselyHeader>
        <FuselyBody>
          <h3 className="text-sm font-medium mb-3">Type d&apos;incident:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {Object.values(IncidentType).map((type) => (
              <IncidentButton
                key={type}
                type={type}
                icon={getIconForType(type)}
                selected={selectedType === type}
                onClick={() => setSelectedType(type)}
              />
            ))}
          </div>

          <FuselyFooter>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} isLoading={isLoading}>
                Signaler
              </Button>
            </div>
          </FuselyFooter>
        </FuselyBody>
      </FuselyContent>
    </Fusely>
  );
}

// =============================================================================================

type IncidentButtonProps = {
  type: IncidentType;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
};

function IncidentButton({ type, icon, selected, onClick, className }: IncidentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 p-3 rounded-md border text-left transition-all",
        selected
          ? "bg-primary-50 border-primary-500 text-primary-700"
          : "border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50",
        className
      )}
    >
      {icon}
      <span className="font-medium">{incidentTypeLabels[type]}</span>
    </button>
  );
}

// =============================================================================================
