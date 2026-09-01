# Plan — Decide Jula AI OS's role in the AI Command Center

**Date:** 2026-09-01
**Cycle:** `agents/runs/2026-09-01-jula-ai-os-role/`
**Status:** Finalized — the human has answered all clarifying questions (see "Decisions from the human" below) and the decision direction is set. Awaiting the human's explicit approval to start Do. This remains a decision/documentation-only cycle: Do writes **no application code**.

---

## Goal

Record an explicit, durable decision about what "Jula AI OS" is within the AI Command Center dashboard and how it should be represented. Based on the human's answers, the decision is: **Jula AI OS is the Jula-specific Business OS (the umbrella operating model), not a peer project — remove it from the Projects grid as a normal project card, and in a later cycle represent it as an umbrella / system-overview area elsewhere in the app.** This cycle produces the decision record and updates affected knowledge files only. It builds and styles no UI.

## Scope

### This cycle will

- Compile a plain "current state" brief of how the overlapping concepts are described today across the repo — **Jula AI OS**, **Business OS**, **AI Command Center**, **AI Organization**, "Personal AI Operating System" — quoted verbatim with file paths, plus the concrete contradictions between them. No conclusions.
- Produce a single `notes/decisions/2026-09-xx-jula-ai-os-role.md` entry recording the decision, the options considered, the reasoning, the "In progress" reinterpretation, the audience, the "no invented features" constraint, and the explicit follow-ups — plus a "what this does not decide" section.
- Update the living note `notes/architecture/slug-project-pages.md` to replace its "open, separate decision" language about Jula AI OS with a pointer to the new decision entry, and to note that the linked-vs-unlinked visual-distinction question is now largely moot (Jula AI OS was the last unlinked card and is slated for removal, not a page).

### This cycle will not

- Write or change any application code (`projects.ts`, `Projects.tsx`, `[slug]/page.tsx`, `actions.ts`, any component, route, or data file). **Hard non-goal.**
- Remove the Jula AI OS card. That is follow-up (i) — a separate Plan/Do cycle.
- Design or build the umbrella / system-overview area. That is follow-up (ii) — a separate Plan/Do cycle.
- Edit `docs/business-os-manifesto.md`, `docs/capability-map.md`, or `notes/decisions/2026-07-08-ai-organization-design.md`. The manifesto/capability-map inconsistency is flagged as follow-up (iii), not fixed here.
- Decide AI Command Center's own project-vs-dashboard status (the human explicitly kept this out of scope).
- Rewrite the Projects section wording. Whether "what the system is being applied to" needs a tweak after removal is *flagged* for a follow-up cycle, not done here.
- Rename any concept.

## Decisions from the human

The human answered the clarifying questions as follows. These are inputs to Do, not open items.

1. **Identity:** Jula AI OS *is* the Jula-specific Business OS — the Business OS concept applied to "Jula's Herb". It is **not** a normal peer project like CRM / WMS / Automation / Store Care Program.
2. **Representation:** Because AI Command Center is the dashboard/interface for this system, Jula AI OS should not remain a normal project card in the Projects grid. It is the umbrella operating model the dashboard represents.
3. **"In progress" status:** Still accurate, but reinterpreted — it means the overall Business OS / Jula AI OS operating model is being developed progressively through its modules and workflows. It does **not** mean there is a finished Jula AI OS product, page, or complete system.
4. **Audience:** Primarily the human plus internal Jula's Herb management for now. Possibly teams later, but the current audience is internal and management-oriented.
5. **Projects section fit:** Jula AI OS does not fit the Projects section as a peer. That section is for areas the system is *applied to* (Store Care Program, CRM, WMS, Automation). Jula AI OS is the umbrella system / operating model *above* those.
6. **Near-term visibility:** Yes, there is a reason to make it visible — but only to clarify the app's hierarchy and direction. It must **not** become a fake product page with invented features.
7. **Chosen direction:** Option **(d) now + (b) later** — remove Jula AI OS from the Projects grid as a peer card, and in a later cycle represent it as an umbrella / system-overview area elsewhere in the app. This cycle documents the decision only; no UI unless this plan explicitly asks for it and the human approves (it does not).
8. **AI Command Center's own status:** Out of scope. This cycle only decides/documents Jula AI OS's role.

