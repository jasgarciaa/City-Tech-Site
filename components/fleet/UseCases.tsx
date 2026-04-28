import { Wrench, KeyRound, Zap, Radio } from 'lucide-react'

const USE_CASES = [
  {
    icon: Wrench,
    title: 'Fleet Electronics Installation',
    body: 'Audio, cameras, and navigation installed on your lot. We work through your inventory so every vehicle comes out the same — no sending them out one at a time.',
  },
  {
    icon: KeyRound,
    title: 'Fleet Key Programming',
    body: 'Keys cut and programmed on-site when vehicles arrive. No dealer, no tow. We turn these around fast — every day a vehicle sits waiting on keys is a day it\'s not earning.',
  },
  {
    icon: Zap,
    title: 'Remote Start & Security',
    body: 'Remote start, alarms, and tracking across your fleet. Every vehicle gets the same setup.',
  },
  {
    icon: Radio,
    title: 'Telematic Fleet Devices',
    body: 'We install and wire the telematics hardware, then configure each device to your platform. Live GPS, driver behavior data, and diagnostics start coming in from day one.',
  },
]

export default function UseCases() {
  return (
    <section className="bg-muted py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-semibold text-foreground">What We Do for Fleets</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-md border border-border bg-background p-5">
              <Icon size={24} className="text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-snug text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
