import { useState, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated,
  User,
  LoginData,
  SignUpData,
} from "../lib/api/auth";
import { updateUserProfile, deleteUserAccount as apiDeleteAccount, UpdateUserData } from "../lib/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Guest mode constants
const GUEST_MODE_KEY = "isGuestMode";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // ========================================================================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        // Check if guest mode is active
        const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
        if (guestMode === "true") {
          setIsGuest(true);
          setIsLoggedIn(false);
          setUser(null);
          setLoading(false);
          return;
        }

        const auth = await isAuthenticated();
        setIsLoggedIn(auth);

        if (auth) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ========================================================================================================

  const setGuestMode = useCallback(async (enabled: boolean): Promise<boolean> => {
    try {
      if (enabled) {
        await AsyncStorage.setItem(GUEST_MODE_KEY, "true");
        setIsGuest(true);
        setIsLoggedIn(false);
        setUser(null);
        return true;
      } else {
        await AsyncStorage.removeItem(GUEST_MODE_KEY);
        setIsGuest(false);
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la configuration du mode invité:", error);
      return false;
    }
  }, []);

  // ========================================================================================================

  const login = useCallback(
    async (data: LoginData) => {
      try {
        // If in guest mode, exit guest mode first
        if (isGuest) {
          await setGuestMode(false);
        }

        setLoading(true);
        const response = await apiLogin(data);

        if (response) {
          setUser(response.data);
          setIsLoggedIn(true);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isGuest, setGuestMode]
  );

  // ========================================================================================================

  const register = useCallback(
    async (data: SignUpData) => {
      try {
        // If in guest mode, exit guest mode first
        if (isGuest) {
          await setGuestMode(false);
        }

        setLoading(true);
        const response = await apiRegister(data);

        if (response) {
          return true;
        }

        return false;
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isGuest, setGuestMode]
  );

  // ========================================================================================================

  const updateProfile = useCallback(
    async (data: UpdateUserData) => {
      // Guest users can't update profiles
      if (isGuest) {
        return false;
      }

      try {
        setLoading(true);

        if (!user) {
          return false;
        }

        const updatedUser = await updateUserProfile(user.id, data);

        if (updatedUser) {
          setUser(updatedUser);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user, isGuest]
  );

  // ========================================================================================================

  const deleteAccount = useCallback(async () => {
    // Guest users can't delete accounts
    if (isGuest) {
      return false;
    }

    try {
      setLoading(true);

      if (!user) {
        return false;
      }

      const success = await apiDeleteAccount(user.id);

      if (success) {
        setUser(null);
        setIsLoggedIn(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, isGuest]);

  // ========================================================================================================

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      if (isGuest) {
        await setGuestMode(false);
        return true;
      }

      await apiLogout();
      setUser(null);
      setIsLoggedIn(false);
      return true;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isGuest, setGuestMode]);

  // ========================================================================================================

  return {
    user,
    loading,
    isLoggedIn,
    isGuest,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    setGuestMode,
  };
}

// ========================================================================================================