## Background (what's already known)

- Jula AI OS is the last of the original five Projects cards still unlinked, deferred as an "umbrella concept" across four prior cycles: `2026-08-24-project-pages` (pattern built), `2026-08-28-crm-project-page`, and `2026-08-31-wms-automation-project-pages`. CRM, WMS, Automation, and Store Care Program all now have real linked `/projects/<slug>` pages via a data-only pattern.
- The `actions.ts` "Turn Projects into real project pages" Next Action has been closed (commit `4851b08`), so Jula AI OS is no longer framed as unfinished work under that goal.
- `src/data/projects.ts` currently describes the card as *"The umbrella system connecting agents, projects, and tools into one operating model."* — status **"In progress"**, the only card not at "Idea".
- `Projects.tsx` section title: *"What the system is being applied to"*; description: *"The real business systems this operating model is meant to build and run."*
- Doc inconsistency the decision entry must name (but not fix this cycle):
  - `docs/business-os-manifesto.md` defines **Business OS** as the operating model and calls **AI Command Center** "the *visible dashboard* into this system … not Business OS itself."
  - `docs/capability-map.md` lists **both** "Jula AI OS" **and** "AI Command Center" as *Projects*, while also defining AI Command Center under the *Dashboards* capability. The capability map explicitly requires changes go "through a new entry in `notes/decisions/`, not by silently rewriting history here."
  - `notes/decisions/2026-07-08-ai-organization-design.md` (immutable) lists "Jula AI OS" among "projects … not agents — they are what the loop is applied to."

## Steps

