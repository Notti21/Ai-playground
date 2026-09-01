# Jula AI OS's Role in the AI Command Center

**Date:** 2026-09-01
**Status:** Accepted
**Cycle:** `agents/runs/2026-09-01-jula-ai-os-role/`

## Context

"Jula AI OS" has existed as the first card in the AI Command Center's Projects grid
(`src/data/projects.ts`) since before the slug-based project-page pattern was built. It is
described there as *"The umbrella system connecting agents, projects, and tools into one operating
model"* with status `"In progress"` — the only one of the five Projects cards not at status
`"Idea"`, and the only one still without a linked page after CRM, WMS, Automation, and Store Care
Program all got one.

Four prior PDCA cycles (`2026-08-24-project-pages`, `2026-08-28-crm-project-page`,
`2026-08-31-wms-automation-project-pages`) each explicitly deferred deciding what Jula AI OS is and
how it should be represented, treating it as "an umbrella/system-level concept, not a normal
project" but never recording a decision. The WMS/Automation retro carried this forward as Next
Action #2: "Decide Jula AI OS's role — still undecided, carried forward a third time."

There was also an unresolved naming overlap, documented in this cycle's
`current-state-brief.md`:

- `src/data/projects.ts` calls Jula AI OS "the umbrella system … one operating model."
- `docs/business-os-manifesto.md` calls **Business OS** "the operating model, not the screen," and
  calls **AI Command Center** "one dashboard *into* Business OS, not Business OS itself."
- `docs/capability-map.md:49` lists **both** "Jula AI OS" and "AI Command Center" as *Projects*,
  while also defining AI Command Center under the *Dashboards* capability.
- No file defined what "Jula" / "Jula's Herb" is, or stated that "Jula AI OS" is a Jula-specific
  instance of "Business OS."

This decision resolves what Jula AI OS is and how it should be represented. It does not build or
style any UI — implementation is deferred to the follow-up cycles listed below.

## Decision

**Jula AI OS is the Jula-specific instance of Business OS** — the Business OS concept (the
operating model for running a company: structured thinking, reusable workflows, compounding
knowledge, PDCA agents) applied to Jula's Herb. It is **not a peer project** alongside CRM, WMS,
Automation, and Store Care Program. Those are areas the system is *applied to*; Jula AI OS is the
umbrella operating model *above* them, and AI Command Center is the dashboard/interface into it.

Concretely:

1. **Jula AI OS will be removed from the Projects grid as a normal project card.** It does not
   belong in a section whose stated purpose is "what the system is being applied to" — it is the
   system, not an application of it. (Removal is follow-up **(i)**, a separate Plan/Do cycle — not
   done by this cycle.)

2. **Jula AI OS will later be represented as an umbrella / system-overview area elsewhere in the
   app** — a place that describes the operating model itself and the app's hierarchy and direction,
   distinct from the peer-project cards. (This is follow-up **(ii)**, a separate Plan/Do cycle. Its
   location, shape, and content are deliberately not decided here.)

3. **The `"In progress"` status is accurate but is reinterpreted.** It means the overall Business
   OS / Jula AI OS operating model is being built progressively through its modules and workflows
   (the PDCA agent org, the knowledge base, the capability map, this dashboard, and the project
   areas as they are defined). It does **not** mean there is a finished Jula AI OS product, a
   completed system, or a page describing one.

4. **Audience.** Any future Jula AI OS representation is for the operator (the human) and internal
   Jula's Herb management for now. It may support teams later, but the current audience is internal
   and management-oriented — an honest internal system overview, not an external product brief.

5. **Hard content constraint (Anti-Fabrication Protocol).** Any future Jula AI OS representation
   must not invent features, modules, users, workflows, metrics, dashboards, automations, roadmap
   items, or a product surface that does not exist. It exists to clarify the app's hierarchy and
   direction honestly — the same "never fabricate" rule the manifesto (`business-os-manifesto.md`
   principle 8) and the slug-project-pages Anti-Fabrication Protocol already impose on project
   descriptions, applied here to a system-overview area.

