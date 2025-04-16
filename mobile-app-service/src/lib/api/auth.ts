import axiosClient from "./axiosClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = "/api/auth";

// Types
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

/**
 * Login user with email and password
 */
export const login = async (loginData: LoginData): Promise<AuthResponse | null> => {
  try {
    const response = await axiosClient.post(`${endpoint}/auth`, loginData);

    if (response.data) {
      // Store authentication token
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.data));

      // Add token to axios headers for future requests
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error during login:", error);

    // For development, return mock data
    if (__DEV__) {
      const mockResponse = await mockLogin(loginData);
      return mockResponse;
    }

    return null;
  }
};

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

    // For development, return mock data
    if (__DEV__) {
      const mockUser = await mockRegister(signUpData);
      return mockUser;
    }

    return null;
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    // Remove auth token and user data
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");

    // Remove token from axios headers
    delete axiosClient.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

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

// Initialize authentication state on app start
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

// Mock functions for development
const mockLogin = async (loginData: LoginData): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockUser: User = {
    id: "mock-user-id-123",
    username: "TestUser",
    email: loginData.email,
    phoneNumber: "0612345678",
    role: "User",
  };

  const mockToken = "mock-jwt-token-" + Date.now();

  // Store the mock data
  await AsyncStorage.setItem("userToken", mockToken);
  await AsyncStorage.setItem("userData", JSON.stringify(mockUser));

  // Add token to axios headers
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`;

  return {
    token: mockToken,
    data: mockUser,
  };
};

const mockRegister = async (signUpData: SignUpData): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    id: "mock-user-id-" + Date.now(),
    username: signUpData.username,
    email: signUpData.email,
    phoneNumber: signUpData.phoneNumber,
    role: "User",
  };
};
