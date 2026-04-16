export function useIota() {
  function formatIota(value: number | null | undefined, decimals = 0): string {
    if (value == null || !Number.isFinite(value)) return '—'
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  function formatCompact(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(value)) return '—'
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value.toFixed(0)
  }

  function formatPercent(value: number | null | undefined, decimals = 2): string {
    if (value == null || !Number.isFinite(value)) return '—'
    return `${value.toFixed(decimals)}%`
  }

  const EXPLORER = 'https://explorer.iota.org'

  function explorerAddress(addr: string): string {
    return `${EXPLORER}/address/${addr}?network=mainnet`
  }

  function explorerObject(addr: string): string {
    return `${EXPLORER}/object/${addr}?network=mainnet`
  }

  function explorerTx(digest: string): string {
    return `${EXPLORER}/txblock/${digest}?network=mainnet`
  }

  function shortAddr(addr: string | null | undefined, head = 8, tail = 6): string {
    if (!addr) return ''
    if (addr.length <= head + tail + 3) return addr
    return `${addr.slice(0, head)}…${addr.slice(-tail)}`
  }

  return { formatIota, formatCompact, formatPercent, explorerAddress, explorerObject, explorerTx, shortAddr }
}
