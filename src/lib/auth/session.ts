/**
 * Server-only session read/write (Phase 08). The session lives in an httpOnly,
 * SameSite=Lax cookie so it is never readable from client JS. In DEMO mode the
 * cookie holds a labelled local session (no server account store); in Supabase
 * mode it would hold the GoTrue tokens and be resolved against `/auth/v1/user`.
 *
 * SERVER BOUNDARY: this module imports `next/headers` and must only be used from
 * Server Components / server actions / route handlers.
 */

import { cookies } from "next/headers";
import { backendMode } from "@/lib/backend/config";
import type { Session, SessionUser } from "./types";

export const SESSION_COOKIE = "athathi_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Read + parse the current session, or null. Never throws. */
export async function getSession(): Promise<Session | null> {
  try {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionUser> & { mode?: string };
    if (!parsed || typeof parsed.id !== "string" || typeof parsed.email !== "string") {
      return null;
    }
    const user: SessionUser = {
      id: parsed.id,
      email: parsed.email,
      displayName: typeof parsed.displayName === "string" ? parsed.displayName : parsed.email,
      role: parsed.role === "supplier" || parsed.role === "admin" ? parsed.role : "customer",
      locale: parsed.locale === "ar" ? "ar" : "en",
      memberships: Array.isArray(parsed.memberships) ? parsed.memberships : [],
    };
    return { user, mode: backendMode() };
  } catch {
    return null;
  }
}

/** Write the session cookie (httpOnly). */
export async function writeSession(user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Clear the session cookie. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
