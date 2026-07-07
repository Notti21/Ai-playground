# Business OS — Capability Map (v1)

This document defines the first version of the capabilities Business OS is built from. It exists so that anyone — human or AI agent — deciding where a new piece of work belongs can check this map first, instead of guessing or inventing a new structure ad hoc. It should be read alongside `docs/business-os-manifesto.md` (the why) and `notes/decisions/2026-07-08-ai-organization-design.md` (the PDCA agent design).

This is v1. It will evolve — but per the manifesto's principle that decisions are permanent, changes to this map should happen through a new entry in `notes/decisions/`, not by silently rewriting history here.

## How the capabilities relate

Three rough layers — foundation, working layer, and visible payoff. Nothing above a layer works well if the layer below it is weak:

```
 Visible layer:     Dashboards        Business Applications
                         ▲                     ▲
 Working layer:     Projects   Workflows   Agents   Integrations
                         ▲           ▲         ▲          ▲
 Foundation layer:  Identity ───── Knowledge ───── Decisions
```

Foundation capabilities (Identity, Knowledge, Decisions) are what everything else depends on. The working layer (Projects, Workflows, Agents, Integrations) is where day-to-day activity happens. The visible layer (Dashboards, Business Applications) is the payoff — what a business operator actually sees and uses.

---

## Identity

**Purpose:** Establish who and what this system is — its mission, its principles, its shared vocabulary, and the roles (human and AI) involved in running it.

**What it contains:** `CLAUDE.md` (engineering-facing conventions), `docs/business-os-manifesto.md` (the business-facing identity and principles), `agents/roles/*.md` (the org chart, as role definitions).

**Why it matters:** Every other capability assumes a shared vocabulary and a shared set of principles. Without an explicit Identity layer, every project quietly reinvents its own conventions, and terms start meaning different things in different places (e.g. "project" meaning one thing in Automation and another in CRM).

**What future modules may depend on it:** Everything. Knowledge, Projects, Workflows, and Agents all inherit their vocabulary and principles from here. Onboarding any new human or AI collaborator starts with this layer.

---

## Knowledge

**Purpose:** Be the durable, compounding memory of the business — decisions, architecture understanding, and lessons learned, kept in a form that outlives any single conversation or tool.

**What it contains:** `notes/` (`decisions/`, and future `architecture/`), `prompts/` (reusable, tool-agnostic instructions), and `agents/runs/*/retro.md` (working memory that feeds this layer).

**Why it matters:** This is the compounding engine described in the manifesto. Without it, every PDCA cycle starts from zero and the business re-learns the same lessons repeatedly instead of building on them.

**What future modules may depend on it:** Agents read Knowledge before planning anything new. Workflows, once proven, get written down here so they can be reused instead of re-invented. Business Applications should check Knowledge before building something that already has a documented answer. Decisions (below) is Knowledge's most disciplined, permanent subset.

---

## Projects

**Purpose:** The unit of "a deliverable being built" — the concrete initiatives the business is actually running: CRM, WMS, Automation, Jula AI OS, AI Command Center.

**What it contains:** The `projects/` folder — one subfolder per initiative, each with its own scoped conventions (e.g. `projects/ai-command-center/README.md`).

**Why it matters:** Gives every initiative a clear home and boundary, preventing sprawl where everything lives loose at the repo root. Gives a future Architect-type review something concrete to reason about: "does this belong to an existing project, or does it need a new one?"

**What future modules may depend on it:** Workflows and Business Applications are built inside a Project. Agent PDCA cycles (`agents/runs/`) are almost always scoped to one Project. Dashboards visualize Projects' state.

---

## Workflows

**Purpose:** Reusable, repeatable sequences of steps the business runs — not one-off tasks, but processes worth naming and doing the same way every time (e.g. "customer intake," "invoice reconciliation," "run a PDCA cycle").

**What it contains:** Today, the closest existing home is `automation/` (Gmail, Drive, API integrations). Going forward, a workflow should be written down (in `notes/`) before it's automated — the definition comes first, the automation second.

