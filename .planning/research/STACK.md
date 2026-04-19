# Technology Stack

**Project:** City Tech — Mobile Automotive Locksmith & Electronics Marketing Site
**Researched:** 2026-04-19
**Overall confidence:** HIGH (core framework choices verified against official docs; library versions confirmed from official release pages where accessible)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x (latest stable as of research) | Full-stack React framework | App Router provides native server components, metadata API, sitemap generation, and file-based routing — all critical for SEO-first marketing site. Version 15 is the latest LTS-appropriate release. Note: official blog shows 16.x has shipped; use `create-next-app@latest` to confirm what stable resolves to at project creation time. |
| React | 19.x (bundled with Next.js 15+) | UI rendering | Ships with Next.js — no separate installation decision needed. |
| TypeScript | 5.x | Type safety | Required for Zod integration, Supabase generated types, and mdx-components.tsx convention in App Router. Use strict mode. |

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | v4.2 (current stable) | Utility-first CSS | **Use v4, not v3.** v4 released January 22, 2025 and is stable and production-ready. It is 3.78x faster on full builds, 8.8x faster on incremental rebuilds, requires zero config file (`tailwind.config.js` is gone), uses a single `@import "tailwindcss"` CSS line, and exposes all design tokens as native CSS custom properties. For a new greenfield project there is no reason to start on v3. |
| @tailwindcss/postcss | v4.x | v4 PostCSS integration for Next.js | v4 dropped the Vite plugin approach for Next.js in favor of `@tailwindcss/postcss`. This is the correct adapter for Next.js + v4. See installation note below. |
| @tailwindcss/typography | v0.5.x | Prose styling for MDX blog content | Provides the `prose` class family for rendering markdown/MDX content with correct typographic spacing. Required for the blog. Check for v4 compatibility — as of research, the typography plugin is compatible with v4 via `@import "tailwindcss/typography"` or package import. |

**Tailwind v4 vs v3 decision rationale:**
- v4 is stable (not experimental) as of January 2025
- CSS-first config eliminates the `tailwind.config.js` file entirely; theme customization happens in CSS via `@theme {}` blocks
- No `content` array needed — automatic content detection
- Container queries are built-in (no plugin needed)
- The blue/white brand system maps cleanly to CSS custom properties in `@theme {}`
- No ecosystem lock-in risk: if a specific plugin lags v4 compatibility, the PostCSS fallback path exists
- **Only gotcha:** some third-party plugins written for v3 may not yet support v4. Audit any plugin before adding it. The typography plugin is officially maintained by Tailwind Labs and tracks v4.

### Database / Backend

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase | Hosted (no version to pin) | PostgreSQL database + row-level security + auto-generated REST API | Specified in brief. Handles `service_requests` table storage, status enum column, and RLS policies to ensure the public form endpoint cannot read other rows. No auth needed for v1 (public insert only). |
| @supabase/supabase-js | latest (^2.x) | JavaScript client for server-side DB calls | The standard client. Used in Server Actions and API Route Handlers (not client components) to insert form submissions. |
| @supabase/ssr | latest (^0.x) | SSR/cookie helpers for Next.js App Router | Required when Supabase auth is in play. For this project (public insert only, no auth), `@supabase/ssr` is not strictly needed in v1, but install it anyway to avoid a future refactor if auth is added. It provides the `createServerClient` helper that handles cookie-based session management correctly in Server Components and Middleware. |

**Supabase + Next.js App Router gotchas (HIGH confidence — pattern well-established):**
1. Never instantiate the Supabase client in a Client Component for operations that touch sensitive data. For public form inserts, use a Server Action (`"use server"`) or Route Handler (`app/api/...`). The client-side SDK would expose your `anon` key in the browser bundle — acceptable for reads on public data, but route all writes through the server.
2. The `service_role` key must never appear in client code. It lives in `.env.local` only and is used exclusively in server contexts.
3. Supabase generates TypeScript types from your schema via `supabase gen types typescript`. Run this after creating the `service_requests` table and commit the output to `types/supabase.ts`. This gives you typed query results throughout the app.
4. RLS policy: set `INSERT` policy to allow `anon` role, `SELECT/UPDATE/DELETE` to deny `anon`. This makes the public form safe without needing auth.

