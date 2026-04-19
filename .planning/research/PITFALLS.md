# Domain Pitfalls

**Domain:** Next.js App Router + Supabase marketing site (local services, MDX blog, interactive map)
**Project:** City Tech — automotive locksmith & electronics, DMV region
**Researched:** 2026-04-19
**Confidence:** HIGH for Next.js/Supabase/Leaflet patterns (well-established); MEDIUM for Resend specifics

---

## Critical Pitfalls

Mistakes that cause rewrites, broken production deployments, or silent data loss.

---

### Pitfall 1: Leaflet crashes the entire page due to SSR window access

**What goes wrong:** Leaflet reads `window` and `document` at module load time. In Next.js App Router, any Server Component (or even a Client Component rendered during the server pass) that imports Leaflet directly will throw `ReferenceError: window is not defined` and crash the entire route — not just the map.

**Why it happens:** Next.js renders Client Components on the server during SSR to produce the initial HTML. Leaflet's internals assume a browser environment from the very first `import`.

**Consequences:** The entire `/service-area` page (or any page importing Leaflet) 500s in production. Often only caught in production or `next build`, because `next dev` with Turbopack sometimes masks the error.

**Prevention:**
```typescript
// WRONG — crashes SSR
import { MapContainer } from 'react-leaflet'

// CORRECT — wrap in dynamic import at the component level
import dynamic from 'next/dynamic'

const ServiceAreaMap = dynamic(
  () => import('@/components/ServiceAreaMap'),
  { ssr: false, loading: () => <div className="h-96 bg-gray-100 animate-pulse" /> }
)
```
The `loading` prop is required — without it, Suspense fallback is undefined and the map slot is blank during hydration, causing layout shift.

Also add to `next.config.ts`:
```typescript
// Prevents Leaflet CSS from being processed by Next.js CSS pipeline incorrectly
transpilePackages: ['leaflet', 'react-leaflet']
```

**Warning signs:** Build succeeds locally but `/service-area` returns 500 in Vercel preview. Console shows `window is not defined`.

**Phase:** Service area map implementation (whichever phase builds the `/service-area` page).

---

### Pitfall 2: Supabase RLS blocks anonymous form inserts silently

**What goes wrong:** The `service_requests` table is created with Row Level Security enabled but no INSERT policy for the `anon` role. Supabase silently returns no error to the client — the insert just returns an empty result, not a thrown error. The form "succeeds" from the user's perspective (no error state shown) but no row is ever written, and no email is triggered.

**Why it happens:** `supabaseClient.from('table').insert(data)` with RLS and no matching policy returns `{ data: null, error: null }` — it does not throw. Most form handlers only check `if (error)`, so the silent success goes undetected.

**Consequences:** Lost leads. The owner never receives emails. The failure is invisible unless you watch the Supabase dashboard table.

**Prevention:**
Always check both conditions:
```typescript
const { data, error } = await supabase
  .from('service_requests')
  .insert(payload)
  .select('id') // force a return so you can verify the row was created

if (error) throw new Error(error.message)
if (!data || data.length === 0) throw new Error('Insert succeeded but no row returned — check RLS policy')
```

In Supabase dashboard, add this policy to `service_requests`:
```sql
CREATE POLICY "Allow anonymous insert"
ON service_requests
FOR INSERT
TO anon
WITH CHECK (true);
```

**Warning signs:** Form submission returns 200, no console error, but Supabase table stays empty. Resend never fires.

**Phase:** Phase that implements the contact/service request form and Supabase integration.

---

### Pitfall 3: Supabase anon key exposed vs. service role key leaked

**What goes wrong:** Two keys exist — `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe for client) and `SUPABASE_SERVICE_ROLE_KEY` (must never reach the browser). Developers accidentally use the service role key in a Server Action or API route that also passes it to client state, or name the variable with `NEXT_PUBLIC_` prefix, which bundles it into the client JavaScript.

**Why it happens:** The service role key bypasses all RLS. A single `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=...` in `.env.local` exposes it in the browser bundle.

**Consequences:** Anyone can read, write, or delete all data. Complete database compromise.

**Prevention:**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — only key ever with `NEXT_PUBLIC_` prefix
- `SUPABASE_SERVICE_ROLE_KEY` — no `NEXT_PUBLIC_` prefix; only used in Server Actions or API routes with no client exposure
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.gitignore` verification in CI
- For this project's scope (anonymous public inserts), the anon key is sufficient — no service role key should be needed at all

**Warning signs:** You can see the service role key value in browser DevTools > Application > Sources bundle.

**Phase:** Project initialization / environment setup (before any Supabase code is written).

