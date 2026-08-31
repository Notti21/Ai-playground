# Plan — CRM project page (second use of the [slug] routing pattern)

## Revision note

This plan was revised after the human answered all six original Open Questions. All six are now
resolved (see "Resolved Decisions" below, which replaces the original Open Questions section).
Scope, Steps, and the locked-in description/slug/status text below reflect those answers exactly.
No implementation has happened — this revision only updates the plan document itself, per the
coordinator's instruction. The plan still requires the human's explicit approval before Do may act.

## Anti-Fabrication Protocol (carried forward from the Store Care Program cycle, restated for CRM)

Same rule as governed the Store Care Program cycle, restated here because it directly matters for
one specific exclusion below:

- Do must not invent or add any CRM detail — features, users, workflow, metrics, modules,
  dashboards, automations, or roadmap — beyond the exact description text locked in below.
- **The human's answer to "what is CRM for" included background context — "likely future users may
  include CRM/marketing, customer service/admin, and management" — that is explicitly NOT approved
  shipped content.** The human gave it to inform *why* the locked-in description text reads the way
  it does, not as material to add to the page. The locked-in description text below deliberately
  omits it. Do must not add a "likely users" section, sentence, or list to the CRM page or card
  description under any circumstance this cycle. Including it would be a fabrication-protocol
  violation in the same way inventing features or roadmap items would be, because it was explicitly
  marked as background-only, not confirmed shipped content.
- If anything about CRM's content is ambiguous beyond what's locked in below, Do must stop and ask
  rather than infer or extrapolate — no new open questions remain right now, but this rule still
  applies to anything that comes up during implementation that wasn't covered by the six answers.

## Goal

Give the CRM entry in `src/data/projects.ts` a real, linked page at `/projects/crm`, reusing the
`[slug]` dynamic route pattern established by the Store Care Program cycle
(`agents/runs/2026-08-24-project-pages/`) — using only the exact, human-confirmed content below, and
explicitly not the "likely future users" background context, which is excluded from shipped
content.

## Scope

**In scope this cycle:**
- Add `slug: "crm"` to the existing CRM entry in `src/data/projects.ts` — locked in, not
  conditional.
- Set CRM's `description` to the exact locked-in text below — locked in, not conditional.
- Keep CRM's `status` as `"Idea"` — confirmed unchanged.
- Let the CRM card in `Projects.tsx` become a real link automatically (no code change needed there
  — see "Mechanical steps already proven" below).
- Let `/projects/crm` render via the existing dynamic route (no new route file needed — see below).
- Verify the page renders correctly and that nothing else regresses.

**Out of scope this cycle:** WMS, Automation, and Jula AI OS pages — still deferred, same as the
prior cycle's Non-Goals. No CRM system functionality of any kind (no data model, no persistence, no
actual CRM features) — only an honest, thin project page, same posture as Store Care Program's page.
No "likely future users" content, or any other content beyond the locked-in description text (see
Anti-Fabrication Protocol above).

## Locked-in content (confirmed by the human — use exactly as given)

- **Slug:** `"crm"`.
- **Status:** `"Idea"` (unchanged from today).
- **Description (verbatim, do not paraphrase or embellish):**
  > "CRM is a project area for defining how Jula's Herb manages customer relationships, customer
  > data, follow-up, retention, and repeat-purchase activities more systematically. The exact
  > users, workflows, metrics, and implementation plan are not confirmed yet."
- **Content depth:** thin pattern, identical in shape to Store Care Program's page — project name,
  status badge, the description above, and the existing generic "Current status: this project is at
  the idea and early planning stage. No system has been built for it yet." statement (already
  produced automatically by the route for any `status === "Idea"` project — no new copy needed for
  this). No additional sections, no card-vs-page description split (unlike the option considered for
  Store Care Program, not needed here since this description is already short).
- **Explicitly excluded from shipped content:** any mention of "likely future users" (CRM/marketing,
  customer service/admin, management) — this was background context only, not approved content (see
  Anti-Fabrication Protocol above).

## Mechanical steps already proven (low risk, reusable as-is)

The Store Care Program cycle built `Projects.tsx` to already handle any project with a `slug`
generically:

```tsx
if (project.slug) {
  return <Link key={project.name} href={`/projects/${project.slug}`}>{cardContent}</Link>;
}
return <div key={project.name}>{cardContent}</div>;
```

And `src/app/projects/[slug]/page.tsx` already looks up any project by `slug` from the shared
`projects` array, calls `notFound()` for unmatched slugs, and renders an "Idea" banner
automatically for `status === "Idea"`. This means giving CRM a page requires **no changes to
`Projects.tsx` or the route file at all** — only a `projects.ts` data edit (slug + description, per
"Locked-in content" above). This significantly lowers this cycle's implementation risk relative to
the first cycle, which built the pattern from scratch.

## Steps

1. **Update the CRM entry** in `src/data/projects.ts`:
   - Add `slug: "crm"`.
   - Replace `description` with the exact locked-in text above, verbatim — no paraphrasing, no
     embellishment, no addition of the "likely future users" background context.
   - Leave `status` as `"Idea"` (no change).
