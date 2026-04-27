'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitServiceRequest } from '@/lib/actions/submitServiceRequest'
import type { ServiceDefinition } from '@/data/services'

interface QuickContactFormProps {
  services: ServiceDefinition[]
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function QuickContactForm({ services }: QuickContactFormProps) {
  const [state, setState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; service?: string }>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = 'Please enter your name'
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number'
    if (!service) newErrors.service = 'Please select a service'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setState('loading')
    try {
      await submitServiceRequest({
        name: name.trim(),
        phone: phone.trim(),
        services_requested: [service],
      })
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="bg-background bg-pattern-c py-12 px-6">
      <div className="mx-auto max-w-md">
        <h2 className="text-xl font-semibold text-foreground text-center mb-6">
          Get a Free Quote
        </h2>

        {state === 'success' ? (
          <div className="text-center">
            <CheckCircle2 size={32} className="mx-auto text-accent" aria-hidden="true" />
            <h3 className="mt-3 text-xl font-semibold text-foreground">Request Received</h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              We&apos;ll reach out shortly to confirm and quote your service.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Label htmlFor="qc-name" className="text-sm">
                Your Name
              </Label>
              <Input
                id="qc-name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'qc-name-err' : undefined}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p id="qc-name-err" className="mt-1 text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="qc-phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="qc-phone"
                type="tel"
                placeholder="7031234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'qc-phone-err' : undefined}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p id="qc-phone-err" className="mt-1 text-sm text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="qc-service" className="text-sm">
                Service Needed
              </Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger
                  id="qc-service"
                  aria-invalid={!!errors.service}
                  className={errors.service ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Electronics</SelectLabel>
                    {services
                      .filter((s) => s.category === 'electronics')
                      .sort((a, b) => a.order - b.order)
                      .map((s) => (
                        <SelectItem key={s.slug} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Locksmith</SelectLabel>
                    {services
                      .filter((s) => s.category === 'locksmith')
                      .sort((a, b) => a.order - b.order)
                      .map((s) => (
                        <SelectItem key={s.slug} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.service && (
                <p className="mt-1 text-sm text-destructive">{errors.service}</p>
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
                  <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" /> Sending...
                </>
              ) : (
                'Get a Free Quote'
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
