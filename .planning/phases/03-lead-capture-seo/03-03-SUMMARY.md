---
plan: 03-03
phase: 03-lead-capture-seo
status: complete
completed: 2026-04-27
---

## What Was Verified

End-to-end verification gate for Phase 3. All automated and human-in-the-loop checks passed.

---

## Task 1 — Automated Checks (committed 950dc32)

- TypeScript: 0 errors
- `npm run build`: passes — /request-service, /sitemap.xml, /robots.txt all in output
- Sitemap: 16 URLs (13 services — 2 added during Phase 1/2, plan said 15, not a bug)
- robots.txt: User-Agent *, Allow /, Sitemap: present
- JSON-LD LocalBusiness with phone/email on homepage
- OG tags on /, /fleet, /request-service
- Call Now + tel: + mailto: present on /request-service
- No blog dirs, no MDX files, BLOG-01 deferral comment present

---

## Task 2 — Human Verification (2026-04-27)

| Section | Check | Result |
|---------|-------|--------|
| B | Visual UX — contact box, form fields, accordion, submit button | ✓ |
| C | Form validation — 7 inline Zod errors on empty submit | ✓ |
| D | Checkbox behavior — multi-select, error clears on selection | ✓ |
| E | Accordion open/close animation | ✓ |
| F | Live submission → Supabase row created | ✓ |
| G | Fleet prefix → description field reads "Fleet customer: Yes\nfleet test" | ✓ |
| H | Error state → exact copy "Something went wrong. Please call us directly at (703) 343-6234." | ✓ |
| I | Sitemap XML, robots.txt, JSON-LD in homepage source | ✓ |
| J | Google Rich Results Test | skipped — requires public URL, flag for post-deploy |
| K | Blog deferral — no blog dirs, no MDX, deferral comment present | ✓ |

---

## Issues Encountered and Resolved

### RLS + Publishable Key Mismatch
- **Problem:** `createServerClient` from `@supabase/ssr` with the `sb_publishable_` key rejected inserts despite a valid RLS policy. Changing policy to `TO public` did not resolve it.
- **Fix:** Switched server action to use `createClient` from `@supabase/supabase-js` with the **service role key** (`SUPABASE_SERVICE_ROLE_KEY`). Service role bypasses RLS — correct pattern for server-side writes we fully control.
- **Lesson:** `sb_publishable_` key + `createServerClient` from `@supabase/ssr` does not resolve to the `anon` role as expected. For server actions doing public inserts, use service role key directly.

### Phone Placeholder UX
- **Problem:** Placeholder `(703) 555-0100` implied formatted input was required.
- **Fix:** Changed placeholder to `7031234567` on ServiceRequestForm and QuickContactForm.

### Email Delivery
- Resend accepted the send (no error thrown from server action).
- Email from `onboarding@resend.dev` likely lands in spam — expected until Resend domain DNS (SPF/DKIM) is configured for citytechva.com.
- **Action required before go-live:** Configure SPF/DKIM in Resend dashboard for citytechva.com.

---

## Supabase Row IDs (Test Submissions)

- Non-fleet test (Section F): confirmed row in `service_requests` table
- Fleet test (Section G): confirmed row with `Fleet customer: Yes\n` prefix in description

---

## Sign-off

Phase 3 verified and approved 2026-04-27. Lead capture funnel is functional end-to-end. Site is ready for Vercel production deploy pending:
1. Resend DNS configuration (SPF/DKIM for citytechva.com)
2. Vercel environment variables (same 4 vars from .env.local)
3. Section J Google Rich Results Test (post-deploy with live URL)
