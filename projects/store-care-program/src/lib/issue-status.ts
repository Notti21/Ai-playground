// The canonical Issue/Action state machine.
//
// Source of truth: notes/workflows/store-visit-issue-closure.md §3
// (Transitions — locked 2026-09-08) and the approved plan
// (agents/runs/2026-09-10-store-care-program-scaffold-slice/plan.md, Deliverable 6).
//
// This module is pure and has no dependencies on the database or the framework, so
// it can be unit-tested directly (see issue-status.test.ts). It is the single place
// that defines which transitions are allowed and which require text; the server
// action, the UI, and the issue_event CHECK constraint all follow it.

import type { IssueStatus, IssueEventReasonKind } from "@/types/domain";

export const ISSUE_STATUSES: readonly IssueStatus[] = [
  "open",
  "in_progress",
  "waiting",
  "resolved",
  "cancelled",
] as const;

// Statuses that count as "active" for the management view and the overdue rule.
export const ACTIVE_STATUSES: readonly IssueStatus[] = [
  "open",
  "in_progress",
  "waiting",
] as const;

export interface TransitionRule {
  to: IssueStatus;
  // The reason kind that MUST accompany this transition, or null if no text is required.
  requiredReason: IssueEventReasonKind | null;
}

// Allowed transitions keyed by the current status.
//   open          -> in_progress | resolved | cancelled
//   in_progress   -> waiting | resolved | cancelled
//   waiting       -> in_progress | resolved | cancelled
//   resolved      -> in_progress (reopen only)
//   cancelled     -> (terminal)
const TRANSITIONS: Record<IssueStatus, readonly TransitionRule[]> = {
  open: [
    { to: "in_progress", requiredReason: null },
    { to: "resolved", requiredReason: "resolution" },
    { to: "cancelled", requiredReason: "cancellation" },
  ],
  in_progress: [
    { to: "waiting", requiredReason: null },
    { to: "resolved", requiredReason: "resolution" },
    { to: "cancelled", requiredReason: "cancellation" },
  ],
  waiting: [
    { to: "in_progress", requiredReason: null },
    { to: "resolved", requiredReason: "resolution" },
    { to: "cancelled", requiredReason: "cancellation" },
  ],
  resolved: [{ to: "in_progress", requiredReason: "reopen" }],
  cancelled: [],
};

export function allowedTransitions(from: IssueStatus): readonly TransitionRule[] {
  return TRANSITIONS[from] ?? [];
}

export function findTransition(
  from: IssueStatus,
  to: IssueStatus,
): TransitionRule | undefined {
  return allowedTransitions(from).find((rule) => rule.to === to);
}

export function isTransitionAllowed(from: IssueStatus, to: IssueStatus): boolean {
  return findTransition(from, to) !== undefined;
}

export function isTerminal(status: IssueStatus): boolean {
  return allowedTransitions(status).length === 0;
}

export function isActive(status: IssueStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

// Validate a requested transition together with the reason text supplied by the
// user. Returns either a normalised { reasonKind, reason } to persist, or an error
// code the caller maps to a Thai message.
export type TransitionCheck =
  | { ok: true; reasonKind: IssueEventReasonKind | null; reason: string | null }
  | { ok: false; error: "not_allowed" | "reason_required" };

export function checkTransition(
  from: IssueStatus,
  to: IssueStatus,
  rawReason: string | null | undefined,
): TransitionCheck {
  const rule = findTransition(from, to);
  if (!rule) return { ok: false, error: "not_allowed" };

  if (rule.requiredReason === null) {
    return { ok: true, reasonKind: null, reason: null };
  }

  const reason = (rawReason ?? "").trim();
  if (reason.length === 0) return { ok: false, error: "reason_required" };

  return { ok: true, reasonKind: rule.requiredReason, reason };
}
