/**
 * Public API for the AI Designer domain. Import from `@/lib/design` so the
 * engine's internal layout can evolve (e.g. Demo Mode → agent) without touching
 * call sites.
 */

export * from "./types";
export * from "./room-needs";
export * from "./reasons";
export * from "./recommend";
export * from "./demo-service";
