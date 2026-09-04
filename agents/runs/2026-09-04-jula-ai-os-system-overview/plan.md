# Plan — Jula AI OS system-overview representation in the AI Command Center

**Cycle:** `agents/runs/2026-09-04-jula-ai-os-system-overview/`
**Date:** 2026-09-04
**Status:** Finalized against the human's Open-Question decisions (recorded below). The direction
and the implementation spec are ready for a **separate, explicit human approval** before a Do
cycle runs. **Do may not act on this plan until the user explicitly approves the implementation
spec.** This cycle stays planning-only.

This is decision follow-up **(ii)** from `notes/decisions/2026-09-01-jula-ai-os-role.md` and
retro Next Action **#2** from `agents/runs/2026-09-03-remove-jula-ai-os-card/retro.md`.

---

## Goal

Add a **"System Overview"** section to the AI Command Center homepage, immediately before the
Projects section, whose single job is to make the app's hierarchy legible: **Jula AI OS = the
operating model; AI Command Center = the dashboard/interface into it; CRM / WMS / Automation /
Store Care Program = the applied project areas.** It also states, honestly, that the operating
model is in progress — built up through its parts, not a finished product.

This is an app-direction / information-architecture cycle. **No UI is implemented here.** The
output is this plan, including a ready-to-approve implementation spec that a later Do cycle would
follow verbatim.

---

## Decisions taken (Open Questions, resolved by the human)

