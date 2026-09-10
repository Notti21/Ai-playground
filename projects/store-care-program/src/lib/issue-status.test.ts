// Unit tests for the canonical Issue/Action state machine.
// Run with:  npm test   (uses node:test + native TS type stripping)
//
// These verify lib/issue-status.ts against notes/workflows/store-visit-issue-closure.md §3.

import test from "node:test";
import assert from "node:assert/strict";

import {
  allowedTransitions,
  checkTransition,
  isActive,
  isTerminal,
  isTransitionAllowed,
  ISSUE_STATUSES,
} from "./issue-status.ts";

test("open can go to in_progress, resolved, cancelled — and nothing else", () => {
  const targets = allowedTransitions("open").map((r) => r.to).sort();
  assert.deepEqual(targets, ["cancelled", "in_progress", "resolved"]);
});

test("open cannot go straight to waiting", () => {
  assert.equal(isTransitionAllowed("open", "waiting"), false);
});

test("in_progress and waiting convert both ways", () => {
  assert.equal(isTransitionAllowed("in_progress", "waiting"), true);
  assert.equal(isTransitionAllowed("waiting", "in_progress"), true);
});

test("in_progress and waiting can each resolve or cancel directly", () => {
  for (const from of ["in_progress", "waiting"] as const) {
    assert.equal(isTransitionAllowed(from, "resolved"), true);
    assert.equal(isTransitionAllowed(from, "cancelled"), true);
  }
});

test("resolved can only be reopened to in_progress", () => {
  const targets = allowedTransitions("resolved").map((r) => r.to);
  assert.deepEqual(targets, ["in_progress"]);
  assert.equal(isTransitionAllowed("resolved", "resolved"), false);
  assert.equal(isTransitionAllowed("resolved", "cancelled"), false);
});

test("cancelled is terminal", () => {
  assert.equal(isTerminal("cancelled"), true);
  assert.equal(allowedTransitions("cancelled").length, 0);
});

test("only cancelled is terminal", () => {
  const terminal = ISSUE_STATUSES.filter(isTerminal);
  assert.deepEqual(terminal, ["cancelled"]);
});

test("active statuses are open, in_progress, waiting", () => {
  assert.deepEqual(ISSUE_STATUSES.filter(isActive), [
    "open",
    "in_progress",
    "waiting",
  ]);
});

test("→ resolved requires a resolution note", () => {
  assert.deepEqual(checkTransition("in_progress", "resolved", "   "), {
    ok: false,
    error: "reason_required",
  });
  assert.deepEqual(checkTransition("in_progress", "resolved", "fixed the shelf"), {
    ok: true,
    reasonKind: "resolution",
    reason: "fixed the shelf",
  });
});

test("→ cancelled requires a cancel reason", () => {
  assert.deepEqual(checkTransition("open", "cancelled", ""), {
    ok: false,
    error: "reason_required",
  });
  assert.equal(checkTransition("open", "cancelled", "duplicate").ok, true);
});

test("reopen requires a reopen reason", () => {
  assert.deepEqual(checkTransition("resolved", "in_progress", ""), {
    ok: false,
    error: "reason_required",
  });
  const ok = checkTransition("resolved", "in_progress", "problem recurred");
  assert.deepEqual(ok, {
    ok: true,
    reasonKind: "reopen",
    reason: "problem recurred",
  });
});

test("transitions with no required text ignore any reason passed", () => {
  assert.deepEqual(checkTransition("open", "in_progress", "whatever"), {
    ok: true,
    reasonKind: null,
    reason: null,
  });
});

test("a disallowed transition is rejected before any reason check", () => {
  assert.deepEqual(checkTransition("cancelled", "open", "x"), {
    ok: false,
    error: "not_allowed",
  });
});
