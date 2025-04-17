import React, { forwardRef, useEffect } from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline, Region, MapViewProps } from "react-native-maps";
import Icon from "./Icon";
import { useIncidents } from "../contexts/IncidentContext";
import { incidentTypeToIcon } from "../utils/mapUtils";
import { Itinerary } from "../lib/api/navigation";

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
            <View className="bg-white p-2 rounded-full shadow-md">
              <Icon name={incidentTypeToIcon(incident.type)} className="text-red-500 size-5" />
            </View>
          </Marker>
        ))}
      </MapView>
    );
  }
);

export default MapWithIncidents;

// ========================================================================================================
