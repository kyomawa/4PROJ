import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "../../../components/Icon";
import { getItinerary, Itinerary, Step } from "../../../lib/api/navigation";
import { formatDistance, formatDuration, incidentTypeToIcon } from "../../../utils/mapUtils";

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

  // Parse destination coordinates
  const destinationCoords = {
    latitude: parseFloat(destLat || "0"),
    longitude: parseFloat(destLon || "0"),
  };

  useEffect(() => {
    // Get current location and fetch itinerary
    const setupNavigation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location permission required", "Please enable location services to use navigation");
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

            // Fit map to show the entire route
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
            Alert.alert("Error", "Could not calculate route. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error setting up navigation:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    setupNavigation();
  }, [destLat, destLon]);

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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-10">
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Calculating the best route...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <View className="flex-row items-center p-4 border-b border-neutral-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="ArrowLeft" className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-satoshi-Bold flex-1" numberOfLines={1}>
          Route to {destName || "Destination"}
        </Text>
      </View>

      <View className="flex-1 relative">
        {/* Map View */}
        <MapView ref={mapRef} style={{ width: "100%", height: "100%" }} showsUserLocation followsUserLocation>
          {/* Destination Marker */}
          {destinationCoords.latitude && destinationCoords.longitude && (
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
          {itinerary?.incidents?.map((incident) => (
            <Marker
              key={incident.id}
              coordinate={{
                latitude: incident.latitude,
                longitude: incident.longitude,
              }}
            >
              <View className="bg-white p-2 rounded-full">
                <Icon name={incidentTypeToIcon(incident.type)} className="text-red-500 size-5" />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Route Summary or Directions */}
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
          <View className="px-4 pt-4 pb-2">
            <View className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
            <TouchableOpacity
              onPress={() => setShowDirections(!showDirections)}
              className="flex-row justify-between items-center mb-2"
            >
              <Text className="text-xl font-satoshi-Bold">{showDirections ? "Route Details" : "Directions"}</Text>
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
                      <Text className="text-neutral-500 mb-1">Duration</Text>
                      <Text className="text-xl font-satoshi-Bold">{formatDuration(itinerary.duration)}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-neutral-500 mb-1">Incidents</Text>
                      <Text className="text-xl font-satoshi-Bold">{itinerary.incidents?.length || 0}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleStartNavigation}
                    className="w-full h-14 bg-primary-500 rounded-full items-center justify-center flex-row"
                  >
                    <Icon name="Navigation" className="text-white size-5 mr-2" />
                    <Text className="text-white text-lg font-satoshi-Bold">Start Navigation</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            // Directions List
            <FlatList
              data={itinerary?.steps || []}
              keyExtractor={(item, index) => `step-${index}`}
              renderItem={renderDirectionItem}
              style={{ maxHeight: Dimensions.get("window").height * 0.5 }}
              ListEmptyComponent={
                <View className="p-4 items-center">
                  <Text className="text-neutral-500">No directions available</Text>
                </View>
              }
              ListFooterComponent={
                <View className="p-4">
                  <TouchableOpacity
                    onPress={handleStartNavigation}
                    className="w-full h-14 bg-primary-500 rounded-full items-center justify-center flex-row"
                  >
                    <Icon name="Navigation" className="text-white size-5 mr-2" />
                    <Text className="text-white text-lg font-satoshi-Bold">Start Navigation</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
