# Plan — Store Care Program: Product / MVP Definition + Phased Implementation Plan

> **Phase 2 of 2 — completed definition and plan, awaiting human approval.**
>
> Phase 1 (discovery) produced a repo inventory and a question list; the human has now
> answered. This document's main body is the **Product / MVP Definition** and a **phased
> implementation plan** whose first build phase is a minimal vertical slice. The Phase 1
> discovery material is preserved as an Appendix.
>
> **Nothing here is implemented. No commit. A Do cycle for implementation is a separate,
> later cycle** that may not start until the human approves both (1) this MVP definition and
> (2) the Phase 0 tech-stack decision.

## Goal

Define Store Care Program as a real product/MVP — the first business application built
seriously under Business OS — and lay out a phased plan to build it, starting from the
smallest usable vertical slice. Store Care Program is one of the four "applied project areas"
(`notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`); this cycle
turns its idea-stage placeholder into a buildable definition without inventing scope.

## Anti-Fabrication discipline (unchanged from Phase 1)

Every line in the definition below is tagged **[CONFIRMED]** (traces to a human answer in this
cycle or a quoted repo source) or **[OPEN]** (the human explicitly deferred it). No **[OPEN]**
item is turned into an assumption. Checklists, issue categories, exact form fields, store
counts, staffing model, and the numeric success metric are all **[OPEN]** and must not be
invented — see Part 2. Source key: "Q#" = the human's answer to that Phase 1 question (recorded
in this cycle's coordinator message and summarized in Appendix D).

---

# PART 1 — PRODUCT / MVP DEFINITION

## 1.1 Problem statement — [CONFIRMED: Q2]

Store follow-up today is fragmented. Issues are discovered during store visits or follow-ups,
but ownership is unclear; follow-up actions often lack a clear due date; store information is
passed via chat or verbally; and management cannot easily see what is open, overdue, or
resolved. As a result, important store-level issues get dropped or are followed up
inconsistently.

**v1 is worth using if** it makes every important store issue visible, assigned, followed up,
and closed systematically.

## 1.2 Primary user — [CONFIRMED intent: Q1] / [OPEN: exact job title]

- **[CONFIRMED]** The single primary user is the Jula's Herb person responsible for visiting
  and following up with stores and for making sure store-level issues get resolved.
- **[CONFIRMED]** The MVP is **mobile-first** — most use happens while visiting or following
  up a store — but must also work from a laptop at HQ (responsive web).
- **[CONFIRMED]** Offline mode is **not** required for v1, unless it is later confirmed that
  visits regularly happen with unusable connectivity.
- **[OPEN]** The exact job title of this primary user. The human will confirm it. It is not
  assumed anywhere in this plan. (Part 2, tag **c**.)

## 1.3 The one core workflow — the v1 spine — [CONFIRMED shape: Q3]

The v1 backbone is **"store visit / follow-up → issue/action tracking → closure"** — **not**
all six intent areas from the placeholder description treated as equal modules.

Confirmed step shape (exact fields per step are **[OPEN]** — Part 2, tag **b**):

1. User selects a store.
2. User records a visit / follow-up.
3. User records important findings.
4. A finding that needs action becomes an issue / action.
5. The issue has an owner and a due date.
6. The responsible person follows up.
7. The issue is marked resolved / closed with an outcome.
8. Management can see open / overdue / resolved issues by store.

**[OPEN]** A real worked example and the exact field-level workflow — the human will supply
these. The checklist and issue categories must not be invented. (Part 2, tag **b**.)

## 1.4 MVP scope boundary

### In scope for v1 — [CONFIRMED: Q3, Q5, Q6, Q7]

- The 8-step spine in 1.3, for **one operational user role**.
- Persisting three kinds of record: Store, Visit/Follow-up, Issue/Action (see 1.5).
- The two priority outputs in 1.6.
- A minimal two-role model (see 1.7).
- Mobile-friendly responsive web (see 1.2, Q11).

### Explicitly OUT of scope for v1 — [CONFIRMED: Q8, Q9, Q10, Q11]

