export function useIota() {
  function formatIota(value: number, decimals = 0): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  function formatCompact(value: number): string {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value.toFixed(0)
  }

  function formatPercent(value: number, decimals = 2): string {
    return `${value.toFixed(decimals)}%`
  }

  return { formatIota, formatCompact, formatPercent }
}
