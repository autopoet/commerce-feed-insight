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

