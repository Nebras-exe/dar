/**
 * Public Manufacturing API surface (Phase 11B). Client-safe: types, the status
 * machine, the custom-only/ready-gated factory + transition helpers, the QC
 * workflow, the derived customer timeline, order-level summary, authorization,
 * and the (demo-only) notification abstraction. A SEPARATE domain from order,
 * payment, and fulfillment status — the CUSTOM-furniture continuation of Phase
 * 11A fulfillment that ends at `ready_for_delivery`.
 */

export * from "./types";
export {
  canTransition,
  transition,
  isTerminal,
  isReadyForDelivery,
  availableActions,
  actionTargetStatus,
  canEditMilestones,
  type ManufacturingAction,
} from "./status-machine";
export {
  groupNeedsManufacturing,
  canCreateManufacturing,
  buildManufacturingJob,
  startManufacturing,
  completeManufacturing,
  startRework,
  completeRework,
  markReadyForDelivery,
  toggleMilestone,
  openQualityCheck,
  submitForQualityCheck,
  passQualityCheck,
  failQualityCheck,
  buildCustomerTimeline,
  summarizeManufacturing,
  type TransitionResult,
  type ManufacturingSummary,
} from "./manufacturing";
export {
  canReadManufacturing,
  canManageManufacturing,
  canCustomerWriteManufacturing,
  AGENT_CAN_MANAGE_MANUFACTURING,
  type ManufacturingPrincipal,
} from "./authorization";
export {
  manufacturingNotifier,
  type ManufacturingNotifier,
  type ManufacturingNotificationInput,
  type ManufacturingNotificationReceipt,
} from "./notifications";
