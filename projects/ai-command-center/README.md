# AI Command Center

The landing page for the AI Engineering Playground, designed to grow into a dashboard for AI tools, automation, CRM, WMS, and other business applications built in this repo.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- npm

## Prerequisites

- Node.js >= 20.9.0 (required by the installed Next.js version)
- npm (this project uses `package-lock.json`; no other package manager is supported)
- No environment variables are required to run this locally.

## Development

```bash
git clone https://github.com/Notti21/Ai-playground.git
cd Ai-playground/projects/ai-command-center
npm install
npm run dev
```

Open http://localhost:3000. You should see the "Command Center" landing page: a hero heading
("Command Center") followed by sections titled "Plan, Do, Check, Act", "What the system is being
applied to", "What powers the system", "What the system knows", "What the agents have done", and
"What's next".

## Production build

```bash
npm run build
npm run start
```

Serves the same page as `npm run dev`, from an optimized production build.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint with ESLint
