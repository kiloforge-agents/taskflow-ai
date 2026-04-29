# TaskFlowAI

A no-code customizable workflow studio with embedded generative AI for
auto-task generation and team suggestions. Built as a Progressive Web App
so it installs to your dock with no servers, no seats, and no auth.

## What it does

- **AI Task Studio** — describe a goal in plain English; get a structured,
  tagged plan routed across your columns. Themes are detected (engineering,
  design, marketing, research, ops, product, data) and weighted to compose
  a believable, sequenced plan.
- **Team suggestions** — roles and capacity inform per-task assignment
  recommendations, with rationale persisted on the card.
- **Customizable workflows** — five starter templates plus a blank board.
  Add, rename, or delete columns; tag tasks; set priorities; reassign with
  a click.
- **Drag & drop Kanban** — native HTML5 drag, with subtle drop targets.
- **Local-first** — state lives in `localStorage`; nothing leaves the
  browser.
- **PWA** — installable, with a web app manifest and a custom icon.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- TypeScript

## Develop

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Deploy

This project deploys cleanly to Vercel — no environment variables required.
