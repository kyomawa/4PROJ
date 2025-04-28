import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransportMode } from "../components/TransportModeSelector";

// ========================================================================================================

type PreferencesContextType = {
  defaultTransportMode: TransportMode;
  setDefaultTransportMode: (mode: TransportMode) => Promise<void>;
  isLoading: boolean;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = "user_preferences";

// ========================================================================================================

type PreferencesProviderProps = {
  children: ReactNode;
};

type StoredPreferences = {
  defaultTransportMode: TransportMode;
};

const DEFAULT_PREFERENCES: StoredPreferences = {
  defaultTransportMode: "car",
};

// ========================================================================================================

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<StoredPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // ========================================================================================================

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // ========================================================================================================

  const savePreferences = async (newPreferences: StoredPreferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  // ========================================================================================================

  const setDefaultTransportMode = async (mode: TransportMode) => {
    const newPreferences = {
      ...preferences,
      defaultTransportMode: mode,
    };
    await savePreferences(newPreferences);
  };

  // ========================================================================================================

  const value = {
    defaultTransportMode: preferences.defaultTransportMode,
    setDefaultTransportMode,
    isLoading,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

// ========================================================================================================

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
}

// ========================================================================================================
