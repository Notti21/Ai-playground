# Retro — Add a PDCA Workflow Status section to AI Command Center

## What we learned

- **The `/pdca [goal]` loop now has a proven track record on application code, not just
  docs/workflow artifacts.** This is the first cycle where Do touched real product code
  (`projects/ai-command-center`) — a new component, a page wire-up, a README edit — driven by an
  explicit goal argument (as opposed to the prior cycle, which only exercised the no-argument
  fallback path). Plan → Do → Check → Act all executed cleanly against a real build/lint/dev-server
  target, with Check independently re-running `npm run build`, `npm run lint`, and its own dev
  server + curl/grep against live-rendered HTML rather than trusting the changelog. This is a
  meaningful capability milestone: the loop's discipline (scope-locking, independent
  re-verification, plan-vs-actual diffing) holds up outside the docs-only cases it was first proven
  on.

- **Scope discipline scales to code changes with an explicit out-of-scope list.** The plan named
  specific already-known stale items (`RecentActivity.tsx`'s placeholder, the stale
  `nextActions` entry in `src/data/actions.ts`) and explicitly deferred them rather than letting Do
  scope-creep into "fixing while I'm in there." Both Do and Check confirmed via `git diff` that
  those files were untouched. This is the same "don't fabricate/expand scope" discipline seen in
  earlier docs-only cycles, now validated on a cycle with a much larger tempting blast radius (a
  live Next.js app).

- **Writing fresh UI copy that describes the same facts as an existing canonical doc
  (`agents/README.md`'s `## Status` section) creates an accepted but real duplication risk.** The
  plan explicitly named this risk upfront and accepted the tradeoff (original wording over a
  link-out, per human decision). Check's independent content-accuracy pass surfaced that one
  paragraph tracks `agents/README.md`'s sentence structure/causal reasoning fairly closely even
  though it isn't copied text — a compliant-but-notable early signal of the drift risk the plan
  already flagged, not a new problem. Two independent English descriptions of the same underlying
  fact set (PDCA phase, subagent wiring) now exist in the repo (`agents/README.md` `## Status` and
  `PdcaStatus.tsx`), with no mechanism keeping them in sync.

- **The "durable capability over point-in-time counts" lesson from the `agents/README.md` "Phase 1"
  staleness fix (2026-07-22 cycle) transferred correctly to new UI copy.** Do deliberately avoided
  embedding any run/checkpoint count in `PdcaStatus.tsx`, and Check explicitly confirmed this in its
  review. This is a good sign the lesson from an earlier cycle is being actively applied, not just
  recorded.

## What changed in `notes/`

None. No notes/decisions update was made this cycle — the user did not instruct one, and while the
capability milestone (loop proven on application code) and the copy-duplication risk are both
plausibly durable-knowledge-worthy, that judgment call is left to the human for a future cycle
rather than made unilaterally here.

## Next Actions

1. **Decide whether to record a decision note** capturing that the `/pdca` loop is now proven
   end-to-end against real application code (not just docs), and that `PdcaStatus.tsx` +
   `agents/README.md`'s `## Status` section are now two independently-worded descriptions of the
   same underlying facts with no sync mechanism — worth a `notes/decisions/` entry only if the human
   wants this milestone and risk formally on record.
2. **Watch the content-drift risk** Check flagged: next time the PDCA workflow's phase/wiring
   changes (e.g. when MCP/Phase 5 lands), both `agents/README.md`'s `## Status` section and
   `PdcaStatus.tsx`'s copy will need updating together. Consider whether a future cycle should
   either (a) accept this as a recurring manual-sync chore and just remember to update both, or (b)
   revisit the "no link-out" decision if drift actually occurs once.
3. **`RecentActivity.tsx`'s stale "No activity yet" placeholder** — still deferred, unchanged from
   prior cycles' backlog. Candidate for a future cycle once there's a real data source to back it
   (e.g. parsing `agents/runs/` or `notes/checkpoints/`).
4. **`src/data/actions.ts`'s stale `nextActions` entry** ("Design the Plan/Do/Check/Act agent
   workflow") — still deferred, now even more clearly stale given this cycle proves Phase 4+ is not
   just designed but actively delivering code changes. Candidate for a small, low-risk future cycle.

These are proposals only, feeding the next Plan cycle — the human orchestrator selects which one
(if any) starts next.
