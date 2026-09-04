# Slug-Based Project Pages

A living reference for the reusable pattern behind giving individual `Projects` cards a real,
linked page — first built for Store Care Program (`agents/runs/2026-08-24-project-pages/`), reused
without any code changes for CRM (`agents/runs/2026-08-28-crm-project-page/`), and reused again
without any code changes for WMS and Automation together, in a single cycle
(`agents/runs/2026-08-31-wms-automation-project-pages/`). Update this file as the pattern is reused
or refined; it's a living document, not an immutable decision record.

## The pattern, step by step

### 1. `slug` is an optional field on the shared `Project` type

`src/data/projects.ts` defines `slug?: string` on `Project`. Optional, not required — this is what
makes incremental rollout cheap: Store Care Program, CRM, WMS, and Automation now all have `slug`
set, and a project without one just omits the field, with every piece of downstream logic below
written to treat "no `slug`" as "no page" rather than needing a placeholder value. Every card in
the grid now has a `slug` — Jula AI OS, the last card without one, was *removed* from the grid
(`agents/runs/2026-09-03-remove-jula-ai-os-card/`) per
`notes/decisions/2026-09-01-jula-ai-os-role.md` rather than given a page, since it's the umbrella
operating model, not a peer project.

### 2. The card conditionally wraps itself in a `Link`

In `src/components/sections/Projects.tsx`, each card's content is built once, then wrapped based on
whether `project.slug` is set:

```tsx
if (project.slug) {
  return <Link key={project.name} href={`/projects/${project.slug}`}>{cardContent}</Link>;
}
return <div key={project.name}>{cardContent}</div>;
```

Adding a second, third, or fourth slugged project required zero edits here — the `.map()` over
`projects` already handles any number of slugged/unslugged items.

### 3. One dynamic route serves every slugged project

`src/app/projects/[slug]/page.tsx` looks the project up from the shared `projects` array by
`params.slug`, calls `notFound()` for anything that doesn't match, and renders name, status badge,
and description directly from the data. `generateStaticParams()` filters to
`projects.filter(p => p.slug)`, so only real slugs get prerendered — an unmatched slug still 404s at
request time, which is worth a regression check whenever a new slug is added (confirmed for all three
cycles so far: existing slugs keep rendering, unknown slugs still 404).

### 4. An `"Idea"`-status banner is automatic, not per-project copy

```tsx
{project.status === "Idea" && (
  <p>...idea and early planning stage. No system has been built for it yet...</p>
)}
```

Any project with `status === "Idea"` gets this line for free — Do doesn't write per-project "not
built yet" copy, only the project's own description.

### 5. Adding a project's page is a data-only change

Because of steps 2–4, giving a new project a real page means editing exactly one file:
`src/data/projects.ts` — add `slug: "..."` and, if needed, update `description`/`status`. No route
file, no component change. Verified across all three reuse cycles so far: Store Care Program built
the pattern; CRM's cycle changed only `projects.ts`; the WMS/Automation cycle changed only
`projects.ts` again, this time for two projects at once, confirmed via `git diff --stat` showing zero
changes to `Projects.tsx` or `[slug]/page.tsx`.

### 6. Multiple projects can be added in a single cycle, if their content-gathering shape is identical

The WMS/Automation cycle was the first to add more than one project's page in a single
Plan/Do/Check/Act loop, rather than one project per cycle. This worked cleanly, with no observed
friction: both projects needed the same category of human input (what it's for, real status,
description text, slug name, depth) and the same data-edit shape, so batching the question-gathering
and the implementation avoided running near-identical process overhead twice. The plan carried an
explicit escape valve — "if implementing either project turns out to need more than a `projects.ts`
data edit, stop and ask rather than improvise" — and that condition never triggered. Batching is a
reasonable default when multiple candidate projects share this shape; it's not automatically safe if
a future project needs something the pattern doesn't already generalize (new route/component logic,
non-trivial content depth) — that's still a signal to split cycles or stop and ask.

