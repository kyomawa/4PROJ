import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";
import Icon from "../../../components/Icon";
import { fetchNearbyIncidents, Incident, reactToIncident } from "../../../lib/api/incidents";
import { formatDistance } from "../../../utils/mapUtils";
import { incidentTypeToIcon } from "../../../utils/mapUtils";

export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);

      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Fetch incidents
      const data = await fetchNearbyIncidents(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        10 // 10km radius
      );

      setIncidents(data);
    } catch (error) {
      console.error("Error loading incidents:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIncidents();
  };

  const handleReportIncident = () => {
    router.push("/incident/report");
  };

  const handleReaction = async (incidentId: string, reaction: "Like" | "Dislike") => {
    try {
      const updatedIncident = await reactToIncident(incidentId, reaction);
      if (updatedIncident) {
        // Update the incident in the list
        setIncidents(incidents.map((incident) => (incident.id === incidentId ? updatedIncident : incident)));
      }
    } catch (error) {
      console.error("Error reacting to incident:", error);
    }
  };

  const getIncidentLabel = (type: string): string => {
    switch (type) {
      case "Crash":
        return "Accident";
      case "Bottling":
        return "Traffic Jam";
      case "ClosedRoad":
        return "Closed Road";
      case "PoliceControl":
        return "Police Control";
      case "Obstacle":
        return "Obstacle";
      default:
        return type;
    }
  };

  // Calculate distance from user to incident
  const calculateDistance = (incidentLat: number, incidentLng: number): number | null => {
    if (!location) return null;

    // Simple calculation (not taking into account Earth's curvature)
    const R = 6371; // Earth's radius in km
    const dLat = ((incidentLat - location.coords.latitude) * Math.PI) / 180;
    const dLng = ((incidentLng - location.coords.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.coords.latitude * Math.PI) / 180) *
        Math.cos((incidentLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const renderItem = ({ item }: { item: Incident }) => {
    const distance = calculateDistance(item.latitude, item.longitude);

    return (
      <View className="p-4 border-b border-neutral-200">
        <View className="flex-row items-center mb-2">
          <View className="bg-primary-50 p-2 rounded-full mr-3">
            <Icon name={incidentTypeToIcon(item.type)} className="text-primary-500 size-6" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-satoshi-Bold">{getIncidentLabel(item.type)}</Text>
            <Text className="text-neutral-500">
              {new Date(item.creationDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {distance !== null && ` • ${formatDistance(distance * 1000)}`}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => handleReaction(item.id, "Like")} className="flex-row items-center">
            <Icon name="ThumbsUp" className="size-5 text-neutral-500 mr-1" />
            <Text>{item.like}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleReaction(item.id, "Dislike")} className="flex-row items-center">
            <Icon name="ThumbsDown" className="size-5 text-neutral-500 mr-1" />
            <Text>{item.dislike}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Icon name="Navigation" className="size-5 text-primary-500 mr-1" />
            <Text className="text-primary-500">Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <View className="p-4 border-b border-neutral-200">
        <Text className="text-2xl font-satoshi-Bold">Incidents</Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#695BF9" />
          <Text className="mt-4 text-neutral-500">Loading incidents...</Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Icon name="Info" className="size-12 text-neutral-300 mb-4" />
              <Text className="text-lg text-neutral-500 text-center">No incidents reported in your area.</Text>
            </View>
          }
        />
      )}

      <View className="absolute bottom-8 right-8">
        <TouchableOpacity
          onPress={handleReportIncident}
          className="bg-primary-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Icon name="Plus" className="text-white size-7" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