- CRM / customer / member management (owned by the CRM project area — Q9).
- WMS / inventory / stock-movement / stock-accuracy management (owned by the WMS area — Q9).
- Sales forecasting.
- Full merchandising management.
- Retailer / ERP integration.
- Automated messaging or automated workflows (Automation area may add these later — Q9).
- Advanced analytics / dashboards beyond the open/overdue/resolved list.
- Complex or granular permission structures.
- A store-staff-facing portal or app (store-level logins are not confirmed — Q7).
- AI-generated recommendations.
- Replacing or migrating the existing chat / spreadsheet processes — v1 sits **alongside**
  them to prove the workflow is useful first (Q10).

## 1.5 Domain-level data sketch — [CONFIRMED starting shape: Q5]

Entities and relationships only. **Not a schema. No fields beyond those the human confirmed.**
Additional fields are **[OPEN]** and added only when confirmed needed (Part 2, tag **b/c**).

- **Store** — store ID / name; channel / account; location; contact / person responsible (if
  available).
- **Visit / Follow-up** — belongs to one Store; date; person performing; notes / findings.
- **Issue / Action** — arises from a Visit/Follow-up finding (or is created directly against a
  Store); description; owner; due date; status; resolution / outcome.

Relationships: a Store has many Visits/Follow-ups; a Visit/Follow-up has zero or more
Issues/Actions; an Issue/Action is always tied to a Store (directly or via its Visit).

**[OPEN]** Whether an Issue/Action can exist without a parent Visit/Follow-up (e.g. logged
straight from a phone call). Assume the simplest interpretation only after the human confirms.
**[OPEN]** The permitted `status` values for Issue/Action (e.g. open / in progress / resolved)
— the human has confirmed the concept of status and the terms "open / overdue / resolved" for
the management view, but not the full lifecycle list. "Overdue" is derived (due date past +
not resolved), not a stored status.

## 1.6 Required outputs / actions — [CONFIRMED: Q6]

The two most important for v1, in priority order:

1. **An Issue/Action assigned to a named owner, with a due date and a status.** This is the
   primary output — v1 exists to drive actions to closure.
2. **A management view showing what is open, overdue, and resolved, by store.**

A saved visit report is **[CONFIRMED]** useful but **secondary** — it is a byproduct of
step 2–3 data, not a v1 priority surface.

## 1.7 Minimum role model — [CONFIRMED: Q7]

Two roles, kept deliberately minimal — no complex permission system:

- **Operational user** — creates visits, findings, and issues; updates follow-up; marks
  issues resolved.
