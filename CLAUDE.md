# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a long-term personal AI Engineering Playground. Its goals:

- Learn AI engineering by building real projects, not toy snippets.
- Experiment with Claude Code, Codex, MCP, GitHub, and automation workflows.
- Incubate software that can eventually support real business needs (CRM, WMS, dashboards, AI assistants).

Treat this repo as a long-lived workspace that will accumulate many small, independent projects over time rather than a single application with one build/test pipeline.

## Repository structure

- `automation/` — Workflow automation: Gmail, Google Drive, other API integrations.
- `experiments/` — Small, disposable experiments and new framework trials / AI testing.
- `mcp/` — MCP servers, MCP clients, MCP experiments.
- `notes/` — Architecture notes, learning notes, design decisions.
- `prompts/` — Reusable prompts and AI instructions.
- `python/` — Python scripts and utilities.

The repo is currently a skeleton (empty placeholder directories, no code yet). There is no single build/lint/test command to run at the repo root — each subproject will establish its own tooling as it's built. When you add the first real project to a directory, set up its build/lint/test commands there and document them (e.g. in a README or notes entry) rather than inventing repo-wide conventions.

## Working conventions

- Explain before changing code — describe what you're about to do and why before editing.
- Keep architecture simple — avoid premature abstraction or infrastructure for a playground/experiment.
- Ask before major changes — new dependencies, new frameworks, restructuring directories, or anything spanning multiple subprojects.
- Never fabricate requirements — if scope or intent is unclear, ask rather than assume.
- Prefer maintainable code over clever code.
- Document important decisions — architecture notes and non-obvious design decisions belong in `notes/`.
