import { Wrench, KeyRound, Zap } from 'lucide-react'

const USE_CASES = [
  {
    icon: Wrench,
    title: 'Multi-Vehicle Electronics Installation',
    body: 'Consistent, brand-standard installation of audio, navigation, and camera systems across your entire fleet - scheduled on your yard.',
  },
  {
    icon: KeyRound,
    title: 'Fleet Key Programming',
    body: 'Transponder programming, duplicate fobs, and ignition rekey for bulk vehicle intakes - no dealership tow, no downtime.',
  },
  {
    icon: Zap,
    title: 'Bulk Remote Start & Security',
    body: 'Remote start, tracking, and alarm installations at scale - reduce per-vehicle cost and standardize driver experience.',
  },
]

export default function UseCases() {
  return (
    <section className="bg-muted py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-semibold text-foreground">What We Do for Fleets</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
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