| # | Question | Decision |
|---|---|---|
| 1 | Shape: (a) homepage section, (b) separate route, (c) hero/banner | **(a) a new homepage section.** (b) and (c) rejected — no separate overview page. |
| 2 | Placement | **Immediately before the `Projects` section.** |
| 3 | Section heading | **"System Overview".** |
| 4 | UI term for the operating model | **"Jula AI OS".** Do **not** introduce "Business OS" into the UI in this cycle. |
| 5 | Link out to `docs/business-os-manifesto.md` / `docs/capability-map.md`? | **No. Self-contained.** No outbound doc links. |
| 6 | How to name the business | **"the company".** Do **not** describe Jula's Herb (no "skincare"/"cosmetics"/brand characterization) — that wording is not sourced anywhere in the repo. Stay neutral; add no business description beyond the accepted decision. |
| 7 | Approved visible content | **(1)** the hierarchy statement; **(2)** the "being built progressively" framing from decision point 3. **Not** approved as visible content: the illustrative module list (PDCA agent org / knowledge base / capability map / this dashboard / project areas) — stays background-only — and the audience note. Both left out. |
| 8 | Also reword the `Projects` section heading/description? | **No — out of scope.** Confirmed fine as-is (this closes follow-up (i)'s "to be confirmed" note). |
| 9 | Proceed before follow-up (iii) reconciles `capability-map.md`? | **Yes, acceptable.** `capability-map.md:49` will briefly still list "Jula AI OS" and "AI Command Center" as *Projects* until (iii) reconciles it. That is expected and is owned by the separate (iii) cycle — this cycle does not touch that file. |
| 10 | Decision entry for a new nav pattern (only if option b) | **Moot** — option (b) was rejected. |

---

## Scope

### In scope (this cycle)

- Inventory the current AI Command Center structure (below).
- Record the human's decisions (above) and bake them into the plan.
- Produce a concrete, ready-to-approve **implementation spec** for a later Do cycle: exact files
  to add/edit, a content-lock draft of the shipped copy with every sentence cited to its source,
  and the lint/build/visual verification steps.

### Out of scope (this cycle)

- Any implementation — no code, no doc edits, no commit. See Non-Goals.

---

## Current-state inventory — AI Command Center

**App:** `projects/ai-command-center/` — Next.js (App Router) + TypeScript + Tailwind v4.

### Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | The single homepage — 8 stacked sections |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | Thin per-project page: icon, name, status badge, description, auto "Idea" banner, "← Back to home" link. `generateStaticParams()` prerenders only `projects` entries with a `slug`. |

No other routes. **No navigation** beyond `TopBar` (`src/components/layout/TopBar.tsx`): a static
"AI Command Center" wordmark, a static "Foundation phase" pill, the theme toggle. No links, no
menu. Adding a homepage section (the chosen shape) requires none of that to change.

### Homepage section order (`src/app/page.tsx`)

1. **Hero** (`Hero.tsx`) — eyebrow "Personal AI Operating System", h1 "Command Center", one
   paragraph. Static JSX, no data file.
2. **AgentSystem** (`AgentSystem.tsx`) — 4 cards from `src/data/agents.ts`.
3. **PdcaStatus** (`PdcaStatus.tsx`) — eyebrow "Workflow Status", title "The loop runs
   end-to-end"; **one descriptive `Card`, static JSX, with a single lucide icon** — the closest
   existing template for the new section.
4. **Projects** (`Projects.tsx`) — eyebrow "Projects", title "What the system is being applied
   to", description "The real business systems this operating model is meant to build and run.";
   4 cards from `src/data/projects.ts` (CRM, WMS, Automation, Store Care Program — all `"Idea"`,
   all with a `slug`). **← the new section goes immediately above this.**
5. **Tools** (`Tools.tsx`) — 4 cards from `src/data/tools.ts`.
6. **KnowledgeBase** (`KnowledgeBase.tsx`) — 3 cards from `src/data/knowledge.ts`.
7. **RecentActivity** (`RecentActivity.tsx`) — honest placeholder empty state.
8. **NextActions** (`NextActions.tsx`) — list from `src/data/actions.ts`.

### Shared UI primitives

- `SectionHeading` (`src/components/ui/SectionHeading.tsx`) — `eyebrow` (string, required) +
  `title` (string, required) + `description` (string, optional).
- `Card` (`src/components/ui/Card.tsx`) — the box every section's content sits in; accepts an
  optional `className`.
- A static single-card section (`PdcaStatus.tsx`) needs no `src/data` file.

### Relevant current facts

- The term **"Business OS"** appears **nowhere** in `src/` — only in `docs/`. The new copy keeps
  it that way (decision #4).
- No app link to `docs/`. The new section stays self-contained (decision #5).
- `projects/ai-command-center/README.md` lists the homepage section **titles** in order in its
  "Development" section — adding a section makes that list stale, so the README is part of the
  edit set (see implementation spec).
- The dead `if (project.slug) … else return <div>` branch in `Projects.tsx` is untouched by this
  cycle (prior retro Next Action #4 — separate).

---

## Content basis — every shipped line traces to a source

**Rule (Anti-Fabrication Protocol — `slug-project-pages.md`; `business-os-manifesto.md` principle
8; `2026-09-01-jula-ai-os-role.md` point 5):** every sentence that ships must trace to one of the
sources below. Nothing inferred, extrapolated, or padded. Thinness is expected and acceptable.

Primary sources for this section:

- **S1** — `notes/decisions/2026-09-01-jula-ai-os-role.md`, Decision ¶1 (the file's lines 38–42):
  > "Jula AI OS is the Jula-specific instance of Business OS — the Business OS concept (the
  > operating model for running a company: …) applied to Jula's Herb. It is not a peer project
  > alongside CRM, WMS, Automation, and Store Care Program. Those are areas the system is *applied
  > to*; Jula AI OS is the umbrella operating model *above* them, and AI Command Center is the
  > dashboard/interface into it."
- **S2** — same file, Decision **point 3** (lines 56–60):
  > "The `"In progress"` status is accurate but is reinterpreted. It means the overall Business OS
  > / Jula AI OS operating model is being built progressively through its modules and workflows
  > (…). It does **not** mean there is a finished Jula AI OS product, a completed system, or a
  > page describing one."
- **S3** — `docs/business-os-manifesto.md` line 16 / line 33: "AI Command Center is one dashboard
  *into* Business OS, not Business OS itself." (Corroborates S1; not quoted in the UI.)
- **S4** — existing `Projects.tsx` section title "What the system is being applied to"
  (corroborates the "applied areas" framing already used in the app).

**Deliberately excluded** (per decision #7): the illustrative module list in S2's parenthetical,
the audience note (S1 point 4), the manifesto's principle list, any description of Jula's Herb,
the word "Business OS".

---

## Implementation spec (for a later, separately-approved Do cycle)

### Files

| Action | File | Change |
|---|---|---|
| **Add** | `projects/ai-command-center/src/components/sections/SystemOverview.tsx` | New static section component, modeled on `PdcaStatus.tsx` (one `SectionHeading` + one `Card` with a single lucide icon). No `src/data` file — content is fixed prose, like `PdcaStatus`/`Hero`. |
| **Edit** | `projects/ai-command-center/src/app/page.tsx` | Add `import { SystemOverview } from "@/components/sections/SystemOverview";` and render `<SystemOverview />` on the line **immediately before `<Projects />`** (i.e. directly after `<PdcaStatus />`). |
| **Edit** | `projects/ai-command-center/README.md` | In the "Development" section's list of section titles, insert the new section's title in the same position it renders (immediately before `"What the system is being applied to"`), so the README stays accurate. |

No other files change. No route file, no `TopBar`, no `Projects.tsx`, no `src/data/*`, no
`globals.css`, no `docs/*`.

### Content-lock — the exact copy to ship

`SectionHeading` props:

- `eyebrow`: **`System Overview`**
- `title`: **`How the parts fit together`**
- `description`: **`Jula AI OS is the operating model for running the company. The AI Command Center is the dashboard and interface into it. CRM, WMS, Automation, and Store Care Program are the areas that operating model is being applied to.`**

`Card` body — one paragraph:

> **`Jula AI OS is in progress. The operating model is being built up progressively through its parts — it is not a finished product or a completed system.`**

Per-sentence citation:

| Shipped text | Source / justification |
|---|---|
| `System Overview` (eyebrow) | New section label (decision #3). Framing, not a factual claim. |
| `How the parts fit together` (title) | New section label. Framing, not a factual claim. If the human prefers different wording, adjust here — it asserts nothing beyond "this section relates the pieces." |
| `Jula AI OS is the operating model for running the company.` | **S1** ("the operating model for running a company"; "Jula AI OS is the umbrella operating model above them"). "the company" substituted for "Jula's Herb" per decision #6 — no sourced business description exists. |
| `The AI Command Center is the dashboard and interface into it.` | **S1** ("AI Command Center is the dashboard/interface into it"); corroborated by **S3**. |
| `CRM, WMS, Automation, and Store Care Program are the areas that operating model is being applied to.` | **S1** ("Those are areas the system is *applied to*"), naming the four current `projects` entries; corroborated by **S4**. |
| `Jula AI OS is in progress.` | **S2** (the `"In progress"` status, reinterpreted). |
| `The operating model is being built up progressively through its parts` | **S2** ("being built progressively through its modules and workflows"). "its parts" used instead of "modules and workflows" so no specific enumerated set is implied — the illustrative list is background-only per decision #7. |
| `it is not a finished product or a completed system.` | **S2** ("It does *not* mean there is a finished Jula AI OS product, a completed system…"). |

Icon: a single neutral lucide-react icon in the `Card` (e.g. `Layers`), matching the
`PdcaStatus` pattern of one `h-5 w-5 text-accent` icon. Icon choice is not load-bearing; Do may
pick any existing lucide icon that reads as "structure/layers." Import only what is used (ESLint
`no-unused-vars` runs in `next build`).

### Reference component shape (illustrative — Do writes the real file)

```tsx
import { Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SystemOverview() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="System Overview"
        title="How the parts fit together"
        description="Jula AI OS is the operating model for running the company. The AI Command Center is the dashboard and interface into it. CRM, WMS, Automation, and Store Care Program are the areas that operating model is being applied to."
      />
      <Card>
        <Layers className="h-5 w-5 text-accent" strokeWidth={1.75} />
        <p className="mt-4 text-sm text-muted">
          Jula AI OS is in progress. The operating model is being built up progressively
          through its parts — it is not a finished product or a completed system.
        </p>
      </Card>
    </section>
  );
}
```

### page.tsx insertion point

```
      <Hero />
      <AgentSystem />
      <PdcaStatus />
      <SystemOverview />   ← new line, immediately before <Projects />
      <Projects />
      <Tools />
      ...
```

### Verification steps (Do runs these, in `projects/ai-command-center/`)

1. `npm run lint` — passes with no new warnings (watch for unused imports).
2. `npm run build` — succeeds; the new section is statically rendered on `/`; `/projects/[slug]`
   still prerenders its four slugs and an unknown slug still 404s (regression check — unchanged
   files, but cheap to confirm).
3. `npm run dev`, load `/`:
   - "System Overview" appears **immediately above** the Projects grid, below "The loop runs
     end-to-end".
   - Toggle light/dark — text, `Card`, icon, and spacing match the neighbouring sections.
   - Copy matches the content-lock **exactly** (literal check).
4. Confirm README's section-title list now includes the new title in the right position.

### Check-agent gate (for the Do cycle's Check step)

- Literal / normalized-whitespace comparison of the shipped `eyebrow` + `title` + `description` +
  `Card` paragraph against the content-lock above.
- Grep the built output and `src/` for content that must **not** appear: `Business OS`,
  `skincare`, `cosmetics`, any brand name, the illustrative module list, an audience statement.
- Verify against the primary sources (S1, S2), not Do's self-report.

### Knowledge-base updates (for the Do cycle)

- `notes/architecture/slug-project-pages.md` — update the two forward-looking mentions of "a
  separate future cycle will represent it as a system-overview area" to past tense, citing this
  run folder, once the section exists. Living doc; tense-only edit, no analysis rewritten.
- No new `notes/decisions/` entry is required: `2026-09-01-jula-ai-os-role.md` already set this
  direction (option (b)-later). The shape choice (a homepage section, not a page) is recorded in
  this plan and the cycle's retro — not a new decision record. Act confirms.

---

## Risks

- **Fabrication pressure (highest).** A "System Overview" invites expansion into something
  substantial when the sourced material is two short paragraphs. Mitigation: the content-lock is
  exhaustive; Check compares against S1/S2 literally; decision #7 already fixed what is in and
  out.
- **"the company" reads as vague.** Accepted tradeoff (decision #6) — no sourced description of
  Jula's Herb exists, and inventing one is forbidden. Neutral and honest beats specific and
  fabricated.
- **Brief divergence from `capability-map.md:49`.** It still lists "Jula AI OS" and "AI Command
  Center" as *Projects* until follow-up (iii) runs. Accepted (decision #9); owned by (iii); this
  cycle does not touch that file.
- **Stale README.** Adding a section without updating `README.md`'s section-title list would make
  the README wrong. Mitigated by including it in the edit set.
- **Title wording.** "How the parts fit together" asserts nothing factual, but if the human wants
  a different phrase it must be settled at implementation-spec approval, not improvised by Do.
- **Homepage length.** A 9th section. Minor and accepted — the section is short (one card) and
  placed where it does the most disambiguation work.

---

## Non-Goals

- **Any UI or code implementation in this cycle.** The plan (with its implementation spec) is the
  only deliverable. Do runs only after a separate explicit approval of that spec.
- **No commit** in this cycle.
- **No separate overview page or route, and no hero/banner treatment** — options (b) and (c) are
  rejected. Homepage section only.
- **The term "Business OS" does not enter the UI** in this cycle.
- **No description of Jula's Herb** — no industry, product, or brand characterization. "the
  company" only.
- **No edits to `docs/capability-map.md` or `docs/business-os-manifesto.md`**, and no outbound
  links to them. That is follow-up **(iii)**'s territory.
- **Not** resolving `capability-map.md:49`'s Projects-list inconsistency or AI Command Center's
  project-vs-dashboard status — follow-up **(iii)**.
- **No rewording of the `Projects` section heading or description** — confirmed fine as-is
  (decision #8).
- **Not** removing the dead `if (project.slug)` branch in `Projects.tsx` — prior retro Next
  Action #4, a separate cycle.
- **Inventing zero** Jula AI OS features, modules, metrics, workflows, roadmap items, users, or
  dashboards. The illustrative module list and the audience note stay out (decision #7).
- **Not** a live or data-fed overview — no feeds, no metrics, no `src/data` file.
- **Not** a homepage redesign, `TopBar` change, theming change, or change to the `Card` /
  `SectionHeading` primitives.
- **Not** editing the immutable decision records
  (`2026-07-08-ai-organization-design.md`, `2026-09-01-jula-ai-os-role.md`).
- **Not** reconciling the informal "operating system / operating model" taglines elsewhere in the
  app (Hero eyebrow, `NextActions` copy).

---

## Handoff

The direction is settled by the human's decisions above. What still needs **explicit human
approval before any Do cycle** is the **implementation spec** — specifically the content-lock
copy (including the `title` wording) and the three-file edit set. **Do may not act on this plan
until the user explicitly approves it.**
