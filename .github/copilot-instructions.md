## Purpose

This file contains targeted, repository-specific guidance for AI coding agents working on the `bible-time` Nuxt 4 application. Use it to discover the architecture, developer workflows, conventions, and integration points that matter for code changes.

## Quick overview

- Tech: Nuxt 4 (Vue 3), TypeScript, Pinia, Nuxt UI (component library), Supabase (server & client), @nuxtjs/i18n, Zod.
- Frontend lives in `app/` (pages, components, composables, stores). Server endpoints live in `server/api/`.
- Shared TypeScript types live under `shared/` and generated Supabase types are placed at `shared/types/database-generated.types.ts` (see `package.json` script `supabase:types`).

## Important files to open first

- `nuxt.config.ts` — modules, aliases (`#server` -> `./server`), i18n config, sitemap sources, supabase types link.
- `package.json` — dev scripts: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm lint`, `pnpm typecheck`, and `pnpm supabase:types`.
- `app/utils/supabase.ts` and `server/utils/supabase.ts` — central supabase helpers (error handling). Mirror patterns when adding new server/api code.
- `shared/types/` — shared type contracts (database types and general types).
- `server/api/` — server endpoints. Example files: `customers.ts`, `members.ts`, `mails.ts`, `notifications.ts`, `__sitemap__/urls.ts`.

## Architecture notes & common patterns

- Data flow: client pages (in `app/pages/`) and composables call server endpoints (`server/api/*`) which use Supabase utilities in `server/utils/supabase.ts`. Shared types in `shared/` are the contract between client and server.
- Supabase types are generated with the `supabase` CLI and kept under `shared/types/`. Keep `nuxt.config.ts` setting `supabase.types` in sync if moving files.
- Server routes follow Nuxt server API conventions. Add `server/api/yourname.get.ts` or `.post.ts` and use `defineEventHandler` / `createError` patterns (see `supabaseService.handleError`).
- UI: components use Nuxt UI and composables live under `app/composables/`. Pinia stores are in `app/stores/`.

### UI library (Nuxt UI)

- This project uses Nuxt UI as its primary component library (installed as `@nuxt/ui` in `nuxt.config.ts`). Nuxt UI components are auto-registered and commonly use a `U` prefix (for example `UButton`, `UDropdownMenu`).
- Local, app-specific components live under `app/components/` (see `app/components/home/*` and `app/components/people/*`). Prefer reusing Nuxt UI primitives and compose them into local components when you need project-specific behavior.
- Use `.client` / `.server` component suffixes when you need to split rendering between server and client (this repo already contains examples: `app/components/home/HomeChart.client.vue` and `HomeChart.server.vue`).
- When typing or interacting with Nuxt UI components in TypeScript, prefer using lightweight Vue `Component` types or the library's own types if available; avoid `any`.

## Developer workflows & commands

- Install: `pnpm install` (pnpm v10+ required per `package.json`).
- Dev server: `pnpm dev` (runs `nuxt dev` and serves on http://localhost:3000).
- Build: `pnpm build` then `pnpm preview` to locally preview the production build.
- Linting: `pnpm lint` and auto-fix with `pnpm lint:fix`.
- Typecheck: `pnpm typecheck` (uses `nuxt typecheck` / `vue-tsc`).
- Generate Supabase types: `pnpm supabase:types` (invokes `supabase gen types` and writes to `shared/types/database-generated.types.ts`).

## Conventions to follow (observed in repo)

- TypeScript everywhere; avoid `any` where possible. When a temporary `any` is needed, prefer creating a narrow typed interface and add a TODO to refine.
- Linter conventions: unused variables should be prefixed with `_` to satisfy the project's ESLint rules (e.g. `_unusedVar`). Avoid leaving declared-but-unused symbols.
- Components use `<script setup lang="ts">` and Vue composition API patterns (see `eslint.config.mjs` rules).
- Centralize Supabase error handling via `supabaseService.handleError` to ensure consistent HTTP errors.

## Integration points & external dependencies

- Supabase: configured via `@nuxtjs/supabase` (see `nuxt.config.ts`) — runtime auth redirect options and types configured there.
- Sitemap: generated from server APIs: `/api/__sitemap__/urls?type=events` and `?type=people`.
- i18n: uses `@nuxtjs/i18n` with `langDir: 'locales'` and `restructureDir: 'app'`. Adding pages/components must consider route prefixing for locales.

## Troubleshooting & debugging tips

- If runtime types are inconsistent, re-run `pnpm supabase:types` and `pnpm prepare` / `pnpm install` to refresh generated types and `.nuxt` artifacts.
- To debug server endpoints, inspect `server/api/*` and `server/utils/supabase.ts`. Server logs appear in the terminal running `pnpm dev`.
- For UI issues, check `app/components/`, `app/composables/`, and `app/stores/` in that order — composables often encapsulate data logic used across pages.

## Where to add new functionality

- New pages: `app/pages/your-page.vue` or nested route folders. Use `pages/<name>/index.vue` or dynamic `[slug].vue` as shown in `app/pages/people/[slug].vue`.
- New API routes: create `server/api/<name>.get.ts` or `.post.ts`. Reuse `supabaseService.handleError`.
- New shared types: add to `shared/types/` and, if needed, update generated supabase types.

## Quick examples

- Add a GET API route: `server/api/hello.get.ts` -> export default defineEventHandler(async () => { return { hello: 'world' } })
- Use supabase error handler in server code:
  - import { supabaseService } from '#server/utils/supabase'
  - on PostgrestError: `supabaseService.handleError(error, 500, 'Supabase error')`

---

If anything above is unclear or you want more details about a particular area (build, auth flow, data model, or test setup), tell me which area to expand and I will update this file accordingly.
