import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import carImage from "../assets/images/car.png";
import googleIcon from "../assets/icons/google.png";
import facebookIcon from "../assets/icons/facebook.png";

import ProviderButton from "../components/ProviderButton";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Button from "../components/Button";

// ========================================================================================================

type AuthType = "NONE" | "SIGNIN" | "SIGNUP";

// ========================================================================================================

export default function Index() {
  const { isSignedIn } = useAuth();
  const [authType, setAuthType] = useState<AuthType>("NONE");
  const isHomeScreen = authType === "NONE";
  const title = authType === "SIGNIN" ? "Bienvenu 👋" : "Créer votre compte";

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const imageHeight = useSharedValue(SCREEN_HEIGHT * 0.4);

  // Redirect if the user is signed in
  if (isSignedIn) {
    return <Redirect href="/(root)/home/index" />;
  }

  // Animate the image height based on the authentication state
  useEffect(() => {
    const targetHeight = isHomeScreen ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.25;
    imageHeight.value = withTiming(targetHeight, { duration: 500 });
  }, [authType, isHomeScreen, SCREEN_HEIGHT, imageHeight]);

  return (
    <ScrollView className="flex-1 bg-neutral-10">
      <StatusBar style="auto" />
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
          {isHomeScreen ? "Bienvenue sur Laynz" : title}
        </Text>
      </View>
      {/* Section Content */}
      <View className="px-5 pb-8 gap-y-6">
        {isHomeScreen && <WelcomeMessage />}
        {/* Authentication Forms */}
        {authType === "SIGNIN" && <SignIn />}
        {authType === "SIGNUP" && <SignUp />}
        {/* Buttons */}
        <ButtonList authType={authType} setAuthType={setAuthType} />
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
};

function ButtonList({ authType, setAuthType }: ButtonListProps) {
  const handleSignUpClick = () => {
    setAuthType("SIGNUP");
  };

  return (
    <>
      {/* Sign up button if on home screen */}
      {authType === "NONE" && <Button handlePress={handleSignUpClick}>S'inscrire</Button>}
      {/* Divider */}
      <Divider />
      {/* Provider buttons */}
      <ProviderButtons setAuthType={setAuthType} />
      {/* Authentication sentence */}
      <AuthSentence authType={authType} setAuthType={setAuthType} />
    </>
  );
}

// ========================================================================================================

function Divider() {
  return (
    <View className="flex-row items-center gap-x-2">
      <View className="flex-1 h-px bg-neutral-200" />
      <Text className="text-xl font-Satoshi-Bold text-neutral-400">OU</Text>
      <View className="flex-1 h-px bg-neutral-200" />
    </View>
  );
}

// ========================================================================================================

type ProviderButtonsProps = {
  setAuthType: React.Dispatch<React.SetStateAction<AuthType>>;
};

function ProviderButtons({ setAuthType }: ProviderButtonsProps) {
  return (
    <View className="flex flex-col gap-y-2">
      <ProviderButton title="Connexion avec Google" iconSrc={googleIcon} handlePress={() => setAuthType("NONE")} />
      <ProviderButton title="Connexion avec Facebook" iconSrc={facebookIcon} handlePress={() => setAuthType("NONE")} />
    </View>
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
