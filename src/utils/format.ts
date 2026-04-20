export const formatCurrency = (value: number) => `¥${value.toFixed(2)}`

export const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

export const formatCompactNumber = (value: number) => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`
  }

  return value.toLocaleString('zh-CN')
}
