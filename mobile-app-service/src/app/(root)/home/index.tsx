import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import Icon from "../../../components/Icon";
import IncidentButton from "../../../components/IncidentButton";
import SearchBar from "../../../components/SearchBar";
import IncidentDetailsModal from "../../../components/IncidentDetailsModal";
import ActiveNavigationBanner from "../../../components/ActiveNavigationBanner";
import MapWithIncidents from "../../../components/MapWithIncidents";
import { useIncidents } from "../../../contexts/IncidentContext";
import { useNavigation } from "../../../contexts/NavigationContext";
import { StatusBar } from "expo-status-bar";

// ========================================================================================================

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState(null as Location.LocationObject | null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { fetchIncidents, setSelectedIncident, isLoading: isLoadingIncidents, incidents } = useIncidents();
  const { navigationState, hasActiveNavigation } = useNavigation();

  const showSearchBar = !(hasActiveNavigation && navigationState);

  // ========================================================================================================

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission d'accès à la localisation refusée");
          return;
        }

        let locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(locationResult);
        setRegion({
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        if (locationResult) {
          fetchIncidents(locationResult.coords.latitude, locationResult.coords.longitude, 5);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Erreur de localisation",
          "Impossible d'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation."
        );
      }
    })();
  }, [fetchIncidents]);

  // ========================================================================================================

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleAddIncident = () => {
    router.push("/incident/report" as any);
  };

  const handleSearch = () => {
    router.push("/search" as any);
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleIncidentPress = (incidentId: string) => {
    const incident = incidents.find((inc) => inc.id === incidentId);
    if (incident) {
      setSelectedIncident(incident);
      setShowIncidentDetails(true);
    }
  };

  const resumeNavigation = () => {
    router.push("/navigation" as any);
  };

  // ========================================================================================================

  return (
    <View className="flex-1 bg-neutral-10">
      <StatusBar style="auto" translucent backgroundColor="transparent" />
      <View className="flex-1 relative">
        {errorMsg ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">{errorMsg}</Text>
          </View>
        ) : (
          <>
            <MapWithIncidents
              ref={mapRef}
              initialRegion={region}
              region={region}
              onRegionChangeComplete={handleRegionChange}
              onIncidentPress={handleIncidentPress}
            />

            {/* Search Bar */}
            {showSearchBar && (
              <SafeAreaView className="absolute top-4 left-4 right-4">
                <SearchBar onPress={handleSearch} />
              </SafeAreaView>
            )}

            {/* Active Navigation Banner */}
            {hasActiveNavigation && (
              <View className="absolute top-20 left-4 right-4">
                <ActiveNavigationBanner onPress={resumeNavigation} />
              </View>
            )}

            {/* Center on User Button */}
            <View className="absolute bottom-8 left-6">
              <TouchableOpacity
                onPress={centerOnUser}
                className="bg-white size-14 rounded-full items-center justify-center shadow-md"
              >
                <Icon name="Crosshair" className="size-6 text-primary-500" />
              </TouchableOpacity>
            </View>

            {/* Add Incident Button */}
            <View className="absolute bottom-8 right-6">
              <IncidentButton onPress={handleAddIncident} />
            </View>

            {/* Loading Indicator */}
            {isLoadingIncidents && (
              <View className="absolute top-20 right-4 bg-white p-2 rounded-full shadow-md">
                <ActivityIndicator color="#695BF9" size="small" />
              </View>
            )}

            {/* Incident Details Modal */}
            <IncidentDetailsModal visible={showIncidentDetails} setIsVisible={setShowIncidentDetails} />
          </>
        )}
      </View>
    </View>
  );
}

// ========================================================================================================
