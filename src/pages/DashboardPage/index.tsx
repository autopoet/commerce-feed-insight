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
  page_view: '页面访问',
  product_exposure: '商品曝光',
  product_click: '商品点击',
  add_to_cart: '加购',
  purchase: '购买',
}

const pageNameMap: Record<PageName, string> = {
  ad_entry: '广告入口',
  feed: '推荐流',
  dashboard: '数据看板',
}

const getName = (items: { id: string; name: string }[], id?: string) =>
  items.find((item) => item.id === id)?.name ?? id ?? '未知'

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
      <section className="dashboard-header experiment-header">
        <div>
          <p className="eyebrow">实验结果看板</p>
          <h1>广告推荐流转化漏斗</h1>
          <p>
            当前归因：{getName(adChannels, channel)} / {getName(campaigns, campaign)} /{' '}
            {getName(creatives, creative)}
          </p>
        </div>
        <div className="feed-actions">
          <Link className="secondary-button" to="/feed">
            返回推荐流
          </Link>
          <Link className="secondary-button" to="/">
            重新选择入口
          </Link>
          <button className="primary-button" type="button" onClick={clearEvents}>
            清空数据
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="核心指标">
        <MetricBlock label="曝光数" value={metrics.exposures} hint="有效曝光事件" tone="blue" />
        <MetricBlock label="点击数" value={metrics.clicks} hint="商品卡片点击" tone="blue" />
        <MetricBlock label="加购数" value={metrics.addToCarts} hint="交易意图事件" tone="orange" />
        <MetricBlock label="购买数" value={metrics.purchases} hint="模拟购买事件" tone="green" />
        <MetricBlock label="CTR" value={formatPercent(metrics.ctr)} hint="点击数 / 曝光数" />
        <MetricBlock
          label="加购率"
          value={formatPercent(metrics.addToCartRate)}
          hint="加购数 / 点击数"
        />
        <MetricBlock
          label="购买率"
          value={formatPercent(metrics.purchaseRate)}
          hint="购买数 / 点击数"
        />
      </section>

      <section className="dashboard-grid">
        <div className="analysis-panel">
          <div className="section-heading">
            <h2>转化漏斗</h2>
            <p>基于事件流聚合，从有效曝光到交易意图的转化路径。</p>
          </div>
          <FunnelBars
            steps={[
              { label: '曝光', value: metrics.exposures, rateLabel: '基准' },
              { label: '点击', value: metrics.clicks, rateLabel: formatPercent(metrics.ctr) },
              { label: '加购', value: metrics.addToCarts, rateLabel: formatPercent(metrics.addToCartRate) },
              { label: '购买', value: metrics.purchases, rateLabel: formatPercent(metrics.purchaseRate) },
            ]}
          />
        </div>

        <div className="analysis-panel">
          <div className="section-heading">
            <h2>实时事件流</h2>
            <p>最近 20 条本地埋点事件，用于观察行为如何进入漏斗。</p>
          </div>
          <div className="event-log">
            {recentEvents.length === 0 ? (
              <p className="empty-copy">暂无事件。请先进入推荐流并操作商品。</p>
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
        <BreakdownTable title="渠道表现" rows={channelBreakdown} nameResolver={(id) => getName(adChannels, id)} />
        <BreakdownTable title="创意表现" rows={creativeBreakdown} nameResolver={(id) => getName(creatives, id)} />
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
        <p>按归因字段聚合本地事件，观察不同来源的漏斗表现。</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>维度</th>
              <th>曝光</th>
              <th>点击</th>
              <th>加购</th>
              <th>购买</th>
              <th>CTR</th>
              <th>购买率</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7}>暂无事件。</td>
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
