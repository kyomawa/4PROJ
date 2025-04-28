import axios from "axios/dist/axios.js";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ========================================================================================================

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ========================================================================================================

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================================================================================

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
    }
    if (error.response) {
      console.error("Erreur de réponse:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Erreur de requête:", error.request);
    } else {
      console.error("Erreur:", error.message);
    }

    return Promise.reject(error);
  }
);

// ========================================================================================================

export default axiosClient;

// ========================================================================================================
