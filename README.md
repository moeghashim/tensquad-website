# Tensquads website

Marketing site for Tensquads ("A full squad of AI agents for your business.").

One codebase builds two separate sites, one per language. Each is its own Cloudflare Worker and will get its own domain:

| Site | Language | Worker | Domain |
| --- | --- | --- | --- |
| English | `en` (LTR) | `tensquads-website` | 10squads.com (to be connected in the dashboard) |
| Arabic | `ar` (RTL) | `tensquads-website-ar` | TBD |

The language is fixed at build time. There is no runtime language switching.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing via TanStack Router)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) via `@cloudflare/vite-plugin`
- Vite 8, TypeScript, pnpm 10 (Node 24)

## Routes

Each site serves the same three paths, in its own language:

- `/` - home (`src/routes/index.tsx`, renders `<Home locale={LOCALE} />`)
- `/interview` - Petra onboarding interview (`src/routes/interview.tsx`)
- `/api/petra` - POST, streams the interview turns (`src/routes/api/petra.ts`)

The document's `lang` and `dir` come from the build locale (`src/routes/__root.tsx`).

## Build-time locale

`src/lib/locale.ts` exports `LOCALE` (`'en' | 'ar'`) and `DIR`. Both are read from `import.meta.env.VITE_SITE_LOCALE`, which defaults to `en`. Any other value fails the build.

Copy is split per locale (`src/components/home/copy.{en,ar}.ts`, `src/components/interview/copy.{en,ar}.ts`). The selection is `LOCALE === 'ar' ? ar : en`, so each build ships only its own language. Verify with:

```sh
pnpm build:en && grep -rl 'فريق كامل' dist/client dist/server   # no output
pnpm build:ar && grep -rl 'A full squad for your success' dist/client dist/server   # no output
```

Source maps are disabled in `vite.config.ts` because they embed the source text of the unused locale.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Vite dev server, English (runs on workerd) |
| `pnpm dev:ar` | Vite dev server, Arabic |
| `pnpm build:en` | Production build of the English site |
| `pnpm build:ar` | Production build of the Arabic site |
| `pnpm build` | `build:en` then `typecheck` |
| `pnpm preview` | Build English, then serve it locally |
| `pnpm preview:ar` | Build Arabic, then serve it locally |
| `pnpm deploy:en` | `build:en` then `wrangler deploy` (Worker `tensquads-website`) |
| `pnpm deploy:ar` | `build:ar` then `wrangler deploy` (Worker `tensquads-website-ar`) |
| `pnpm deploy` | `deploy:en` then `deploy:ar` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` |

The Arabic scripts set `VITE_SITE_LOCALE=ar` and `CLOUDFLARE_ENV=ar`. The Cloudflare Vite plugin reads `CLOUDFLARE_ENV` at build time and writes the matching config to `dist/server/wrangler.json`, plus a redirect in `.wrangler/deploy/config.json`. `wrangler deploy` follows that redirect, so the deploy scripts need no `--env` flag.

## Workers and secrets

`wrangler.jsonc` defines two environments:

- Top level: `name: "tensquads-website"` (English, already deployed).
- `env.ar`: `name: "tensquads-website-ar"` (Arabic).

Secrets are per Worker, so each one needs its own `ANTHROPIC_API_KEY`:

```sh
wrangler login
wrangler secret put ANTHROPIC_API_KEY              # English Worker
wrangler secret put ANTHROPIC_API_KEY --env ar     # Arabic Worker
```

Without the key, `/api/petra` returns 503 and the interview stays on its scripted flow.

## Local development

```sh
pnpm install
cp .dev.vars.example .dev.vars   # then fill in ANTHROPIC_API_KEY
pnpm dev                         # or pnpm dev:ar
```

`.dev.vars` is git-ignored and is only read by local tooling.

Static assets live in `public/` (`logo/`, `mascots/`). Global styles are in `src/styles/app.css`.

## Petra interview (`/interview`)

The onboarding interview has two layers that share one state:

- **Scripted** (`src/components/interview/Interview.tsx`): the design's six steps, the copy for the build's locale, and the squad rules. Always available.
- **Generative** (OpenUI): `POST /api/petra` (`src/routes/api/petra.ts`) streams Claude's [OpenUI Lang](https://openui.com) output for each step (`claude-haiku-5-5`). The browser renders it with `@openuidev/react-lang` using the components in `src/components/interview/openui-library.tsx`. Those components are the design's own pieces, so the screen looks the same.

If `ANTHROPIC_API_KEY` is missing (503) or any turn fails, the page silently stays on the scripted layer. The server-side prompt and validation live in `src/lib/petra.ts`, and the server always uses the build's `LOCALE`. A request whose `locale` field differs from it is rejected (400). The request body is capped at 16 KB and 12 answers.

## Custom domains

Connect each domain in the Cloudflare dashboard after its Worker is deployed:

- English: `10squads.com` on `tensquads-website`.
- Arabic: domain TBD, on `tensquads-website-ar`.
