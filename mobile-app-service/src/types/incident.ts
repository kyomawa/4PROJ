// ========================================================================================================

/**
 * Types of incidents that can be reported
 */
export enum IncidentType {
  Crash = "Crash",
  Bottling = "Bottling",
  ClosedRoad = "ClosedRoad",
  PoliceControl = "PoliceControl",
  Obstacle = "Obstacle",
}

// ========================================================================================================

/**
 * Status of an incident
 */
export enum IncidentStatus {
  Active = "Active",
  Inactive = "Inactive",
}

// ========================================================================================================

/**
 * Types of reactions to an incident
 */
export enum ReactionType {
  Like = "Like",
  Dislike = "Dislike",
}

// ========================================================================================================

/**
 * Mapping of incident types to French labels
 */
export const incidentTypeLabels: Record<IncidentType, string> = {
  [IncidentType.Crash]: "Accident",
  [IncidentType.Bottling]: "Embouteillage",
  [IncidentType.ClosedRoad]: "Route fermée",
  [IncidentType.PoliceControl]: "Contrôle policier",
  [IncidentType.Obstacle]: "Obstacle",
};

// ========================================================================================================
