# AI Organization

This folder is the operating manual for how AI agents work in this repository. It implements the Plan → Do → Check → Act (PDCA) loop described in `notes/decisions/2026-07-08-ai-organization-design.md`, with you as the system designer and final decision-maker at every step.

## Who's who

```
                    You — System Designer
                 (goals, approvals, final call)
                              │
                        Orchestrator
                (you, for now — see Status below)
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

## Folder guide

- `roles/` — one file per agent: its mission, inputs, responsibilities, what it must NOT do, and its output format.
- `runs/` — one folder per PDCA cycle, named `<date>-<slug>`. This is the case file for that cycle (plan, changelog, review, retro). Not created yet — the first one is created when you run your first cycle.

## Status: Phase 1

This is role-definition only. There is no automation yet:

- No subagents wired up.
- No slash command.
- No MCP integration.

Every step is currently done by hand: you open a Claude Code session and explicitly tell it to act as a given role, using that role's file as its instructions. See the accompanying chat explanation for exactly how to run your first cycle.
