/**
 * Public Payments API surface (Phase 10B). Client-safe: types, status machine,
 * intent orchestration (server-amount-authority + idempotency), authorization,
 * and payment-copy helpers. The provider network code + real-provider resolution
 * live in `providers/` and are imported only by the server route boundary.
 */

export * from "./types";
export {
  canTransition,
  transition,
  isTerminal,
  isPaid,
  canRetry,
} from "./status-machine";
export {
  buildIntent,
  assertOrderAmount,
  findReusableIntent,
  applyStatus,
  markPending,
} from "./intent";
export {
  canPayOrder,
  canReadIntent,
  supplierPaymentView,
  AGENT_CAN_PAY,
  type PaymentPrincipal,
} from "./authorization";
export { demoPaymentProvider } from "./providers/demo";
