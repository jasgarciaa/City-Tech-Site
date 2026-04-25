import { CheckCircle2 } from 'lucide-react'

const AUDIENCES = [
  'Dealerships',
  'Rental Companies',
  'Delivery Fleets',
  'Commercial Vehicle Operators',
]

export default function B2BPitch() {
  return (
    <section className="bg-background py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-xl font-semibold text-foreground">Built for Business</h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <li key={audience} className="flex items-center gap-3">
              <CheckCircle2 size={20} className="shrink-0 text-accent" aria-hidden="true" />
              <span className="text-base leading-relaxed text-foreground">{audience}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
