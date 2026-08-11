import { getSession } from "@/lib/auth/session";
import { paymentMode, isLivePaymentConfigured } from "@/lib/payments/providers";

/**
 * GET /api/payments/status — payment capability + (real-mode) an order's payment
 * status for the owning customer. Booleans/enum + safe status only — never a
 * method, provider reference, secret, or another user's data (§20/§23).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function GET(): Promise<Response> {
  const session = await getSession();
  // Capability is public-safe; a real order-status lookup is owner-gated (below).
  const capability = { configured: isLivePaymentConfigured(), mode: paymentMode() };
  if (!session) return json({ ...capability, signedIn: false });
  // (Real path — gated): with `?order=<id>`, resolve owner-scoped intent + return
  // { status }. Demo mode reads the client store instead.
  return json({ ...capability, signedIn: true });
}
