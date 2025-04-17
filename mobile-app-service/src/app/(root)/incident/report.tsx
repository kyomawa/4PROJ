import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";
import Icon, { IconProps } from "../../../components/Icon";
import Button from "../../../components/Button";
import { reportIncident } from "../../../lib/api/incidents";
import { StatusBar } from "expo-status-bar";

// ========================================================================================================

type IncidentType = "Crash" | "Bottling" | "ClosedRoad" | "PoliceControl" | "Obstacle";

type IncidentOption = {
  type: IncidentType;
  icon: IconProps["name"];
  label: string;
};

const INCIDENT_OPTIONS: IncidentOption[] = [
  { type: "Crash", icon: "TriangleAlert", label: "Accident" },
  { type: "Bottling", icon: "Car", label: "Embouteillage" },
  { type: "ClosedRoad", icon: "Ban", label: "Route fermée" },
  { type: "PoliceControl", icon: "BadgeAlert", label: "Police" },
  { type: "Obstacle", icon: "CircleAlert", label: "Obstacle" },
];

// ========================================================================================================

export default function ReportIncidentScreen() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================================================================================

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'autorisation d'accès à la localisation est requise pour signaler un incident"
        );
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult);
    })();
  }, []);

  // ========================================================================================================

  const handleSubmit = async () => {
    if (!selectedIncident || !location) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner un type d'incident et vous assurer que la localisation est disponible"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await reportIncident({
        type: selectedIncident,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (result) {
        Alert.alert("Merci !", "Incident signalé avec succès");
        router.back();
      } else {
        Alert.alert("Erreur", "Échec du signalement de l'incident. Veuillez réessayer.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================================================================

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      <View className="flex-row items-center p-4 border-b border-neutral-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="ArrowLeft" className="size-6" />
        </TouchableOpacity>
        <Text className="text-xl font-satoshi-Bold">Signaler un incident</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-lg mb-4">Que se passe-t-il sur la route ?</Text>

        <View className="flex-row flex-wrap justify-between mb-8">
          {INCIDENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => setSelectedIncident(option.type)}
              className={`w-[48%] p-4 rounded-xl mb-4 flex-row items-center ${
                selectedIncident === option.type
                  ? "bg-primary-100 border-2 border-primary-500"
                  : "bg-white border border-neutral-200"
              }`}
            >
              <Icon
                name={option.icon}
                className={`size-6 mr-2 ${selectedIncident === option.type ? "text-primary-500" : "text-neutral-500"}`}
              />
              <Text
                className={`${
                  selectedIncident === option.type ? "text-primary-500 font-satoshi-Bold" : "text-neutral-700"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-neutral-500 mb-8">
          Votre position actuelle sera utilisée pour placer cet incident sur la carte. Assurez-vous d'être à l'endroit
          exact de l'incident.
        </Text>

        <Button handlePress={handleSubmit} isLoading={isSubmitting}>
          Signaler l'incident
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================================================================================
