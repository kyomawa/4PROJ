import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Itinerary } from "../lib/api/navigation";

// ========================================================================================================

type Destination = {
  coords: {
    latitude: number;
    longitude: number;
  };
  name: string;
};

type NavigationState = {
  route: Itinerary;
  destination: Destination;
  startedAt: Date;
} | null;

type NavigationContextType = {
  navigationState: NavigationState;
  setNavigationState: (state: NavigationState) => void;
  hasActiveNavigation: boolean;
  clearNavigation: () => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// ========================================================================================================

type NavigationProviderProps = {
  children: ReactNode;
};

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [navigationState, setNavigationState] = useState<NavigationState>(global.navigationState);
  const hasActiveNavigation = navigationState !== null;

  useEffect(() => {
    if (global.navigationState && !navigationState) {
      setNavigationState(global.navigationState);
    }
  }, []);

  useEffect(() => {
    global.navigationState = navigationState;
  }, [navigationState]);

  const clearNavigation = () => {
    setNavigationState(null);
    global.navigationState = null;
  };

  const value = {
    navigationState,
    setNavigationState,
    hasActiveNavigation,
    clearNavigation,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

// ========================================================================================================

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
}

// ========================================================================================================
