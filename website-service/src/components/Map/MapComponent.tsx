"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchIncidents } from "@/actions/incident/action";
import { searchLocation, calculateRoute } from "@/actions/navigation/action";
import { IncidentType, incidentTypeLabels } from "@/types/incident";
import { toast } from "react-hot-toast";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// --- Correction de l’icône par défaut Leaflet ---
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl,
});

// --- Types ---
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
};

type MapComponentProps = {
  initialCenter?: MapPosition;
  initialZoom?: number;
  onRouteSelect?: (routeInfo: RouteInfo) => void;
};

// --- Hook pour gérer événements map ---
function MapEvents(props: { onClick: (e: L.LeafletMouseEvent) => void; onBoundsChange: () => void }) {
  useMapEvents({
    click: props.onClick,
    zoomend: props.onBoundsChange,
    moveend: props.onBoundsChange,
  });
  return null;
}

// --- Composant principal ---
export default function MapComponent({
  initialCenter = { lat: 46.603354, lng: 1.888334 },
  initialZoom = 6,
  onRouteSelect,
}: MapComponentProps) {
  // états
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [incidents, setIncidents] = useState<IncidentMarker[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [departure, setDeparture] = useState<SelectedLocation | null>(null);
  const [arrival, setArrival] = useState<SelectedLocation | null>(null);
  const [travelMode, setTravelMode] = useState<RouteInfo["travelMode"]>("car");
  const [routeType, setRouteType] = useState<RouteInfo["routeType"]>("fastest");
  const [avoidTollRoads, setAvoidTollRoads] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // ref vers l'instance Leaflet
  const mapRef = useRef<L.Map | null>(null);

  // charge les incidents pour la vue courante
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
      setIncidents(
        res.data.map((inc) => ({
          id: inc.id,
          type: inc.type,
          position: { lat: inc.latitude, lng: inc.longitude },
        }))
      );
    }
  }, []);

  // à la création de la carte, on rattache mapRef et on charge initialement
  useEffect(() => {
    if (mapRef.current) {
      loadIncidents();
    }
  }, [loadIncidents]);

  // clic sur la carte : choix départ/arrivée
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (!departure) {
      setDeparture({
        name: `(${lat.toFixed(5)},${lng.toFixed(5)})`,
        position: { lat, lng },
      });
    } else if (!arrival) {
      const arr = {
        name: `(${lat.toFixed(5)},${lng.toFixed(5)})`,
        position: { lat, lng },
      };
      setArrival(arr);
      calculateRouteAndDisplay(departure, arr);
    }
  };

  // recherche de lieu
  const handleSearch = async () => {
    if (!searchTerm) return;
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
  };

  // sélection d’un résultat
  const selectSearchResult = (r: SearchResult, isDep: boolean) => {
    if (isDep) setDeparture(r);
    else setArrival(r);
    if ((isDep && arrival) || (!isDep && departure)) {
      calculateRouteAndDisplay(isDep ? r : departure!, isDep ? arrival! : r);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  // calcule et affiche l’itinéraire
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
        toast.error("Impossible de calculer l’itinéraire : " + (res.message || ""));
      }
    } catch {
      toast.error("Erreur lors du calcul de l’itinéraire");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // icône d’incident custom
  const createIncidentIcon = (type: string) =>
    L.divIcon({
      className: "custom-incident-marker",
      html: `<div class="bg-red-500 text-white px-2 py-1 rounded-full text-xs">${
        incidentTypeLabels[type as IncidentType] || type
      }</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

  return (
    <div className="w-full h-full flex flex-col">
      {/* barre recherche & options */}
      <div className="p-4 bg-white shadow-md z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="Rechercher un lieu…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              Rechercher
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value as RouteInfo["travelMode"])}
              className="px-3 py-2 border rounded-md"
            >
              <option value="car">Voiture</option>
              <option value="bike">Vélo</option>
              <option value="foot">À pied</option>
              <option value="train">Transport</option>
            </select>
            <select
              value={routeType}
              onChange={(e) => setRouteType(e.target.value as RouteInfo["routeType"])}
              className="px-3 py-2 border rounded-md"
            >
              <option value="fastest">Le plus rapide</option>
              <option value="shortest">Le plus court</option>
              <option value="eco">Écologique</option>
              <option value="thrilling">Touristique</option>
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={avoidTollRoads}
                onChange={(e) => setAvoidTollRoads(e.target.checked)}
              />
              Éviter péages
            </label>
          </div>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-2 bg-white shadow-lg rounded-md p-2 max-h-60 overflow-y-auto">
            <p className="font-semibold mb-2">Résultats :</p>
            <ul>
              {searchResults.map((r, i) => (
                <li key={i} className="mb-2 border-b pb-2">
                  <p>{r.name}</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => selectSearchResult(r, true)}
                      className="px-2 py-1 bg-blue-100 rounded text-sm hover:bg-blue-200"
                    >
                      Départ
                    </button>
                    <button
                      onClick={() => selectSearchResult(r, false)}
                      className="px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200"
                    >
                      Arrivée
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* carte */}
      <div className="flex-1 relative">
        <MapContainer
          center={[initialCenter.lat, initialCenter.lng]}
          zoom={initialZoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <MapEvents onClick={handleMapClick} onBoundsChange={loadIncidents} />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* points départ/arrivée */}
          {departure && (
            <Marker position={[departure.position.lat, departure.position.lng]}>
              <Popup>
                <strong>Départ:</strong> {departure.name}
              </Popup>
            </Marker>
          )}
          {arrival && (
            <Marker position={[arrival.position.lat, arrival.position.lng]}>
              <Popup>
                <strong>Arrivée:</strong> {arrival.name}
              </Popup>
            </Marker>
          )}

          {/* incidents */}
          {incidents.map((inc) => (
            <Marker key={inc.id} position={[inc.position.lat, inc.position.lng]} icon={createIncidentIcon(inc.type)}>
              <Popup>
                <h3 className="font-bold">{incidentTypeLabels[inc.type as IncidentType] || inc.type}</h3>
                <div className="flex gap-2 mt-2">
                  <button className="bg-green-100 px-2 py-1 rounded text-sm hover:bg-green-200">👍 J’approuve</button>
                  <button className="bg-red-100 px-2 py-1 rounded text-sm hover:bg-red-200">👎 Je réfute</button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* itinéraire */}
          {routeCoordinates.length > 0 && <Polyline positions={routeCoordinates} color="#4a89dc" weight={6} />}
        </MapContainer>

        {isLoadingRoute && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50">
            <div className="bg-white p-4 rounded-md shadow-md">
              <p>Calcul de l’itinéraire en cours…</p>
            </div>
          </div>
        )}
      </div>

      {/* panneau info */}
      <div className="p-4 bg-white shadow-md">
        <p>
          <strong>Départ:</strong> {departure?.name || "Non défini"}
        </p>
        <p>
          <strong>Arrivée:</strong> {arrival?.name || "Non défini"}
        </p>
      </div>
    </div>
  );
}