## Options considered

- **(a) Give Jula AI OS a normal thin project page** (add `slug: "jula-ai-os"`, same
  `/projects/<slug>` page as CRM/WMS/Automation). *Rejected:* it would cement Jula AI OS as a peer
  of the things it is actually the umbrella over, and the "peer project" framing is precisely what
  the human identified as wrong.

- **(b) Build an umbrella / system-overview page or area** describing the operating model itself.
  *Chosen as the later direction*, but not as a card in the Projects grid, and not this cycle.

- **(c) Leave it as a plain unlinked card indefinitely.** *Rejected:* it keeps a misleading peer
  framing and leaves the four-cycle deferral unresolved. "Do nothing yet" is only acceptable if
  recorded as a decision with a reason — which is what this entry does, while still setting a
  direction.

- **(d) Remove it from the Projects grid.** *Chosen as the immediate step*, paired with (b) later.

The decision is **(d) now + (b) later**.

## What this does NOT decide

- **How the card is removed** — the exact `projects.ts` edit, and whether `Projects.tsx`'s `.map()`
  / layout / any empty-state assumptions still hold with four cards instead of five. That is
  follow-up (i).
- **Where the umbrella / system-overview area lives, what shape it takes, or what it contains** —
  a new route, a section on the homepage, a link out to `docs/business-os-manifesto.md` and
  `docs/capability-map.md`, or something else. That is follow-up (ii).
- **Whether the Projects section's heading and description** ("What the system is being applied
  to" / "The real business systems this operating model is meant to build and run") need rewording
  once Jula AI OS is gone. Likely fine as-is, but to be confirmed in follow-up (i).
- **AI Command Center's own status** as project-vs-dashboard (the capability map lists it as both).
  Explicitly out of scope for this cycle — see follow-up (iii).
- **The visual distinction between linked and unlinked cards** (WMS/Automation retro Next Action
  #3). See Consequences — this is now largely moot.

## Consequences

- **The four-cycle deferral of "what is Jula AI OS" is resolved.** Future cycles reference this
  entry instead of re-opening the question.

- **Two implementation follow-ups are created**, each needing its own Plan/Do cycle:
  - **(i)** Remove the Jula AI OS card from the Projects grid; verify `Projects.tsx` layout still
    holds with four cards; confirm whether the Projects section wording needs a tweak.
  - **(ii)** Build an umbrella / system-overview representation of Jula AI OS elsewhere in the app —
    internal/management audience, no invented content.

- **One docs-reconciliation follow-up is created:**
  - **(iii)** `docs/capability-map.md:49` lists both "Jula AI OS" and "AI Command Center" as
    *Projects*. Given this decision (Jula AI OS = the operating model, not a project) and the
    manifesto's treatment of AI Command Center as only a dashboard, that Projects list is now
    inconsistent with both. Per the capability map's own rule ("changes to this map should happen
    through a new entry in `notes/decisions/`"), reconciling it needs its own decision entry. This
    cycle does **not** edit `capability-map.md` or `business-os-manifesto.md`.

- **The linked-vs-unlinked card visual-distinction question is now largely moot.** Jula AI OS was
  the only unlinked card; once follow-up (i) removes it, all remaining Projects cards are links, so
  there is no linked/unlinked mix to distinguish. A future cycle should not re-raise this as an
  open UX question.

- **`notes/decisions/2026-07-08-ai-organization-design.md`** lists "Jula AI OS" among "Projects
  (CRM, WMS, Automation, Jula AI OS, AI Command Center) … not agents — they are what the loop is
  applied to." That file is an immutable decision record and is **not edited**. This entry refines
  the treatment of Jula AI OS specifically: it is still "not an agent," but it is the operating
  model the loop runs *within*, not a project the loop is applied *to*. Where the two entries
  differ on Jula AI OS's classification, this one is the later ruling.

- **`notes/architecture/slug-project-pages.md`** is updated by this cycle (it is a living document)
  to point its open "whether Jula AI OS should ever get a real page" question at this decision, and
  to record the linked/unlinked question as moot.
