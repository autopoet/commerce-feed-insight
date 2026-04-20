import { create } from 'zustand'
import { useAdContextStore } from '../../stores/adContextStore'
import { createId } from '../../utils/id'
import type { TrackingEvent, TrackInput } from './tracking.types'

const SESSION_KEY = 'commerce-feed-insight-session-id'
const USER_KEY = 'commerce-feed-insight-user-id'

const getBrowserId = (storage: Storage, key: string, prefix: string) => {
  const current = storage.getItem(key)

  if (current) {
    return current
  }

  const next = createId(prefix)
  storage.setItem(key, next)
  return next
}

export const getSessionId = () => getBrowserId(window.sessionStorage, SESSION_KEY, 'session')

export const getUserId = () => getBrowserId(window.localStorage, USER_KEY, 'user')

export type TrackingState = {
  events: TrackingEvent[]
  exposedProductIds: Set<string>
  track: (input: TrackInput) => TrackingEvent
  hasProductExposed: (productId: string) => boolean
  markProductExposed: (productId: string) => void
  clearEvents: () => void
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  events: [],
  exposedProductIds: new Set<string>(),
  track: (input) => {
    const adContext = useAdContextStore.getState()
    const event: TrackingEvent = {
      ...input,
      eventId: createId('event'),
      timestamp: Date.now(),
      sessionId: getSessionId(),
      userId: getUserId(),
      channel: input.channel ?? adContext.channel,
      campaign: input.campaign ?? adContext.campaign,
      creative: input.creative ?? adContext.creative,
    }

    set((state) => ({
      events: [event, ...state.events],
    }))

    return event
  },
  hasProductExposed: (productId) => get().exposedProductIds.has(productId),
  markProductExposed: (productId) => {
    set((state) => {
      const next = new Set(state.exposedProductIds)
      next.add(productId)
      return {
        exposedProductIds: next,
      }
    })
  },
  clearEvents: () =>
    set({
      events: [],
      exposedProductIds: new Set<string>(),
    }),
}))

