# Store Care Program — Product / MVP Definition

**Status:** Accepted 2026-09-08
**Cycle:** `agents/runs/2026-09-08-store-care-program-mvp-definition/`
**Phased plan:** see Part 3 of that cycle's `plan.md` (not repeated here).

Store Care Program is one of the four applied project areas
(`notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`) and is
intended to be the first real business application built under Business OS. This document is
the accepted MVP definition. It supersedes the idea-stage placeholder description in
`projects/ai-command-center/src/data/projects.ts` as the product's source of truth (that entry
may be updated to point here in a later cycle).

Every line is tagged **[CONFIRMED]** (traces to a human answer in the definition cycle or a
quoted repo source) or **[OPEN]** (the human explicitly deferred it). No **[OPEN]** item may be
turned into an assumption — the open items are resolved by the workflow-definition cycle and
the tech-stack decision cycle that follow this one.

---

## 1. Problem statement — [CONFIRMED]

Store follow-up today is fragmented. Issues are discovered during store visits or follow-ups,
but ownership is unclear; follow-up actions often lack a clear due date; store information is
passed via chat or verbally; and management cannot easily see what is open, overdue, or
resolved. As a result, important store-level issues get dropped or are followed up
inconsistently.

**v1 is worth using if** it makes every important store issue visible, assigned, followed up,
and closed systematically.

## 2. Primary user — [CONFIRMED intent] / [OPEN: exact job title]

- **[CONFIRMED]** The single primary user is the Jula's Herb person responsible for visiting
  and following up with stores and for making sure store-level issues get resolved.
- **[CONFIRMED]** The MVP is **mobile-first** — most use happens while visiting or following up
  a store — but must also work from a laptop at HQ (responsive web).
- **[CONFIRMED]** Offline mode is **not** required for v1, unless it is later confirmed that
  visits regularly happen with unusable connectivity.
- **[OPEN]** The exact job title of this primary user. The human will confirm it. It is not
  assumed anywhere.

## 3. The one core workflow — the v1 spine — [CONFIRMED shape]

The v1 backbone is **"store visit / follow-up → issue/action tracking → closure"** — **not**
all six intent areas from the placeholder description treated as equal modules.

Confirmed step shape (exact fields per step are **[OPEN]** — resolved by the workflow-definition
cycle):

1. User selects a store.
2. User records a visit / follow-up.
3. User records important findings.
4. A finding that needs action becomes an issue / action.
5. The issue has an owner and a due date.
6. The responsible person follows up.
7. The issue is marked resolved / closed with an outcome.
8. Management can see open / overdue / resolved issues by store.

**[OPEN]** A real worked example and the exact field-level workflow — the human will supply
these. The checklist and issue categories must not be invented.

## 4. MVP scope boundary

### In scope for v1 — [CONFIRMED]

- The 8-step spine in section 3, for **one operational user role**.
- Persisting three kinds of record: Store, Visit/Follow-up, Issue/Action (see section 5).
- The two priority outputs in section 6.
- A minimal two-role model (see section 7).
- Mobile-friendly responsive web.

### Explicitly OUT of scope for v1 — [CONFIRMED]

- CRM / customer / member management (owned by the CRM project area).
- WMS / inventory / stock-movement / stock-accuracy management (owned by the WMS area).
- Sales forecasting.
- Full merchandising management.
- Retailer / ERP integration.
- Automated messaging or automated workflows (the Automation area may add these later).
- Advanced analytics / dashboards beyond the open/overdue/resolved list.
- Complex or granular permission structures.
- A store-staff-facing portal or app (store-level logins are not confirmed).
- AI-generated recommendations.
- Replacing or migrating the existing chat / spreadsheet processes — v1 sits **alongside**
  them to prove the workflow is useful first.

## 5. Domain-level data sketch — [CONFIRMED starting shape]

Entities and relationships only. **Not a schema. No fields beyond those the human confirmed.**
Additional fields are **[OPEN]** and added only when confirmed needed.

- **Store** — store ID / name; channel / account; location; contact / person responsible (if
  available).
- **Store Follow-up** — belongs to one Store; date; person performing; notes / findings.
- **Issue / Action** — description; owner; due date; status; resolution / outcome. Always
  belongs to exactly one Store (mandatory). May optionally link to the Store Follow-up it was
  found on, or none (created directly against the Store — e.g. from a phone call).

Relationships: a Store has many Store Follow-ups; a Store Follow-up has zero or more
Issues/Actions; an Issue/Action **always belongs to exactly one Store** (the Store link is
mandatory), and **may optionally link to one Store Follow-up** (the follow-up link is not
required to create an issue).

- **[CONFIRMED — synced from `notes/workflows/store-visit-issue-closure.md` §4, 2026-09-10]**
  An Issue/Action can exist without a parent Store Follow-up: the Store link is mandatory, the
  Store Follow-up link is optional.
- **[OPEN]** The permitted `status` values for Issue/Action. The human confirmed the concept of
  status and the terms "open / overdue / resolved" for the management view, but not the full
  lifecycle list. "Overdue" is derived (due date past + not resolved), not a stored status.

## 6. Required outputs / actions — [CONFIRMED]

The two most important for v1, in priority order:

1. **An Issue/Action assigned to a named owner, with a due date and a status.** This is the
   primary output — v1 exists to drive actions to closure.
2. **A management view showing what is open, overdue, and resolved, by store.**

A saved visit report is **[CONFIRMED]** useful but **secondary** — a byproduct of step 2–3
data, not a v1 priority surface.

## 7. Minimum role model — [CONFIRMED]

Two roles, deliberately minimal — no complex permission system:

- **Operational user** — creates visits, findings, and issues; updates follow-up; marks issues
  resolved.
- **Management / admin** — sees all stores and all open issues (the section 6 #2 view).

**[OPEN / OUT for v1]** Store-level users with their own logins — not confirmed, stays out of
v1 until required.

## 8. Success criteria

- **[CONFIRMED qualitative]** The MVP works if, after the pilot, store issues/actions are
  consistently captured with a clear owner, a due date, and a visible status, and there is
  evidence that open items are followed through to closure.
- **[OPEN] Numeric success metric** — deliberately not set. Ask the human for current volume /
  baseline first; do not invent a percentage.

## 9. Boundaries with other project areas — [CONFIRMED]

- **Store Care Program owns** the operational store follow-up workflow.
- **CRM owns** customer / member relationships.
- **WMS owns** inventory / stock movement and stock accuracy.
- **Automation** may automate Store Care workflows later.
- Store Care Program may *reference* data from these areas later, but **v1 does not replace or
  integrate with them**.

---

## Open items feeding the next cycles

Resolved by the **workflow-definition cycle** (must precede the tech-stack decision):

1. Visit / finding fields — what a "finding" record contains.
2. Free-text vs structured checklist for the visit.
3. Issue / action lifecycle and status values.
4. Whether an issue can exist without a parent visit.
5. What counts as resolution / closure evidence.

Resolved by the **tech-stack decision cycle** (after the workflow is confirmed):

- Data residency, Thai-language UI requirement, hosting / existing accounts, who maintains the
  app (inputs to Phase 0 in the definition cycle's `plan.md`).
- The stack / datastore / auth choice itself — its own `notes/decisions/` entry.

Answerable in parallel (business inputs, not blockers):

- Exact primary-user job title.
- Pilot scope: store count, retailer/channel, whether store people are Jula or retailer
  employees, who performs visits today, visit frequency.
- Current volume / baseline of store issues and visits (feeds the numeric success metric).
- Target delivery date / event.
