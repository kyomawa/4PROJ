import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from "./Icon";
import { Incident } from "../lib/api/incidents";
import { incidentTypeToIcon } from "../utils/mapUtils";

// ========================================================================================================

type IncidentDetailsModalProps = {
  incident: Incident | null;
  visible: boolean;
  onClose: () => void;
};

export default function IncidentDetailsModal({ incident, visible, onClose }: IncidentDetailsModalProps) {
  if (!incident) return null;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end items-center bg-black/30">
        <View className="bg-white w-full p-5 rounded-t-3xl">
          <View className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
          <View className="flex-row items-center mb-4">
            <View className="bg-primary-50 p-3 rounded-full mr-4">
              <Icon name={incidentTypeToIcon(incident.type)} className="text-primary-500 size-6" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-satoshi-Bold">{getIncidentLabel(incident.type)}</Text>
              <Text className="text-neutral-500">{formatDate(incident.creationDate)}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Icon name="X" className="size-5 text-neutral-500" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Icon name="ThumbsUp" className="text-green-500 size-5 mr-1" />
              <Text className="text-neutral-600">{incident.like}</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="ThumbsDown" className="text-red-500 size-5 mr-1" />
              <Text className="text-neutral-600">{incident.dislike}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} className="bg-primary-500 py-3 rounded-full items-center mt-4">
            <Text className="text-white font-satoshi-Bold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ========================================================================================================
