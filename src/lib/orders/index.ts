/**
 * Public Orders API surface (Phase 10A). Client-safe: types, totals, snapshot
 * builders, validators, authorization. No server-only or secret-bearing modules.
 */

export * from "./types";
export {
  itemLineTotal,
  computeGroupTotals,
  computeCheckoutTotals,
  recomputeGroups,
} from "./totals";
export {
  buildCartDraft,
  buildQuoteDraft,
  makeOrderNumber,
  type CartLineInput,
} from "./snapshot";
export {
  validateAddress,
  isOmanPhone,
  revalidateCart,
  validateAcceptedQuote,
  type CartRevalidationResult,
  type AcceptedQuoteResult,
} from "./validation";
export {
  canReadOrder,
  canConfirmOrder,
  canManageGroup,
  redactOrderForSupplier,
  type OrderPrincipal,
} from "./authorization";
