# Checkpoint — First Full Subagent-Assisted PDCA Cycle

**Date:** 2026-07-21

## 1. What cycle was completed

The first real PDCA cycle run end-to-end using the new subagent-assisted workflow (rather than
hand-loading role files, or smoke-testing each subagent in isolation as in the prior phase — see
`notes/checkpoints/2026-07-20-pdca-subagents.md`). Run folder:
`agents/runs/2026-07-20-ai-command-center-readme-onboarding/`.

## 2. Target

`projects/ai-command-center/README.md` — onboarding improvement. Goal: let a first-time reader go
from a fresh clone to a running local dev instance using only the README, with no missing steps
and nothing inaccurate.

## 3. Workflow used

```
Plan subagent → Do (main session) → Check subagent → Act subagent
```

Plan produced and, after human-answered open questions, finalized `plan.md` before any
implementation. Do implemented against the approved plan in the main session (broadest tool
access, as designed). Check independently re-verified Do's work from scratch, not trusting the
changelog. Act closed the cycle with lessons learned and proposed Next Actions, without
implementing or re-prioritizing unilaterally.

## 4. Outcome

**Pass, clean.** Only `projects/ai-command-center/README.md` was modified by Do. Check
independently re-derived every factual claim (clone URL, Node engine requirement, env-var claim,
Scripts list, and a full re-run of `npm install`/`dev`/`build`/`lint`) and found no confirmed or
plausible defects — one trivial, explicitly non-blocking observation (minor "npm" wording
duplication between the Stack and Prerequisites sections).

## 5. Current git state

Latest commit on `origin/main`:

```
f06e294 Improve AI Command Center README onboarding
```

## 6. Key lessons

- **Exact file boundaries made scope easy to verify.** The plan named precise "must not touch"
  files (`package.json`, `.nvmrc`, engines field, root `README.md`, `CLAUDE.md`) rather than only
  describing behavior ("don't change how the app runs"), so Check could confirm scope discipline
  with a single `git diff --stat` instead of judging intent.
- **Real output verification via localhost/curl was valuable.** Do ran `npm run dev` and curled
  `localhost:3000`, extracting actual rendered heading text for the README's "verify it worked"
  description instead of inferring it from source. Check then independently re-ran the same check
  and got byte-for-byte matching headings — a stronger form of verification than reasoning about
  expected behavior.
- **Independent Plan/Do/Check convergence increased confidence.** All three stages independently
  re-derived the same facts (Node engine requirement, absence of env vars, clone URL) from the
  underlying source rather than passing along a prior stage's claim — three independent
  confirmations landing on the same answer is a stronger signal than one careful pass.
- **The docs-only cycle exposed, but intentionally did not fix, the Node version pin gap.** The
  README now documents a Node `>=20.9.0` requirement that still isn't enforced anywhere in the
  project's own config (no `.nvmrc`/`engines` field) — a deliberate, explicitly-flagged scope
  decision for this cycle, not an oversight, but the underlying gap remains open.

## 7. Recommended next actions

1. Consider a small cleanup for the duplicate "npm" wording between the README's Stack and
   Prerequisites sections (cosmetic, low priority).
2. Decide later whether to close the Node-version enforcement gap (add `.nvmrc`/`engines` to
   `projects/ai-command-center/package.json`) or affirmatively keep the requirement
   documentation-only permanently.
3. Reuse the "capture real output, don't infer" README verification pattern (run the app, curl/load
   it, extract real content) for other subprojects' READMEs if/when they get similar onboarding
   treatment.
