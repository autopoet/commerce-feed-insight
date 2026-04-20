import type { AdChannel, AdContext, Campaign, Creative } from '../types/ad'

export const adChannels: AdChannel[] = [
  {
    id: 'douyin_feed',
    name: '抖音信息流',
    type: 'feed',
    description: '模拟短视频信息流广告进入电商推荐场景。',
  },
  {
    id: 'search_ads',
    name: '搜索广告',
    type: 'search',
    description: '模拟用户带明确搜索意图进入商品流。',
  },
  {
    id: 'mall_channel',
    name: '商城频道',
    type: 'mall',
    description: '模拟商城频道内活动资源位导流。',
  },
  {
    id: 'creator_video',
    name: '达人短视频',
    type: 'creator',
    description: '模拟内容种草后的商品承接链路。',
  },
  {
    id: 'external_launch',
    name: '外部投放',
    type: 'external',
    description: '模拟站外广告投放进入电商推荐流。',
  },
]

export const campaigns: Campaign[] = [
  {
    id: '618_preheat',
    name: '618 预热',
    goal: 'conversion',
    description: '大促预热活动，关注点击后的加购和购买。',
  },
  {
    id: 'summer_new',
    name: '夏季上新',
    goal: 'ctr',
    description: '新品种草活动，关注曝光后的兴趣点击。',
  },
  {
    id: 'flash_sale',
    name: '低价秒杀',
    goal: 'conversion',
    description: '低价心智活动，关注加购和购买效率。',
  },
  {
    id: 'new_user',
    name: '新客专享',
    goal: 'new_user',
    description: '新客转化活动，关注首单购买表现。',
  },
]

export const creatives: Creative[] = [
  {
    id: 'video_a',
    name: '短视频 A',
    type: 'video',
    description: '强利益点短视频创意。',
  },
  {
    id: 'video_b',
    name: '短视频 B',
    type: 'video',
    description: '场景化种草短视频创意。',
  },
  {
    id: 'image_card_a',
    name: '图文卡片 A',
    type: 'image',
    description: '突出价格和优惠的图文创意。',
  },
  {
    id: 'live_clip_a',
    name: '直播切片 A',
    type: 'live_clip',
    description: '模拟直播间高转化片段创意。',
  },
]

export const defaultAdContext: AdContext = {
  channel: adChannels[0].id,
  campaign: campaigns[0].id,
  creative: creatives[0].id,
}

