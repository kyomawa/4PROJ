import { router } from "expo-router";
import { Text, View } from "react-native";

import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notfound() {
  return (
    <SafeAreaView className="items-center w-full md:w-[550px]">
      <View className="mb-4">
        <Text className="py-1 text-4xl text-center text-white md:text-6xl font-cbold">Section introuvable</Text>
        <Text className="text-xl text-center text-white md:text-2xl font-sregular">
          Désolé, la section que vous recherchez semble introuvable.
        </Text>
      </View>
      <Button handlePress={() => router.push("/")}>Retourner à l'accueil</Button>
    </SafeAreaView>
  );
}
