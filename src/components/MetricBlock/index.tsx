type MetricBlockProps = {
  label: string
  value: string | number
  hint?: string
}

export function MetricBlock({ label, value, hint }: MetricBlockProps) {
  return (
    <article className="metric-block">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <p>{hint}</p> : null}
    </article>
  )
}

