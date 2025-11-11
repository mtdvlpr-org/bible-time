# BibleTime

BibleTime is a web app that provides an overview of Biblical people and events. It is built as a progressive web app (PWA) using Nuxt 4 and TypeScript.

This repository contains the source code for the site and the developer tools to run, build and extend it.

## What it does

- Browse and search Biblical people with basic biographical details.
- Browse events and view event pages that can reference people.
- Suggest edits or additions via the suggestions workflow.
- Supports English and Dutch (i18n).

## Who is this for

This README is written for general users and contributors who want to understand what the project does and how to get help. If you're a developer who wants to run or modify the code, please see `CONTRIBUTING.md` for setup and developer guidance.

## Quick overview

- Tech: Nuxt 4 (Vue 3), TypeScript, Pinia, Supabase, PWA support
- Data and auth: Supabase (server integration present in `server/` and `utils/supabase.ts`)
- State: Pinia with persisted state
- Internationalization: English and Dutch

## Try it locally (developer steps)

Developers: follow `CONTRIBUTING.md` for full local setup instructions. In summary:

1. Install Node.js (see `package.json` engines) and pnpm.
2. Clone the repo and run `pnpm install`.
3. Start the dev server with `pnpm dev` and open http://localhost:3000.

## Project status

- License: MIT — see `LICENSE`
- Support: only the latest version of the project is supported. See `SECURITY.md` for details on supported versions and reporting vulnerabilities.

## Where to get help

See `SUPPORT.md` for how to report bugs, request features, or ask for help. For development-related contributions, please follow `CONTRIBUTING.md`.

## Project layout (high-level)

- `app/` — Nuxt application code (pages, components, layouts, locales)
- `server/` — server API routes and server utilities
- `shared/` — generated and shared TypeScript types
- `public/` — static assets and branding (logo, icons)
- `utils/`, `shared/utils/` — helper utilities and formatters

## Useful scripts

See `package.json` for the exact list. Common commands:

- `pnpm dev` — start development server
- `pnpm build` — build production bundle
- `pnpm preview` — preview production build locally
- `pnpm lint` / `pnpm lint:fix` — run ESLint
- `pnpm typecheck` — TypeScript checks
- `pnpm test` — run tests (placeholder)
- `pnpm supabase:types` — generate Supabase types (requires supabase CLI and credentials)

---

Thanks for checking out BibleTime! If you'd like to contribute, start with `CONTRIBUTING.md` and say hello in an issue or discussion.
