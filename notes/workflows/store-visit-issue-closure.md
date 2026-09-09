# Store Care Program — Store Follow-up → Issue → Closure Workflow (v1)

**Status:** Accepted 2026-09-08
**Cycle:** `agents/runs/2026-09-08-store-care-workflow-definition/`
**Product context:** `notes/product/store-care-program-mvp-definition.md`

This is the canonical operational workflow definition for Store Care Program v1. It is a
process definition — **not** a schema, **not** code, **not** a tech choice (the tech-stack
decision is the next cycle). Where this document and the MVP definition differ on the
parent-relationship rule or the record name "Store Follow-up", **this document is
canonical**; `notes/product/store-care-program-mvp-definition.md` §5 is synced to match in a
later follow-up edit.

Every line is tagged **[CONFIRMED]** (traces to a human answer or the accepted MVP
definition) or **[OPEN]** (deferred). `[OPEN]` items do not block v1 but must not be
invented — in particular, real finding examples and the worked example (§5) are held open
deliberately.

---

## 1. End-to-end workflow

**Actors:**

- **Operational user** — [CONFIRMED] performs follow-ups, records findings, creates and
  updates issues, and resolves / cancels / reopens them. Performs every state transition.
- **Management / admin** — [CONFIRMED] views all stores and all issues (open / overdue /
  resolved). No approval, verification, or sign-off role in v1.

**Record types:** Store; **Store Follow-up** (one record type, with a type/channel field);
Issue / Action. — [CONFIRMED]

```
STEP 1 — SELECT A STORE
  Operational user picks an existing Store from a list.
  (Whether v1 also has an "add store" screen or seeds from an existing
   source is [OPEN].)
        │
        v
STEP 2 — RECORD A STORE FOLLOW-UP
  Operational user logs one Store Follow-up against that Store:
    - Store                    (required)
    - Activity date            (required; may be back-dated — kept separate
                                from the system created-at timestamp)
    - Follow-up type           (required) { In-person visit | Phone |
                                            Chat/message | Other }
    - Person who performed it  (required)
    - Notes / findings         (required, free text)
    - Photos / attachments     (optional)
  "Follow-up" covers in-person AND remote activity — not only a return
  store visit.
        │
        v
STEP 3 — RECORD FINDINGS
  Findings are written as free text inside the follow-up's Notes / findings
  field. No structured fields, categories, or checklist in v1. A structured
  checklist may be added in a later phase only if real recurring checks
  emerge from usage.
  (Real finding examples are [OPEN].)
        │
        v
STEP 4 — DOES A FINDING NEED ACTION?
        │                                  │
        │ no → finding stays recorded      │ yes
        │      in the follow-up only.      │
        │      (not every finding          v
        │       becomes an issue)     CREATE AN ISSUE / ACTION
        │                             - always linked to the Store (mandatory)
        │                             - linked to THIS follow-up (optional link,
        │                               set here because it was found on a follow-up)
        │
   ( An Issue / Action can ALSO be created directly against a Store with NO
     follow-up — e.g. from a phone call, chat, or an HQ observation. The Store
     link is mandatory; the follow-up link is simply left empty. A follow-up
     record is never required merely to create an issue. )
        │
        v
STEP 5 — ASSIGN OWNER + DUE DATE
  - Exactly one named owner       (required)
  - Due date                      (required for an actionable issue)
  - No priority / severity field in v1
  Issue status = Open.
        │
        v
STEP 6 — WORK THE ISSUE
  Operational user moves the issue through the state machine (§3):
     Open ↔ In Progress ↔ Waiting, any of which → Resolved,
     or → Cancelled (cancel reason required).
  Completing an action does NOT auto-resolve the issue (see the §3 rule).
        │
        v
STEP 7 — CLOSE THE ISSUE (two terminal outcomes)
        │                                     │
        │ underlying problem                  │ no longer relevant /
        │ actually solved                     │ should not be pursued
        v                                     v
   RESOLVED                                CANCELLED
   - resolution note REQUIRED              - cancel reason REQUIRED
     (what changed / how)                    (so management can tell it
   - final successful state                  apart from Resolved)
   - no separate Closed status             - TERMINAL in v1: cannot be reopened
        │
        │ problem recurs
        v
   REOPEN → In Progress   (from RESOLVED only)
   - reopen reason REQUIRED
        │
        v
STEP 8 — MANAGEMENT VIEW
  Management / admin sees all issues across all stores, grouped or filterable
  by store, showing: open / overdue / resolved.
  "Overdue" is DERIVED: due date is in the past AND status is not Resolved
  AND not Cancelled — never a stored status.
  Read-only; no approval actions.
```

Everything is **mobile-first**, also usable on a laptop at HQ; **no offline mode** in v1.
v1 **sits alongside** existing chat / spreadsheet processes — it does not replace, migrate,
or integrate with them, or with CRM / WMS / Automation. — [CONFIRMED]

---

## 2. Minimum fields per step

Plain lists of what the process records. **Not a schema — no types, no column names.**
Mobile-first: every required field must be enterable one-handed while standing in a store.

### Store (selected in step 1; not entered during a follow-up)

