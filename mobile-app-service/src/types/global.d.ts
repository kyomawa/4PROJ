import { Itinerary } from "../lib/api/navigation";

// ========================================================================================================

declare global {
  var navigationState: {
    route: Itinerary;
    destination: {
      coords: {
        latitude: number;
        longitude: number;
      };
      name: string;
    };
    startedAt: Date;
  } | null;
}

// ========================================================================================================
