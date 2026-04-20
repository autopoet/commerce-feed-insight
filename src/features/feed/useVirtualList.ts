import { useMemo, useState } from 'react'

export type VirtualListRange = {
  startIndex: number
  endIndex: number
  offsetY: number
}

export const getVirtualListRange = (
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  itemCount: number,
  overscan = 3,
): VirtualListRange => {
  const rawStart = Math.floor(scrollTop / itemHeight) - overscan
  const rawEnd = Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  const startIndex = Math.max(0, rawStart)
  const endIndex = Math.min(itemCount, rawEnd)

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
  }
}

type UseVirtualListParams<T> = {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export const useVirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualListParams<T>) => {
  const [scrollTop, setScrollTop] = useState(0)

  const range = useMemo(
    () => getVirtualListRange(scrollTop, containerHeight, itemHeight, items.length, overscan),
    [containerHeight, itemHeight, items.length, overscan, scrollTop],
  )

  const visibleItems = useMemo(
    () =>
      items.slice(range.startIndex, range.endIndex).map((item, index) => ({
        item,
        index: range.startIndex + index,
      })),
    [items, range.endIndex, range.startIndex],
  )

  return {
    range,
    visibleItems,
    totalHeight: items.length * itemHeight,
    setScrollTop,
  }
}

