// API URLs
const NAVIGATION_SERVICE_URL = "http://navigation-service:8080";
const INCIDENT_SERVICE_URL = "http://incident-service:8080";

export const API_URL = process.env.EXPO_PUBLIC_API_PROXY_URL || "http://localhost:8081";

export const SERVICE_URLS = {
  NAVIGATION: NAVIGATION_SERVICE_URL,
  INCIDENT: INCIDENT_SERVICE_URL,
};
