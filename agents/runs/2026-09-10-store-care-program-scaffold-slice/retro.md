# Retro — Store Care Program: Scaffold + First Vertical Slice (Phase 1)

**Cycle:** `agents/runs/2026-09-10-store-care-program-scaffold-slice/`
**Date:** 2026-09-10
**Review verdict:** PASS WITH FINDINGS

## What we learned

- **Locking every hard gate before the Plan revision made the build almost mechanical.** The
  human locked A1–A6 and B1/B3/B4/B5 in the approval message; the revised plan folded each
  into a table and pointed every deliverable at a locked decision. Do then produced a schema,
  RLS baseline, auth layer, and 11 screens that Review re-derived against the canonical
  workflow and found to match "exactly" / "verbatim in intent". The lesson from the tech-stack
  cycle held again: the expensive thinking belongs in the decision gate, not the implementation.

- **A vertical slice can be built to "green build + green tests" while its most important
  guarantees stay unverified — and that is fine if the split is stated loudly.** `npm run
  build`, `lint`, and 13/13 unit tests pass; the app boots with no env and renders Thai
  "not configured" notices instead of crashing. But applying `0001_init.sql`, live RLS
  behaviour, the `pg_dump` round-trip, real Google sign-in, and the end-to-end chain are all
  **blocked on C1/B2/B3** and were never run. The changelog and review both enumerate the
  blocked set explicitly rather than letting "tests pass" imply "it works". This is the
  honest shape of a slice built ahead of its infrastructure.

- **`prefers-color-scheme`-only, `authorizeOperational()` returning a result object, and the
  creation `issue_event` as a DB trigger** were all deviations from the plan's letter that Do
  flagged in a dedicated "Deviations" section rather than making silently. Review classified
  every one as acceptable or better. The discipline of a standing "Deviations / decisions
  taken during Do" section in the changelog is doing real work — it turns judgement calls into
  reviewable line items.

- **"Finding is free text on the follow-up, not a table" survived contact with implementation.**
  Plan Deliverable 1a and Risk R6 both pre-empted the over-modelling pull; Do built a single
  `notes` field and Review confirmed no `finding` table, no taxonomy, no checklist anywhere.
  Naming the anti-goal in the plan is what prevented it.

- **RLS as declared defence-in-depth, with the app guard as primary control, produces two
  findings that are "correct but worth writing down" (F3, F4).** `anon` is denied only via
  RLS (no `REVOKE` of Supabase default grants); an `operational` user with their own JWT can
  bypass `checkTransition` with a direct `UPDATE`. Both are consistent with the plan's stated
  posture ("RLS is defence-in-depth; app guards remain the primary control"; operational
  users are trusted in v1). They are residual risks to track, not regressions — but the
  security model should be explicit that the DB is not the enforcement boundary for
  transition legality in v1.

- **One genuinely-should-fix bug came out of the slice: F2, the non-atomic status update +
  `issue_event` insert in `transitionIssue()`.** `checkTransition` pre-validates so the CHECK
  won't trip, but a transport blip between the two writes leaves an issue in its new status
  with no history row and no clean recovery path (`issue_event` is append-only by design —
  plan R11). This is the kind of correctness gap a vertical slice is supposed to surface
  early, before there is real data. The fix (a Postgres RPC / function so both writes commit
  together) is small and belongs before go-live, not in this cycle.

- **The MVP §5 sync edit (Do Step 1) is done — do not schedule it again.** It has been the
  standing Next Action since the workflow cycle. `notes/product/store-care-program-mvp-definition.md`
  §5 now uses "Store Follow-up", states the hybrid parent rule (Store mandatory, Follow-up
  link optional), and replaces the resolved `[OPEN]` parent-rule note with a `[CONFIRMED —
  synced from workflow §4, 2026-09-10]` note. Review confirmed the diff is confined to §5 and
  faithful to canonical §4. The second `[OPEN]` note in §5 (permitted `status` values) was
  correctly left alone — out of the approved edit scope.

## What changed in `notes/`

- **This cycle:** only the MVP §5 sync edit described above
  (`notes/product/store-care-program-mvp-definition.md`), which was Do's Step 1 and is
  already applied — not an Act change.
