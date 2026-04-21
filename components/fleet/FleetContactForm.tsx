'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitServiceRequest } from '@/lib/actions/submitServiceRequest'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function FleetContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [companyName, setCompanyName] = useState('')
  const [fleetSize, setFleetSize] = useState('')
  const [servicesNeeded, setServicesNeeded] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{
    companyName?: string
    fleetSize?: string
    servicesNeeded?: string
    contactName?: string
    phone?: string
    email?: string
  }>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!companyName.trim()) newErrors.companyName = 'Please enter your company name'
    if (!fleetSize) newErrors.fleetSize = 'Please select your fleet size'
    if (!servicesNeeded.trim()) newErrors.servicesNeeded = 'Please describe the services you need'
    if (!contactName.trim()) newErrors.contactName = 'Please enter a contact name'
    if (!phone.trim()) newErrors.phone = 'Please enter a phone number'
    if (!email.trim()) newErrors.email = 'Please enter an email address'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setState('loading')
    try {
      await submitServiceRequest({
        name: contactName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        services_requested: [],
        description: `FLEET REQUEST\nCompany: ${companyName.trim()}\nFleet Size: ${fleetSize}\nServices Needed: ${servicesNeeded.trim()}`,
      })
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="bg-background py-12 px-6">
      <div className="mx-auto max-w-lg">
        <h2 className="text-xl font-semibold text-foreground text-center mb-6">
          Request Fleet Service
        </h2>

        {state === 'success' ? (
          <div className="text-center">
            <CheckCircle2 size={32} className="mx-auto text-accent" aria-hidden="true" />
            <h3 className="mt-3 text-xl font-semibold text-foreground">Fleet Request Received</h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              We&apos;ll be in touch shortly to discuss your fleet&apos;s needs.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Field 1: Company Name */}
            <div>
              <Label htmlFor="fl-companyName" className="text-sm">Company Name</Label>
              <Input
                id="fl-companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                aria-invalid={!!errors.companyName}
                aria-describedby={errors.companyName ? 'fl-companyName-err' : undefined}
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && (
                <p id="fl-companyName-err" className="mt-1 text-sm text-destructive">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Field 2: Fleet Size */}
            <div>
              <Label htmlFor="fl-fleetSize" className="text-sm">Fleet Size</Label>
              <Select value={fleetSize} onValueChange={setFleetSize}>
                <SelectTrigger
                  id="fl-fleetSize"
                  aria-invalid={!!errors.fleetSize}
                  className={errors.fleetSize ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select fleet size..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1–5 vehicles">1–5 vehicles</SelectItem>
                  <SelectItem value="6–15 vehicles">6–15 vehicles</SelectItem>
                  <SelectItem value="16–50 vehicles">16–50 vehicles</SelectItem>
                  <SelectItem value="50+ vehicles">50+ vehicles</SelectItem>
                </SelectContent>
              </Select>
              {errors.fleetSize && (
                <p className="mt-1 text-sm text-destructive">{errors.fleetSize}</p>
              )}
            </div>

            {/* Field 3: Primary Services Needed */}
            <div>
              <Label htmlFor="fl-servicesNeeded" className="text-sm">Primary Services Needed</Label>
              <Textarea
                id="fl-servicesNeeded"
                rows={4}
                placeholder="Describe the services your fleet needs..."
                value={servicesNeeded}
                onChange={(e) => setServicesNeeded(e.target.value)}
                aria-invalid={!!errors.servicesNeeded}
                className={errors.servicesNeeded ? 'border-destructive' : ''}
              />
              {errors.servicesNeeded && (
                <p className="mt-1 text-sm text-destructive">{errors.servicesNeeded}</p>
              )}
            </div>

            {/* Field 4: Contact Name */}
            <div>
              <Label htmlFor="fl-contactName" className="text-sm">Contact Name</Label>
              <Input
                id="fl-contactName"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                aria-invalid={!!errors.contactName}
                aria-describedby={errors.contactName ? 'fl-contactName-err' : undefined}
                className={errors.contactName ? 'border-destructive' : ''}
              />
              {errors.contactName && (
                <p id="fl-contactName-err" className="mt-1 text-sm text-destructive">
                  {errors.contactName}
                </p>
              )}
            </div>

            {/* Field 5: Phone Number */}
            <div>
              <Label htmlFor="fl-phone" className="text-sm">Phone Number</Label>
              <Input
                id="fl-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'fl-phone-err' : undefined}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p id="fl-phone-err" className="mt-1 text-sm text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Field 6: Email Address */}
            <div>
              <Label htmlFor="fl-email" className="text-sm">Email Address</Label>
              <Input
                id="fl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'fl-email-err' : undefined}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p id="fl-email-err" className="mt-1 text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[44px] bg-primary text-primary-foreground"
              disabled={state === 'loading'}
            >
              {state === 'loading' ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                'Submit Fleet Request'
              )}
            </Button>

            {state === 'error' && (
              <p role="alert" className="text-sm text-destructive text-center">
                Something went wrong. Please call us directly at (703) 343-6234.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