### Forms & Validation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Hook Form | ^7.x | Form state management | Specified in brief. Minimal re-renders, first-class Zod resolver support, no dependency on controlled inputs. For a marketing form (service request), this is appropriate and standard. |
| @hookform/resolvers | ^3.x | Bridges RHF with Zod | Required to use Zod schemas as RHF validators. Install alongside react-hook-form. |
| Zod | ^3.x | Schema validation | Specified in brief. Define the service request schema once in `lib/schemas/service-request.ts` and use it for both client-side field validation (RHF) and server-side validation (Server Action). This dual-use is the key value — the same schema validates on both ends. |

**Pattern note:** In App Router, the form submission flow should be: RHF handles client-side validation and UX (error messages, loading states) → on submit, call a Server Action → Server Action re-validates with Zod on the server → inserts into Supabase → calls Resend. Do not POST to an API Route for this; Server Actions are the idiomatic 2025 pattern and eliminate the need for a separate API route file.

### Email

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Resend | ^4.x (check `npm show resend version` at install time) | Transactional email for owner notification | Specified in brief. Developer-friendly API, generous free tier (3,000 emails/month), React Email component support. For a single owner-notification email on form submit, this is more than sufficient. No alternatives evaluated — brief specifies Resend. |
| react-email | optional | HTML email templating | Only needed if owner notification email requires styled HTML. For a simple "new service request" notification, a plain-text template in the Server Action is sufficient for v1 and avoids a dependency. Add `react-email` only if the owner wants rich email formatting. |

### MDX Blog

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @next/mdx | latest (matches Next.js version) | MDX compilation and App Router integration | Official Next.js package. Enables `.mdx` files as pages and imports. Requires `mdx-components.tsx` in project root — this is a hard requirement for App Router, not optional. |
| @mdx-js/loader | latest | Webpack/Turbopack MDX loader | Peer dependency of `@next/mdx`. |
| @mdx-js/react | latest | React context for MDX components | Enables MDX component overrides via `mdx-components.tsx`. |
| @types/mdx | latest | TypeScript types for MDX imports | Required for TypeScript projects. |
| remark-gfm | latest | GitHub Flavored Markdown (tables, strikethrough) | Blog posts will likely use tables and task lists. Add to `remarkPlugins` in `next.config.mjs`. |
| remark-frontmatter | latest | YAML frontmatter parsing | `@next/mdx` does NOT support frontmatter by default. Use this plugin to parse `---` blocks for title, date, description, category, and slug metadata. |
| remark-mdx-frontmatter | latest | Exposes frontmatter as JS exports | Works with `remark-frontmatter` to make frontmatter available as named exports from the MDX file, enabling blog index page generation. |
| gray-matter | ^4.x | Frontmatter extraction for index pages | Use in Server Components to read all blog post files, extract frontmatter, and build the blog listing page. Does not require `remark-frontmatter` — these serve different purposes: gray-matter is for file system reads, remark-frontmatter is for the compilation pipeline. |
| globby | ^14.x (ESM) | File system glob for blog post discovery | Use in `generateStaticParams` and blog index to enumerate all `.mdx` files in `content/blog/`. ESM-only package; ensure `next.config.mjs` (not `.js`) is used. |

**Turbopack + remark plugin gotcha (HIGH confidence — from official Next.js docs):** When Turbopack is the bundler (enabled by default in Next.js 15+ dev mode), remark/rehype plugins must be specified as **strings** (module names), not function references, because JavaScript functions cannot be passed to Rust. Switch to string format in `next.config.mjs`:
```js
remarkPlugins: ['remark-gfm', 'remark-frontmatter', ['remark-mdx-frontmatter', { name: 'frontmatter' }]]
```
This is the Turbopack-compatible pattern. The Rust-based MDX compiler (`mdxRs: true`) is still experimental — do not enable it.

**MDX frontmatter recommendation:** Use exported metadata objects (the `export const metadata = {}` pattern) rather than YAML frontmatter for Next.js App Router integration. This approach works natively with `@next/mdx` without any plugins:
```mdx
export const metadata = {
  title: 'How to Handle a Car Lockout',
  date: '2026-04-01',
  description: '...',
  category: 'locksmith',
}
```
The metadata can then be imported in the blog index page. This is simpler than the remark-frontmatter plugin chain for a v1 site.

### Map

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Leaflet | ^1.9.x | Interactive map rendering | **Choose Leaflet over Mapbox.** See decision rationale below. |
| react-leaflet | ^4.x | React wrapper for Leaflet | The standard React integration. Compatible with React 18/19. |

**Leaflet vs Mapbox decision — rationale:**

