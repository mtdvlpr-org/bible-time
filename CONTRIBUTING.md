# Contributing to BibleTime

Thank you for your interest in contributing to BibleTime! This guide explains the codebase at a high level and how to get a local development environment running so you can make changes and open pull requests.

## Quick project summary

- Tech stack: Nuxt 4 (Vue 3) + TypeScript, Pinia, Supabase, PWA
- Repo structure (high-level):
  - `app/` — Nuxt application code (pages, components, layouts, locales)
  - `server/` — server API routes and server utilities
  - `shared/` — generated/shared TypeScript types
  - `public/` — static assets and branding (logo, icons)
  - `utils/` and `shared/utils/` — helper utilities and formatters

## Prerequisites

- Node.js: as specified in `package.json` engines (recommended: Node 22.x or later as the project lists >=22.18.0)
- pnpm: the repository uses pnpm as the package manager (see `package.json` -> `packageManager`).
- (Optional) Supabase CLI if you want to generate types or work with the Supabase project locally for the `supabase:types` script.

## Local setup

1. Clone the repository:

```bash
git clone https://github.com/<owner>/bible-time.git
cd bible-time
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment variables (if required):

- For local Supabase integration and server-side features you may need `SUPABASE_URL` and `SUPABASE_KEY` or a local Supabase setup. The repository includes helper utilities in `utils/supabase.ts` and `server/utils`.

4. Start the dev server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Common tasks

- Linting: `pnpm lint` (fix with `pnpm lint:fix`)
- Type checking: `pnpm typecheck` (uses `vue-tsc` / TypeScript)
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- Generate Supabase types (requires `supabase` CLI & access): `pnpm supabase:types`
- Tests: `pnpm test` (note: test scripts are placeholders in this repo)

## Code style

- ESLint and Prettier are configured. Please run `pnpm lint` and `pnpm typecheck` locally before opening a pull request.
- Keep changes small and focused; prefer many small PRs over a single large one.

## Branching and Pull Requests

- Create feature branches from `main`: `git checkout -b feature/your-feature`
- Keep commits atomic and well-described.
- Open a pull request against `main`. Include a description of the change, screenshots (if UI changes), and any migration steps.
- PRs should pass lint and type checks. CI may enforce these checks.

## Reviewing and feedback

- Maintain a friendly and constructive tone in code review comments.
- If your PR includes schema changes, include instructions for any necessary data migrations.

## Security & sensitive data

- Do not commit secrets or credentials. Use environment variables for keys and sensitive configuration.
- If you need to share a secret for debugging with maintainers, use a secure channel.

## Getting help while developing

- For development questions, file an issue and tag it `help wanted` or start a discussion.
- If you're uncertain how to implement something, open a draft PR or issue to get feedback early.

---

Thanks for contributing — your help improves BibleTime for everyone!
