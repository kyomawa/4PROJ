import React from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import Icon from "./Icon";
import { useIncidents } from "../contexts/IncidentContext";
import Accident from "../assets/icons/crash.svg";
import Bottling from "../assets/icons/bottling.svg";
import ClosedRoad from "../assets/icons/closed-road.svg";
import PoliceControl from "../assets/icons/police-control.svg";
import Obstacle from "../assets/icons/obstacle.svg";

// ========================================================================================================

type IncidentDetailsModalProps = {
  visible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// ========================================================================================================

export default function IncidentDetailsModal({ visible, setIsVisible }: IncidentDetailsModalProps) {
  const { selectedIncident, reactToIncident, getVoteCounts } = useIncidents();

  if (!selectedIncident) return null;

  const { likes, dislikes } = getVoteCounts(selectedIncident);

  // ========================================================================================================

  const getIncidentLabel = (type: string): string => {
    switch (type) {
      case "Crash":
        return "Accident";
      case "Bottling":
        return "Embouteillage";
      case "ClosedRoad":
        return "Route fermée";
      case "PoliceControl":
        return "Contrôle policier";
      case "Obstacle":
        return "Obstacle";
      default:
        return type;
    }
  };

  // ========================================================================================================

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ========================================================================================================

  const handleReaction = async (reaction: "Like" | "Dislike") => {
    try {
      const success = await reactToIncident(selectedIncident.id, reaction);
      if (!success) {
        Alert.alert("Erreur", "Impossible d'enregistrer votre réaction");
      }
    } catch (error) {
      console.error("Error reacting to incident:", error);
      Alert.alert("Erreur", "Impossible d'enregistrer votre réaction");
    }
  };

  // ========================================================================================================

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end items-center bg-black/30">
        <View className="bg-white w-full p-5 rounded-t-3xl">
          <View className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
          <View className="flex-row items-center mb-12">
            <View className="rounded-full mr-4">
              {/* <View className="bg-primary-50 p-3 rounded-full mr-4"> */}
              {/* <Icon name={incidentTypeToIcon(selectedIncident.type)} className="text-primary-500 size-6" /> */}
              {incidentTypeToIcon(selectedIncident.type)}
            </View>
            <View className="flex-1">
              <Text className="text-xl font-satoshi-Bold">{getIncidentLabel(selectedIncident.type)}</Text>
              <Text className="text-neutral-500">{formatDate(selectedIncident.creationDate)}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsVisible(false)} className="p-2">
              <Icon name="X" className="size-5 text-neutral-500" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mb-12">
            <TouchableOpacity onPress={() => handleReaction("Like")} className="flex-row items-center">
              <Icon name="ThumbsUp" className="text-green-500 size-8 mr-1" />
              <Text className="text-neutral-600">{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReaction("Dislike")} className="flex-row items-center">
              <Icon name="ThumbsDown" className="text-red-500 size-8 mr-1" />
              <Text className="text-neutral-600">{dislikes}</Text>
            </TouchableOpacity>
          </View>
          {selectedIncident.status === "Inactive" && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-700 text-center">Cet incident n'est plus actif</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            className="bg-primary-500 py-3 rounded-full items-center mt-4"
          >
            <Text className="text-white font-satoshi-Bold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ========================================================================================================

const incidentTypeToIcon = (type: string): JSX.Element => {
  switch (type) {
    case "Crash":
      return <Accident width={20} height={20} />;
    case "Bottling":
      return <Bottling width={20} height={20} />;
    case "ClosedRoad":
      return <ClosedRoad width={20} height={20} />;
    case "PoliceControl":
      return <PoliceControl width={20} height={20} />;
    case "Obstacle":
      return <Obstacle width={20} height={20} />;
    default:
      return <></>;
  }
};

// ========================================================================================================
