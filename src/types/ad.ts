export type AdChannelType = 'feed' | 'search' | 'mall' | 'creator' | 'external'

export type CampaignGoal = 'ctr' | 'conversion' | 'new_user'

export type CreativeType = 'video' | 'image' | 'live_clip'

export type AdChannel = {
  id: string
  name: string
  type: AdChannelType
  description: string
}

export type Campaign = {
  id: string
  name: string
  goal: CampaignGoal
  description: string
}

export type Creative = {
  id: string
  name: string
  type: CreativeType
  description: string
}

export type AdContext = {
  channel: string
  campaign: string
  creative: string
}

