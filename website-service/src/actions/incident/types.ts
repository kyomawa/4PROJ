import { IncidentType, IncidentStatus, ReactionType } from "@/types/incident";

export type Vote = {
  id: string;
  userId: string;
  reaction: ReactionType;
};

export type Incident = {
  id: string;
  type: IncidentType;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  creationDate: string;
  votes: Vote[];
};

export type ReportIncidentParams = {
  type: IncidentType;
  latitude: number;
  longitude: number;
};

export type BoundingBoxParams = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};
