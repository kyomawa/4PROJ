"use client";

// ========================================================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import tt, { LngLatLike } from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { fetchIncidents } from "@/actions/incident/action";
import { searchLocation, calculateRoute } from "@/actions/navigation/action";
import { IncidentType, incidentTypeLabels } from "@/types/incident";
import { toast } from "react-hot-toast";
import { Feature } from "geojson";

// ========================================================================================================

const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "";

// ========================================================================================================

type MapPosition = {
  lat: number;
  lng: number;
};

type SelectedLocation = {
  name: string;
  position: MapPosition;
};

type RouteInfo = {
  departure: SelectedLocation;
  arrival: SelectedLocation;
  travelMode: "car" | "bike" | "foot" | "train";
  routeType: "fastest" | "shortest" | "eco" | "thrilling";
  avoidTollRoads: boolean;
  distance?: number;
  duration?: number;
};

type IncidentMarker = {
  id: string;
  type: string;
  position: MapPosition;
  marker?: tt.Marker;
};

type SearchResult = {
  name: string;
  position: MapPosition;
};

type MapComponentProps = {
  initialCenter?: MapPosition;
  initialZoom?: number;
  onRouteSelect?: (routeInfo: RouteInfo) => void;
};

// ========================================================================================================

export default function MapComponent({
  initialCenter = { lat: 46.603354, lng: 1.888334 }, // France center
  initialZoom = 6,
  onRouteSelect,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<tt.Map | null>(null);
  const routeLayerId = useRef<string>("route");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [incidents, setIncidents] = useState<IncidentMarker[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const [departure, setDeparture] = useState<SelectedLocation | null>(null);
  const [arrival, setArrival] = useState<SelectedLocation | null>(null);
  const [travelMode, setTravelMode] = useState<"car" | "bike" | "foot" | "train">("car");
  const [routeType, setRouteType] = useState<"fastest" | "shortest" | "eco" | "thrilling">("fastest");
  const [avoidTollRoads, setAvoidTollRoads] = useState(false);

  // Load incidents from API
  const loadIncidents = useCallback(async () => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const result = await fetchIncidents({
      minLat: sw.lat,
      maxLat: ne.lat,
      minLon: sw.lng,
      maxLon: ne.lng,
    });

    if (result.success && result.data) {
      // Clear old incidents
      incidents.forEach((inc) => {
        if (inc.marker) inc.marker.remove();
      });

      // Add new incidents
      const newIncidents = result.data.map((inc) => {
        const position = { lat: inc.latitude, lng: inc.longitude };
        const marker = addIncidentMarker(position, inc.type, inc.id);

        return {
          id: inc.id,
          type: inc.type,
          position,
          marker,
        };
      });

      setIncidents(newIncidents);
    }
  }, [incidents]);

  // Handle map click
  const handleMapClick = useCallback(
    (e: tt.MapMouseEvent<"click">) => {
      const { lng, lat } = e.lngLat;

      // If departure is not set, set it
      if (!departure) {
        const newDeparture = {
          name: `Position (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          position: { lat, lng },
        };
        setDeparture(newDeparture);
        addMarker(newDeparture.position, "Départ");
        return;
      }

      // If arrival is not set, set it
      if (!arrival) {
        const newArrival = {
          name: `Position (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          position: { lat, lng },
        };
        setArrival(newArrival);
        addMarker(newArrival.position, "Arrivée");

        // Calculate route if both points are set
        if (departure) {
          calculateRouteAndDisplay(departure, newArrival);
        }
        return;
      }
    },
    [departure, arrival]
  );

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: [initialCenter.lng, initialCenter.lat],
        zoom: initialZoom,
        language: "fr-FR",
      });

      mapRef.current.addControl(new tt.NavigationControl());
      mapRef.current.addControl(new tt.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }));

      // Add click handler to map for incident reporting and location selection
      mapRef.current.on("click", handleMapClick);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [handleMapClick, initialCenter.lat, initialCenter.lng, initialZoom]);

  // Load incidents on map
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("load", loadIncidents);
      // Also load incidents when zoom ends
      mapRef.current.on("zoomend", loadIncidents);
      // Also load incidents when move ends
      mapRef.current.on("moveend", loadIncidents);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off("load", loadIncidents);
        mapRef.current.off("zoomend", loadIncidents);
        mapRef.current.off("moveend", loadIncidents);
      }
    };
  }, [loadIncidents]);

  // Add a marker to the map
  const addMarker = (position: MapPosition, label: string) => {
    if (!mapRef.current) return;

    const element = document.createElement("div");
    element.className = "custom-marker";
    element.innerHTML = `<div class="bg-primary-500 text-white px-2 py-1 rounded-md shadow-md">${label}</div>`;

    new tt.Marker({ element }).setLngLat([position.lng, position.lat] as LngLatLike).addTo(mapRef.current);
  };

  // Add an incident marker to the map
  const addIncidentMarker = (position: MapPosition, type: string, id: string) => {
    if (!mapRef.current) return undefined;

    const label = incidentTypeLabels[type as IncidentType] || type;

    const element = document.createElement("div");
    element.className = "custom-incident-marker";
    element.innerHTML = `<div class="bg-red-500 text-white px-2 py-1 rounded-full shadow-md">${label}</div>`;

    const marker = new tt.Marker({ element })
      .setLngLat([position.lng, position.lat] as LngLatLike)
      .addTo(mapRef.current);

    // Add popup with incident details
    const popup = new tt.Popup({ offset: 30 }).setHTML(`
      <div>
        <h3 class="font-bold">${label}</h3>
        <div class="flex gap-2 mt-2">
          <button id="like-${id}" class="bg-green-100 hover:bg-green-200 px-2 py-1 rounded">👍 J'approuve</button>
          <button id="dislike-${id}" class="bg-red-100 hover:bg-red-200 px-2 py-1 rounded">👎 Je réfute</button>
        </div>
      </div>
    `);

    marker.setPopup(popup);

    return marker;
  };

  // Search for locations
  const handleSearch = async () => {
    if (!searchTerm) return;

    const result = await searchLocation(searchTerm);

    if (result.success && result.data) {
      const locations = result.data.map((loc) => ({
        name: loc.formatted || `${loc.street || ""} ${loc.city || ""}`.trim(),
        position: { lat: loc.latitude, lng: loc.longitude },
      }));

      setSearchResults(locations);
    } else {
      toast.error("Erreur de recherche: " + (result.message || "Impossible de trouver ce lieu"));
    }
  };

  // Select a search result
  const selectSearchResult = (result: SearchResult, isDeparture: boolean) => {
    if (isDeparture) {
      setDeparture(result);
      addMarker(result.position, "Départ");
    } else {
      setArrival(result);
      addMarker(result.position, "Arrivée");
    }

    // Calculate route if both points are set
    if ((isDeparture && arrival) || (!isDeparture && departure)) {
      calculateRouteAndDisplay(isDeparture ? result : departure!, isDeparture ? arrival! : result);
    }

    // Clear search results
    setSearchResults([]);
    setSearchTerm("");
  };

  // Calculate and display route
  const calculateRouteAndDisplay = async (from: SelectedLocation, to: SelectedLocation) => {
    if (!mapRef.current) return;
    setIsLoadingRoute(true);

    try {
      const result = await calculateRoute({
        departureLat: from.position.lat,
        departureLon: from.position.lng,
        arrivalLat: to.position.lat,
        arrivalLon: to.position.lng,
        travelMethod: travelMode,
        routeType,
        avoidTollRoads,
      });

      if (result.success && result.data) {
        const routeData = result.data;

        // Remove previous route if it exists
        if (mapRef.current.getLayer(routeLayerId.current)) {
          mapRef.current.removeLayer(routeLayerId.current);
        }

        if (mapRef.current.getSource("route-source")) {
          mapRef.current.removeSource("route-source");
        }

        // Create GeoJSON feature
        const routeGeoJson: Feature = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeData.coordinates.map((coord) => [coord.longitude, coord.latitude]),
          },
        };

        // Add source and layer to map
        mapRef.current.addSource("route-source", {
          type: "geojson",
          data: routeGeoJson,
        });

        mapRef.current.addLayer({
          id: routeLayerId.current,
          type: "line",
          source: "route-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#4a89dc",
            "line-width": 6,
          },
        });

        // Fit map to route
        const coordinates = routeData.coordinates.map((coord) => [coord.longitude, coord.latitude]);
        if (coordinates.length > 0) {
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord as LngLatLike);
          }, new tt.LngLatBounds(coordinates[0] as LngLatLike, coordinates[0] as LngLatLike));

          mapRef.current.fitBounds(bounds, { padding: 100 });
        }

        // Emit route selection event
        if (onRouteSelect) {
          onRouteSelect({
            departure: from,
            arrival: to,
            travelMode,
            routeType,
            avoidTollRoads,
            distance: routeData.distance,
            duration: routeData.duration,
          });
        }
      } else {
        toast.error("Erreur de calcul d'itinéraire: " + (result.message || "Impossible de calculer l'itinéraire"));
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      toast.error("Erreur de calcul d'itinéraire");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 bg-white shadow-md z-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un lieu..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Rechercher
            </button>
          </div>

          {/* Travel options */}
          <div className="flex gap-2">
            <select
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value as "car" | "bike" | "foot" | "train")}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="car">Voiture</option>
              <option value="bike">Vélo</option>
              <option value="foot">À pied</option>
              <option value="train">Transport</option>
            </select>

            <select
              value={routeType}
              onChange={(e) => setRouteType(e.target.value as "fastest" | "shortest" | "eco" | "thrilling")}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="fastest">Le plus rapide</option>
              <option value="shortest">Le plus court</option>
              <option value="eco">Écologique</option>
              <option value="thrilling">Touristique</option>
            </select>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="avoidTolls"
                checked={avoidTollRoads}
                onChange={(e) => setAvoidTollRoads(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="avoidTolls">Éviter les péages</label>
            </div>
          </div>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mt-2 bg-white shadow-lg rounded-md p-2 max-h-60 overflow-y-auto">
            <p className="font-semibold mb-2">Résultats de recherche:</p>
            <ul>
              {searchResults.map((result, idx) => (
                <li key={idx} className="mb-2 border-b pb-2">
                  <p>{result.name}</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => selectSearchResult(result, true)}
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-sm"
                    >
                      Définir comme départ
                    </button>
                    <button
                      onClick={() => selectSearchResult(result, false)}
                      className="px-2 py-1 bg-green-100 hover:bg-green-200 rounded-md text-sm"
                    >
                      Définir comme arrivée
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="absolute inset-0"></div>

        {/* Loading indicator */}
        {isLoadingRoute && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p>Calcul de l&apos;itinéraire en cours...</p>
            </div>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex flex-col gap-2">
          <p>
            <span className="font-semibold">Départ:</span> {departure?.name || "Non défini"}
          </p>
          <p>
            <span className="font-semibold">Arrivée:</span> {arrival?.name || "Non défini"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================================================================================
