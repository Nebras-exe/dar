/**
 * Public User Memory / Personalization API surface (Phase 13). Client-safe:
 * types, the opt-in operations (consent-gated writes; suggested ≠ durable), the
 * safe Agent/design context builder, validation, and authorization. Memory is
 * explicit, transparent, editable and removable; it stores only product/design
 * context — never payment data, secrets, or raw AI reasoning.
 */

export * from "./types";
export {
  emptyProfile,
  rememberPreference,
  forgetPreference,
  rememberBudget,
  forgetBudget,
  rememberRoom,
  forgetRoom,
  setConsentEnabled,
  setUseInDesign,
  clearAllMemory,
  buildMemoryContext,
  hasUsableMemory,
} from "./memory";
export {
  isValidMemoryValue,
  isMemoryCategory,
} from "./validation";
export {
  canReadMemory,
  canWriteMemory,
  AGENT_CAN_WRITE_MEMORY,
  type MemoryPrincipal,
} from "./authorization";
