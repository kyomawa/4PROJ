import { IncidentType, IncidentStatus, ReactionType } from "@/types/incident";

export interface Vote {
  id: string;
  userId: string;
  reaction: ReactionType;
}

export interface Incident {
  id: string;
  type: IncidentType;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  creationDate: string;
  votes: Vote[];
}

export interface ReportIncidentParams {
  type: IncidentType;
  latitude: number;
  longitude: number;
}

export interface BoundingBoxParams {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface VoteIncidentParams {
  reaction: ReactionType;
}
