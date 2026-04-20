import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePageView } from '../../features/tracking/usePageView'
import { adChannels, campaigns, creatives, defaultAdContext } from '../../mocks/ads'
import { useAdContextStore } from '../../stores/adContextStore'
import type { AdContext } from '../../types/ad'

export const AD_ENTRY_PAGE_ROUTE = '/'

const getName = (items: { id: string; name: string }[], id: string) =>
  items.find((item) => item.id === id)?.name ?? id

export function AdEntryPage() {
  usePageView('ad_entry')

  const navigate = useNavigate()
  const setAdContext = useAdContextStore((state) => state.setAdContext)
  const channel = useAdContextStore((state) => state.channel)
  const campaign = useAdContextStore((state) => state.campaign)
  const creative = useAdContextStore((state) => state.creative)
  const currentContext = useMemo(
    () => ({
      channel,
      campaign,
      creative,
    }),
    [campaign, channel, creative],
  )
  const [formValue, setFormValue] = useState<AdContext>(currentContext ?? defaultAdContext)

  const preview = useMemo(
    () => ({
      channel: getName(adChannels, formValue.channel),
      campaign: getName(campaigns, formValue.campaign),
      creative: getName(creatives, formValue.creative),
    }),
    [formValue],
  )

  const updateField = (field: keyof AdContext, value: string) => {
    setFormValue((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const enterFeed = () => {
    setAdContext(formValue)
    navigate('/feed')
  }

  return (
    <main className="page page-entry">
      <section className="entry-hero">
        <div>
          <p className="eyebrow">Ad Entry</p>
          <h1>Select an ad entry and observe downstream conversion.</h1>
          <p className="hero-copy">
            This page creates channel, campaign, and creative attribution context for exposure,
            click, cart, and purchase events in the product feed.
          </p>
        </div>
        <div className="hero-panel" aria-label="Current attribution preview">
          <span>Current Attribution</span>
          <strong>{preview.channel}</strong>
          <p>
            {preview.campaign} / {preview.creative}
          </p>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="config-panel">
          <div className="section-heading">
            <h2>Ad Entry Config</h2>
            <p>Choose one traffic source. All later events will carry this attribution context.</p>
          </div>

          <label className="field">
            <span>Channel</span>
            <select value={formValue.channel} onChange={(event) => updateField('channel', event.target.value)}>
              {adChannels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <small>{adChannels.find((item) => item.id === formValue.channel)?.description}</small>
          </label>

          <label className="field">
            <span>Campaign</span>
            <select value={formValue.campaign} onChange={(event) => updateField('campaign', event.target.value)}>
              {campaigns.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <small>{campaigns.find((item) => item.id === formValue.campaign)?.description}</small>
          </label>

          <label className="field">
            <span>Creative</span>
            <select value={formValue.creative} onChange={(event) => updateField('creative', event.target.value)}>
              {creatives.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <small>{creatives.find((item) => item.id === formValue.creative)?.description}</small>
          </label>

          <div className="actions-row">
            <button className="primary-button" type="button" onClick={enterFeed}>
              Enter Feed
            </button>
            <Link className="secondary-button" to="/dashboard">
              View Dashboard
            </Link>
          </div>
        </div>

        <aside className="context-panel">
          <h2>Demo Flow</h2>
          <ol className="flow-list">
            <li>Select ad entry</li>
            <li>Enter recommendation feed</li>
            <li>Expose, click, cart, and purchase products</li>
            <li>Review realtime funnel dashboard</li>
          </ol>
        </aside>
      </section>
    </main>
  )
}

