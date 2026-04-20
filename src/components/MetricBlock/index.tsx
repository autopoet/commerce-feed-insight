type MetricTone = 'blue' | 'orange' | 'green'

type MetricBlockProps = {
  label: string
  value: string | number
  hint?: string
  tone?: MetricTone
}

export function MetricBlock({ label, value, hint, tone = 'blue' }: MetricBlockProps) {
  return (
    <article className={`metric-block metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <p>{hint}</p> : null}
    </article>
  )
}
