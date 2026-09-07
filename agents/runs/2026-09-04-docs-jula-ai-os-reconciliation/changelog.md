# Change Log — Reconcile capability-map & manifesto with the Jula AI OS role decision

**Cycle:** `agents/runs/2026-09-04-docs-jula-ai-os-reconciliation/`
**Date:** 2026-09-04
**Plan:** `plan.md` — finalized with the human's 8 resolved decisions; approved 2026-09-04
("approved, proceed to Do").
**Status:** Implemented, not committed.

This is decision follow-up **(iii)** from `notes/decisions/2026-09-01-jula-ai-os-role.md`.

## Changes made

### 1. Added `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`

New decision record, Status: Accepted, created verbatim from the finalized draft in `plan.md`.
Required by `capability-map.md:5` (map changes go through a `notes/decisions/` entry) and mandated
by the 2026-09-01 decision's follow-up (iii). Three decision points: Jula AI OS is not a Project
(it is the operating model); AI Command Center is not a Project (it is the Dashboard); the Projects
list is completed with Store Care Program. Records the deferred `agents/README.md:19` cleanup and
the untouched immutable `2026-07-08-ai-organization-design.md:32` under "What this does NOT decide"
/ "Consequences".

### 2. Edited `docs/capability-map.md` — two sentences

- **Line 49 (Projects "Purpose"):**
  - before: `…the concrete initiatives the business is actually running: CRM, WMS, Automation, Jula AI OS, AI Command Center.`
  - after: `…the concrete initiatives the business is actually running: CRM, WMS, Automation, Store Care Program.`
  - Removes Jula AI OS and AI Command Center; completes the list with Store Care Program (named in
    the 2026-09-01 decision, present in `projects/ai-command-center/src/data/projects.ts`).
- **Line 51 (Projects "What it contains"):**
  - before: `…each with its own scoped conventions (e.g. `projects/ai-command-center/README.md`).`
  - after: `…each with its own scoped conventions (e.g. a per-project `README.md`).`
  - Generalizes the example so it no longer implies AI Command Center is a project.

### 3. Edited `docs/business-os-manifesto.md` — one sentence

- **Line 14 (the "map of capabilities" bullet):**
  - before: `…every future project — CRM, WMS, automation, AI Command Center, and whatever comes after — is built on top of…`
  - after: `…every future project — CRM, WMS, automation, the Store Care Program, and whatever comes after — is built on top of…`
  - Removes AI Command Center (the dashboard *into* Business OS — line 16 immediately below);
    swaps in "the Store Care Program" to keep the list aligned with the capability-map edit.

## Not changed (per plan / scope)

- No application code or UI (`src/` untouched).
- `agents/README.md:19` — identical misclassification, explicitly deferred by the human to a
  separate follow-up. Left as-is; flagged in the retro.
- `notes/decisions/2026-09-01-jula-ai-os-role.md` and
  `notes/decisions/2026-07-08-ai-organization-design.md` — immutable, untouched.
- The pre-existing CRM/WMS overlap between the Projects and Business Applications capabilities in
  `capability-map.md` — not touched.
- No "Jula AI OS" naming sentence added to the manifesto (Resolved decision 4).
- No cross-reference/housekeeping edits to `capability-map.md` lines 3/5 (Resolved decision 5).
- All "consistent (a)" lines from the plan's inventory — byte-unchanged.

## Verification

- **`grep -n "Jula AI OS\|AI Command Center\|Command Center" docs/capability-map.md`** — one hit
  (line 115, the Dashboards capability, correctly classifying AI Command Center as the dashboard).
  "Jula AI OS" no longer appears in the file.
- **`grep -n "Jula AI OS\|AI Command Center\|Command Center" docs/business-os-manifesto.md`** —
  three hits (lines 16, 33, 93), all the pre-existing (a)-consistent "dashboard into Business OS"
  framing. "Jula AI OS" does not appear (it never did).
- **`git diff docs/`** — exactly three changed lines (2 in `capability-map.md`, 1 in
  `business-os-manifesto.md`), each matching the plan's AFTER text verbatim. No other lines
  touched.
- **`git status --short`** — two modified docs, plus the new decision file and the run folder as
  untracked. No `src/`, no `agents/README.md`, no immutable decision record.
- No new capability, module, hierarchy layer, audience, metric, or roadmap item introduced — the
  only added words ("Store Care Program", "the Store Care Program", "a per-project `README.md`")
  trace to the 2026-09-01 decision / `projects.ts` / existing doc phrasing.

## git status --short

```
 M docs/business-os-manifesto.md
 M docs/capability-map.md
?? agents/runs/2026-09-04-docs-jula-ai-os-reconciliation/
?? notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md
```

## Not done (per plan / human instruction)

- No commit, no push.
- No `agents/README.md` edit (deferred follow-up).
