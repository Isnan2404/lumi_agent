import ReactMarkdown from 'react-markdown'
import { formatPrice, formatCurrency } from '../services/coinGeckoService'

// Danger level badges untuk mode TRANSLATE
const DANGER_LEVELS = {
  'rug pull':   { level: 'DANGER',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   label: 'SCAM/FRAUD'           },
  'fomo':       { level: 'DANGER',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   label: 'Psychological Trap'   },
  'pump dump':  { level: 'DANGER',  color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   label: 'Market Manipulation'  },
  'dyor':       { level: 'SAFE',    color: '#10B981', bg: 'rgba(16,185,129,0.12)',  label: 'Best Practice'        },
  'hodl':       { level: 'NEUTRAL', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'Strategy Term'        },
  'gas fee':    { level: 'CAUTION', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Cost Risk'            },
  'whale':      { level: 'CAUTION', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Market Risk'          },
  'moon':       { level: 'CAUTION', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Speculation'          },
  'fud':        { level: 'CAUTION', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Market Sentiment'     },
}

// Deteksi danger level dari konten output
function detectDangerBadges(content) {
  const lower = content.toLowerCase()
  const found = []
  for (const [keyword, data] of Object.entries(DANGER_LEVELS)) {
    if (lower.includes(keyword)) {
      found.push({ keyword, ...data })
    }
  }
  return found
}

// Parse risk score dari teks AI output (cari pola "X.X / 10" atau "X / 10")
function parseRiskScore(content) {
  const match = content.match(/Risk Score[:\s]*(\d+\.?\d*)\s*\/\s*10/i)
  return match ? parseFloat(match[1]) : null
}

// Parse komposisi portfolio dari teks (cari pola "XX% TICKER")
function parsePortfolioComposition(content) {
  const matches = [...content.matchAll(/([A-Z]{2,5})\s+\[?(\d+)%/g)]
  if (matches.length === 0) {
    // Coba pattern lain: "XX% BTC"
    const alt = [...content.matchAll(/(\d+)%\s+([A-Z]{2,5})/g)]
    return alt.map(m => ({ ticker: m[2], pct: parseInt(m[1]) })).slice(0, 5)
  }
  return matches.map(m => ({ ticker: m[1], pct: parseInt(m[2]) })).slice(0, 5)
}

// Komponen: Live Market Data Block (hanya untuk RESEARCH)
function LiveDataBlock({ liveData }) {
  if (!liveData) return null

  const change24h = liveData.price_change_percentage_24h
  const change7d  = liveData.price_change_percentage_7d_in_currency
  const isUp24h   = change24h >= 0

  return (
    <div
      className="rounded-lg p-4 mb-4 font-mono text-xs"
      style={{
        backgroundColor: 'rgba(34,211,238,0.05)',
        border: '1px solid rgba(34,211,238,0.3)',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      {/* Header */}
      <div
        className="text-xs font-bold tracking-widest mb-3 pb-2"
        style={{
          color: 'var(--cyan-accent)',
          fontFamily: 'Orbitron, sans-serif',
          borderBottom: '1px solid rgba(34,211,238,0.2)',
        }}
      >
        ◈ LIVE MARKET DATA — {liveData.name} ({liveData.symbol?.toUpperCase()})
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <span style={{ color: 'var(--text-muted)' }}>💰 Price</span>
          <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
            {formatPrice(liveData.current_price)}
          </span>
          <span
            className="ml-2"
            style={{ color: isUp24h ? '#10B981' : '#EF4444' }}
          >
            {isUp24h ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>📊 Market Cap</span>
          <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(liveData.market_cap)}
          </span>
          <span className="ml-1" style={{ color: 'var(--purple-light)' }}>
            #{liveData.market_cap_rank}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>📈 24h Volume</span>
          <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(liveData.total_volume)}
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>📉 7d Change</span>
          <span
            className="ml-2"
            style={{ color: change7d >= 0 ? '#10B981' : '#EF4444' }}
          >
            {change7d != null ? `${change7d >= 0 ? '+' : ''}${change7d.toFixed(2)}%` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Komponen: Risk Score bar (untuk PORTFOLIO)
function RiskScoreBar({ score }) {
  if (score === null) return null

  const pct   = (score / 10) * 100
  const color = score > 7 ? '#EF4444' : score >= 4 ? '#F59E0B' : '#10B981'

  return (
    <div
      className="rounded-lg p-4 mb-4"
      style={{
        backgroundColor: 'rgba(124,58,237,0.07)',
        border: '1px solid var(--border-glow)',
      }}
    >
      <div
        className="text-xs font-bold tracking-widest mb-2"
        style={{ color: 'var(--purple-light)', fontFamily: 'Orbitron, sans-serif' }}
      >
        ◈ RISK SCORE VISUAL
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', width: '80px' }}>
          RISK SCORE
        </span>
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ height: '10px', backgroundColor: 'var(--bg-primary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          />
        </div>
        <span className="text-xs font-bold" style={{ color, fontFamily: 'Space Mono' }}>
          {score} / 10
        </span>
      </div>
    </div>
  )
}

// Komponen: Portfolio composition bars
function PortfolioBars({ content }) {
  const compositions = parsePortfolioComposition(content)
  if (compositions.length === 0) return null

  return (
    <div
      className="rounded-lg p-4 mb-4"
      style={{
        backgroundColor: 'rgba(124,58,237,0.07)',
        border: '1px solid var(--border-glow)',
      }}
    >
      <div
        className="text-xs font-bold tracking-widest mb-3"
        style={{ color: 'var(--purple-light)', fontFamily: 'Orbitron, sans-serif' }}
      >
        ◈ KOMPOSISI VISUAL
      </div>
      {compositions.map(({ ticker, pct }) => (
        <div key={ticker} className="flex items-center gap-3 mb-2">
          <span
            className="text-xs font-bold"
            style={{ color: 'var(--cyan-accent)', fontFamily: 'Space Mono', width: '40px' }}
          >
            {ticker}
          </span>
          <div
            className="flex-1 rounded-full overflow-hidden"
            style={{ height: '8px', backgroundColor: 'var(--bg-primary)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: 'var(--gradient-main)',
                boxShadow: '0 0 6px rgba(124,58,237,0.5)',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          <span
            className="text-xs"
            style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', width: '36px', textAlign: 'right' }}
          >
            {pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

// Komponen: Danger level badges (untuk TRANSLATE)
function DangerBadges({ content }) {
  const badges = detectDangerBadges(content)
  if (badges.length === 0) return null

  return (
    <div
      className="rounded-lg p-4 mb-4"
      style={{
        backgroundColor: 'rgba(124,58,237,0.05)',
        border: '1px solid var(--border-glow)',
      }}
    >
      <div
        className="text-xs font-bold tracking-widest mb-3"
        style={{ color: 'var(--purple-light)', fontFamily: 'Orbitron, sans-serif' }}
      >
        ◈ DANGER LEVEL SCAN
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map(({ keyword, level, color, bg, label }) => (
          <div
            key={keyword}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              backgroundColor: bg,
              border: `1px solid ${color}60`,
              fontFamily: 'Space Mono, monospace',
            }}
          >
            <span style={{ color, fontWeight: 'bold' }}>{level}</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {keyword.toUpperCase()} — {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * OutputCard — Komponen output utama Lumi
 * Props:
 *   content (string): teks markdown dari API response
 *   mode (string): 'RESEARCH' | 'EXPLAIN' | 'PORTFOLIO' | 'TRANSLATE'
 *   liveData (Object|null): data live dari CoinGecko (hanya relevan untuk RESEARCH)
 */
export default function OutputCard({ content, mode, liveData }) {
  if (!content) return null

  const modeColors = {
    RESEARCH:  { border: '#7C3AED', label: '📊 RESEARCH REPORT'  },
    EXPLAIN:   { border: '#2563EB', label: '📖 LUMI EXPLAINS'    },
    PORTFOLIO: { border: '#22D3EE', label: '📁 PORTFOLIO ANALYSIS'},
    TRANSLATE: { border: '#A78BFA', label: '🔤 LUMI TRANSLATES'  },
  }

  const current    = modeColors[mode] || modeColors.EXPLAIN
  const riskScore  = mode === 'PORTFOLIO' ? parseRiskScore(content) : null

  return (
    <div
      className="rounded-lg p-5 mt-4 w-full"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: `1px solid ${current.border}`,
        boxShadow: `0 0 20px ${current.border}40`,
        animation: 'fadeInUp 0.4s ease',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-4 pb-3"
        style={{ borderBottom: `1px solid ${current.border}40` }}
      >
        <div
          className="flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: '36px',
            height: '36px',
            border: `2px solid ${current.border}`,
            boxShadow: `0 0 10px ${current.border}60`,
          }}
        >
          <img
            src="/lumi-avatar.png"
            alt="Lumi"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#7C3AED,#2563EB);display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-weight:900;color:white;font-size:14px">L</div>`
            }}
          />
        </div>
        <div>
          <div className="font-orbitron text-xs font-bold tracking-widest" style={{ color: current.border }}>
            {current.label}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
            Lumi · AI Crypto Agent
          </div>
        </div>
      </div>

      {/* Blok kondisional per mode */}
      {mode === 'RESEARCH'  && <LiveDataBlock liveData={liveData} />}
      {mode === 'PORTFOLIO' && <RiskScoreBar score={riskScore} />}
      {mode === 'PORTFOLIO' && <PortfolioBars content={content} />}
      {mode === 'TRANSLATE' && <DangerBadges content={content} />}

      {/* Markdown AI output */}
      <div className="markdown-output" style={{ color: 'var(--cyan-accent)' }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
