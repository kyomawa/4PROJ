"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// =========================================================================================================================================s

type SessionPayload = {};

// =========================================================================================================================================

export async function getSession(): Promise<SessionPayload | null> {
  const cookiesStore = await cookies();
  const session = cookiesStore.get("session")?.value;
  if (!session) return null;

  // TODO: ADAPT TO C# APIS
  return JSON.parse(session);
}

// =========================================================================================================================================

export async function createSession(userId: string) {}

// =========================================================================================================================================

export const userIsConnected = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
};

// =========================================================================================================================================

export async function deleteSession() {
  const cookiesStore = await cookies();
  cookiesStore.delete("session");
  redirect("/");
}

// =========================================================================================================================================
