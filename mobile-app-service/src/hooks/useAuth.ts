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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ========================================================================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

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

  const updateProfile = useCallback(
    async (data: UpdateUserData) => {
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
    [user]
  );

  // ========================================================================================================

  const deleteAccount = useCallback(async () => {
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
  }, [user]);

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

  // ========================================================================================================

  return {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };
}

// ========================================================================================================
