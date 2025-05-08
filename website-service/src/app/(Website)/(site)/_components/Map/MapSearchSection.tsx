import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchLocation } from "@/actions/navigation/action";
import { LocationResult } from "@/actions/navigation/types";
import { Search, X, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RouteInfo } from "./MapComponent";
import { formatDuration } from "@/utils/utils";

// ===================================================================================================

type SearchBarSectionProps = {
  onLocationSelect: (
    location: { name: string; position: { lat: number; lng: number } },
    isForDeparture: boolean
  ) => void;
  userLocation: { lat: number; lng: number } | null;
  onCalculateRoute: () => void;
  departureValue: string;
  arrivalValue: string;
  isCalculatingRoute: boolean;
  travelMode: "car" | "bike" | "foot" | "train";
  setTravelMode: (mode: "car" | "bike" | "foot" | "train") => void;
  routeType: "fastest" | "shortest" | "eco" | "thrilling";
  setRouteType: (type: "fastest" | "shortest" | "eco" | "thrilling") => void;
  avoidTollRoads: boolean;
  setAvoidTollRoads: (avoid: boolean) => void;
  calculatedRoute: { distance: number; duration: number } | null;
  handleSaveRoute: () => void;
};

// ===================================================================================================

export default function SearchBarSection({
  onLocationSelect,
  userLocation,
  onCalculateRoute,
  departureValue,
  arrivalValue,
  isCalculatingRoute,
  travelMode,
  setTravelMode,
  routeType,
  setRouteType,
  avoidTollRoads,
  setAvoidTollRoads,
  calculatedRoute,
  handleSaveRoute,
}: SearchBarSectionProps) {
  const [departureSearch, setDepartureSearch] = useState("");
  const [arrivalSearch, setArrivalSearch] = useState("");
  const [departureResults, setDepartureResults] = useState<LocationResult[]>([]);
  const [arrivalResults, setArrivalResults] = useState<LocationResult[]>([]);
  const [isSearchingDeparture, setIsSearchingDeparture] = useState(false);
  const [isSearchingArrival, setIsSearchingArrival] = useState(false);
  const [showDepartureResults, setShowDepartureResults] = useState(false);
  const [showArrivalResults, setShowArrivalResults] = useState(false);

  const debouncedDepartureSearch = useDebounce(departureSearch, 500);
  const debouncedArrivalSearch = useDebounce(arrivalSearch, 500);

  // Search for departure when input changes
  useEffect(() => {
    if (debouncedDepartureSearch.length < 3) {
      setDepartureResults([]);
      return;
    }

    const fetchLocations = async () => {
      setIsSearchingDeparture(true);
      try {
        const result = await searchLocation(debouncedDepartureSearch);
        if (result.success && result.data) {
          setDepartureResults(result.data);
          setShowDepartureResults(true);
        } else {
          setDepartureResults([]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche de départ:", error);
        setDepartureResults([]);
      } finally {
        setIsSearchingDeparture(false);
      }
    };

    fetchLocations();
  }, [debouncedDepartureSearch]);

  // Search for arrival when input changes
  useEffect(() => {
    if (debouncedArrivalSearch.length < 3) {
      setArrivalResults([]);
      return;
    }

    const fetchLocations = async () => {
      setIsSearchingArrival(true);
      try {
        const result = await searchLocation(debouncedArrivalSearch);
        if (result.success && result.data) {
          setArrivalResults(result.data);
          setShowArrivalResults(true);
        } else {
          setArrivalResults([]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche d'arrivée:", error);
        setArrivalResults([]);
      } finally {
        setIsSearchingArrival(false);
      }
    };

    fetchLocations();
  }, [debouncedArrivalSearch]);

  // Handle location selection
  const handleLocationSelect = (location: LocationResult, isForDeparture: boolean) => {
    const formattedLocation = {
      name: location.formatted || `${location.street || ""} ${location.city || ""}`.trim(),
      position: { lat: location.latitude, lng: location.longitude },
    };

    onLocationSelect(formattedLocation, isForDeparture);

    if (isForDeparture) {
      setDepartureSearch("");
      setShowDepartureResults(false);
    } else {
      setArrivalSearch("");
      setShowArrivalResults(false);
    }
  };

  // Handle current location selection
  const handleUseCurrentLocation = (isForDeparture: boolean) => {
    if (!userLocation) {
      toast.error("Impossible d'obtenir votre position actuelle.");
      return;
    }

    const currentLocation = {
      name: "Ma position actuelle",
      position: { lat: userLocation.lat, lng: userLocation.lng },
    };

    onLocationSelect(currentLocation, isForDeparture);

    if (isForDeparture) {
      setShowDepartureResults(false);
    } else {
      setShowArrivalResults(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".departure-search-container")) {
        setShowDepartureResults(false);
      }
      if (!target.closest(".arrival-search-container")) {
        setShowArrivalResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Departure & Arrival */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        {/* Departure Section */}
        <div className="flex flex-col gap-2 departure-search-container">
          <label className="font-medium text-sm text-neutral-700">Départ</label>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Input
                type="text"
                className="pl-10 pr-10"
                placeholder={departureValue || "Lieu de départ..."}
                value={departureSearch}
                onChange={(e) => setDepartureSearch(e.target.value)}
                onFocus={() => {
                  if (departureResults.length > 0) {
                    setShowDepartureResults(true);
                  }
                }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="size-5" />
              </div>
              {departureSearch && (
                <button
                  onClick={() => setDepartureSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => handleUseCurrentLocation(true)}
              title="Utiliser ma position actuelle"
            >
              <Navigation className="size-5" />
            </Button>
          </div>

          {/* Departure Search Results */}
          {showDepartureResults && departureResults.length > 0 && (
            <div className="absolute -top-2 -translate-y-full left-0 right-0 mt-1 bg-white/95 backdrop-blur shadow-sm rounded-md p-2 max-h-72 overflow-y-auto z-20">
              {departureResults.map((result, index) => (
                <div
                  key={`departure-${result.placeId}-${index}`}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleLocationSelect(result, true)}
                >
                  <div className="flex items-start">
                    <MapPin className="size-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium line-clamp-1">{result.formatted || result.placeId}</div>
                      {(result.street || result.city || result.country) && (
                        <div className="text-sm text-neutral-500 line-clamp-1">
                          {[result.street, result.city, result.country].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isSearchingDeparture && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="size-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Arrival Section */}
        <div className="flex flex-col gap-2 arrival-search-container">
          <label className="font-medium text-sm text-neutral-700">Arrivée</label>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Input
                type="text"
                className="pl-10 pr-10"
                placeholder={arrivalValue || "Lieu d'arrivée..."}
                value={arrivalSearch}
                onChange={(e) => setArrivalSearch(e.target.value)}
                onFocus={() => {
                  if (arrivalResults.length > 0) {
                    setShowArrivalResults(true);
                  }
                }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="size-5" />
              </div>
              {arrivalSearch && (
                <button
                  onClick={() => setArrivalSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => handleUseCurrentLocation(false)}
              title="Utiliser ma position actuelle"
            >
              <Navigation className="size-5" />
            </Button>
          </div>

          {/* Arrival Search Results */}
          {showArrivalResults && arrivalResults.length > 0 && (
            <div className="absolute -top-2 -translate-y-full left-0 right-0 mt-1 bg-white/95 backdrop-blur shadow-sm rounded-md p-2 max-h-72 overflow-y-auto z-20">
              {arrivalResults.map((result, index) => (
                <div
                  key={`arrival-${result.placeId}-${index}`}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleLocationSelect(result, false)}
                >
                  <div className="flex items-start">
                    <MapPin className="size-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium line-clamp-1">{result.formatted || result.placeId}</div>
                      {(result.street || result.city || result.country) && (
                        <div className="text-sm text-neutral-500 line-clamp-1">
                          {[result.street, result.city, result.country].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isSearchingArrival && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="size-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Travel Mode & Route Type */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-neutral-700">Options d&apos;itinéraire</label>
            <div className="flex flex-wrap gap-2">
              <Select value={travelMode} onValueChange={(value) => setTravelMode(value as RouteInfo["travelMode"])}>
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="Mode de transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Voiture</SelectItem>
                  <SelectItem value="bike">Vélo</SelectItem>
                  <SelectItem value="foot">À pied</SelectItem>
                  <SelectItem value="train">Transport</SelectItem>
                </SelectContent>
              </Select>

              <Select value={routeType} onValueChange={(value) => setRouteType(value as RouteInfo["routeType"])}>
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="Type d'itinéraire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fastest">Le plus rapide</SelectItem>
                  <SelectItem value="shortest">Le plus court</SelectItem>
                  <SelectItem value="eco">Écologique</SelectItem>
                  <SelectItem value="thrilling">Touristique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toll */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-neutral-700">Péages</label>
            <div className="flex items-center space-x-2 mt-1">
              <Checkbox
                id="toll"
                checked={avoidTollRoads}
                onCheckedChange={(value) => setAvoidTollRoads(value as boolean)}
              />
              <label
                htmlFor="toll"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Éviter les péages
              </label>
            </div>
          </div>
        </div>

        {calculatedRoute && (
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-neutral-700">Informations sur l&apos;itinéraire</label>
            <div className="mt-auto p-3 bg-primary-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-600">
                    Distance:{" "}
                    <span className="font-medium">
                      {calculatedRoute.distance >= 1000
                        ? `${(calculatedRoute.distance / 1000).toFixed(1)} km`
                        : `${Math.round(calculatedRoute.distance)} m`}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-600">
                    Durée: <span className="font-medium">{formatDuration(calculatedRoute.duration)}</span>
                  </p>
                </div>
                <Button onClick={handleSaveRoute}>Sauvegarder cet itinéraire</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculate Route Button */}
      <Button
        type="button"
        className="mt-2 hover:scale-100"
        onClick={onCalculateRoute}
        disabled={isCalculatingRoute || !departureValue || !arrivalValue}
        isLoading={isCalculatingRoute}
      >
        Calculer l&apos;itinéraire
      </Button>
    </div>
  );
}

// ===================================================================================================
