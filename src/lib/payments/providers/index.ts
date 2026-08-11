/**
 * Payment provider resolution (Phase 10B, §4/§10). SERVER-ORIENTED: real
 * providers would read `process.env` credentials and are imported only by the
 * server route boundary. The `REAL_PROVIDERS` registry is intentionally EMPTY —
 * no certified gateway is configured in this environment, so Athathi does NOT
 * pretend live payment works: it resolves the deterministic Demo Payment
 * provider. Registering a real provider = one file implementing `PaymentProvider`
 * (hosted/tokenized — never raw card data) added here; nothing else changes.
 */

import type { PaymentProvider } from "../types";
import { demoPaymentProvider } from "./demo";

/** Real gateways, in resolution order. EMPTY until a certified provider is added. */
const REAL_PROVIDERS: Record<string, PaymentProvider> = {};

/** The active REAL provider, or null when none is configured. */
export function resolveRealProvider(): PaymentProvider | null {
  const explicit = process.env.ATHATHI_PAYMENT_PROVIDER?.toLowerCase().trim();
  if (explicit && REAL_PROVIDERS[explicit]) {
    return REAL_PROVIDERS[explicit].isConfigured() ? REAL_PROVIDERS[explicit] : null;
  }
  for (const p of Object.values(REAL_PROVIDERS)) {
    if (p.isConfigured()) return p;
  }
  return null;
}

/** The provider to use: a configured real gateway, else the Demo provider. */
export function resolveProvider(): PaymentProvider {
  return resolveRealProvider() ?? demoPaymentProvider;
}

/** True when a real (non-demo) payment gateway is configured. */
export function isLivePaymentConfigured(): boolean {
  return resolveRealProvider() !== null;
}

/** Reported to the client (booleans/enum only, never a credential). */
export function paymentMode(): "live" | "demo" {
  return isLivePaymentConfigured() ? "live" : "demo";
}

export { demoPaymentProvider };