- **Act made no `notes/` changes.** No new decision is warranted (all architecture was
  decided in the locked hard gates and the tech-stack decision record; nothing was
  superseded). A milestone **checkpoint** for Phase 1 is worth creating to match the Store
  Care Program lineage (the three prior cycles each produced one) and to carry the blocked
  prerequisites and open findings forward — proposed as Next Action 6 below rather than
  written here on Act's own initiative.
- **MEMORY / private memory:** no update. The run folder and (proposed) checkpoint are the
  durable record.

## Next Actions

Proposals for the next Plan cycle — the human orchestrator selects which one (if any) runs
next. Roughly in priority order.

1. **Human decision on Check finding F1 (Next.js `16.2.10` advisory) — commit-now-vs-bump-first.**
   `npm audit` rates the `next@16.2.10` pin critical; the fix is `next@16.3.4+`. Review
   re-derived the advisory cluster against this app's actual surface and found **no confirmed
   RCE or auth-bypass path** (the middleware/proxy-bypass CVE is neutralised because
   `src/proxy.ts` does session-cookie refresh only and carries no authorization; every page
   calls `loadSession()` and every action calls `authorizeOperational()` independently).
   Residual real risk: Server Action DoS (availability) + minor endpoint disclosure.
   - Does **not** block committing this additive scaffold (nothing is deployed; deploy is
     already gated on C1/B2/B3).
   - **Must** be tracked as a **HARD pre-deploy gate**: the app must not be deployed on
     `16.2.10`.
   - A bump of **both** `store-care-program` **and** `ai-command-center` to `next@16.3.4+`
     should be considered together (both currently pin `16.2.10`). This is a dependency
     change ⇒ needs the human's approval per CLAUDE.md.
   - The human decides: (a) commit the scaffold now and open the tracked pre-deploy gate, or
     (b) bump first. Either is acceptable per Review.

2. **Fix F2 — make `transitionIssue()` atomic — before go-live.** Move the `issue` status
   update (+ `resolved_at`) and the `issue_event` insert into a single Postgres function
   invoked via `supabase.rpc(...)` (or an explicit transaction) so they commit together.
   Low likelihood, but the impact is a permanent audit-trail gap with no clean operator
   recovery (`issue_event` is append-only). Small, self-contained; a good first item once C1
   unblocks migration work. Blocks go-live, not commit.

3. **Fold F3–F7 into a hardening pass (after F1/F2, before or with go-live).**
   - **F3 (low):** add explicit `REVOKE ALL ... FROM anon, PUBLIC;` before the targeted
     `GRANT`s in the migration, and correct the "anon is granted nothing" comment to match
     reality (today it is true only via RLS).
   - **F4 (low, matches plan intent):** if tighter integrity is wanted later, enforce
     transition legality (`from`→`to`, `reason_kind`-vs-transition) in a DB trigger/function.
     Recorded as residual risk, not a deviation — operational users are trusted in v1.
   - **F5 (info):** dead code `getSiteUrl()` in `src/lib/env.ts`; `SignInButton` comment
     references an `hd` hint it does not pass; `/login?error=domain` is reused for both
     "unconfigured" and "off-domain" (cosmetic Thai-message mismatch).
   - **F6 (info):** the four flagged plan deviations — all disclosed, all acceptable; no
     action beyond acknowledgement.
   - **F7 (info):** `/manage` fetches `cancelled` rows then discards them client-side; add
     `WHERE status <> 'cancelled'` to the query. Harmless at pilot scale.

4. **Unblock the prerequisites that gate all remaining verification and deployment.** These
   are unchanged from the plan and still block real progress:
   - **B2** — the exact Google Workspace domain string (human provides; Do reads
     `ALLOWED_EMAIL_DOMAIN` with no default until then). Blocks auth configuration.
   - **B3** — the Google OAuth client ID/secret, created/approved by a Workspace/Cloud admin,
     supplied as env / Supabase provider config. Never created or committed by Do. Blocks deploy.
   - **C1** — the human creates (or authorises) the **Supabase** and **Vercel** projects and
     shares the project URL + anon key (+ a DB connection string for migrations only, as a
     secret). Blocks provision.
   - **C2** — confirm the nearest Supabase + Vercel region (Singapore expected; verify current
     availability — still not done, carried from the tech-stack cycle). Blocks provision.
   - Once these land: apply `0001_init.sql`, run live RLS verification (operational vs
     management vs unauthenticated), run the `scripts/export-db.sh` `pg_dump` round-trip, do
     real Google sign-in + off-domain rejection testing, run the end-to-end chain on a phone
     against a real store, confirm reload persistence, and deploy. This is the "finish and
     verify Phase 1" cycle and is the natural next build priority once C1/B2/B3 exist.

