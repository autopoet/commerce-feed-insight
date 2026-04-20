export type EventName =
  | 'page_view'
  | 'product_exposure'
  | 'product_click'
  | 'add_to_cart'
  | 'purchase'

export type PageName = 'ad_entry' | 'feed' | 'dashboard'

export type TrackingEvent = {
  eventId: string
  eventName: EventName
  timestamp: number
  sessionId: string
  userId: string
  page: PageName
  channel?: string
  campaign?: string
  creative?: string
  productId?: string
  position?: number
  payload?: Record<string, unknown>
}

export type TrackInput = Omit<
  TrackingEvent,
  'eventId' | 'timestamp' | 'sessionId' | 'userId' | 'channel' | 'campaign' | 'creative'
> & {
  channel?: string
  campaign?: string
  creative?: string
}