1. **Compile the "current state" brief** into this run folder (not a `notes/` file): every place the five overlapping concepts are described, quoted verbatim with file paths, plus a short list of the concrete contradictions. No recommendations — this is supporting evidence for the decision entry.
2. **Draft `notes/decisions/2026-09-xx-jula-ai-os-role.md`.** Use the `YYYY-MM-DD-<slug>.md` convention and the standard decision shape (Context / Decision / Consequences or similar). It must capture:
   - **Decision:** Jula AI OS is the Jula-specific instance of Business OS — the umbrella operating model, not a peer project. It will be removed from the Projects grid as a normal project card (follow-up i), and later represented as an umbrella / system-overview area elsewhere in the app (follow-up ii).
   - **Options considered:** (a) normal project page, (b) umbrella/system-overview page, (c) stay a plain unlinked card, (d) remove from the Projects grid — and why (d)-now-plus-(b)-later was chosen over the others.
   - **"In progress" reinterpretation** (from answer 3): the status describes the operating model being built progressively through its modules/workflows, not a finished product.
   - **Audience** (from answer 4): the human plus internal Jula's Herb management for now; possibly teams later.
   - **Hard constraint** (from answer 6): any future representation must not invent features, modules, users, workflows, metrics, or roadmap items — it exists to clarify hierarchy and direction, honestly. This is the Anti-Fabrication Protocol from `slug-project-pages.md` applied to the future overview area.
   - **What this does not decide:** the removal mechanics, the overview area's location / shape / content, the Projects section wording, the manifesto/capability-map reconciliation, and AI Command Center's own project-vs-dashboard status.
   - **Follow-ups**, listed explicitly:
     - **(i)** An implementation Plan/Do cycle to remove the Jula AI OS card from the Projects grid (`projects.ts`, and check whether `Projects.tsx`'s `.map` / empty-state assumptions still hold with four cards).
     - **(ii)** An implementation Plan/Do cycle to build an umbrella / system-overview representation of Jula AI OS elsewhere in the app — internal/management audience, no invented content.
     - **(iii)** A docs-reconciliation task for the manifesto / capability-map inconsistency (capability map lists Jula AI OS and AI Command Center as Projects; manifesto treats AI Command Center as only the dashboard). Per the capability map's own rule, this goes through a new `notes/decisions/` entry.
     - **(iv)** The linked-vs-unlinked card visual-distinction question (WMS/Automation retro, Next Action #3) is now largely moot: Jula AI OS was the only unlinked card, and it is slated for removal rather than a page — after follow-up (i), all remaining Projects cards are links. Note this so a future cycle doesn't re-raise it as open.
     - **Flag:** after the card is removed, revisit whether the Projects section wording ("what the system is being applied to" / "the real business systems this operating model is meant to build and run") still reads correctly with Jula AI OS gone — likely fine, but confirm in follow-up (i).
   - The human approves the exact wording of the decision entry before it is committed.
3. **Update `notes/architecture/slug-project-pages.md`** (living document, in-place edit is correct):
   - Replace the §1 optional-field aside about "only Jula AI OS … as of this writing" with a note that Jula AI OS will be removed from the grid, not given a slug — see the new decision entry.
   - Replace the final non-goals bullet ("Whether Jula AI OS should ever get a real page remains an open, separate decision …") with a pointer to the resolved decision.
   - Update the linked/unlinked-distinction non-goals bullet to record that this question is now largely moot per follow-up (iv) above.
4. **Act (retro)** records that the four-cycle deferral is resolved, links the new decision entry, and carries follow-ups (i)–(iii) forward as Next Actions for the human to schedule.

## Risks

- **Scope creep into code.** The hard non-goal is that Do writes no application code this cycle — not `projects.ts`, not `Projects.tsx`, nothing. The only writes are the decision entry and the `slug-project-pages.md` edit. Do stops and asks if it feels pulled toward a data or component file.
- **The decision entry drifting beyond what the human decided.** The human decided the *role* and the *direction* (remove now, overview later, internal/management audience, no invented features). Do must not, in the decision entry, specify *where* the overview area lives, *what* it contains, or *how* removal is done — those are explicitly deferred to follow-ups (i) and (ii). Writing them now would be fabricating scope the human hasn't approved.
- **Reconciling the manifesto / capability-map inconsistency in this cycle.** Tempting, since the decision touches the same concepts — but the capability map requires its own new decision entry, and the human scoped this to Jula AI OS's role only. Flag it as follow-up (iii); do not edit those docs.
- **Re-opening AI Command Center's project-vs-dashboard status.** Explicitly out of scope per answer 8. If the brief surfaces it, note it as an observation for a future cycle, nothing more.
- **Immutable-file edits.** `notes/decisions/2026-07-08-ai-organization-design.md` is an immutable decision record — the new entry may reference or partially supersede its treatment of Jula AI OS, but must not edit it in place.
- **Follow-up handoff clarity.** The decision entry is the input to three future Plan cycles. It must be precise about what is settled vs. deferred so none of them re-litigate the role question.

## Non-Goals

- **No application code changes of any kind this cycle** — `src/data/projects.ts`, `src/components/sections/Projects.tsx`, `src/app/projects/[slug]/page.tsx`, `src/data/actions.ts`, and every other component / route / data file stay untouched.
- No removal of the Jula AI OS card — that is follow-up (i).
- No design or build of the umbrella / system-overview area — that is follow-up (ii).
- No new page, route, component, or slug.
- No styling or visual-distinction work; the linked-vs-unlinked question is recorded as moot, not worked on.
- No edits to `docs/business-os-manifesto.md` or `docs/capability-map.md`; the inconsistency is flagged as follow-up (iii).
- No edits to `notes/decisions/2026-07-08-ai-organization-design.md`.
- No rewrite of the Projects section wording — only a flag to revisit it in follow-up (i).
- Not deciding AI Command Center's own project-vs-dashboard status.
- No renaming of "Jula AI OS", "Business OS", "AI Command Center", or "AI Organization".
- No new `src/data/actions.ts` Next Action entry (an Act-stage call if warranted; carried as retro Next Actions instead).

---

**Approval gate:** Do may not act on this plan until the human explicitly approves it. All clarifying questions are answered; what remains is the go-ahead to produce the decision entry and the `slug-project-pages.md` update.
