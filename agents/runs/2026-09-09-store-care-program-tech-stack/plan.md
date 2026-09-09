# Plan — Store Care Program: Tech-Stack Decision (Phase 0)

> **Planning deliverable only. Nothing is implemented, scaffolded, installed, or committed
> this cycle.** The human has answered 4 of the 6 Open Questions; the recommendation below is
> now **finalized** to one concrete choice per sub-decision, with **two items still
> provisional** pending the human's confirmation (UI language, auth mechanism). A Do cycle
> writes `notes/decisions/2026-09-09-store-care-program-tech-stack.md` **only after** the
> human confirms those two items and approves the finalized content. The project scaffold and
> the first vertical slice are a **separate later cycle**, not this one.
>
> **Do may not act on this plan until the human explicitly approves it.**

---

## Goal

Choose how the Store Care Program v1 pilot is built — project structure, frontend framework,
persistence/database, auth + role enforcement, and hosting/deploy — and capture the choice as
its own immutable `notes/decisions/2026-09-09-store-care-program-tech-stack.md` entry. This is
Phase 0 of the phased plan in
`agents/runs/2026-09-08-store-care-program-mvp-definition/plan.md` Part 3. It is the last gate
before build cycles can begin.

Store Care Program is the first real line-of-business application (a *Business Applications*
capability, per `docs/capability-map.md`) built under Jula AI OS. The accepted inputs are:

- `notes/product/store-care-program-mvp-definition.md` (Accepted 2026-09-08, committed `c42d0e0`)
- `notes/workflows/store-visit-issue-closure.md` (Accepted 2026-09-08, committed `d2ed51d`)

The "structure before software" prerequisite (manifesto principle 1) is already satisfied —
the process is written down. This cycle picks the software.

---

## Scope

### This cycle covers

- Restating the MVP + workflow requirements as concrete, testable **evaluation criteria**.
- Breaking the stack decision into **five separable sub-decisions**, each with 2–4 real
  options weighed against the criteria and the manifesto principles.
- Carrying forward and sharpening the MVP plan's **Option A / B / C** into those
  sub-decisions.
- Folding the human's answers into a **finalized recommendation** — one concrete choice per
  sub-decision, with the two still-open items clearly marked provisional.
- A **draft `notes/decisions/` entry** with the human's answers filled in and the two
  provisional spans marked, in the format of the existing decision records.
- The **status of the six gating questions** — 4 answered, 2 provisional.

### This cycle does NOT cover

- Writing the decision record itself (Do does that, after approval).
- Any code, scaffold, folder, `package.json`, or dependency install.
- Editing the MVP definition, the workflow doc, the capability map, the manifesto, or any
  other file.
- A delivery-date commitment or an effort re-estimate (that is downstream of an approved
  decision).
- Any commit.

---

## Evaluation criteria (requirements restated as tests)

Derived verbatim-in-intent from the MVP definition (§2, §4, §5, §7) and the workflow doc
(§2, §3, §4). A candidate stack is judged against each.

| # | Criterion | Source | How a candidate passes |
|---|---|---|---|
| **EC1** | Mobile-first responsive web; also usable on a laptop. No native app. No offline mode in v1. | MVP §2; workflow §1 | Every required field enterable one-handed on a phone browser; same app works at a desktop width. No app-store artefact. No service-worker / local-sync infra. |
| **EC2** | Real server-side persistence for 3 record types with their relationships. | MVP §5; workflow §4 | Store `1—*` Store Follow-up; Store `1—*` Issue/Action (**mandatory** FK); Store Follow-up `0..1—*` Issue/Action (**optional** FK); Issue/Action `—1` Owner. Survives reload; not `localStorage`. |
| **EC3** | Minimal 2-role auth: **operational** (does everything) and **management/admin** (read-only, all stores/issues). No granular permissions. No store-staff logins. | MVP §7; workflow §1 | A login mechanism; a 2-value role attribute; a server-side guard that lets only operational write and gives management a read-only view. Nothing more. |
| **EC4** | Internal pilot quality; smallest usable vertical slice; not polished production. | MVP §4; MVP-plan Q12 | Setup and per-screen cost is low; no infrastructure that only pays off at production scale (queues, multi-region, CI matrices, observability stacks). |
| **EC5** | Tool-agnostic / data portable — data exportable, not locked to a proprietary store. | manifesto principle 7; MVP-plan Phase 0 | The data lives in a standard, dumpable format (SQL preferred); a full export can be produced without vendor cooperation; the schema is ours. |
| **EC6** | Standalone. No integration with CRM / WMS / Automation. Sits alongside existing chat/spreadsheet processes. | MVP §4, §9; workflow §1 | No dependency on another project's data or services. No import/sync pipeline. |
| **EC7** | Simple until forced not to be; maintainable over clever; inspectable by whoever maintains it. | manifesto principle 6; `CLAUDE.md` | A person of the maintainer's skill level can read the whole thing and understand it. "Magic" is justified only where it removes real, present work. |
| **EC8** | Derived queries and back-dated dates are cheap. | workflow §2 (back-datable activity date, separate from created-at), §3 (derived "overdue") | "Overdue" = due date past AND status ∉ {Resolved, Cancelled}, computed at read time. Activity date stored separately from a system timestamp. Both are trivial in the chosen store. |
| **EC9** | Does not preclude later additions the workflow already anticipates. | workflow §2 | Optional photo/attachment storage, a structured finding checklist, and a saved-visit-report view can be added later without re-platforming. |
| **EC10** | Thai-language capable. | Open Question 2 | Renders Thai text correctly (font coverage, input); can present a Thai UI if required. Scope of i18n scaffolding depends on the OQ2 answer. |

