/**
 * Public, client-safe visualization API surface. Exports ONLY types, the pure
 * fingerprint, the request builder/mapping, and the request validator — NEVER
 * the service, providers, or the prompt (which are server-only and would leak
 * secrets / the system prompt into a client bundle). Server code imports
 * `./service` directly.
 */

export * from "./types";
export {
  designFingerprint,
  canonicalDesignString,
  isPreviewStale,
  type FingerprintInput,
  type FingerprintItem,
} from "./fingerprint";
export {
  parseVisualizationRequest,
  resolveItem,
  isDesignRoomType,
  DESIGN_ROOM_TYPES,
} from "./schema";
export {
  designItemsToRefs,
  currentDesignFingerprint,
  buildVisualizationRequest,
} from "./mapping";
export {
  planRoomLayout,
  resolveRoomSpace,
  isFlatCategory,
  isMountedCategory,
  DEFAULT_CEILING_M,
} from "./layout";
export {
  createCamera,
  projectFloorPoint,
  projectUpright,
  projectFloorRect,
  projectPlan,
  quadToPercent,
  DEFAULT_CAMERA,
  type Camera,
  type ProjectedBox,
  type ProjectedPiece,
  type ProjectedPlan,
  type ProjectedPoint,
  type ProjectedQuad,
} from "./projection";
export { buildDemoScheme } from "./providers/demo";
