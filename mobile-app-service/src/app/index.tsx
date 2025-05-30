import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import carImage from "../assets/images/car.png";

import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Button from "../components/Button";
import { isAuthenticated } from "../lib/api/auth";
import { useAuthContext } from "../contexts/AuthContext";

// ========================================================================================================

type AuthType = "NONE" | "SIGNIN" | "SIGNUP";

// ========================================================================================================

export default function Index() {
  const [authType, setAuthType] = useState<AuthType>("NONE");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { setGuestMode } = useAuthContext();

  const isHomeScreen = authType === "NONE";
  const title = authType === "SIGNIN" ? "Bienvenue 👋" : "Créer votre compte";

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const imageHeight = useSharedValue(SCREEN_HEIGHT * 0.4);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const targetHeight = isHomeScreen ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.25;
    imageHeight.value = withTiming(targetHeight, { duration: 500 });
  }, [authType, isHomeScreen, SCREEN_HEIGHT, imageHeight]);

  const checkLoginStatus = async () => {
    try {
      setIsAuthChecking(true);
      const isLoggedIn = await isAuthenticated();

      if (isLoggedIn) {
        router.replace("/home");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état de connexion:", error);
    } finally {
      setIsAuthChecking(false);
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    router.replace("/home");
  };

  const handleGuestAccess = async () => {
    try {
      await setGuestMode(true);
      router.replace("/home");
    } catch (error) {
      console.error("Erreur lors de l'accès en mode invité:", error);
    }
  };

  if (isAuthChecking) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-10">
        <ActivityIndicator size="large" color="#695BF9" />
        <Text className="mt-4 text-neutral-500">Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-10">
      <StatusBar style="dark" />
      {/* Section Header */}
      <View className="relative items-center w-full">
        <Animated.Image source={carImage} className="z-0 w-full" style={{ height: imageHeight }} />
        <Text
          className={`z-5 absolute ${
            isHomeScreen
              ? "bottom-1 left-1/2 -translate-x-1/2 text-3xl text-neutral-500 font-Satoshi-Medium"
              : "bottom-2 left-5 text-4xl font-satoshi text-neutral-500"
          }`}
        >
          {isHomeScreen ? "Bienvenue sur Supmap" : title}
        </Text>
      </View>
      {/* Section Content */}
      <View className="px-5 pb-8 gap-y-6">
        {isHomeScreen && <WelcomeMessage />}
        {/* Authentication Forms */}
        {authType === "SIGNIN" && <SignIn onSubmit={handleLoginSubmit} />}
        {authType === "SIGNUP" && <SignUp />}
        {/* Buttons */}
        <ButtonList authType={authType} setAuthType={setAuthType} onGuestAccess={handleGuestAccess} />
      </View>
    </ScrollView>
  );
}

// ========================================================================================================

function WelcomeMessage() {
  return (
    <View className="items-center gap-y-2">
      <Text className="text-[2.75rem] text-center">
        Laissez-nous vous aider à <Text className="text-primary-500">voyager sans effort</Text>
      </Text>
      <Text className="text-2xl text-center font-satoshi-Light text-neutral-500">Commencer par vous connecter.</Text>
    </View>
  );
}

// ========================================================================================================

type ButtonListProps = {
  authType: AuthType;
  setAuthType: React.Dispatch<React.SetStateAction<AuthType>>;
  onGuestAccess: () => void;
};

function ButtonList({ authType, setAuthType, onGuestAccess }: ButtonListProps) {
  const handleSignInClick = () => {
    setAuthType("SIGNIN");
  };

  const handleSignUpClick = () => {
    setAuthType("SIGNUP");
  };

  return (
    <>
      {/* Sign up and Guest buttons if on home screen */}
      {authType === "NONE" && (
        <>
          <Button handlePress={handleSignUpClick}>S'inscrire</Button>
          <Button
            handlePress={onGuestAccess}
            containerClassName="!bg-transparent  !border-2 !border-primary-500"
            textClassName="!text-neutral-800"
          >
            Continuer en tant qu'invité
          </Button>
        </>
      )}

      {/* Authentication sentence */}
      <AuthSentence authType={authType} setAuthType={setAuthType} />
    </>
  );
}

// ========================================================================================================

type AuthSentenceProps = {
  authType: AuthType;
  setAuthType: React.Dispatch<React.SetStateAction<AuthType>>;
};

function AuthSentence({ authType, setAuthType }: AuthSentenceProps) {
  const isSignIn = authType === "SIGNIN";

  const toggleAuthType = () => {
    setAuthType(isSignIn ? "SIGNUP" : "SIGNIN");
  };

  return (
    <View className="flex-row items-center justify-center">
      <Text className="text-xl text-center text-neutral-500 font-satoshi">
        {isSignIn ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
      </Text>
      <TouchableOpacity onPress={toggleAuthType} activeOpacity={0.75}>
        <Text className="text-xl text-center text-primary-500 font-satoshi">
          {isSignIn ? "S'inscrire" : "Se connecter"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ========================================================================================================
