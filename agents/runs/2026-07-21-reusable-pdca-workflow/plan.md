# Plan Document — Reusable PDCA Workflow Command

**Run folder:** `agents/runs/2026-07-21-reusable-pdca-workflow/`
**Date:** 2026-07-21

## Goal

Graduate the now-five-times-repeated, identical Plan → Do (main session) → Check → Act sequence
into a single, reusable, invocable workflow artifact — so starting a new PDCA cycle takes one
command instead of manually re-explaining and re-sequencing each role invocation by hand — while
preserving both existing human approval gates (before Do implements, and before anything is
committed) and the existing role boundaries (no Do subagent; Plan/Check/Act keep their current,
narrow tool access).

## Scope

**In scope:**
- Creating `.claude/commands/pdca.md` as a Claude Code project slash command, invoked as
  `/pdca [goal]`, where the goal argument is **optional** (see Steps below for the no-argument
  fallback behavior).
- Drafting the content of this single new workflow artifact that sequences: invoke Plan → **stop
  for human approval** → Do implements in the main session → invoke Check → invoke Act (no
  approval gate between Check and Act, matching all five prior cycles' precedent) → present Check's
  verdict and Act's Next Actions → **stop for human approval before any commit**.
- A smoke test of the new artifact on a small, real, low-risk goal (analogous to how Plan, Check,
  and Act were each smoke-tested individually per `notes/checkpoints/2026-07-20-pdca-subagents.md`),
  stopping at the first approval gate rather than running a full cycle end-to-end.
- Filing a Next Action (for Act to record/propose at this cycle's close) recommending that
  `agents/README.md`'s stale "Phase 1 ... No subagents wired up ... No slash command" wording be
  fixed in a future cycle. This cycle only files that recommendation — it does not act on it.

**Out of scope (this cycle):**
- Any change to `agents/roles/*.md` or `.claude/agents/*.md` (Plan/Check/Act's canonical definitions
  and their subagent wrappers) — the new artifact must reference these, not restate or fork them.
- Any change to AI Command Center or any other application code.
- **Any change to `agents/README.md` whatsoever** — not the stale Phase 1 status wording, and not a
  new pointer line to `.claude/commands/pdca.md` either. Confirmed by the human: leave
  `agents/README.md` completely untouched this cycle; a Next Action is filed instead (see above) for
  a future cycle to address it.
- Building a Do subagent, an autonomous orchestrator, or any MCP-based trigger.

## Proposed file path

**`.claude/commands/pdca.md`** — a Claude Code project slash command (invoked as `/pdca [goal]`),
following the exact naming pattern Claude Code uses for custom commands, and living as a sibling of
the already-established `.claude/agents/` folder. Confirmed by the human: `/pdca` matches the
roadmap's Phase 4 language in `notes/decisions/2026-07-08-ai-organization-design.md` ("Turn the
cycle into a `/pdca` skill").

### Candidates considered

| Candidate | Verdict | Why |
|---|---|---|
| `agents/workflows/pdca-cycle.md` (new folder) | Rejected | Mirrors `agents/README.md`'s existing `roles/` / `runs/` folder-guide pattern and would sit naturally in the Agents capability area, but it is pure prose — a human would still have to open it and manually copy/re-type each step. Doesn't address the stated goal ("less manual prompting"), only "better documented," which the process already has via `agents/README.md` and three checkpoints. |
| `prompts/` (existing, currently-empty folder) | Rejected | The 2026-07-08 design decision explicitly defines `prompts/` as "reusable, **tool-agnostic** prompt snippets" (works under Claude Code, Codex, or otherwise). This artifact's whole content is Claude-Code-specific orchestration (invoking Plan/Check/Act *by subagent name*, which only exist as `.claude/agents/*.md` definitions) — putting it in `prompts/` would violate that folder's own established purpose the first time it's used. |
| `agents/README.md` itself (new section, no new file) | Rejected | Zero new files, and it's already the first thing read, but it is reference documentation, not something a human can invoke — doesn't reduce prompting effort, just centralizes the explanation that already exists across `agents/README.md` and the checkpoints. Weakest match to the stated goal. |
| **`.claude/commands/pdca.md`** | **Chosen** | Claude Code's native mechanism for exactly this: a human types `/pdca [goal]` once instead of manually asking for Plan, waiting, then remembering to separately invoke Check and Act later. `.claude/` is already this repo's designated home for Claude-Code-tool-specific wiring (it holds `.claude/agents/`), so `.claude/commands/` is a natural sibling of an already-accepted convention, not a new kind of structure. Tradeoff: it is Claude-Code-specific (won't transfer to Codex or another tool the way `agents/roles/*.md` does by hand) — accepted as reasonable since the subagents it invokes are already Claude-Code-specific too. |

## Steps

1. Do reads `agents/README.md`, all four `agents/roles/*.md` files, and all three `.claude/agents/*.md`
   subagent wrappers in full before drafting anything, so the command references the canonical
   definitions rather than duplicating or drifting from them.
2. Do creates `.claude/commands/pdca.md` with:
   - Front-matter (`name`, `description`, and an argument hint indicating the goal text is
     optional, e.g. `[goal]`).
   - A body that explicitly sequences, in order: (a) invoke the `plan` subagent — if a goal was
     given, pass it as the stated goal; if no goal was given, instruct the `plan` subagent to fall
     back to the latest checkpoint's Next Actions, exactly as `agents/roles/plan.md` and the Plan
     subagent wrapper already do on their own when invoked without an explicit goal (see concrete
     no-argument fallback step below) — producing `agents/runs/<date>-<slug>/plan.md`; (b) **stop
     and present the plan to the human; do not proceed until the human explicitly approves it** —
     this gate must be worded so it cannot be read as optional or skippable; (c) once approved,
     implement the plan in the main session (Do), writing `changelog.md`, per `agents/roles/do.md`;
     (d) invoke the `check` subagent to produce `review.md`; (e) immediately invoke the `act`
     subagent to produce `retro.md` — **no human approval gate between (d) and (e)**, matching every
     prior cycle's precedent, confirmed by the human for this cycle; (f) present Check's verdict and
     Act's Next Actions to the human and **stop — do not commit anything** until the human
     explicitly asks for a commit, independent of the plan-approval gate in step (b).
   - **Concrete no-argument fallback step:** the command's body must explicitly state that when
     `/pdca` is invoked with no goal argument, it should not error or ask the human to restate a
     goal — instead it passes no goal to the `plan` subagent, letting Plan apply its own existing
     documented fallback (checking `notes/checkpoints/` for the latest checkpoint's Next Actions
     first, per `agents/roles/plan.md`'s Inputs section and the Plan subagent wrapper's "Locating
     cycle inputs" section, before falling back further to `agents/runs/*/retro.md` only if
     explicitly relevant). The command must not reimplement or duplicate this fallback logic itself
     — it only needs to omit forcing a goal argument and let Plan's existing behavior take over.
   - An explicit statement that the command must never create or invoke a "Do subagent" — Do always
     runs in the main session, per the twice-reaffirmed design rationale.
3. Do smoke-tests the command on one small, real, low-risk goal, stopping deliberately at the first
   approval gate (mirroring how the Plan subagent's own smoke test in
   `agents/runs/2026-07-16-readme-run-instructions/` produced a real plan without running a full
   cycle) — confirming the command correctly invokes Plan and correctly halts for approval, without
   proceeding to Do.
4. Do records what happened in `changelog.md` for this cycle, including the smoke test's outcome and
   the exact wording used for both approval gates (so Check can independently verify the gates hold,
   not just that the file exists).
5. Do does **not** touch `agents/README.md`, `agents/roles/*.md`, or `.claude/agents/*.md` as part of
   this cycle, under any circumstances — confirmed by the human, no conditional exception remains.
6. Do ensures a Next Action recommending a future fix to `agents/README.md`'s stale Phase 1 status
   wording is captured so Act can surface it in `retro.md` at cycle close (e.g., noted in
   `changelog.md` for Act to pick up, consistent with how prior cycles have carried forward
   Next Actions).

## Risks

- **A slash command is a strong prompt, not an enforced control.** Nothing in Claude Code mechanically
  prevents the assistant from reading past a "stop and wait for approval" instruction within one
  continuous turn. The wording must be unambiguous (e.g., an explicit "STOP" instruction that ends
  the assistant's turn) and Check must verify this empirically by actually invoking the command,
  not just by reading the file and assuming the prompt will be obeyed.
- **Untested mechanism.** Project-level custom slash commands under `.claude/commands/` are a Claude
  Code feature this repo has not previously used (only `.claude/agents/` subagents exist so far) —
  the smoke test in Step 3 is the first real confirmation it behaves as documented in this
  environment; if it doesn't, the fallback is the existing manual invocation process, which remains
  fully functional regardless.
- **Gate-blurring risk.** Because the command chains multiple stages in one artifact, there's a risk
  future edits could quietly merge the two approval gates into one, or drop the second (pre-commit)
  gate entirely, since it's easier to notice a missing Plan-approval pause than a missing
  pre-commit pause at the very end of a long sequence.
- **No-argument fallback ambiguity.** If Plan's own fallback logic ever changes (e.g., it starts
  reading `agents/runs/*/retro.md` more broadly instead of just the latest checkpoint), `/pdca`'s
  no-argument behavior will silently change with it since the command intentionally delegates to
  Plan rather than duplicating the logic. Accepted as correct per the human's explicit instruction
  to mirror Plan's existing behavior rather than fork it.
- **Name-coupling.** The command references the `plan`, `check`, and `act` subagents by name — if
  those are ever renamed or removed, the command will fail silently or reference the wrong thing.
- **Scope-creep pressure toward a Do subagent.** A single command that "runs the whole cycle" may
  create an implicit expectation that Do should also be automated inside it; the command's wording
  needs to explicitly reaffirm the existing, twice-reaffirmed rationale for keeping Do manual so this
  doesn't get quietly eroded later.
- **Deferred README staleness.** Leaving `agents/README.md`'s inaccurate "Phase 1 / no subagents /
  no slash command" wording untouched for another cycle means the repo's own front-door
  documentation will remain visibly wrong for at least one more cycle. Mitigated by filing an
  explicit Next Action (Steps, item 6) so it isn't lost, but the staleness itself persists until a
  future cycle acts on it.

## Open Questions

None remaining. All five questions raised in the prior draft of this plan were resolved by explicit
human decision on 2026-07-21:

1. `agents/README.md` staleness — leave untouched this cycle; file a Next Action for a future cycle
   instead (see Steps item 6, Scope, and Non-Goals).
2. README pointer line — also declined; `agents/README.md` is not touched at all this cycle.
3. Command name — confirmed `/pdca`, matching the roadmap's Phase 4 language.
4. No-argument fallback — confirmed in scope; `/pdca` supports no-goal invocation, delegating to
   Plan's existing checkpoint-fallback behavior (see Steps item 2's concrete fallback step).
5. Check→Act gate — confirmed no approval gate between Check and Act, matching all five prior
   cycles' precedent.

## Non-Goals

- No Do subagent, now or as a follow-on to this cycle — Do stays in the main session, per
  `notes/checkpoints/2026-07-20-pdca-subagents.md` section 3.
- No changes to AI Command Center's UI or any other application code anywhere in the repo.
- No MCP integration or other external automation (Phase 5+ of the roadmap, not this cycle).
- No autonomous orchestrator — the human remains the one who types `/pdca`, the one who approves the
  plan, and the one who approves the commit; the command only removes re-typing/re-explaining, not
  the decision points themselves.
- No rewriting or restating of `agents/roles/*.md` or `.claude/agents/*.md` inside the new command —
  it must reference them, not fork their content.
- **No changes to `agents/README.md` in this cycle, in any form** — neither fixing the stale Phase 1
  status wording nor adding a pointer line to the new command. Confirmed by explicit human decision;
  a Next Action recommending a future-cycle fix is filed instead (see Steps item 6).
- No new approval gate introduced between Check and Act — the existing back-to-back Check → Act
  sequence (no human approval pause in between) is preserved as-is.
</content>
