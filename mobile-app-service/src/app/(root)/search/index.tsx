import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";
import Icon from "../../../components/Icon";
import { geocodeLocation, Location as LocationType } from "../../../lib/api/navigation";
import { useDebounce } from "../../../hooks/useDebounce";
import { StatusBar } from "expo-status-bar";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [recentSearches, setRecentSearches] = useState<LocationType[]>([]);
  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    if (debouncedSearchText.length < 3) {
      setLocations([]);
      return;
    }

    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const results = await geocodeLocation(debouncedSearchText);
        if (results) {
          setLocations(results);
        }
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchText]);

  const handleLocationSelect = (location: LocationType) => {
    // Store in recent searches (avoiding duplicates)
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.placeId !== location.placeId);
      return [location, ...filtered].slice(0, 5); // Keep only 5 recent searches
    });

    // Navigate to route planning screen with the selected location
    router.push({
      pathname: "/route",
      params: {
        destLat: location.latitude,
        destLon: location.longitude,
        destName: location.formatted,
      },
    });
  };

  const handleMyLocationSelect = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const result = await geocodeLocation(`${location.coords.latitude},${location.coords.longitude}`);

      if (result && result.length > 0) {
        handleLocationSelect(result[0]);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  const renderLocationItem = ({ item }: { item: LocationType }) => (
    <TouchableOpacity className="p-4 border-b border-neutral-200" onPress={() => handleLocationSelect(item)}>
      <Text className="text-base font-satoshi-Medium">{item.formatted}</Text>
      {item.city && (
        <Text className="text-sm text-neutral-500">
          {[item.street, item.city, item.country].filter(Boolean).join(", ")}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      <View className="flex-row items-center p-4 border-b border-neutral-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Icon name="ArrowLeft" className="size-6" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-neutral-100 rounded-full px-4 py-2">
          <Icon name="Search" className="text-neutral-400 size-5 mr-2" />
          <TextInput
            className="flex-1 text-base py-1"
            placeholder="Search for a destination"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Icon name="X" className="text-neutral-400 size-5" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="p-4 items-center">
          <ActivityIndicator size="large" color="#695BF9" />
        </View>
      ) : (
        <>
          {searchText.length > 0 ? (
            <FlatList
              data={locations}
              keyExtractor={(item) => item.placeId}
              renderItem={renderLocationItem}
              ListEmptyComponent={
                <View className="p-4 items-center">
                  <Text className="text-neutral-500">
                    {searchText.length < 3 ? "Enter at least 3 characters to search" : "No results found"}
                  </Text>
                </View>
              }
            />
          ) : (
            <View className="p-4">
              <TouchableOpacity
                className="flex-row items-center p-4 bg-primary-50 rounded-xl mb-4"
                onPress={handleMyLocationSelect}
              >
                <Icon name="Navigation" className="text-primary-500 size-6 mr-3" />
                <Text className="text-base font-satoshi-Medium">Current Location</Text>
              </TouchableOpacity>

              {recentSearches.length > 0 && (
                <>
                  <Text className="text-neutral-500 ml-2 mb-2">Recent Searches</Text>
                  <FlatList
                    data={recentSearches}
                    keyExtractor={(item) => item.placeId}
                    renderItem={renderLocationItem}
                    scrollEnabled={false}
                  />
                </>
              )}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
