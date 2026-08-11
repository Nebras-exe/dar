import { getSession } from "@/lib/auth/session";

/**
 * GET /api/auth/session — auth state for the client header without making pages
 * dynamic. The httpOnly session cookie is never exposed; no email/token is
 * returned. `userId` is the authenticated user's OWN id (Phase 13), returned only
 * to that user over their own authenticated request — needed to scope their own
 * in-app notifications + memory (per-user local stores). Never another user's id.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const session = await getSession();
  return new Response(
    JSON.stringify({
      signedIn: Boolean(session),
      isSupplier: (session?.user.memberships.length ?? 0) > 0,
      userId: session?.user.id ?? null,
    }),
    { headers: { "content-type": "application/json" }, status: 200 },
  );
}
