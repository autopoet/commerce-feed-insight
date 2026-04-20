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
          <p className="eyebrow">广告入口</p>
          <h1>选择广告入口，观察后续转化链路。</h1>
          <p className="hero-copy">
            这里会生成渠道、活动和创意版本的归因上下文，后续曝光、点击、加购、购买事件都会携带这些字段。
          </p>
        </div>
        <div className="hero-panel" aria-label="当前归因预览">
          <span>当前归因</span>
          <strong>{preview.channel}</strong>
          <p>
            {preview.campaign} / {preview.creative}
          </p>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="config-panel">
          <div className="section-heading">
            <h2>广告入口配置</h2>
            <p>选择一组流量来源，进入推荐流后所有核心事件都会带上这组归因信息。</p>
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

          <div className="actions-row">
            <button className="primary-button" type="button" onClick={enterFeed}>
              进入推荐流
            </button>
            <Link className="secondary-button" to="/dashboard">
              查看数据看板
            </Link>
          </div>
        </div>

        <aside className="context-panel">
          <h2>演示链路</h2>
          <ol className="flow-list">
            <li>选择广告入口</li>
            <li>进入商品推荐流</li>
            <li>触发曝光、点击、加购和购买</li>
            <li>在实时看板查看转化漏斗</li>
          </ol>
        </aside>
      </section>
    </main>
  )
}
