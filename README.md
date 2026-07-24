# DJEMAI Mohamed Erraid — Portfolio (API-client concept)

A full-stack developer portfolio styled as a real API client: pick a request
from the sidebar (or edit the URL bar yourself), hit **Send**, and the
response renders as a polished component -- not a JSON dump -- by default.

This version's visual design was authored in Lovable and ported here to
**Next.js (App Router)** + **TypeScript** while preserving the design 1:1.
Originally built on TanStack Start; the UI layer (shadcn/ui, Tailwind v4,
all components) carried over unchanged, only the routing/server layer changed.

## Status: MVP with mock data, real routes

Every `/api/*` route is a genuine Next.js Route Handler -- the network tab
shows real requests -- but each one currently reads from a static in-memory
data module (`src/lib/seed/`) instead of a database. Every mock data source
is marked `// MOCK:` in the route handler with a note on what the real query
would look like. Swapping to a real backend later means changing the inside
of these route handlers only; no frontend component needs to change.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What changed in the Next.js port

- TanStack Start's file-based `src/routes/api/*.ts` (`createFileRoute(...).server.handlers`)
  → Next Route Handlers at `src/app/api/*/route.ts` (`export async function GET/POST`).
  Logic and response shapes are byte-identical to the original.
- `src/routes/index.tsx` → `src/app/page.tsx`. Same component logic (the
  `useApiClient` hook, tab state, modal state, all handlers) -- just dropped
  the `createFileRoute` wrapper and added `"use client"`.
- `src/routes/__root.tsx` → `src/app/layout.tsx` (fonts + metadata) plus
  `src/app/not-found.tsx` and `src/app/error.tsx` (Next's dedicated
  conventions instead of TanStack's `notFoundComponent`/`errorComponent`).
- Google Fonts link tags → `next/font/google` for Inter + JetBrains Mono
  (same families, same weights).
- Removed `@tanstack/*`, Vite, and Nitro entirely; removed `@tanstack/react-query`
  too (it was wired up in the root route but never actually used anywhere
  in the app -- confirmed by search before removing, no functionality lost).
- Everything else -- all `components/ui/*` (shadcn), all `components/client/*`
  (Sidebar, RequestBar, TabBar, ResponsePanel, ProjectPreview,
  ProjectListPreview, MediaGallery, LinkButtons, ExpandedPreviewModal,
  TestsStrip, badges), `hooks/useApiClient.ts`, and all `lib/` data --
  copied over unchanged.

## What's new since the Lovable version (this session's additions)

- **Profile photo**: `profile.photoUrl` (a plain URL string) renders via a
  shadcn `Avatar` in the profile card, with initials as a fallback. It's a
  placeholder URL right now -- drop in your real Cloudinary URL in
  `src/lib/seed/profile.ts` and nothing else needs to change, since the
  frontend only ever needed a URL string here.
- **Sidebar icons**: every collection item in `src/lib/collections.ts` now
  carries a `lucide-react` icon (Profile/Projects/Skills/Experience/Contact/
  the locked login item), rendered next to the method badge in `Sidebar.tsx`.
- **Login form fields**: the `auth/login` Body tab now has real email and
  password inputs (previously just a bare "poke" button with no fields).
  The note is kept, reworded to: *"Spoiler: I won't authenticate you anyway
  -- this route is real, but no combination of these fields gets you in."*
  Submitted values are sent in the POST body (the mock route still ignores
  them) -- this is deliberately structured so that wiring up **real** admin
  authentication later (giving you, the only admin, access to routes that
  manage live content) is a clean addition to this same form and endpoint,
  not a rewrite. Not implemented in this pass, by design.
- **Mobile sidebar drawer**: the original design had no mobile treatment at
  all for the sidebar (it was simply `hidden` below the `md` breakpoint,
  with nothing replacing it). Added a small mobile header with a hamburger
  button that opens the sidebar in a shadcn `Sheet` drawer -- reuses
  components that already existed in the codebase but weren't wired up
  anywhere.

## The core mechanic: pinned vs. hidden projects

`GET /api/projects` always returns **all 7** projects (pinned and hidden
alike) -- but `src/lib/collections.ts` (the sidebar) only lists the 5 pinned
ones individually. Editing the URL bar from `/api/projects/1` to
`/api/projects/6` reveals a project that was never in the sidebar.

## Editing content

- **Profile / bio / socials / photo**: `src/lib/seed/profile.ts`
- **Projects**: `src/lib/seed/projects.ts` -- see `src/lib/types.ts` for the
  full shape (media, link availability + reasons, docs markdown)
- **Skills**: `src/lib/seed/skills.ts`
- **Experience / leadership**: `src/lib/seed/experience.ts`
- **Sidebar structure + icons**: `src/lib/collections.ts`

## Verified working (smoke-tested before packaging)

- `tsc --noEmit` and `eslint` both pass with zero errors/warnings
- `next build` completes successfully, all 7 API routes compile
- `GET /api/projects` → 200, all 7 projects present, tests array confirms it
- `GET /api/projects/6` → 200, the hidden "Confidential Client Project" (not
  in the sidebar) is reachable by id
- `GET /api/projects/99` → 404 with a clean error body
- `POST /api/auth/login` → 401, 401, 401, then 429 on the 4th rapid attempt
- Homepage → 200

## Deploying

Standard Next.js app -- deploys to Vercel with zero config:

```bash
npx vercel
```
