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

// ========================================================================================================

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ========================================================================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        // Check if the user is authenticated
        const auth = await isAuthenticated();
        setIsLoggedIn(auth);

        // If authenticated, get user data
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

  const login = useCallback(async (data: LoginData) => {
    try {
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
  }, []);

  // ========================================================================================================

  const register = useCallback(async (data: SignUpData) => {
    try {
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
  }, []);

  // ========================================================================================================

  const logout = useCallback(async () => {
    try {
      setLoading(true);
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
  }, []);

  return {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
  };
}

// ========================================================================================================