---

### Pitfall 4: Missing NEXT_PUBLIC_ variables cause silent undefined errors in production

**What goes wrong:** Environment variables work in `next dev` because Next.js reads `.env.local`. In Vercel, variables must be added manually in the dashboard. A variable present locally but missing in Vercel results in `undefined`, which Supabase client initialization silently accepts — then every query fails at runtime with a cryptic network error, not a clear "missing env var" message.

**Why it happens:** `.env.local` is gitignored and never deployed. Developers assume Vercel reads it automatically.

**Consequences:** Production site has broken forms, broken map tiles (if API keys involved), and broken email — with no obvious error in the UI unless error states are implemented.

**Prevention:**
Add a startup validation check:
```typescript
// lib/env.ts
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'RESEND_API_KEY',
]
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}
```
Call this in `instrumentation.ts` (Next.js 14+) so it runs at startup, not per-request.

**Warning signs:** Everything works locally, Vercel deployment succeeds, but form submissions fail with network errors or `supabaseClient` is undefined.

**Phase:** Project initialization before first Vercel deployment.

---

### Pitfall 5: "use client" placed incorrectly — too high in the tree

**What goes wrong:** Developers add `"use client"` to a layout or page component because it needs one small interactive piece (a mobile menu toggle, a form). This converts the entire subtree — including large static content sections — to Client Components, sending unnecessary JavaScript to the browser and disabling server-side data fetching for all children.

**Why it happens:** The error message "You're importing a component that needs X" pushes developers to add `"use client"` to the nearest ancestor rather than isolating the interactive leaf.

**Consequences:** Bloated JS bundle, slower LCP, static content that could be rendered on the server is now client-rendered, potential hydration mismatches.

**Prevention:** Push `"use client"` as deep as possible. The correct pattern:

```
// page.tsx — Server Component (no "use client")
export default function ContactPage() {
  return (
    <main>
      <StaticHero />        {/* Server Component */}
      <ContactFormWrapper /> {/* Client Component — isolated */}
    </main>
  )
}
```

The `ContactFormWrapper` has `"use client"` and handles all interactivity. `StaticHero` stays a Server Component.

**Warning signs:** A layout file or page file has `"use client"` at the top. Bundle analyzer shows large chunks for pages that are mostly static.

**Phase:** Every phase that introduces interactive components — establish the pattern in Phase 1.

---

### Pitfall 6: Hydration mismatch from browser-specific values rendered on server

**What goes wrong:** A component reads `window.innerWidth`, `navigator.userAgent`, `Date` (for "today's hours"), or any value that differs between server and browser. Server renders one value, client hydrates with a different value, React throws a hydration warning (or silently mismatches in production), and the UI flickers or shows wrong content.

**Why it happens:** Server Components run in Node.js (no `window`). Client Components run on the server first for SSR, then hydrate in the browser.

**Consequences:** React hydration warnings in development, potential visual flash or layout shift in production, occasional full re-render that tanks LCP.

