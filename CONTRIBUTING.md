# Contributing to BibleTime

Thank you for your interest in contributing to BibleTime! This guide explains the codebase at a high level and how to get a local development environment running so you can make changes and open pull requests.

## Quick project summary

- Tech stack: Nuxt 4 (Vue 3) + TypeScript, Pinia, Supabase, PWA
- Repo structure (high-level):
  - `app/` — Nuxt application code (pages, components, layouts, locales)
  - `server/` — server API routes and server utilities
  - `shared/` — generated/shared TypeScript types and helper utilities shared between app and server
  - `public/` — static assets and branding (logo, icons)

## Prerequisites

- Node.js: as specified in `package.json` engines (recommended: Node 22.x or later as the project lists >=22.18.0)
- pnpm: the repository uses pnpm as the package manager (see `package.json` -> `packageManager`).
- (Optional) Supabase CLI if you want to generate types or work with the Supabase project locally for the `generate:supabase-types` script.

## Local setup

1. Clone the repository:

```bash
git clone git@github.com:mtdvlpr-org/bible-time.git
cd bible-time
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment variables:

Create a `.env` file in the project root (or `.env.local` for local-only variables). The following environment variables may be needed depending on which features you want to use:

- **Supabase** (required for database and authentication):
  - `SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
  - `SUPABASE_KEY` - Your Supabase anon key (found in Supabase dashboard under Settings > API)

- **Optional configuration**:
  - `NUXT_SITE_URL` - Base URL for the site (used for i18n and SEO, e.g., `http://localhost:3000` for local dev)
  - `NUXT_SITE_NAME` - Site name (defaults to 'BibleTime' if not set)
  - `GITHUB_TOKEN` - GitHub personal access token (for GitHub API integration, if needed)
  - `CAPTCHA_SITE_KEY` - hCaptcha site key (required for Supabase Auth endpoints - login/signup - and contact form)

**Note**: Never commit `.env` files to version control. The repository includes helper utilities in `app/utils/supabase.ts` and `server/utils/supabase.ts` for working with Supabase.

4. Start the dev server:

```bash
pnpm dev
```

Open <http://localhost:3000> in your browser.

## Common tasks

### Development

- **Start dev server**: `pnpm dev` - Starts development server at <http://localhost:3000>
- **Build for production**: `pnpm build` - Creates production build in `.output` directory
- **Preview production build**: `pnpm preview` - Preview the production build locally
- **Analyze bundle**: `pnpm analyze` - Analyze the production bundle size

### Code quality

- **Linting**: `pnpm lint` - Run ESLint to check code style
- **Fix linting issues**: `pnpm lint:fix` - Automatically fix ESLint issues
- **Type checking**: `pnpm lint:types` - Run TypeScript type checking (uses `vue-tsc`)

### Code generation

- **Generate Supabase types**: `pnpm generate:supabase-types` - Generate TypeScript types from Supabase schema (requires Supabase CLI and project access)
- **Generate PWA assets**: `pnpm generate:pwa-assets` - Generate PWA icons and assets (used in deployment)

### Testing

- **Run tests**: `pnpm test` - Run all tests (note: test scripts are currently placeholders in this repo)

### Deployment

- **Deploy build**: `pnpm deploy` - Generates PWA assets and builds for production (used in CI/CD)

## Translations

