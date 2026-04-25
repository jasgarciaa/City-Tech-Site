export default function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
          >
            {i + 1}
          </span>
          <p className="text-base leading-relaxed text-foreground">{step}</p>
        </li>
      ))}
    </ol>
  )
}
