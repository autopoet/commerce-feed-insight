import type { AdChannel, AdContext, Campaign, Creative } from '../types/ad'

export const adChannels: AdChannel[] = [
  {
    id: 'douyin_feed',
    name: '抖音推荐流',
    type: 'feed',
    description: '短视频信息流广告进入电商推荐流，适合观察内容兴趣到交易意图的转化。',
  },
  {
    id: 'search_ads',
    name: '搜索广告',
    type: 'search',
    description: '高意图搜索流量进入商品推荐，适合观察点击后加购和购买表现。',
  },
  {
    id: 'mall_channel',
    name: '商城频道',
    type: 'mall',
    description: '商城活动位带来的站内流量，适合承接大促和频道运营活动。',
  },
  {
    id: 'creator_video',
    name: '达人视频',
    type: 'creator',
    description: '达人内容种草后的转化流量，适合观察创意内容对商品行为的影响。',
  },
  {
    id: 'external_launch',
    name: '站外投放',
    type: 'external',
    description: '站外获客流量进入电商推荐流，适合观察冷启动流量质量。',
  },
]

export const campaigns: Campaign[] = [
  {
    id: '618_preheat',
    name: '618 预热',
    goal: 'conversion',
    description: '大促预热活动，重点观察加购和购买转化。',
  },
  {
    id: 'summer_new',
    name: '夏季上新',
    goal: 'ctr',
    description: '新品内容活动，重点观察曝光到点击的兴趣转化。',
  },
  {
    id: 'flash_sale',
    name: '限时秒杀',
    goal: 'conversion',
    description: '低价强刺激活动，重点观察快速购买意图。',
  },
  {
    id: 'new_user',
    name: '新客专享',
    goal: 'new_user',
    description: '新用户转化活动，重点观察首单链路。',
  },
]

export const creatives: Creative[] = [
  {
    id: 'video_a',
    name: '短视频 A',
    type: 'video',
    description: '利益点前置的短视频创意，强调价格、优惠和使用效果。',
  },
  {
    id: 'video_b',
    name: '短视频 B',
    type: 'video',
    description: '场景化种草创意，强调使用场景和人群匹配。',
  },
  {
    id: 'image_card_a',
    name: '图文卡片 A',
    type: 'image',
    description: '静态图文创意，突出优惠券和到手价。',
  },
  {
    id: 'live_clip_a',
    name: '直播切片 A',
    type: 'live_clip',
    description: '直播高光切片创意，突出限时氛围和交易意图。',
  },
]

export const defaultAdContext: AdContext = {
  channel: adChannels[0].id,
  campaign: campaigns[0].id,
  creative: creatives[0].id,
}
