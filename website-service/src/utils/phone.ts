// ===================================================================================================

export function toE164(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) {
    return `+33${digits.slice(1)}`;
  }
  if (digits.startsWith("33")) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

// ===================================================================================================
