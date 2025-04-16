import axiosClient from "./axiosClient";
import { User } from "./auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = "/api/user";

export type UpdateUserData = {
  username?: string;
  phoneNumber?: string;
};

export type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (userId: string, data: UpdateUserData): Promise<User | null> => {
  try {
    const response = await axiosClient.put(`${endpoint}/user/${userId}`, data);

    if (response.data) {
      // Update the stored user data
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const updatedUserData = {
          ...parsedUserData,
          ...response.data,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      }

      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);

    // For development, return mock data
    if (__DEV__) {
      const mockResponse = await mockUpdateProfile(userId, data);
      return mockResponse;
    }

    return null;
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    const response = await axiosClient.delete(`${endpoint}/user/${userId}`);

    if (response.status === 200 || response.status === 204) {
      // Clear auth data
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      // Remove token from axios headers
      delete axiosClient.defaults.headers.common["Authorization"];

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting user account:", error);

    // For development, return success
    if (__DEV__) {
      // Clear auth data
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      // Remove token from axios headers
      delete axiosClient.defaults.headers.common["Authorization"];

      return true;
    }

    return false;
  }
};

// Mock functions for development
const mockUpdateProfile = async (userId: string, data: UpdateUserData): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get current user data from storage
  const userData = await AsyncStorage.getItem("userData");
  let currentUser: User;

  if (userData) {
    currentUser = JSON.parse(userData);
  } else {
    currentUser = {
      id: userId,
      username: "TestUser",
      email: "test@example.com",
      phoneNumber: "0612345678",
      role: "User",
    };
  }

  // Update with new data
  const updatedUser = {
    ...currentUser,
    ...(data.username && { username: data.username }),
    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
  };

  // Update storage
  await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

  return updatedUser;
};
