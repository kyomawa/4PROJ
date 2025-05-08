"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchIncidents, reactToIncident } from "@/actions/incident/action";
import { searchLocation, calculateRoute } from "@/actions/navigation/action";
import { IncidentType, incidentTypeLabels, ReactionType } from "@/types/incident";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import ReportIncidentModal from "./ReportIncidentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ========================================================================================================

const DefaultIcon =
  typeof window !== "undefined"
    ? new L.Icon({
        iconUrl: "/img/marker-icon.png",
        iconRetinaUrl: "/img/marker-icon-2x.png",
        shadowUrl: "/img/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    : null;

type MapPosition = { lat: number; lng: number };
type SelectedLocation = { name: string; position: MapPosition };
type SearchResult = { name: string; position: MapPosition };

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
  likes: number;
  dislikes: number;
};

type MapComponentProps = {
  initialCenter?: MapPosition;
  initialZoom?: number;
  onRouteSelect?: (routeInfo: RouteInfo) => void;
};

// ========================================================================================================

export default function MapComponent({
  initialCenter = { lat: 46.603354, lng: 1.888334 },
  initialZoom = 6,
  onRouteSelect,
}: MapComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [incidents, setIncidents] = useState<IncidentMarker[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [departure, setDeparture] = useState<SelectedLocation | null>(null);
  const [arrival, setArrival] = useState<SelectedLocation | null>(null);
  const [travelMode, setTravelMode] = useState<RouteInfo["travelMode"]>("car");
  const [routeType, setRouteType] = useState<RouteInfo["routeType"]>("fastest");
  const [avoidTollRoads, setAvoidTollRoads] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [userLocation, setUserLocation] = useState<MapPosition | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<MapPosition | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const mapRef = useRef<L.Map | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);

          // Center map on user location if map is initialized
          if (mapRef.current) {
            mapRef.current.setView([userPos.lat, userPos.lng], 13);
          }
        },
        (error) => {
          console.error("Erreur lors de l'obtention de la position:", error);
          toast.error("Impossible d'obtenir votre position");
        }
      );
    }
  }, []);

  // Handle search term changes
  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    const fetchLocations = async () => {
      setIsSearching(true);
      try {
        const response = await searchLocation(debouncedSearchTerm);
        if (response.success && response.data) {
          const mappedResults = response.data.map((loc) => ({
            name: loc.formatted || `${loc.street || ""} ${loc.city || ""}`.trim(),
            position: { lat: loc.latitude, lng: loc.longitude },
          }));
          setSearchResults(mappedResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Erreur lors de la recherche de lieux:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchTerm]);

  // Charge les incidents pour la vue courante
  const loadIncidents = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const res = await fetchIncidents({
      minLat: sw.lat,
      maxLat: ne.lat,
      minLon: sw.lng,
      maxLon: ne.lng,
    });

    if (res.success && res.data) {
      const transformedIncidents = res.data.map((inc) => {
        const likesCount = inc.votes?.filter((v) => v.reaction === "Like").length || 0;
        const dislikesCount = inc.votes?.filter((v) => v.reaction === "Dislike").length || 0;

        return {
          id: inc.id,
          type: inc.type,
          position: { lat: inc.latitude, lng: inc.longitude },
          likes: likesCount,
          dislikes: dislikesCount,
        };
      });

      setIncidents(transformedIncidents);
    }
  }, []);

  // À la création de la carte, on rattache mapRef et on charge les incidents
  useEffect(() => {
    if (mapRef.current) {
      loadIncidents();
    }
  }, [loadIncidents]);

  // Clic sur la carte
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setClickedPosition({ lat, lng });

    // Créer un menu contextuel
    L.popup()
      .setLatLng(e.latlng)
      .setContent(
        `
        <div class="context-menu">
          <button class="context-btn set-departure">Définir comme départ</button>
          <button class="context-btn set-arrival">Définir comme arrivée</button>
          <button class="context-btn report-incident">Signaler un incident</button>
        </div>
      `
      )
      .openOn(mapRef.current!);

    // Ajouter des événements aux boutons
    setTimeout(() => {
      document.querySelector(".set-departure")?.addEventListener("click", () => {
        mapRef.current!.closePopup();
        setDeparture({
          name: `(${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          position: { lat, lng },
        });
        if (arrival) {
          calculateRouteAndDisplay(
            {
              name: `(${lat.toFixed(5)}, ${lng.toFixed(5)})`,
              position: { lat, lng },
            },
            arrival
          );
        }
      });

      document.querySelector(".set-arrival")?.addEventListener("click", () => {
        mapRef.current!.closePopup();
        setArrival({
          name: `(${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          position: { lat, lng },
        });
        if (departure) {
          calculateRouteAndDisplay(departure, {
            name: `(${lat.toFixed(5)}, ${lng.toFixed(5)})`,
            position: { lat, lng },
          });
        }
      });

      document.querySelector(".report-incident")?.addEventListener("click", () => {
        mapRef.current!.closePopup();
        setShowReportModal(true);
      });
    }, 100);
  };

  // Recherche de lieu
  const handleSearch = async () => {
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const res = await searchLocation(searchTerm);
      if (res.success && res.data) {
        setSearchResults(
          res.data.map((loc) => ({
            name: loc.formatted || `${loc.street || ""} ${loc.city || ""}`.trim(),
            position: { lat: loc.latitude, lng: loc.longitude },
          }))
        );
      } else {
        toast.error("Recherche impossible : " + (res.message || ""));
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  // Sélection d'un résultat
  const selectSearchResult = (r: SearchResult, isDep: boolean) => {
    if (isDep) {
      setDeparture(r);
      if (arrival) {
        calculateRouteAndDisplay(r, arrival);
      }
    } else {
      setArrival(r);
      if (departure) {
        calculateRouteAndDisplay(departure, r);
      }
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  // Calcule et affiche l'itinéraire
  const calculateRouteAndDisplay = async (from: SelectedLocation, to: SelectedLocation) => {
    setIsLoadingRoute(true);
    try {
      const res = await calculateRoute({
        departureLat: from.position.lat,
        departureLon: from.position.lng,
        arrivalLat: to.position.lat,
        arrivalLon: to.position.lng,
        travelMethod: travelMode,
        routeType,
        avoidTollRoads,
      });
      if (res.success && res.data) {
        const coords = res.data.coordinates.map((c) => [c.latitude, c.longitude]) as [number, number][];
        setRouteCoordinates(coords);

        const map = mapRef.current;
        if (map && coords.length) {
          map.fitBounds(L.latLngBounds(coords.map(([a, b]) => L.latLng(a, b))), {
            padding: [50, 50],
          });
        }
        onRouteSelect?.({
          departure: from,
          arrival: to,
          travelMode,
          routeType,
          avoidTollRoads,
          distance: res.data.distance,
          duration: res.data.duration,
        });
      } else {
        toast.error("Impossible de calculer l'itinéraire : " + (res.message || ""));
      }
    } catch (error) {
      console.error("Erreur lors du calcul de l'itinéraire:", error);
      toast.error("Erreur lors du calcul de l'itinéraire");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Gérer la réaction aux incidents
  const handleIncidentReaction = async (incidentId: string, reaction: "Like" | "Dislike") => {
    try {
      const response = await reactToIncident(incidentId, reaction as ReactionType);
      if (response.success && response.data) {
        toast.success(`Vous avez ${reaction === "Like" ? "approuvé" : "réfuté"} cet incident`);
        loadIncidents(); // Recharger les incidents pour mettre à jour les compteurs
      } else {
        toast.error("Erreur lors de la réaction à l'incident");
      }
    } catch (error) {
      console.error("Erreur lors de la réaction à l'incident:", error);
      toast.error("Erreur lors de la réaction à l'incident");
    }
  };

  // Icône d'incident custom
  const createIncidentIcon = (type: string) => {
    const typeColors: Record<string, string> = {
      Crash: "#ff4d4d", // rouge
      Bottling: "#ff9900", // orange
      ClosedRoad: "#cc0000", // rouge foncé
      PoliceControl: "#0066ff", // bleu
      Obstacle: "#ffcc00", // jaune
    };

    const color = typeColors[type] || "#ff4d4d";

    return L.divIcon({
      className: "custom-incident-marker",
      html: `<div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; white-space: nowrap;">${
        incidentTypeLabels[type as IncidentType] || type
      }</div>`,
      iconSize: [40, 20],
      iconAnchor: [20, 10],
    });
  };

  // Icône de marqueur personnalisée
  const createMarkerIcon = (isStart = false) => {
    return L.icon({
      iconUrl: isStart ? "/img/marker-start.png" : "/img/marker-end.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/img/marker-shadow.png",
      shadowSize: [41, 41],
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barre recherche & options */}
      <div className="p-4 bg-white shadow-sm z-[49]">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-1 gap-2 relative">
            <Input
              type="text"
              className="flex-1 px-4 py-2 border rounded-md"
              placeholder="Rechercher un lieu…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button className="rounded-md px-4 py-2 font-normal" onClick={handleSearch} isLoading={isSearching}>
              Rechercher
            </Button>

            {/* Résultats de recherche */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md p-2 max-h-72 overflow-y-auto z-20">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 rounded flex max-lg:flex-col lg:justify-between lg:items-center"
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => selectSearchResult(result, true)}
                        className="px-2 py-1 bg-blue-100 rounded text-sm hover:bg-blue-200"
                      >
                        Départ
                      </button>
                      <button
                        onClick={() => selectSearchResult(result, false)}
                        className="px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200"
                      >
                        Arrivée
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={travelMode} onValueChange={(value) => setTravelMode(value as RouteInfo["travelMode"])}>
              <SelectTrigger>
                <SelectValue placeholder="Transport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Voiture</SelectItem>
                <SelectItem value="bike">Vélo</SelectItem>
                <SelectItem value="foot">À pied</SelectItem>
                <SelectItem value="train">Transport</SelectItem>
              </SelectContent>
            </Select>
            <Select value={routeType} onValueChange={(value) => setRouteType(value as RouteInfo["routeType"])}>
              <SelectTrigger>
                <SelectValue placeholder="Type de route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fastest">Le plus rapide</SelectItem>
                <SelectItem value="shortest">Le plus court</SelectItem>
                <SelectItem value="eco">Écologique</SelectItem>
                <SelectItem value="thrilling">Touristique</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="toll"
                checked={avoidTollRoads}
                onCheckedChange={(value) => setAvoidTollRoads(value as boolean)}
              />
              <label
                htmlFor="tool"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Éviter péages
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="flex-1 relative z-10">
        {typeof window !== "undefined" && (
          <MapContainer
            center={userLocation ? [userLocation.lat, userLocation.lng] : [initialCenter.lat, initialCenter.lng]}
            zoom={userLocation ? 13 : initialZoom}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <MapEvents onClick={handleMapClick} onBoundsChange={loadIncidents} />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Points départ/arrivée */}
            {departure && DefaultIcon && (
              <Marker position={[departure.position.lat, departure.position.lng]} icon={createMarkerIcon(true)}>
                <Popup>
                  <strong>Départ:</strong> {departure.name}
                </Popup>
              </Marker>
            )}

            {arrival && DefaultIcon && (
              <Marker position={[arrival.position.lat, arrival.position.lng]} icon={createMarkerIcon(false)}>
                <Popup>
                  <strong>Arrivée:</strong> {arrival.name}
                </Popup>
              </Marker>
            )}

            {/* Localisation utilisateur */}
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={L.divIcon({
                  className: "user-location-marker",
                  html: `<div class="h-4 w-4 bg-blue-500 rounded-full border-2 border-white pulse-animation"></div>`,
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })}
              >
                <Popup>Votre position actuelle</Popup>
              </Marker>
            )}

            {/* Incidents */}
            {incidents.map((inc) => (
              <Marker key={inc.id} position={[inc.position.lat, inc.position.lng]} icon={createIncidentIcon(inc.type)}>
                <Popup>
                  <h3 className="font-bold">{incidentTypeLabels[inc.type as IncidentType] || inc.type}</h3>
                  <div className="text-sm mt-1">
                    <span className="mr-2">👍 {inc.likes}</span>
                    <span>👎 {inc.dislikes}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-green-100 px-2 py-1 rounded text-sm hover:bg-green-200"
                      onClick={() => handleIncidentReaction(inc.id, "Like")}
                    >
                      👍 J&apos;approuve
                    </button>
                    <button
                      className="bg-red-100 px-2 py-1 rounded text-sm hover:bg-red-200"
                      onClick={() => handleIncidentReaction(inc.id, "Dislike")}
                    >
                      👎 Je réfute
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Itinéraire */}
            {routeCoordinates.length > 0 && <Polyline positions={routeCoordinates} color="#4a89dc" weight={6} />}
          </MapContainer>
        )}

        {isLoadingRoute && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p>Calcul de l&apos;itinéraire en cours…</p>
            </div>
          </div>
        )}
      </div>

      {/* Panneau info */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <p>
              <strong>Départ:</strong> {departure?.name || "Non défini"}
            </p>
            <p>
              <strong>Arrivée:</strong> {arrival?.name || "Non défini"}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de signalement d'incident */}
      {showReportModal && clickedPosition && (
        <ReportIncidentModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          position={clickedPosition}
        />
      )}

      {/* Style pour l'animation du marqueur de position utilisateur */}
      <style jsx global>{`
        .pulse-animation {
          box-shadow: 0 0 0 rgba(0, 121, 255, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 121, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 121, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 121, 255, 0);
          }
        }

        .context-menu {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .context-btn {
          padding: 6px 12px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s;
        }

        .context-btn:hover {
          background-color: #e9ecef;
        }
      `}</style>
    </div>
  );
}

// ========================================================================================================

function MapEvents(props: { onClick: (e: L.LeafletMouseEvent) => void; onBoundsChange: () => void }) {
  useMapEvents({
    click: props.onClick,
    zoomend: props.onBoundsChange,
    moveend: props.onBoundsChange,
  });
  return null;
}

// ========================================================================================================
