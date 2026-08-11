"use server";

/**
 * Auth server actions (Phase 08). All mutations run on the server; the session
 * cookie is httpOnly and set here. In DEMO mode a clearly-labelled local session
 * is created (no server account store — accounts live only in this browser's
 * cookie); in Supabase mode the same actions call GoTrue via server-side REST.
 *
 * The service-role key is never touched here; only the public anon key is used
 * for the (gated) GoTrue calls.
 */

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/backend/config";
import { goTrueSignIn, goTrueSignUp } from "./gotrue";
import { clearSession, writeSession } from "./session";
import { getSession } from "./session";
import type { AuthErrorCode, AuthResult, SessionUser } from "./types";
import { isEmail } from "@/lib/repository/validation";

const DEMO_SUPPLIER_ID = "demo-athathi-supplier";

/** Deterministic demo user id from an email (so re-login restores ownership). */
function demoUserId(email: string): string {
  let h = 0x811c9dc5;
  const e = email.toLowerCase();
  for (let i = 0; i < e.length; i++) {
    h ^= e.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `demo-user-${(h >>> 0).toString(16).padStart(8, "0")}`;
}

function readForm(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const locale = formData.get("locale") === "ar" ? "ar" : "en";
  return { email, password, displayName, locale: locale as "en" | "ar" };
}

export async function signUpAction(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const { email, password, displayName, locale } = readForm(formData);
  if (!isEmail(email) || !displayName) return { ok: false, code: "invalid-input" };
  if (password.length < 8) return { ok: false, code: "weak-password" };

  if (isSupabaseConfigured()) {
    try {
      const s = await goTrueSignUp(email, password, displayName);
      await writeSession(toSessionUser(s.user.id, email, displayName, locale));
    } catch (err) {
      return { ok: false, code: classify(err) };
    }
  } else {
    // Demo: create a labelled local session (this browser only).
    await writeSession(toSessionUser(demoUserId(email), email, displayName, locale));
  }
  return { ok: true };
}

export async function signInAction(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const { email, password, displayName, locale } = readForm(formData);
  if (!isEmail(email)) return { ok: false, code: "invalid-input" };

  if (isSupabaseConfigured()) {
    if (password.length < 1) return { ok: false, code: "invalid-credentials" };
    try {
      const s = await goTrueSignIn(email, password);
      const name = (s.user.user_metadata?.display_name as string) || displayName || email;
      await writeSession(toSessionUser(s.user.id, email, name, locale));
    } catch (err) {
      return { ok: false, code: classify(err) };
    }
  } else {
    // Demo: restore a labelled local session for this email.
    await writeSession(toSessionUser(demoUserId(email), email, displayName || email.split("@")[0], locale));
  }
  return { ok: true };
}

export async function signOutAction(locale: "en" | "ar"): Promise<void> {
  await clearSession();
  redirect(`/${locale}`);
}

/**
 * DEMO-ONLY convenience: grant the signed-in demo user ownership of the demo
 * supplier so the dashboard can be explored. Never runs against a real backend
 * (real supplier membership requires an approved application + admin action).
 */
export async function enterDemoSupplierAction(locale: "en" | "ar"): Promise<void> {
  if (isSupabaseConfigured()) redirect(`/${locale}/suppliers/apply`);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);
  const user = session!.user;
  const hasMembership = user.memberships.some((m) => m.supplierId === DEMO_SUPPLIER_ID);
  await writeSession({
    ...user,
    role: "supplier",
    memberships: hasMembership
      ? user.memberships
      : [...user.memberships, { supplierId: DEMO_SUPPLIER_ID, role: "owner" }],
  });
  redirect(`/${locale}/supplier`);
}

function toSessionUser(
  id: string,
  email: string,
  displayName: string,
  locale: "en" | "ar",
): SessionUser {
  return { id, email, displayName, role: "customer", locale, memberships: [] };
}

function classify(err: unknown): AuthErrorCode {
  if (err instanceof Error && /http 400|http 401|http 422/.test(err.message)) {
    return "invalid-credentials";
  }
  return "backend-error";
}
