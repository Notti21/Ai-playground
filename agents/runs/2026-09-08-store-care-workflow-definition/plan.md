# Plan — Store Care Program: Operational Workflow Definition (v1)

> **Phase 2 of 2 — workflow definition draft, awaiting human approval.**
>
> Phase 1 (discovery) inventoried what the accepted MVP definition confirms vs leaves open,
> and put the five blocking areas to the human as prioritized questions. The human has
> answered the Priority-1 set, the confirmed v1 defaults, and — on 2026-09-08 — **locked the
> five state-machine transition decisions** (In Progress ↔ Waiting both ways; Cancelled from
> Open/In Progress/Waiting and terminal; Waiting → Resolved direct; Open → Resolved direct;
> Overdue excludes Cancelled). This document's **main body (Part D)** is the workflow
> definition — the seven required outputs, every line tagged `[CONFIRMED]` (traces to a human
> answer or a Part A1 W-item) or `[OPEN]`. The Phase 1 discovery material is preserved as
> **Appendix 1**.
>
> **Nothing is implemented. No code, no schema, no data-model / type definitions, no
> tech-stack choice, no commit.** This is a definition for the human to approve. Only after
> approval may Do write `notes/workflows/store-visit-issue-closure.md`.
>
> **Two things stay explicitly OPEN and must not be fabricated:** real finding examples (Q8)
> and the worked example (Q32). Required output #5 is a stub pending Q32.

## Goal

Produce the real operational workflow definition for **Store Care Program v1** — the process
by which a store follow-up leads to a tracked issue/action and then to a documented closure —
before any code and before the tech-stack decision. Deliverable: a single workflow document
at `notes/workflows/store-visit-issue-closure.md` (confirmed filename, OQ4), containing the
seven required outputs in Part D. A process definition — **not** code, **not** a schema,
**not** a tech choice.

## Scope

### This cycle covers

- Writing down the v1 spine as a named workflow: its 8 steps, its actors, the Store Follow-up
  and Issue/Action lifecycles, the decision points, and the hybrid parent rule.
- Resolving the five field-level open items the MVP definition deferred here (finding capture,
  visit/follow-up fields, issue lifecycle, parent relationship, closure requirements) using
  the human's answers.
- Reconciling Check finding **N1** (the MVP §5 contradiction) — resolved in Part D output 4.

### This cycle does NOT cover

- Any database, auth provider, hosting, or framework selection — that is the **next** cycle.
- Application code, scaffolding, a `projects/store-care-program/` folder, a schema, a
  data-model, or type definitions. "Fields" below are a plain list of what the process
  records, not columns or types.
- Editing `notes/product/store-care-program-mvp-definition.md`. Its §5 wording is synced to
  this doc by a **later** small follow-up (a Next Action — OQ3 answer was: this workflow doc
  becomes canonical; MVP §5 synced separately, not this cycle).
- The other intent areas (scheduling/cadence, merchandising, sales support, company↔store
  comms) — MVP §4 and §"Phase 3+".
- The numeric success metric, pilot sizing, discovery-channel baseline, and primary-user job
  title — parallel non-blocking business inputs.

## Anti-fabrication discipline (carried from the MVP cycle)

Same protocol as `2026-08-24-project-pages` and the MVP-definition cycle
(`notes/architecture/slug-project-pages.md`; manifesto principles 6 and 8):

- **Invent nothing.** No store operations, finding categories, checklist items, issue
  categories, priority levels, SLAs, escalation paths, or approval/sign-off steps beyond what
  the human confirmed. Q8 and Q32 stay `[OPEN]`; the worked example is a stub.
- **Background is not confirmation.** Only what the human explicitly confirmed as the v1 rule
  lands as `[CONFIRMED]`.
- **Prefer the smallest usable workflow.** Where the answer leaves a choice, Part D proposes
  the smaller option and marks it `[OPEN]` for the human to confirm.
- **Thinness is not a defect.** Free-text findings and a five-state issue lifecycle is the
  confirmed shape; Do/Check must not pad it.

---

# PART D — WORKFLOW DEFINITION DRAFT (the seven required outputs)

Source key: **Q#** = the human's Phase-2 answer (recorded verbatim-intent in Appendix 2);
**W#** = a confirmed item from the MVP definition (Appendix 1, Part A1); **MVP §n** = a
section of `notes/product/store-care-program-mvp-definition.md`.

---

## D1. End-to-end workflow text diagram — [CONFIRMED shape]

**Actors:**
- **Operational user** — [CONFIRMED: W8] performs follow-ups, records findings, creates and
  updates issues, resolves / cancels / reopens them.
- **Management / admin** — [CONFIRMED: W8] views all stores and all issues (open / overdue /
  resolved). No approval or verification role in v1 — [CONFIRMED: Q15, Q21-default].

**Record types:** Store; **Store Follow-up** (one record type, with a type/channel field —
[CONFIRMED: Q2]); Issue / Action — [CONFIRMED: W3].