2. **No route or component code changes are needed** per "Mechanical steps already proven" above.
   Do should confirm this remains true once editing `projects.ts` (i.e. the existing `[slug]` route
   and `Projects.tsx` render CRM correctly with zero further edits) — if for any reason it turns out
   not to be true, that's a signal to stop and ask, not to improvise new structure.
3. **Verify**: run `npm run build` and `npm run lint`; manually check `/projects/crm` renders the
   locked-in description, status badge, and "idea stage, not yet built" statement exactly — with no
   mention of future users, features, workflow, or metrics anywhere on the page or card. Confirm the
   CRM card on the homepage is now a real link. Confirm an unrelated unknown slug still 404s
   (regression check, since `projects.ts` is shared state).
4. **Update `README.md`**'s "You should see…" walkthrough only if it becomes inaccurate.
5. **Write the changelog**, documenting the exact `projects.ts` diff (slug + description) and
   confirming no other files changed (or documenting why they did, if step 2's caveat triggered).

**Verification note (for Check):** same anti-fabrication verification as the Store Care Program
cycle, plus one CRM-specific check: confirm the shipped CRM description and page contain **no**
mention of "CRM/marketing," "customer service/admin," "management," or any other user/role
language — since that background context was explicitly excluded from shipped content by the human.
Its presence anywhere in the shipped diff should be treated as a fabrication-protocol violation, not
a stylistic nitpick.

## Risks

- **Fabrication risk via the excluded "likely future users" context (primary, CRM-specific risk this
  cycle).** Because the human's own answer to "what is CRM for" mentioned likely future users as
  background, there's a real risk Do treats that as tacitly approved and folds it into the shipped
  description or page "to make it more complete." This plan explicitly forbids that — see
  Anti-Fabrication Protocol and Locked-in content above. Check should specifically look for this.
- **General fabrication risk (same as last cycle).** Beyond the specific exclusion above, no other
  CRM scope, features, workflow, or metrics exist anywhere in the repo or in the human's answers.
  The locked-in description above is the entire content; anything beyond it is fabrication.
- **Status/thinness is not a defect.** The page will legitimately be thin (one confirmed sentence,
  same shape as Store Care Program). Do/Check should not treat that thinness as something to "fix"
  by adding unconfirmed detail.
- **Route/data coupling** (same structural risk noted last cycle) — CRM's `slug` becomes another
  entry depending on `projects.ts` as the single source of truth; no new risk introduced by adding a
  second slugged project, since the route/component code already generalizes across any number of
  slugged projects.

## Resolved Decisions

All six original Open Questions are now resolved by the human's answers:

1. **What CRM is actually for:** CRM should remain a broad business project area, not a fully
   defined product — for organizing how Jula's Herb manages customer relationships, customer data,
   follow-up, retention, and repeat-purchase activities more systematically. The human also
   mentioned likely future users (CRM/marketing, customer service/admin, management) as background
   only — **not approved for the shipped page/description** (see Anti-Fabrication Protocol above).
   Exact users, workflow, features, metrics, and implementation plan remain unconfirmed and are not
   to be invented.
2. **Real current status:** stays `"Idea"` — confirmed unchanged.
3. **Outside source material:** none — the locked-in description above (human-supplied this cycle)
   is the entire current scope, alongside the pre-existing one-liner it replaces.
4. **Page content depth:** thin pattern, identical in shape to Store Care Program's page (name,
   status, description, "not yet built" statement) — no additional sections.
5. **Slug name:** `"crm"` — confirmed.
6. **Description text:** use the exact text under "Locked-in content" above, verbatim — not the
   original one-liner, not reworded, not expanded beyond what's given.

## Non-Goals

- No WMS, Automation, or Jula AI OS pages this cycle — still deferred.
- No actual CRM system functionality (data model, contacts, pipelines, persistence, integrations,
  etc.) — this cycle only ships an honest, thin project description page, not any part of a CRM
  product.
- No "likely future users" content (CRM/marketing, customer service/admin, management) anywhere in
  the shipped description or page — explicitly excluded per the human's own framing of that as
  background context, not approved content.
- No invented roadmap, milestones, metrics, screenshots, user roles, modules, workflows, or "recent
  activity" for CRM beyond the exact locked-in description text above.
- No changes to `Projects.tsx` or `src/app/projects/[slug]/page.tsx` structure/logic — the existing
  generic implementation already handles a second slugged project without modification.
- No editing of the `nextActions` entry in `src/data/actions.ts` ("Turn Projects into real project
  pages") — per the prior cycle's precedent, that's an Act-stage decision for later, not something
  this plan or Do resolves unilaterally, even though this cycle partially addresses it.
- No new dependencies, no MDX/CMS — content stays in TypeScript/JSX like the rest of the app.
- No changes to WMS's or Automation's `projects.ts` entries.

---

**Do may not act on this plan until the user explicitly approves it.**
