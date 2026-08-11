/**
 * Public RFQ / custom-furniture API surface (Phase 09). Client-safe: types,
 * validators, deterministic extraction/matching/quote logic. No server-only or
 * secret-bearing modules are exported here.
 */

export * from "./types";
export * from "./spec-fields";
export {
  validateSpec,
  validateQuoteInput,
  hasUsefulDetail,
  type QuoteInput,
  MAX_PRICE_OMR,
  MAX_DIM_CM,
  MAX_QTY,
} from "./validation";
export { extractSpecFromText, type ExtractedSpec } from "./extract";
export {
  matchSupplier,
  matchSuppliers,
  buildRecipients,
  type SupplierMatch,
} from "./matching";
export {
  quoteTotal,
  budgetPosition,
  sortQuotes,
  recommendQuote,
  requestBudget,
} from "./quote-calc";
export { demoQuoteFor, generateDemoQuotes } from "./demo-quotes";
export {
  canReadRequest,
  canQuoteRequest,
  canAcceptQuote,
  isAcceptedLocked,
  type RFQPrincipal,
  type RequestRef,
} from "./authorization";