```
STEP 1 — SELECT A STORE                                          [CONFIRMED: W2]
  Operational user picks an existing Store from a list.
  (Whether v1 also has an "add store" screen or seeds from an
   existing source is [OPEN] — O-W13.)
        |
        v
STEP 2 — RECORD A STORE FOLLOW-UP                                [CONFIRMED: W2, Q2]
  Operational user logs one Store Follow-up against that Store:
    - Activity date            (required; may be back-dated)     [CONFIRMED: Q1, default]
    - Follow-up type            {In-person visit | Phone |
                                 Chat/message | Other}           [CONFIRMED: Q2]
    - Person who performed it  (required)                        [CONFIRMED: Q1]
    - Notes / findings         (required, free text)             [CONFIRMED: Q1, Q12]
  "Follow-up" covers in-person AND remote activity — not only a
  return store visit.                                            [CONFIRMED: Q2, Q24]
        |
        v
STEP 3 — RECORD FINDINGS                                         [CONFIRMED: W2, Q12]
  Findings are written as free text inside the follow-up's
  Notes/findings field. No structured fields, categories, or
  checklist in v1.                                               [CONFIRMED: Q11, Q12]
  (Real finding examples are [OPEN] — Q8.)
        |
        v
STEP 4 — DOES A FINDING NEED ACTION?                             [CONFIRMED: W2]
        |                                   |
        | no  -> finding stays recorded     | yes
        |        in the follow-up only.     |
        |        (not every finding         v
        |         becomes an issue)   CREATE AN ISSUE / ACTION
        |                             - always linked to the Store   [CONFIRMED: Q23/Q25]
        |                             - linked to THIS follow-up     [CONFIRMED: Q23/Q25]
        |                               (optional link, set here
        |                                because it was found on
        |                                a follow-up)
        |
   ( An Issue / Action can ALSO be created directly against a Store  [CONFIRMED: Q23/Q25]
     with NO follow-up — e.g. from a phone call, chat, or an HQ
     observation. The Store link is mandatory; the follow-up link
     is simply left empty. )
        |
        v
STEP 5 — ASSIGN OWNER + DUE DATE                                 [CONFIRMED: W2]
  - Exactly one named owner (required)                           [CONFIRMED: default]
  - Due date (required for an actionable issue)                  [CONFIRMED: default]
  - No priority/severity field in v1                             [CONFIRMED: default]
  Issue status = Open.                                           [CONFIRMED: Q14]
        |
        v
STEP 6 — FOLLOW UP / WORK THE ISSUE                              [CONFIRMED: W2, Q14]
  Operational user moves the issue through the state machine
  (full transition set in D3):
     Open <-> In Progress <-> Waiting, any of which -> Resolved   [CONFIRMED: Q14, locked]
     or -> Cancelled (reason required)
  Completing an action does NOT auto-resolve the issue.          [CONFIRMED: Q30]
        |
        v
STEP 7 — CLOSE THE ISSUE (two terminal outcomes)                 [CONFIRMED: Q14, Q15, Q16]
        |                                   |
        | underlying problem                | no longer relevant /
        | actually solved                   | should not be pursued
        v                                   v
   RESOLVED                              CANCELLED
   - resolution note REQUIRED            - cancel reason REQUIRED
     (what changed / how)  [CONFIRMED:Q27]  (so mgmt can tell it apart
   - final successful state               from Resolved)        [CONFIRMED: Q16]
   - NO separate Closed status [CONFIRMED: Q15]  - TERMINAL: no reopen  [CONFIRMED: locked #2]
        |
        | problem recurs
        v
   REOPEN -> In Progress   (from RESOLVED only)                  [CONFIRMED: default, locked #2]
   - reopen reason REQUIRED
        |
        v
STEP 8 — MANAGEMENT VIEW                                         [CONFIRMED: W10, W11, W12]
  Management/admin sees all issues across all stores, grouped/
  filterable by store, showing: open / overdue / resolved.
  "Overdue" is DERIVED: due date is in the past AND status is
  not Resolved AND not Cancelled — not a stored status.         [CONFIRMED: W11, locked]
  Read-only; no approval actions.                                [CONFIRMED: W8, Q15]
```

Everything is **mobile-first**, also usable on a laptop at HQ; no offline mode — [CONFIRMED:
W14]. v1 **sits alongside** existing chat/spreadsheet processes — [CONFIRMED: W15].

---

## D2. Minimum fields per step — [CONFIRMED unless tagged OPEN]

Plain lists of what the process records. **Not a schema. No types, no column names.**
Mobile-first: every required field must be enterable one-handed while standing in a store.

### Step 1 — Select a store
- An existing **Store** is chosen from a list. — [CONFIRMED: W2]
- Store attributes carried for reference (not entered here): store ID / name; channel /
  account; location; contact / person responsible (if available). — [CONFIRMED: W5]
- **[OPEN]** Whether v1 includes an "add a store" action or seeds the store list from an
  existing spreadsheet/system, and in what form. — O-W13 (Q8-batch business input)

### Step 2 — Store Follow-up record
Required — [CONFIRMED: Q1]:
- **Store** — the store selected in step 1.
- **Activity date** — the date the follow-up happened. Kept **separate** from the system
  created-at timestamp, so a follow-up can be recorded later; a back-dated activity date is
  allowed. — [CONFIRMED: Q1, default]
- **Follow-up type** — exactly one of: **In-person visit**, **Phone**, **Chat/message**,
  **Other**. — [CONFIRMED: Q2]
