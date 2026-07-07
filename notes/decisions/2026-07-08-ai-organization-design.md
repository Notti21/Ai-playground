# AI Organization Design

**Date:** 2026-07-08
**Status:** Accepted (Phase 1 implemented: role definitions only, no automation)

## Context

This repository started as a personal AI Engineering Playground and produced its first real project, AI Command Center. The intent for AI Command Center was always to grow beyond a homepage into a dashboard for AI tools, CRM, WMS, automation, and other business applications.

Rather than let that growth happen ad hoc, this decision defines how AI agents operate across the whole repository — the "AI Organization" — before more features are built.

## Decision

Adopt a Plan → Do → Check → Act (PDCA) loop as the operating model, with the human (system designer) as the final decision-maker at every step.

### Organization chart

```
                    You — System Designer
                 (goals, approvals, final call)
                              │
                        Orchestrator
                (you, for now — not an autonomous agent)
                              │
              ┌───────┬───────┼───────┬───────┐
             Plan     Do    Check    Act
                              │
                     Shared Services
              (notes/, prompts/, future MCP tools)
```

Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they are what the loop is applied to. The Orchestrator role is intentionally *not* a fifth autonomous agent yet: giving it autonomy now would contradict the human-as-decision-maker principle. It starts as the human, sequencing role invocations by hand.

### Agent responsibilities, inputs, and outputs

| Agent | Responsible for | Not responsible for | Input | Output |
|---|---|---|---|---|
| Plan | Turning a goal into a reviewable plan | Implementation, final decisions | A goal | Plan Document |
| Do | Implementing an approved plan | Deciding scope | Approved Plan Document | File changes + Change Log |
| Check | Reviewing output against the plan | Fixing issues itself | Change Log + diff + Plan | Review Report |
| Act | Capturing learnings, proposing next steps | New implementation | Review Report + Plan + Change Log | Notes update + Next Actions |

### Communication

Agents communicate through plain markdown files in a shared run folder (`agents/runs/<date>-<slug>/`) — no message queue or database. This is deliberately the simplest mechanism that works, versioned by git and human-readable. It may later be replaced or supplemented by an MCP-based mechanism (see Future MCP Integrations below), but only once a concrete need appears.

### Folder structure

```
agents/
├── README.md
├── roles/
│   ├── plan.md
│   ├── do.md
│   ├── check.md
│   └── act.md
└── runs/
    └── <date>-<slug>/
        ├── plan.md
        ├── changelog.md
        ├── review.md
        └── retro.md
```

`agents/runs/` holds working case files, scoped to one cycle. It is not where durable knowledge lives — that continues to live in the existing `notes/` and `prompts/` folders, which Act curates into. No separate `agents/memory/` folder was created, to avoid two competing homes for the same kind of fact.

### Prompt structure

Every file in `agents/roles/` follows a fixed template: Mission, Inputs, Responsibilities, Out of Scope, Output Format, Handoff, Operating Principles. This keeps the four roles consistent and prevents scope drift between them.

### Memory strategy

Three distinct layers, kept deliberately separate:

1. **Working memory** — `agents/runs/<run>/*.md`, scoped to one cycle. Git history is the audit trail, not manual archiving.
2. **Durable organizational knowledge** — `notes/` (decisions, architecture) and `prompts/` (reusable instructions). Tool-agnostic, since it's plain files in git — works whether the tool in use is Claude Code, Codex, or something else later.
3. **Private assistant memory** — the AI assistant's own cross-session memory of user preferences (e.g., "explain every file and dependency"). Deliberately lightweight and personal; project knowledge does not belong here, since it wouldn't transfer across tools or collaborators.

No vector database / RAG layer is introduced at this stage — there is no search problem yet that plain files can't solve.

### Knowledge management

- One home per kind of fact — no duplication between `agents/runs/` and `notes/`.
- `notes/decisions/YYYY-MM-DD-<slug>.md` — immutable point-in-time records (this file is the first one). Superseded by a new file if a decision changes, never edited after the fact.
- `notes/architecture/<topic>.md` — living documents, updated as understanding evolves.
- `prompts/` — reusable, tool-agnostic prompt snippets.
- Every `agents/runs/.../retro.md` that produces a lasting decision links to the `notes/decisions/` file it created, rather than being the permanent record itself.

### Future MCP integrations (not built yet)

- GitHub MCP — Do commits/opens PRs directly; Check reads real CI/PR state.
- Gmail / Google Drive MCP — Do executes real automations; Plan/Act read source documents directly.
- A project-tracker MCP (Linear/GitHub Issues) — Plan's Steps become real tracked tickets; AI Command Center's "Next Actions" section could read from here instead of static data.
- A knowledge MCP server — once `notes/` outgrows manual browsing.
- CRM/WMS MCP servers — once those projects exist, for direct read/write access to real business data.

### Roadmap

| Phase | What happens |
|---|---|
| 0 | Design agreed (this document) |
| 1 | **This phase.** `agents/roles/*.md` scaffolded; this decision recorded. Fully manual. |
| 2 | Wrap each role as a Claude Code subagent definition |
| 3 | Run one real, small PDCA cycle end-to-end; revise templates based on what breaks |
| 4 | Turn the cycle into a `/pdca <goal>` skill |
| 5 | First MCP integration: GitHub |
| 6 | Run the system on a project other than AI Command Center |
| 7 | Revisit memory/knowledge scaling only if `notes/` or `agents/runs/` become unwieldy |

## Consequences

- No automation, subagents, or MCP integration exists yet — every cycle today requires you to manually invoke each role in a Claude Code session.
- Future features should be built *through* this loop (Plan approved before Do starts) rather than around it, once Phase 3 validates the workflow on a real task.
- `notes/` and `prompts/` now have a defined purpose and naming convention; new decisions should follow the `YYYY-MM-DD-<slug>.md` pattern established here.