**Why it matters:** This is where "continuous improvement" becomes concrete. A process that's been done the same way three times by hand should graduate into a named, documented Workflow, rather than being reconstructed from memory each time.

**What future modules may depend on it:** Business Applications are often the automated, productionized version of a proven Workflow. Agents (especially Do) execute Workflows. Integrations are what let a Workflow actually reach outside this repo into the real world.

---

## Agents

**Purpose:** The AI workforce — the PDCA roles (Plan, Do, Check, Act) and the proposed future roles (Architect, Orchestrator) that do the structured cognitive work of the business.

**What it contains:** The `agents/` folder (`README.md`, `roles/`, `runs/`) — Phase 1 of this is already built.

**Why it matters:** This is the "how work actually gets done" engine. Without it, Business OS would just be documentation with no mechanism for execution.

**What future modules may depend on it:** Workflows, once mature, get executed by Agents. Decisions and Knowledge entries are produced by Agents (via the Act role). Dashboards eventually show Agents' real activity, once that activity is real rather than a placeholder.

---

## Decisions

**Purpose:** The immutable, permanent record of structural and architectural choices — the business's accumulated rulings, one at a time.

**What it contains:** `notes/decisions/*.md` — one file per decision, named `YYYY-MM-DD-<slug>.md`, never edited after the fact. A changed decision gets a new file that supersedes the old one.

**Why it matters:** Prevents relitigating settled questions, and lets any future human or agent understand *why* the system is shaped the way it is, without having needed to be present when it was decided.

**What future modules may depend on it:** Every other working-layer capability (Projects, Workflows, Agents, Integrations) should be checked against Decisions before building something that contradicts a past choice. This is precisely the job the proposed Architect role would formalize.

---

## Integrations

**Purpose:** The system's connections to the outside world — the external tools and data sources the business actually depends on.

**What it contains:** Currently roadmap-only. The `mcp/` folder is reserved for this. Planned: a GitHub MCP server, a Gmail/Drive MCP server, and eventually a project-tracker MCP server (see the Future MCP Integrations section of the AI Organization design decision).

**Why it matters:** Without Integrations, Agents and Workflows can only act on things already inside this repository. Real business operation requires touching real external systems — email, files, code hosting, and eventually live CRM/WMS data.

**What future modules may depend on it:** Workflows need Integrations to execute in the real world, not just on paper. Business Applications will need Integrations to sync with external systems. Dashboards may eventually pull real data through Integrations instead of static placeholders.

---

## Dashboards

**Purpose:** The visible surface where a human checks status and decides what to do next.

**What it contains:** `projects/ai-command-center` — the Agent System, Projects, Tools, Knowledge Base, Recent Activity, and Next Actions sections already built.

**Why it matters:** A business operator needs one place to see the state of the whole system at a glance, rather than reading folders and files directly. Dashboards are the windshield, not the engine.

**What future modules may depend on it:** Nothing depends on Dashboards — they are a consumer, not a foundation. But Dashboards depend on nearly everything above having real data to show, which is exactly why AI Command Center currently displays honest placeholders instead of invented activity.

---

## Business Applications

**Purpose:** The actual line-of-business software the company runs on once it exists — CRM, WMS, and whatever comes after.

**What it contains:** Not built yet. Future subfolders of `projects/` (e.g. `projects/crm`, `projects/wms`).

**Why it matters:** This is the ultimate payoff of Business OS — the reason the foundation is worth building carefully now is so that these applications, when built, are coherent, well-documented, and backed by a real process, instead of being one-off scripts with no memory of why they exist.

**What future modules may depend on it:** Nothing yet — these don't exist. Once built, they will depend on everything above: Identity's conventions, Knowledge's accumulated decisions, Workflows' proven processes, Agents' execution loop, Integrations' external connections, and Dashboards to expose their state.

---

## What's honestly not here yet

Per the manifesto's "never fabricate" principle: Integrations and Business Applications are entirely aspirational at this point — no MCP servers and no CRM/WMS code exist yet. This map describes where they will plug in when built, not something already running.
