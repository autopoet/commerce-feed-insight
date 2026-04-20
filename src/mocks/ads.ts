import type { AdChannel, AdContext, Campaign, Creative } from '../types/ad'

export const adChannels: AdChannel[] = [
  {
    id: 'douyin_feed',
    name: 'Douyin Feed',
    type: 'feed',
    description: 'Short-video feed traffic entering the commerce recommendation flow.',
  },
  {
    id: 'search_ads',
    name: 'Search Ads',
    type: 'search',
    description: 'High-intent search traffic entering product recommendations.',
  },
  {
    id: 'mall_channel',
    name: 'Mall Channel',
    type: 'mall',
    description: 'Campaign traffic from the in-app mall channel.',
  },
  {
    id: 'creator_video',
    name: 'Creator Video',
    type: 'creator',
    description: 'Creator content traffic after product seeding.',
  },
  {
    id: 'external_launch',
    name: 'External Launch',
    type: 'external',
    description: 'Offsite acquisition traffic entering the commerce feed.',
  },
]

export const campaigns: Campaign[] = [
  {
    id: '618_preheat',
    name: '618 Preheat',
    goal: 'conversion',
    description: 'Major sale warm-up campaign focused on cart and purchase conversion.',
  },
  {
    id: 'summer_new',
    name: 'Summer New',
    goal: 'ctr',
    description: 'New arrival campaign focused on exposure-to-click interest.',
  },
  {
    id: 'flash_sale',
    name: 'Flash Sale',
    goal: 'conversion',
    description: 'Low-price campaign focused on fast purchase intent.',
  },
  {
    id: 'new_user',
    name: 'New User Deal',
    goal: 'new_user',
    description: 'New customer campaign focused on first purchase behavior.',
  },
]

export const creatives: Creative[] = [
  {
    id: 'video_a',
    name: 'Video A',
    type: 'video',
    description: 'Benefit-first short video creative.',
  },
  {
    id: 'video_b',
    name: 'Video B',
    type: 'video',
    description: 'Scenario-based product seeding creative.',
  },
  {
    id: 'image_card_a',
    name: 'Image Card A',
    type: 'image',
    description: 'Static creative emphasizing price and coupon.',
  },
  {
    id: 'live_clip_a',
    name: 'Live Clip A',
    type: 'live_clip',
    description: 'Live-commerce clip creative with conversion intent.',
  },
]

export const defaultAdContext: AdContext = {
  channel: adChannels[0].id,
  campaign: campaigns[0].id,
  creative: creatives[0].id,
}

