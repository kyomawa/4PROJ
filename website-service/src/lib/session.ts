"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// =========================================================================================================================================s

type SessionPayload = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
};

// =========================================================================================================================================

export async function getSession(): Promise<SessionPayload | null> {
  const cookiesStore = await cookies();
  const session = cookiesStore.get("session")?.value;
  if (!session) return null;

  return JSON.parse(session);
}

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
