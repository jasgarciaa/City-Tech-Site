---
phase: "03-lead-capture-seo"
plan: "01"
subsystem: "lead-capture-form"
tags: ["form", "react-hook-form", "zod", "server-action", "seo"]
dependency_graph:
  requires: ["02-03"]
  provides: ["request-service-page", "service-request-form", "vin-support"]
  affects: ["lib/actions/submitServiceRequest.ts", "components/request-service/ServiceRequestForm.tsx", "app/(marketing)/request-service/page.tsx"]
tech_stack:
  added: []
  patterns:
    - "RHF + Zod client + server double-validation"
    - "Server action receives typed payload, strips non-DB fields before insert"
    - "Fleet boolean mapped to description prefix (not a DB column)"
    - "Multi-select checkbox group managed via form.setValue + form.watch"
    - "Accordion (Radix) for optional Tier 2 form fields"
key_files:
  created:
    - "components/request-service/ServiceRequestForm.tsx"
    - "app/(marketing)/request-service/page.tsx"
  modified:
    - "lib/actions/submitServiceRequest.ts"
decisions:
  - "VIN field extended into ServiceRequestPayload, stripped before Supabase insert, included in Resend email"
  - "Fleet toggle maps to description prefix 'Fleet customer: Yes' — no separate DB column"
  - "BLOG-01 through BLOG-05 explicitly deferred per D-26 — no blog code created"
  - "Native <input type=checkbox> used for services multi-select (not shadcn Checkbox component)"
metrics:
  duration: "~25 minutes"
  completed_date: "2026-04-22"
  tasks_completed: 3
  files_changed: 3
---

# Phase 3 Plan 01: Request Service Form Summary

Full service request form at /request-service with RHF+Zod client validation, server-side Zod re-validation, multi-select checkbox groups for services split by category, fleet toggle prepending to description, VIN optional field, and Accordion-wrapped optional tier.

## What Was Built

### Task 1: Extend submitServiceRequest server action

Extended `lib/actions/submitServiceRequest.ts` with:
- `import { z } from 'zod'` and `serverSchema` for server-side Zod re-validation
- `vin?: string` added to `ServiceRequestPayload` interface
- `serverSchema.safeParse(payload)` at the top of the function body — throws `'Invalid service request payload'` on invalid input
- `const { vin: _vin, ...dbPayload } = payload` strips VIN before Supabase insert (no `vin` column in `service_requests` table)
- VIN line added to Resend HTML email body: `<p><strong>VIN:</strong> ${payload.vin ?? 'Not provided'}</p>`
- Existing `OWNER_NOTIFICATION_EMAIL`, `from` address, Supabase insert logic, and RLS guard unchanged

Commit: `464bc86`

### Task 2: ServiceRequestForm client island

Created `components/request-service/ServiceRequestForm.tsx` (`'use client'`):
- Zod schema with exact error messages from UI-SPEC copywriting contract
- Tier 1 required fields: Full Name, Phone, Email, Services Needed (checkbox group), Fleet toggle, Vehicle Make/Model/Year
- Services Needed: multi-select checkbox groups split into Electronics and Locksmith categories, rendered in a two-column grid on sm+, managed via `form.setValue(..., { shouldValidate: true })`
- `<fieldset>` + `<legend>` wrapping the checkbox group for accessibility (SEO-05)
- Fleet checkbox: maps `fleet === true` to `"Fleet customer: Yes\n{description}"` prefix before calling server action — not sent to server directly
- Tier 2 optional fields wrapped in `<Accordion type="single" collapsible>`: Description, Preferred Date/Time, VIN, Referral Source
- Submit state machine: `'idle' | 'loading' | 'success' | 'error'`
- Success: `role="status"` div with `<CheckCircle2>` + "Request Received" + exact D-32 copy
- Error: `role="alert"` paragraph with exact D-32 error string including phone number
- Loading: `<Loader2 className="animate-spin">` + "Sending..." on disabled button
- BLOG-01 through BLOG-05 deferral documented in comment block per D-26
- Min touch targets: `min-h-[44px]` on submit button and checkbox label click zones

Commit: `7a36485`

### Task 3: /request-service Server Component page

Created `app/(marketing)/request-service/page.tsx`:
- Server Component (no `'use client'`)
- `export const metadata` with title, description, and openGraph block (D-33)
- `<section id="main-content">` with `<h1>` "Request Service" for semantic HTML (SEO-05)
- Intro copy per UI-SPEC copywriting contract
- Contact block (D-30): "Call Now — (703) 343-6234" tel: button + `Citytech12v@gmail.com` mailto link
- `<hr>` divider between intro and form
- `<ServiceRequestForm services={services} />` form island
- BLOG deferral documented in page file comment

Commit: `7a36485` (bundled with Task 2 — same commit)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all form fields wire to server action. Success/error states use exact D-32 copy. The form cannot be tested end-to-end until the owner provides Supabase credentials and runs the RLS policy SQL (noted in RESEARCH.md Pitfall 1). This is expected and documented — it is not a stub.

## Self-Check

**Files exist:**
- `components/request-service/ServiceRequestForm.tsx` — FOUND
- `app/(marketing)/request-service/page.tsx` — FOUND
- `lib/actions/submitServiceRequest.ts` — FOUND (modified)

**Commits exist:**
- `464bc86` — FOUND (Task 1)
- `7a36485` — FOUND (Task 2 + 3)

## Self-Check: PASSED
