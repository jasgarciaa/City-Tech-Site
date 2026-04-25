'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// TODO: Replace with owner's actual email before Phase 3 go-live
const OWNER_NOTIFICATION_EMAIL = 'owner@citytech.com'

export interface ServiceRequestPayload {
  name: string
  phone: string
  email?: string
  vehicle_year?: string
  vehicle_make?: string
  vehicle_model?: string
  services_requested: string[]
  service_location?: string
  preferred_datetime?: string
  description?: string
  referral_source?: string
}

export async function submitServiceRequest(payload: ServiceRequestPayload) {
  const supabase = await createClient()

  // Use .select('id') to detect silent RLS failure (missing anon INSERT policy returns
  // { data: null, error: null } — checking only `error` would miss the failure)
  const { data, error } = await supabase
    .from('service_requests')
    .insert(payload)
    .select('id')

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Insert returned no row — verify the Supabase anon INSERT policy is active on service_requests'
    )
  }

  // Owner notification email — using onboarding@resend.dev for dev (no DNS config needed)
  // Before go-live: replace from address with owner's verified domain
  await resend.emails.send({
    from: 'Citytech <onboarding@resend.dev>',
    to: OWNER_NOTIFICATION_EMAIL,
    subject: `New Service Request from ${payload.name}`,
    html: `
      <h2>New Service Request</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Email:</strong> ${payload.email ?? 'Not provided'}</p>
      <p><strong>Vehicle:</strong> ${payload.vehicle_year ?? ''} ${payload.vehicle_make ?? ''} ${payload.vehicle_model ?? ''}</p>
      <p><strong>Services requested:</strong> ${payload.services_requested.join(', ')}</p>
      <p><strong>Service location:</strong> ${payload.service_location ?? 'Not provided'}</p>
      <p><strong>Preferred time:</strong> ${payload.preferred_datetime ?? 'Flexible'}</p>
      <p><strong>Notes:</strong> ${payload.description ?? 'None'}</p>
      <p><strong>Referred by:</strong> ${payload.referral_source ?? 'Not specified'}</p>
    `,
  })

  return { success: true }
}
