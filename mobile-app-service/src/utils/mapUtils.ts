import { IconProps } from "../components/Icon";

// ========================================================================================================

// Helper function to convert incident types to icon names
export const incidentTypeToIcon = (type: string): IconProps["name"] => {
  switch (type) {
    case "Crash":
      return "TriangleAlert";
    case "Bottling":
      return "Car";
    case "ClosedRoad":
      return "Ban";
    case "PoliceControl":
      return "BadgeAlert";
    case "Obstacle":
      return "RouteOff";
    default:
      return "CircleAlert";
  }
};

// ========================================================================================================

// Convert distance in meters to a human-readable format
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km`;
};

// ========================================================================================================

// Convert duration in seconds to a human-readable format
export const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

// ========================================================================================================

// Calculate bounding box from a list of coordinates
export const calculateBoundingBox = (coordinates: { latitude: number; longitude: number }[]) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLon = coordinates[0].longitude;
  let maxLon = coordinates[0].longitude;

  coordinates.forEach((coord) => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLon = Math.min(minLon, coord.longitude);
    maxLon = Math.max(maxLon, coord.longitude);
  });

  const latPadding = (maxLat - minLat) * 0.1;
  const lonPadding = (maxLon - minLon) * 0.1;

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLon: minLon - lonPadding,
    maxLon: maxLon + lonPadding,
  };
};

// ========================================================================================================
