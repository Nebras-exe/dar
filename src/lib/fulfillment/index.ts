/**
 * Public Fulfillment API surface (Phase 11A). Client-safe: types, the status
 * machine, the paid-gated factory + transition helpers, the derived customer
 * timeline, order-level summary, authorization, and the (demo-only) notification
 * abstraction. Fulfillment is a SEPARATE domain from order status and payment
 * status — a paid order hands off per supplier group, each with its own lifecycle.
 */

export * from "./types";
export {
  canTransition,
  transition,
  isTerminal,
  isReadyForNextStage,
  availableSupplierActions,
  actionTargetStatus,
  type SupplierAction,
} from "./status-machine";
export {
  canCreateFulfillment,
  isDeclineReason,
  buildFulfillment,
  applyTransition,
  acceptFulfillment,
  declineFulfillment,
  startPreparing,
  markReady,
  cancelFulfillment,
  buildTimeline,
  summarizeFulfillment,
  type TransitionResult,
  type FulfillmentSummary,
} from "./fulfillment";
export {
  canReadFulfillment,
  canManageFulfillment,
  canCustomerWriteFulfillment,
  AGENT_CAN_MANAGE_FULFILLMENT,
  type FulfillmentPrincipal,
} from "./authorization";
export {
  demoNotifier,
  type FulfillmentNotifier,
  type NotificationInput,
  type NotificationReceipt,
  type NotificationAudience,
} from "./notifications";
