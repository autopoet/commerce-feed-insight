import { useTrackingStore } from './trackingStore'
import type { TrackInput } from './tracking.types'

export const track = (input: TrackInput) => useTrackingStore.getState().track(input)

