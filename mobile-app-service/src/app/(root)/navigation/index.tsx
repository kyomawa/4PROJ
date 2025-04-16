import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import Icon from "../../../components/Icon";
import { getItinerary, Itinerary } from "../../../lib/api/navigation";
import { formatDistance, formatDuration, incidentTypeToIcon } from "../../../utils/mapUtils";

export default function NavigationScreen() {
  const mapRef = useRef<MapView>(null);
  const { destLat, destLon, destName } = useLocalSearchParams<{
    destLat: string;
    destLon: string;
    destName: string;
  }>();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [watchPosition, setWatchPosition] = useState<Location.LocationSubscription | null>(null);
  const [recentlyPassedStep, setRecentlyPassedStep] = useState(false);

  // Parse destination coordinates
  const destinationCoords = {
    latitude: parseFloat(destLat || "0"),
    longitude: parseFloat(destLon || "0"),
  };

  // Get current step
  const currentStep =
    itinerary?.steps && itinerary.steps.length > currentStepIndex ? itinerary.steps[currentStepIndex] : null;

  // Next step
  const nextStep =
    itinerary?.steps && itinerary.steps.length > currentStepIndex + 1 ? itinerary.steps[currentStepIndex + 1] : null;

  useEffect(() => {
    const initNavigation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission requise",
            "Veuillez activer les services de localisation pour utiliser la navigation"
          );
          router.back();
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setLocation(location);

        // Start watching position
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 10, // Update every 10 meters
            timeInterval: 5000, // Or every 5 seconds
          },
          (updatedLocation) => {
            setLocation(updatedLocation);
          }
        );

        setWatchPosition(subscription);

        // Fetch itinerary
        if (destLat && destLon) {
          await fetchRoute(location);
        }
      } catch (error) {
        console.error("Error initializing navigation:", error);
        Alert.alert("Erreur", "Impossible de démarrer la navigation. Veuillez réessayer.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    initNavigation();

    // Cleanup
    return () => {
      if (watchPosition) {
        watchPosition.remove();
      }
      Speech.stop();
    };
  }, []);

  // Fetch the route
  const fetchRoute = async (currentLoc: Location.LocationObject) => {
    try {
      setIsLoading(true);
      const route = await getItinerary(
        currentLoc.coords.latitude,
        currentLoc.coords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude,
        "car",
        "fastest"
      );

      if (route) {
        setItinerary(route);

        // Announce first instruction
        if (route.steps && route.steps.length > 0) {
          speakInstruction(route.steps[0].instruction);
        }
      } else {
        Alert.alert("Erreur", "Impossible de calculer l'itinéraire. Veuillez réessayer.");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      Alert.alert("Erreur", "Impossible de calculer l'itinéraire. Veuillez réessayer.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  // Monitor user progress along the route
  useEffect(() => {
    if (!location || !itinerary || !currentStep) return;

    const checkProgressAlongRoute = async () => {
      // If we're at the last step
      if (currentStepIndex === itinerary.steps.length - 1) {
        // Check if we're close to destination
        const distanceToDestination = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          destinationCoords.latitude,
          destinationCoords.longitude
        );

        if (distanceToDestination < 0.05) {
          // 50 meters
          Alert.alert("Destination atteinte", "Vous êtes arrivé à destination");
          router.replace("/home");
        }
        return;
      }

      // Check if we're close to the next step point
      if (nextStep) {
        const distanceToNextStep = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          nextStep.wayPoints.latitude,
          nextStep.wayPoints.longitude
        );

        // If we're close to the next step point (30 meters)
        if (distanceToNextStep < 0.03 && !recentlyPassedStep) {
          setCurrentStepIndex(currentStepIndex + 1);
          speakInstruction(nextStep.instruction);
          setRecentlyPassedStep(true);

          // Reset the recently passed flag after 10 seconds
          setTimeout(() => {
            setRecentlyPassedStep(false);
          }, 10000);
        }
      }

      // Recalculate route if we're significantly off course
      const closestPointOnRoute = findClosestPointOnRoute(
        location.coords.latitude,
        location.coords.longitude,
        itinerary.coordinates
      );

      if (closestPointOnRoute.distance > 0.1) {
        // More than 100 meters off route
        // Fetch new route
        await fetchRoute(location);

        // Announce rerouting
        speakInstruction("Recalcul de l'itinéraire");
      }
    };

    checkProgressAlongRoute();
  }, [location, itinerary, currentStep, currentStepIndex]);

  // Function to speak instructions
  const speakInstruction = (instruction: string) => {
    Speech.speak(instruction, {
      language: "fr-FR",
      rate: 0.8,
      pitch: 1.0,
    });
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Convert degrees to radians
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Find the closest point on the route
  const findClosestPointOnRoute = (lat: number, lon: number, routeCoordinates: any[]) => {
    let closestPoint = routeCoordinates[0];
    let closestDistance = calculateDistance(lat, lon, closestPoint.latitude, closestPoint.longitude);

    for (const point of routeCoordinates) {
      const distance = calculateDistance(lat, lon, point.latitude, point.longitude);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = point;
      }
    }

    return { point: closestPoint, distance: closestDistance };
  };

  // Center map on current location
  const centerOnUser = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005, // Zoomed in
        longitudeDelta: 0.005,
      });
    }
  };

  // Report an incident at current location
  const reportIncident = () => {
    if (location) {
      router.push("/incident/report");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-10">
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Démarrage de la navigation...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <View className="flex-1 relative">
        {/* Map View */}
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          showsUserLocation
          followsUserLocation
          initialRegion={
            location
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }
              : undefined
          }
        >
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

        {/* Navigation Header */}
        <View className="absolute top-0 left-0 right-0 bg-white p-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Icon name="X" className="size-6" />
            </TouchableOpacity>

            <Text className="font-satoshi-Bold text-lg flex-1 text-center" numberOfLines={1}>
              {destName || "Destination"}
            </Text>

            <TouchableOpacity onPress={reportIncident} className="p-2">
              <Icon name="CircleAlert" className="size-6 text-red-500" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Instruction Card */}
        <View className="absolute bottom-24 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
          {currentStep && (
            <>
              <Text className="text-sm text-neutral-500 mb-1">Prochaine direction</Text>
              <Text className="text-xl font-satoshi-Medium mb-2">{currentStep.instruction}</Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Icon name="Navigation" className="text-primary-500 size-5 mr-2" />
                  <Text className="text-base text-primary-500">
                    {currentStep.distance > 0 ? formatDistance(currentStep.distance) : "Continuez tout droit"}
                  </Text>
                </View>

                {itinerary && (
                  <Text className="text-base text-neutral-500">{formatDuration(itinerary.duration)} restants</Text>
                )}
              </View>
            </>
          )}
        </View>

        {/* Control Buttons */}
        <View className="absolute bottom-4 right-4">
          <TouchableOpacity
            onPress={centerOnUser}
            className="bg-white w-12 h-12 rounded-full items-center justify-center shadow-md"
          >
            <Icon name="Locate" className="size-6 text-primary-500" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
