type FunnelStep = {
  label: string
  value: number
  rateLabel: string
}

type FunnelBarsProps = {
  steps: FunnelStep[]
}

export function FunnelBars({ steps }: FunnelBarsProps) {
  const maxValue = Math.max(...steps.map((step) => step.value), 1)

  return (
    <div className="funnel-bars">
      {steps.map((step) => (
        <div className="funnel-row" key={step.label}>
          <div className="funnel-label">
            <strong>{step.label}</strong>
            <span>
              {step.value} · {step.rateLabel}
            </span>
          </div>
          <div className="funnel-track">
            <div style={{ width: `${Math.max(6, (step.value / maxValue) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

