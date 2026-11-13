# Tensquads website

Marketing site for Tensquads ("A full squad of AI agents for your business.").

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing via TanStack Router)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) via `@cloudflare/vite-plugin`
- Vite 8, TypeScript, pnpm 10 (Node 24)

## Routes

- `/` - home (`src/routes/index.tsx`)
- `/ar` - Arabic home, sets `lang="ar"` and `dir="rtl"` on the document (`src/routes/ar.tsx`)
- `/interview` - interview flow (`src/routes/interview.tsx`)

Static assets live in `public/` (`logo/`, `mascots/`). Global styles are in `src/styles/app.css`.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (runs on workerd) |
| `pnpm build` | Production build for client and SSR, then type check |
| `pnpm preview` | Serve the production build locally |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` |
| `pnpm deploy` | `pnpm build && wrangler deploy` |

## Local development

```sh
pnpm install
cp .dev.vars.example .dev.vars   # then fill in ANTHROPIC_API_KEY
pnpm dev
```

`.dev.vars` is git-ignored and is only read by local tooling.

## Petra interview (`/interview`)

The onboarding interview has two layers that share one state:

- **Scripted** (`src/components/interview/Interview.tsx`): the design's six steps, copy (EN and AR) and squad rules, always available.
- **Generative** (OpenUI): `POST /api/petra` (`src/routes/api/petra.ts`) streams Claude's [OpenUI Lang](https://openui.com) output for each step (`claude-haiku-5-5`). The browser renders it with `@openuidev/react-lang` using the components in `src/components/interview/openui-library.tsx`. Those components are the design's own pieces, so the screen looks the same.

If `ANTHROPIC_API_KEY` is missing (503) or any turn fails, the page silently stays on the scripted layer. `?lang=ar` serves the Arabic version. The server-side prompt and validation live in `src/lib/petra.ts`. The request body is capped at 16 KB and 12 answers.

## Deploy

```sh
wrangler login
wrangler secret put ANTHROPIC_API_KEY
pnpm deploy
```

The Worker is named `tensquads-website` (see `wrangler.jsonc`). The custom domain `10squads.com` will be connected later in the Cloudflare dashboard.