- **Management / admin** — sees all stores and all open issues (the 1.6 #2 view).

**[OPEN / OUT for v1]** Store-level users with their own logins — not confirmed, stays out of
v1 until required (Q7).

## 1.8 Success criteria

- **[CONFIRMED qualitative: Q8]** The MVP works if, after the pilot, store issues/actions are
  consistently captured with a clear owner, a due date, and a visible status, and there is
  evidence that open items are followed through to closure.
- **[OPEN] Numeric success metric** — deliberately not set. The human's instruction: ask for
  current volume / baseline first; do not invent a percentage. (Part 2, tag **c**.)

## 1.9 Boundaries with other project areas — [CONFIRMED: Q9]

- **Store Care Program owns** the operational store follow-up workflow.
- **CRM owns** customer / member relationships.
- **WMS owns** inventory / stock movement and stock accuracy.
- **Automation** may automate Store Care workflows later.
- Store Care Program may *reference* data from these areas later, but **v1 does not replace
  or integrate with them**.

---

# PART 2 — REMAINING QUESTIONS THAT GENUINELY BLOCK PROGRESS

Each is tagged by *what* it blocks:

- **(a)** blocks writing the MVP definition at all — *none remain; Part 1 is complete enough to
  approve in principle.*
- **(b)** blocks starting the first build slice — must be answered before Phase 1 build begins.
- **(c)** can be answered in parallel with early build / Phase 0.

| # | Open item | Blocks | Why |
|---|---|---|---|
| O1 | Exact job title / identity of the primary user (Q1). | **c** | Affects labels and role naming, not structure. Build can start with a generic "operational user" and rename later. |
| O2 | Exact field-level workflow for each spine step; what a "finding" record contains; whether a structured checklist exists in v1 or just free-text notes (Q3). | **b** | The visit/finding form cannot be built without knowing whether it is free-text or structured, and with which fields. Default assumption is **not** permitted — must be confirmed. |
| O3 | Issue/Action `status` lifecycle values, and whether an Issue can exist without a parent Visit (Q3/Q5). | **b** | Determines the issue state machine and the create flows. |
| O4 | The store master data source — is there an existing spreadsheet/system to seed the Store list, and in what format (Q5)? | **b** | The first slice needs real stores to be usable in the pilot. If none exists, a manual "add store" screen must be in the first slice instead. |
| O5 | Pilot scope: how many stores, which retailer/channel to start with, whether store people are Jula or retailer employees, who currently performs visits, visit frequency (Q4). | **c** | Needed to size the pilot and interpret the baseline, but not to build the slice. Keep as business inputs. |
| O6 | Current volume / baseline of store issues and visits (Q8). | **c** | Needed to set the numeric success metric; can be gathered during Phase 0 / early build. |
| O7 | Tech-stack decision inputs: data residency (e.g. Thailand), Thai-language UI requirement, hosting preference / existing accounts (e.g. Google Workspace, Vercel), who maintains the app after build (Q11, partially unanswered). | **b** | These are inputs to Phase 0. Phase 0 cannot be finalised without them. |
| O8 | Target delivery date / event, if any (Q12). | **c** | The human asked for a slice + estimate *before* a date is proposed — so this is downstream of this plan, not a blocker. |

---

# PART 3 — PHASED IMPLEMENTATION PLAN

Phases are sequential and each is individually reviewable. Only Phase 0 and the
Workflow-Definition step can begin right after approval; the first build slice waits on the
**(b)**-tagged items in Part 2.

## Phase 0 — Tech-stack decision (its own `notes/decisions/` entry)

**Deliverable:** a decision record choosing how Store Care Program is built, approved by the
human. This plan presents options and a recommendation; **the human decides.**

**Requirements the stack must meet (from Part 1):** mobile-first responsive web; real
persistence for 3 entities; minimal auth with 2 roles; internal pilot quality, not polished
production; smallest usable vertical slice; no native apps, offline infra, integrations, or
enterprise permissions unless later confirmed (Q11); tool-agnostic enough to satisfy manifesto
principle 7 (data portable, not locked to one vendor).

**Decision inputs still needed from the human (Part 2, O7):** data residency, Thai-language UI,
hosting / existing accounts, who maintains it.

### Option A — Extend the existing AI Command Center Next.js app with a backend + DB

Add API routes / server actions, a database, and auth to `projects/ai-command-center/`.

- **Pros:** one codebase, one deploy, reuse Tailwind setup and component patterns; no new
  scaffold.
- **Cons:** couples a **dashboard** (classified under the *Dashboards* capability, currently a
  deliberately static, honest-placeholder surface —
  `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`) with a
  **line-of-business application** (the *Business Applications* capability, whose stated home
  is *"Future subfolders of `projects/`"* — `docs/capability-map.md`). Mixes concerns, adds
  auth to an app that intentionally has none
  (`notes/architecture/theme-toggling.md`: *"no backend or auth yet"*), and makes the
  dashboard's build/deploy heavier. **Not recommended.**

### Option B — New app in `projects/store-care-program/` (recommended for structure)

A separate small app in its own `projects/` subfolder — matching the capability map's *"one
subfolder per initiative"* and *"Future subfolders of `projects/` (e.g. `projects/crm`,
`projects/wms`)"*. Reuse the Next.js 16 / React 19 / Tailwind stack the team already knows
(from AI Command Center), plus a persistence layer (see the sub-choice below).

- **Pros:** clean capability boundary; independent deploy and lifecycle; reuses known
  framework and patterns without coupling; the pattern generalizes to CRM/WMS later.
- **Cons:** a new scaffold and a second deploy target to manage.

### Option C — New app in `projects/store-care-program/` + managed backend-as-a-service

Option B's frontend, with persistence + auth + roles handled by a managed service exposing a
standard database (e.g. a hosted Postgres with built-in auth), rather than a hand-rolled
backend.

- **Pros:** fastest path to real persistence, auth, and a 2-role model for a pilot; least
  custom backend code; row-level access maps cleanly to the 2 roles; data stays in a standard
  SQL DB so it is portable (satisfies principle 7 as long as the schema/data can be exported).
- **Cons:** a vendor dependency to evaluate against O7 (data residency, who maintains,
  cost); slightly more upfront config than a local SQLite file.

### Recommendation (for the human to accept or override)

**Option C** — a new app in `projects/store-care-program/` using the familiar Next.js/Tailwind
stack, with a managed Postgres + auth provider for the pilot. Rationale: it keeps the
capability boundary clean (Option B's main benefit) while minimizing backend code for a pilot
that must be built as the *smallest usable slice*. If O7 answers rule out a managed vendor
(e.g. data-residency constraints, no appetite for a third-party account), fall back to
**Option B with a self-hosted database** (e.g. Postgres or SQLite + a lightweight auth
implementation). Option A is not recommended regardless.

**This recommendation is not a decision.** It becomes real only as an approved
`notes/decisions/YYYY-MM-DD-store-care-program-tech-stack.md` entry.

## Workflow-Definition step (parallel with Phase 0)

Per the capability map's Workflows guidance — *"a workflow should be written down (in `notes/`)
before it's automated — the definition comes first"* — the Q3 spine is written up as a named
workflow document in `notes/` (e.g. `notes/workflows/store-visit-issue-closure.md` or
`notes/architecture/`), capturing the 8 steps, the actors, the entity lifecycle, and the
open field-level questions (O2/O3). This is a documentation deliverable, not code, and it is
the reference the first build slice implements against. It also forces O2/O3 to be resolved
on paper before they are resolved in a form layout.

## Phase 1 — First BUILD slice (the vertical slice)

**Prerequisite:** Phase 0 decided + Part 2 **(b)** items (O2, O3, O4, O7) answered.

**The minimum that is genuinely usable in a pilot:**

- **One operational user** can authenticate (single role active; the schema knows about 2
  roles but only the operational flow is built).
- **Select a store** from a list. (If O4 confirms no seed data source: a minimal "add store"
  screen is included in this slice; if a seed source exists, a one-time import is done and the
  add-store screen can wait.)
- **Log a visit / follow-up** against that store — date, person, notes/findings (structure per
  O2).
- **Create an issue / action** from a finding — description, owner, due date, status (per O3).
- **Mark an issue resolved / closed** with an outcome.
- **A barebones management list** — all issues across stores, showing open / overdue (derived)
  / resolved, grouped or filterable by store. Read-only, minimal styling.
- Real data persisted in the Phase 0 datastore.

**Explicitly NOT in the first slice:**

- The management/admin role as a separate login and any role-gated UI beyond "this list
  exists" (the second role is Phase 2).
- A dedicated saved-visit-report view (secondary per Q6 — the data is captured, but the
  formatted report surface comes later).
- Any structured checklist beyond what O2 confirms is essential for v1.
- Notifications, reminders, exports, analytics, search beyond a simple store filter.
- Store-staff logins, CRM/WMS/Automation touchpoints (all OUT per Part 1.4).

**Definition of done for the slice:** one operational user can walk the full 8-step spine for
a real store on a phone, the data survives a reload, and the management list reflects it.

## Phase 2 — Second role + management view refinement

- Add the management/admin role as a distinct login with access to all stores and all open
  issues.
- Improve the open/overdue/resolved view (sorting, per-store rollups, overdue emphasis) based
  on pilot feedback.
- Add the saved-visit-report view if the pilot shows it is needed.

## Phase 3+ — The other intent areas, one at a time

Only after the spine is proven in the pilot, and each as its own PDCA cycle with its own
confirmed scope (no pre-scoping here): store follow-up scheduling/cadence, structured
visit checklists, sales support, merchandising support, and company↔store communication —
each evaluated against whether it belongs in Store Care Program or another area (Q9), and
whether Automation should own the automated version (Q9).

## Rough effort sizing for the first slice

Ranges, not a date — and per Q12 this cannot become a real date until Phase 0 is decided and
the **(b)** questions are answered.

- The team already knows Next.js 16 / React 19 / Tailwind (from AI Command Center), so the
  frontend framework carries no learning cost.
- New work for the slice: project scaffold; auth + datastore setup (smaller under Option C,
  larger under Option B self-hosted); 3-entity data layer; roughly 4–6 simple screens (store
  list, add/import store, visit form, issue form, issue detail/resolve, management list);
  one deploy target.
- Order-of-magnitude: a **small number of focused build cycles** — roughly **3–6 working
  sessions / 1–3 PDCA Do cycles** for Option C, more for Option B self-hosted. Treat this as a
  planning estimate to be re-derived once Phase 0 lands, not a commitment.

---

# RISKS

- **Fabrication risk (still primary).** The placeholder's six intent areas and the natural
  urge to design "a proper store-visit checklist" push toward inventing fields, categories,
  and screens the human has not confirmed. O2/O3/O4 are hard gates on the first slice for
  exactly this reason. The Workflow-Definition step exists to force these onto paper honestly
  first.
- **Scope creep past the slice.** "Management view", "second role", and "visit report" all
  feel small and in-reach during build. They are explicitly Phase 2. The slice's definition of
  done is the guardrail.
- **Phase 0 is a real, hard-to-reverse decision.** Datastore and hosting choices are
  expensive to undo once pilot data exists. It gets its own decision record and explicit
  approval, with O7 answered first — not a choice made mid-build.
- **Building alongside existing tools (Q10) means adoption is not guaranteed.** The pilot
  competes with chat/spreadsheet habits. Success criteria (1.8) are about consistent capture
  and closure evidence, not just "the app exists" — the pilot has to be run and observed, not
  just shipped.
- **Unknown pilot shape (O5).** Store count, channel, and staffing are undefined, so the
  pilot's size and the baseline are not yet knowable. This does not block the slice but does
  block claiming a success metric.
- **Tool-agnostic principle vs. a managed backend (Option C).** Mitigated by keeping data in a
  standard exportable SQL database, but the human should weigh vendor lock-in explicitly in
  Phase 0.
- **"Jula's Herb" still undefined in the repo (Appendix A8).** The definition avoids depending
  on the business's industry or retail model; O5 will fill this in for the pilot.

# NON-GOALS

- No implementation, scaffolding, `projects/store-care-program/` folder, schema, or code this
  cycle. This is a definition + plan for approval.
- No Phase 0 decision made here — options and a recommendation only; the human decides and it
  is recorded separately.
- No invented checklist, issue categories, form fields, status lists, store counts, staffing
  model, or numeric success metric (Part 2 keeps these OPEN).
- No CRM, WMS, or Automation scope defined beyond the Q9 boundary lines.
- No editing of the existing `projects.ts` Store Care Program entry, the `[slug]` page, the
  capability map, the manifesto, `agents/README.md`, or any decision record this cycle. (The
  placeholder `projects.ts` description and status may warrant an update *after* this
  definition is approved — that is a later cycle, not this one.)
- No migration of, or integration with, the existing chat/spreadsheet processes in v1 (Q10).
- No delivery-date commitment until Phase 0 and the Part 2 **(b)** questions are answered
  (Q12).
- No commit.

---

**Phase 2 complete. This is a planning deliverable only.** A Do cycle for implementation is a
separate, later cycle that may not begin until the human explicitly approves (1) this MVP
definition (Part 1) and (2) the Phase 0 tech-stack decision as its own `notes/decisions/`
entry.

---
---

# APPENDIX — PHASE 1 DISCOVERY MATERIAL (background)

Retained for traceability. Superseded as the plan's main body by Parts 1–3 above, but every
**[CONFIRMED]** repo-sourced fact in Part 1 traces back here.

## A. Repo inventory of Store Care Program context (with quoted sources)

### A1. The project entry — `projects/ai-command-center/src/data/projects.ts` (lines 36–43)

```ts
{
  name: "Store Care Program",
  description:
    "Store Care Program is a business project for helping Jula's Herb manage and support retail stores more systematically. The goal is to create a clearer operating flow for store follow-up, store visit/checklist, issue tracking, sales support, merchandising support, and communication between the company and store/frontline teams.",
  status: "Idea",
  icon: Store,
  slug: "store-care-program",
},
```

Unlike the CRM, WMS, and Automation entries (which each end with "The exact users, workflows,
metrics, and implementation plan are not confirmed yet."), the Store Care Program description
does not carry that sentence — its description is the older, longer form written in the
`2026-08-24-project-pages` cycle. The "not confirmed yet" posture is established by that
cycle's plan/retro instead (A3).

### A2. The rendered page — `projects/ai-command-center/src/app/projects/[slug]/page.tsx`

Fully generic dynamic route. For Store Care Program it renders a back link, the icon, the
name, the `Idea` status badge, the A1 description string, and — because `status === "Idea"` —
the automatic line: *"Current status: this project is at the idea and early planning stage. No
system has been built for it yet."* There is no Store Care Program-specific code, data model,
or feature anywhere in the codebase. `notes/architecture/slug-project-pages.md` Non-goals:
*"No actual product functionality on these pages — no data model, no persistence, no
per-project features."*

### A3. The cycle that created the page — `agents/runs/2026-08-24-project-pages/`

- **`plan.md`** — purpose was to build the `[slug]` routing/data pattern using Store Care
  Program as a vertical slice, not to define the product. The human issued an explicit
  Anti-Fabrication Protocol: *"Stay focused on establishing the routing/page pattern plus one
  Store Care Program placeholder page — not a full Store Care product spec"* and *"Not add
  fake metrics, fake modules, fake workflows, fake statuses, or fake user roles."* The A1
  description was human-supplied and locked in verbatim, *"used as-is / in spirit, not
  embellished."*
- **`changelog.md`** — *"No workflow steps, user roles, module names, metrics, or roadmap
  content were added."*
- **`retro.md`** — the cycle deliberately did not take on *"the larger, harder question of
  what CRM/WMS/Automation/Jula AI OS pages should actually contain."*
- **`review.md`** — Check verified byte-for-byte that nothing beyond the supplied description
  and `Idea` status shipped. Verdict: Pass.

### A4. Classification — one of the four "applied project areas"

- `notes/decisions/2026-09-01-jula-ai-os-role.md`: CRM, WMS, Automation, Store Care Program
  are *"areas the system is applied to"*; Jula AI OS is the umbrella operating model; AI
  Command Center is the dashboard into it.
- `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` (pt 3): the
  applied project areas are *"CRM, WMS, Automation, Store Care Program"* — *"the four applied
  project areas … that exist in `projects/ai-command-center/src/data/projects.ts`."*
- `projects/ai-command-center/src/components/sections/SystemOverview.tsx`: *"CRM, WMS,
  Automation, and Store Care Program are the areas that the operating model is being applied
  to."*

### A5. Where a Business Application fits — `docs/capability-map.md`

- **Projects:** *"The unit of 'a deliverable being built' … The `projects/` folder — one
  subfolder per initiative."*
- **Business Applications:** *"The actual line-of-business software the company runs on once
  it exists … Not built yet. Future subfolders of `projects/` (e.g. `projects/crm`,
  `projects/wms`)."* And: *"the reason the foundation is worth building carefully now is so
  that these applications, when built, are coherent, well-documented, and backed by a real
  process, instead of being one-off scripts."*
- **Workflows:** *"a workflow should be written down (in `notes/`) before it's automated — the
  definition comes first, the automation second"*; *"Business Applications are often the
  automated, productionized version of a proven Workflow."*
- *"Integrations and Business Applications are entirely aspirational at this point."*

### A6. How a real app should be approached — `docs/business-os-manifesto.md`

Principle 1 **Structure before software**; principle 2 **Human-in-the-loop at every real
decision point**; principle 3 **One home for every fact**; principle 6 **Keep it simple until
forced not to be**; principle 7 **Tool-agnostic by design**; principle 8 **Never fabricate**.
6-month target: *"one business application actually storing real data."* 1-year target: *"At
least one real business workflow … runs end-to-end through Business OS rather than through
disconnected spreadsheets and one-off tools."*

### A7. There is NO existing tech-stack decision for a real, persistent application

Nothing in `notes/decisions/`, `notes/architecture/`, or `docs/` chooses a stack, database,
auth model, or hosting for a line-of-business app. The only stack present:

- `projects/ai-command-center/package.json`: Next.js 16, React 19, Tailwind v4,
  `lucide-react`. No database, ORM, auth, or server-state dependency.
- `notes/architecture/theme-toggling.md`: *"No server-side or account-level persistence —
  `localStorage` only, since there's no backend or auth yet."*
- `notes/decisions/2026-07-08-ai-organization-design.md`: agents *"communicate through plain
  markdown files … no message queue or database"*; *"No vector database / RAG layer is
  introduced at this stage."*
- `docs/capability-map.md` Integrations: *"Currently roadmap-only. The `mcp/` folder is
  reserved for this."*

`automation/`, `mcp/`, `experiments/`, `python/`, `prompts/` are all empty placeholder
directories (verified: no files).

### A8. "Jula's Herb" is named but never defined in the repo

`notes/decisions/2026-09-01-jula-ai-os-role.md`: *"No file defined what 'Jula' / 'Jula's Herb'
is."* Industry, product, retail model, store count, and geography are not stated anywhere.

### A9. Process precedent for unconfirmed scope

- **CRM cycle** (`agents/runs/2026-08-28-crm-project-page/plan.md`): the human answered
  scoping questions; background the human volunteered ("likely future users") was **excluded**
  from shipped content because it was background, not confirmed. *"The human said it while
  talking about the topic"* and *"the human approved it"* are different things.
- `notes/architecture/slug-project-pages.md`: *"Thinness is not a defect"*; *"Every word of a
  project's description must trace to an explicit, human-confirmed answer."*

## B. Confirmed vs Unknown ledger (as of Phase 1)

### B1. CONFIRMED at Phase 1 (each quotes a repo source)

| # | Statement | Source |
|---|---|---|
| C1 | Named "Store Care Program"; status `"Idea"`. | `projects.ts:37,40` |
| C2 | Stated intent: help Jula's Herb *"manage and support retail stores more systematically"*; *"a clearer operating flow for store follow-up, store visit/checklist, issue tracking, sales support, merchandising support, and communication between the company and store/frontline teams."* | `projects.ts:38–39` |
| C3 | Those six items are stated **intent areas**, not a confirmed feature list or MVP scope. | `agents/runs/2026-08-24-project-pages/plan.md`, `changelog.md` |
| C4 | No system, data model, persistence, or feature has been built. | `page.tsx`; `slug-project-pages.md` Non-goals |
| C5 | One of four "applied project areas" — an area the operating model is applied to, not the model itself. | `2026-09-04-…-classification.md` pt 3; `2026-09-01-jula-ai-os-role.md`; `SystemOverview.tsx` |
| C6 | A Business Application lives in its own `projects/` subfolder and must be coherent, documented, process-backed. | `docs/capability-map.md` |
| C7 | Intended approach is "structure before software"; workflow definition precedes app code. | manifesto principle 1; capability-map Workflows |
| C8 | No tech stack / DB / auth / hosting chosen for a real persistent app. | A7 |
| C9 | Business is "Jula's Herb"; repo does not define what it is. | `projects.ts:38`; `2026-09-01-jula-ai-os-role.md` |
| C10 | Anti-Fabrication Protocol applies; thinness is acceptable. | `2026-08-24` plan; `slug-project-pages.md`; manifesto principle 8 |
| C11 | Human approves anything major or hard to reverse; agents surface tradeoffs, not resolve them. | manifesto principles 2 + "Human role vs AI role"; `agents/roles/plan.md` |
| C12 | Stated design principle for the MVP: prefer a small usable vertical slice over a broad feature list. | this cycle's goal; manifesto principle 6; `2026-08-24` retro |

### B2. Unknown at Phase 1 — now resolved or reclassified

The Phase 1 unknowns (primary users, business problem, core workflow, MVP scope, inputs/data,
outputs/actions, roles/permissions, success metrics, out-of-MVP, delivery context, tech
constraints, relationship to CRM/WMS/Automation, timeline) were put to the human as Section C
questions. Their answers are folded into Part 1 (**[CONFIRMED]**) and Part 2 (**[OPEN]**)
above. Remaining genuine blockers are the Part 2 list (O1–O8).

## C. Phase 1 question list (as asked)

Tier 1: Q1 primary user + context; Q2 the problem; Q3 the one core workflow; Q4 stores &
people; Q5 minimum data; Q6 required outputs; Q7 roles for v1; Q8 success metric + explicit
out-of-MVP. Tier 2: Q9 boundaries with CRM/WMS/Automation; Q10 existing tools; Q11 tech/build
constraints; Q12 timeline / polish bar. Tier 3 (Phase 2 decisions, not pre-answered): tech
stack, app location, workflow-to-`notes/` first.

## D. The human's Phase 1 answers (summary of verbatim intent)

- **Q1** — Primary user = the Jula's Herb person responsible for visiting/following up stores
  and ensuring store-level issues get resolved. Mobile-first, also usable on a laptop at HQ.
  Offline not required for v1 unless later confirmed. Exact job title NOT confirmed — human
  will confirm; do not assume.
- **Q2** — Fragmented follow-up: unclear ownership, missing due dates, info via chat/verbal,
  management can't see open/overdue/resolved, important issues dropped or handled
  inconsistently. v1 worth using if every important store issue is visible, assigned, followed
  up, and closed systematically.
- **Q3** — Spine CONFIRMED: "store visit/follow-up → issue/action tracking → closure" (not six
  equal modules). 8 steps as listed in Part 1.3. Real example and exact fields to come from
  the human; do not invent checklist or issue categories.
- **Q4** — All OPEN, kept as business inputs: store count for pilot; which retailer/channel;
  whether store people are Jula or retailer employees; who performs visits/follow-up; visit
  frequency. Do not assume ownership or staffing.
- **Q5** — Data model CONFIRMED starting shape (Store / Visit-Follow-up / Issue-Action with
  the fields in Part 1.5); no extra fields until confirmed. Seeding spreadsheet/system for
  the store master: human will confirm.
- **Q6** — Two priority outputs: (1) an issue/action with named owner + due date + status;
  (2) a management view of open/overdue/resolved by store. Saved visit report secondary.
- **Q7** — Two minimal roles: operational user; management/admin (sees all). Store-level
  logins not confirmed — out of v1. No complex permissions.
- **Q8** — Qualitative success: after the pilot, issues/actions consistently captured with
  owner, due date, visible status, and evidence of follow-through to closure. Numeric metric
  NOT set — ask for volume/baseline first; don't invent a percentage. OUT of MVP: CRM;
  WMS/full inventory; sales forecasting; full merchandising; retailer/ERP integration;
  automated messaging/workflows; advanced analytics; complex permissions; store staff
  portal/app; AI recommendations.
- **Q9** — Store Care owns the operational store follow-up workflow; CRM owns customer/member
  relationships; WMS owns inventory/stock; Automation may automate Store Care workflows later.
  Store Care may reference their data later but v1 does not replace them.
- **Q10** — v1 sits alongside existing chat/spreadsheet processes, not replacing them. Prove
  usefulness before planning migration/integration.
- **Q11** — Smallest usable vertical slice; mobile-friendly web preferred; no native apps,
  offline infra, integrations, or enterprise permissions unless confirmed needed.
- **Q12** — Working internal pilot, not polished production. Break the MVP into the smallest
  vertical slice and estimate against the existing AI Command Center codebase before proposing
  a delivery date.
