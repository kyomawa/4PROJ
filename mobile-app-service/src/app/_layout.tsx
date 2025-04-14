import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../styles/global.css";
import { useEffect } from "react";
import { fonts } from "../assets/fonts/font";
import LogtoProviderComponent from "../components/LogtoProviderComponent";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(fonts);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <LogtoProviderComponent>
      <Stack
        screenOptions={{
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </LogtoProviderComponent>
  );
}