Choose Leaflet because:
1. **No API key, no billing risk.** Mapbox requires an account and API key; even the free tier has monthly tile request limits that could be hit by even moderate traffic. Adding a payment method to a client project for a map is operational overhead that Leaflet avoids entirely.
2. **Sufficient for a service area polygon.** The requirement is a static service area map centered on the DMV region — a choropleth polygon over an OpenStreetMap tile layer. Leaflet handles this perfectly with zero licensing concerns.
3. **Simpler bundle.** Mapbox GL JS is a WebGL renderer — heavier bundle, GPU dependency, more complex initialization. For a marketing site showing a service zone, the extra complexity is unjustified.
4. **Open source, no vendor lock-in.** Leaflet is MIT-licensed and tile-provider-agnostic.

Mapbox would be the correct choice if the project needed: custom styled basemaps, 3D terrain, real-time data layers, or satellite imagery at scale. None of these apply here.

**Critical Leaflet + Next.js App Router SSR gotcha (MEDIUM confidence — well-known pattern, not verified from official docs in this session):** Leaflet requires `window` and `document` and will crash on server-side rendering. The map component MUST be wrapped in `dynamic()` with `ssr: false`:
```tsx
import dynamic from 'next/dynamic'
const ServiceAreaMap = dynamic(() => import('@/components/ServiceAreaMap'), { ssr: false })
```
The actual Leaflet map component lives in a Client Component file (`"use client"` directive). This is the only correct integration pattern for Leaflet in App Router.

Additionally, Leaflet's default marker icons break in webpack/Next.js environments because of how it resolves image paths. Fix at component initialization:
```ts
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Icon.Default.mergeOptions({ iconUrl: iconUrl.src, shadowUrl: shadowUrl.src })
```
Or use custom SVG markers to sidestep the issue entirely (recommended for this project).

### SEO Infrastructure

| Technology | Purpose | Implementation |
|------------|---------|---------------|
| Next.js Metadata API | Per-page OG tags, title templates, description | Native — no library needed. Export `metadata` object or `generateMetadata` function from `layout.tsx` / `page.tsx`. Server Components only. |
| Next.js sitemap.ts | Auto-generated sitemap.xml | Native — create `app/sitemap.ts` returning `MetadataRoute.Sitemap`. Automatically includes static pages. Dynamic blog post URLs generated by reading MDX files at build time. |
| Next.js robots.ts | robots.txt | Native — create `app/robots.ts`. |
| JSON-LD (LocalBusiness schema) | Structured data for local search | Not natively supported by metadata API. Inject as a `<script type="application/ld+json">` tag directly in the root layout Server Component. No library needed — build the object inline. |

**JSON-LD implementation pattern for LocalBusiness:**
```tsx
// app/layout.tsx (Server Component)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'City Tech',
  description: 'Mobile automotive locksmith and electronics, DMV region',
  areaServed: ['Washington DC', 'Maryland', 'Virginia'],
  // ...
}
// In JSX:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### Deployment

| Technology | Purpose | Why |
|------------|---------|-----|
| Vercel | Hosting and CI/CD | Specified in brief. First-party Next.js support, zero-config deployment, Edge Network for static assets, preview deployments on PRs. Free hobby tier is sufficient for a marketing site at this traffic level. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| CSS framework | Tailwind v4 | Tailwind v3 | v3 is legacy for new projects. v4 is stable, faster, and requires less configuration. |
| CSS framework | Tailwind v4 | CSS Modules | No ecosystem objection, but Tailwind is specified in brief and better suited to rapid utility-first development. |
| Map | Leaflet | Mapbox GL JS | Requires API key and billing account; heavier bundle; visual complexity unjustified for a service area polygon. |
| Map | Leaflet | Google Maps (react-google-maps) | Requires Google Cloud billing; $7/1000 map loads beyond free tier; API key management overhead for a static service zone. |
| Email | Resend | SendGrid | Resend has a simpler API, better DX, and React Email integration. Brief specifies Resend. |
| Blog | MDX + @next/mdx | Contentlayer | Contentlayer was deprecated/abandoned in 2024. Do not use it. |
| Blog | MDX + @next/mdx | Sanity / Contentful (headless CMS) | Out of scope for v1 per project constraints. MDX co-located with codebase is sufficient for SEO-driven blog with infrequent updates. |
| Form | React Hook Form | Formik | RHF is lighter, faster, and the current community standard. Brief specifies RHF. |
| Validation | Zod | Yup | Zod is TypeScript-native and more ergonomic. Brief specifies Zod. |
| Supabase integration | Server Actions | API Routes | Server Actions are the idiomatic App Router pattern for form submissions. Fewer files, no need for a separate `fetch` call from the client. |

---

## Installation

```bash
# Scaffold project
npx create-next-app@latest city-tech --typescript --eslint --app --src-dir --import-alias "@/*"