## Content discipline: the Anti-Fabrication Protocol

This is as much a process pattern as a code pattern, and it's the part most likely to trip up a
future cycle if skipped:

- **Every word of a project's description must trace to an explicit, human-confirmed answer** —
  never inferred, extrapolated, or "filled in to sound complete." No invented features, users,
  workflows, metrics, modules, dashboards, automations, or roadmap items.
- **Background context the human gives while answering "what is this for" is not automatically
  shippable content.** CRM's cycle hit this directly: the human mentioned likely future user groups
  (CRM/marketing, customer service/admin, management) while explaining CRM's purpose, but that was
  explicitly background, not approved for the page. The locked-in description omitted it entirely.
  Automation's cycle hit a related but distinct version of the same trap: the human noted "some
  technical exploration exists in the repo" (the `automation/` directory) as background explaining
  *why* status stays `"Idea"` despite existing work — not as approved shipped content describing that
  existing technical work as the project's confirmed scope or status. Both were caught and excluded.
  Treat "the human said it while talking about the topic" and "the human approved it for the page" as
  two different things — only the latter ships, regardless of whether the background content is
  about future plans (CRM's case) or existing work (Automation's case).
- **Check must verify against the primary source, not the changelog's self-report.** All three
  cycles' Check passes did a literal/normalized-whitespace comparison of the shipped description
  against the plan's quoted locked-in text, and grepped the built HTML output (and, for Automation,
  the full source tree) for anything that shouldn't be there — not just "Do says it's fine."
- **Thinness is not a defect.** A one-sentence description plus the automatic "idea stage" banner is
  the expected shape for an `"Idea"`-status project with limited confirmed content — Do/Check should
  not treat that as something to pad out.

## Non-goals (as built so far)

- No actual product functionality on these pages — no data model, no persistence, no per-project
  features. They are honest, thin descriptions of project intent, not working systems.
- No visual distinction between linked (real page) and unlinked (no page yet) cards. This was an
  open UX question across the first three cycles' retros (1 of 5 cards linked, then 2 of 5, then
  4 of 5 — only Jula AI OS unlinked). It is now **moot**: per
  `notes/decisions/2026-09-01-jula-ai-os-role.md`, Jula AI OS — the only unlinked card — was
  removed from the grid (`agents/runs/2026-09-03-remove-jula-ai-os-card/`), not given a page. Every
  remaining card is a link, so there is no linked/unlinked mix to distinguish. A future cycle
  should not re-raise this.
- No card-vs-page description split — all three cycles used the same description text in the card and
  on the page, since the content was already short. Revisit if a future project's page content needs
  to be longer than what reads well on a card.
- Jula AI OS's role is **decided** — see `notes/decisions/2026-09-01-jula-ai-os-role.md`. It is
  the Jula-specific instance of Business OS (the umbrella operating model), not a peer project, so
  it was removed from the Projects grid (`agents/runs/2026-09-03-remove-jula-ai-os-card/`) rather
  than given a slug/page. It is represented instead by the "System Overview" homepage section
  (`agents/runs/2026-09-04-jula-ai-os-system-overview/`), which states the hierarchy — Jula AI OS
  as the operating model, AI Command Center as the dashboard into it, the project areas as what it
  is applied to. This pattern does not apply to it.

## Reference implementation

`projects/ai-command-center`: `src/data/projects.ts` (the `Project` type and slugged entries),
`src/components/sections/Projects.tsx` (card + conditional `Link`), `src/app/projects/[slug]/page.tsx`
(dynamic route). Cycle history: `agents/runs/2026-08-24-project-pages/` (pattern built, Store Care
Program), `agents/runs/2026-08-28-crm-project-page/` (pattern reused, CRM, zero code changes),
`agents/runs/2026-08-31-wms-automation-project-pages/` (pattern reused again, WMS and Automation
together in one cycle, zero code changes).
