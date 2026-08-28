# Plan — Turn Projects into real project pages (vertical slice: Store Care Program)

## Revision note

This plan was revised after the human answered the original Open Questions. The scope pivoted
significantly: rather than choosing among the four existing project cards, the human is adding a
**new, fifth project** — "Store Care Program" — and this cycle builds *only* that project's real
page as a vertical slice, to prove out the routing/data pattern before any of the four existing
cards (CRM, WMS, Automation, Jula AI OS) get pages in later cycles. All decisions below reflect
that direction; see "Resolved Decisions" for exactly what was settled and by whom.

## Human Directive: Anti-Fabrication Protocol

The human issued this as an explicit, stricter operating rule before approving this plan, on top
of everything else recorded here. It applies specifically to anything touching Store Care
Program's business content, and it does **not** relax or override the already-decided small
implementation details recorded in "Resolved Decisions" below (URL shape, back-link style) — those
are settled and Do should proceed on them without re-asking.

This cycle sets a direction for the app, not just a small UI addition. For anything about Store
Care Program specifically — business workflow, project status, user roles, metrics, features,
roadmap, or how the app should behave — Do must:

- Not invent details.
- If the source is not already in the repo, or not explicitly provided by the human, ask before
  writing it.
- Use honest placeholders only where details are not confirmed.
- Stay focused on establishing the routing/page pattern plus one Store Care Program placeholder
  page — not a full Store Care product spec.
- Not add fake metrics, fake modules, fake workflows, fake statuses, or fake user roles.
- If there is any ambiguity about a piece of content or behavior, stop and ask the human before
  implementing that specific part, rather than deciding it unilaterally the way minor presentation
  details (e.g. icon choice) were left to Do's judgment elsewhere in this plan.

## Goal

Add a new "Store Care Program" entry to the Projects section and give it a real, linked page under
`projects/ai-command-center/src/app/`, using a dynamic, data-driven route
(`src/app/projects/[slug]/page.tsx`) — establishing the routing/data pattern that future cycles
will extend to CRM, WMS, Automation, and Jula AI OS, without building those other four pages now.

## Scope

**In scope this cycle:**
- Add "Store Care Program" as a fifth entry in `src/data/projects.ts`, with a real, honest
  description and status (see Steps).
- Extend the `Project` data shape with an optional `slug` field (only set on Store Care Program
  for now — see Risks/Resolved Decisions for why it must be optional, not required).
- Build the dynamic route `src/app/projects/[slug]/page.tsx`, driven by `projects.ts`, using
  `generateStaticParams` (derived from whichever projects have a `slug`) and a real `notFound()`
  for any slug that doesn't resolve to a project.
- Build Store Care Program's page content: status, full description, and an honest "what exists
  today" statement (idea / early planning stage, not yet built as a system) — no invented
  features, metrics, roadmap items, or links to `agents/runs/` cycles that don't exist for this
  project.
- Make Store Care Program's card in `Projects.tsx` a real link to its page. The other four cards
  (Jula AI OS, CRM, WMS, Automation) stay exactly as they are today — plain, unlinked cards — since
  they have no `slug` and no page yet.
- Add a simple way back from the project page to the home page (see Resolved Decisions — URL
  shape / back-link).
- Update `projects/ai-command-center/README.md`'s "You should see…" walkthrough only if it becomes
  inaccurate as a result of this change (e.g. if it enumerates the Projects section's cards by
  name/count in a way this addition would break — needs checking, not assumed).

**Out of scope this cycle:** CRM, WMS, Automation, and Jula AI OS pages — explicitly deferred (see
Non-Goals). No change to those four existing `projects.ts` entries beyond the shared, additive
`slug?` field being available to them (unset, unused, for now).

## Steps

1. **Extend the `Project` interface** in `src/data/projects.ts` with an optional `slug?: string`
   field (optional, not required — see Risks for why: only Store Care Program will have one this
   cycle, and the existing four entries must keep working, and keep rendering as plain cards,
   without one).
