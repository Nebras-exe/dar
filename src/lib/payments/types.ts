/**
 * Athathi Payments — domain contracts (Phase 10B).
 *
 * A payment is created FROM a confirmed order. Payment status is kept SEPARATE
 * from order status (§6): an order is `confirmed` before any payment exists.
 * The payment amount is ALWAYS a server-side snapshot of the authoritative order
 * total — the client never controls it (§8/§15). Athathi never touches raw card
 * data (§3): a real provider uses hosted/tokenized flows; with none configured,
 * a clearly-labelled **Demo Payment** provider runs. Refund states are documented
 * for the future but not implemented (§5).
 *
 * Kept free of server/React imports so the types + status machine + demo provider
 * + validators run on the client and in Node tests. (Real-provider network code
 * is isolated in `providers/` and imported only server-side.)
 */

/** Which provider processed (or will process) the payment. */
export type PaymentProviderId = "demo" | string;

/**
 * Payment lifecycle. Distinct from order status. `requires_action` /
 * `authorized` / `expired` are reserved for real hosted/tokenized flows.
 */
export type PaymentStatus =
  | "not_started"
  | "pending"
  | "requires_action"
  | "authorized"
  | "paid"
  | "failed"
  | "cancelled"
  | "expired";

/** How the customer intends to pay. Demo only in this phase. */
export type PaymentMethod = "demo" | "card" | "wallet" | "bank_transfer";

/**
 * A payment intent — one per order (idempotent by `idempotencyKey = order id`).
 * `amount` is the server-snapshotted order total; the client can never set it.
 */
export interface PaymentIntent {
  id: string;
  orderId: string;
  customerId: string;
  provider: PaymentProviderId;
  /** Safe provider reference (never a secret/token). Null until the provider runs. */
  providerReference: string | null;
  /** OMR, 3-decimal — a snapshot of the order's authoritative grand total. */
  amount: number;
  currency: "OMR";
  status: PaymentStatus;
  method: PaymentMethod;
  /** Guards against duplicate intents/charges (§16). */
  idempotencyKey: string;
  /** Demo payment (no real money) — always labelled in the UI. */
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * One attempt against an intent (a retry creates a new attempt, not a new intent).
 * Stores ONLY safe references — never raw card data / CVV / tokens (§9).
 */
export interface PaymentAttempt {
  id: string;
  intentId: string;
  providerReference: string | null;
  status: PaymentStatus;
  /** Stable, user-safe failure code (never a raw provider message). */
  failureCode: PaymentFailureCode | null;
  createdAt: number;
}

/** Stable, user-safe failure codes (mapped to friendly bilingual copy). */
export type PaymentFailureCode =
  | "declined"
  | "provider-unavailable"
  | "verification-failed"
  | "expired"
  | "cancelled"
  | "unknown";

/** What a provider returns from a create/verify call (normalized, safe). */
export interface PaymentResult {
  status: PaymentStatus;
  providerReference: string | null;
  failureCode?: PaymentFailureCode;
  /** For hosted flows: where to send the user (real providers). */
  redirectUrl?: string;
}

/** The server-side verification outcome (never trusts client `?success=true`). */
export interface PaymentVerificationResult {
  verified: boolean;
  status: PaymentStatus;
  providerReference: string | null;
  failureCode?: PaymentFailureCode;
}

/**
 * The server-only provider abstraction (§10). Checkout/order UI never depends on
 * a provider SDK — it talks to this interface. Real providers isolate their code
 * in `providers/`; the demo provider is deterministic + offline.
 */
export interface PaymentProvider {
  readonly id: PaymentProviderId;
  isConfigured(): boolean;
  /** Begin a payment for an intent's authoritative amount. */
  createIntent(input: ProviderIntentInput, signal?: AbortSignal): Promise<PaymentResult>;
  /** Server-side verify — the ONLY source of truth for "paid" (§17). */
  verify(intent: PaymentIntent, signal?: AbortSignal): Promise<PaymentVerificationResult>;
  /** Cancel a pending intent. */
  cancel(intent: PaymentIntent, signal?: AbortSignal): Promise<PaymentResult>;
  /** Read the provider-side status. */
  getStatus(intent: PaymentIntent, signal?: AbortSignal): Promise<PaymentResult>;
}

/** Minimal, safe input a provider needs (no secrets, no card data). */
export interface ProviderIntentInput {
  intentId: string;
  orderId: string;
  /** Authoritative amount (OMR) — server-derived, never client-supplied. */
  amount: number;
  currency: "OMR";
  /**
   * Deterministic demo outcome selector (§12). Only the DemoPaymentProvider reads
   * it; real providers ignore it. "success" | "failure".
   */
  demoOutcome?: "success" | "failure";
}

/** Stable, user-safe error codes for payment operations. */
export type PaymentErrorCode =
  | "no-order"
  | "not-owner"
  | "already-paid"
  | "already-pending"
  | "amount-mismatch"
  | "invalid-transition"
  | "provider-unavailable"
  | "verification-failed"
  | "expired"
  | "unauthorized"
  | "unknown";

/** A payment confirmation (receipt-like — NOT a tax invoice, §26). */
export interface PaymentConfirmation {
  orderNumber: string;
  amount: number;
  currency: "OMR";
  status: PaymentStatus;
  method: PaymentMethod;
  provider: PaymentProviderId;
  providerReference: string | null;
  isDemo: boolean;
  paidAt: number;
}
