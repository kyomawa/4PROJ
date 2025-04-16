import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "./Icon";

type SearchBarProps = {
  onPress: () => void;
};

export default function SearchBar({ onPress }: SearchBarProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white flex-row items-center p-4 rounded-full shadow-md"
      activeOpacity={0.7}
    >
      <Icon name="Search" className="mr-2 text-neutral-400 size-5" />
      <Text className="text-neutral-500 flex-1">Where to?</Text>
      <Icon name="Menu" className="text-primary-500 size-5" />
    </TouchableOpacity>
  );
}