2. **Add the Store Care Program entry** to the `projects` array:
   - `name`: "Store Care Program"
   - `description`: the text supplied by the human, used as-is / in spirit, not embellished:
     "Store Care Program is a business project for helping Jula's Herb manage and support retail
     stores more systematically. The goal is to create a clearer operating flow for store
     follow-up, store visit/checklist, issue tracking, sales support, merchandising support, and
     communication between the company and store/frontline teams."
   - `status`: `"Idea"` (matches the existing `Project["status"]` union — no enum change needed;
     honestly reflects "idea / early planning stage, not yet built as a full system").
   - `slug`: a stable, URL-safe slug (e.g. `"store-care-program"`).
   - `icon`: pick a reasonable existing `lucide-react` icon consistent with the other four (Do's
     call — a literal icon choice isn't a decision this plan needs to pre-resolve).
   - Note for Do: the description above is long relative to the other four entries' one-line
     descriptions. Decide during Do whether the card (grid view) shows this full text as-is or a
     shorter summary with the full text reserved for the page body, and document whichever choice
     is made in the changelog — this is a presentation detail, not a scope question. Per the
     Anti-Fabrication Protocol above, any summarization must not introduce claims, framing, or
     detail beyond what the supplied description text already says.
3. **Build the dynamic route** `src/app/projects/[slug]/page.tsx`:
   - Look up the matching project from `projects` by `slug`.
   - If no project matches the `slug` param, call `notFound()` — do not silently render an empty
     or fabricated page for an unknown slug.
   - `generateStaticParams()` returns params only for projects that currently have a `slug` set
     (this cycle: just Store Care Program) — so the route naturally stays a no-op for the other
     four projects until a future cycle gives them a `slug` too.
   - Page content: project name, status badge (reusing the same status vocabulary/style as the
     card), the full description, and an explicit "what exists today" statement making clear this
     is an idea-stage project with no built system yet. No invented roadmap, no invented metrics,
     no links to nonexistent `agents/runs/` history for this project. Per the Anti-Fabrication
     Protocol, this page must contain nothing beyond the description and status the human has
     already supplied plus honest "not yet built" framing — no workflow steps, user roles, module
     names, or feature lists invented to make the page feel fuller.
   - Include a simple link back to the home page (see Resolved Decisions).
4. **Wire up the card link** in `Projects.tsx`: render Store Care Program's card wrapped in a real
   `Link` to `/projects/store-care-program` (or whatever slug is chosen), while the other four
   cards continue rendering exactly as they do today (plain, unlinked). This likely means a small
   conditional in the render (wrap in `Link` only when `project.slug` is present) rather than
   changing how all five cards render uniformly — call this out explicitly in the changelog so
   Check can verify only one of five cards became clickable, not all five or none.
5. **Verify no dead or accidental links**: confirm (by reading the rendered output, not just the
   source) that exactly one of the five cards is a real link, that it points to a route that
   actually resolves (not a 404), and that the other four remain plain, non-interactive cards with
   no stray `href`/`Link` wrapper.
6. **Run `npm run build` and `npm run lint`**; manually verify via dev server that
   `/projects/store-care-program` renders the expected content and that an arbitrary unknown slug
   (e.g. `/projects/does-not-exist`) triggers a real 404, not a blank 200.
7. **Update `README.md`** only if its "You should see…" section is now inaccurate (e.g. if it
   implies a fixed count of project cards) — check first, edit only if actually stale.
8. **Write the changelog**, documenting exactly what changed (new route file, `projects.ts` diff,
   `Projects.tsx` diff, README diff if any) so Check can independently re-derive every claim.

**Verification note (for Check):** Check should specifically verify that no content on the shipped
Store Care Program page or card — no wording, workflow detail, status, role, metric, or feature —
is traceable to anything other than (a) the repo as it exists today, or (b) text the human has
explicitly provided in this conversation (the description quoted in Step 2 and the `"Idea"`
status). Any content that can't be traced to one of those two sources is a fabrication per the
Anti-Fabrication Protocol above and should be treated as a finding, not a stylistic nitpick.

## Risks

- **Fabrication risk (still the primary risk).** Store Care Program is explicitly idea-stage, not
  built. The page must read as an honest "this is a real project, at the idea stage, described
  accurately, with no system built yet" — not a polished feature/product page. No metrics, no
  screenshots, no invented roadmap items, no fabricated "recent activity" for this project. See
  the Anti-Fabrication Protocol above, which the human elevated into an explicit, stricter rule for
  this specific risk.
- **Inconsistent card affordances.** After this cycle, 1 of 5 project cards will be a real link and
  4 will not, while all five will look visually similar (same `Card` component, same hover style
  from `hover:border-accent/50` already present on all cards). This is an intentional, scoped
  tradeoff for the vertical slice, but it does mean a user could reasonably expect any card to be
  clickable and be wrong for four of them. Flagged here explicitly so Do doesn't "fix" this by
  either linking all five (out of scope — the other four have no pages) or removing the hover style
  from the unlinked four (also out of scope, and would touch shared styling used elsewhere).
- **Optional `slug` field design.** Making `slug` optional now, rather than required, is a deliberate
  choice to avoid forcing placeholder slugs onto the four projects that don't have pages yet. The
  tradeoff: `Projects.tsx` and the route need to handle "some projects have a slug, some don't"
  correctly, rather than assuming every project is linkable.
- **Route/data coupling.** The dynamic route depends on `projects.ts` as its single source of
  truth (good, per the manifesto's "one home for every fact" principle) — but this means any
  future change to a project's `slug` (e.g. renaming it) breaks its URL unless handled
  deliberately. Not a blocker for this cycle (only one project has a slug), but worth Do/Check
  being aware of for later cycles.
- **Scope discipline.** Given this cycle explicitly exists to prove the *pattern* with one real
  project, there's a temptation to also stub out routes/pages for CRM, WMS, Automation, or Jula AI
  OS "while we're in here." That's explicitly out of scope — see Non-Goals.

## Resolved Decisions

These were open questions in the original plan; the human resolved most directly, and asked me to
decide the remaining small ones myself and record the rationale here (not re-ask):

- **Which projects get pages this cycle:** Store Care Program only (new, 5th project). CRM, WMS,
  Automation, Jula AI OS are explicitly deferred — human decision.
- **Cycle size:** vertical slice — routing infrastructure plus exactly one real page — human
  decision.
- **Routing approach:** dynamic `src/app/projects/[slug]/page.tsx`, data-driven from `projects.ts`,
  with `generateStaticParams` and a real `notFound()` for unresolved slugs — human decision.
- **Content depth:** honest placeholder/roadmap — status, description, "what exists today" (idea
  stage, not built) — no invented features, metrics, or links to nonexistent history — human
  decision, subsequently reinforced and made stricter by the Anti-Fabrication Protocol above.
- **URL shape** (my decision, as instructed): nest under `/projects/<slug>` (i.e.
  `/projects/store-care-program`), matching the existing "Projects" section name and the exact
  route path the human specified (`src/app/projects/[slug]/page.tsx` implies a `/projects/...` URL
  already) — no separate decision needed here, it falls directly out of the routing approach given.
- **Breadcrumb / back-link** (my decision, as instructed): a single, simple "back to home" link
  at the top of the project page (plain `Link` to `/`), not a full breadcrumb component. Rationale:
  there's only one level of nesting (`/` → `/projects/[slug]`) and only one linked project so far,
  so a breadcrumb trail would be over-engineering for what a single "back" link already solves;
  this matches the manifesto's "keep it simple until forced not to be" principle. A fuller
  breadcrumb pattern can be introduced later if/when more nested pages exist.
- **Card consistency (raised by the coordinator):** the other four cards stay plain and unlinked
  this cycle — explicitly acceptable, not a defect, because only Store Care Program has a page to
  link to. Flagged in Risks above so Do doesn't accidentally wire up dead links for the other four,
  and so Check specifically verifies exactly one of five cards is a real, working link.

These small implementation details (URL shape, back-link style) are settled and are **not**
reopened or made subject to the Anti-Fabrication Protocol's "ask before deciding" rule — that rule
is scoped specifically to Store Care Program's business content and app behavior, not to these
already-agreed presentation/routing mechanics.

## Non-Goals

- No CRM, WMS, Automation, or Jula AI OS pages this cycle — explicitly deferred to future cycles
  once this pattern is proven.
- No actual Store Care Program system functionality (store visit/checklist tooling, issue
  tracking, forms, persistence, etc.) — the page describes the project honestly at idea stage; it
  does not build any part of the described operating flow.
- No invented roadmap, milestones, metrics, screenshots, user roles, modules, workflows, or
  "recent activity" for Store Care Program beyond the description and status given (per the
  Anti-Fabrication Protocol above).
- No new dependencies (no MDX, no CMS) — content is authored directly in TypeScript/JSX, consistent
  with the rest of the app.
- No redesign of the `Card` component or changes to its shared hover/visual styling (used by all
  five cards, only one of which becomes a link).
- No changes to the other four `projects.ts` entries' content, and no `slug` added to any of them
  this cycle.
- No changes to other home page sections (`AgentSystem`, `PdcaStatus`, `Tools`, `KnowledgeBase`,
  `RecentActivity`, `NextActions`) beyond what's strictly needed to link Store Care Program's card.
- No editing of `nextActions` in `src/data/actions.ts` — since this cycle only partially addresses
  that entry (one of five projects gets a page), closing or rewording it is an Act-stage decision
  for a later cycle, not something this plan or Do resolves unilaterally.
- No live/dynamic data fetching for the project page — fully static, driven by `projects.ts` at
  build time, consistent with the rest of the app's static sections.

---

**Do may not act on this plan until the user explicitly approves it.**
