# Checkpoint — Store Care Program: Tech Stack Chosen (Build Sequence Unblocked)

**Date:** 2026-09-09

## 1. What was completed

Store Care Program has an **accepted tech-stack decision**:
`notes/decisions/2026-09-09-store-care-program-tech-stack.md` (Status: Accepted). This is
**Phase 0** of the phased plan in
`agents/runs/2026-09-08-store-care-program-mvp-definition/plan.md` Part 3 — the last gate
before build cycles. With the MVP definition (Accepted 2026-09-08), the operational workflow
(Accepted 2026-09-08), and now the stack all settled, the project scaffold + first vertical
slice cycle is unblocked.

This is the **first tech-stack decision recorded in the repo** and the first
`notes/decisions/` entry that will lead to a new `projects/` subfolder. Until now the only
stack in the repo was AI Command Center's (a deliberately backend-less, auth-less Dashboards
surface).

The cycle (`agents/runs/2026-09-09-store-care-program-tech-stack/`) was a Plan cycle with a
human answer gate:

- **Plan:** restated the MVP + workflow requirements as ten testable evaluation criteria
  (EC1–EC10); broke "the tech stack" into **five separable sub-decisions** (structure,
  framework, database, auth, hosting), each with 2–4 real options weighed against the criteria
  and the manifesto principles; carried the MVP plan's Option A / B / C into those
  sub-decisions; and produced a filled draft decision record.
- **Human:** answered 4 of 6 gating questions (data residency, existing accounts, maintainer
  model, budget). The four converged cleanly on **Option C**. Then confirmed the two
  still-provisional items (UI language, auth mechanism) and approved.
- **Do:** wrote the decision record verbatim-in-substance from the approved draft, with both
  provisional spans resolved to the human's choices, and changed nothing else.

No application code, no scaffold, no `projects/store-care-program/` folder, no `package.json`,
no dependency install, no Supabase / Vercel account creation, no commit (the human commits
separately).

## 2. The decision (summary — full record is the decision doc)

Store Care Program v1 pilot is built as:

1. **Structure:** a new app at `projects/store-care-program/`, separate from AI Command Center
   (capability-map boundary — Business Applications live in their own `projects/` subfolders,
   off the Dashboards surface).
2. **Framework:** Next.js App Router + React + Tailwind, matching AI Command Center (Next 16 /
   React 19 / Tailwind v4), `lucide-react`, the CSS-variable theme pattern. Mobile-first via
   Tailwind responsive utilities. **User-facing UI is Thai-only** for v1 (hardcoded Thai
   strings, a Thai-covering webfont, no i18n library); code, identifiers, schema, and
   technical docs stay in English. Bilingual later = additive (`next-intl` + locale switch).
3. **Database:** managed Postgres via **Supabase** (bundles Postgres + Auth + object storage
   for later photo attachments), nearest region. **Fallback:** Neon Postgres + Auth.js.
   Portability guard (either way): schema in in-repo migrations owned by this project + a
   documented one-command `pg_dump` export from the first slice — this is what makes a managed
   provider pass manifesto principle 7 (tool-agnostic / no lock-in).
4. **Auth:** **Google sign-in restricted to the approved Jula Google Workspace domain** (via
   Supabase Auth's Google provider, or Auth.js under the Neon fallback). No password store, no
   email service. A pilot user outside the domain switches the mechanism to magic-link or a
   hardcoded list — **enforcement unchanged**. Enforcement: a two-value `role`
   `{operational, management}` + one **server-side** guard — `operational` performs every
   workflow mutation and status transition; `management` gets the read-only cross-store issue
   view only. No RBAC, no permission matrix, no per-store scoping. First slice exercises only
   the `operational` path; schema + guard know both roles from the start.
5. **Hosting:** **Vercel** (Next.js-first, git-push deploy, preview URLs, free/low tier fine
   for a pilot) + the managed Postgres from (3), nearest region. No VPS ops.

Options: **A** (extend AI Command Center) rejected — couples Dashboards with Business
Applications, adds auth to an app built without it. **B** (new folder + self-hosted DB/auth +
VPS) rejected in favour of **C** — the residency / maintainer / budget answers remove every
reason to take on self-hosting's ongoing burden. **C** (new folder + managed Postgres +
managed auth + platform deploy) chosen.

