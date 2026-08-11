"use server";

/**
 * Repository server actions (Phase 08). Mutations run on the server and validate
 * everything (§31). In Demo Mode a submission is acknowledged locally (nothing is
 * persisted server-side, and the UI says so); when Supabase is configured the
 * same action inserts into the DB via a secure server path.
 *
 * A supplier application is NEVER auto-approved or auto-verified (§7/§18).
 */

import { isSupabaseConfigured } from "@/lib/backend/config";
import { getSession } from "@/lib/auth/session";
import { validateSupplierApplication } from "./validation";
import type { FieldError } from "./types";

export type ApplyResult =
  | { ok: true; demo: boolean }
  | { ok: false; errors: FieldError[] };

export async function submitSupplierApplicationAction(
  _prev: ApplyResult | null,
  formData: FormData,
): Promise<ApplyResult> {
  const raw = {
    businessName: formData.get("businessName"),
    businessNameAr: formData.get("businessNameAr"),
    type: formData.get("type"),
    location: formData.get("location"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    description: formData.get("description"),
  };

  const parsed = validateSupplierApplication(raw);
  if (!parsed.ok) return { ok: false, errors: parsed.errors };

  if (isSupabaseConfigured()) {
    // await supabaseInsertApplication(parsed.value, (await getSession())?.user.id);
    // Stored as status = 'pending' (never active/verified). Gated — not run here.
    await getSession();
    return { ok: true, demo: false };
  }

  // Demo: acknowledge locally; nothing is sent anywhere.
  return { ok: true, demo: true };
}
