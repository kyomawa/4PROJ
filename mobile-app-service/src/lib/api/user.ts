import axiosClient from "./axiosClient";
import { User } from "./auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ========================================================================================================

const endpoint = "/api/user";

export type UpdateUserData = {
  username?: string;
  phoneNumber?: string;
  email?: string;
  currentPassword: string;
};

export type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// ========================================================================================================

/**
 * Update user profile information
 */
export const updateUserProfile = async (userId: string, data: UpdateUserData): Promise<User | null> => {
  try {
    const response = await axiosClient.put(`${endpoint}/user/${userId}`, data);

    if (response.data) {
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
    return null;
  }
};

// ========================================================================================================

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    const response = await axiosClient.delete(`${endpoint}/user/${userId}`);

    if (response.status === 200 || response.status === 204) {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      delete axiosClient.defaults.headers.common["Authorization"];

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting user account:", error);

    return false;
  }
};

// ========================================================================================================