5. **Keep these business inputs OPEN — do not fabricate.** Nothing in this cycle resolved
   them and nothing should invent them:
   - **C3** — primary-user job title (labels only; generic Thai role label until then).
   - **C4** — issue edit/reassignment permissions beyond "any `operational` user" (default:
     any operational user may edit any issue).
   - **C5** — findings shape, one free-text block vs a list (default: one free-text block).
   - **C7** — target delivery date (deferred to a separate estimation pass).
   - **Q8** — real finding examples (5–10 real findings) for workflow §2's `[OPEN]` note.
   - **Q32** — one real recent end-to-end worked example for workflow §5's stub.
   Q8/Q32 need the human to supply real data before a small follow-up pass can fill them.

6. **Create a Phase 1 milestone checkpoint in `notes/checkpoints/`.** To match the Store Care
   Program lineage (MVP, workflow, and tech-stack cycles each produced a checkpoint) and to
   record: the slice is built and passes build/lint/test; what is verified vs blocked; the F1
   pre-deploy gate; F2 as a go-live blocker; the B2/B3/C1/C2 prerequisites; the still-open
   C3/C4/C5/C7/Q8/Q32 inputs; and that the MVP §5 sync is done. Act did not write this on its
   own initiative — flagged for the human to direct.

7. **Re-derive the delivery date + effort estimate (non-blocking).** Deferred by the MVP plan
   and the tech-stack cycle. Now that the slice exists and its blocked remainder is
   well-scoped, a short estimation pass against the remaining plan Steps 4–9 can produce a
   first target.

8. **Later: update `projects/ai-command-center/src/data/projects.ts`.** Move the Store Care
   Program entry off `status: "Idea"` and point its description at the definition + workflow +
   tech-stack decision, once Phase 1 verification actually completes. A small separate cycle,
   explicitly a Non-Goal of this one.

These are proposals only. They feed the next Plan cycle; the human orchestrator picks which
one (if any) starts next. Nothing from this cycle is committed — the human commits the run
folder, the `projects/store-care-program/` tree, and the MVP §5 edit separately, after
deciding F1.

---

## Amendment retro (F1 + F2)

**Date:** 2026-09-10 (same day). After the PASS-WITH-FINDINGS review, the human authorised a
**narrow amendment covering only F1 and F2**. Do applied it; Check independently re-verified
it. **Amendment verdict: PASS.** This section records what changed; the original retro above
is left intact.

### What we learned (amendment)

- **A tightly-scoped post-review amendment is cheap and clean when the findings were already
  precise.** F1 and F2 were both "confirmed, with the fix named in the finding". Do changed
  five files (`package.json`, `package-lock.json`, `tsconfig.json`, new
  `migrations/0002_issue_transition.sql`, `src/app/actions.ts`), touched nothing else, and
  Check confirmed F3–F7 were untouched (not half-fixed) by file mtime. Naming the remedy in
  the finding is what made the amendment mechanical.

- **A dependency bump that looks routine still forced exactly one config change — and
  surfacing it as a line item was the right call.** `next 16.2.10 → 16.3.4` (+
  `eslint-config-next`) tightened the TypeScript import-extension check, so the explicit
  `import "./issue-status.ts"` the test file needs for `node --test` native type-stripping
  now required `"allowImportingTsExtensions": true` in `tsconfig.json`. Check verified this is
  safe: the flag is only permitted with `noEmit` (set), and the project never emits via `tsc`
  (Next/Turbopack compiles; `node --test` strips types). No runtime effect. `npm audit` went
  from 1 critical + 2 high to **0 vulnerabilities** (transitive `sharp@0.35.4`,
  `postcss@8.5.23/8.5.28` also patched). `ai-command-center` was confirmed **completely
  untouched** (git status + git diff empty; still pins `16.2.10`).

