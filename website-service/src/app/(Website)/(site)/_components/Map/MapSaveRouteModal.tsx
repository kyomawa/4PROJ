"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { saveItinerary } from "@/actions/navigation/action";
import { getConnectedUser } from "@/actions/user/action";
import { SaveItineraryParams } from "@/actions/navigation/types";
import { formatDuration, translateTravelMode } from "@/utils/utils";
import {
  Fusely,
  FuselyBody,
  FuselyContent,
  FuselyDescription,
  FuselyHeader,
  FuselyTitle,
} from "@/components/ui/fusely";

// =============================================================================================

type SaveRouteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  routeInfo: {
    departure: { name: string; position: { lat: number; lng: number } };
    arrival: { name: string; position: { lat: number; lng: number } };
    distance: number;
    duration: number;
    travelMode: string;
  };
};

// =============================================================================================

export default function SaveRouteModal({ isOpen, onClose, routeInfo }: SaveRouteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const userResponse = await getConnectedUser();

      if (!userResponse.success) {
        toast.error("Vous devez être connecté pour sauvegarder un itinéraire");
        setIsLoading(false);
        onClose();
        return;
      }

      const saveData: SaveItineraryParams = {
        departure: routeInfo.departure.name,
        departureLat: routeInfo.departure.position.lat,
        departureLon: routeInfo.departure.position.lng,
        arrival: routeInfo.arrival.name,
        arrivalLat: routeInfo.arrival.position.lat,
        arrivalLon: routeInfo.arrival.position.lng,
        travelMode: routeInfo.travelMode,
        distance: routeInfo.distance,
        duration: routeInfo.duration,
      };

      const response = await saveItinerary(saveData);

      if (response.success) {
        toast.success("Itinéraire sauvegardé avec succès");
        router.refresh();
      } else {
        toast.error(response.message || "Erreur lors de la sauvegarde de l'itinéraire");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'itinéraire:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const formattedDistance =
    routeInfo.distance >= 1000 ? `${(routeInfo.distance / 1000).toFixed(1)} km` : `${Math.round(routeInfo.distance)} m`;

  const formattedDuration = formatDuration(routeInfo.duration);

  return (
    <Fusely open={isOpen} onOpenChange={onClose}>
      <FuselyContent className="sm:max-w-md">
        <FuselyHeader>
          <FuselyTitle>Sauvegarder l&apos;itinéraire</FuselyTitle>
          <FuselyDescription>Enregistrez cet itinéraire pour y accéder facilement plus tard.</FuselyDescription>
        </FuselyHeader>
        <FuselyBody>
          <div className="py-6 space-y-6">
            <div className="bg-primary-50 p-4 rounded-lg space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">Départ</p>
                <p className="font-medium">{routeInfo.departure.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">Arrivée</p>
                <p className="font-medium">{routeInfo.arrival.name}</p>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-neutral-500">Distance</p>
                  <p className="font-medium">{formattedDistance}</p>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-neutral-500">Durée</p>
                  <p className="font-medium">{formattedDuration}</p>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-neutral-500">Mode</p>
                  <p className="font-medium capitalize">{translateTravelMode(routeInfo.travelMode)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button onClick={handleSave} isLoading={isLoading}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </FuselyBody>
      </FuselyContent>
    </Fusely>
  );
}

// =============================================================================================
