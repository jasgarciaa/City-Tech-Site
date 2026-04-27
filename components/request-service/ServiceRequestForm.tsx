'use client'

// BLOG DEFERRAL NOTE (D-26):
// BLOG-01 through BLOG-05 requirements (blog index, MDX posts, blog SEO, blog categories,
// and blog RSS feed) are intentionally deferred per planning decision D-26. No /blog route,
// MDX scaffolding, or blog infrastructure will be added in Phase 3 or this file.
// These requirements are documented as out-of-scope for the current phase.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { submitServiceRequest } from '@/lib/actions/submitServiceRequest'
import type { ServiceDefinition } from '@/data/services'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Enter a valid email address'),
  services_requested: z.array(z.string()).min(1, 'Select at least one service'),
  fleet: z.boolean(),
  vehicle_make: z.string().min(1, 'Vehicle make is required'),
  vehicle_model: z.string().min(1, 'Vehicle model is required'),
  vehicle_year: z.string().min(1, 'Vehicle year is required'),
  description: z.string().optional(),
  preferred_datetime: z.string().optional(),
  vin: z.string().optional(),
  referral_source: z.string().optional(),
})

type FormValues = z.infer<typeof schema>
type SubmitState = 'idle' | 'loading' | 'success' | 'error'

interface ServiceRequestFormProps {
  services: ServiceDefinition[]
}

export default function ServiceRequestForm({ services }: ServiceRequestFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const electronicsServices = services
    .filter((s) => s.category === 'electronics')
    .sort((a, b) => a.order - b.order)

  const locksmithServices = services
    .filter((s) => s.category === 'locksmith')
    .sort((a, b) => a.order - b.order)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      services_requested: [],
      fleet: false,
      vehicle_make: '',
      vehicle_model: '',
      vehicle_year: '',
      description: '',
      preferred_datetime: '',
      vin: '',
      referral_source: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitState('loading')
    try {
      // Fleet toggle: prepend "Fleet customer: Yes" to description string — not a separate DB field
      const description = values.fleet
        ? `Fleet customer: Yes\n${values.description ?? ''}`.trim()
        : values.description || undefined

      await submitServiceRequest({
        name: values.name,
        phone: values.phone,
        email: values.email,
        services_requested: values.services_requested,
        vehicle_make: values.vehicle_make,
        vehicle_model: values.vehicle_model,
        vehicle_year: values.vehicle_year,
        description,
        preferred_datetime: values.preferred_datetime || undefined,
        vin: values.vin || undefined,
        referral_source: values.referral_source || undefined,
      })
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <CheckCircle2 size={40} className="mx-auto text-accent" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Request Received</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Thanks — we&apos;ll reach out shortly to confirm and quote your service.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* --- Tier 1: Required fields --- */}

        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="7031234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Address */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Services Needed — multi-select checkbox group */}
        <FormField
          control={form.control}
          name="services_requested"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Services Needed</FormLabel>
              <fieldset className="mt-2 border-0 p-0 m-0">
                <legend className="sr-only">Services Needed</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Electronics group */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Electronics</p>
                    <div className="space-y-2">
                      {electronicsServices.map((service) => {
                        const checked = form
                          .watch('services_requested')
                          .includes(service.name)
                        return (
                          <label
                            key={service.slug}
                            className="flex items-center gap-2 cursor-pointer min-h-[44px] py-1"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const current = form.getValues('services_requested')
                                if (e.target.checked) {
                                  form.setValue(
                                    'services_requested',
                                    [...current, service.name],
                                    { shouldValidate: true }
                                  )
                                } else {
                                  form.setValue(
                                    'services_requested',
                                    current.filter((s) => s !== service.name),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              className="h-4 w-4 accent-primary flex-shrink-0"
                            />
                            <span className="text-sm">{service.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Locksmith group */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Locksmith</p>
                    <div className="space-y-2">
                      {locksmithServices.map((service) => {
                        const checked = form
                          .watch('services_requested')
                          .includes(service.name)
                        return (
                          <label
                            key={service.slug}
                            className="flex items-center gap-2 cursor-pointer min-h-[44px] py-1"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const current = form.getValues('services_requested')
                                if (e.target.checked) {
                                  form.setValue(
                                    'services_requested',
                                    [...current, service.name],
                                    { shouldValidate: true }
                                  )
                                } else {
                                  form.setValue(
                                    'services_requested',
                                    current.filter((s) => s !== service.name),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              className="h-4 w-4 accent-primary flex-shrink-0"
                            />
                            <span className="text-sm">{service.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </fieldset>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fleet Customer Toggle */}
        <FormField
          control={form.control}
          name="fleet"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 min-h-[44px]">
                <FormControl>
                  <input
                    type="checkbox"
                    id="fleet-toggle"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 accent-primary flex-shrink-0"
                  />
                </FormControl>
                <FormLabel htmlFor="fleet-toggle" className="text-sm font-normal cursor-pointer">
                  Is this a fleet request?
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Info — Make, Model, Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="vehicle_make"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Vehicle Make</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Vehicle Model</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Camry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Vehicle Year</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="2019" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- Tier 2: Optional fields in Accordion --- */}
        <Accordion type="single" collapsible className="mt-6 border border-border rounded-md px-4">
          <AccordionItem value="optional" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold text-primary">
              Add more details (optional)
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pb-4">
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Description / Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your situation or any additional details..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Date / Time */}
                <FormField
                  control={form.control}
                  name="preferred_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Preferred Date / Time Window</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. Weekdays after 5pm, Saturday morning"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* VIN */}
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">VIN (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Optional — helps us prepare for your appointment"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Referral Source */}
                <FormField
                  control={form.control}
                  name="referral_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">How did you hear about us?</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Google, referral, social media..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full min-h-[44px] bg-primary text-primary-foreground"
          disabled={submitState === 'loading'}
        >
          {submitState === 'loading' ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>

        {submitState === 'error' && (
          <p role="alert" className="text-sm text-destructive text-center">
            Something went wrong. Please call us directly at (703) 343-6234.
          </p>
        )}
      </form>
    </Form>
  )
}