Framework alternatives rejected: plain React SPA + separate API (a second deployable + an API
contract for a ~6-screen pilot); a lighter server-rendered stack (learning cost, no offset);
low-code / no-code (data + logic locked in a proprietary platform — fails manifesto principle
7). Database alternatives rejected: NoSQL / document stores (the data is relational).

**Pilot-scoped.** A production-readiness revisit (hosting, backup cadence, auth hardening
including whether to replace bundled auth with Auth.js, scale) is explicitly anticipated as a
new `notes/decisions/` entry, not an edit to this one.

## 3. Artifacts changed

- `notes/decisions/2026-09-09-store-care-program-tech-stack.md` (new file)
- `notes/checkpoints/2026-09-09-store-care-program-tech-stack.md` (this file)
- `agents/runs/2026-09-09-store-care-program-tech-stack/` (run folder: `plan.md`,
  `changelog.md`, `review.md`, `retro.md`)

## 4. Current git state

Nothing committed this cycle. `HEAD` is still `d2ed51d` ("Define Store Care Program workflow").
The decision record and run folder are untracked pending the human's own commit.

## 5. Outcome

**Pass with notes.** Review verified the decision record matches the approved draft
section-for-section, both previously-provisional spans (UI language, auth mechanism) are
cleanly resolved to the human's confirmed choices with no bracketed placeholder text
remaining, Options A/B rejected and C chosen as planned, and scope is fully respected (no
code, no scaffold, no folder, no install, no account creation, no commit; `git diff --stat`
empty; HEAD unchanged). Three non-blocking notes:

1. The record added a sixth section, "Open items flagged for the scaffold cycle", not present
   in the approved draft. Its four bullets were relocated plan material (three from the plan's
   "Secondary" Open Questions, one from Risks), not invented scope — arguably a useful handoff
   — but a literal deviation from "change nothing else", and no existing decision record
   carries such a section. **Resolved 2026-09-09:** the human directed that the Accepted record
   hold only settled architecture decisions; the section was removed from the decision record
   and its four items moved verbatim to section 8 of this checkpoint. No architecture decision
   changed.
2. The nearest-region check was deferred to the scaffold cycle rather than performed now.
   Defensible (the record flags "e.g. Singapore" for verification rather than asserting an
   unverified region from memory; no sub-decision depends on the exact region) but a small
   divergence from the plan's stated timing.
3. Minor neutral rewordings from the draft (e.g. "if bundling proves undesirable"; plan-
   internal "OQ1/OQ4/OQ5" spelled out as "residency / maintainer / budget answers").

## 6. What this proves

- **When decision inputs genuinely converge, the cycle says so instead of manufacturing a
  trade-off.** The four answered questions (no residency constraint, a maintainer who does not
  want server ops, a small managed-service budget, a Workspace already in place) all pointed
  the same way; every self-hosted fallback lost its rationale. The record states the
  convergence plainly rather than pretending the choice was closer than it was.
- **A "provisional span" in the draft is a clean way to keep momentum without fabricating a
  choice.** Two items (UI language, auth mechanism) were genuinely orthogonal to the
  structural decision and each had a scoped, low-cost fallback. They were marked
  `[PROVISIONAL — ...]` in the draft; the human confirmed them at approval; Do replaced the
  spans verbatim. Parallels the workflow cycle's mid-cycle second answer round — the right
  tool when a cycle's remaining risk is one or two bounded decisions the human can just make.
- **Breaking "the tech stack" into five separable sub-decisions made the choice auditable.**
  Each axis got its own option table and verdict, so it is explicit which axes the human's
  answers actually touched and which were settled on principle. It also let reversibility be
  assessed per-axis: framework is the lowest-regret axis (matches existing team knowledge);
  datastore and hosting are the expensive-to-reverse axes, which is why the decision is
  explicitly pilot-scoped and carries the portability guard.
- **"Simple until forced not to be" held against a managed-service pull.** Auth is one
  provider + one server-side guard + a two-value role — no RBAC library, no permission matrix,
  no per-store scoping, RLS explicitly optional. The decision record's "What this does NOT
  decide" section is the guard against the stack choice sprawling into schema, screens, or
  tooling — those stay the scaffold cycle's work.
