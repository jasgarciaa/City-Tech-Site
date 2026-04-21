# Phase 3: Lead Capture + SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 03-lead-capture-seo
**Areas discussed:** Form layout, Blog at launch, LocalBusiness schema address, /request-service vs /contact

---

## Form Layout (/request-service)

| Option | Description | Selected |
|--------|-------------|----------|
| One long page with visual sections | All 9 fields visible, grouped by type | |
| Two-step wizard | Step 1: contact info; Step 2: vehicle + service details | |
| One page with collapsed optional fields | Required fields always visible; optional fields collapsed | ✓ (hybrid) |

**User's choice:** Option 1 hybrid — single page with two tiers. Required always visible: name, phone, email, service selection, fleet toggle, vehicle make/model/year. Collapsed optional: description, datetime, VIN, referral source. User specified that the fleet toggle should be in the required section.

---

## Blog at Launch

| Option | Description | Selected |
|--------|-------------|----------|
| 2 sample MDX posts | Placeholder posts to validate pipeline | |
| Empty index with placeholder state | No posts, "coming soon" message | |
| Defer blog entirely | Don't build — BLOG-01–05 removed | ✓ |

**User's choice:** Defer entirely. Owner is not a fan of text blogging. One owner is working on content and may want to add service demonstration videos in the future — a video showcase page rather than a blog.

---

## LocalBusiness Schema — Address

| Option | Description | Selected |
|--------|-------------|----------|
| areaServed only, no address | Valid for service-area businesses; no privacy concerns | ✓ |
| PO box or registered agent address | Adds legitimacy signals; requires owner to provide | |
| Real physical address | Only if owner has a separate office/shop | |

**User's choice:** Option 1 — `areaServed` only. Service area confirmed: Washington DC, Maryland, Virginia. Owner noted they have an Alexandria, VA registered address available if needed later. Also noted willingness to drive further for demand — noted for future `areaServed` expansion.

---

## /request-service vs. /contact — Same or Separate?

| Option | Description | Selected |
|--------|-------------|----------|
| Same page — /request-service is the contact page | One clear action, no decision paralysis | ✓ (with additions) |
| Separate /contact page | Lightweight contact info + minimal form | |
| /contact redirects to /request-service | SEO placeholder, no second form | |

**User's choice:** Option 1, with additions:
- Prominent "Call Now" tap-to-call button above the form
- Owner email displayed in footer Contact column and on /request-service intro

**Real contact info provided during discussion:**
- Phone: (703) 343-6234
- Email: Citytech12v@gmail.com

---

## Deferred Ideas

- Blog / MDX scaffold — owner prefers potential video content over text posts; future phase
- Video showcase/gallery page — potential future phase when footage is available
- Alexandria, VA address in LocalBusiness schema — available to add later if owner decides
- Extended service area — owner willing to drive further for demand; can expand areaServed later
