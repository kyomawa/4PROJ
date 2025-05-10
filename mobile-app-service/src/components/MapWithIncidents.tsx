import React, { forwardRef } from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline, MapViewProps, UrlTile } from "react-native-maps";
import Icon from "./Icon";
import { useIncidents } from "../contexts/IncidentContext";
import { Itinerary } from "../lib/api/navigation";
import Accident from "../assets/icons/crash.svg";
import Bottling from "../assets/icons/bottling.svg";
import ClosedRoad from "../assets/icons/closed-road.svg";
import PoliceControl from "../assets/icons/police-control.svg";
import Obstacle from "../assets/icons/obstacle.svg";

// ========================================================================================================

type MapWithIncidentsProps = MapViewProps & {
  itinerary?: Itinerary | null;
  destinationCoords?: {
    latitude: number;
    longitude: number;
  } | null;
  onIncidentPress?: (incidentId: string) => void;
};

// ========================================================================================================

const MapWithIncidents = forwardRef<MapView, MapWithIncidentsProps>(
  ({ itinerary, destinationCoords, onIncidentPress, ...props }, ref) => {
    const { incidents } = useIncidents();

    // ========================================================================================================

    const handleIncidentPress = (incidentId: string) => {
      if (onIncidentPress) {
        onIncidentPress(incidentId);
      }
    };

    // ========================================================================================================

    return (
      <MapView
        ref={ref}
        style={{ width: "100%", height: "100%" }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={true}
        rotateEnabled={true}
        toolbarEnabled={false}
        loadingEnabled={true}
        moveOnMarkerPress={false}
        {...props}
      >
        {/* Destination Marker */}
        {destinationCoords && (
          <Marker coordinate={destinationCoords}>
            <View className="bg-primary-500 p-2 rounded-full">
              <Icon name="MapPin" className="text-white size-6" />
            </View>
          </Marker>
        )}

        {/* Route Line */}
        {itinerary && itinerary.coordinates.length > 0 && (
          <Polyline coordinates={itinerary.coordinates} strokeWidth={5} strokeColor="#695BF9" lineDashPattern={[0]} />
        )}

        {/* Incident Markers */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{
              latitude: incident.latitude,
              longitude: incident.longitude,
            }}
            onPress={() => handleIncidentPress(incident.id)}
          >
            <View className="rounded-full shadow-md">{incidentTypeToIcon(incident.type)}</View>
          </Marker>
        ))}
      </MapView>
    );
  }
);

export default MapWithIncidents;

// ========================================================================================================

const incidentTypeToIcon = (type: string): JSX.Element => {
  switch (type) {
    case "Crash":
      return <Accident width={24} height={24} />;
    case "Bottling":
      return <Bottling width={24} height={24} />;
    case "ClosedRoad":
      return <ClosedRoad width={24} height={24} />;
    case "PoliceControl":
      return <PoliceControl width={24} height={24} />;
    case "Obstacle":
      return <Obstacle width={24} height={24} />;
    default:
      return <></>;
  }
};

// ========================================================================================================
