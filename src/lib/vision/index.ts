/**
 * Public, client-safe vision API surface. Only exports types, the validator,
 * and the pure mapping — NEVER the service or providers (which are server-only
 * and would leak secrets into the client bundle). Server code imports the
 * service directly from `./service`.
 */

export * from "./types";
export { parseRoomAnalysis, PROMPT_VERSION, mapColor, mapMaterial, mapCategory, supported } from "./schema";
export * from "./mapping";
