import axiosClient from "./axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ========================================================================================================

const endpoint = "/api/auth";

// ========================================================================================================

export type LoginData = {
  email: string;
  password: string;
};

export type SignUpData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
};

export type UserRole = "User" | "Admin";

export type User = {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  data: User;
};

// ========================================================================================================

/**
 * Login user with email and password
 */
export const login = async (loginData: LoginData): Promise<AuthResponse | null> => {
  try {
    const response = await axiosClient.post(`${endpoint}/auth`, loginData);

    if (response.data) {
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.data));

      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error during login:", error);

    return null;
  }
};

// ========================================================================================================

/**
 * Register a new user
 */
export const register = async (signUpData: SignUpData): Promise<User | null> => {
  try {
    const response = await axiosClient.post(`/api/user/user`, {
      username: signUpData.username,
      email: signUpData.email,
      password: signUpData.password,
      confirmPassword: signUpData.confirmPassword,
      phoneNumber: signUpData.phoneNumber,
    });

    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);

    return null;
  }
};

// ========================================================================================================

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");

    delete axiosClient.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// ========================================================================================================

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    return !!token;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

// ========================================================================================================

/**
 * Initialize authentication state on app start
 */
export const initializeAuth = async (): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error initializing auth:", error);
  }
};

// ========================================================================================================
