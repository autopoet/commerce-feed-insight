import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adChannels, campaigns, creatives, defaultAdContext } from '../../mocks/ads'
import { useAdContextStore } from '../../stores/adContextStore'
import type { AdContext } from '../../types/ad'

export const AD_ENTRY_PAGE_ROUTE = '/'

const getName = (items: { id: string; name: string }[], id: string) =>
  items.find((item) => item.id === id)?.name ?? id

export function AdEntryPage() {
  const navigate = useNavigate()
  const setAdContext = useAdContextStore((state) => state.setAdContext)
  const currentContext = useAdContextStore((state) => ({
    channel: state.channel,
    campaign: state.campaign,
    creative: state.creative,
  }))
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
          <h1>选择一次广告入口，观察它在推荐流中的后续转化。</h1>
          <p className="hero-copy">
            这里模拟 channel、campaign、creative 三个广告归因字段，后续曝光、点击、加购、购买都会带着这组上下文进入数据链路。
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
            <p>选择一组投放来源，作为推荐流后续行为的归因上下文。</p>
          </div>

          <label className="field">
            <span>广告渠道 channel</span>
            <select value={formValue.channel} onChange={(event) => updateField('channel', event.target.value)}>
              {adChannels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
            <small>{adChannels.find((item) => item.id === formValue.channel)?.description}</small>
          </label>

          <label className="field">
            <span>广告活动 campaign</span>
            <select value={formValue.campaign} onChange={(event) => updateField('campaign', event.target.value)}>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
            <small>{campaigns.find((item) => item.id === formValue.campaign)?.description}</small>
          </label>

          <label className="field">
            <span>创意版本 creative</span>
            <select value={formValue.creative} onChange={(event) => updateField('creative', event.target.value)}>
              {creatives.map((creative) => (
                <option key={creative.id} value={creative.id}>
                  {creative.name}
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
              查看实时看板
            </Link>
          </div>
        </div>

        <aside className="context-panel">
          <h2>演示链路</h2>
          <ol className="flow-list">
            <li>广告入口选择</li>
            <li>推荐流承接</li>
            <li>商品曝光 / 点击 / 加购 / 购买</li>
            <li>实时看板汇总</li>
          </ol>
        </aside>
      </section>
    </main>
  )
}