---

## Sub-decision analysis

The stack decision is **five separable choices**. The MVP plan's Option A / B / C map onto
them like this, and are sharpened here. **The concrete picks after the human's answers are in
the "Finalized recommendation" section below** — the per-sub-decision text here records the
full option comparison that led there.

- **Option A** = sub-decision (i) → *extend AI Command Center*. Rejected at (i); it does not
  reach the other four.
- **Option B** = (i) new folder + (iii) self-hosted DB + (iv) hand-rolled/library auth +
  (v) self-hosted deploy.
- **Option C** = (i) new folder + (iii) managed Postgres + (iv) managed auth + (v)
  platform deploy.

After (i) and (ii) are settled, **B and C differ only on (iii), (iv), (v)**.

---

### (i) Where the app lives / project structure

| Option | Description | For | Against | Verdict |
|---|---|---|---|---|
| **i-A** | Add a backend, DB, and auth to `projects/ai-command-center/`. | One codebase, one deploy, reuse Tailwind + theme pattern + component conventions. | Couples the **Dashboards** capability (a deliberately static, no-backend, no-auth surface — `notes/architecture/theme-toggling.md`: *"no backend or auth yet"*; `2026-09-04-capability-map-ai-command-center-classification.md`) with a **Business Applications** capability whose stated home is *"Future subfolders of `projects/`"* (`docs/capability-map.md`). Adds auth to an app built without it. Makes the dashboard's build/deploy heavier. Breaks EC7 (mixed concerns) and the capability-map boundary. | **Rejected.** |
| **i-B** | New folder `projects/store-care-program/`, its own app, its own deploy, its own `README`. | Matches capability map *"one subfolder per initiative"* and *"Future subfolders of `projects/` (e.g. `projects/crm`, `projects/wms`)"*. Clean capability boundary. Independent lifecycle. The pattern generalises to CRM/WMS later. Keeps the dashboard untouched. | A second scaffold and a second deploy target to run. | **Chosen.** |
| **i-C** | A separate Git repository outside this monorepo. | Maximum isolation; a different maintainer could own it cleanly. | Breaks manifesto principle 3 (one home for every fact) — pulls the app's decisions, runs, and notes out of the shared knowledge base. Loses `agents/runs/` scoping and the compounding-knowledge benefit. More overhead for a pilot. | Rejected — OQ4 answer ("Me + Claude Code PDCA cycles") keeps everything inside this repo. |

**Finalized:** **i-B** — `projects/store-care-program/`. OQ4 ("Me + Claude Code") confirms no
separate-party maintainer, so i-C's only rationale is gone.

---

### (ii) Frontend framework

| Option | Description | For | Against | Verdict |
|---|---|---|---|---|
| **ii-1** | **Next.js (App Router) + React + Tailwind** — same stack as AI Command Center (Next 16, React 19, Tailwind v4). | Zero framework learning cost (EC7); reuse the theme-toggling pattern (`notes/architecture/theme-toggling.md`) and layout conventions. Server Components / Server Actions / Route Handlers let the 3-entity data layer and auth live in the *same* app — no separate API service (EC4). Tailwind responsive utilities cover EC1 directly. Mature i18n options for EC10 (`next-intl`) if OQ2 needs a bilingual UI. Deploys as static-ish + serverless or as a Node server. | Server Actions / RSC add conceptual surface if the maintainer only knows client React. Vendor-adjacent DX pull toward Vercel (mitigated — Next.js self-hosts). | **Chosen.** |
| **ii-2** | **Plain React SPA (Vite) + a small separate API** (e.g. a thin Node/Express or Hono service). | Simple, well-understood client model; no RSC/Server-Action concepts. | Now there are two deployables and an API contract to maintain (EC4 cost goes *up* for a pilot). Auth in a pure SPA (token storage, refresh) is fiddlier than a server-rendered session. Diverges from the one stack the team knows. | Rejected. |
| **ii-3** | **A lighter server-rendered stack** — e.g. SvelteKit, Remix, or an HTML-first / HTMX approach. | Less client JS; arguably more "boring and inspectable" (EC7). | New learning cost; diverges from AI Command Center with no offsetting benefit for a 6-screen pilot. | Rejected. |
| **ii-4** | **Low-code / no-code** (Retool, Budibase, Airtable-as-backend, Glide). | Fastest possible to a working screen. | Hard fail on EC5 (data + app logic locked in a proprietary platform) and EC7 (not inspectable / not ours). Directly contradicts manifesto principle 7. | **Rejected.** |