- **A managed provider can satisfy the tool-agnostic principle with a concrete, testable
  mitigation, not a vibe.** The portability guard — in-repo migrations + a documented
  one-command `pg_dump` export exercised from the first slice — is what makes Supabase pass
  manifesto principle 7. Without it, the principle would push toward SQLite or self-hosting.

## 7. Lessons / Next Actions

Proposals only — the human selects which becomes the next Plan cycle's goal. Roughly in
priority order.

1. **Scaffold + first vertical slice cycle (Phase 1) — now unblocked, the natural next
   priority.** Plan `projects/store-care-program/` against the approved stack and
   `notes/workflows/store-visit-issue-closure.md`: create the folder + `package.json` +
   Next.js / Tailwind setup mirroring AI Command Center; a `README` with build / run / test
   commands and the documented `pg_dump` export; create and provision the Supabase + Vercel
   accounts; **verify the nearest Supabase / Vercel region** (Review note 2); design the
   database schema for the three entities against workflow §4 (including the back-dated
   activity date vs. system `created_at`, and the owner-identity open item — login user vs.
   free-typed name); wire the domain-restricted Google sign-in + the two-role server-side
   guard; build the first `operational`-path slice. **Confirm the MVP §5 sync edit (item 2)
   has landed before modelling the schema.**

2. **MVP §5 ↔ workflow §4 sync edit (still pending — was the workflow checkpoint's Next Action
   2).** Sync `notes/product/store-care-program-mvp-definition.md` §5 to the workflow doc:
   rename the entity "Visit / Follow-up" → "Store Follow-up", and replace the parent-rule
   wording plus its `[OPEN]` note with the confirmed hybrid rule (Store link mandatory,
   Follow-up link optional). Small; should land before or as the first step of the scaffold
   cycle's schema work.

3. **Decide the fate of the decision record's extra "Open items flagged for the scaffold
   cycle" section (Review Finding 1).** Either accept it as-is (it is a useful handoff and the
   "do not block this decision" heading mitigates misreading), or — for strict fidelity to
   "write verbatim from the draft" — move its four bullets into this checkpoint and out of the
   immutable record. Low stakes; a one-line call for the human.

4. **Fill Q8 (real finding examples) and Q32 (the worked example) in the workflow doc — needs
   human data first.** When the human supplies 5–10 real findings and one real recent
   end-to-end case, a small follow-up pass fills workflow §2's `[OPEN]` finding note and §5's
   stub. Do not fabricate in the meantime.

5. **Business-input gathering (parallel, non-blocking) — the pilot roster is now the urgent
   one.** The domain-restricted Google sign-in assumes every pilot user has a Jula Workspace
   account; the roster gates whether the auth mechanism holds or falls back to magic-link / a
   hardcoded list, so it should be confirmed before the scaffold cycle builds auth. Also
   still open: primary-user job title; pilot scope (store count, retailer / channel, who
   performs visits, visit frequency); current volume / baseline of issues and visits; target
   delivery date.

6. **Re-derive the delivery date and effort estimate.** The MVP plan deferred both until the
   stack landed. It now has. A short estimation pass against the approved stack + the workflow
   doc's step count can produce a first target.

7. **Later: update the `projects/ai-command-center/src/data/projects.ts` Store Care Program
   entry.** Move it off `status: "Idea"` and point its description at the definition +
   workflow + this decision, once the scaffold cycle actually starts implementation. A small
   separate cycle, not triggered by this decision alone.

## 8. Open items / prerequisites for the scaffold cycle

Moved here from the decision record (Review Finding 1) so the Accepted record holds only
settled decisions. None of these are unresolved architecture decisions.

- **Owner identity** — whether an Issue/Action owner is a login user or a free-typed name
  (workflow §7 open item). A schema decision for the scaffold cycle; the chosen stack supports
  either.
- **MVP §5 ↔ workflow §4 sync edit** must land before schema modelling (see item 2 above and
  `notes/checkpoints/2026-09-08-store-care-workflow-definition.md` Next Action 2).
- **Pilot roster** — confirm every pilot user has a Jula Workspace account before auth is
  built. If any is external, the mechanism falls back to magic-link or a hardcoded list;
  enforcement is unchanged.
- **Nearest Supabase / Vercel region** — verify against current provider availability during
  the scaffold cycle (the record says "nearest region", e.g. Singapore, pending confirmation).
