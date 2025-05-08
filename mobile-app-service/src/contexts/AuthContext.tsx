import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { User, LoginData, SignUpData } from "../lib/api/auth";
import { UpdateUserData } from "../lib/api/user";

// ========================================================================================================

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: SignUpData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: UpdateUserData) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  setGuestMode: (enabled: boolean) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// ========================================================================================================

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// ========================================================================================================

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}

// ========================================================================================================
