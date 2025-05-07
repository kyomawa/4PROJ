"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Car, MapPin, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { IncidentType, incidentTypeLabels } from "@/types/incident";
import { reportIncident } from "@/actions/incident/action";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
        toast.error(response.message || "Erreur lors du signalement de l'incident");
      }
    } catch (error) {
      console.error("Erreur lors du signalement de l'incident:", error);
      toast.error("Une erreur est survenue lors du signalement de l'incident");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Signaler un incident</SheetTitle>
          <SheetDescription>
            Aidez les autres conducteurs en signalant un problème de circulation à cet endroit.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="size-4" />
            <span>
              Position: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </span>
          </div>

          <h3 className="text-sm font-medium mb-3">Type d&apos;incident:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <IncidentButton
              type={IncidentType.Crash}
              icon={<Car className="size-5" />}
              selected={selectedType === IncidentType.Crash}
              onClick={() => setSelectedType(IncidentType.Crash)}
            />
            <IncidentButton
              type={IncidentType.Bottling}
              icon={<Car className="size-5" />}
              selected={selectedType === IncidentType.Bottling}
              onClick={() => setSelectedType(IncidentType.Bottling)}
            />
            <IncidentButton
              type={IncidentType.ClosedRoad}
              icon={<X className="size-5" />}
              selected={selectedType === IncidentType.ClosedRoad}
              onClick={() => setSelectedType(IncidentType.ClosedRoad)}
            />
            <IncidentButton
              type={IncidentType.PoliceControl}
              icon={<AlertTriangle className="size-5" />}
              selected={selectedType === IncidentType.PoliceControl}
              onClick={() => setSelectedType(IncidentType.PoliceControl)}
            />
            <IncidentButton
              type={IncidentType.Obstacle}
              icon={<AlertTriangle className="size-5" />}
              selected={selectedType === IncidentType.Obstacle}
              onClick={() => setSelectedType(IncidentType.Obstacle)}
              className="sm:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Signaler
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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
      className={`flex items-center gap-2 p-3 rounded-md border text-left transition-all ${
        selected
          ? "bg-primary-50 border-primary-500 text-primary-700"
          : "border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50"
      } ${className || ""}`}
    >
      <div
        className={`size-8 flex items-center justify-center rounded-full ${
          selected ? "bg-primary-100 text-primary-700" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {icon}
      </div>
      <span className="font-medium">{incidentTypeLabels[type]}</span>
    </button>
  );
}

// =============================================================================================