- **Moving the two-write transition into a `SECURITY INVOKER` RPC keeps RLS as the real
  boundary and revealed a subtle rollback mechanism (N1).** `perform_issue_transition` does
  `SELECT … FOR UPDATE` → inline `from→to` validation (exact match to workflow §3 /
  `lib/issue-status.ts`) → `reason_kind` derivation → `issue` UPDATE → `issue_event` INSERT,
  all in one implicit transaction; any `RAISE` (custom `SCP01/02/03` SQLSTATEs, surfaced to
  supabase-js as `error.code`) rolls the whole thing back. App-side `authorizeOperational()`
  and `checkTransition()` are kept as defence in depth and for clean field-level Thai errors
  before the round-trip. Check found the canonical state machine unchanged and the 13 tests
  still green.

### F1 — RESOLVED (for `store-care-program`)

- `next` and `eslint-config-next` at `16.3.4` in both `package.json` and the resolved
  lockfile; `sharp`/`postcss` transitively patched.
- `npm audit` run independently: **`found 0 vulnerabilities`** (was 1 critical + 2 high).
- `projects/ai-command-center/` **completely untouched** — `git status` / `git diff` empty;
  it still pins `next@16.2.10`.
- `allowImportingTsExtensions: true` in `tsconfig.json` is the **only forced config change**,
  and it is safe (`noEmit` is set; no runtime effect).
- `npm run build` (on Next 16.3.4), `npm run lint`, `npm test` (13/13) all pass; local probes
  on 5 routes + 2 dynamic-param routes return HTTP 200 with the fail-safe Thai notice.
- **Carry-forward (not a regression):** the original F1 also called for bumping
  `projects/ai-command-center` to `next@16.3.4+` before *that* project deploys. The human
  scoped the amendment to `store-care-program` only, so that bump is **still an open
  pre-deploy gate on the `ai-command-center` side** and belongs to the `ai-command-center`
  cycle, not this one. Carried forward as a proposed Next Action there (see below), not here.

### F2 — RESOLVED (for `store-care-program`)

- New `migrations/0002_issue_transition.sql` defines
  `public.perform_issue_transition(p_issue_id, p_to_status, p_reason) returns issue` —
  `SELECT … FOR UPDATE` row lock, inline `from→to` validation (exact match to workflow §3),
  `reason_kind` derivation, `resolved_at` handling, `issue_event` INSERT with
  `changed_by = auth.uid()`, all in one implicit transaction; `SECURITY INVOKER` so the 0001
  RLS policies still gate the writes; `REVOKE … FROM public` + `GRANT EXECUTE … TO
  authenticated`; custom `SCP01/02/03` SQLSTATEs.
- `src/app/actions.ts` `transitionIssue()`: the non-atomic `UPDATE issue` + separate
  `INSERT issue_event` pair is **removed**. The RPC is now the **sole atomic status-change
  path**. `authorizeOperational()` + `checkTransition()` are **kept as defence in depth** and
  for clean pre-round-trip Thai errors; `SCP0x` codes map to Thai messages.
- Check grepped `src/`: no `.from("issue").update(` anywhere, no
  `.from("issue_event").insert(` in app code, the only `.rpc(` is `perform_issue_transition`,
  `db.ts` is read-only.
- The **canonical state machine is unchanged**; `lib/issue-status.ts` and its 13 tests are
  untouched and still pass. No generic audit framework — the function handles only the issue
  status lifecycle.

### NEW — Check observation N1 (INFO / LOW)

