"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchIncidentsByBoundingBox, reactToIncident } from "@/actions/incident/action";
import { calculateRoute } from "@/actions/navigation/action";
import { IncidentType, incidentTypeLabels, ReactionType } from "@/types/incident";
import { toast } from "react-hot-toast";
import ReportIncidentModal from "./ReportIncidentModal";
import SearchBarSection from "./MapSearchSection";
import MapSaveRouteModal from "./MapSaveRouteModal";

// ========================================================================================================

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = markerIcon;

type MapPosition = { lat: number; lng: number };
type SelectedLocation = { name: string; position: MapPosition };

export type RouteInfo = {
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
  initialRoute?: {
    departure: SelectedLocation;
    arrival: SelectedLocation;
    travelMode: "car" | "bike" | "foot" | "train";
  };
};

// ========================================================================================================

export default function MapComponent({
  initialCenter = { lat: 46.603354, lng: 1.888334 },
  initialZoom = 6,
  initialRoute,
}: MapComponentProps) {
  const [incidents, setIncidents] = useState<IncidentMarker[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [departure, setDeparture] = useState<SelectedLocation | null>(initialRoute?.departure || null);
  const [arrival, setArrival] = useState<SelectedLocation | null>(initialRoute?.arrival || null);
  const [travelMode, setTravelMode] = useState<RouteInfo["travelMode"]>(initialRoute?.travelMode || "car");
  const [routeType, setRouteType] = useState<RouteInfo["routeType"]>("fastest");
  const [avoidTollRoads, setAvoidTollRoads] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [userLocation, setUserLocation] = useState<MapPosition | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<MapPosition | null>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<{ distance: number; duration: number } | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

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

          // Center map on user location if map is initialized and no initial route
          if (mapRef.current && !initialRoute) {
            mapRef.current.setView([userPos.lat, userPos.lng], 13);
          }
        },
        (error) => {
          console.error("Erreur lors de l'obtention de la position:", error);
        }
      );
    }
  }, [initialRoute]);

  // Process initial route if provided
  useEffect(() => {
    if (initialRoute && departure && arrival) {
      calculateRouteAndDisplay(departure, arrival);
    }
  }, [initialRoute, departure, arrival]);

  // Charge les incidents pour la vue courante
  const loadIncidents = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const res = await fetchIncidentsByBoundingBox({
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

  // Handle location selection from search
  const handleLocationSelect = (location: SelectedLocation, isForDeparture: boolean) => {
    if (isForDeparture) {
      setDeparture(location);
    } else {
      setArrival(location);
    }

    // Center map on selected location
    if (mapRef.current) {
      mapRef.current.setView([location.position.lat, location.position.lng], 13);
    }
  };

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
        const newDeparture = {
          name: `Position (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          position: { lat, lng },
        };
        setDeparture(newDeparture);
      });

      document.querySelector(".set-arrival")?.addEventListener("click", () => {
        mapRef.current!.closePopup();
        const newArrival = {
          name: `Position (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          position: { lat, lng },
        };
        setArrival(newArrival);
      });

      document.querySelector(".report-incident")?.addEventListener("click", () => {
        mapRef.current!.closePopup();
        setShowReportModal(true);
      });
    }, 100);
  };

  // Calcule et affiche l'itinéraire
  const calculateRouteAndDisplay = async (from: SelectedLocation, to: SelectedLocation) => {
    if (!from || !to) {
      toast.error("Veuillez sélectionner un point de départ et d'arrivée");
      return;
    }

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
        setCalculatedRoute({
          distance: res.data.distance,
          duration: res.data.duration,
        });

        const map = mapRef.current;
        if (map && coords.length) {
          map.fitBounds(L.latLngBounds(coords.map(([a, b]) => L.latLng(a, b))), {
            padding: [50, 50],
          });
        }
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
        if (response.message.includes("connecté")) {
          toast.error("Vous devez être connecté pour réagir aux incidents");
        } else {
          toast.error("Erreur lors de la réaction à l'incident");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la réaction à l'incident:", error);
      toast.error("Erreur lors de la réaction à l'incident");
    }
  };

  const incidentIconUrls: Record<string, string> = {
    Crash: "icons/crash.svg",
    Bottling: "icons/bottling.svg",
    ClosedRoad: "icons/closed-road.svg",
    PoliceControl: "/icons/police-control.svg",
    Obstacle: "icons/obstacle.svg",
  };

  function createIncidentIcon(type: string) {
    const url = incidentIconUrls[type] || incidentIconUrls["Crash"];
    return new L.Icon({
      iconUrl: url,
      iconRetinaUrl: url,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
      shadowUrl: "",
    });
  }
  const startIconUrl = "icons/departure.svg";
  const endIconUrl = "icons/arrival.svg";

  function createStartMarkerIcon() {
    return new L.Icon({
      iconUrl: startIconUrl,
      iconRetinaUrl: startIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
      shadowUrl: "",
    });
  }

  function createEndMarkerIcon() {
    return new L.Icon({
      iconUrl: endIconUrl,
      iconRetinaUrl: endIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
      shadowUrl: "",
    });
  }

  // Handle route calculation
  const handleCalculateRoute = () => {
    if (departure && arrival) {
      calculateRouteAndDisplay(departure, arrival);
    } else {
      toast.error("Veuillez définir un point de départ et d'arrivée");
    }
  };

  // Handle save route
  const handleSaveRoute = () => {
    if (departure && arrival && calculatedRoute) {
      setShowSaveModal(true);
    } else {
      toast.error("Veuillez d'abord calculer un itinéraire");
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
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
              attribution="Dont know"
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png"
            />
            {/* Points départ/arrivée */}
            {departure && (
              <Marker position={[departure.position.lat, departure.position.lng]} icon={createStartMarkerIcon()}>
                <Popup>
                  <strong>Départ:</strong> {departure.name}
                </Popup>
              </Marker>
            )}

            {arrival && (
              <Marker position={[arrival.position.lat, arrival.position.lng]} icon={createEndMarkerIcon()}>
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

      {/* Options de recherche et configuration */}
      <div className="p-4 bg-white/95 backdrop-blur shadow-sm z-[49] absolute bottom-4 inset-x-4 md:bottom-8 md:inset-x-8 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBarSection
            onLocationSelect={handleLocationSelect}
            userLocation={userLocation}
            onCalculateRoute={handleCalculateRoute}
            departureValue={departure?.name || ""}
            arrivalValue={arrival?.name || ""}
            isCalculatingRoute={isLoadingRoute}
            travelMode={travelMode}
            setTravelMode={setTravelMode}
            routeType={routeType}
            setRouteType={setRouteType}
            avoidTollRoads={avoidTollRoads}
            setAvoidTollRoads={setAvoidTollRoads}
            calculatedRoute={calculatedRoute}
            handleSaveRoute={handleSaveRoute}
          />
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

      {/* Modal de sauvegarde d'itinéraire */}
      {showSaveModal && departure && arrival && calculatedRoute && (
        <MapSaveRouteModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          routeInfo={{
            departure,
            arrival,
            distance: calculatedRoute.distance,
            duration: calculatedRoute.duration,
            travelMode,
          }}
        />
      )}

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
