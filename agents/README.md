# AI Organization

This folder is the operating manual for how AI agents work in this repository. It implements the Plan → Do → Check → Act (PDCA) loop described in `notes/decisions/2026-07-08-ai-organization-design.md`, with you as the system designer and final decision-maker at every step.

## Who's who

```
                    You — System Designer
                 (goals, approvals, final call)
                              │
                        Orchestrator
              (/pdca sequences it; you still set the
                goal and approve — see Status below)
                              │
              ┌───────┬───────┼───────┬───────┐
             Plan     Do    Check    Act
```

Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they're what the loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.

## How one cycle works

1. **You** state a goal.
2. **Plan** (`roles/plan.md`) turns it into a Plan Document. You review and approve it.
3. **Do** (`roles/do.md`) implements the approved plan.
4. **Check** (`roles/check.md`) reviews the output against the plan.
5. **Act** (`roles/act.md`) summarizes what was learned, updates `notes/`, and proposes the next goal.

These five steps can still be run by hand, or sequenced automatically with the `/pdca [goal]` slash
command (see Status below) — either way, Do always runs in the main session (never a subagent), and
the loop still stops for your explicit approval before Do starts and again before anything is
committed.

## Folder guide

- `roles/` — one file per agent: its mission, inputs, responsibilities, what it must NOT do, and its output format.
- `runs/` — one folder per PDCA cycle, named `<date>-<slug>`. This is the case file for that cycle (plan, changelog, review, retro). Several cycles have been run; see `notes/checkpoints/` for a rolling summary of what's been completed.

## Status: Phase 4 complete

Plan, Check, and Act are wired up as Claude Code subagents (`.claude/agents/plan.md`, `check.md`, `act.md`) — each a thin wrapper around its canonical role file in `roles/`. Do intentionally remains the main session rather than a subagent, since it needs the broadest tool access (see `notes/checkpoints/2026-07-20-pdca-subagents.md`, section 3, for the reasoning). A `/pdca [goal]` slash command (`.claude/commands/pdca.md`) now sequences a full cycle — Plan → stop for your approval → Do → Check → Act → stop again before any commit — so starting a cycle no longer requires manually re-invoking each role by hand. You can still invoke any role manually instead of via `/pdca` if you want finer-grained control over a step.

Not yet done: MCP integration (Phase 5 of the roadmap in `notes/decisions/2026-07-08-ai-organization-design.md`).
