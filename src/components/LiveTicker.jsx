import { useState, useEffect, useRef } from 'react'
import { fetchTickerPrices, COIN_IDS } from '../services/coinGeckoService'

// Mapping coin ID → tampilan label dan simbol
const TICKER_DISPLAY = {
  bitcoin:     { symbol: '₿',  label: 'BTC' },
  ethereum:    { symbol: 'Ξ',  label: 'ETH' },
  solana:      { symbol: '◎',  label: 'SOL' },
  chainlink:   { symbol: '⬡',  label: 'LINK'},
  cardano:     { symbol: '₳',  label: 'ADA' },
  polkadot:    { symbol: '●',  label: 'DOT' },
  binancecoin: { symbol: 'B',  label: 'BNB' },
  ripple:      { symbol: '✕',  label: 'XRP' },
  'avalanche-2': { symbol: '🔺', label: 'AVAX'},
}

export default function LiveTicker() {
  const [prices, setPrices] = useState(null)
  const [error, setError]   = useState(false)
  const intervalRef         = useRef(null)

  async function loadPrices() {
    try {
      const data = await fetchTickerPrices()
      setPrices(data)
      setError(false)
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    loadPrices()
    // Auto-refresh setiap 60 detik
    intervalRef.current = setInterval(loadPrices, 60_000)
    return () => clearInterval(intervalRef.current)
  }, [])

  // Jika error atau belum load, tampilkan bar kosong (tidak crash)
  if (error || !prices) {
    return (
      <div
        className="w-full py-2 text-center text-xs"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-muted)',
          fontFamily: 'Space Mono',
          borderBottom: '1px solid var(--border-glow)',
        }}
      >
        {error ? '⚠ Live price unavailable' : '⟳ Loading prices...'}
      </div>
    )
  }

  // Ambil coin ID unik untuk ditampilkan
  const uniqueIds = [...new Set(Object.values(COIN_IDS))]

  // Buat teks ticker
  const tickerItems = uniqueIds.map((id) => {
    const display = TICKER_DISPLAY[id]
    if (!display || !prices[id]) return null
    const price   = prices[id].usd
    const change  = prices[id].usd_24h_change
    const isUp    = change >= 0
    return { id, display, price, change, isUp }
  }).filter(Boolean)

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-glow)',
        height: '32px',
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 h-full w-12 z-10"
        style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }}
      />
      <div
        className="absolute right-0 top-0 h-full w-12 z-10"
        style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }}
      />

      {/* Scrolling content — duplikasi agar infinite */}
      <div
        className="flex items-center h-full ticker-scroll"
        style={{ width: 'max-content' }}
      >
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <span
            key={`${item.id}-${idx}`}
            className="flex items-center gap-1 px-4 text-xs whitespace-nowrap"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            <span style={{ color: 'var(--purple-light)' }}>{item.display.symbol}</span>
            <span style={{ color: 'var(--text-muted)' }}>{item.display.label}</span>
            <span style={{ color: 'var(--text-primary)' }}>
              ${item.price >= 1
                ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : item.price.toFixed(4)}
            </span>
            <span style={{ color: item.isUp ? '#10B981' : '#EF4444' }}>
              {item.isUp ? '▲' : '▼'}{Math.abs(item.change).toFixed(2)}%
            </span>
            <span style={{ color: 'var(--border-glow)', marginLeft: '8px' }}>|</span>
          </span>
        ))}
      </div>
    </div>
  )
}
