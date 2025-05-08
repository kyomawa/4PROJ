export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} h ${minutes > 0 ? `${minutes} min` : ""}`;
  }

  return `${minutes} min`;
}

// =============================================================================================

export function translateTravelMode(mode: string): string {
  const translations: Record<string, string> = {
    car: "voiture",
    bike: "vélo",
    foot: "à pied",
    train: "transport",
  };

  return translations[mode.toLowerCase()] || mode;
}

// =============================================================================================
