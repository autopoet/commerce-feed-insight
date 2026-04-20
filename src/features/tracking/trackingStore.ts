import type { TrackingEvent } from './tracking.types'

export type TrackingState = {
  events: TrackingEvent[]
  exposedProductIds: Set<string>
}

export const initialTrackingState: TrackingState = {
  events: [],
  exposedProductIds: new Set<string>(),
}