**Finalized:** **ii-1** — Next.js App Router + React + Tailwind, mirroring AI Command Center,
with `lucide-react` for icons and the existing CSS-variable theme pattern. Thai text uses a
Thai-covering webfont (Noto Sans Thai). i18n approach is **provisional pending OQ2** — see the
Finalized recommendation section.

---

### (iii) Persistence / database

| Option | Description | For (against EC2 / EC5 / EC8) | Against | Verdict |
|---|---|---|---|---|
| **iii-1** | **Managed Postgres** (e.g. Supabase, Neon, Railway, or a cloud RDS). | Relational model fits the 3 entities + mandatory/optional FKs exactly (EC2). Standard SQL → `pg_dump` export, schema is ours (EC5 passes *as long as we own the schema and can dump it*). Date/`now()` comparisons for derived "overdue" are trivial (EC8). Free tiers exist for a pilot; managed backups. Supabase additionally bundles auth + object storage + row-level security, collapsing (iii)+(iv)+(EC9 photos) into one system. | A vendor account and its region/pricing to evaluate against OQ1 (residency), OQ5 (budget), OQ4 (who operates it). Exact provider region availability must be checked at decision time — do not assume. | **Chosen (Supabase).** |
| **iii-2** | **SQLite** (single file, embedded; optionally with Litestream/LiteFS for replication). | The most portable store there is — one file, copy it anywhere (EC5). Zero server to operate (EC7, EC4). Ample for a single-writer, low-volume pilot. Full SQL, same query shapes (EC8). | Concurrent-write ceiling. Hosting must give the app a persistent writable disk — rules out purely serverless hosts unless paired with LiteFS/Turso. Backups are our job. | Rejected — OQ5 allows a managed service, so the ops-free managed Postgres is preferred. |
| **iii-3** | **Self-hosted Postgres** (a container on a VPS we run). | Same relational + export benefits as iii-1 (EC2, EC5, EC8); full control of region; no third-party data processor. | We own updates, backups, monitoring, security patching (EC7 cost rises). | Rejected — OQ1 imposes no residency constraint, so there is no reason to take on server ops. |
| **iii-4** | **NoSQL / document store** (Firestore, DynamoDB, MongoDB Atlas). | Managed, scalable. | The data is relational (FK-enforced parent rules, filter-by-store, derived date queries) — SQL is the natural fit. Proprietary query APIs worsen EC5 lock-in. No upside here. | **Rejected.** |

**Finalized:** **iii-1 with Supabase**, nearest region (e.g. Singapore — confirm against
current Supabase availability when the decision record is written). **Documented fallback:**
**Neon Postgres + Auth.js**, if the human prefers to avoid a bundled provider. Portability
guard (either way): schema in in-repo migrations owned by this project; a documented
one-command full export (`pg_dump`) from the first slice — this is what makes EC5 pass with a
managed provider.

---

### (iv) Auth + role enforcement

Two independent questions: the **mechanism** (how someone proves who they are) and the
**enforcement** (how 2 roles are applied). Enforcement is the same across mechanisms.

**Mechanism options:**

| Option | Description | For | Against | Verdict |
|---|---|---|---|---|
| **iv-1** | **Bundled with the DB provider** — Supabase Auth, using its **Google provider** restricted to the human's Workspace domain (or email magic-link / password). | One system for data + auth + (optional) row-level security. Least glue code (EC4). Google provider needs no password store or email-sending service. | Ties auth to the provider (mitigated — users are just rows; exportable). | **Chosen (Google provider, domain-restricted).** |
| **iv-2** | **Auth.js (NextAuth) with one provider** — Google (Workspace) or email magic-link. | A library, not a vendor (EC5, EC7). Server-rendered session cookies fit ii-1. Works with any DB. | Magic-link needs an email-sending service. Google needs an OAuth app + Workspace (both available — OQ3). | Fallback — paired with the Neon database fallback. |
| **iv-3** | **Hardcoded pilot user list** — a handful of users in config, password hashed, signed session cookie. | Absolute minimum; no external dependency; fully inspectable (EC7). | We own password hashing + session security. No self-serve onboarding. | Fallback — only if a pilot user turns out to be outside the Workspace domain. |

**Mechanism (finalized, provisional pending OQ6):** **domain-restricted Google sign-in** —
restricted to the human's Google Workspace domain (OQ3 confirmed a Workspace exists). The
primary user and management/admin are Jula's Herb staff; store-staff logins are explicitly out
of v1; so Workspace-domain Google sign-in is the lowest-friction fit and needs no password or
email infra. Via Supabase Auth's Google provider (Supabase path) or the Auth.js Google
provider (Neon fallback). **Flag for the human:** this assumes the ~1–3 pilot users all have
accounts in the Workspace domain. If any pilot user is outside it, revisit — email magic-link
or a hardcoded pilot list, enforcement unchanged.

