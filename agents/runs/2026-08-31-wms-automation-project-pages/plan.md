# Plan — WMS and Automation project pages (third use of the [slug] routing pattern)

## Revision note

This plan was revised after the human answered all nine original Open Questions. All nine are now
resolved (see "Resolved Decisions" below, which replaces the original Open Questions section).
Scope, Steps, and the locked-in description/slug/status text below reflect those answers exactly.
No implementation has happened — this revision only updates the plan document itself, per the
coordinator's instruction. The plan still requires the human's explicit approval before Do may act.

## Anti-Fabrication Protocol (carried forward from the Store Care Program and CRM cycles)

Restated here because the human's own answer explicitly reaffirmed it for this cycle:

- Do must not add features, modules, dashboards, metrics, workflows, user roles, roadmap items, or
  implementation status beyond the exact locked-in description text for WMS and Automation below.
- Automation's answer explicitly notes that "some technical exploration exists in the repo" (the
  `automation/` directory), but the shipped business project page must **not** describe that
  existing technical work as if it were the confirmed scope, users, or implementation status of the
  Automation *project area* — the human was explicit that the business scope, users, workflows,
  metrics, and implementation plan remain unconfirmed, and status stays `"Idea"` regardless of what
  technical exploration already exists. The locked-in Automation description below deliberately
  stays at the same level of generality as CRM's and WMS's — it does not name `automation/`, Gmail,
  Drive, or any other existing technical detail.
- If anything about WMS's or Automation's content is ambiguous beyond what's locked in below, Do
  must stop and ask rather than infer or extrapolate.

## Goal

Give WMS and/or Automation real, linked project pages at `/projects/<slug>`, reusing the `[slug]`
dynamic route pattern exactly as built by the Store Care Program cycle
(`agents/runs/2026-08-24-project-pages/`) and reused unchanged by the CRM cycle
(`agents/runs/2026-08-28-crm-project-page/`), documented in
`notes/architecture/slug-project-pages.md`. This is expected to be a data-only change to
`src/data/projects.ts` — no changes to `Projects.tsx` or `src/app/projects/[slug]/page.tsx` unless
something genuinely doesn't generalize (which would itself be a signal to stop and ask, not
improvise).

This plan cannot lock in content yet. Plan does not have human-confirmed answers for what WMS or
Automation actually are, their real current status, or any description text — per the
Anti-Fabrication Protocol both prior cycles established, none of that may be invented. This plan's
job is to define the mechanical scope and process, and surface the open questions Do needs answered
before any implementation can start. It mirrors the shape of the CRM cycle's *original*
(pre-revision) plan, not its revised one — the revision only happened after the human answered CRM's
open questions, which hasn't happened yet here.

## Scope

**Recommendation: cover both WMS and Automation in this one cycle, not two separate cycles.**
Reasoning:
- The mechanical work is proven, zero-code-change, and identical in shape for any number of slugged
  projects (confirmed twice now) — there's no implementation-complexity reason to split.