Under a non-operational (`management`) caller, the RPC's `UPDATE public.issue …` silently
matches **0 rows** under its RLS `USING` clause (USING-filtering does not raise); execution
continues and the **rollback is actually enforced by the `issue_event` INSERT tripping the
`WITH CHECK (is_operational())` policy** (`42501`), which aborts the function and rolls back
everything. Net behaviour today is correct (management cannot complete a transition, nothing
persists, and app-side `authorizeOperational()` blocks management before the RPC is reached).
The fragility: if a future migration ever loosened the `issue_event` INSERT policy, a
non-operational direct caller would get a "successful" all-NULL return with no state change —
misleading, though not a data-integrity breach. Optional hardening: after the UPDATE,
`GET DIAGNOSTICS … row_count` / `IF NOT FOUND THEN RAISE` so the function fails loudly on a
no-op UPDATE. **Not blocking; fold into the same later hardening pass as F3/F4.** Runtime
verification is BLOCKED-by-C1.

### Still open / unchanged after the amendment

- **F3, F4, F5, F6, F7** — untouched (Check confirmed by file mtime; not half-fixed). The
  hardening pass still owns them. The `0002` function-level `REVOKE … FROM public` is
  unrelated to F3's *table* default-privilege concern; F3 stays open. F4 is unchanged — `0002`
  adds no trigger on `issue` and operational users still hold table-level UPDATE; the RPC is
  an additional clean path, not a lock-down.

### Still BLOCKED — B2 / B3 / C1 / C2

Unchanged. B2 (domain string), B3 (OAuth client id/secret), C1 (Supabase + Vercel projects +
URL/anon key/DB connection string), C2 (region confirmation) remain blocked, and they block:

- applying **`0001_init.sql` + `0002_issue_transition.sql`** to a real Postgres/Supabase;
- **all runtime verification of `perform_issue_transition`** — the `SELECT … FOR UPDATE` row
  lock / concurrent-transition serialisation, the RLS-under-`SECURITY INVOKER` path
  (operational succeeds, management rolls back, including the N1 mechanism), and the
  `SCP01/02/03` SQLSTATE round-trip surfacing as `error.code` in supabase-js;
- live RLS behaviour (operational vs management vs unauthenticated) and the
  `security_invoker` view against a real caller;
- the `scripts/export-db.sh` `pg_dump` → restore round-trip;
- real Google sign-in landing on `/stores` and real off-domain rejection at the callback;
- the end-to-end chain on a device and reload persistence;
- deployment.

### Still OPEN + must-not-fabricate

**C3, C4, C5, C7, Q8** (real finding examples) and **Q32** (real worked example) are
unresolved and nothing in the amendment touched them. The canonical docs' `[OPEN]` markers
are intact. These need the human to supply real data — do not invent them.

### MVP §5 sync — done

Do Step 1 (MVP §5 ↔ workflow §4 sync) is complete and Review-confirmed. Do not schedule it
again.

### What changed in `notes/` (amendment)

- **None.** The amendment touched only `projects/store-care-program/` files and this
  `retro.md`. No `notes/` decision or living doc was added or changed, and none was
  superseded (all architecture remains as decided in the locked hard gates and the tech-stack
  decision record). The Phase 1 checkpoint proposed in the original retro is still a proposal
  for the human to direct, not an Act change.

### Updated Next Actions (full list, priority order)

F1 and F2 are now resolved for `store-care-program`, so the original items 1 and 2 are
**done**. The remaining and revised proposals, in priority order:

1. **Unblock the prerequisites that gate all remaining verification and deployment — B2 / B3
   / C1 / C2.** This is now the critical path. It gates applying `0001_init.sql` **and**
   `0002_issue_transition.sql`, all `perform_issue_transition` runtime verification (row
   lock, RLS-under-INVOKER, N1 mechanism, `SCP0x` round-trip), live RLS, the `security_invoker`
   view, the `auth.users` trigger, the `pg_dump` round-trip, real Google sign-in + off-domain
   rejection, the end-to-end chain on a device, reload persistence, and deployment.
   - **B2** — exact Google Workspace domain string (human provides; `ALLOWED_EMAIL_DOMAIN`
     has no default until then).
   - **B3** — Google OAuth client id/secret, created/approved by a Workspace/Cloud admin,
     supplied as env / Supabase provider config. Never created or committed by Do.
   - **C1** — human creates (or authorises) the Supabase + Vercel projects and shares the
     project URL + anon key (+ a DB connection string for migrations only, as a secret).
   - **C2** — confirm the nearest Supabase + Vercel region (Singapore expected; verify
     current availability — still carried from the tech-stack cycle).
   - Once these land, this becomes the "finish and verify Phase 1" build cycle.

