"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// =========================================================================================================================================

type SessionPayload = {};

// =========================================================================================================================================

export async function getEmployeeSession(): Promise<SessionPayload | null> {
  const cookiesStore = await cookies();
  const session = cookiesStore.get("employeeSession")?.value;

  if (!session) return null;

  // TODO: ADAPT TO C# APIS
  return JSON.parse(session);
}

// =========================================================================================================================================

export async function createEmployeeSession(userId: string, role: string) {}

// =========================================================================================================================================

export const employeeIsConnected = async () => {
  const session = await getEmployeeSession();
  if (!session || session instanceof Error) {
    return null;
  }
  return session;
};

// =========================================================================================================================================

export async function deleteEmployeeSession() {
  const cookiesStore = await cookies();
  cookiesStore.delete("employeeSession");
  redirect("/panel/connexion");
}

// =========================================================================================================================================