- **Person who performed the follow-up.** — [CONFIRMED: Q1]
- **Notes / findings** — free text (see step 3). — [CONFIRMED: Q1]

Optional:
- **Photos / attachments.** — [CONFIRMED: default]

No other required fields in v1 unless the issue/action workflow proves one is needed. —
[CONFIRMED: Q1]

**[OPEN]** (Priority-2/3, not blocking): whether a follow-up can be scheduled ahead of time
and shown as "planned but not done" (Q3); whether more than one person is ever recorded on
one follow-up (Q5); whether any arrival/departure time or location check-in matters (Q6).

### Step 3 — Findings
- Recorded as **free text within the follow-up's Notes / findings field**. — [CONFIRMED: Q12]
- **No separate structured finding fields, no categories/taxonomy, no checklist in v1.** —
  [CONFIRMED: Q11, Q12]
- A structured checklist may be added in a later phase only if real recurring checks emerge
  from usage. — [CONFIRMED: Q12]
- **[OPEN]** Real finding examples — the human will provide these separately (Q8). Until then
  no structure, category, or example is written anywhere.
- **[OPEN]** (Priority-2): whether findings are captured as one block or a list of points
  (Q9); whether many findings are "for the record" vs actionable (Q10 — partly implied by the
  step 3 / step 4 split).

### Step 4 — Finding becomes an Issue / Action (or not)
- Not every finding becomes an issue; a finding may stay recorded in the follow-up only. —
  [CONFIRMED: W2]
- An Issue / Action may be created **from a finding on a follow-up** (follow-up link set) or
  **directly against a Store with no follow-up** (follow-up link empty). — [CONFIRMED:
  Q23/Q25]

### Steps 4–7 — Issue / Action record
Required:
- **Description** — what the issue/action is. — [CONFIRMED: W7]
- **Store** — always exactly one; mandatory. — [CONFIRMED: Q23/Q25]
- **Owner** — exactly one named owner; mandatory. — [CONFIRMED: default]
- **Due date** — mandatory for an actionable issue. — [CONFIRMED: default]
- **Status** — one of: Open, In Progress, Waiting, Resolved, Cancelled (see D3). —
  [CONFIRMED: Q14]

Conditionally required:
- **Resolution note** — short description of what changed / how it was resolved; required
  before status can become **Resolved**. — [CONFIRMED: Q27]
- **Cancel reason** — required before status can become **Cancelled**. — [CONFIRMED: Q16]
- **Reopen reason** — required when a Resolved issue is reopened. — [CONFIRMED: default]

Optional:
- **Store Follow-up link** — set when the issue was found on a follow-up; empty otherwise. —
  [CONFIRMED: Q23/Q25]
- **Photos / evidence / attachments** — optional in v1; may become mandatory for specific
  issue types later. — [CONFIRMED: Q27, default]

Not in v1:
- **No Priority / severity field.** Due date + derived overdue state is enough unless real
  usage proves otherwise. — [CONFIRMED: default]

**[OPEN]** Whether "owner" must be a person with a login or can be a typed name of someone
who does not use the app (Q19 — Priority-2, unanswered).

### Step 8 — Management view
- Lists all Issues / Actions across all stores, **grouped or filterable by store**. —
  [CONFIRMED: W10]
- Shows **open / overdue / resolved**. — [CONFIRMED: W12]
- **Overdue** = due date is in the past AND status is not Resolved and not Cancelled —
  derived, never stored. — [CONFIRMED: W11]
- Read-only for management/admin; no approval or verification actions. — [CONFIRMED: W8, Q15]
- A saved visit report is a **byproduct** of step 2–3 data, not a v1 priority surface. —
  [CONFIRMED: W13]

---

## D3. Issue / Action status lifecycle — [CONFIRMED]

### States — [CONFIRMED: Q14, Q16]
| State | Meaning (verbatim intent) |
|---|---|
| **Open** | Created and needs action. |
| **In Progress** | Someone is actively working on it. |
| **Waiting** | Progress depends on another person / party / event. |
| **Resolved** | The underlying problem has actually been resolved. Final successful state. |
| **Cancelled** | Deliberately ended without resolution because no longer relevant / should not be pursued. Separate terminal outcome. |

- **No separate `Closed` status**, and **no manager-verification stage.** Resolved is final
  for a successful outcome. — [CONFIRMED: Q15]