2. **Hardening pass — F3, F4, F5, F6, F7, and N1 — before or with go-live.**
   - **F3 (low):** add explicit `REVOKE ALL … FROM anon, PUBLIC;` before the targeted
     `GRANT`s; correct the "anon is granted nothing" comment (true only via RLS today).
   - **F4 (low, matches plan intent):** if tighter integrity is wanted later, enforce
     transition legality (`from`→`to`, `reason_kind`-vs-transition) in a DB trigger/function.
     Residual risk, not a deviation — operational users are trusted in v1.
   - **F5 (info):** dead `getSiteUrl()` in `src/lib/env.ts`; `SignInButton` comment
     references an `hd` hint it doesn't pass; `/login?error=domain` reused for
     "unconfigured" and "off-domain" (cosmetic Thai-message mismatch).
   - **F6 (info):** four flagged plan deviations — all disclosed, all acceptable; no action
     beyond acknowledgement.
   - **F7 (info):** `/manage` fetches `cancelled` rows then discards them client-side; add
     `WHERE status <> 'cancelled'` to the query.
   - **N1 (info/low):** optional `GET DIAGNOSTICS … row_count` / `IF NOT FOUND THEN RAISE`
     after the UPDATE in `perform_issue_transition`, so a no-op UPDATE under RLS fails loudly
     instead of relying on the downstream `issue_event` INSERT check for rollback.

3. **Propose in the `ai-command-center` cycle: bump `ai-command-center` to `next@16.3.4+`
   before that project deploys.** This is the F1 carry-forward the human scoped out of the
   store-care-program amendment. `ai-command-center` still pins `next@16.2.10`; the bump is a
   dependency change ⇒ needs the human's approval per CLAUDE.md and belongs in that project's
   own Plan cycle, not here. Track it as an open pre-deploy gate on the `ai-command-center`
   side.

4. **Create a Phase 1 milestone checkpoint in `notes/checkpoints/`.** Match the Store Care
   Program lineage (MVP, workflow, tech-stack cycles each produced one). Record: the slice is
   built and passes build/lint/test on Next 16.3.4; `npm audit` clean; F1 + F2 resolved for
   store-care-program; what is verified vs BLOCKED-by-C1/B2/B3; the F1 carry-forward for
   `ai-command-center`; F3/F4/F5/F6/F7/N1 as the hardening pass; the B2/B3/C1/C2
   prerequisites; the still-open C3/C4/C5/C7/Q8/Q32 inputs; and that the MVP §5 sync is done.
   Act did not write this on its own initiative — flagged for the human to direct.

5. **Keep these business inputs OPEN — do not fabricate.** Nothing has resolved them:
   - **C3** — primary-user job title (labels only; generic Thai role label until then).
   - **C4** — issue edit/reassignment permissions beyond "any `operational` user" (default:
     any operational user may edit any issue).
   - **C5** — findings shape, one free-text block vs a list (default: one free-text block).
   - **C7** — target delivery date (deferred to a separate estimation pass).
   - **Q8** — real finding examples (5–10 real findings) for workflow §2's `[OPEN]` note.
   - **Q32** — one real recent end-to-end worked example for workflow §5's stub.
   Q8/Q32 need the human to supply real data before a small follow-up pass can fill them.

6. **Re-derive the delivery date + effort estimate (non-blocking).** Deferred by the MVP plan
   and the tech-stack cycle. Now that the slice exists (F1/F2 included) and its blocked
   remainder is well-scoped, a short estimation pass against the remaining plan Steps 4–9 can
   produce a first target.

7. **Later: update `projects/ai-command-center/src/data/projects.ts`.** Move the Store Care
   Program entry off `status: "Idea"` and point its description at the definition + workflow +
   tech-stack decision, once Phase 1 verification actually completes. A small separate cycle,
   explicitly a Non-Goal of this one.

These remain proposals only. They feed the next Plan cycle; the human orchestrator picks
which one (if any) starts next. The amendment is still uncommitted and un-deployed — the
human commits the run folder, the `projects/store-care-program/` tree (scaffold + amendment),
and the MVP §5 edit together.
