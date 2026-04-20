import { Link } from 'react-router-dom'
import { FunnelBars } from '../../components/FunnelBars'
import { MetricBlock } from '../../components/MetricBlock'
import { calculateBreakdown, calculateDashboardMetrics } from '../../features/dashboard/metrics'
import { usePageView } from '../../features/tracking/usePageView'
import { useTrackingStore } from '../../features/tracking/trackingStore'
import type { EventName, PageName, TrackingEvent } from '../../features/tracking/tracking.types'
import { adChannels, campaigns, creatives } from '../../mocks/ads'
import { useAdContextStore } from '../../stores/adContextStore'
import { formatPercent } from '../../utils/format'

export const DASHBOARD_PAGE_ROUTE = '/dashboard'

const eventNameMap: Record<EventName, string> = {
  page_view: 'Page View',
  product_exposure: 'Exposure',
  product_click: 'Click',
  add_to_cart: 'Cart',
  purchase: 'Purchase',
}

const pageNameMap: Record<PageName, string> = {
  ad_entry: 'Ad Entry',
  feed: 'Feed',
  dashboard: 'Dashboard',
}

const getName = (items: { id: string; name: string }[], id?: string) =>
  items.find((item) => item.id === id)?.name ?? id ?? 'unknown'

const formatEventTime = (timestamp: number) =>
  new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp)

const getEventProduct = (event: TrackingEvent) => event.productId ?? '-'

export function DashboardPage() {
  usePageView('dashboard')

  const events = useTrackingStore((state) => state.events)
  const clearEvents = useTrackingStore((state) => state.clearEvents)
  const channel = useAdContextStore((state) => state.channel)
  const campaign = useAdContextStore((state) => state.campaign)
  const creative = useAdContextStore((state) => state.creative)
  const metrics = calculateDashboardMetrics(events)
  const channelBreakdown = calculateBreakdown(events, 'channel')
  const creativeBreakdown = calculateBreakdown(events, 'creative')
  const recentEvents = events.slice(0, 20)

  return (
    <main className="page dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Realtime Dashboard</p>
          <h1>Conversion Funnel</h1>
          <p>
            Current attribution: {getName(adChannels, channel)} / {getName(campaigns, campaign)} /{' '}
            {getName(creatives, creative)}
          </p>
        </div>
        <div className="feed-actions">
          <Link className="secondary-button" to="/feed">
            Back to Feed
          </Link>
          <Link className="secondary-button" to="/">
            New Entry
          </Link>
          <button className="primary-button" type="button" onClick={clearEvents}>
            Clear Data
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="Core metrics">
        <MetricBlock label="Exposures" value={metrics.exposures} hint="valid exposure events" />
        <MetricBlock label="Clicks" value={metrics.clicks} hint="product card clicks" />
        <MetricBlock label="Carts" value={metrics.addToCarts} hint="add_to_cart events" />
        <MetricBlock label="Purchases" value={metrics.purchases} hint="purchase events" />
        <MetricBlock label="CTR" value={formatPercent(metrics.ctr)} hint="clicks / exposures" />
        <MetricBlock
          label="Cart Rate"
          value={formatPercent(metrics.addToCartRate)}
          hint="carts / clicks"
        />
        <MetricBlock
          label="Purchase Rate"
          value={formatPercent(metrics.purchaseRate)}
          hint="purchases / clicks"
        />
      </section>

      <section className="dashboard-grid">
        <div className="analysis-panel">
          <div className="section-heading">
            <h2>Funnel</h2>
            <p>Event stream aggregation from exposure to transaction intent.</p>
          </div>
          <FunnelBars
            steps={[
              { label: 'Exposure', value: metrics.exposures, rateLabel: 'base' },
              { label: 'Click', value: metrics.clicks, rateLabel: formatPercent(metrics.ctr) },
              { label: 'Cart', value: metrics.addToCarts, rateLabel: formatPercent(metrics.addToCartRate) },
              { label: 'Purchase', value: metrics.purchases, rateLabel: formatPercent(metrics.purchaseRate) },
            ]}
          />
        </div>

        <div className="analysis-panel">
          <div className="section-heading">
            <h2>Recent Events</h2>
            <p>Latest 20 local tracking events.</p>
          </div>
          <div className="event-log">
            {recentEvents.length === 0 ? (
              <p className="empty-copy">No events yet. Go to the feed and interact with products.</p>
            ) : (
              recentEvents.map((event) => (
                <div className="event-row" key={event.eventId}>
                  <span>{formatEventTime(event.timestamp)}</span>
                  <strong>{eventNameMap[event.eventName]}</strong>
                  <em>{pageNameMap[event.page]}</em>
                  <code>{getEventProduct(event)}</code>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="breakdown-grid">
        <BreakdownTable title="Channel Performance" rows={channelBreakdown} nameResolver={(id) => getName(adChannels, id)} />
        <BreakdownTable title="Creative Performance" rows={creativeBreakdown} nameResolver={(id) => getName(creatives, id)} />
      </section>
    </main>
  )
}

type BreakdownRow = ReturnType<typeof calculateBreakdown>[number]

type BreakdownTableProps = {
  title: string
  rows: BreakdownRow[]
  nameResolver: (id: string) => string
}

function BreakdownTable({ title, rows, nameResolver }: BreakdownTableProps) {
  return (
    <div className="analysis-panel">
      <div className="section-heading">
        <h2>{title}</h2>
        <p>Grouped by attribution field from local tracking events.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Exposure</th>
              <th>Click</th>
              <th>Cart</th>
              <th>Purchase</th>
              <th>CTR</th>
              <th>Purchase Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7}>No events yet.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.dimensionValue}>
                  <td>{nameResolver(row.dimensionValue)}</td>
                  <td>{row.exposures}</td>
                  <td>{row.clicks}</td>
                  <td>{row.addToCarts}</td>
                  <td>{row.purchases}</td>
                  <td>{formatPercent(row.ctr)}</td>
                  <td>{formatPercent(row.purchaseRate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