**Role enforcement (mechanism-independent, finalized):**

- A `role` attribute on the user record with exactly two values: `operational`, `management`.
- One server-side authorization guard: **`operational`** may perform every mutation in the
  workflow (create/edit Store Follow-up, create/edit Issue, all status transitions);
  **`management`** gets the read-only cross-store issue view (workflow §1, step 8) and no
  write paths.
- No RBAC library, no permission matrix, no per-store scoping (EC3). Postgres row-level
  security is an *optional* defense-in-depth layer on top of the app guard — not required for
  the pilot.
- The first vertical slice exercises only the `operational` path; the schema and guard know
  about both roles from the start (per the MVP plan's Phase 1 note).

**Note (schema, not a stack blocker):** whether an Issue/Action **owner** must be a login
user or can be a free-typed name (workflow §7 open item O5) is deferred to the scaffold
cycle — the stack supports either.

---

### (v) Hosting / deploy

| Option | Description | For | Against | Verdict |
|---|---|---|---|---|
| **v-1** | **Vercel** (the app) + managed Postgres in a chosen region (the data). | First-class Next.js fit; git-push deploy; preview URLs; generous low/free tier (EC4). App-server region is selectable. | App compute region ≠ DB region — but OQ1 imposes no constraint. Commercial use technically wants a paid plan. Vendor. | **Chosen.** |
| **v-2** | **Netlify / Cloudflare Pages** — equivalent PaaS for a Next.js app. | Same class of benefit. | Slightly less seamless Next.js support than Vercel; no existing account (OQ3). | Rejected — no advantage over Vercel here. |
| **v-3** | **A container platform (Railway / Render / Fly.io)** — app + Postgres deployed together in one region. | One provider, one region for app + data. | Another vendor to pick; less seamless Next.js DX than Vercel. | Rejected — the Supabase + Vercel split is the more standard, better-documented path and OQ1 does not require co-location. |
| **v-4** | **Single self-hosted VPS** running the Next.js app + Postgres via Docker Compose, behind a reverse proxy with TLS. | Full control of data location. One box, fully inspectable (EC7). Cheapest predictable cost. | We own provisioning, TLS renewal, OS patching, backups, uptime. Real ops time. | Rejected — OQ1 (no residency rule) + OQ4 (maintainer does not want server ops) + OQ5 (small cost OK) remove every reason for it. |

**Finalized:** **v-1** — Vercel for the app + the managed Postgres from (iii) in the nearest
region. "Me + Claude Code" maintainer + "small cost OK" + "no residency constraint" all point
here; no VPS ops burden.

---

## Finalized recommendation

The human answered 4 of the 6 Open Questions (verbatim answers in the Open Questions section):

- **OQ1 residency:** no constraint — the nearest reliable region is fine.
- **OQ3 accounts:** a **Google Workspace** exists; no Vercel / Supabase / other cloud account
  yet (creating what is needed is fine); no hard avoids.
- **OQ4 maintainer:** the human operates it day-to-day; all changes go through PDCA cycles
  ("Me + Claude Code").
- **OQ5 budget:** a small monthly cost (a few USD to low tens/month) is acceptable for the pilot.

These converge cleanly on **Option C**. No residency rule + budget for managed services + a
maintainer who does not want server ops rule out every self-hosted fallback. **Two items stay
provisional** pending OQ2 and OQ6 — neither changes sub-decisions (i), (iii), or (v).

| Sub-decision | Finalized choice | Status |
|---|---|---|
| **(i) Structure** | New app at `projects/store-care-program/`. | **Confirmed** |
| **(ii) Framework** | Next.js App Router + React + Tailwind, matching AI Command Center (Next 16 / React 19 / Tailwind v4), `lucide-react`, the CSS-variable theme pattern from `notes/architecture/theme-toggling.md`. Mobile-first via Tailwind responsive utilities. Thai text via a Thai-covering webfont (Noto Sans Thai). | **Confirmed** (i18n detail provisional — item A) |
| **(iii) Database** | Managed Postgres — **Supabase** (bundles Postgres + Auth + object storage for later photo attachments, collapsing iii / iv / EC9 into one system), nearest region (e.g. Singapore — verify current availability when the decision record is written). **Fallback:** Neon Postgres + Auth.js if the human prefers to avoid bundling. Portability guard: schema in in-repo migrations; a documented one-command `pg_dump` export from the first slice. | **Confirmed** (provider Supabase, fallback Neon) |
| **(iv) Auth** | **Domain-restricted Google sign-in** — restricted to the human's Google Workspace domain, via Supabase Auth's Google provider (or the Auth.js Google provider under the Neon fallback). Enforcement: a two-value `role` attribute `{operational, management}` + one server-side guard — `operational` performs every workflow mutation and status transition; `management` gets the read-only cross-store issue view only. No RBAC, no per-store scoping. First slice exercises only the `operational` path; schema + guard know both roles from the start. | **Provisional** — human confirms OQ6 (item B) |
| **(v) Hosting** | **Vercel** (Next.js-first, git-push deploy, preview URLs, free/low tier fine for a pilot) + the managed Postgres from (iii) in the nearest region. No VPS ops burden. | **Confirmed** |

**Provisional item A — UI language (pending OQ2).** Provisional choice: **Thai-only**,
hardcoded Thai strings + a Thai-covering webfont (Noto Sans Thai), **no i18n library** — the
smallest option, and the pilot is one internal Thai team. If the human asks for bilingual
Thai/English instead, that adds `next-intl` + a locale switch and nothing else. Does **not**
change (i)–(v).

**Provisional item B — auth mechanism (pending OQ6).** Provisional choice: domain-restricted
Google sign-in as in (iv). Assumes the ~1–3 pilot users all have accounts in the Workspace
domain. If any pilot user is outside it, the mechanism becomes email magic-link or a hardcoded
pilot user list — enforcement unchanged. Does **not** change (i), (iii), (v).

Option A (extend AI Command Center) is rejected. Option B (self-hosted) is rejected in favour
of C because the OQ1/OQ4/OQ5 answers remove every reason to take on self-hosting.

---

## Steps (the ordered process for this cycle and the handoff)

1. **[Plan — done]** Produced this document: evaluation criteria, five sub-decisions with
   options, and the draft decision record.
2. **[human — done]** Answered 4 of 6 Open Questions (OQ1 residency, OQ3 accounts, OQ4
   maintainer, OQ5 budget).
3. **[Plan — done, this update]** Folded the answers into the **Finalized recommendation**
   above (one concrete choice per sub-decision) and filled the human-answer placeholders in
   the draft decision record. Two items (OQ2 UI language, OQ6 auth mechanism) are marked
   `[PROVISIONAL — ...]` in the draft.
4. **[human]** Confirm OQ2 and OQ6 (or override), and approve the finalized decision-record
   content.
5. **[Do]** Write `notes/decisions/2026-09-09-store-care-program-tech-stack.md` **verbatim
   from the finalized draft below**, replacing the two `[PROVISIONAL — ...]` spans with the
   human's confirmed choices and changing nothing else. Match the format of the existing
   decision records. No other file changes. No code. No scaffold.
6. **[human]** Commit the decision record.
7. **[next cycle — separate]** Plan the project scaffold + first vertical slice against the
   approved stack and the workflow doc. Out of scope here.

If step 4 reveals a pilot user outside the Workspace domain, or a bilingual UI need, apply
only the local adjustment noted in items A/B — do not reopen sub-decisions (i), (iii), (v).

---

## Draft decision record (human's answers filled in; two provisional spans marked)

> To be written by Do to `notes/decisions/2026-09-09-store-care-program-tech-stack.md`
> **after** the human confirms OQ2 + OQ6 and approves the finalized content. The two
> `[PROVISIONAL — ...]` spans are replaced with the confirmed choice; nothing else changes.
> Format mirrors `notes/decisions/2026-09-01-jula-ai-os-role.md` and
> `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`.

---

# Store Care Program v1 Tech Stack

**Date:** 2026-09-09
**Status:** Accepted
**Cycle:** `agents/runs/2026-09-09-store-care-program-tech-stack/`

## Context

Store Care Program is the first real line-of-business application (a *Business Applications*
capability, `docs/capability-map.md`) built under Jula AI OS. Its product scope is fixed by
`notes/product/store-care-program-mvp-definition.md` (Accepted 2026-09-08) and its operational
process by `notes/workflows/store-visit-issue-closure.md` (Accepted 2026-09-08). The phased
plan in `agents/runs/2026-09-08-store-care-program-mvp-definition/plan.md` Part 3 makes the
tech-stack choice "Phase 0" — the last gate before build cycles.

No prior `notes/decisions/` or `notes/architecture/` entry chooses a stack, database, auth
model, or hosting for a persistent application. The only existing stack in the repo is AI
Command Center's (`projects/ai-command-center/package.json`: Next.js 16, React 19, Tailwind
v4; no backend, no auth, `localStorage` only — `notes/architecture/theme-toggling.md`).

