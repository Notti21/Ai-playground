# Agent Compute Governance

**Date:** 2026-09-19
**Status:** Accepted
**Scope:** Cross-project AI Command Center policy. Not specific to any one project.

## Context

The PDCA workflow in this repo delegates Plan, Check, and Act to subagents and, when the risk
justifies it, can run several independent agents in parallel. Nothing so far has said *how many*
agents a given piece of work should use. Without a rule, the default drifts toward launching many
agents whenever capacity is available, which costs compute and wall-clock time, duplicates work,
and creates the risk of more than one agent changing the same code.

Recent work on Store Care Program illustrates both sides: a six-agent production-readiness audit
was a good use of independent review, but several of those agents were interrupted by a session
limit and had to be relaunched, and a separate Plan agent stalled before producing output.
Multi-agent work is valuable where independent judgment reduces real risk, and wasteful where it
substitutes for a clearer task.

## Decision

### Principle

Use the smallest number of agents that can reliably handle the risk.

More agents are not automatically better. Do not use multi-agent work to compensate for an unclear
task — clarify the task with the human first.

### Levels

**Level 1 — Routine / Execution.** Default: **1 agent.**
Use for small UI changes, wording, known bug fixes, isolated tests, small migrations, and
implementation of an already-approved plan. No architecture debate unless new evidence appears.

**Level 2 — Important Design Change.** Default: **2–3 agents.**
Use for workflow changes, schema changes, permissions, data-model changes, and significant product
behaviour. Suggested perspectives:

1. Product / Business
2. Architecture / Data
3. Check / Security

The main agent synthesizes the findings before implementation.

**Level 3 — High Risk / Strategic.** Default: **4–6 independent agents.**
Use only for production-readiness reviews, security audits, major architecture decisions, large
data migrations, high-impact authorization changes, and situations where previous reviews may be
wrong. Agents review independently before synthesis.

### PDCA agent policy

| Phase | Default | Higher-risk work |
|---|---|---|
| **Plan** | 1 agent | Major change: 2–3 independent perspectives |
| **Do** | 1 implementation agent | Never more than one agent modifying the same code area concurrently |
| **Check** | 1 independent reviewer | High-risk work: 2–4 independent reviewers |
| **Act** | 1 synthesis agent | — |

Act must classify each item as one of:

- **fix now**
- **defer**
- **reject**
- **open a new PDCA cycle**

### Compute rules

1. Start small and escalate only when justified.
2. Independent review is more valuable than duplicated implementation.
3. Never launch many agents just because capacity is available.
4. Do not restart completed agent work unnecessarily.
5. Resume interrupted agents instead of rerunning the entire audit.
6. Separate implementation cycles from audit cycles.
7. Human approval remains the hard gate for major architecture, infrastructure, security, and
   product decisions.

### Human approval is preserved

This policy governs how many agents are used and how they are arranged. It does not grant agents
any additional authority. Agent count, agent consensus, or a clean review never substitutes for
the human's explicit approval on major architecture, infrastructure, security, or product
decisions, and it does not change the existing approval gates in the PDCA workflow (approval
before Do, and a separate instruction before any commit or push).

## Examples

The following are illustrations of how the levels might apply. They are examples drawn from Store
Care Program work, **not** Store Care–specific rules, and they do not bind any project.

| Situation | Suggested arrangement |
|---|---|
| Small bug fix | 1 Do + 1 Check |
| End-to-end verification | 1 agent |
| Store Intelligence analysis | 1–2 agents |
| Store Intelligence schema design | 3 perspectives |
| Auth / RLS / security | Minimum 2 perspectives |
| Production-readiness audit | 4–6 agents |

## What this does NOT decide

- **It does not modify the `/pdca` skill** (`.claude/skills` / command definition) or the role
  definitions in `agents/roles/` and `.claude/agents/`. Encoding these levels into those files is
  a possible follow-up and would be its own reviewed change.
- **It sets no numeric compute budget** (token caps, time limits, or cost ceilings) and adds no
  automated enforcement. The levels are defaults and guidance applied by judgment and by the
  human's direction.
- **It does not assign a level to any specific piece of work.** Choosing the level for a given
  cycle remains a judgment call, and the human may override it in either direction.
- **It does not retroactively reclassify or invalidate earlier cycles.** Prior work stands as
  recorded in its own run folders.
- **It does not change any project's code, schema, infrastructure, or product scope.**

## Consequences

- Routine and already-approved work defaults to a single agent, reducing cost and the risk of
  conflicting edits.
- Independent multi-agent review is reserved for work where being wrong is expensive, and is
  explicitly expected there.
- Escalating beyond a level's default should be a stated, justified choice rather than an
  accident of available capacity.
- Interrupted agent work is resumed rather than repeated, so partial results are not thrown away.
- Act's four-way classification gives every finding an explicit disposition instead of leaving
  open items ambiguous.
- If the levels prove useful in practice, a later, separate decision can encode them into the
  `/pdca` command and the role files. Any changes to this policy are recorded as a new
  `notes/decisions/` entry rather than an edit to this one.