- Both projects currently have the same problem (thin, unconfirmed one-liners, no slug), and both
  need the same kind of human input (what it's for, real status, description, slug name, depth) — so
  the question-gathering step is naturally the same conversation either way.
- Splitting into two cycles would mean asking the human the same category of questions twice, with
  overhead (a second full Plan/Do/Check/Act loop) that doesn't map to any real risk being managed.

**Confirmed: cover both WMS and Automation in this cycle** — the human approved doing both, on the
explicit condition that implementation stays a `projects.ts` data edit only. If Do discovers that
adding either requires new route/component changes or additional decisions, Do must stop and ask
before improvising, per the human's own instruction.

**In scope this cycle:**
- Add `slug: "wms"` and `slug: "automation"` to the existing entries in `src/data/projects.ts`.
- Replace each entry's `description` with the exact locked-in text below.
- Set both `status` fields to `"Idea"` (Automation changes from its current `"Planned"` placeholder
  to the human-confirmed real value, `"Idea"`; WMS stays `"Idea"`).
- Let each card become a real link automatically via the existing conditional `Link` wrap in
  `Projects.tsx` (no code change expected).
- Let `/projects/wms` and `/projects/automation` render via the existing dynamic route (no new route
  file expected).
- Verify both new pages render correctly and nothing regresses (existing Store Care Program and CRM
  pages, and 404 behavior for unknown slugs).

**Out of scope this cycle:**
- Jula AI OS — confirmed to stay unlinked for now; it's an umbrella/system-level concept, not a
  normal project page, and its role is a separate future decision.
- Any actual WMS or Automation system functionality (data models, integrations, persistence,
  dashboards) — these remain honest, thin project-intent pages, same posture as Store Care Program
  and CRM.
- Visual distinction between linked and unlinked cards — confirmed out of scope; card design/styling
  stays unchanged this cycle, even though only Jula AI OS will remain unlinked afterward.
- Updating `src/data/actions.ts`'s "Turn Projects into real project pages" entry — per both prior
  cycles' established convention, updating it to reflect this cycle's outcome is an Act-stage
  decision, not Plan's or Do's to make mid-cycle.

## Locked-in content (confirmed by the human — use exactly as given)

**WMS:**
- **Slug:** `"wms"`.
- **Status:** `"Idea"` (confirmed, unchanged).
- **Description (verbatim, do not paraphrase or embellish):**
  > "WMS is a project area for defining how Jula's Herb tracks inventory, stock movement, stock
  > accuracy, and location-based inventory across warehouse and retail-related stock locations more
  > systematically. The exact users, workflows, metrics, and implementation plan are not confirmed
  > yet."

**Automation:**
- **Slug:** `"automation"`.
- **Status:** `"Idea"` (confirmed — changes from the current placeholder `"Planned"`).
- **Description (verbatim, do not paraphrase or embellish):**
  > "Automation is a project area for defining how Jula's Herb can use AI, workflow automation, and
  > internal tools to reduce repetitive work, improve follow-up, and support business operations
  > more systematically. The exact users, workflows, metrics, and implementation plan are not
  > confirmed yet."
- **Explicitly excluded from shipped content:** any reference to the existing `automation/`
  directory, Gmail/Drive integrations, or other already-built technical work as if it were part of
  the confirmed project scope or status — the human was explicit that existing technical exploration
  does not change the business project's status from `"Idea"` or imply a more definite scope than the
  locked-in description states.

**Content depth (both):** thin pattern, identical in shape to Store Care Program's and CRM's pages —
project name, status badge, the description above, and the existing generic "Current status: this
project is at the idea and early planning stage. No system has been built for it yet." statement
(already produced automatically by the route for any `status === "Idea"` project — no new copy
needed). No additional sections.

## Steps

All nine Open Questions are now resolved (see "Resolved Decisions" below); the mechanical steps
mirror both prior cycles exactly:

1. **Lock in content.** Done by this revision — see "Locked-in content" and "Resolved Decisions"
   above.
2. **Update `src/data/projects.ts`.** Add `slug` and replace `description` (and `status`, if it
   changes) for each project in scope, using only the locked-in text — no paraphrasing, no
   embellishment, no filling in unconfirmed detail.
3. **Confirm no other files need to change.** Per the proven pattern, `Projects.tsx` and
   `src/app/projects/[slug]/page.tsx` should require zero edits. Do should verify this holds once
   `projects.ts` is edited; if it doesn't, that's a signal to stop and ask, not to improvise new
   structure.
4. **Verify.** Run `npm run build` and `npm run lint`; manually check each new page renders the
   locked-in description, correct status badge, and (if status is `"Idea"`) the automatic "idea
   stage, not yet built" banner — with no content beyond what was explicitly locked in. Confirm each
   card on the homepage is now a real link. Confirm an unrelated unknown slug still 404s (regression
   check).
5. **Update `README.md`'s "You should see…" walkthrough**, only if it becomes inaccurate.
6. **Write the changelog**, documenting the exact `projects.ts` diff and confirming no other files
   changed (or documenting why, if step 3's caveat triggered).

**Verification note (for Check):** same anti-fabrication verification as both prior cycles — literal
comparison of shipped description against the plan's locked-in text, plus a grep of source and built
HTML output for anything that shouldn't be there (any background context the human gives while
explaining "what is this for" that wasn't explicitly approved for shipping, the same trap the CRM
cycle hit and correctly avoided).

## Risks

- **Background-context leakage, same failure mode as CRM (primary risk this cycle).** Automation's
  answer explicitly mentioned that "some technical exploration exists in the repo" — that is
  background context confirming *why* status stays `"Idea"` despite existing work, not approved
  shipped content. Do must not describe the `automation/` directory, Gmail/Drive integrations, or any
  other existing technical detail on the shipped page. See Anti-Fabrication Protocol above.
- **Thinness is not a defect** (carried forward from both prior cycles) — a short, honest description
  plus the automatic status banner is the expected shape, not something to pad out.
- **Route/data coupling** (same structural note as both prior cycles) — a third and fourth slugged
  project add no new risk, since the route/component code already generalizes across any number of
  slugged projects; this has now been empirically confirmed twice.
- **Scope-collapse condition, confirmed by the human.** If implementing either WMS or Automation
  turns out to require anything beyond a `projects.ts` data edit (new route/component logic, or an
  unresolved ambiguity), Do must stop and ask rather than improvise — this was an explicit condition
  of the human's approval to do both projects in one cycle, not just a general precaution.

## Resolved Decisions

All nine original Open Questions are now resolved by the human's answers:

1. **What WMS is actually for:** tracking inventory across warehouse and retail-related stock
   locations more systematically — improving visibility of stock movement, stock accuracy,
   location-based inventory, and inventory follow-up between warehouse operations and business teams.
   Exact users, workflows, metrics, and implementation plan remain unconfirmed and are not to be
   invented.
2. **What Automation is actually for:** the broader intended automation project area, not only the
   existing `automation/` directory — using AI, workflow automation, and internal tools to reduce
   repetitive work, improve follow-up, and support business operations more systematically. The
   existing automation work in the repo informs context only; it is not itself the confirmed shipped
   scope (see Anti-Fabrication Protocol above).
3. **Real current status for each:** both `"Idea"`. Automation changes from its current placeholder
   `"Planned"` to `"Idea"` — confirmed accurate by the human even though some technical exploration
   already exists, because the shipped *business project* scope is not yet confirmed.
4. **Description text for each:** use the exact text under "Locked-in content" above, verbatim — not
   reworded, not expanded.
5. **Slug names:** `"wms"` and `"automation"` — confirmed.
6. **Content depth for each:** thin pattern, identical in shape to Store Care Program's and CRM's
   pages (name, status, description, automatic "not yet built" statement) — no additional sections.
7. **Cycle scope:** do both WMS and Automation in this cycle, conditional on implementation staying a
   `projects.ts` data edit only (see "Scope-collapse condition" risk above).
8. **Jula AI OS:** stays unlinked for now — confirmed as an umbrella/system-level concept, not a
   normal project page. Its role is a separate future decision, out of scope this cycle.
9. **Linked vs. unlinked card UX:** no visual styling change this cycle — confirmed acceptable that
   only Store Care Program, CRM, WMS, and Automation are links while Jula AI OS remains unlinked.

## Non-Goals

- No content beyond the exact locked-in WMS and Automation description text above — see
  Anti-Fabrication Protocol.
- No Jula AI OS page or slug this cycle — confirmed to stay unlinked; its role is a separate future
  decision.
- No visual distinction between linked/unlinked cards this cycle — confirmed out of scope.
- No actual WMS or Automation system functionality (inventory data models, workflow engines,
  integrations, persistence, dashboards) — pages describe project intent only, same posture as Store
  Care Program and CRM.
- No changes to `Projects.tsx` or `src/app/projects/[slug]/page.tsx` structure/logic expected — the
  existing generic implementation should handle a third and fourth slugged project without
  modification; any deviation from that expectation is a stop-and-ask signal, not something to
  improvise around.
- No editing of the `src/data/actions.ts` "Turn Projects into real project pages" entry — updating it
  to reflect this cycle's outcome is an Act-stage decision, per both prior cycles' established
  convention.
- No new dependencies, no MDX/CMS — content stays in TypeScript/JSX, consistent with the rest of the
  app.
- No changes to Store Care Program's or CRM's existing entries in `projects.ts`.

---

**Do may not act on this plan until the user explicitly approves it.**
