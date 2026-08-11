/**
 * Backend mode detection (Phase 08). Client-safe — reads only the PUBLIC env
 * vars (URL + anon key). The service-role key is never read here (see
 * `./service`, server-only).
 *
 * Athathi runs in one of two modes:
 *  - "supabase": a Supabase project is configured → the repository queries the DB.
 *  - "demo":     no backend configured → the repository serves the Phase 03 demo
 *                catalog + local/demo fallbacks. This is the default and keeps the
 *                whole app usable with zero credentials.
 */

export type BackendMode = "supabase" | "demo";

export function supabaseUrl(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return v ? v : undefined;
}

export function supabaseAnonKey(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return v ? v : undefined;
}

/** True only when BOTH the URL and the anon key are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function backendMode(): BackendMode {
  return isSupabaseConfigured() ? "supabase" : "demo";
}
