# Change Log — WMS and Automation project pages

## Step 1: Update the WMS and Automation entries in `src/data/projects.ts`

File: `projects/ai-command-center/src/data/projects.ts`

- **WMS:** added `slug: "wms"`; replaced `description` with the exact locked-in text from the plan,
  verbatim:
  > "WMS is a project area for defining how Jula's Herb tracks inventory, stock movement, stock
  > accuracy, and location-based inventory across warehouse and retail-related stock locations more
  > systematically. The exact users, workflows, metrics, and implementation plan are not confirmed
  > yet."
  `status` unchanged as `"Idea"`.
- **Automation:** added `slug: "automation"`; replaced `description` with the exact locked-in text,
  verbatim:
  > "Automation is a project area for defining how Jula's Herb can use AI, workflow automation, and
  > internal tools to reduce repetitive work, improve follow-up, and support business operations
  > more systematically. The exact users, workflows, metrics, and implementation plan are not
  > confirmed yet."
  `status` changed from the prior placeholder `"Planned"` to the human-confirmed real value,
  `"Idea"`.
- No mention of the existing `automation/` directory, Gmail/Drive integrations, or any other
  already-built technical work was added anywhere — per the plan's Anti-Fabrication Protocol, that
  background context was explicitly excluded from shipped content.

## Step 2: No route or component code changes

Confirmed via `git diff --stat` after the edit: zero changes to
`src/components/sections/Projects.tsx` or `src/app/projects/[slug]/page.tsx`. Both continue to
generalize automatically over any number of slugged projects — this is now the third and fourth
slugged project to reuse the pattern with no code overhead, exactly as predicted.

## Step 3: Verification

- `npm run lint` — clean, no errors or warnings.
- `npm run build` — succeeded. Route output confirms all four slugged pages are statically
  generated:
  ```
  ● /projects/[slug]
    ├ /projects/crm
    ├ /projects/wms
    ├ /projects/automation
    └ /projects/store-care-program
  ```
- Extracted the rendered `<main>` text from the built HTML for both `/projects/wms` and
  `/projects/automation` and confirmed each matches its locked-in content exactly: title, "Idea"
  status badge, the locked-in description verbatim, and the standard "idea and early planning stage"
  statement. No mention of features, workflow, metrics, or (for Automation) the existing
  `automation/` directory anywhere on either page.
- Confirmed the homepage's WMS and Automation cards are now real links: `<a href="/projects/wms">`
  and `<a href="/projects/automation">` present in the built homepage HTML, alongside the existing
  CRM and Store Care Program links.
- Regression check against the already-running local dev server (`localhost:3000`):
  - `GET /projects/wms` → `200`
  - `GET /projects/automation` → `200`
  - `GET /projects/crm` → `200` (unaffected)
  - `GET /projects/store-care-program` → `200` (unaffected)
  - `GET /projects/nonexistent-slug` → `404` (unknown slugs still correctly 404)

## Step 4: README

Reviewed `projects/ai-command-center/README.md`'s "You should see…" walkthrough. It does not
enumerate individual project cards, so it remains accurate as-is. No changes made.

## Step 5: This changelog

Documents the diff above. Only `src/data/projects.ts` changed in this cycle; no other
implementation files were touched. (Separately, and outside this cycle's own scope, `actions.ts` and
`notes/architecture/slug-project-pages.md` were updated earlier in this session per direct human
request — not part of this PDCA cycle's Do phase.)

## Diff summary

```diff
   {
     name: "WMS",
-    description: "Warehouse management system for inventory and operations.",
+    description:
+      "WMS is a project area for defining how Jula's Herb tracks inventory, stock movement, stock accuracy, and location-based inventory across warehouse and retail-related stock locations more systematically. The exact users, workflows, metrics, and implementation plan are not confirmed yet.",
     status: "Idea",
     icon: Boxes,
+    slug: "wms",
   },
   {
     name: "Automation",
-    description: "Workflow automation across Gmail, Drive, and other APIs.",
-    status: "Planned",
+    description:
+      "Automation is a project area for defining how Jula's Herb can use AI, workflow automation, and internal tools to reduce repetitive work, improve follow-up, and support business operations more systematically. The exact users, workflows, metrics, and implementation plan are not confirmed yet.",
+    status: "Idea",
     icon: Workflow,
+    slug: "automation",
   },
```
