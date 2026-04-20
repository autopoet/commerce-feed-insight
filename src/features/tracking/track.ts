import type { TrackInput } from './tracking.types'

export type TrackHandler = (input: TrackInput) => void

export const createTrackHandler = (handler: TrackHandler): TrackHandler => handler

