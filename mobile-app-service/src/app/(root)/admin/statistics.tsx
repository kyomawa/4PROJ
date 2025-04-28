import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useAuthContext } from "../../../contexts/AuthContext";
import {
  getUsersCountByMonth,
  getIncidentsCountByType,
  getCongestionPeriodByHour,
  UserCountByMonth,
  IncidentCountByType,
  IncidentCountByHour,
} from "../../../lib/api/statistics";
import { incidentTypeLabels } from "@/src/types/incident";

// ========================================================================================================

export default function StatisticsScreen() {
  const { user } = useAuthContext();
  const [userStats, setUserStats] = useState<UserCountByMonth[] | null>(null);
  const [incidentStats, setIncidentStats] = useState<IncidentCountByType[] | null>(null);
  const [congestionStats, setCongestionStats] = useState<IncidentCountByHour[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========================================================================================================

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      Alert.alert("Accès non autorisé", "Vous n'avez pas les droits pour accéder à cette page");
      router.back();
      return;
    }

    loadStatistics();
  }, [user]);

  // ========================================================================================================

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const [userCountData, incidentCountData, congestionData] = await Promise.all([
        getUsersCountByMonth(),
        getIncidentsCountByType(),
        getCongestionPeriodByHour(),
      ]);

      setUserStats(userCountData);
      setIncidentStats(incidentCountData);
      setCongestionStats(congestionData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      Alert.alert("Erreur", "Impossible de charger les statistiques. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================================================================

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-10 justify-center items-center">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Chargement des statistiques...</Text>
      </SafeAreaView>
    );
  }

  // ========================================================================================================

  // Helper to find the highest value in an array of objects with a count property
  const findMaxCount = (data: any[] | null): number => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((item) => item.count));
  };

  // Maximum values for scaling the charts
  const maxUserCount = findMaxCount(userStats);
  const maxIncidentCount = findMaxCount(incidentStats);
  const maxCongestionCount = findMaxCount(congestionStats);

  // ========================================================================================================

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      <View className="flex-row items-center p-4 border-b border-neutral-200">
        <Text className="text-xl font-satoshi-Bold flex-1">Statistiques</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* User Registration Chart */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-satoshi-Bold mb-4">Inscriptions utilisateurs par mois</Text>
          {userStats && userStats.length > 0 ? (
            <View className="h-40">
              <View className="flex-row justify-between h-full">
                {userStats.map((item, index) => {
                  const barHeight = maxUserCount > 0 ? (item.count / maxUserCount) * 100 : 0;
                  return (
                    <View key={index} className="flex-1 items-center justify-end">
                      <View
                        className="bg-primary-500 w-6 rounded-t-md"
                        style={{ height: `${barHeight}%`, minHeight: item.count > 0 ? 5 : 0 }}
                      />
                      <Text className="text-xs mt-1" numberOfLines={1}>
                        {item.month.substring(0, 3)}
                      </Text>
                      <Text className="text-xs text-neutral-500">{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text className="text-neutral-500 text-center py-4">Aucune donnée disponible</Text>
          )}
        </View>

        {/* Incident Types Chart */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-satoshi-Bold mb-4">Incidents par type</Text>
          {incidentStats && incidentStats.length > 0 ? (
            <View className="h-40">
              <View className="flex-row justify-between h-full">
                {incidentStats.map((item, index) => {
                  const barHeight = maxIncidentCount > 0 ? (item.count / maxIncidentCount) * 100 : 0;
                  return (
                    <View key={index} className="flex-1 items-center justify-end">
                      <View
                        className="bg-red-500 w-6 rounded-t-md"
                        style={{ height: `${barHeight}%`, minHeight: item.count > 0 ? 5 : 0 }}
                      />
                      <Text className="text-xs mt-1" numberOfLines={1}>
                        {incidentTypeLabels[item.type]}
                      </Text>
                      <Text className="text-xs text-neutral-500">{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text className="text-neutral-500 text-center py-4">Aucune donnée disponible</Text>
          )}
        </View>

        {/* Congestion By Hour Chart */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-satoshi-Bold mb-4">Embouteillages par heure</Text>
          {congestionStats && congestionStats.length > 0 ? (
            <View className="h-40">
              <View className="flex-row justify-between h-full">
                {congestionStats.map((item, index) => {
                  if (index % 2 !== 0) return null; // Only show every other hour to save space
                  const barHeight = maxCongestionCount > 0 ? (item.count / maxCongestionCount) * 100 : 0;
                  return (
                    <View key={index} className="flex-1 items-center justify-end">
                      <View
                        className="bg-orange-500 w-4 rounded-t-md"
                        style={{ height: `${barHeight}%`, minHeight: item.count > 0 ? 5 : 0 }}
                      />
                      <Text className="text-xs mt-1" numberOfLines={1}>
                        {item.hour}h
                      </Text>
                      <Text className="text-xs text-neutral-500">{item.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <Text className="text-neutral-500 text-center py-4">Aucune donnée disponible</Text>
          )}
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================================================================================
