import { IncidentType } from "@/src/types/incident";
import axiosClient from "./axiosClient";

// ========================================================================================================

const endpoint = "/api/statistics";

export type UserCountByMonth = {
  month: string;
  count: number;
};

export type IncidentCountByType = {
  type: IncidentType;
  count: number;
};

export type IncidentCountByHour = {
  hour: number;
  count: number;
};

// ========================================================================================================

/**
 * Fetches user registration counts by month
 */
export const getUsersCountByMonth = async (): Promise<UserCountByMonth[] | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/statistic/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Fetches incident counts by type
 */
export const getIncidentsCountByType = async (): Promise<IncidentCountByType[] | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/statistic/incidents`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incident type statistics:", error);
    return null;
  }
};

// ========================================================================================================

/**
 * Fetches congestion statistics by hour of day
 */
export const getCongestionPeriodByHour = async (): Promise<IncidentCountByHour[] | null> => {
  try {
    const response = await axiosClient.get(`${endpoint}/statistic/congestion`);
    return response.data;
  } catch (error) {
    console.error("Error fetching congestion period statistics:", error);
    return null;
  }
};

// ========================================================================================================