**Prevention:** For any browser-only value, use a mounted state pattern:
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <Skeleton />
```
Or use Next.js `Suspense` with a server-safe fallback.

For the logo carousel specifically: CSS-only animation (no JS-read dimensions) avoids this entirely — preferred approach.

**Warning signs:** Browser console shows "Hydration failed because the server rendered HTML didn't match the client."

**Phase:** Homepage (carousel, hero) and any page with dynamic browser-dependent content.

---

## Moderate Pitfalls

---

### Pitfall 7: Logo carousel animation jank and FOUC

**What goes wrong:** The infinite scroll carousel renders a list of logos, then JavaScript kicks in to duplicate them for the loop. During the gap between server render and JS execution, the carousel either shows a static list (FOUC) or the duplication causes a visible jump. CSS animation using `animation-play-state: paused` on hover sometimes fails on touch devices where there is no hover state.

**Why it happens:** JavaScript-dependent carousel initialization is not SSR-safe. CSS-only carousels that use `@keyframes translate` on a duplicated static list avoid this but require the duplication to be in the markup (done at build time, not runtime).

**Prevention:** Use a pure CSS approach:
```css
@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.carousel-track {
  display: flex;
  width: max-content;
  animation: scroll 30s linear infinite;
}
.carousel-track:hover {
  animation-play-state: paused;
}
```
Duplicate logo list in JSX at build time (render the logos array twice, side by side). No JavaScript needed. No hydration issue.

**Warning signs:** Carousel jumps or resets position on load. Pause on hover does not work reliably.

**Phase:** Homepage build phase.

---

### Pitfall 8: animation-play-state pause not working on mobile (carousel)

**What goes wrong:** `animation-play-state: paused` on `:hover` has no effect on touch screens because touch events do not trigger `:hover` in most mobile browsers. The carousel runs continuously on mobile regardless of touch.

**Why it happens:** CSS `:hover` pseudo-class is only reliably triggered by a pointer device that can hover (mouse). Touch taps may briefly trigger hover state but immediately release it.

**Prevention:** This is acceptable behavior for a marketing site carousel — continuous motion on mobile is fine and expected. Do not add JS touch event listeners to replicate hover-pause; the complexity is not worth it for logo display. Document this as intentional.

**Warning signs:** "The carousel doesn't pause when I tap on mobile" in QA notes.

**Phase:** Homepage build phase — note in code comments that mobile pause is intentionally not implemented.

---

### Pitfall 9: Resend email not delivered — missing SPF/DKIM records

**What goes wrong:** Resend API calls succeed (200 response, `id` returned), but emails land in spam or are rejected entirely by the owner's email provider. The form appears to work, the Supabase row is created, but the owner never sees the notification.

**Why it happens:** Resend requires domain verification with DNS records (SPF, DKIM, DMARC) before emails sent from your domain are trusted. Without these records, emails either go to spam or are rejected. Emails sent from the default Resend test domain (`@resend.dev`) work in development but are blocked in production for custom domains.

**Consequences:** Owner misses leads. Silent business failure.

**Prevention:**
1. Register and verify the sending domain in the Resend dashboard before go-live
2. Add SPF record: `v=spf1 include:_spf.resend.com ~all`
3. Add DKIM record: provided by Resend per domain
4. Add DMARC record: `v=DMARC1; p=none; rua=mailto:owner@domain.com`
5. Test deliverability with [mail-tester.com](https://www.mail-tester.com) before launch
6. In development, use `@resend.dev` sender and owner's personal email as recipient — no domain verification needed for testing

**Warning signs:** Resend dashboard shows "Delivered" but email is not in inbox; check spam folder. Or Resend shows "Bounced" with a rejection reason.

**Phase:** Form + notification integration phase. DNS records needed before first production deployment.

---

### Pitfall 10: Resend free tier rate limits blocking burst submissions

**What goes wrong:** Resend free tier allows 100 emails/day and 3,000/month (as of 2025). For a lead gen form, this is sufficient. However, if a bot submits the form repeatedly (no CAPTCHA), 100 emails can be exhausted quickly, and the 101st legitimate lead gets no notification.

**Why it happens:** No rate limiting or bot protection on the form.

**Prevention:**
- Add basic honeypot field to the form (hidden field that bots fill, humans don't)
- Add Zod schema validation server-side to reject obviously malicious payloads
- Consider Cloudflare Turnstile (free, no user friction) for the contact form
- Decouple notification from insert: store in Supabase first, then send email — if email fails, the lead is not lost

**Warning signs:** Supabase table has many rows in a short time with identical or nonsense data. Resend dashboard shows quota exhausted.

**Phase:** Contact form phase. Rate limiting can be added in a hardening phase.

---

### Pitfall 11: MDX frontmatter missing required fields causes silent build failures

**What goes wrong:** MDX blog posts without required frontmatter fields (`title`, `date`, `description`, `slug`) cause the blog index to render with undefined values, broken OG images, and incorrect sitemap entries. In some configurations, it causes a build error with a cryptic message about undefined properties.

**Why it happens:** MDX content collections in Next.js (without Contentlayer or similar) have no built-in schema validation. Missing fields are silently `undefined`.

**Prevention:** Use Zod to validate frontmatter at build time:
```typescript
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(10).max(160),
  slug: z.string(),
  category: z.string().optional(),
  draft: z.boolean().default(false),
})
```
Run this in the function that loads MDX files. Throw clearly if validation fails so the broken post is easy to find.

**Warning signs:** Blog index shows posts with no title or `undefined` as the date. Build passes but OG images are blank.

**Phase:** Blog scaffold phase.

---

### Pitfall 12: OG images broken because metadata is generated in a Server Component that can't read MDX frontmatter

**What goes wrong:** The `generateMetadata` function for blog post pages tries to read frontmatter, but if the MDX loading utility is async and the path resolution is relative, it fails in production where the file system layout differs from development. OG images reference a title that is undefined, resulting in a blank or broken social share card.

**Why it happens:** Next.js App Router's file system at runtime in Vercel is not the same as the local dev filesystem. Relative path resolution with `process.cwd()` can differ.

**Prevention:**
- Use `path.join(process.cwd(), 'content/blog', slug + '.mdx')` consistently
- Test `generateMetadata` with `next build && next start` before deploying — not just `next dev`
- Use `opengraph-image.tsx` route convention for OG images rather than constructing image URLs manually

**Warning signs:** Social share previews show default OG image instead of post-specific one. Meta tag in page source shows `undefined` for title.

**Phase:** Blog scaffold phase.

---

### Pitfall 13: LocalBusiness schema missing or malformed — local SEO impact

**What goes wrong:** The `LocalBusiness` JSON-LD schema is omitted, or is present but uses generic `Organization` type instead of the correct `AutomotiveBusiness` or `LocalBusiness` subtype. The `areaServed` field is omitted. Phone number format is wrong (`(555) 555-5555` instead of `+15555555555`). These mistakes reduce how Google understands and surfaces the business in local search.

**Why it happens:** JSON-LD is invisible in the UI — no visual feedback when it's wrong. Developers copy boilerplate without adapting it to the specific business type.

**Prevention:**
```typescript
// app/layout.tsx or app/page.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutomotiveBusiness',  // NOT just LocalBusiness
  name: 'City Tech',
  description: 'Mobile automotive locksmith and electronics services in the DMV region',
  telephone: '+1-XXX-XXX-XXXX',  // E.164 format
  url: 'https://citytechdc.com',
  areaServed: [
    { '@type': 'City', name: 'Washington, DC' },
    { '@type': 'State', name: 'Maryland' },
    { '@type': 'State', name: 'Virginia' },
  ],
  serviceType: ['Locksmith', 'Remote Start Installation', 'Car Alarm Installation'],
  openingHoursSpecification: { /* ... */ },
}
```
Validate with Google's Rich Results Test before launch.

**Warning signs:** Google Search Console shows no rich results for the business. Rich Results Test returns errors.

**Phase:** SEO foundations phase.

---

### Pitfall 14: Sitemap missing dynamic routes (blog posts, service pages)

**What goes wrong:** `next-sitemap` or a custom `sitemap.ts` is configured but only includes static routes. Dynamically generated service detail pages (`/services/[slug]`) and MDX blog posts (`/blog/[slug]`) are not included because the sitemap generator doesn't know to enumerate them.

**Why it happens:** `next-sitemap` requires explicit configuration of dynamic routes using `additionalPaths` or `generateSitemaps`. Developers set it up for static pages and forget dynamic routes.

**Prevention:** Use Next.js built-in `sitemap.ts` (App Router convention):
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts()
  const services = getAllServices()  // from /data/services.ts

  return [
    { url: 'https://citytechdc.com', lastModified: new Date() },
    { url: 'https://citytechdc.com/services', lastModified: new Date() },
    ...services.map(s => ({ url: `https://citytechdc.com/services/${s.slug}` })),
    ...posts.map(p => ({ url: `https://citytechdc.com/blog/${p.slug}` })),
  ]
}
```

**Warning signs:** Google Search Console coverage report shows blog and service pages not indexed. Sitemap XML at `/sitemap.xml` only lists a handful of URLs.

**Phase:** SEO foundations phase, with updates whenever new route types are added.

---

## Minor Pitfalls

---

### Pitfall 15: Unoptimized images cause slow LCP — missing next/image usage

**What goes wrong:** Service images, hero backgrounds, or logo files are placed in `/public` and referenced with plain `<img>` tags. No WebP conversion, no lazy loading, no size hints. Hero image is 2MB JPEG loading on every page visit.

**Prevention:** Use `next/image` for every image. Set explicit `width` and `height` (or `fill` + parent sizing). Set `priority` on the hero image (above-the-fold LCP element). Compress source images to under 200KB before adding to `/public`.

**Warning signs:** Lighthouse LCP score above 4s. PageSpeed Insights flags "Serve images in next-gen formats."

**Phase:** Homepage build phase.

---

### Pitfall 16: Missing Suspense boundaries cause entire page to wait for slow data

**What goes wrong:** A Server Component fetches data from Supabase (e.g., testimonials, service request count, recent blog posts). If that fetch is slow or fails, the entire page render is blocked — the user sees nothing until the fetch resolves or times out.

**Prevention:** Wrap async Server Components in `<Suspense>`:
```tsx
<Suspense fallback={<TestimonialsSkeleton />}>
  <Testimonials />  {/* async Server Component */}
