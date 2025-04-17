import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Icon from "../../../components/Icon";
import IncidentDetailsModal from "../../../components/IncidentDetailsModal";
import MapWithIncidents from "../../../components/MapWithIncidents";
import { getItinerary, Itinerary, Step } from "../../../lib/api/navigation";
import { useIncidents } from "../../../contexts/IncidentContext";
import { formatDistance, formatDuration, calculateBoundingBox } from "../../../utils/mapUtils";
import { StatusBar } from "expo-status-bar";

// ========================================================================================================

export default function RouteScreen() {
  const mapRef = useRef<MapView>(null);
  const { destLat, destLon, destName } = useLocalSearchParams<{
    destLat: string;
    destLon: string;
    destName: string;
  }>();

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDirections, setShowDirections] = useState(false);
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);

  const { incidents, fetchIncidents, setSelectedIncident } = useIncidents();

  // Parse destination coordinates
  const destinationCoords = {
    latitude: parseFloat(destLat || "0"),
    longitude: parseFloat(destLon || "0"),
  };

  // ========================================================================================================

  useEffect(() => {
    // Get current location and fetch itinerary
    const setupNavigation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Autorisation de localisation requise",
            "Veuillez activer les services de localisation pour utiliser la navigation"
          );
          setIsLoading(false);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);

        // Fetch itinerary
        if (destLat && destLon) {
          const route = await getItinerary(
            location.coords.latitude,
            location.coords.longitude,
            destinationCoords.latitude,
            destinationCoords.longitude,
            "car", // Default to car
            "fastest" // Default to fastest route
          );

          if (route) {
            setItinerary(route);

            global.navigationState = {
              route,
              destination: {
                coords: destinationCoords,
                name: destName || "Destination",
              },
              startedAt: new Date(),
            };

            const boundingBox = calculateBoundingBox([
              { latitude: location.coords.latitude, longitude: location.coords.longitude },
              ...route.coordinates,
            ]);

            if (boundingBox) {
              await fetchIncidents(
                (boundingBox.minLat + boundingBox.maxLat) / 2,
                (boundingBox.minLon + boundingBox.maxLon) / 2,
                10 // 10km radius
              );
            }

            if (mapRef.current && route.coordinates.length > 0) {
              const coordinates = [
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                ...route.coordinates,
              ];

              mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                animated: true,
              });
            }
          } else {
            Alert.alert("Erreur", "Impossible de calculer l'itinéraire. Veuillez réessayer.");
          }
        }
      } catch (error) {
        console.error("Error setting up navigation:", error);
        Alert.alert("Erreur", "Un problème est survenu. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    setupNavigation();
  }, [destLat, destLon, fetchIncidents]);

  // ========================================================================================================

  const renderDirectionItem = ({ item, index }: { item: Step; index: number }) => (
    <View className="flex-row p-4 border-b border-neutral-200">
      <View className="w-8 items-center mr-3">
        <Text className="text-primary-500 font-satoshi-Bold">{index + 1}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base mb-1">{item.instruction}</Text>
        <Text className="text-sm text-neutral-500">{formatDistance(item.distance)}</Text>
      </View>
    </View>
  );

  // ========================================================================================================

  const handleStartNavigation = () => {
    router.push({
      pathname: "/navigation",
      params: {
        destLat: destinationCoords.latitude.toString(),
        destLon: destinationCoords.longitude.toString(),
        destName: destName || "Destination",
      },
    });
  };

  // ========================================================================================================

  const handleIncidentPress = (incidentId: string) => {
    // Find the incident in our context
    const incident = incidents.find((inc) => inc.id === incidentId);
    if (incident) {
      setSelectedIncident(incident);
      setShowIncidentDetails(true);
    }
  };

  // ========================================================================================================

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-10">
        <StatusBar style="dark" />

        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Calcul du meilleur itinéraire...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      <View className="flex-row items-center p-4 border-b border-neutral-200 ">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="ArrowLeft" className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-satoshi-Bold flex-1" numberOfLines={1}>
          Itinéraire vers {destName || "Destination"}
        </Text>
      </View>

      <View className="flex-1 relative">
        {/* Map View */}
        <MapWithIncidents
          ref={mapRef}
          itinerary={itinerary}
          destinationCoords={destinationCoords}
          onIncidentPress={handleIncidentPress}
          showsUserLocation
        />

        {/* Route Summary or Directions */}
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
          <View className="px-4 pt-4 pb-2">
            <View className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
            <TouchableOpacity
              onPress={() => setShowDirections(!showDirections)}
              className="flex-row justify-between items-center mb-2"
            >
              <Text className="text-xl font-satoshi-Bold">
                {showDirections ? "Détails de l'itinéraire" : "Instructions"}
              </Text>
              <Icon name={showDirections ? "ChevronDown" : "ChevronUp"} className="text-neutral-500 size-5" />
            </TouchableOpacity>
          </View>

          {!showDirections ? (
            // Route Summary
            <View className="p-4">
              {itinerary && (
                <>
                  <View className="flex-row justify-between mb-4">
                    <View className="items-center">
                      <Text className="text-neutral-500 mb-1">Distance</Text>
                      <Text className="text-xl font-satoshi-Bold">{formatDistance(itinerary.distance)}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-neutral-500 mb-1">Durée</Text>
                      <Text className="text-xl font-satoshi-Bold">{formatDuration(itinerary.duration)}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-neutral-500 mb-1">Incidents</Text>
                      <Text className="text-xl font-satoshi-Bold">{incidents.length || 0}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleStartNavigation}
                    className="w-full h-14 bg-primary-500 rounded-full items-center justify-center flex-row"
                  >
                    <Icon name="Navigation" className="text-white size-5 mr-2" />
                    <Text className="text-white text-lg font-satoshi-Bold">Démarrer la navigation</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            // Directions List
            <FlatList
              data={itinerary?.steps || []}
              keyExtractor={(_item, index) => `step-${index}`}
              renderItem={renderDirectionItem}
              style={{ maxHeight: Dimensions.get("window").height * 0.5 }}
              ListEmptyComponent={
                <View className="p-4 items-center">
                  <Text className="text-neutral-500">Aucune instruction disponible</Text>
                </View>
              }
              ListFooterComponent={
                <View className="p-4">
                  <TouchableOpacity
                    onPress={handleStartNavigation}
                    className="w-full h-14 bg-primary-500 rounded-full items-center justify-center flex-row"
                  >
                    <Icon name="Navigation" className="text-white size-5 mr-2" />
                    <Text className="text-white text-lg font-satoshi-Bold">Démarrer la navigation</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </View>
      </View>

      {/* Incident Details Modal */}
      <IncidentDetailsModal visible={showIncidentDetails} setIsVisible={setShowIncidentDetails} />
    </SafeAreaView>
  );
}

// ========================================================================================================
