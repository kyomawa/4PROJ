export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Step {
  distance: number;
  duration: number;
  instruction: string;
  type: string;
  wayPoints: Coordinate;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface Vote {
  id: string;
  userId: string;
  reaction: "Like" | "Dislike";
}

export interface Incident {
  id: string;
  type: string;
  longitude: number;
  latitude: number;
  status: string;
  creationDate: string;
  votes: Vote[];
}

export interface RouteParams {
  departureLat: number;
  departureLon: number;
  arrivalLat: number;
  arrivalLon: number;
  travelMethod: "car" | "bike" | "foot" | "train";
  routeType: "fastest" | "shortest" | "eco" | "thrilling";
  avoidTollRoads: boolean;
}

export interface SaveItineraryParams {
  departure: string;
  departureLat: number;
  departureLon: number;
  arrival: string;
  arrivalLat: number;
  arrivalLon: number;
  travelMode: string;
  distance: number;
  duration: number;
}

export interface LocationResult {
  placeId: string;
  latitude: number;
  longitude: number;
  formatted: string;
  wayNumber?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  borough?: string;
  area?: string;
  country?: string;
  boundingBox?: number[];
}

export interface Itinerary {
  travelMode: string;
  distance: number;
  duration: number;
  steps: Step[];
  coordinates: Coordinate[];
  incidents: Incident[];
  boundingBox?: BoundingBox;
}

export interface SavedItinerary {
  id: string;
  departure: string;
  departureLon: number;
  departureLat: number;
  arrival: string;
  arrivalLon: number;
  arrivalLat: number;
  travelMode: string;
  distance: number;
  duration: number;
}

export interface UserItineraries {
  itineraries: SavedItinerary[];
}
