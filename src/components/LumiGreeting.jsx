import { useState, useEffect } from 'react'
import { fetchFearGreed } from '../services/coinGeckoService'

// Pesan proaktif Lumi berdasarkan kondisi market
function buildGreetingMessage(fgData) {
  if (!fgData) {
    return {
      message: "Hei! Saya Lumi 👋 — AI Crypto Intelligence Agent kamu. Ada yang ingin kamu analisis atau pelajari hari ini?",
      tone: 'neutral',
    }
  }
  const val = parseInt(fgData.value)
  if (val >= 75) return {
    message: `Market sedang EXTREME GREED (${val}) 🔴 — Banyak investor euforia. Biasanya ini sinyal untuk berhati-hati. Mau saya bantu analisis risiko portfolio kamu?`,
    tone: 'danger',
  }
  if (val >= 55) return {
    message: `Market sedang GREED (${val}) 🟠 — Momentum positif, tapi jangan sampai FOMO. Mau saya research coin yang sedang naik untuk kamu?`,
    tone: 'warning',
  }
  if (val >= 45) return {
    message: `Market sedang NEUTRAL (${val}) ⚪ — Kondisi stabil, bagus untuk belajar atau review portfolio. Mau mulai dari mana?`,
    tone: 'neutral',
  }
  if (val >= 25) return {
    message: `Market sedang FEAR (${val}) 🔵 — Banyak yang panik jual. Kata Warren Buffett: "Be greedy when others are fearful." Mau saya analisis peluangnya?`,
    tone: 'opportunity',
  }
  return {
    message: `Market sedang EXTREME FEAR (${val}) 🟣 — Level ketakutan sangat tinggi. Ini bisa jadi kesempatan bagi investor jangka panjang. Mau saya bantu analisis?`,
    tone: 'opportunity',
  }
}

const TONE_COLORS = {
  danger:      { border: '#EF4444', accent: '#EF4444' },
  warning:     { border: '#F59E0B', accent: '#F59E0B' },
  neutral:     { border: 'var(--purple-main)', accent: 'var(--purple-light)' },
  opportunity: { border: '#10B981', accent: '#10B981' },
}

// Aksi cepat yang bisa diklik user
const QUICK_ACTIONS = [
  { label: '🔍 Research Coin',       prompt: 'Research Bitcoin untuk saya'                           },
  { label: '📁 Cek Portfolio',       prompt: '50% BTC, 30% ETH, 20% SOL — analisis portfolio saya'  },
  { label: '📖 Pelajari Crypto',     prompt: 'Jelaskan apa itu DeFi Yield Farming'                   },
  { label: '🔤 Translate Jargon',    prompt: 'Apa itu rug pull, DYOR, dan HODL?'                     },
]

/**
 * LumiGreeting — Proactive Mode
 * Lumi berbicara duluan saat halaman pertama dibuka.
 * Props:
 *   onQuickAction (function): dipanggil saat user klik aksi cepat,
 *                             menerima (promptText) sebagai argumen
 */
export default function LumiGreeting({ onQuickAction }) {
  const [greeting, setGreeting]   = useState(null)
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone]       = useState(false)
  const [visible, setVisible]     = useState(false)

  useEffect(() => {
    // Delay kecil agar halaman settle dulu sebelum greeting muncul
    const t = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    fetchFearGreed()
      .then(data => setGreeting(buildGreetingMessage(data)))
      .catch(()  => setGreeting(buildGreetingMessage(null)))
  }, [visible])

  // Typewriter effect
  useEffect(() => {
    if (!greeting) return
    setDisplayed('')
    setIsDone(false)
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(greeting.message.slice(0, i + 1))
      i++
      if (i >= greeting.message.length) {
        clearInterval(interval)
        setIsDone(true)
      }
    }, 22)
    return () => clearInterval(interval)
  }, [greeting])

  if (!visible || !greeting) return null

  const { border, accent } = TONE_COLORS[greeting.tone] || TONE_COLORS.neutral

  return (
    <div
      className="greeting-card w-full max-w-4xl mx-auto px-5 py-5 mb-6"
      style={{ borderColor: border }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div
          className="flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: '42px', height: '42px',
            border: `2px solid ${border}`,
            boxShadow: `0 0 14px ${border}60`,
          }}
        >
          <img
            src="/lumi-avatar.png"
            alt="Lumi"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#7C3AED,#2563EB);display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-weight:900;color:white;font-size:15px">L</div>`
            }}
          />
        </div>

        <div>
          <div className="font-orbitron text-xs font-bold tracking-widest" style={{ color: accent }}>
            LUMI — PROACTIVE INTELLIGENCE
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
            Crypto AI Agent · Online
          </div>
        </div>

        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: '#10B981', fontFamily: 'Space Mono' }}>
          <span className="w-1.5 h-1.5 rounded-full blink" style={{ backgroundColor: '#10B981', display: 'inline-block' }} />
          LIVE
        </div>
      </div>

      {/* Typewriter message */}
      <p
        className="text-sm mb-5 leading-relaxed"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Space Mono', minHeight: '3rem' }}
      >
        {displayed}
        {!isDone && <span className="blink" style={{ color: accent }}>▌</span>}
      </p>

      {/* Quick action buttons — muncul setelah typewriter selesai */}
      {isDone && (
        <div
          className="flex flex-wrap gap-2"
          style={{ animation: 'fadeInUp 0.4s ease' }}
        >
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              className="greeting-action-btn"
              onClick={() => onQuickAction(action.prompt)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
