/**
 * Client-safe Agent API surface. Exports ONLY types + the pure intent parser —
 * never the service/orchestrator/providers (which are server-only and read
 * secrets). Server code imports `./service` directly.
 */

export * from "./types";
export { parseIntent, parseTargetBudget, resolveCategory, toAsciiDigits } from "./intent";
