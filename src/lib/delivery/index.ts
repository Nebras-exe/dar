/**
 * Public Delivery + Installation API surface (Phase 12). Client-safe: types, the
 * delivery + installation status machines, slot rules, the eligibility-gated
 * factory + transitions, the completion rule, the customer tracking timeline,
 * order-level summary, authorization, and the (demo-only) notification + demo
 * assignment. A FIFTH separate domain — the operational continuation ending at
 * `completed`. No real courier / GPS.
 */

export * from "./types";
export {
  canTransitionDelivery,
  transitionDelivery,
  isTerminalDelivery,
  canTransitionInstallation,
  availableDeliveryActions,
  isCompleted,
  type DeliveryAction,
} from "./status-machine";
export {
  SLOT_PERIODS,
  SLOT_HOURS,
  isValidSlot,
  upcomingDays,
} from "./slots";
export {
  groupIsCustom,
  installationRequiredFor,
  canCreateDelivery,
  snapshotAddress,
  buildDelivery,
  scheduleDelivery,
  assignDelivery,
  markOutForDelivery,
  markDelivered,
  markDeliveryFailed,
  requestReschedule,
  cancelDelivery,
  scheduleInstallation,
  startInstallation,
  completeInstallation,
  recordInstallationIssue,
  canComplete,
  confirmHandover,
  buildTracking,
  summarizeDeliveries,
  type DeliveryResult,
  type DeliverySummary,
} from "./delivery";
export {
  canReadDelivery,
  canManageDelivery,
  canCustomerScheduleDelivery,
  canCustomerWriteDeliveryStatus,
  AGENT_CAN_MANAGE_DELIVERY,
  type DeliveryPrincipal,
} from "./authorization";
export {
  deliveryNotifier,
  demoAssignment,
  type DeliveryNotifier,
  type DeliveryNotificationInput,
  type DeliveryNotificationReceipt,
} from "./notifications";
