'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const OWNER_NOTIFICATION_EMAIL = 'Citytech12v@gmail.com'

const serverSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  vehicle_year: z.string().optional(),
  vehicle_make: z.string().optional(),
  vehicle_model: z.string().optional(),
  services_requested: z.array(z.string()).min(1),
  service_location: z.string().optional(),
  preferred_datetime: z.string().optional(),
  description: z.string().optional(),
  referral_source: z.string().optional(),
  vin: z.string().optional(),
})

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
  vin?: string              // optional VIN field from the full form
}

export async function submitServiceRequest(payload: ServiceRequestPayload) {
  const parsed = serverSchema.safeParse(payload)
  if (!parsed.success) {
    throw new Error('Invalid service request payload')
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Strip vin from DB payload — service_requests table has no vin column
  // Use .select('id') to detect silent RLS failure (missing anon INSERT policy returns
  // { data: null, error: null } — checking only `error` would miss the failure)
  const { vin: _vin, ...dbPayload } = payload
  const { data, error } = await supabase
    .from('service_requests')
    .insert(dbPayload)
    .select('id')

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Insert returned no row — verify the Supabase anon INSERT policy is active on service_requests'
    )
  }

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: 'City Tech <noreply@citytechva.com>',
    to: OWNER_NOTIFICATION_EMAIL,
    subject: `New Service Request from ${payload.name}`,
    html: `
      <h2>New Service Request</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Email:</strong> ${payload.email ?? 'Not provided'}</p>
      <p><strong>Vehicle:</strong> ${payload.vehicle_year ?? ''} ${payload.vehicle_make ?? ''} ${payload.vehicle_model ?? ''}</p>
      <p><strong>VIN:</strong> ${payload.vin ?? 'Not provided'}</p>
      <p><strong>Services requested:</strong> ${payload.services_requested.join(', ')}</p>
      <p><strong>Service location:</strong> ${payload.service_location ?? 'Not provided'}</p>
      <p><strong>Preferred time:</strong> ${payload.preferred_datetime ?? 'Flexible'}</p>
      <p><strong>Notes:</strong> ${payload.description ?? 'None'}</p>
      <p><strong>Referred by:</strong> ${payload.referral_source ?? 'Not specified'}</p>
    `,
  })

  if (emailError) {
    console.error('Resend error:', emailError)
  } else {
    console.log('Resend sent, id:', emailData?.id)
  }

  return { success: true }
}
