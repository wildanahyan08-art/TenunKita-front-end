<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TenunKita FE — Agent Guide

## Stack
- **Next.js 16.2.6** + **React 19.2.4** — App Router, `'use client'` on interactive pages
- **Tailwind CSS v4** — uses `@import "tailwindcss"` in CSS (NOT `@tailwind` directives); PostCSS plugin is `@tailwindcss/postcss`
- **ESLint v9** flat config (`eslint.config.mjs`) — uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- **TypeScript** strict mode; path alias `@/*` maps to project root (not `src/`)

## Commands
```
npm run dev       # dev server (http://localhost:3000)
npm run build     # production build
npm run start     # start production server
npm run lint      # eslint (flat config)
npx tsc --noEmit  # typecheck (no built-in script)
```
No test framework configured.

## Auth
- JWT + user data stored in **localStorage** under keys `access_token` and `user`
- Login: `POST {NEXT_PUBLIC_API_URL}/auth/login` → saves token + user to localStorage
- Register: `POST {NEXT_PUBLIC_API_URL}/auth/register`
- Navbar & Dashboard read auth from `localStorage` (client-only)
- `helper/cookies.ts` provides server-side cookie helpers (httpOnly) but auth flow uses localStorage

## Backend API
- Base: `NEXT_PUBLIC_API_URL` (default: `https://tenunkita-production.up.railway.app`)
- Endpoints in `lib/api.ts`: `/orders`, `/user/profile` (GET + PUT) — all Bearer token auth
- `next.config.ts` configures remote image patterns for pexels, unsplash, cloudinary

## Project structure
```
app/              # Pages (landing, /sign-in, /sign-up, /dashboard)
components/
  navbar/         # Navbar (reads auth from localStorage)
  layout/         # DashboardLayout (sidebar + main area)
  dashboard/      # ActivityChart, RecentOrders, StatCard, WishlistCard
  ui/             # BatikBorder, SectionHeading (shared primitives)
lib/              # api.ts (fetch wrapper), utils.ts (empty)
helper/           # cookies.ts (server-side cookie helpers)
types/            # User, Order, StatData interfaces
```

## Conventions & gotchas
- All UI text is in **Indonesian** (id-ID locale)
- Design uses amber/batik theme (`amber-600`, `#1a120b`, `#faf6f0`)
- Reusable UI primitives live at `@/components/ui/` (BatikBorder, SectionHeading)
- `lib/utils.ts` is empty — don't expect utilities there
- `Sidebar.tsx` and `Header.tsx` under `components/dashboard/` are empty stubs — DashboardLayout is the real sidebar
- No pre-commit hooks, no CI visible
- `@tailwindcss/postcss` is used instead of the legacy `tailwindcss` PostCSS plugin
