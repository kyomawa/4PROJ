import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import Icon from "./Icon";
import Button from "./Button";
import { formatDistance, formatDuration } from "../utils/mapUtils";
import { saveItinerary, getUserItineraries, Itinerary } from "../lib/api/navigation";
import { useAuthContext } from "../contexts/AuthContext";

// ========================================================================================================

type SaveItineraryModalProps = {
  visible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  itinerary: Itinerary | null;
  departure: string;
  destination: string;
  onSaveSuccess?: () => void;
};

// ========================================================================================================

export default function SaveItineraryModal({
  visible,
  setIsVisible,
  itinerary,
  departure,
  destination,
  onSaveSuccess,
}: SaveItineraryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuthContext();

  // ========================================================================================================

  const handleSaveItinerary = async () => {
    if (!itinerary) {
      Alert.alert("Erreur", "Aucun itinéraire à sauvegarder");
      return;
    }

    if (!isLoggedIn) {
      Alert.alert("Connexion requise", "Vous devez être connecté pour sauvegarder un itinéraire", [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se connecter",
          onPress: () => {
            setIsVisible(false);
          },
        },
      ]);
      return;
    }

    try {
      setIsLoading(true);

      const firstCoord = itinerary.coordinates[0];
      const lastCoord = itinerary.coordinates[itinerary.coordinates.length - 1];

      const result = await saveItinerary({
        departure: departure,
        departureLat: firstCoord.latitude,
        departureLon: firstCoord.longitude,
        arrival: destination,
        arrivalLat: lastCoord.latitude,
        arrivalLon: lastCoord.longitude,
        travelMode: itinerary.travelMode,
        distance: itinerary.distance,
        duration: itinerary.duration,
      });

      if (result) {
        if (onSaveSuccess) {
          onSaveSuccess();
        }

        Alert.alert("Succès", "Itinéraire sauvegardé avec succès", [
          {
            text: "OK",
            onPress: () => setIsVisible(false),
          },
        ]);
      } else {
        Alert.alert("Erreur", "Impossible de sauvegarder l'itinéraire");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'itinéraire:", error);
      Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================================================================

  if (!itinerary) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end items-center bg-black/30">
        <View className="bg-white w-full p-5 rounded-t-3xl">
          <View className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-satoshi-Bold">Sauvegarder l'itinéraire</Text>
            <TouchableOpacity onPress={() => setIsVisible(false)} className="p-2">
              <Icon name="X" className="size-5 text-neutral-500" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Icon name="MapPin" className="size-5 text-primary-500 mr-2" />
              <Text className="text-lg flex-1" numberOfLines={1}>
                {departure}
              </Text>
            </View>
            <View className="ml-2.5 h-6 w-0.5 bg-neutral-300" />
            <View className="flex-row items-center mt-1">
              <Icon name="Navigation" className="size-5 text-primary-500 mr-2" />
              <Text className="text-lg flex-1" numberOfLines={1}>
                {destination}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-8">
            <View className="items-center">
              <Text className="text-neutral-500 mb-1">Distance</Text>
              <Text className="text-xl font-satoshi-Bold">{formatDistance(itinerary.distance)}</Text>
            </View>
            <View className="items-center">
              <Text className="text-neutral-500 mb-1">Durée</Text>
              <Text className="text-xl font-satoshi-Bold">{formatDuration(itinerary.duration)}</Text>
            </View>
            <View className="items-center">
              <Text className="text-neutral-500 mb-1">Mode</Text>
              <Text className="text-xl font-satoshi-Bold capitalize">{itinerary.travelMode}</Text>
            </View>
          </View>

          <Button handlePress={handleSaveItinerary} isLoading={isLoading}>
            Sauvegarder
          </Button>
        </View>
      </View>
    </Modal>
  );
}

// ========================================================================================================
