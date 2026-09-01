# Change Log — Decide Jula AI OS's role in the AI Command Center

**Cycle:** `agents/runs/2026-09-01-jula-ai-os-role/`
**Date:** 2026-09-01
**Plan:** `plan.md` (finalized, approved by the human 2026-09-01, with all 8 clarifying questions answered)

This was a decision/documentation-only cycle. **No application code was changed** — `git diff` touches
only `notes/` and `agents/runs/`.

## What was done, step by step

### Step 1 — Current-state brief

Created `agents/runs/2026-09-01-jula-ai-os-role/current-state-brief.md`: verbatim quotes, with file
paths, of how the five overlapping concepts (Jula AI OS, Business OS, AI Command Center, AI
Organization, "Personal AI Operating System") are described across the repo today, plus a numbered
list of the six concrete contradictions/gaps between them. No recommendations — supporting evidence
for the decision entry.

Key findings:
- `src/data/projects.ts:13-18` — Jula AI OS card: "The umbrella system connecting agents, projects,
  and tools into one operating model", status `"In progress"`, no `slug`.
- `docs/business-os-manifesto.md:16` — Business OS is "the operating model, not the screen"; AI
  Command Center is "one dashboard *into* Business OS, not Business OS itself."
- `docs/capability-map.md:49` — lists both "Jula AI OS" and "AI Command Center" as *Projects*.
- No file anywhere defines "Jula" / "Jula's Herb" or states that Jula AI OS is a Jula-specific
  instance of Business OS — that link is established for the first time by this cycle's human answers.

### Step 2 — Decision entry

The human answered all 8 clarifying questions at plan-approval time (recorded verbatim in
`plan.md` under "Decisions from the human"). Do did not proceed on assumptions.

Created `notes/decisions/2026-09-01-jula-ai-os-role.md` (Status: Accepted). It records:
- **Decision:** Jula AI OS is the Jula-specific instance of Business OS — the umbrella operating
  model, not a peer project. Direction: **(d) now + (b) later** — remove from the Projects grid as
  a normal card (follow-up i), later represent as an umbrella/system-overview area elsewhere
  (follow-up ii).
- **Options considered:** (a) normal thin project page, (b) umbrella/system-overview area,
  (c) leave as a plain unlinked card, (d) remove from the grid — with why each was accepted/rejected.
- **"In progress" reinterpretation:** the operating model is being built progressively through its
  modules/workflows; not a finished product/page/system.
- **Audience:** the operator + internal Jula's Herb management for now; possibly teams later.
- **Hard content constraint:** any future representation must invent no features/modules/users/
  workflows/metrics/roadmap — Anti-Fabrication Protocol applied to a system-overview area.
- **What this does NOT decide:** removal mechanics, the overview area's location/shape/content, the
  Projects section wording, AI Command Center's own project-vs-dashboard status, the linked/unlinked
  visual question.
- **Consequences / follow-ups:**
  - (i) implementation cycle — remove the card, verify `Projects.tsx` layout holds with four cards,
    confirm whether the Projects section wording needs a tweak.
  - (ii) implementation cycle — build the umbrella/system-overview representation.
  - (iii) docs-reconciliation cycle — `capability-map.md:49` listing both Jula AI OS and AI Command
    Center as Projects is now inconsistent with this decision and the manifesto; per the capability
    map's own rule this needs its own `notes/decisions/` entry. Not touched this cycle.
  - The linked-vs-unlinked card visual-distinction question (WMS/Automation retro Next Action #3) is
    now largely moot and should not be re-raised.
  - `notes/decisions/2026-07-08-ai-organization-design.md` is immutable and NOT edited; the new
    entry notes that where the two differ on Jula AI OS's classification, the new one is the later
    ruling (still "not an agent", but the operating model the loop runs *within*, not a project it
    is applied *to*).

### Step 3 — Living-document update

Edited `notes/architecture/slug-project-pages.md` (3 spots), in place, since it is an explicit
living document:
- §1 optional-`slug`-field aside — replaced "only Jula AI OS, as of this writing" with a note that
  Jula AI OS will be *removed* from the grid, not given a page, per the new decision entry.
- Non-goals, linked/unlinked-cards bullet — replaced the "still an open decision" framing with
  "largely moot per the new decision entry; a future cycle should not re-raise this."
- Non-goals, final Jula AI OS bullet — replaced "remains an open, separate decision" with a pointer
  to the resolved decision.

No change to the intro or the "Cycle history" list — this cycle is not a reuse of the slug pattern.

## Files changed

| File | Change |
|---|---|
| `agents/runs/2026-09-01-jula-ai-os-role/current-state-brief.md` | new — supporting evidence |
| `agents/runs/2026-09-01-jula-ai-os-role/changelog.md` | new — this file |
| `notes/decisions/2026-09-01-jula-ai-os-role.md` | new — the decision record |
| `notes/architecture/slug-project-pages.md` | edited — 3 spots, pointing at the new decision |

## Not done (per plan non-goals)

- No changes to `src/data/projects.ts`, `src/components/sections/Projects.tsx`,
  `src/app/projects/[slug]/page.tsx`, `src/data/actions.ts`, or any component/route/data file.
- Jula AI OS card not removed (follow-up i).
- No umbrella/system-overview area designed or built (follow-up ii).
- No edits to `docs/business-os-manifesto.md` or `docs/capability-map.md` (follow-up iii).
- No edits to `notes/decisions/2026-07-08-ai-organization-design.md` (immutable).
- No Projects section rewording, no renaming of any concept, no new `actions.ts` entry.

## Verification done by Do

- `git diff --stat` — confirmed only the four files above are touched; zero changes under
  `projects/ai-command-center/src/`.
- Re-read the new decision entry against the plan's Step 2 checklist — all required elements present.
- Re-read the three `slug-project-pages.md` edits in context — each still reads coherently and points
  to the correct filename.