</Suspense>
```
This allows the rest of the page to stream to the client while the slow component resolves.

For this project specifically: most content is static (services data, blog posts). Supabase is only hit on form submission, not page load. Avoid reading from Supabase on page load entirely — use static data sources for display content.

**Warning signs:** Pages feel slow despite being mostly static. Removing a database call suddenly makes the page load instantly.

**Phase:** Any phase that introduces server-side data fetching.

---

### Pitfall 17: Service detail pages not statically generated — missing generateStaticParams

**What goes wrong:** Dynamic routes (`/services/[slug]`) are rendered on-demand (SSR) instead of being statically generated at build time. For a marketing site with stable content, this means every visit to a service page hits the server unnecessarily and is slower than a pre-rendered page.

**Prevention:** Export `generateStaticParams` from the dynamic route:
```typescript
// app/services/[slug]/page.tsx
export async function generateStaticParams() {
  return getAllServices().map(s => ({ slug: s.slug }))
}
```
This pre-renders all service pages at build time. Since `/data/services.ts` is the single source of truth, this stays in sync automatically.

**Warning signs:** Service pages are slow on first load. Vercel function invocations are high despite static content.

**Phase:** Service pages implementation phase.

---

### Pitfall 18: Canonical URLs missing or wrong — hurts SEO for duplicate content

**What goes wrong:** Service pages, blog pages, and the homepage are accessible at multiple URLs (with/without trailing slash, with/without `www`). Without canonical tags, Google may index both versions as separate pages and split PageRank between them.

**Prevention:** Set canonical in `generateMetadata`:
```typescript
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://citytechdc.com/services/locksmith',
  },
}
```
Also configure `www` redirect at the DNS/Vercel level — pick one canonical domain and redirect the other.

**Warning signs:** Google Search Console shows the same page indexed multiple times with different URLs.

**Phase:** SEO foundations phase.

---

### Pitfall 19: React Hook Form + Zod schema not shared between client and server validation

**What goes wrong:** The Zod schema for form validation is defined client-side in the form component. The Server Action that processes the submission does no server-side validation (trusting the client). A user bypassing the browser can submit invalid or malicious data directly to the Server Action.

**Prevention:** Define the Zod schema once in a shared file (`lib/schemas/serviceRequest.ts`), import it in both the form component (client-side validation) and the Server Action (server-side re-validation). Never trust client input.

**Warning signs:** Invalid data appearing in the Supabase table (very short phone numbers, empty required fields, XSS payloads in the message field).

**Phase:** Contact form implementation phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project init / env setup | Service role key exposed via NEXT_PUBLIC_ | Never prefix service role key; document in .env.example |
| Homepage build | "use client" too high in tree; carousel FOUC | Isolate Client Components to interactive leaves; use CSS-only carousel |
| Service pages | Missing generateStaticParams; SSR for static content | Export generateStaticParams from every dynamic route |
| Contact form | RLS blocks anonymous inserts silently; schema not shared | Add INSERT policy for anon role; single shared Zod schema |
| Email notifications | Resend emails in spam; bot flooding | Verify domain DNS before launch; honeypot field |
| Service area map | Leaflet crashes SSR | dynamic() with ssr: false; loading skeleton required |
| Blog scaffold | Missing frontmatter validation; OG images broken | Zod schema for frontmatter; test with next build not next dev |
| SEO foundations | Schema type wrong; sitemap misses dynamic routes | Use AutomotiveBusiness type; use app/sitemap.ts convention |
| Launch prep | Env vars missing in Vercel; deliverability untested | Audit Vercel env dashboard; test email with mail-tester.com |

---

## Confidence Notes

| Area | Confidence | Basis |
|------|------------|-------|
| Leaflet SSR | HIGH | Well-documented, universally reported issue; standard fix is established |
| Supabase RLS silent failures | HIGH | Documented Supabase behavior; `{ data: null, error: null }` on policy block |
| Next.js "use client" propagation | HIGH | Core App Router behavior; documented in Next.js docs |
| Resend DNS/deliverability | HIGH | Standard email deliverability requirements; not Resend-specific |
| Resend rate limits | MEDIUM | Tier limits change; verify current limits at resend.com/pricing |
| Hydration mismatch patterns | HIGH | Documented React 18 behavior with Server/Client Component split |
| Local SEO schema specifics | MEDIUM | Schema.org types are established; Google's interpretation evolves |

---

## Sources

- Next.js App Router documentation: https://nextjs.org/docs/app
- Supabase RLS documentation: https://supabase.com/docs/guides/auth/row-level-security
- Resend documentation: https://resend.com/docs
- Leaflet in Next.js — community-established pattern (dynamic import with ssr: false)
- Schema.org AutomotiveBusiness type: https://schema.org/AutomotiveBusiness
- Next.js Metadata API (sitemap, OG): https://nextjs.org/docs/app/api-reference/file-conventions/metadata
