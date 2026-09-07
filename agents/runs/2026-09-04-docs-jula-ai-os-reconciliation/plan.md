# Plan — Reconcile `docs/capability-map.md` and `docs/business-os-manifesto.md` with the Jula AI OS role decision

**Cycle:** `agents/runs/2026-09-04-docs-jula-ai-os-reconciliation/`
**Date:** 2026-09-04
**Status:** Finalized against the human's answers to the plan's open questions (recorded in
"Resolved decisions" below). This is decision follow-up **(iii)** from
`notes/decisions/2026-09-01-jula-ai-os-role.md` (Consequences section) and Next Action **#2** from
`agents/runs/2026-09-04-jula-ai-os-system-overview/retro.md` (recurring across the last three
cycles' retros).

**Do may not act on this plan until the user explicitly approves this finalized version.** This
cycle stays planning-only — no code, no doc edits, no commit.

---

## Goal

Bring `docs/capability-map.md` and `docs/business-os-manifesto.md` into agreement with the accepted
decision `notes/decisions/2026-09-01-jula-ai-os-role.md`: Jula AI OS is the Jula-specific instance
of Business OS (the umbrella operating model, not a peer project); AI Command Center is the
dashboard/interface into it (not a project); CRM, WMS, Automation, and Store Care Program are the
applied project areas. Fix the specific places where the two docs still say otherwise, using only
language already established in the decision and the docs. Record the change in a new
`notes/decisions/` entry, as `capability-map.md`'s own amendment rule requires.

---

## Scope

### In scope

- A full inventory of every mention of "Jula AI OS", "Jula", "AI Command Center", "Command
  Center", "Project(s)", "initiative", "deliverable", and "operating model/system" in **both**
  docs, each classified (a) consistent with the decision / (b) contradicts it / (c) ambiguous.
  (Inventory below.)
- The exact before/after wording for the three chosen edits, per file, per line.
- A fully-resolved new `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`
  entry authorizing both doc edits (draft below), required by `capability-map.md:5` ("changes to
  this map should happen through a new entry in `notes/decisions/`") and mandated by
  `2026-09-01-jula-ai-os-role.md` follow-up (iii).
- The Do/Check verification steps.

### Out of scope

- Any application code or UI change (hard constraint).
- Editing `notes/decisions/2026-09-01-jula-ai-os-role.md` or
  `notes/decisions/2026-07-08-ai-organization-design.md` (immutable records).
- Reconciling `agents/README.md:19` (same 5-project misclassification, not immutable, but
  explicitly deferred by the human to a separate follow-up — see Non-Goals and the decision
  entry's "What this does NOT decide").
- Any folder restructuring — `projects/ai-command-center/` stays where it is.
- Inventing any new capability, module, hierarchy layer, audience, or roadmap item.
- The pre-existing CRM/WMS overlap between the "Projects" and "Business Applications" capabilities
  in `capability-map.md` (predates this decision — see inventory row for lines 119–127).
- Any commit.

---

## Resolved decisions (human's answers to the plan's open questions)

| # | Question | Resolution |
|---|---|---|
| 1 | `capability-map.md:49` form | **Option 1B** — remove Jula AI OS + AI Command Center, complete the list with Store Care Program. |
| 2 | `capability-map.md:51` example | **Option 2B** — generalize the example to "a per-project `README.md`". |
| 3 | `business-os-manifesto.md:14` form | **Option 3B** — drop AI Command Center, add "the Store Care Program". |
| 4 | Manifesto "Jula AI OS" naming sentence | **Option 4A — skip.** Manifesto stays generic; the naming link stays recorded only in the decisions and the app's System Overview section. |
| 5 | `capability-map.md` cross-reference housekeeping | **Skip.** |
| 6 | Decision-entry slug | **Confirmed:** `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`. |
| 7 | One decision entry for both doc edits? | **Yes** — a single entry authorizes both. |
| 8 | `agents/README.md:19` | **Not in this cycle.** Left as-is; flagged as a Next Action / separate follow-up in the retro, and recorded as an explicitly-deferred cleanup in the decision entry. |

---

## Contradiction inventory

Sources of truth: `notes/decisions/2026-09-01-jula-ai-os-role.md` (Decision ¶1 and points 1–3),
corroborated by `business-os-manifesto.md:16` and `:33`.

### `docs/capability-map.md`

| Line(s) | What it says (abbreviated) | Class | Note |
|---|---|---|---|
| 1 | "# Business OS — Capability Map (v1)" | (a) | Business OS = the operating model. Consistent. |
| 3 | "read alongside `docs/business-os-manifesto.md` … and `notes/decisions/2026-07-08-ai-organization-design.md`" | (a) | Cross-reference list. Left unchanged (Resolved decision 5). |
| 5 | "changes to this map should happen through a new entry in `notes/decisions/`" | (a) | This is the rule that requires this cycle to create a decision entry. |
| 9–19 | Layer diagram + prose: "Projects / Workflows / Agents / Integrations" (working layer); "Dashboards / Business Applications" (visible layer) | (a) | "Projects" and "Dashboards" here are **capability names**, not the initiative list. No named entities. Consistent — and the Projects≠Dashboards split matches the decision. |
| 29 | "(e.g. \"project\" meaning one thing in Automation and another in CRM)" | (a) | Generic illustration. |
| 31 | "Knowledge, Projects, Workflows, and Agents all inherit their vocabulary" | (a) | Capability name. |
| 47 | "## Projects" | (a) | Capability heading. |
| **49** | **"**Purpose:** The unit of \"a deliverable being built\" — the concrete initiatives the business is actually running: CRM, WMS, Automation, Jula AI OS, AI Command Center."** | **(b) CONTRADICTS** | Lists **Jula AI OS** (the operating model, not a project — decision point 1) and **AI Command Center** (the dashboard, not a project — decision ¶1; manifesto :16/:33) as Projects. Also **(c) incomplete**: omits **Store Care Program**, a real `projects.ts` entry with a page, named in the decision as one of the four applied areas. **Fixed by Edit 1.** |
| 51 | "**What it contains:** The `projects/` folder — one subfolder per initiative, each with its own scoped conventions (e.g. `projects/ai-command-center/README.md`)." | **(c) AMBIGUOUS** | Uses `projects/ai-command-center/README.md` as *the example of a project subfolder*. AI Command Center is the dashboard, not a project — but the folder physically lives at `projects/ai-command-center/` and moving it is out of scope. **Fixed by Edit 2** (generalize the example). |
| 53 | "does this belong to an existing project, or does it need a new one?" | (a) | Generic. |
| 55 | "Workflows and Business Applications are built inside a Project. … Dashboards visualize Projects' state." | (a) | "Dashboards visualize Projects' state" reinforces Dashboard ≠ Project. Consistent. |
| 91 | "(Projects, Workflows, Agents, Integrations)" | (a) | Capability name. |
| 107–115 | "## Dashboards … `projects/ai-command-center` — the Agent System, Projects, Tools, Knowledge Base … sections already built. … AI Command Center currently displays honest placeholders" | (a) | **Correctly** classifies AI Command Center as the Dashboard. This is the framing line 49 is reconciled *to*. No edit. |
| 119–127 | "## Business Applications … CRM, WMS … Future subfolders of `projects/` (e.g. `projects/crm`, `projects/wms`)" | (c) AMBIGUOUS / **pre-existing** | CRM and WMS appear here *and* in the line-49 Projects list. This overlap predates the Jula decision and is not what follow-up (iii) is chartered to fix. **Flag, do not fix.** |
| 133 | "Integrations and Business Applications are entirely aspirational" | (a) | Consistent. |

### `docs/business-os-manifesto.md`

| Line(s) | What it says (abbreviated) | Class | Note |
|---|---|---|---|
| 5 | "Business OS is the operating system for running a company …" | (a) | Canonical definition. |
| 9–13 | "A shared knowledge base … a shared way of turning goals into execution … a shared set of AI agents …" | (a) | No named entities. |
| **14** | **"- A shared **map of capabilities** (see `docs/capability-map.md`) that every future project — CRM, WMS, automation, AI Command Center, and whatever comes after — is built on top of …"** | **(b) CONTRADICTS** | Lists **AI Command Center** among "every future project" — contradicted by the very next sentence (line 16). **Fixed by Edit 3.** |
| 16 | "AI Command Center is the *visible dashboard* into this system. Business OS is the *foundation underneath it* — the operating model, not the screen." | (a) | **Canonical statement.** Line 14 is reconciled *to* this. No edit. |
| 32 | "A CRM or WMS built later under Business OS may do ERP-like things for its own domain …" | (a) | Consistent. |
| 33 | "AI Command Center is one dashboard *into* Business OS, not Business OS itself." | (a) | Canonical. No edit. |
| 35 | "automation is what the **Do** role executes once a plan has been approved" | (a) | Consistent. |
| 68 | "Business OS's execution engine *is* the Plan → Do → Check → Act loop" | (a) | Consistent. |
| 93 | "AI Command Center reflects real state — real Next Actions, real Recent Activity" | (a) | Treats it as the dashboard. Consistent. |
| 100 | "the system now genuinely covers CRM, WMS, and other real domains, not just its own origin story" | (a) | Consistent. |
| whole doc | The name **"Jula AI OS"** (and "Jula") appears **nowhere** | (c) AMBIGUOUS / absence | Not a contradiction — a generic description of Business OS is not wrong. Adding a naming sentence would be enhancement, not reconciliation. **Left as-is** (Resolved decision 4). |

**Net:** two hard contradictions (`capability-map.md:49`, `business-os-manifesto.md:14`), fixed by
Edits 1 and 3; one ambiguous line (`capability-map.md:51`) tidied by Edit 2. Everything else is
already consistent, or pre-existing-and-out-of-scope (`capability-map.md:119–127`).

---

## Proposed edits (exact before / after)

Do must match on the quoted **text**, not the line number — line numbers shift as edits land.

### Edit 1 — `docs/capability-map.md`, line 49

**BEFORE:**

```
**Purpose:** The unit of "a deliverable being built" — the concrete initiatives the business is actually running: CRM, WMS, Automation, Jula AI OS, AI Command Center.
```

**AFTER:**

```
**Purpose:** The unit of "a deliverable being built" — the concrete initiatives the business is actually running: CRM, WMS, Automation, Store Care Program.
```

*Removes Jula AI OS (the operating model, not a project) and AI Command Center (the dashboard, not
a project); completes the list with Store Care Program — the fourth applied project area named in
`2026-09-01-jula-ai-os-role.md` and present in `projects/ai-command-center/src/data/projects.ts`.*

### Edit 2 — `docs/capability-map.md`, line 51

**BEFORE:**

```
**What it contains:** The `projects/` folder — one subfolder per initiative, each with its own scoped conventions (e.g. `projects/ai-command-center/README.md`).
```

**AFTER:**

```
**What it contains:** The `projects/` folder — one subfolder per initiative, each with its own scoped conventions (e.g. a per-project `README.md`).
```

*Generalizes the example so it no longer implies AI Command Center is "a project"; the Dashboards
capability (lines 107–115) already covers where the dashboard app lives.*

### Edit 3 — `docs/business-os-manifesto.md`, line 14

**BEFORE:**

```
- A shared **map of capabilities** (see `docs/capability-map.md`) that every future project — CRM, WMS, automation, AI Command Center, and whatever comes after — is built on top of, instead of each one being its own disconnected island.
```

**AFTER:**

```
- A shared **map of capabilities** (see `docs/capability-map.md`) that every future project — CRM, WMS, automation, the Store Care Program, and whatever comes after — is built on top of, instead of each one being its own disconnected island.
```

*Removes AI Command Center from the "future project" list (it is the dashboard *into* Business OS —
line 16 immediately below); swaps in "the Store Care Program" to keep the list aligned with
Edit 1.*

**No other lines in either file change.**

---

## Required new decision record

`capability-map.md:5` requires map changes to go through a `notes/decisions/` entry, and
`2026-09-01-jula-ai-os-role.md` follow-up (iii) explicitly mandates one. A single entry authorizes
both doc edits (Resolved decision 7). Path:
`notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`.

### Draft (final — Do creates this file verbatim, adjusting only run-folder/commit cross-refs if needed)

```markdown
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
```

---

## Steps (for Do, after approval)

1. Create `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` from the
   final draft above, verbatim (Status: Accepted). Adjust only cross-reference details (run-folder
   path, commit hashes) if any are stale at implementation time.
2. Apply **Edit 1** to `docs/capability-map.md` — match on the "concrete initiatives the business
   is actually running" sentence.
3. Apply **Edit 2** to `docs/capability-map.md` — match on the "one subfolder per initiative"
   sentence.
4. Apply **Edit 3** to `docs/business-os-manifesto.md` — match on the "every future project — CRM,
   WMS, automation" sentence.
5. Re-grep both docs for `Jula AI OS`, `AI Command Center`, `Command Center`, `Project`,
   `initiative`, `deliverable`; confirm no remaining line classifies Jula AI OS or AI Command
   Center as a project, and that every "consistent (a)" line from the inventory is byte-unchanged.
6. `git diff` review: only the three sentences named above changed; the new decision file is the
   only addition. No `src/`, no other `docs/`, no `agents/README.md`, no immutable decision record
   touched.
7. Hand to Check. **No commit.**

## Check gate (for the Do cycle's Check step)

- `capability-map.md:49` matches Edit 1's AFTER text verbatim — no "Jula AI OS", no "AI Command
  Center", includes "Store Care Program".
- `capability-map.md:51` matches Edit 2's AFTER text verbatim — the example is now "a per-project
  `README.md`".
- `business-os-manifesto.md:14` matches Edit 3's AFTER text verbatim — no "AI Command Center",
  includes "the Store Care Program".
- The new `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` exists,
  uses the `YYYY-MM-DD-<slug>.md` name, carries the standard headings, has Status: Accepted, and
  its stated edits match the diff exactly (including decision point 3, since Store Care Program is
  being added).
- Diff touches **only** the three sentences + the new file. No "consistent (a)" line from the
  inventory changed. `agents/README.md` untouched.
- No new capability, module, hierarchy layer, audience, metric, or roadmap item introduced — every
  added word ("Store Care Program", "a per-project `README.md`") traces to
  `2026-09-01-jula-ai-os-role.md` / `projects.ts` / existing doc phrasing.
- The Projects / Business Applications CRM/WMS overlap is untouched (not "helpfully" fixed).

---

## Risks

- **Over-reach.** A "reconciliation" invites rewriting more of `capability-map.md` (a v1 doc that
  "will evolve") than the three named sentences. Mitigation: line-scoped before/after wording, the
  explicit "consistent (a)" list Check verifies unchanged, tight Non-Goals.
- **Partial reconciliation.** After this cycle, `agents/README.md:19` and
  `2026-07-08-ai-organization-design.md:32` still carry the old five-project list. The latter is
  immutable and already annotated by the 2026-09-01 decision; the former is a deliberate deferral,
  tracked in the retro. Someone reading only `agents/README.md` could still be misled until then.
- **"One home for every fact" pressure.** After the edits, AI Command Center's classification is
  asserted in three places (the new decision entry, `manifesto:16`, `capability-map` Dashboards
  section). They agree, but it is three places to keep in sync. Acceptable — the decision entry is
  canonical and the others predate it.
- **Line drift.** Applying Edit 1 shifts every later line number in `capability-map.md`. Do must
  match on text, not line number (Steps say so).
- **"Store Care Program" register in the manifesto.** Line 14 uses "automation" as a lowercase
  general noun; "the Store Care Program" is a proper project name. Minor stylistic seam, accepted
  as the cost of keeping the two docs' lists aligned (Resolved decisions 1 + 3).

---

## Non-Goals

- No application code or UI change of any kind.
- No edit to `notes/decisions/2026-09-01-jula-ai-os-role.md` or
  `notes/decisions/2026-07-08-ai-organization-design.md`.
- No edit to `agents/README.md:19` — the identical misclassification there is explicitly deferred
  to a separate follow-up (retro Next Action + noted in the decision entry).
- No folder restructuring — `projects/ai-command-center/` stays under `projects/`.
- No new capability, module, hierarchy layer, audience note, metric, automation, or roadmap item.
  Reconciliation = deleting/fixing the contradicting phrases with established language only.
- Not fixing the pre-existing CRM/WMS overlap between the Projects and Business Applications
  capabilities in `capability-map.md`.
- No "Jula AI OS" naming sentence added to the manifesto (Resolved decision 4).
- No cross-reference/housekeeping edits to `capability-map.md` lines 3 or 5 (Resolved decision 5).
- Not touching the "consistent (a)" lines catalogued in the inventory.
- Not reconciling the informal "operating system / operating model" taglines in the app UI (Hero
  eyebrow, `NextActions` copy) — those live in `src/`, out of scope.
- No rewrite of `capability-map.md` beyond the sentences named in Edits 1 and 2.
- No commit in this cycle.

---

## Handoff

Every open question is resolved (see "Resolved decisions"). The three edits and the decision-entry
draft are final. What remains is the human's **explicit approval of this finalized plan** before
Do runs. Do then applies the three line-scoped edits and creates the decision entry verbatim.

**Do may not act on this plan until the user explicitly approves it.**