- Store ID / name; channel / account; location; contact / person responsible (if
  available). — [CONFIRMED, from the MVP definition]
- **[OPEN]** Whether v1 includes an "add a store" action or seeds the store list from an
  existing spreadsheet / system, and in what form.

### Store Follow-up (step 2)

Required — [CONFIRMED]:

- **Store** — the store selected in step 1.
- **Activity date** — the date the follow-up happened. Kept separate from the system
  created-at timestamp, so a follow-up can be recorded later; a back-dated activity date is
  allowed.
- **Follow-up type** — exactly one of: In-person visit, Phone, Chat/message, Other.
- **Person who performed the follow-up.**
- **Notes / findings** — free text (see step 3).

Optional — [CONFIRMED]:

- **Photos / attachments.**

No other required fields in v1 unless the issue/action workflow proves one is needed.

**[OPEN]** (non-blocking): whether a follow-up can be scheduled ahead of time and shown as
"planned but not done"; whether more than one person is ever recorded on one follow-up;
whether any arrival/departure time or location check-in matters.

### Findings (step 3)

- Recorded as **free text within the follow-up's Notes / findings field**. — [CONFIRMED]
- **No separate structured finding fields, no categories/taxonomy, no checklist in v1.** —
  [CONFIRMED]
- **[OPEN]** Real finding examples — the human will provide these separately. Until then, no
  finding structure, category, or example is written anywhere.
- **[OPEN]** (non-blocking) Whether findings are captured as one block or a list of points.

### Issue / Action (steps 4–7)

Required — [CONFIRMED]:

- **Description** — what the issue / action is.
- **Store** — always exactly one; mandatory.
- **Owner** — exactly one named owner; mandatory.
- **Due date** — mandatory for an actionable issue.
- **Status** — one of: Open, In Progress, Waiting, Resolved, Cancelled (see §3).

Conditionally required — [CONFIRMED]:

- **Resolution note** — short description of what changed / how it was resolved; required
  before status can become **Resolved**.
- **Cancel reason** — required before status can become **Cancelled**.
- **Reopen reason** — required when a Resolved issue is reopened.

Optional — [CONFIRMED]:

- **Store Follow-up link** — set when the issue was found on a follow-up; empty otherwise.
- **Photos / evidence / attachments** — optional in v1; may become mandatory for specific
  issue types later.

Not in v1 — [CONFIRMED]:

- **No Priority / severity field.** Due date + derived overdue state is enough unless real
  usage proves otherwise.

**[OPEN]** (non-blocking): whether "owner" must be a login user or can be a typed name of
someone who does not use the app; who other than the creator may edit an issue or reassign
its owner.

### Management view (step 8)

- Lists all Issues / Actions across all stores, grouped or filterable by store. — [CONFIRMED]
- Shows open / overdue / resolved. — [CONFIRMED]
- **Overdue** = due date in the past AND status not Resolved AND not Cancelled — derived,
  never stored. — [CONFIRMED]
- Read-only for management / admin; no approval or verification actions. — [CONFIRMED]
- A saved visit report is a **byproduct** of step 2–3 data, not a v1 priority surface. —
  [CONFIRMED]

---

## 3. Issue / Action status lifecycle

### States — [CONFIRMED]

| State | Meaning (verbatim intent) |
|---|---|
| **Open** | Created and needs action. |
| **In Progress** | Someone is actively working on it. |
| **Waiting** | Progress depends on another person / party / event. |
| **Resolved** | The underlying problem has actually been resolved. Final successful state. |
| **Cancelled** | Deliberately ended without resolution because no longer relevant / should not be pursued. Separate terminal outcome. |

- **No separate `Closed` status**, and **no manager-verification stage.** Resolved is final
  for a successful outcome.
- **Cancelled is terminal** — no reopen path in v1.
- **Overdue** is a derived flag, not a state (see §2, management view).

### Transitions — [CONFIRMED — locked 2026-09-08]

```
   (create) OPEN ─────────► IN PROGRESS ◄────────► WAITING
             │  │             │    ▲                 │
             │  │             │    └── both ways ────┘
             │  │             ▼                      │
             │  └───────►  RESOLVED  ◄───────────────┘   (Open / In Progress / Waiting → Resolved)
             │                 │
             │        reopen (reason required)
             │                 ▼
             │             IN PROGRESS
             │
             └──────────► CANCELLED   (from Open / In Progress / Waiting;
                          cancel reason required; TERMINAL — no reopen)
```

- **In Progress ↔ Waiting** — both directions, as the dependency clears or recurs.
- **Open → In Progress**, and **Open → Resolved** directly (an issue discovered and solved
  immediately — no fake In Progress state forced; resolution note still required).
- **In Progress → Resolved** and **Waiting → Resolved** directly — only when the underlying
  problem is actually solved (the "action done ≠ problem solved" rule below). Waiting →
  Resolved does not have to pass back through In Progress.
- **Open / In Progress / Waiting → Cancelled** — with a required cancel reason.
- **Cancelled is terminal** — it cannot be reopened. If a cancelled matter becomes relevant
  again, a new issue is created.
- **Resolved → In Progress** (reopen) — with a required reopen reason.

