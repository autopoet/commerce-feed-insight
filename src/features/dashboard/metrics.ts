import type { TrackingEvent } from '../tracking/tracking.types'

export type DashboardMetrics = {
  exposures: number
  clicks: number
  addToCarts: number
  purchases: number
  ctr: number
  addToCartRate: number
  purchaseRate: number
}

export type BreakdownDimension = 'channel' | 'creative'

export type BreakdownMetric = DashboardMetrics & {
  dimensionValue: string
}

const safeRate = (numerator: number, denominator: number) =>
  denominator === 0 ? 0 : numerator / denominator

export const calculateDashboardMetrics = (
  events: TrackingEvent[],
): DashboardMetrics => {
  const exposures = events.filter((event) => event.eventName === 'product_exposure').length
  const clicks = events.filter((event) => event.eventName === 'product_click').length
  const addToCarts = events.filter((event) => event.eventName === 'add_to_cart').length
  const purchases = events.filter((event) => event.eventName === 'purchase').length

  return {
    exposures,
    clicks,
    addToCarts,
    purchases,
    ctr: safeRate(clicks, exposures),
    addToCartRate: safeRate(addToCarts, clicks),
    purchaseRate: safeRate(purchases, clicks),
  }
}

export const calculateBreakdown = (
  events: TrackingEvent[],
  dimension: BreakdownDimension,
): BreakdownMetric[] => {
  const groups = new Map<string, TrackingEvent[]>()

  events.forEach((event) => {
    const value = event[dimension] ?? 'unknown'
    groups.set(value, [...(groups.get(value) ?? []), event])
  })

  return Array.from(groups.entries()).map(([dimensionValue, groupEvents]) => ({
    dimensionValue,
    ...calculateDashboardMetrics(groupEvents),
  }))
}

