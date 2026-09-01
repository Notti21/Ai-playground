# Current-State Brief — how the overlapping concepts are described today

Supporting evidence for the decision entry. Verbatim quotes with file paths, plus the concrete
contradictions between them. No recommendations — this is a snapshot of the repo as of 2026-09-01.

The five overlapping concepts: **Jula AI OS**, **Business OS**, **AI Command Center**,
**AI Organization**, and **"Personal AI Operating System"**.

---

## 1. Jula AI OS

**`projects/ai-command-center/src/data/projects.ts:13-18`** — the Projects grid card:

> ```ts
> {
>   name: "Jula AI OS",
>   description:
>     "The umbrella system connecting agents, projects, and tools into one operating model.",
>   status: "In progress",
>   icon: Bot,
> }
> ```

- It is the first entry in the `projects` array.
- It has **no `slug` field** → renders as a plain, unlinked `<div>` card (per
  `Projects.tsx:31-39`).
- Its status is **`"In progress"`** — the only one of the five cards not at `"Idea"` (CRM, WMS,
  Automation, Store Care Program are all `"Idea"`).

**`docs/capability-map.md:49`** — under the **Projects** capability:

> **Purpose:** The unit of "a deliverable being built" — the concrete initiatives the business is
> actually running: CRM, WMS, Automation, Jula AI OS, AI Command Center.

**`notes/decisions/2026-07-08-ai-organization-design.md:32`** (immutable decision record):

> Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they are what the
> loop is applied to.

**`agents/README.md:19`**:

> Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they're what the
> loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.

**Prior PDCA cycles** have all explicitly deferred deciding its role:

- `agents/runs/2026-08-24-project-pages/plan.md:57` — kept "plain, unlinked" alongside CRM/WMS/Automation.
- `agents/runs/2026-08-28-crm-project-page/plan.md:50` — "still deferred."
- `agents/runs/2026-08-31-wms-automation-project-pages/plan.md:77` — "it's an umbrella/system-level
  concept, not a [normal project]."
- `agents/runs/2026-08-31-wms-automation-project-pages/retro.md:92` — Next Action #2: "Decide Jula
  AI OS's role — still undecided, carried forward a third time."

Note: no file anywhere in the repo defines what "Jula" or "Jula's Herb" is, or states in prose
that "Jula AI OS" is a Jula-specific instance of "Business OS". That link is established for the
first time by this cycle's human answers, not by any pre-existing document.

---

## 2. Business OS

**`docs/business-os-manifesto.md:5`** — "In one sentence":

> Business OS is the operating system for running a company with structured thinking, reusable
> workflows, compounding knowledge, and AI agents doing the structured execution work — not another
> app bolted onto the business, but the foundation the business's apps, decisions, and processes all
> run on.

**`docs/business-os-manifesto.md:16`**:

> AI Command Center is the *visible dashboard* into this system. Business OS is the *foundation
> underneath it* — the operating model, not the screen.

**`docs/business-os-manifesto.md:33`** — the comparison table, Dashboard row:

> AI Command Center is one dashboard *into* Business OS, not Business OS itself.

**`docs/capability-map.md:1`**:

> # Business OS — Capability Map (v1)
> This document defines the first version of the capabilities Business OS is built from.

Business OS is **not** a card in the Projects grid, and **not** listed as a "project" anywhere. It
is consistently described as the whole operating model / foundation.

The name "Business OS" appears **only** in `docs/` and (as "Business OS / operating model")
in this cycle's own plan — never in the app's UI or `src/`.

---

## 3. AI Command Center

**`projects/ai-command-center/README.md:3`**:

> The landing page for the AI Engineering Playground, designed to grow into a dashboard for AI
> tools, automation, CRM, WMS, and other business applications built in this repo.

**`projects/ai-command-center/src/app/layout.tsx:17-18`** — page metadata:

> ```ts
> title: "AI Command Center",
> description: "Personal AI Operating System — Plan, Do, Check, Act.",
> ```

**`projects/ai-command-center/src/components/layout/TopBar.tsx:8`** — "AI Command Center".

**`docs/capability-map.md:111`** — under the **Dashboards** capability:

> **What it contains:** `projects/ai-command-center` — the Agent System, Projects, Tools, Knowledge
> Base, Recent Activity, and Next Actions sections already built.

**`docs/capability-map.md:113`**:

> Dashboards are the windshield, not the engine.

**Contradiction:** `capability-map.md:49` lists "AI Command Center" as one of the **Projects**
("concrete initiatives the business is actually running"), while `capability-map.md:111` and the
manifesto treat it as a **Dashboard** — a consumer, not a project/initiative. The manifesto is
unambiguous that it is "one dashboard *into* Business OS, not Business OS itself"; the capability
map's Projects list is looser. (This cycle keeps AI Command Center's own status out of scope per
the human's answer 8 — recorded here only as an observed inconsistency.)

---

## 4. AI Organization

**`notes/decisions/2026-07-08-ai-organization-design.md:10-11`**:

> this decision defines how AI agents operate across the whole repository — the "AI Organization" —
> before more features are built.

**`notes/decisions/2026-07-08-ai-organization-design.md:32`** (org chart context):

> The Orchestrator role is intentionally *not* a fifth autonomous agent yet.

"AI Organization" names the **PDCA agent structure** (Plan/Do/Check/Act + human Orchestrator) —
the execution engine. `business-os-manifesto.md:68` ties them together:

> Business OS's execution engine *is* the Plan → Do → Check → Act loop, carried out by role-bound AI
> agents with a human approval gate.

So: **AI Organization ⊂ Business OS** (it's the "Agents" capability + the loop, not the whole
operating model). No contradiction here — just a narrower scope than "Business OS".

---

## 5. "Personal AI Operating System"

**`projects/ai-command-center/src/components/sections/Hero.tsx:4-6`** — the hero eyebrow:

> Personal AI Operating System

**`projects/ai-command-center/src/app/layout.tsx:18`** — the `<meta>` description:

> Personal AI Operating System — Plan, Do, Check, Act.

Used as a tagline for the **dashboard/app itself**, in the UI. It is not defined anywhere as a
distinct concept — reads as a marketing-style label for what AI Command Center is a window into.
Overlaps loosely with both "Business OS" (the operating model) and "AI Command Center" (the app),
without a file pinning down which.

Also note **`NextActions.tsx:11`**:

> The current seed roadmap for turning this into a real operating system.

— "operating system" used a third way, informally, to mean "the whole thing being built."

---

## Concrete contradictions / gaps, listed

1. **"Jula AI OS" vs "Business OS".** `projects.ts` calls Jula AI OS "the umbrella system … one
   operating model"; the manifesto calls Business OS "the operating model, not the screen." Two
   names, one apparent concept, with no file reconciling them. (This cycle's human answer: they are
   the same thing — Jula AI OS is the Jula-specific Business OS.)

2. **"AI Command Center" is both a Project and a Dashboard.** `capability-map.md:49` lists it under
   Projects; `capability-map.md:111` and the whole manifesto treat it as only a Dashboard "into"
   Business OS. (Out of scope this cycle; flagged as follow-up iii.)

3. **Jula AI OS sits in the Projects grid as a peer of CRM/WMS/Automation/Store Care Program**,
   but the human's answer 5 is that it is the umbrella *above* those, not something the system is
   "applied to" — which is exactly what the Projects section claims to contain
   (`Projects.tsx:11-12`: "What the system is being applied to" / "The real business systems this
   operating model is meant to build and run").

4. **"In progress" status is undefined.** Nothing states what concrete work counts as Jula AI OS's
   progress. It's the only non-"Idea" card. (Human answer 3 reinterprets it: the operating model is
   being built progressively through its modules/workflows — not a finished product.)

5. **Three informal uses of "operating system" / "operating model"** — the Hero eyebrow ("Personal
   AI Operating System"), `NextActions.tsx` ("a real operating system"), and `projects.ts`
   ("one operating model") — none cross-referenced to the manifesto's "Business OS" definition.

6. **The Jula/Jula's Herb entity itself is never defined** in the repo. "Jula AI OS" appears as a
   name with no backing explanation of what business it serves — until this cycle's human input.