- We use Crowdin to manage translations for the project. The Crowdin project is available at: [https://crowdin.com/project/bible-time](https://crowdin.com/project/bible-time)
- The English source file is `app/locales/en.json`. Translated locale files are placed in `app/locales/` (see `crowdin.yml` which maps `app/locales/en.json` to `app/locales/%two_letters_code%.json`).
- How to contribute:
  - Preferred: Contribute translations using the Crowdin web interface for the project linked above.
  - Alternative: You may open a pull request with updated locale files under `app/locales/` (follow the repo's code style and run lint/type checks).
  - Note: Maintainers regularly sync Crowdin translations into the repository; if you need assistance, open an issue and mention the translation update.

## Code style

- ESLint and Prettier are configured. Please run `pnpm lint` and `pnpm lint:types` locally before opening a pull request.
- Keep changes small and focused; prefer many small PRs over a single large one.
- **Important**: See `.cursorrules` for comprehensive code style guidelines, including:
  - Vue 3 Composition API patterns (always use `<script setup lang="ts">`)
  - TypeScript conventions (use `interface` over `type`, no `enum`)
  - Component naming (PascalCase for files and in templates)
  - File structure and organization
  - Nuxt 4 auto-imports and best practices

### Key conventions

- **Components**: Use PascalCase file names (`MyComponent.vue`) and in templates (`<MyComponent />`)
- **Composables**: Use `use` prefix (`useMyComposable.ts`) in `app/composables/`
- **Stores**: Use `use` prefix (`useMyStore.ts`) in `app/stores/`
- **Types**: Use `interface` for object shapes, place in `shared/types/` for shared types
- **Template refs**: Use `useTemplateRef()` composable (auto-imported)
- **Images**: Use Nuxt UI components (e.g., `<UAvatar>`) instead of `<NuxtImage>` directly

## Git workflow

### Commit message conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with commitlint. Commit messages must follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes** (optional but recommended): `a11y`, `api`, `auth`, `build`, `ci`, `core`, `deps`, `docs`, `events`, `i18n`, `people`, `suggestions`, `tests`, `ui`

**Examples**:

- `feat(people): add person detail page`
- `fix(auth): resolve login redirect issue`
- `docs: update contributing guidelines`
- `refactor(ui): improve component structure`

**Note**: Git hooks (via Husky) will automatically validate commit messages. If your commit message doesn't follow the convention, the commit will be rejected with helpful error messages.

### Pre-commit hooks

The project uses Husky with lint-staged to automatically:

- Run ESLint on staged files before committing
- Format code with Prettier
- Validate commit messages

These hooks run automatically on `git commit`. If linting fails, fix the issues and try again.

### Branching and Pull Requests

- Create feature branches from `main`: `git checkout -b feature/your-feature`
- Use descriptive branch names: `feature/add-person-search`, `fix/auth-redirect`, `docs/update-readme`
- Keep commits atomic and well-described (following commit message conventions above)
- Open a pull request against `main`
- Include a clear description of the change, screenshots (if UI changes), and any migration steps
- PRs should pass lint and type checks. CI may enforce these checks
- Keep PRs focused - prefer many small PRs over a single large one

## Reviewing and feedback

- Maintain a friendly and constructive tone in code review comments.
- If your PR includes schema changes, include instructions for any necessary data migrations.

## Security & sensitive data

- Do not commit secrets or credentials. Use environment variables for keys and sensitive configuration.
- If you need to share a secret for debugging with maintainers, use a secure channel.

## Development workflow

### Making changes

1. **Create a branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Follow the code style guidelines in `.cursorrules`
3. **Test locally**: Run `pnpm dev` and test your changes in the browser
4. **Check code quality**: Run `pnpm lint` and `pnpm lint:types` before committing
5. **Commit**: Write a clear commit message following the [Conventional Commits](#commit-message-conventions) format
6. **Push and create PR**: Push your branch and open a pull request

### Before submitting a PR

- [ ] Code follows the style guidelines (see `.cursorrules`)
- [ ] All linting checks pass (`pnpm lint` and `pnpm lint:types`)
- [ ] Commit messages follow Conventional Commits format
- [ ] Changes are tested locally
- [ ] PR description includes context, screenshots (if UI changes), and migration steps (if needed)
- [ ] No secrets or credentials are committed

### Project structure details

Understanding the codebase structure will help you contribute more effectively:

- **`app/components/`** - Vue components (use subdirectories for organization)
- **`app/composables/`** - Reusable composition functions (use `use` prefix)
- **`app/pages/`** - File-based routing (Nuxt automatically creates routes)
- **`app/layouts/`** - Page layouts (default, auth, blank, etc.)
- **`app/middleware/`** - Route middleware (`.global.ts` for global middleware)
- **`app/stores/`** - Pinia stores for state management
- **`app/utils/`** - Client-side utility functions
- **`server/api/`** - Server API routes (use `.get.ts`, `.post.ts`, etc.)
- **`server/utils/`** - Server-side utility functions
- **`shared/types/`** - Shared TypeScript types and interfaces
- **`shared/utils/`** - Utility functions shared between client and server

### Working with Supabase

- Use `useSupabaseClient()` in components for database operations
- Use `serverSupabaseService` in server API routes
- Always use generated types from `shared/types/database.types.ts`
- Handle errors using `handleSupabaseError()` (client) or `supabaseService.handleError()` (server)

### Working with i18n

- All user-facing strings must be translated
- Add translations to `app/locales/en.json` (source language)
- Use `useI18n()` composable: `const { t } = useI18n()`
- In templates: `{{ $t('key.path') }}`
- In scripts: `t('key.path')`
- For translation contributions, use [Crowdin](https://crowdin.com/project/bible-time)

## Troubleshooting

### Common issues

**Issue**: `pnpm install` fails

- **Solution**: Ensure you're using the correct Node.js version (>=22.18.0) and pnpm version (>=10.23.0). Check with `node --version` and `pnpm --version`.

**Issue**: Git hooks not running

- **Solution**: Run `pnpm install` again to ensure Husky hooks are installed. The `postinstall` script should set them up automatically.

**Issue**: Type errors after pulling latest changes

- **Solution**: Run `pnpm prepare:nuxt` to regenerate Nuxt type definitions, or `pnpm install` which runs this automatically.

**Issue**: Supabase connection errors

- **Solution**: Verify your `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY` values. Check that your Supabase project is active.

**Issue**: Linting errors that won't fix

- **Solution**: Run `pnpm lint:fix` to auto-fix issues. For persistent issues, check `eslint.config.mjs` for project-specific rules.

**Issue**: Commit message rejected

- **Solution**: Your commit message must follow Conventional Commits format. See [Commit message conventions](#commit-message-conventions) above.

## Getting help while developing

- **Development questions**: File an issue and tag it `help wanted` or start a discussion
- **Uncertain about implementation**: Open a draft PR or issue to get feedback early
- **Code style questions**: Refer to `.cursorrules` for comprehensive guidelines
- **General help**: See `SUPPORT.md` for how to report bugs or request features

## Additional resources

- **Nuxt 4 Documentation**: https://nuxt.com
- **Vue 3 Documentation**: https://vuejs.org
- **Nuxt UI Documentation**: https://ui.nuxt.com
- **Supabase Documentation**: https://supabase.com/docs
- **TypeScript Documentation**: https://www.typescriptlang.org/docs
- **Conventional Commits**: https://www.conventionalcommits.org/

---

Thanks for contributing — your help improves BibleTime for everyone!
