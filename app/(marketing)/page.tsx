import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Citytech — Coming Soon
      </h1>
      <p className="mt-4 text-muted-foreground">
        Mobile Automotive Locksmith and Electronics Service
      </p>
    </div>
  )
}