- **Cancelled is terminal** — no reopen path. — [CONFIRMED: locked #2]
- **Overdue** is a **derived flag**, not a state: due date in the past AND status not Resolved
  AND not Cancelled (see D2 step 8). — [CONFIRMED: W11, locked #5]

### Transitions — [CONFIRMED — locked 2026-09-08]
```
      (create)
         │
         v
       OPEN ──────────────► IN PROGRESS ◄────────► WAITING
         │                   │     ▲                 │
         │                   │     └──────┬──────────┘
         │                   │            │  (both directions)
         │                   v            v
         │  ┌──────────── RESOLVED ◄───────────── (from In Progress OR Waiting)
         │  │                │
         │  │        (reopen; reason required)
         │  │                v
         │  │             IN PROGRESS
         │  │
     ┌───┴──┴────────────────────────────────┐
     │  OPEN → RESOLVED  (direct; allowed)    │   [CONFIRMED: locked #4]
     └───────────────────────────────────────┘
         │
         └──► CANCELLED  ◄─── (from OPEN, IN PROGRESS, or WAITING)   [CONFIRMED: Q16, locked #2]
              (cancel reason required; TERMINAL — no reopen)
```
- **Open → In Progress → Waiting**, with **In Progress ↔ Waiting** free to move **both
  directions** as the dependency clears or recurs. — [CONFIRMED: Q14, locked #1]
- **In Progress → Resolved** and **Waiting → Resolved (directly)** — only when the underlying
  problem is actually solved (Q30 rule below). Waiting → Resolved does not have to pass back
  through In Progress. — [CONFIRMED: Q14, Q30, locked #3]
- **Open → Resolved (directly)** — allowed for an issue discovered and solved immediately; a
  fake In Progress state is not forced. Resolution note still required. — [CONFIRMED: locked #4]
- **Open / In Progress / Waiting → Cancelled** — with a **required cancel reason**. —
  [CONFIRMED: Q16, locked #2]
- **Cancelled is TERMINAL in v1** — it cannot be reopened. If a cancelled matter becomes
  relevant again, a new issue is created. — [CONFIRMED: locked #2]
- **Resolved → In Progress** (reopen) — with a **required reopen reason**. — [CONFIRMED:
  default]

### Who performs each transition — [CONFIRMED: W8, defaults]
- **Operational user** — creates the issue; makes all status changes; writes the resolution
  note, cancel reason, and reopen reason; reassigns the owner. — [CONFIRMED: W8, default]
- **Management / admin** — views only. **No approval gate, no sign-off, no verification
  transition anywhere in v1.** — [CONFIRMED: Q15, Q21-default, W8]
- **[OPEN]** Whether anyone other than the creator can edit an issue after creation (Q20 —
  Priority-2, unanswered); whether someone other than the operational user can assign the
  owner (Q18 — Priority-2, unanswered).

### The "action done ≠ problem solved" rule — [CONFIRMED: Q30]
Completing an action does **not** automatically move the issue to Resolved. The issue becomes
**Resolved only when the underlying store problem is actually solved**. If the action is done
but the problem remains, the issue stays **In Progress** or **Waiting**.

### Required notes summary — [CONFIRMED]
| Transition | Required text |
|---|---|
| → Resolved (from Open, In Progress, or Waiting) | Resolution note — what changed / how it was resolved. — [CONFIRMED: Q27, locked] |
| → Cancelled (from Open, In Progress, or Waiting) | Cancel reason — why it was stopped. — [CONFIRMED: Q16, locked] |
| Resolved → In Progress (reopen) | Reopen reason. — [CONFIRMED: default] |

---

## D4. Entity relationships — [CONFIRMED]

Relationships only. **No schema, no field types, no cardinality detail beyond the below.**

```
        ┌───────────────┐
        │     STORE      │
        └───────┬───────┘
                │ 1
        ┌───────┴────────────────────────┐
        │ *                              │ *   (MANDATORY — every Issue
        v                                v      belongs to exactly one Store)
┌────────────────────┐            ┌────────────────────┐
│   STORE FOLLOW-UP   │  0..1 ───► │   ISSUE / ACTION    │ ──► exactly ONE OWNER
│ (type: In-person /  │    *       │                    │      [CONFIRMED: default]
│  Phone / Chat /     │  (OPTIONAL │                    │
│  Other)             │   link)    │                    │
└────────────────────┘            └────────────────────┘
```

- **Store 1 —— * Store Follow-up.** A store has many follow-ups. — [CONFIRMED: W4]
- **Store 1 —— * Issue / Action — MANDATORY.** Every Issue/Action belongs to exactly one
  Store. — [CONFIRMED: Q23/Q25]
- **Store Follow-up 1 —— * Issue / Action — OPTIONAL link.** An Issue/Action may reference
  the follow-up it was found on, or none (created directly against the Store). — [CONFIRMED:
  Q23/Q25]
- **Issue / Action —— exactly one Owner.** — [CONFIRMED: default]

**N1 resolved.** MVP §5 said both "an Issue/Action arises from a Visit/Follow-up finding" and
"(or is created directly against a Store)", with an `[OPEN]` note questioning whether an issue
can exist without a parent visit. **Both are true under the hybrid rule:** the **Store link is
mandatory**, the **Follow-up link is optional**. This workflow document is canonical for the
parent rule; MVP §5's wording is synced to match in a **later** small follow-up edit (a Next
Action, not this cycle — OQ3). — [CONFIRMED: Q23/Q25, OQ3]

---

## D5. Worked example — [OPEN — STUB]

**Pending a real recent case from the human (Q32).**

The human will provide one real, recent end-to-end case (which store, roughly when, what was
found, what action it became, who owned it, the due date / urgency, how it was followed up,
how it ended). Phase 2 will **not** write a hypothetical example. When Q32 is answered, this
section becomes: the real case walked through steps 1–8, with each step's recorded fields
shown.

Until then this section ships as a stub with this `[OPEN]` note. — [OPEN: Q32]

---

## D6. Explicit v1 exclusions — [CONFIRMED]

The workflow deliberately does **not** cover (cross-ref MVP §4):

- **Structured finding checklist, categories, or taxonomy** — findings are free text in v1. —
  [CONFIRMED: Q11, Q12]
- **The other intent areas** — store follow-up scheduling/cadence, merchandising support,
  sales support, company↔store communication. — [CONFIRMED: MVP §4, §"Phase 3+"]
- **A `Closed` status or any manager-verification / sign-off stage.** — [CONFIRMED: Q15]
- **A manager approval step** anywhere in the issue lifecycle. — [CONFIRMED: Q15, default]
- **A Priority / severity field.** — [CONFIRMED: default]
- **Mandatory photo / evidence** on findings or resolutions (optional only). — [CONFIRMED:
  Q27, default]
- **Notifications, reminders, or escalations.** — [CONFIRMED: MVP §4]
- **Discovery-channel analytics / reporting** (e.g. "% of issues from phone vs visit"). —
  [CONFIRMED: Q23]
- **Store-staff logins or a store-facing portal / app.** — [CONFIRMED: MVP §4, §7]
- **CRM / WMS / Automation integration or data sync.** — [CONFIRMED: MVP §4, §9]
- **Offline mode.** — [CONFIRMED: W14, MVP §2]
- **A dedicated saved-visit-report surface** — the data is captured; a formatted report view
  is deferred. — [CONFIRMED: W13]

---

## D7. Remaining open questions — [OPEN]

Carried forward honestly rather than guessed:

1. **Q8 — real finding examples.** The human will supply 5–10 real findings. Needed before
   any finding structure, category, or the worked example can be considered. — [OPEN]
2. **Q32 — the worked example.** One real recent case, human-supplied. D5 is a stub until
   then. — [OPEN]
3. **Discovery-channel proportions baseline.** The human has no honest numbers for how issues
   are found (visit vs phone vs chat vs HQ observation). Do not invent percentages. — [OPEN]
4. **Store master seed source (O-W13).** Whether an existing spreadsheet/system seeds the
   Store list, or v1 needs an "add store" action. — [OPEN — may stay open, does not block]
5. **Owner identity (Q19).** Must an owner be a login user, or can it be a typed name of
   someone who does not use the app? — [OPEN — may stay open, does not block]
6. **Issue edit permissions (Q18, Q20).** Who other than the creator may edit an issue or
   reassign its owner. — [OPEN — may stay open, does not block]
7. **Scheduled-ahead follow-ups (Q3, Q5, Q6).** Whether a follow-up can be planned before it
   happens and shown as "planned but not done"; more than one person on a follow-up;
   arrival/departure time or location check-in. — [OPEN — may stay open, does not block]
8. **Findings shape (Q9, Q10).** One block vs a list of points; how many findings are "for
   the record" vs actionable. — [OPEN — may stay open, does not block]

**Resolved by the human's locked decisions 2026-09-08** (no longer open):

- `Open → Resolved` direct transition — **allowed** (locked #4).
- Reopening a `Cancelled` issue — **not allowed; Cancelled is terminal in v1** (locked #2).
- `In Progress ↔ Waiting` both directions — **allowed** (locked #1).
- `Waiting → Resolved` directly — **allowed** (locked #3).
- `Cancelled` reachable from Open / In Progress / Waiting — **confirmed** (locked #2).
- Overdue = due date past AND not Resolved AND not Cancelled — **confirmed** (locked #5).

**Downstream Next Action (not this cycle):** sync `notes/product/store-care-program-mvp-definition.md`
§5 wording to match D4's hybrid parent rule and the "Store Follow-up" entity name (OQ3 answer).
— [CONFIRMED as a Next Action]

---

# STEPS (remaining process, in order)

1. **[this pass — done]** Phase 2 draft workflow definition (Part D) from the human's
   answers, Q8/Q32 kept open, worked example stubbed.
2. **[human]** Approve Part D (or request changes). Optionally supply Q8 finding examples and
   the Q32 case now, so Do can fill D3/D5 — otherwise they ship as marked `[OPEN]`.
3. **[Do]** Create `notes/workflows/` and write `store-visit-issue-closure.md` from the
   approved Part D — verbatim intent, every `[CONFIRMED]` / `[OPEN]` tag preserved, nothing
   added, D5 as a stub if Q32 is still open.
4. **[Check]** Verify the written doc matches approved Part D section-for-section; confirm no
   invented findings / categories / checklist / statuses / approval steps; confirm N1 is
   reconciled (D4); confirm the worked example is a stub not a hypothetical; confirm scope
   stayed to the one new file (+ run folder).
5. **[Act]** Checkpoint + retro. Record the **MVP §5 sync edit** and the **D7 open items** as
   Next Actions. Hand off to the tech-stack decision cycle, now unblocked.

---

# RISKS

- **Fabrication risk — still primary, now concentrated in D3 and D5.** The pull is to fill
  the `[OPEN]` finding examples with plausible ones and to write a "representative" worked
  example. Both are forbidden until Q8/Q32. Check verifies against the human's answers and
  greps the written doc for any finding text, category name, or example scenario that has no
  answer behind it.
- **State machine — resolved.** The transition set was the main non-verbatim area in the
  first draft; the human **locked all five open transition decisions on 2026-09-08** (see the
  header and D3). The transition set is now fully `[CONFIRMED: locked]`, not inferred.
- **"Store Follow-up" rename ripple.** The MVP definition calls the entity "Visit /
  Follow-up"; this doc uses "Store Follow-up" per Q2. The workflow doc is canonical; the MVP
  §5 sync edit (Next Action) must also carry the rename, or the two docs use different names
  for the same record.
- **D5 ships as a stub.** If the human approves Part D without providing Q32, the `notes/`
  doc has an explicitly empty worked-example section. That is honest and acceptable (thinness
  is not a defect) but the doc is incomplete against required-output #5 until Q32 lands — a
  follow-up pass fills it.
- **Scope drift toward a schema or stack.** D2/D4 must stay plain lists and relationship
  lines. Anything that reads as a table definition, a type, or a storage hint is out — the
  next cycle owns that.
- **"Jula's Herb" still undefined in the repo** (MVP plan Appendix A8). There is no fallback
  source of realistic detail for D5 — it is Q32 or nothing.

---

# OPEN QUESTIONS (for the human, before Do writes the `notes/` doc)

- **OQ-A.** Approve Part D as the workflow definition, or request changes.
- **OQ-B.** ~~Confirm the D3 transition set~~ — **RESOLVED**: the human locked all five
  transition decisions on 2026-09-08 (In Progress ↔ Waiting both ways; Cancelled from
  Open/In Progress/Waiting and terminal; Waiting → Resolved direct; Open → Resolved direct;
  Overdue excludes Cancelled). D3 updated.
- **OQ-C.** Confirm the **"Store Follow-up"** name (replacing MVP §5's "Visit / Follow-up")
  and that the MVP §5 sync is a later Next Action, not this cycle. *(Human confirmed the name
  via Q2; MVP §5 sync confirmed as a Next Action via OQ3.)*
- **OQ-D.** **Q8 finding examples** and the **Q32 worked case** stay explicitly `[OPEN]` per
  the human's instruction — no invented findings, categories, or worked example. D5 ships as a
  stub; a later pass fills both.
- **OQ-E.** Confirm the run-folder slug `2026-09-08-store-care-workflow-definition` and the
  filename `notes/workflows/store-visit-issue-closure.md` *(both confirmed via OQ4/OQ5)*.

---

# NON-GOALS

- **No tech-stack, database, auth, hosting, or framework decision or hint.** Next cycle.
- **No application code, scaffolding, `projects/store-care-program/` folder, schema, data
  model, or type definitions.**
- **No invented content:** no store operations, finding examples, finding categories,
  checklist items, issue categories, priority levels, SLAs, due-date rules, escalation paths,
  or approval/sign-off steps. Q8 and Q32 stay `[OPEN]`; D5 is a stub.
- **No hypothetical worked example.** Real case (Q32) or a stub.
- **No edits** to `notes/product/store-care-program-mvp-definition.md` (the §5 sync is a
  separate Next Action), `projects/ai-command-center/src/data/projects.ts`,
  `docs/capability-map.md`, `docs/business-os-manifesto.md`,
  `notes/architecture/slug-project-pages.md`, or any `notes/decisions/` entry.
- **No expansion** into scheduling/cadence, merchandising, sales support, or company↔store
  communication.
- **No numeric success metric, pilot sizing, discovery-channel baseline, or primary-user job
  title.**
- **No commit** — the human commits.

---

**Phase 2 complete. This is a planning deliverable only.** Do may not write
`notes/workflows/store-visit-issue-closure.md` until the human explicitly approves Part D.

---
---

# APPENDIX 1 — PHASE 1 DISCOVERY MATERIAL (background)

Retained for traceability. Superseded as the plan's main body by Part D above, but every
`[CONFIRMED: W#]` tag in Part D traces to Part A1 here.

## Part A — Inventory: what the MVP definition CONFIRMS vs what is OPEN

Source: `notes/product/store-care-program-mvp-definition.md` (accepted 2026-09-08, committed
`c42d0e0`), cross-checked against `agents/runs/2026-09-08-store-care-program-mvp-definition/plan.md`
Parts 1–3.

### A1. CONFIRMED about the workflow — not re-litigated

| # | Confirmed | Source |
|---|---|---|
| W1 | The v1 backbone is one workflow: **"store visit / follow-up → issue/action tracking → closure"** — not six co-equal modules. | MVP §3 |
| W2 | The **8-step spine**, in this order: (1) select a store; (2) record a visit / follow-up; (3) record important findings; (4) a finding that needs action becomes an issue / action; (5) the issue has an owner and a due date; (6) the responsible person follows up; (7) the issue is marked resolved / closed with an outcome; (8) management sees open / overdue / resolved by store. | MVP §3 |
| W3 | **Three record types:** Store, Visit / Follow-up, Issue / Action. | MVP §4, §5 |
| W4 | **Relationships:** a Store has many Visits/Follow-ups; a Visit/Follow-up has zero or more Issues/Actions; an Issue/Action is always tied to a Store (directly or via its Visit). | MVP §5 |
| W5 | **Confirmed Store fields:** store ID / name; channel / account; location; contact / person responsible (if available). | MVP §5 |
| W6 | **Confirmed Visit/Follow-up fields:** belongs to one Store; date; person performing; notes / findings. | MVP §5 |
| W7 | **Confirmed Issue/Action fields:** description; owner; due date; status; resolution / outcome. | MVP §5 |
| W8 | **Two roles:** *operational user* (creates visits, findings, issues; updates follow-up; marks issues resolved) and *management / admin* (sees all stores and all open issues). No complex permissions. | MVP §7 |
| W9 | **Primary output:** an Issue/Action assigned to a named owner, with a due date and a status. | MVP §6 |
| W10 | **Secondary output:** a management view of what is open / overdue / resolved, by store. | MVP §6 |
| W11 | **"Overdue" is derived** (due date past + not resolved), not a stored status. | MVP §5, §6 |
| W12 | The words **"open / overdue / resolved"** are confirmed for the management view — not as the full issue lifecycle. | MVP §5 |
| W13 | A **saved visit report** is confirmed-useful but **secondary** — a byproduct of step 2–3 data. | MVP §6 |
| W14 | **Mobile-first**, also usable on a laptop at HQ; **no offline mode** for v1. | MVP §2 |
| W15 | v1 **sits alongside** existing chat / spreadsheet processes — does not replace, migrate, or integrate with them, or with CRM / WMS / Automation. | MVP §4, §9 |

### A2. OPEN about the workflow — this cycle resolves or explicitly defers

| # | Open item | Blocking area | MVP source | Phase-2 status |
|---|---|---|---|---|
| O-W1 | Exact fields per step; required vs optional. | 1, 5 | §3, §5 | **Resolved** — D2 |
| O-W2 | Whether "visit" and "follow-up" are one record type or distinguished. | 1, 4 | §5 | **Resolved** — one "Store Follow-up" record with a type field (Q2) |
| O-W3 | Whether visits are planned ahead or only logged after. | 1 | — | **Partly** — back-dating confirmed (default); scheduled-ahead still [OPEN] (D7 #9) |
| O-W4 | Finding capture: free text vs structured; real categories. | 2 | §3, §5 | **Resolved** — free text, no structure in v1 (Q11, Q12); real examples [OPEN] (Q8) |
| O-W5 | Full Issue/Action status lifecycle. | 3 | §5 | **Resolved** — D3 (Q14, Q15, Q16) |
| O-W6 | Who can create/update/assign/resolve/close; any review step. | 3 | §7 | **Mostly** — operational user does all, no approval (Q15, defaults); edit/assign permissions [OPEN] (D7 #8) |
| O-W7 | Whether issues need priority/severity. | 3 | — | **Resolved** — no Priority field in v1 (default) |
| O-W8 | Whether an Issue can exist without a parent Visit. **= Check finding N1.** | 4 | §5 `[OPEN]` | **Resolved** — hybrid: Store link mandatory, Follow-up link optional (Q23/Q25); D4 |
| O-W9 | What counts as resolution/closure; note/photo/confirmation needed. | 5 | §5 | **Resolved** — resolution note required, photo optional, no confirmation step (Q27, Q30) |
| O-W10 | Reopen / cancel semantics. | 3, 5 | — | **Mostly** — Cancelled terminal + reason (Q16); Resolved→reopen + reason (default); Cancelled-reopen [OPEN] (D7 #7) |
| O-W11 | Whether "owner" is a login user or a free-text name. | 3 | §5, §7 | **[OPEN]** (D7 #5) |
| O-W12 | The worked example. | all | §3 `[OPEN]` | **[OPEN]** — stub, Q32 (D5, D7 #2) |
| O-W13 | Store master data seed source. | 1 | §5 `[OPEN]` | **[OPEN]** (D7 #4) |

## Part B — The five blocking areas: decisions, trade-offs, questions (as asked in Phase 1)

### Area 1 — Visit / Follow-up fields
Decision: the minimum set captured per visit/follow-up, required vs optional, mobile-sized.
Confirmed start (W6): store, date, person performing, notes/findings. Questions Q1–Q7.

### Area 2 — Finding capture (free text vs structured)
Decision: free text vs structured fields/checklist; if structured, with what real categories.
Highest fabrication risk — MVP §3 says the checklist "must not be invented". Trade-off table
(free text: fastest, least consistent, no reporting, zero fabrication risk / structured:
slower, consistent, enables reporting, high fabrication risk unless categories are real).
Questions Q8–Q13; Q8 (real examples) flagged as the key blocking input.

### Area 3 — Issue / Action lifecycle
Decision: minimum status set; who can create/update/assign/resolve/close; priority?; reopen/
cancel semantics. Must not invent approval steps. Questions Q14–Q22.

### Area 4 — Parent relationship (issue with or without a visit)
Decision: must every issue originate from a visit/follow-up, or are standalone issues allowed?
Resolves N1. Trade-off: Option A (every issue needs a follow-up — context, one path, but
friction for phone/chat issues); Option B (issues direct to store — matches reality, but two
paths); Option C (hybrid — always a parent, but the parent can be a visit OR a lightweight
contact). Questions Q23–Q25. **Not resolved by the agent** in Phase 1.

### Area 5 — Resolution / closure
Decision: what must be recorded before Resolved — resolution note mandatory? photos?
confirmation? "action done" vs "problem solved"? Questions Q26–Q31.

## Part C — Prioritized question list (Phase 1)

- **Priority 1 (blocks Phase 2):** Q8, Q11, Q12 (Area 2); Q14, Q15, Q16 (Area 3); Q23, Q24,
  Q25 (Area 4); Q27, Q30 (Area 5); Q1, Q2 (Area 1).
- **Priority 2:** Q9, Q10, Q13; Q17–Q22; Q3, Q4, Q5; Q26, Q28, Q29, Q31.
- **Priority 3:** Q6, Q7; O-W13.
- **For the worked example:** Q32 — one real recent store situation end to end.

---

# APPENDIX 2 — THE HUMAN'S PHASE-2 ANSWERS (verbatim intent)

Recorded exactly as received from the coordinator; Part D's `[CONFIRMED: Q#]` tags trace here.

- **Q1 — Minimum Store Follow-up fields (REQUIRED):** Store; Activity date; Follow-up type;
  Person who performed the follow-up; Notes/findings. Keep lightweight — no extra required
  fields unless needed by the issue/action workflow.
- **Q2 / Q24 — One record type "Store Follow-up"** with a follow-up type/channel field. v1
  values: **In-person visit, Phone, Chat/message, Other**. An in-person visit is one type of
  Store Follow-up, not a separate model. "Follow-up" covers both in-person and remote
  activity — NOT only a return store visit.
- **Q8 — Real findings:** human will provide separately. **OPEN.** Invent nothing.
- **Q11 — Finding groups:** no confirmed taxonomy. v1 does NOT force categories. OPEN pending
  real examples + usage data.
- **Q12 — Fixed checklist:** none confirmed. v1 = lightweight free-text findings. Structured
  checklist items only later if real recurring checks emerge. Do not invent a checklist.
- **Q14 — Issue/Action lifecycle (v1):** Open → In Progress → Waiting → Resolved, plus
  Cancelled/No longer relevant as a separate terminal outcome.
  - Open = created and needs action
  - In Progress = someone is actively working on it
  - Waiting = progress depends on another person/party/event
  - Resolved = the underlying problem has actually been resolved
  - Cancelled = deliberately ended without resolution because no longer relevant / should not
    be pursued
  No more statuses unless real workflow evidence requires them.
- **Q15 — No separate Closed status** in v1. Resolved is the final successful state. No
  manager-verification stage.
- **Q16 — Ending without a fix:** yes, Cancelled/No longer relevant is a separate terminal
  outcome. A reason/note is REQUIRED when cancelling (so management can distinguish resolved
  vs deliberately-stopped).
- **Q23 / Q25 — Parent relationship = HYBRID.** Every Issue/Action MUST belong to a Store
  (Store → Issue always required). Link to a Store Follow-up is OPTIONAL (Store Follow-up →
  Issue optional). An issue found during a visit links back to that follow-up; an issue from
  phone/chat/HQ observation exists without one. Do NOT require a follow-up to create an issue.
  Discovery-channel proportions: human does NOT have honest numbers — keep that baseline
  OPEN, do not invent percentages.
- **Q27 — Resolution note REQUIRED** before an issue can be marked Resolved. Lightweight:
  short description of what changed / how it was resolved. Photo/evidence OPTIONAL in v1
  (revisit later if specific issue types need mandatory evidence).
- **Q30 — Action completed ≠ problem solved.** Completing an action does NOT auto-resolve.
  Issue becomes Resolved only when the underlying store problem is actually solved. (action
  done but problem remains → stays In Progress or Waiting; problem solved → Resolved.)
- **Q32 — Worked example:** human will provide one real recent case separately. **OPEN.** Do
  not fabricate.

**Process decisions:**
- **OQ3:** YES — the new workflow doc becomes canonical for the parent rule and workflow
  details; MVP definition §5 synced later with a small follow-up edit (a Next Action, not
  this cycle).
- **OQ4:** filename = `notes/workflows/store-visit-issue-closure.md`.

**Additional v1 defaults (CONFIRMED):**
- Exactly one named owner per Issue/Action.
- Due date is REQUIRED for an actionable issue.
- A Resolved issue CAN be reopened to In Progress, with a reopen reason required.
- NO Priority field in v1 — due date + derived overdue state is enough unless real usage
  proves otherwise.
- Activity date is kept SEPARATE from the system created-at timestamp, so a follow-up can be
  recorded later (back-dated activity date allowed).
- Photos/attachments optional.
- No manager sign-off / approval step in v1.

**Locked state-machine decisions (2026-09-08, second answer round):**
1. **In Progress ↔ Waiting** — allowed both directions (work moves back and forth between
   active work and waiting on another party / info / event).
2. **Cancelled** — reachable from Open, In Progress, or Waiting; cancellation reason required;
   **terminal in v1, cannot be reopened** (if a cancelled matter returns, create a new issue).
3. **Waiting → Resolved** — allowed directly (the waited-on party may resolve the underlying
   problem without the issue returning to In Progress).
4. **Open → Resolved** — allowed directly (issue discovered and solved immediately; no fake
   In Progress state forced). Resolution note still required.
5. **Overdue** = due date in the past AND status not Resolved AND not Cancelled. Confirmed.

Reopen from **Resolved** remains allowed (→ In Progress, reopen reason required). Q8 and Q32
remain explicitly OPEN — no invented findings, categories, or worked example. Non-blocking
D7 items (owner identity, edit permissions, scheduled-ahead follow-ups, findings one-block-
vs-list, store-master seed source) may stay OPEN.
