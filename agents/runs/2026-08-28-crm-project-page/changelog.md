# Change Log — CRM project page

## Step 1: Update the CRM entry in `src/data/projects.ts`

File: `projects/ai-command-center/src/data/projects.ts`

- Added `slug: "crm"`.
- Replaced `description` with the exact locked-in text from the plan, verbatim:
  > "CRM is a project area for defining how Jula's Herb manages customer relationships, customer
  > data, follow-up, retention, and repeat-purchase activities more systematically. The exact
  > users, workflows, metrics, and implementation plan are not confirmed yet."
- `status` left unchanged as `"Idea"`.
- No mention of "likely future users" (CRM/marketing, customer service/admin, management) was
  added anywhere — per the plan's Anti-Fabrication Protocol, that background context was
  explicitly excluded from shipped content.

## Step 2: No route or component code changes

Confirmed, not assumed: read `src/components/sections/Projects.tsx` and
`src/app/projects/[slug]/page.tsx` before touching anything else. Both already generalize over any
project with a `slug` (the card becomes a `<Link>`, and the dynamic route looks the project up by
slug and renders the "Idea" banner automatically). No edits were needed to either file, exactly as
the plan's "Mechanical steps already proven" section predicted.

## Step 3: Verification

- `npm run lint` — clean, no errors or warnings.
- `npm run build` — succeeded. Route output confirms `/projects/crm` is now statically generated
  alongside the existing `/projects/store-care-program`:
  ```
  ● /projects/[slug]
    ├ /projects/crm
    └ /projects/store-care-program
  ```
- Extracted the rendered `<main>` text from the built `/projects/crm` HTML and confirmed it matches
  the locked-in content exactly: page title "CRM", status badge "Idea", the locked-in description
  verbatim, and the standard "idea and early planning stage" statement. No mention of future users,
  features, workflow, or metrics anywhere on the page.
- Confirmed the homepage's CRM card is now a real link: `<a href="/projects/crm">` present in the
  built homepage HTML.
- Regression check against the already-running local dev server (`localhost:3000`):
  - `GET /projects/crm` → `200`
  - `GET /projects/store-care-program` → `200` (unaffected by this change)
  - `GET /projects/nonexistent-slug` → `404` (unknown slugs still correctly 404)

## Step 4: README

Reviewed `projects/ai-command-center/README.md`'s "You should see…" walkthrough. It does not
enumerate individual project cards or reference Store Care Program's page either, so it remains
accurate as-is. No changes made.

## Step 5: This changelog

Documents the diff above. Only `src/data/projects.ts` changed in this cycle; no other files were
touched.

## Diff summary

```diff
   {
     name: "CRM",
-    description: "Customer relationship management for the business.",
+    description:
+      "CRM is a project area for defining how Jula's Herb manages customer relationships, customer data, follow-up, retention, and repeat-purchase activities more systematically. The exact users, workflows, metrics, and implementation plan are not confirmed yet.",
     status: "Idea",
     icon: Building2,
+    slug: "crm",
   },
```
