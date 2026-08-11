import { getSession } from "@/lib/auth/session";

/**
 * GET /api/auth/session — booleans only, so the client header can reflect auth
 * state without making every page dynamic (the httpOnly session cookie is never
 * exposed; no email/id/token is ever returned here).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const session = await getSession();
  return new Response(
    JSON.stringify({
      signedIn: Boolean(session),
      isSupplier: (session?.user.memberships.length ?? 0) > 0,
    }),
    { headers: { "content-type": "application/json" }, status: 200 },
  );
}
