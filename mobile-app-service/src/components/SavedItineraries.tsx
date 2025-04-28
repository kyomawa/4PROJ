import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import Icon from "./Icon";
import { getUserItineraries, deleteItinerary, SavedItinerary } from "../lib/api/navigation";
import { formatDistance, formatDuration } from "../utils/mapUtils";

// ========================================================================================================

type SavedItinerariesProps = {
  onItinerarySelect?: (itinerary: SavedItinerary) => void;
  refreshTrigger?: number; // Increment this to trigger a refresh
};

export default function SavedItineraries({ onItinerarySelect, refreshTrigger = 0 }: SavedItinerariesProps) {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ========================================================================================================

  // Load saved itineraries
  const loadItineraries = useCallback(async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) {
        setIsLoading(true);
      }
      const result = await getUserItineraries();
      if (result) {
        setItineraries(result.itineraries || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des itinéraires:", error);
      Alert.alert("Erreur", "Impossible de charger vos itinéraires sauvegardés");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ========================================================================================================

  // Initial load
  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  // ========================================================================================================

  // Handle refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadItineraries();
    }
  }, [refreshTrigger, loadItineraries]);

  // ========================================================================================================

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadItineraries(false);
  }, [loadItineraries]);

  // ========================================================================================================

  // Handle itinerary deletion
  const handleDeleteItinerary = async (itineraryId: string) => {
    Alert.alert("Supprimer l'itinéraire", "Êtes-vous sûr de vouloir supprimer cet itinéraire ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            const result = await deleteItinerary(itineraryId);
            if (result) {
              setItineraries((prev) => prev.filter((item) => item.id !== itineraryId));
              Alert.alert("Succès", "Itinéraire supprimé avec succès");
            } else {
              Alert.alert("Erreur", "Impossible de supprimer l'itinéraire");
            }
          } catch (error) {
            console.error("Erreur lors de la suppression de l'itinéraire:", error);
            Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  // ========================================================================================================

  // Handle itinerary selection
  const handleSelectItinerary = (itinerary: SavedItinerary) => {
    if (onItinerarySelect) {
      onItinerarySelect(itinerary);
    } else {
      router.push({
        pathname: "/(root)/route" as any,
        params: {
          destLat: itinerary.arrivalLat.toString(),
          destLon: itinerary.arrivalLon.toString(),
          destName: itinerary.arrival,
        },
      });
    }
  };

  // ========================================================================================================

  // Render an individual itinerary item
  const renderItineraryItem = ({ item }: { item: SavedItinerary }) => (
    <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 shadow-sm" onPress={() => handleSelectItinerary(item)}>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-satoshi-Bold" numberOfLines={1}>
            {item.arrival}
          </Text>
          <Text className="text-neutral-500" numberOfLines={1}>
            De: {item.departure}
          </Text>
          <View className="flex-row mt-2">
            <Text className="text-neutral-600 mr-4">
              <Icon name="Clock" className="size-4 text-primary-500" /> {formatDuration(item.duration)}
            </Text>
            <Text className="text-neutral-600">
              <Icon name="Navigation" className="size-4 text-primary-500" /> {formatDistance(item.distance)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="p-2"
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteItinerary(item.id);
          }}
        >
          <Icon name="Trash2" className="size-5 text-red-500" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ========================================================================================================

  // Empty state display
  const renderEmptyState = () => (
    <View className="items-center justify-center py-8">
      <Icon name="MapPin" className="size-10 text-neutral-300 mb-4" />
      <Text className="text-neutral-500 text-center">Vous n'avez pas encore d'itinéraires sauvegardés</Text>
    </View>
  );

  // ========================================================================================================

  if (isLoading && !refreshing) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="text-neutral-500 mt-4">Chargement des itinéraires...</Text>
      </View>
    );
  }

  // ========================================================================================================

  return (
    <View className="flex-1">
      <FlatList
        data={itineraries}
        renderItem={renderItineraryItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#695BF9"]} tintColor="#695BF9" />
        }
      />
    </View>
  );
}

// ========================================================================================================
