import { useState, useEffect } from 'react'
import { fetchFearGreed } from '../services/coinGeckoService'

function getFGColor(v) {
  if (v >= 75) return { color: '#EF4444', label: 'EXTREME GREED 🔴' }
  if (v >= 55) return { color: '#F59E0B', label: 'GREED 🟠' }
  if (v >= 45) return { color: '#94A3B8', label: 'NEUTRAL ⚪' }
  if (v >= 25) return { color: '#3B82F6', label: 'FEAR 🔵' }
  return { color: '#8B5CF6', label: 'EXTREME FEAR 🟣' }
}

function getLumiClass(state) {
  return ({ idle: 'animate-lumi-idle', thinking: 'animate-lumi-thinking', done: 'animate-lumi-done' })[state] || 'animate-lumi-idle'
}

export default function HeroSection({ agentState }) {
  const [fearGreed, setFearGreed] = useState(null)

  useEffect(() => {
    fetchFearGreed().then(setFearGreed).catch(() => null)
  }, [])

  function scrollToTerminal() {
    document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
  }

  const lumiClass = getLumiClass(agentState)

  return (
    <section className="hero-section w-full min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* LEFT — Text content */}
        <div className="flex flex-col items-start order-2 lg:order-1 flex-1">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs"
            style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              border: '1px solid var(--border-glow)',
              color: 'var(--purple-light)',
              fontFamily: 'Space Mono',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full blink flex-shrink-0" style={{ backgroundColor: '#10B981', display: 'inline-block' }} />
            AI-Powered Crypto Intelligence Agent
          </div>

          {/* Headline */}
          <h1
            className="font-orbitron font-black leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}
          >
            <span className="gradient-text">Your AI Crypto</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Intelligence</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Agent</span>
          </h1>

          {/* Sub */}
          <p
            className="mb-8 text-sm tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', letterSpacing: '0.18em' }}
          >
            RESEARCH · ANALYZE · UNDERSTAND
          </p>

          {/* CTA */}
          <button
            onClick={scrollToTerminal}
            className="mb-10 rounded-lg font-bold tracking-widest transition-all duration-300"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.875rem',
              padding: '14px 32px',
              background: 'var(--gradient-main)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 0 30px rgba(124,58,237,0.5)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(124,58,237,0.8)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.5)'}
          >
            Talk to Lumi ▶
          </button>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mb-8">
            {[
              { value: '10K+', label: 'Coins Tracked' },
              { value: 'ID/EN', label: 'Bilingual'    },
              { value: '70B',   label: 'LLaMA Model'  },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-orbitron font-black gradient-text" style={{ fontSize: '1.4rem' }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Fear & Greed */}
          {fearGreed && (() => {
            const val = parseInt(fearGreed.value)
            const { color, label } = getFGColor(val)
            return (
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  width: '100%',
                  maxWidth: '320px',
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'Orbitron, sans-serif' }}>
                    MARKET SENTIMENT
                  </span>
                  <span className="text-xs font-bold" style={{ color, fontFamily: 'Space Mono' }}>
                    {val} — {label}
                  </span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: '6px', backgroundColor: 'var(--bg-primary)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${val}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}`, transition: 'width 1s ease' }}
                  />
                </div>
              </div>
            )
          })()}
        </div>

        {/* RIGHT — Lumi character */}
        <div className="flex-shrink-0 flex items-center justify-center order-1 lg:order-2 relative">
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'clamp(280px, 40vw, 420px)',
              height: 'clamp(280px, 40vw, 420px)',
              background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          {/* Character */}
          <img
            src="/lumi-character.png"
            alt="Lumi — AI Crypto Intelligence Agent"
            className={`${lumiClass} relative z-10`}
            style={{
              width: 'clamp(260px, 38vw, 400px)',
              height: 'clamp(260px, 38vw, 400px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 25px rgba(124,58,237,0.55))',
            }}
            onError={e => { e.target.style.display = 'none' }}
          />
          {/* Status badge di bawah karakter */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs z-20"
            style={{
              backgroundColor: 'rgba(7,7,14,0.85)',
              border: '1px solid var(--border-glow)',
              backdropFilter: 'blur(8px)',
              fontFamily: 'Orbitron, sans-serif',
              color: '#10B981',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full blink" style={{ backgroundColor: '#10B981', display: 'inline-block' }} />
            LUMI_OS_ACTIVE
          </div>
        </div>
      </div>
    </section>
  )
}