# Tailwind CSS v4
npm install tailwindcss @tailwindcss/postcss postcss
npm install @tailwindcss/typography

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Forms and validation
npm install react-hook-form @hookform/resolvers zod

# Email
npm install resend

# MDX
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install remark-gfm gray-matter globby

# Map
npm install leaflet react-leaflet
npm install -D @types/leaflet

# Dev tooling (ESLint, Prettier already handled by create-next-app)
```

**postcss.config.mjs** (required for Tailwind v4):
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**app/globals.css** (Tailwind v4 entry point):
```css
@import "tailwindcss";

@theme {
  --color-brand: #1d4ed8;   /* City Tech blue — update to actual brand blue */
  --color-brand-dark: #1e3a8a;
}
```

---

## What NOT to Use

| Library | Reason |
|---------|--------|
| Contentlayer | Deprecated/unmaintained since 2024. Community forks exist but are unsupported. Use `@next/mdx` + gray-matter instead. |
| next-mdx-remote | Designed for remote MDX (from a CMS). For local file MDX, `@next/mdx` is simpler and officially supported. Only reach for `next-mdx-remote` if MDX content will be stored in the database or fetched from an external API. |
| next-sitemap | Third-party package for sitemap generation. Next.js 13+ has a native `sitemap.ts` file convention. The third-party package is unnecessary overhead. |
| react-helmet | Deprecated in Next.js App Router. Metadata is handled by the native Metadata API (`export const metadata`). |
| axios | No need — `fetch` is available natively in Next.js server and client environments. Supabase client handles its own HTTP. |
| @mapbox/mapbox-gl | See Leaflet rationale above. |
| mdxRs: true (experimental) | The Rust-based MDX compiler in Next.js is still experimental as of Next.js 16. Do not enable in production. |

---

## Version Confidence Notes

| Package | Version Source | Confidence |
|---------|---------------|------------|
| Next.js | Official Next.js blog (nextjs.org/blog) — 15.x/16.x confirmed | HIGH |
| Tailwind CSS | Official Tailwind blog + install docs — v4.2 confirmed | HIGH |
| @tailwindcss/postcss | Official Tailwind Next.js install guide | HIGH |
| @next/mdx pattern | Official Next.js MDX docs (version 16.2.4 page) | HIGH |
| Supabase packages | Supabase docs inaccessible in this session — package names from training data | MEDIUM — verify `@supabase/supabase-js` and `@supabase/ssr` versions at `npm show <package> version` |
| react-hook-form | Training data (^7.x) — could not verify current release | MEDIUM — check npm at install time |
| Zod | Training data (^3.x) | MEDIUM — check npm at install time |
| Resend | Training data (^4.x) | MEDIUM — check `npm show resend version` |
| react-leaflet | Training data (^4.x, React 18/19 compatible) | MEDIUM — verify SSR: false pattern still required |
| Leaflet | Training data (^1.9.x) | MEDIUM — icon fix pattern well-established but verify |
| gray-matter | Training data (^4.x) | MEDIUM |
| globby | Training data (^14.x, ESM-only) | MEDIUM |

All MEDIUM confidence packages should have their exact versions confirmed with `npm show <package> version` before finalizing `package.json`. The architectural patterns and integration approaches are HIGH confidence regardless of exact version numbers.

---

## Sources

- Next.js Blog (nextjs.org/blog) — version 15.x/16.x release history
- Tailwind CSS Blog (tailwindcss.com/blog/tailwindcss-v4) — v4 stable release, feature summary
- Tailwind CSS Install Docs (tailwindcss.com/docs/installation/framework-guides/nextjs) — v4 Next.js installation steps
- Next.js MDX Docs (nextjs.org/docs/app/guides/mdx, version 16.2.4) — official MDX integration, Turbopack plugin gotcha, mdx-components.tsx requirement
- Next.js Metadata Docs (nextjs.org/docs/app/api-reference/functions/generate-metadata) — metadata API, JSON-LD injection pattern
- Next.js Sitemap Docs (nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — native sitemap.ts convention
