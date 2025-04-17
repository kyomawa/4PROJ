import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../styles/global.css";
import { useEffect } from "react";
import { fonts } from "../assets/fonts/font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import { initializeAuth } from "../lib/api/auth";
import { AuthProvider } from "../contexts/AuthContext";
import { IncidentProvider } from "../contexts/IncidentContext";

// ========================================================================================================

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Sending `onAnimatedValueUpdate` with no listeners registered",
]);

SplashScreen.preventAutoHideAsync();

// ========================================================================================================

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(fonts);

  useEffect(() => {
    const prepare = async () => {
      try {
        await initializeAuth();
        if (fontsLoaded && !error) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.error("Error during app initialization:", e);
        if (fontsLoaded) await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <IncidentProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(root)" options={{ animation: "fade" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </IncidentProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// ========================================================================================================
