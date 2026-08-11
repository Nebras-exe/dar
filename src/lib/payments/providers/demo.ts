/**
 * Demo Payment Provider (Phase 10B, §11/§12). Deterministic, offline, safe, and
 * clearly labelled. It never asks for or stores card data — the customer simply
 * presses "Pay in Demo Mode" and the provider returns a deterministic outcome
 * (`success` by default, or `failure` when the demo failure path is selected —
 * §12; never random). It carries no secrets and makes no network call.
 *
 * The SAME server-side verification path is used for demo and real providers
 * (§17) — only the provider implementation differs.
 */

import type {
  PaymentIntent,
  PaymentProvider,
  PaymentResult,
  PaymentVerificationResult,
  ProviderIntentInput,
} from "../types";

/** Deterministic safe provider reference from an intent id + outcome. */
function demoRef(intentId: string, outcome: "success" | "failure"): string {
  let h = 0x811c9dc5;
  const s = `${intentId}:${outcome}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `DEMO-${(h >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(-7)}`;
}

/** The intent's chosen demo outcome, remembered via its reference prefix. */
function outcomeFor(intent: PaymentIntent): "success" | "failure" {
  return intent.providerReference?.includes(":FAILURE") ? "failure" : "success";
}

export const demoPaymentProvider: PaymentProvider = {
  id: "demo",
  isConfigured: () => true,

  async createIntent(input: ProviderIntentInput): Promise<PaymentResult> {
    const outcome = input.demoOutcome === "failure" ? "failure" : "success";
    // Encode the chosen outcome in the (safe) reference so verify is deterministic.
    const reference = `${demoRef(input.intentId, outcome)}:${outcome === "failure" ? "FAILURE" : "OK"}`;
    return { status: "pending", providerReference: reference };
  },

  async verify(intent: PaymentIntent): Promise<PaymentVerificationResult> {
    const outcome = outcomeFor(intent);
    if (outcome === "failure") {
      return { verified: false, status: "failed", providerReference: intent.providerReference, failureCode: "declined" };
    }
    return { verified: true, status: "paid", providerReference: intent.providerReference };
  },

  async cancel(intent: PaymentIntent): Promise<PaymentResult> {
    return { status: "cancelled", providerReference: intent.providerReference };
  },

  async getStatus(intent: PaymentIntent): Promise<PaymentResult> {
    return { status: intent.status, providerReference: intent.providerReference };
  },
};
