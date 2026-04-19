---
plan: 01-01
phase: 01-foundation
status: complete
completed: 2026-04-19
---

## What Was Built

**Next.js 16.2.4 project scaffolded with Tailwind v4 brand tokens and root layouts.**

Files created:
- `package.json` — name: city-tech-site (lowercase; folder name had caps which npm rejected)
- `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`
- `app/globals.css` — `@import "tailwindcss"` + `:root` brand tokens + `@theme inline` mapping
- `app/layout.tsx` — Root layout: Inter font (400/600), skip-to-content, metadata template
- `app/(marketing)/layout.tsx` — Route group layout wrapping Header + Footer
- `app/(marketing)/page.tsx` — Placeholder homepage
- `components/layout/Header.tsx` — Stub (replaced in Plan 03)
- `components/layout/Footer.tsx` — Stub (replaced in Plan 03)
- `lib/env.ts` — Startup env var validation for 3 required vars
- `instrumentation.ts` — Calls lib/env at startup
- `public/logo.svg` — Placeholder SVG (blue rect + "City Tech" text)
- `public/logos/.gitkeep`, `content/blog/.gitkeep` — Directory tracking
- `.env.example` — Documented env template
- `.env.local` — Placeholder values (gitignored)
- `lib/utils.ts` — shadcn cn() utility

shadcn components added: button, navigation-menu, sheet.
npm packages installed: next, react, react-dom, typescript, tailwindcss, @tailwindcss/postcss, tw-animate-css, lucide-react, class-variance-authority, clsx, tailwind-merge, @supabase/supabase-js, @supabase/ssr, resend.

## Deviations

1. **create-next-app not used** — The folder name `City-Tech-Site` contains capital letters which npm rejects as a package name. Project was bootstrapped manually with a `package.json` using name `city-tech-site`. All config files written directly.
2. **shadcn init required manual components.json** — shadcn 4.3 changed to a TUI preset flow incompatible with `--yes` flag in non-interactive environments. Created `components.json` manually then ran `npx shadcn@latest add button navigation-menu sheet --yes` which succeeded.
3. **Facebook/Instagram icons not in lucide-react** — Lucide removed social media icons in recent versions. Replaced with inline SVG paths in Footer.tsx.
4. **TypeScript: env.ts needed `export {}`** — Pure side-effect file needs an export to be a module for `import()` dynamic import in instrumentation.ts.

## Brand Tokens

- `--primary`: `#1B3A8F` (approximation from logo — owner to update if sampling differs)
- `--accent`: `#00AEEF` (approximation from logo)
- Both confirmed as Tailwind utilities `bg-primary` / `bg-accent` via `@theme inline`

## Verification

- TypeScript: `npx tsc --noEmit` → 0 errors
- Dev server: `npm run dev` → HTTP 200 at localhost:3000
- Page renders: "City Tech — Coming Soon" placeholder