The requirements the stack must meet (evaluation criteria EC1–EC10 in the cycle's `plan.md`):
mobile-first responsive web, no native app, no offline; real persistence for 3 entities with
the workflow §4 relationships; a minimal 2-role model (operational read-write, management
read-only), no granular permissions, no store-staff logins; internal pilot quality, smallest
usable vertical slice; data portable / not vendor-locked (manifesto principle 7); standalone,
no CRM/WMS/Automation integration; simple and inspectable by the maintainer; cheap derived
"overdue" queries and back-datable dates; room to add photo storage / a finding checklist /
a report view later; Thai-language capable.

The human answered the decision inputs on 2026-09-09:

- **Data residency:** No legal or policy constraint on where the data lives — the nearest
  reliable region is acceptable.
- **Existing accounts / hosting preference:** A Google Workspace exists. No Vercel, Supabase,
  or other cloud account yet (creating what is needed is fine). No hard avoids.
- **Who maintains the app after build:** The human operates it day-to-day; all changes go
  through PDCA cycles ("Me + Claude Code").
- **Budget tolerance for managed services:** A small monthly cost (a few USD to low tens per
  month) is acceptable for the pilot.
- **UI language:** `[PROVISIONAL — Thai-only, hardcoded Thai strings, no i18n library, pending
  the human's confirmation at approval; bilingual would add next-intl + a Thai/English locale
  switch and nothing else]`
- **Auth mechanism preference:** `[PROVISIONAL — domain-restricted Google sign-in, pending the
  human's confirmation at approval; assumes all ~1–3 pilot users have accounts in the
  Workspace domain; a pilot user outside it makes the mechanism email magic-link or a
  hardcoded pilot user list, enforcement unchanged]`

## Decision

The Store Care Program v1 pilot is built as:

1. **Project structure:** a new app at `projects/store-care-program/`, separate from
   `projects/ai-command-center/`. Rationale: the capability map places Business Applications
   in *"Future subfolders of `projects/`"* and keeps them off the Dashboards surface, which is
   deliberately backend-less and auth-less.

2. **Frontend framework:** Next.js App Router + React + Tailwind, matching AI Command Center
   (Next.js 16, React 19, Tailwind v4), with `lucide-react` and the CSS-variable theme
   pattern from `notes/architecture/theme-toggling.md`. Mobile-first via Tailwind responsive
   utilities. Thai text uses a Thai-covering webfont (e.g. Noto Sans Thai). i18n approach:
   `[PROVISIONAL — hardcoded Thai strings, no i18n library; bilingual would add next-intl with
   a Thai/English locale switch]`.

3. **Persistence / database:** managed Postgres via **Supabase** (bundles Postgres + Auth +
   object storage for later photo attachments — collapsing the database, auth, and
   future-attachment concerns into one system), in the nearest region (e.g. Singapore — the
   exact region confirmed against current Supabase availability when this record is written).
   Fallback, if the human prefers to avoid bundling: **Neon Postgres + Auth.js**. Portability
   guard: the schema is defined in in-repo migrations owned by this project; a documented
   one-command full export (`pg_dump`) exists from the first slice (satisfies manifesto
   principle 7 regardless of provider).

4. **Auth + role enforcement:** mechanism = `[PROVISIONAL — domain-restricted Google sign-in,
   restricted to the human's Google Workspace domain, via Supabase Auth's Google provider (or
   the Auth.js Google provider under the Neon fallback); a pilot user outside the Workspace
   domain makes this email magic-link or a hardcoded pilot user list]`. Enforcement = a
   two-value `role` attribute (`operational`, `management`) plus a single server-side
   authorization guard: `operational` performs every workflow mutation and status transition;
   `management` gets only the read-only cross-store issue view (workflow §1 step 8). No RBAC
   library, no permission matrix, no per-store scoping. Postgres row-level security is an
   optional defense-in-depth layer on top of the app guard, not required for the pilot. The
   first vertical slice exercises only the `operational` path; the schema and guard know both
   roles from the start.

5. **Hosting / deploy:** **Vercel** (Next.js-first, git-push deploy, preview URLs, free/low
   tier sufficient for a pilot) + the managed Postgres from (3) in the nearest region. The
   "Me + Claude Code" maintainer model, acceptance of a small monthly cost, and absence of a
   residency constraint all point here, with no VPS operations burden. Residency note: no
   legal or policy constraint applies (per the human's answer), so the nearest reliable
   region is used for both the Vercel deployment and the Postgres instance.

This is a pilot-scoped decision. It is expected to be revisited if the pilot succeeds and the
app moves toward production (see Consequences).

## Options considered

- **(A) Extend the existing AI Command Center Next.js app** with a backend, database, and
  auth. *Rejected:* couples the *Dashboards* capability (a deliberately static, no-backend,
  no-auth surface — `2026-09-04-capability-map-ai-command-center-classification.md`) with a
  *Business Applications* capability; adds auth to an app intentionally built without it;
  makes the dashboard's build and deploy heavier. Contradicts the capability-map boundary.

- **(B) New `projects/store-care-program/` app with a self-hosted / embedded datastore** —
  SQLite or self-hosted Postgres, library or hand-rolled auth, deployed on a single VPS.
  *Rejected in favour of C:* the human's answers — no data-residency constraint (OQ1), a
  maintainer who operates the app but routes changes through PDCA cycles and does not want
  server operations (OQ4), and acceptance of a small monthly managed-service cost (OQ5) —
  remove every reason to take on self-hosting's ongoing burden (provisioning, TLS, OS
  patching, backups, uptime).

- **(C) New `projects/store-care-program/` app with a managed Postgres + managed auth
  service**, deployed on a Next.js-friendly platform. *Chosen:* the fastest path to real
  persistence, auth, and a 2-role model for a pilot, with the least custom backend code; the
  data stays in standard Postgres so it remains portable via the in-repo schema + documented
  `pg_dump` export. Concretely: `projects/store-care-program/` + Next.js/React/Tailwind +
  Supabase (Postgres + Auth + storage) + Vercel; Neon Postgres + Auth.js is the documented
  fallback if the human prefers not to use a bundled provider.

- Framework alternatives considered and not chosen: a plain React SPA + separate API (adds a
  second deployable and an API contract for a ~6-screen pilot); a lighter server-rendered
  stack (new learning cost, no offsetting benefit); low-code / no-code platforms (**rejected**
  — data and app logic locked in a proprietary platform, fails manifesto principle 7).

- Database alternatives considered and not chosen: NoSQL / document stores (**rejected** —
  the data is relational; FK-enforced parent rules, filter-by-store, and derived date queries
  are the natural fit for SQL, and proprietary query APIs worsen lock-in). SQLite and
  self-hosted Postgres are viable but rejected here because OQ1/OQ4/OQ5 favour an ops-free
  managed service.

## What this does NOT decide

- **The database schema** — table and column names, types, indexes, how the back-dated
  activity date and system `created_at` are modelled, and whether an Issue/Action **owner**
  is a login user or a free-typed name (workflow §7 open item O5). That is the scaffold
  cycle's work, against the workflow doc.
- **The screen inventory and UI design** — which screens exist in the first slice, their
  layout, and the visual design. The MVP plan sketches ~4–6 screens; the scaffold cycle
  confirms them.
- **Photo / attachment storage** — the workflow makes attachments optional in v1. Where blobs
  live (object storage vs. skipped for the first slice) is deferred to the scaffold cycle.
- **A saved-visit-report view and any structured finding checklist** — deferred by the
  workflow doc; not in scope for the stack choice.
- **Store master seed source** — whether the Store list is imported from an existing
  spreadsheet or entered via an "add store" screen (workflow §2 open item). A build-cycle
  question.
- **CI, testing framework, linting, and per-project conventions** for
  `projects/store-care-program/` — set up in the scaffold cycle and documented in its
  `README`, per `CLAUDE.md` ("each subproject sets its own tooling").
- **The delivery date and effort estimate** — re-derived once this decision lands.
- **Any production hardening** — monitoring, backups cadence, multi-user scale, staging
  environments. Pilot scope only.

## Consequences

- A new top-level project folder `projects/store-care-program/` will be created **in the next
  cycle**, becoming the first entry under the *Business Applications* capability and the
  first `projects/` subfolder besides AI Command Center.
- `projects/store-care-program/README.md` will document the chosen stack's build / run / test
  commands (none exist repo-wide, per `CLAUDE.md`).
- A **Supabase** account and a **Vercel** account will be created for the pilot. An estimated
  **$0–low-tens per month** cost is accepted (both have free/hobby tiers that likely cover a
  pilot of this size; a small paid tier is acceptable if needed). Supabase becomes a data
  processor for Store Care Program data; Vercel hosts the application. The in-repo migrations
  + documented `pg_dump` export keep the data portable and the schema vendor-independent.
- The existing **Google Workspace** is used as the identity provider for sign-in (pending
  OQ6 confirmation). No separate password store or email-sending service is introduced.
- The `projects/ai-command-center/src/data/projects.ts` Store Care Program entry may later be
  updated to reflect that an implementation has started (currently `status: "Idea"`) — a
  separate small cycle, not triggered by this decision alone.
- This decision is pilot-scoped. If the pilot succeeds, a follow-up decision will revisit
  hosting, backups, auth hardening (including whether Supabase's bundled auth should be
  replaced with Auth.js), and scale before any production rollout — recorded as a new
  `notes/decisions/` entry, not an edit to this one (manifesto principle 4).
- `notes/architecture/` may gain a living document describing the Store Care Program
  architecture once it is built (parallel to `theme-toggling.md` and `slug-project-pages.md`).
- Two points were provisional at drafting time — the v1 UI language and the auth mechanism.
  The human confirmed them at approval; if either later changes, only the local adjustment
  noted in the Decision applies (i18n library for bilingual; magic-link / hardcoded list for
  an out-of-domain pilot user). Sub-decisions (1), (3), and (5) are unaffected either way.

---
*(end of draft decision record)*

---

## Risks

- **This is a hard-to-reverse choice made before any code exists.** Datastore and hosting are
  expensive to change once pilot data is real. Mitigation: the decision is explicitly
  pilot-scoped with a planned production-readiness revisit; the portability guard (in-repo
  schema + documented `pg_dump` export) keeps the datastore swappable; the framework choice
  (Next.js) matches existing team knowledge so it is the lowest-regret axis.
- **The four answers converged cleanly on Option C** — no residual conflict between residency,
  budget, and maintainer. The two unanswered items (UI language, auth mechanism) do not
  affect the structural choice; each has a scoped, low-cost adjustment path.
- **Exact provider region availability is time-sensitive.** The nearest Supabase (and Vercel)
  region must be verified against current provider docs when the decision record is written —
  not asserted from memory. "Singapore" is a likely-but-unconfirmed placeholder.
- **The Google-Workspace-domain auth assumption.** Domain-restricted Google sign-in only works
  if every pilot user has a Workspace account. The pilot roster is still undefined (MVP open
  item O5) — confirm it before building auth; if a user is external, switch to magic-link or a
  hardcoded list (small change, enforcement unchanged).
- **Supabase bundles three concerns (DB + auth + storage), which is efficient but increases
  lock-in surface.** Mitigation: users and data are ordinary Postgres rows; the `pg_dump`
  export covers them; Neon + Auth.js is the documented fallback and the production-readiness
  revisit explicitly reconsiders the bundled auth.
- **Scope creep from "the stack decision" into "the schema" or "the screens".** The workflow
  doc has real open items (owner identity, store seed source, findings shape). Those are
  build-cycle questions; the "What this does NOT decide" section is the guard.
- **The MVP §5 / workflow §4 sync edit is still pending** (checkpoint
  `2026-09-08-store-care-workflow-definition.md`, Next Action 2). It does not block this
  decision — the workflow doc is canonical for the parent rule and this plan uses it — but
  the scaffold cycle should confirm the sync happened before modelling the schema.
- **"Jula's Herb" and the pilot shape (store count, who performs visits) are still
  undefined** (MVP open items O5). They do not affect the stack choice but do affect whether
  the pilot's scale assumptions (free tiers, single small team) hold — noted for the
  production-readiness revisit.

## Open Questions

Six questions gated this decision (the MVP-plan O7 inputs, expanded). **Four are answered;
two are provisional and the human confirms or overrides them at approval — neither changes
sub-decisions (i), (iii), or (v).**

1. **Data residency.** — **ANSWERED:** no legal or policy constraint; the nearest reliable
   region is acceptable.
2. **UI language.** — **PROVISIONAL.** Provisional choice: **Thai-only**, hardcoded Thai
   strings + a Thai-covering webfont (Noto Sans Thai), no i18n library. If the human wants
   **bilingual Thai/English**, that adds `next-intl` + a locale switch and nothing else.
   *Human confirms or overrides at approval.*
3. **Existing accounts and preferences.** — **ANSWERED:** a Google Workspace exists; no
   Vercel / Supabase / other cloud account yet (fine to create); no hard avoids.
4. **Who maintains the app after the build.** — **ANSWERED:** the human operates it
   day-to-day; all changes go through PDCA cycles ("Me + Claude Code").
5. **Budget tolerance for managed services.** — **ANSWERED:** a small monthly cost (a few USD
   to low tens per month) is acceptable for the pilot.
6. **Auth mechanism preference.** — **PROVISIONAL.** Provisional choice: **domain-restricted
   Google sign-in** (Workspace domain). Assumes all ~1–3 pilot users have Workspace accounts;
   if any is outside the domain, the choice becomes **email magic-link** or a **hardcoded
   pilot user list**, enforcement unchanged. *Human confirms or overrides at approval.*

**Secondary (does not block this decision; flag for the scaffold cycle):**

- Whether an Issue/Action **owner** must be a login user or can be a free-typed name
  (workflow §7 O5) — a schema question the chosen stack supports either way.
- Confirmation that the MVP §5 ↔ workflow §4 sync edit (checkpoint Next Action 2) has landed
  before schema modelling begins.
- The pilot roster (needed to validate the Workspace-domain auth assumption).

## Non-Goals

- **No code, no scaffold, no `projects/store-care-program/` folder, no `package.json`, no
  dependency install** this cycle.
- **No writing of `notes/decisions/2026-09-09-store-care-program-tech-stack.md`** until the
  human confirms OQ2 + OQ6 and approves the finalized content — then Do writes it verbatim
  from the finalized draft, and nothing else.
- **No edits** to `notes/product/store-care-program-mvp-definition.md`,
  `notes/workflows/store-visit-issue-closure.md`, `docs/capability-map.md`,
  `docs/business-os-manifesto.md`, `projects/ai-command-center/**`, `agents/README.md`, or
  any existing decision record.
- **No database schema, table/column design, or entity field list** — that is the scaffold
  cycle's job against the workflow doc.
- **No screen inventory, wireframes, or UI design.**
- **No delivery-date commitment or effort re-estimate.**
- **No account creation, provisioning, or deployment** — the Supabase and Vercel accounts are
  created in the scaffold cycle, not this one.
- **No production concerns** — monitoring, backup cadence, staging environments, multi-user
  scale, security hardening beyond a basic 2-role guard.
- **No commit.** The human commits the decision record after Do writes it.
- **The project scaffold and the first vertical slice are the NEXT cycle**, planned
  separately after this decision is approved.

---

**Do may not act on this plan until the human explicitly approves it.**
