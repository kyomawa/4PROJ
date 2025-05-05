/**
 * Types d'incidents qui peuvent être signalés
 */
export enum IncidentType {
  Crash = "Crash",
  Bottling = "Bottling",
  ClosedRoad = "ClosedRoad",
  PoliceControl = "PoliceControl",
  Obstacle = "Obstacle",
}

/**
 * Statut d'un incident
 */
export enum IncidentStatus {
  Active = "Active",
  Inactive = "Inactive",
}

/**
 * Types de réactions à un incident
 */
export enum ReactionType {
  Like = "Like",
  Dislike = "Dislike",
}

/**
 * Libellés en français pour les types d'incidents
 */
export const incidentTypeLabels: Record<IncidentType, string> = {
  [IncidentType.Crash]: "Accident",
  [IncidentType.Bottling]: "Embouteillage",
  [IncidentType.ClosedRoad]: "Route fermée",
  [IncidentType.PoliceControl]: "Contrôle policier",
  [IncidentType.Obstacle]: "Obstacle",
};
