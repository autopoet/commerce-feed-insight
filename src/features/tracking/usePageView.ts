import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { track } from './track'
import type { PageName } from './tracking.types'

export const usePageView = (page: PageName) => {
  const location = useLocation()

  useEffect(() => {
    track({
      eventName: 'page_view',
      page,
      payload: {
        path: location.pathname,
      },
    })
  }, [location.pathname, page])
}

