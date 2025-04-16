import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import Icon from "../../../components/Icon";
import IncidentButton from "../../../components/IncidentButton";
import SearchBar from "../../../components/SearchBar";
import { fetchNearbyIncidents, Incident } from "../../../lib/api/incidents";
import { incidentTypeToIcon } from "../../../utils/mapUtils";

export default function HomeScreen() {
  const [location, setLocation] = useState(null as Location.LocationObject | null);
  const [errorMsg, setErrorMsg] = useState("");
  const [incidents, setIncidents] = useState([] as Incident[]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
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
    })();
  }, []);

  const fetchIncidents = async (lat: number, lon: number) => {
    try {
      setIsLoadingIncidents(true);
      const incidentsData = await fetchNearbyIncidents(lat, lon, 5); // 5km radius
      setIncidents(incidentsData);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
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

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <View className="flex-1 relative">
        {errorMsg ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">{errorMsg}</Text>
          </View>
        ) : (
          <>
            <MapView
              className="w-full h-full"
              region={region}
              onRegionChangeComplete={handleRegionChange}
              showsUserLocation
              showsMyLocationButton
            >
              {incidents.map((incident) => (
                <Marker
                  key={incident.id}
                  coordinate={{
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                  }}
                >
                  <View className="bg-white p-2 rounded-full">
                    <Icon name={incidentTypeToIcon(incident.type)} className="text-primary-500 size-6" />
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Search Bar */}
            <View className="absolute top-4 left-4 right-4">
              <SearchBar onPress={handleSearch} />
            </View>

            {/* Add Incident Button */}
            <View className="absolute bottom-8 right-8">
              <IncidentButton onPress={handleAddIncident} />
            </View>

            {/* Loading Indicator */}
            {isLoadingIncidents && (
              <View className="absolute top-20 right-4 bg-white p-2 rounded-full">
                <ActivityIndicator color="#695BF9" size="small" />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
