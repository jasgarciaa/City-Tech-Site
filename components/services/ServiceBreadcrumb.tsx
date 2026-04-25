import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function ServiceBreadcrumb({ currentName }: { currentName: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-primary hover:underline">Home</Link>
        </li>
        <li aria-hidden="true"><ChevronRight size={12} className="text-muted-foreground" /></li>
        <li>
          <Link href="/#services" className="hover:text-primary hover:underline">Services</Link>
        </li>
        <li aria-hidden="true"><ChevronRight size={12} className="text-muted-foreground" /></li>
        <li aria-current="page" className="text-foreground">{currentName}</li>
      </ol>
    </nav>
  )
}
