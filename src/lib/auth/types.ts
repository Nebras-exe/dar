/**
 * Auth domain contracts (Phase 08). Client-safe types describing a session. The
 * actual session read/write is server-only (`./session`) and mutations go through
 * server actions (`./actions`).
 */

import type { BackendMode } from "@/lib/backend/config";
import type { Membership, UserRole } from "./authorization";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  locale: "en" | "ar";
  /** Supplier memberships (authorizes the supplier dashboard). */
  memberships: Membership[];
}

export interface Session {
  user: SessionUser;
  /** Which backend produced this session — "demo" is a labelled local session. */
  mode: BackendMode;
}

export type AuthErrorCode =
  | "invalid-credentials"
  | "email-taken"
  | "invalid-input"
  | "weak-password"
  | "backend-error"
  | "unknown";

export type AuthResult =
  | { ok: true }
  | { ok: false; code: AuthErrorCode };
