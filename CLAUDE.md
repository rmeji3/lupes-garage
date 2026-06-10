# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js version

This project uses **Next.js 16** (App Router). This version has breaking changes — APIs, conventions, and file structure may differ from training data. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. (See `AGENTS.md`.)

## The business

**Lupe's Garage** — a family-owned, Hispanic-owned **garage door installation business** serving the **Cicero / Chicago, IL** area. The site is a marketing/lead-generation website for the business: showcase services, build trust, and make it easy for local customers to get a quote or call.

Tone & content implications:
- Warm, trustworthy, family-owned feel — not a faceless corporate look. Emphasize craftsmanship, local roots, and personal service.
- The customer base is **bilingual (English/Spanish)**. The site must be fully usable in both languages — this is a primary requirement, not an afterthought (see i18n below).
- Lead capture (call, text, quote request) and local SEO (Cicero, Chicago, surrounding suburbs) matter more than flashy features.

## Design & code guidelines — use the `ui-ux-pro-max` skill

For **all UI/UX work** (planning, building, designing, reviewing, fixing, or improving components, layout, color, typography, spacing, animation, accessibility), invoke the **`ui-ux-pro-max`** skill and follow its guidance. Treat it as the source of truth for design and front-end code quality on this project. Stack context to pass it: **Next.js + React + Tailwind CSS**.

## Internationalization (English / Spanish)

The site must support an **English ⇄ Spanish language toggle** (a visible translate button in the header/nav). When implementing:
- Keep all user-facing copy in translation dictionaries, not hardcoded in JSX, so both languages stay in sync.
- Default language and SEO should account for a bilingual local audience.
- Read the current Next.js 16 i18n / routing guidance in `node_modules/next/dist/docs/` before choosing an approach (locale routing has changed across Next versions).

## Hosting

Deployed on **Vercel**. Do **not** add AWS Amplify or other backend-hosting tooling. Keep the project Vercel-friendly (standard Next.js build, environment variables via Vercel, no custom server unless necessary).

## Commands

```bash
npm run dev      # Start the dev server
npm run build    # Production build
npm start        # Run the production build locally
npm run lint     # ESLint (eslint-config-next, flat config in eslint.config.mjs)
```

## Stack & structure

- **Next.js 16** App Router, **React 19**, **TypeScript**
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss` (`postcss.config.mjs`); global styles and theme tokens live in `src/app/globals.css` (Tailwind v4 uses CSS-based config, not a `tailwind.config.js`).
- Source lives under `src/`; routes/layouts under `src/app/`. Import alias **`@/*`** → `src/*`.
- `next.config.ts` for Next config; `eslint.config.mjs` for lint (flat config).
