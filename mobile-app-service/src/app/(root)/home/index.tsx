import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import Icon from "../../../components/Icon";
import IncidentButton from "../../../components/IncidentButton";
import SearchBar from "../../../components/SearchBar";
import IncidentDetailsModal from "../../../components/IncidentDetailsModal";
import ActiveNavigationBanner from "../../../components/ActiveNavigationBanner";
import { fetchNearbyIncidents, Incident } from "../../../lib/api/incidents";
import { incidentTypeToIcon } from "../../../utils/mapUtils";
import { StatusBar } from "expo-status-bar";

// ========================================================================================================

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState(null as Location.LocationObject | null);
  const [errorMsg, setErrorMsg] = useState("");
  const [incidents, setIncidents] = useState([] as Incident[]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [hasActiveNavigation, setHasActiveNavigation] = useState(false);
  const [activeDestination, setActiveDestination] = useState<string>("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (global.navigationState) {
      setHasActiveNavigation(true);
      setActiveDestination(global.navigationState.destination.name);
    }

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

        // Fetch nearby incidents when location is available
        if (locationResult) {
          fetchIncidents(locationResult.coords.latitude, locationResult.coords.longitude);
        }
      } catch (error) {
        console.error("Erreur lors de l'obtention de la localisation:", error);
        Alert.alert(
          "Erreur de localisation",
          "Impossible d'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation."
        );
      }
    })();
  }, []);

  const fetchIncidents = async (lat: number, lon: number) => {
    try {
      setIsLoadingIncidents(true);
      const incidentsData = await fetchNearbyIncidents(lat, lon, 5);
      setIncidents(incidentsData);
    } catch (error) {
      console.error("Échec de la récupération des incidents:", error);
      Alert.alert("Erreur", "Impossible de récupérer les incidents à proximité.");
    } finally {
      setIsLoadingIncidents(false);
    }
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleAddIncident = () => {
    router.push("/incident/report");
  };

  const handleSearch = () => {
    router.push("/search");
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

  const handleIncidentPress = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowIncidentDetails(true);
  };

  const resumeNavigation = () => {
    if (global.navigationState) {
      router.push("/navigation");
    }
  };

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
            <MapView
              style={{ width: "100%", height: "100%" }}
              ref={mapRef}
              initialRegion={region}
              region={region}
              onRegionChangeComplete={handleRegionChange}
              showsUserLocation
              showsMyLocationButton={false}
              showsCompass={true}
              rotateEnabled={true}
              toolbarEnabled={false}
              loadingEnabled={true}
              moveOnMarkerPress={false}
            >
              {incidents.map((incident) => (
                <Marker
                  key={incident.id}
                  coordinate={{
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                  }}
                  onPress={() => handleIncidentPress(incident)}
                >
                  <View className="bg-white p-2 rounded-full shadow-md">
                    <Icon name={incidentTypeToIcon(incident.type)} className="text-red-500 size-5" />
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Search Bar */}
            <SafeAreaView className="absolute top-4 left-4 right-4">
              <SearchBar onPress={handleSearch} />
            </SafeAreaView>

            {/* Active Navigation Banner */}
            {hasActiveNavigation && (
              <ActiveNavigationBanner destination={activeDestination} onPress={resumeNavigation} />
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
            <IncidentDetailsModal
              incident={selectedIncident}
              visible={showIncidentDetails}
              onClose={() => setShowIncidentDetails(false)}
            />
          </>
        )}
      </View>
    </View>
  );
}

// ========================================================================================================
