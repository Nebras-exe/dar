/**
 * Supabase GoTrue auth via server-side REST (Phase 08) — NO SDK dependency,
 * matching the project's established provider pattern (vision/agent call vendor
 * REST via `fetch`). SERVER-ONLY. Gated behind `isSupabaseConfigured()`; in this
 * environment no project is configured, so these functions are never called and
 * the demo session path runs instead.
 *
 * Keys: only the PUBLIC anon key is used here (client-safe by design). The
 * service-role key is never read in this file.
 */

import { supabaseAnonKey, supabaseUrl } from "@/lib/backend/config";

interface GoTrueUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

interface GoTrueSession {
  access_token: string;
  refresh_token: string;
  user: GoTrueUser;
}

function authBase(): string {
  return `${supabaseUrl()}/auth/v1`;
}

function headers(): Record<string, string> {
  return {
    "content-type": "application/json",
    apikey: supabaseAnonKey() ?? "",
  };
}

/** Sign up with email/password. Throws `http <status>` on failure. */
export async function goTrueSignUp(
  email: string,
  password: string,
  displayName: string,
  signal?: AbortSignal,
): Promise<GoTrueSession> {
  const res = await fetch(`${authBase()}/signup`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password, data: { display_name: displayName } }),
    signal,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return (await res.json()) as GoTrueSession;
}

/** Sign in with email/password (password grant). Throws `http <status>`. */
export async function goTrueSignIn(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<GoTrueSession> {
  const res = await fetch(`${authBase()}/token?grant_type=password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
    signal,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return (await res.json()) as GoTrueSession;
}

/** Resolve the user for an access token. Throws `http <status>`. */
export async function goTrueGetUser(accessToken: string, signal?: AbortSignal): Promise<GoTrueUser> {
  const res = await fetch(`${authBase()}/user`, {
    headers: { ...headers(), authorization: `Bearer ${accessToken}` },
    signal,
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return (await res.json()) as GoTrueUser;
}