### Who performs each transition — [CONFIRMED]

- **Operational user** — creates the issue; makes all status changes; writes the resolution
  note, cancel reason, and reopen reason; reassigns the owner.
- **Management / admin** — views only. No approval gate, no sign-off, no verification
  transition anywhere in v1.
- **[OPEN]** (non-blocking) Whether anyone other than the creator can edit an issue after
  creation, or assign the owner.

### The "action done ≠ problem solved" rule — [CONFIRMED]

Completing an action does **not** automatically move the issue to Resolved. The issue
becomes **Resolved only when the underlying store problem is actually solved**. If the action
is done but the problem remains, the issue stays In Progress or Waiting.

### Required text on transitions — [CONFIRMED]

| Transition | Required text |
|---|---|
| → Resolved (from Open, In Progress, or Waiting) | Resolution note — what changed / how it was resolved. |
| → Cancelled (from Open, In Progress, or Waiting) | Cancel reason — why it was stopped. |
| Resolved → In Progress (reopen) | Reopen reason. |

---

## 4. Entity relationships

Relationships only. **No schema, no field types.**

```
        ┌───────────────┐
        │     STORE      │
        └───────┬───────┘
                │ 1
        ┌───────┴───────────────────────────┐
        │ *                                 │ *   (MANDATORY — every Issue
        v                                   v      belongs to exactly one Store)
┌────────────────────┐               ┌────────────────────┐
│   STORE FOLLOW-UP   │  0..1 ──────► │   ISSUE / ACTION    │ ──► exactly ONE OWNER
│ type: In-person /   │    *          │                    │
│ Phone / Chat / Other│  (OPTIONAL    │                    │
│                     │   link)       │                    │
└────────────────────┘               └────────────────────┘
```

- **Store 1 —— * Store Follow-up.** A store has many follow-ups.
- **Store 1 —— * Issue / Action — MANDATORY.** Every Issue / Action belongs to exactly one
  Store.
- **Store Follow-up 1 —— * Issue / Action — OPTIONAL link.** An Issue / Action may reference
  the follow-up it was found on, or none (created directly against the Store).
- **Issue / Action —— exactly one Owner.**

**N1 resolved.** The MVP definition §5 said both "an Issue/Action arises from a
Visit/Follow-up finding" and "(or is created directly against a Store)", with an `[OPEN]`
note questioning whether an issue can exist without a parent visit. **Both are true under
the hybrid rule:** the Store link is mandatory, the Follow-up link is optional. This
workflow document is canonical for the parent rule; the MVP definition §5 wording (including
the record name "Store Follow-up") is synced to match in a later small follow-up edit.

---

## 5. Worked example — [OPEN — STUB]

**Pending a real recent case from the human.**

When provided, this section becomes one real, recent end-to-end case (which store, roughly
when, what was found, what action it became, who owned it, the due date / urgency, how it was
followed up, how it ended) walked through steps 1–8, with each step's recorded fields shown.

No hypothetical example is written here. This section ships as a stub until the human
supplies a real case. — [OPEN]

---

## 6. Explicit v1 exclusions

The workflow deliberately does **not** cover (cross-ref MVP definition §4):

- Structured finding checklist, categories, or taxonomy — findings are free text in v1.
- The other intent areas — store follow-up scheduling / cadence, merchandising support,
  sales support, company↔store communication.
- A `Closed` status or any manager-verification / sign-off stage.
- A manager approval step anywhere in the issue lifecycle.
- A Priority / severity field.
- Mandatory photo / evidence on findings or resolutions (optional only).
- Notifications, reminders, or escalations.
- Discovery-channel analytics / reporting (e.g. "% of issues from phone vs visit").
- Store-staff logins or a store-facing portal / app.
- CRM / WMS / Automation integration or data sync.
- Offline mode.
- A dedicated saved-visit-report surface — the data is captured; a formatted report view is
  deferred.

---

## 7. Remaining open questions

Carried forward honestly rather than guessed. None block writing or using this workflow.

1. **Real finding examples.** The human will supply 5–10 real findings. Needed before any
   finding structure or category can be considered, and before the worked example.
2. **The worked example (§5).** One real recent case, human-supplied. §5 is a stub until
   then.
3. **Discovery-channel proportions baseline.** No honest numbers yet for how issues are
   found (visit vs phone vs chat vs HQ observation). Do not invent percentages.
4. **Store master seed source.** Whether an existing spreadsheet / system seeds the Store
   list, or v1 needs an "add store" action.
5. **Owner identity.** Must an owner be a login user, or can it be a typed name of someone
   who does not use the app?
6. **Issue edit permissions.** Who other than the creator may edit an issue or reassign its
   owner.
7. **Scheduled-ahead follow-ups.** Whether a follow-up can be planned before it happens and
   shown as "planned but not done"; more than one person on a follow-up; arrival / departure
   time or location check-in.
8. **Findings shape.** One block of text vs a list of points.

**Downstream Next Action (separate cycle):** sync `notes/product/store-care-program-mvp-definition.md`
§5 to match §4 above — the hybrid parent rule and the "Store Follow-up" entity name.
