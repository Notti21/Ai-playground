# AI Command Center and Jula AI OS Are Not "Projects" in the Capability Map

**Date:** 2026-09-04
**Status:** Accepted
**Cycle:** `agents/runs/2026-09-04-docs-jula-ai-os-reconciliation/`

## Context

`notes/decisions/2026-09-01-jula-ai-os-role.md` (Accepted, committed `5ea9b6b`) established that
Jula AI OS is the Jula-specific instance of Business OS — the umbrella operating model, not a peer
project — and that AI Command Center is the dashboard/interface into it. Its Consequences section
created follow-up **(iii)**: `docs/capability-map.md` and `docs/business-os-manifesto.md` still
contained framings that contradict this, and — per `capability-map.md`'s own rule that changes go
through a new `notes/decisions/` entry — reconciling them needs its own decision.

The specific contradictions (full inventory in the cycle's `plan.md`):

- `docs/capability-map.md:49` listed the "concrete initiatives the business is actually running"
  as "CRM, WMS, Automation, Jula AI OS, AI Command Center" — miscounting the operating model and
  the dashboard as projects, and omitting Store Care Program.
- `docs/capability-map.md:51` used `projects/ai-command-center/README.md` as its example of "a
  project subfolder", reinforcing the same miscount.
- `docs/business-os-manifesto.md:14` listed "AI Command Center" among "every future project …
  built on top of" the capability map — contradicted by the same document's line 16 ("AI Command
  Center is the *visible dashboard* into this system … the operating model, not the screen") and
  line 33.

The UI is already reconciled: the Jula AI OS card was removed from the Projects grid
(`agents/runs/2026-09-03-remove-jula-ai-os-card/`, committed `e71edd4`) and a "System Overview"
homepage section now states the hierarchy (`agents/runs/2026-09-04-jula-ai-os-system-overview/`,
committed `d6d4941`). This decision brings the two `docs/` files into line with that.

## Decision

1. **Jula AI OS is not a Project in the capability map.** It is the operating model itself (the
   Jula-specific instance of Business OS). It is removed from the `capability-map.md:49` Projects
   list. Its place in the map is the operating-model framing the whole document already describes;
   it is not a "concrete initiative" alongside CRM/WMS/Automation.

2. **AI Command Center is not a Project.** It is the Dashboard into the operating model — exactly
   as the Dashboards capability (`capability-map.md:107–115`) and the manifesto (lines 16, 33)
   already state. It is removed from the `capability-map.md:49` Projects list, from the
   `capability-map.md:51` example, and from the `business-os-manifesto.md:14` "future project"
   list. This resolves the "AI Command Center is listed as both a Project and a Dashboard"
   inconsistency that `2026-09-01-jula-ai-os-role.md` deferred to this follow-up.

3. **The Projects list is completed with Store Care Program.** After this decision,
   `capability-map.md:49` and `business-os-manifesto.md:14` name the four applied project areas
   the 2026-09-01 decision enumerates and that exist in
   `projects/ai-command-center/src/data/projects.ts`: CRM, WMS, Automation, Store Care Program.

4. The exact wording changes are specified in
   `agents/runs/2026-09-04-docs-jula-ai-os-reconciliation/plan.md` and were approved by the human
   before implementation. No other lines in either file change.

## Options considered

- **(a) Leave the docs as-is and rely on the UI + the 2026-09-01 decision.** Rejected: violates
  manifesto principle 3 (one home for every fact) — the capability map would still actively
  contradict the decision, and it is the document people are told to "check first".
- **(b) Reword only `capability-map.md` and leave the manifesto.** Rejected: the manifesto's line
  14 is the same contradiction; fixing one and not the other just moves the inconsistency.
- **(c) Rewrite the Projects / Dashboards / Business Applications capabilities to remove all
  overlap** (e.g. the CRM/WMS duplication between Projects and Business Applications). Rejected as
  out of scope — that overlap predates this decision and is not what follow-up (iii) is about; a
  separate cycle can take it up if it proves to matter.
- **(d) Minimal, line-scoped edits to the contradicting lines, plus completing the Projects
  list.** Chosen.

## What this does NOT decide

- The `projects/ai-command-center/` **folder location** — the dashboard app keeps living under
  `projects/` for now; this decision is about classification in the map's prose, not the tree.
- The **CRM/WMS overlap** between the Projects and Business Applications capabilities in
  `capability-map.md` — untouched, pre-existing.
- **`agents/README.md:19`**, which carries the same "Projects (CRM, WMS, Automation, Jula AI OS,
  AI Command Center)" list. Not immutable, but explicitly deferred to a separate cleanup — the
  human ruled it out of this cycle's two-doc scope.
- Whether the manifesto should name "Jula AI OS" explicitly in prose — left as an absence, not a
  contradiction; can be added later if wanted.

## Consequences

- `docs/capability-map.md` (lines 49 and 51) and `docs/business-os-manifesto.md` (line 14) are
  edited in this cycle's Do step, per the wording in `plan.md`. No other lines change.
- Follow-up **(iii)** of `2026-09-01-jula-ai-os-role.md` is closed. That decision's three
  follow-ups (i), (ii), (iii) are now all resolved.
- `notes/decisions/2026-07-08-ai-organization-design.md:32` still lists the old five-project
  framing. It is an **immutable record** and is not edited; `2026-09-01-jula-ai-os-role.md`
  already recorded that this divergence is intentional and that the later ruling governs.
- `agents/README.md:19` remains inconsistent until a separate cleanup — deferred by the human and
  tracked as a Next Action in this cycle's retro so a future cycle picks it up.
