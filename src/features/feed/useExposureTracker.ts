import { useEffect, useRef } from 'react'

export const EXPOSURE_VISIBLE_RATIO = 0.5
export const EXPOSURE_STAY_DURATION = 1000

type UseExposureTrackerParams = {
  productId: string
  enabled?: boolean
  onExposure: (visibleRatio: number, stayDuration: number) => void
}

export const useExposureTracker = ({
  productId,
  enabled = true,
  onExposure,
}: UseExposureTrackerParams) => {
  const elementRef = useRef<HTMLElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const exposedRef = useRef(false)
  const callbackRef = useRef(onExposure)

  useEffect(() => {
    callbackRef.current = onExposure
  }, [onExposure])

  useEffect(() => {
    exposedRef.current = false
  }, [productId])

  useEffect(() => {
    const element = elementRef.current

    if (!enabled || !element) {
      return undefined
    }

    const clearExposureTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || exposedRef.current) {
          return
        }

        if (entry.intersectionRatio >= EXPOSURE_VISIBLE_RATIO) {
          if (!timerRef.current) {
            timerRef.current = window.setTimeout(() => {
              exposedRef.current = true
              timerRef.current = null
              callbackRef.current(entry.intersectionRatio, EXPOSURE_STAY_DURATION)
            }, EXPOSURE_STAY_DURATION)
          }
        } else {
          clearExposureTimer()
        }
      },
      {
        threshold: [0, EXPOSURE_VISIBLE_RATIO, 1],
      },
    )

    observer.observe(element)

    return () => {
      clearExposureTimer()
      observer.disconnect()
    }
  }, [enabled, productId])

  return elementRef
}
