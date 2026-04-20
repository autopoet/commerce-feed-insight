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
      <section className="entry-hero experiment-hero">
        <div>
          <p className="eyebrow">增长实验配置台</p>
          <h1>创建一次广告推荐流转化实验</h1>
          <p className="hero-copy">
            选择流量来源、活动目标和创意版本，进入推荐流后观察曝光、点击、加购、购买如何沉淀为实时漏斗。
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={enterFeed}>
              启动实验流量
            </button>
            <Link className="secondary-button" to="/dashboard">
              查看实验结果
            </Link>
          </div>
        </div>

        <div className="experiment-map" aria-label="实验链路预览">
          <span>广告入口</span>
          <strong>{preview.channel}</strong>
          <i />
          <span>推荐流承接</span>
          <strong>{preview.campaign}</strong>
          <i />
          <span>转化看板</span>
          <strong>{preview.creative}</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="config-panel">
          <div className="section-heading">
            <h2>实验参数</h2>
            <p>这三个字段会写入后续核心事件，用来观察不同流量来源和创意版本的转化表现。</p>
          </div>

          <label className="field">
            <span>渠道 Channel</span>
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
            <span>活动 Campaign</span>
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
            <span>创意 Creative</span>
            <select value={formValue.creative} onChange={(event) => updateField('creative', event.target.value)}>
              {creatives.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <small>{creatives.find((item) => item.id === formValue.creative)?.description}</small>
          </label>
        </div>

        <aside className="context-panel">
          <div className="section-heading">
            <h2>当前实验组</h2>
            <p>用于贯穿曝光、点击、加购和购买事件。</p>
          </div>
          <dl className="attribution-list">
            <div>
              <dt>渠道</dt>
              <dd>{preview.channel}</dd>
            </div>
            <div>
              <dt>活动</dt>
              <dd>{preview.campaign}</dd>
            </div>
            <div>
              <dt>创意</dt>
              <dd>{preview.creative}</dd>
            </div>
          </dl>
          <ol className="flow-list">
            <li>进入推荐流</li>
            <li>触发有效曝光</li>
            <li>完成点击、加购、购买</li>
            <li>回到看板观察漏斗</li>
          </ol>
        </aside>
      </section>
    </main>
  )
}
