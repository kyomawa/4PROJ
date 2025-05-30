import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import Icon from "../../../components/Icon";
import IncidentButton from "../../../components/IncidentButton";
import IncidentDetailsModal from "../../../components/IncidentDetailsModal";
import MapWithIncidents from "../../../components/MapWithIncidents";
import { getItinerary, Itinerary } from "../../../lib/api/navigation";
import { useIncidents } from "../../../contexts/IncidentContext";
import { useNavigation } from "../../../contexts/NavigationContext";
import { formatDistance, formatDuration, calculateBoundingBox } from "../../../utils/mapUtils";
import { StatusBar } from "expo-status-bar";
import { usePreferences } from "../../../contexts/PreferencesContext";
import { TransportMode } from "../../../components/TransportModeSelector";
import { useFocusEffect } from "@react-navigation/native";

// ========================================================================================================

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
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculationFailed, setRecalculationFailed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { fetchIncidents, setSelectedIncident, incidents } = useIncidents();
  const { navigationState, setNavigationState, clearNavigation } = useNavigation();
  const { defaultTransportMode } = usePreferences();

  const destinationCoords = {
    latitude: parseFloat(destLat || "0"),
    longitude: parseFloat(destLon || "0"),
  };

  const currentStep =
    itinerary?.steps && itinerary.steps.length > currentStepIndex ? itinerary.steps[currentStepIndex] : null;

  const nextStep =
    itinerary?.steps && itinerary.steps.length > currentStepIndex + 1 ? itinerary.steps[currentStepIndex + 1] : null;

  // ========================================================================================================

  useFocusEffect(
    React.useCallback(() => {
      // Start fetching incidents when screen is focused
      if (location && itinerary) {
        const fetchIncidentsForRoute = async () => {
          const boundingBox = calculateBoundingBox([
            { latitude: location.coords.latitude, longitude: location.coords.longitude },
            ...itinerary.coordinates,
          ]);

          if (boundingBox) {
            const centerLat = (boundingBox.minLat + boundingBox.maxLat) / 2;
            const centerLon = (boundingBox.minLon + boundingBox.maxLon) / 2;
            const radius =
              Math.max(
                (boundingBox.maxLat - boundingBox.minLat) * 111,
                (boundingBox.maxLon - boundingBox.minLon) * 111 * Math.cos(centerLat * (Math.PI / 180))
              ) / 2;

            await fetchIncidents(centerLat, centerLon, radius);
          }
        };

        // Fetch immediately
        fetchIncidentsForRoute();

        // Set up interval
        intervalRef.current = setInterval(fetchIncidentsForRoute, 6500);
      }

      // Clear interval when screen is blurred
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [location, itinerary, fetchIncidents])
  );

  // ========================================================================================================

  const handleCancelNavigation = () => {
    Alert.alert("Arrêter la navigation", "Voulez-vous vraiment arrêter la navigation en cours ?", [
      {
        text: "Non",
        style: "cancel",
      },
      {
        text: "Oui",
        style: "destructive",
        onPress: () => {
          clearNavigation();
          setItinerary(null);
          router.replace("/home");
        },
      },
    ]);
  };

  // ========================================================================================================

  useEffect(() => {
    if (destLat && destLon) {
      setItinerary(null);
      setCurrentStepIndex(0);
      setRecentlyPassedStep(false);
      setRecalculationFailed(false);
    }
  }, [destLat, destLon]);

  // ========================================================================================================

  useEffect(() => {
    if (!itinerary && navigationState?.route) {
      setItinerary(navigationState.route);
    }
  }, [itinerary, navigationState]);

  // ========================================================================================================

  useEffect(() => {
    const initNavigation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission requise",
            "Veuillez activer les services de localisation pour utiliser la navigation"
          );
          router.back();
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setLocation(location);

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          (updatedLocation) => {
            setLocation(updatedLocation);
          }
        );

        setWatchPosition(subscription);

        if (!itinerary && destLat && destLon) {
          await fetchRoute(location, defaultTransportMode);
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

    return () => {
      if (watchPosition) {
        watchPosition.remove();
      }
      Speech.stop();
    };
  }, [defaultTransportMode]);

  // ========================================================================================================

  // Fetch the route
  const fetchRoute = async (currentLoc: Location.LocationObject, transportMode: TransportMode = "car") => {
    try {
      setIsLoading(true);
      setIsRecalculating(true);

      const routeResult = await getItinerary(
        currentLoc.coords.latitude,
        currentLoc.coords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude,
        transportMode,
        "fastest"
      );

      if ("status" in routeResult) {
        console.error("Itinerary error:", routeResult);
        setRecalculationFailed(true);

        return;
      }

      const route = routeResult as Itinerary;
      setItinerary(route);
      setRecalculationFailed(false);

      setNavigationState({
        route,
        destination: {
          coords: destinationCoords,
          name: destName || "Destination",
        },
        startedAt: new Date(),
      });

      if (route.steps && route.steps.length > 0) {
        speakInstruction(route.steps[0].instruction);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRecalculationFailed(true);
    } finally {
      setIsLoading(false);
      setIsRecalculating(false);
    }
  };

  // ========================================================================================================

  useEffect(() => {
    if (!location || !itinerary || !currentStep || isRecalculating) return;

    const checkProgressAlongRoute = async () => {
      if (currentStepIndex === itinerary.steps.length - 1) {
        const distanceToDestination = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          destinationCoords.latitude,
          destinationCoords.longitude
        );

        if (distanceToDestination < 0.05) {
          Alert.alert("Destination atteinte", "Vous êtes arrivé à destination");

          clearNavigation();
          setItinerary(null);

          router.replace("/home");
        }
        return;
      }

      if (nextStep) {
        const distanceToNextStep = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          nextStep.wayPoints.latitude,
          nextStep.wayPoints.longitude
        );

        if (distanceToNextStep < 0.03 && !recentlyPassedStep) {
          setCurrentStepIndex(currentStepIndex + 1);
          speakInstruction(nextStep.instruction);
          setRecentlyPassedStep(true);

          setTimeout(() => {
            setRecentlyPassedStep(false);
          }, 10000);
        }
      }

      const closestPointOnRoute = findClosestPointOnRoute(
        location.coords.latitude,
        location.coords.longitude,
        itinerary.coordinates
      );

      if (closestPointOnRoute.distance > 0.1 && !isRecalculating && !recalculationFailed) {
        speakInstruction("Recalcul de l'itinéraire");
        await fetchRoute(location, defaultTransportMode);
      }
    };

    checkProgressAlongRoute();
  }, [
    location,
    itinerary,
    currentStep,
    currentStepIndex,
    clearNavigation,
    isRecalculating,
    recalculationFailed,
    defaultTransportMode,
  ]);

  // ========================================================================================================

  const handleManualRecalculation = async () => {
    if (!location) return;

    setRecalculationFailed(false);
    await fetchRoute(location, defaultTransportMode);
  };

  // ========================================================================================================

  const speakInstruction = (instruction: string) => {
    Speech.speak(instruction, {
      language: "fr-FR",
      rate: 0.8,
      pitch: 1.0,
    });
  };

  // ========================================================================================================

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ========================================================================================================

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // ========================================================================================================

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

  // ========================================================================================================

  const handleAddIncident = () => {
    router.push("/incident/report" as any);
  };

  // ========================================================================================================

  const handleIncidentPress = (incidentId: string) => {
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
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Démarrage de la navigation...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      <View className="flex-1 relative">
        {/* Map View */}
        <MapWithIncidents
          ref={mapRef}
          itinerary={itinerary}
          destinationCoords={destinationCoords}
          onIncidentPress={handleIncidentPress}
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
        />

        {/* Navigation Header */}
        <View className="absolute top-0 left-0 right-0 bg-white p-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleCancelNavigation} className="p-2">
              <Icon name="X" className="size-6" />
            </TouchableOpacity>

            <Text className="font-satoshi-Bold text-lg flex-1 text-center" numberOfLines={1}>
              {destName || "Destination"}
            </Text>
          </View>
        </View>

        {/* Recalculation Failed Banner */}
        {recalculationFailed && (
          <View className="absolute top-16 left-4 right-4 bg-red-100 rounded-lg p-3 flex-row items-center">
            <Icon name="CircleAlert" className="text-red-500 size-5 mr-2" />
            <Text className="flex-1 text-red-800">Impossible de recalculer l'itinéraire</Text>
            <TouchableOpacity onPress={handleManualRecalculation} className="ml-2 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white">Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

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

        {/* Add Incident Button */}
        <View className="absolute bottom-8 right-6">
          <IncidentButton onPress={handleAddIncident} />
        </View>

        {/* Incident Details Modal */}
        <IncidentDetailsModal visible={showIncidentDetails} setIsVisible={setShowIncidentDetails} />
      </View>
    </SafeAreaView>
  );
}

// ========================================================================================================
