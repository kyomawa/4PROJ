"use client";

import { deleteItinerary } from "@/actions/navigation/action";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Trash } from "lucide-react";
import { SavedItinerary } from "@/actions/navigation/types";
import { formatDuration, translateTravelMode } from "@/utils/utils";
import toast from "react-hot-toast";
import { Link } from "next-view-transitions";
import { SetStateAction, useState } from "react";

// =============================================================================================

type ItinerariesProps = {
  itineraries: SavedItinerary[];
};

// =============================================================================================

export default function Itineraries({ itineraries: oldItineraries }: ItinerariesProps) {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>(oldItineraries);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mes itinéraires enregistrés</h1>
      {itineraries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} setItineraries={setItineraries} />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================================

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="flex justify-center mb-4">
        <MapPin className="text-primary-500 size-16" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Aucun itinéraire enregistré</h2>
      <p className="text-neutral-500 mb-6">
        Vous n&apos;avez pas encore enregistré d&apos;itinéraires. Recherchez une destination et enregistrez votre
        itinéraire préféré.
      </p>
      <Link href="/">
        <Button>Chercher un itinéraire</Button>
      </Link>
    </div>
  );
}

// =============================================================================================

type ItineraryCardProps = {
  itinerary: SavedItinerary;
  setItineraries: React.Dispatch<SetStateAction<SavedItinerary[]>>;
};

function ItineraryCard({ itinerary, setItineraries }: ItineraryCardProps) {
  const formattedDistance =
    itinerary.distance > 1000 ? `${(itinerary.distance / 1000).toFixed(1)} km` : `${itinerary.distance.toFixed(0)} m`;

  const formattedDuration = formatDuration(itinerary.duration);

  const handleDelete = async () => {
    const res = await deleteItinerary(itinerary.id);
    if (!res.success) {
      toast.error(res.message || "Une erreur est survenue lors de la suppression de l'itinéraire");
    }
    setItineraries((prev) => prev.filter((itin) => itin.id !== itinerary.id));
    toast.success("Itinéraire supprimé avec succès");
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4 border-b border-neutral-100">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {itinerary.departure} → {itinerary.arrival}
        </h3>

        <div className="flex items-center text-sm text-neutral-500 gap-x-2">
          <div className="flex items-center">
            <MapPin className="size-4 mr-1" />
            {formattedDistance}
          </div>
          <div>•</div>
          <div>{formattedDuration}</div>
          <div>•</div>
          <div className="capitalize">{translateTravelMode(itinerary.travelMode)}</div>
        </div>
      </div>

      <div className="p-4 flex justify-between">
        <Button
          variant="outlineBasic"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleDelete}
        >
          <div className="flex gap-1.5 items-center">
            <Trash className="size-4" />
            <span>Supprimer</span>
          </div>
        </Button>

        <Link
          href={`/?from=${itinerary.departure}&fromLat=${itinerary.departureLat}&fromLon=${itinerary.departureLon}&to=${itinerary.arrival}&toLat=${itinerary.arrivalLat}&toLon=${itinerary.arrivalLon}&mode=${itinerary.travelMode}`}
        >
          <Button size="sm">
            <div className="flex gap-1.5 items-center">
              <Navigation className="size-4" />
              <span>Naviguer</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}

// =============================================================================================
