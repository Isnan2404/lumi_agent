import { useState } from 'react'
import { runLumiAgent } from '../services/groqService'
import { fetchCoinData, detectCoinFromInput } from '../services/coinGeckoService'
import OutputCard from './OutputCard'
import ThinkingSteps, { THINKING_STEPS } from './ThinkingSteps'

const MODES = [
  { id: 'RESEARCH',  icon: '🔍', label: 'RESEARCH'  },
  { id: 'EXPLAIN',   icon: '📖', label: 'EXPLAIN'   },
  { id: 'PORTFOLIO', icon: '📁', label: 'PORTFOLIO' },
  { id: 'TRANSLATE', icon: '🔤', label: 'TRANSLATE' },
]

const QUICK_TASKS = {
  RESEARCH:  [
    'Research Bitcoin untuk saya',
    'Research Ethereum untuk saya',
    'Research Solana untuk saya',
    'Research Chainlink untuk saya',
  ],
  EXPLAIN:   [
    'Jelaskan apa itu DeFi',
    'Apa itu NFT?',
    'Jelaskan cara kerja Blockchain',
    'Apa itu Web3?',
  ],
  PORTFOLIO: [
    '50% BTC, 30% ETH, 20% SOL',
    '100% Bitcoin',
    '40% BTC, 40% ETH, 20% altcoins',
    '70% stablecoin, 30% BTC',
  ],
  TRANSLATE: [
    'Apa itu rug pull, DYOR, hodl?',
    'Jelaskan: gas fee, whale, FOMO',
    'Apa itu bull market dan bear market?',
    'Jelaskan: DEX, CEX, liquidity pool',
  ],
}

/**
 * LumiTerminal — Komponen utama interaksi user dengan Lumi Agent
 * Props:
 *   agentState (string): state agent dari App.jsx — 'idle' | 'thinking' | 'done'
 *   setAgentState (function): setter dari App.jsx
 */
export default function LumiTerminal({ agentState, setAgentState }) {
  const [activeMode, setActiveMode]           = useState('RESEARCH')
  const [inputValue, setInputValue]           = useState('')
  const [output, setOutput]                   = useState(null)
  const [outputMode, setOutputMode]           = useState(null)
  const [error, setError]                     = useState(null)
  const [thinkingSteps, setThinkingSteps]     = useState([])
  const [isLastBlinking, setIsLastBlinking]   = useState(false)
  const [liveData, setLiveData]               = useState(null)

  const isLoading = agentState === 'thinking'

  // Animasi thinking steps — muncul satu per satu tiap 600ms
  async function runThinkingAnimation(mode) {
    const steps = THINKING_STEPS[mode]
    setThinkingSteps([])
    setIsLastBlinking(false)
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600))
      setThinkingSteps((prev) => [...prev, steps[i]])
      // Step terakhir berkedip sampai AI selesai
      if (i === steps.length - 1) setIsLastBlinking(true)
    }
  }

  async function handleRunAgent() {
    if (!inputValue.trim() || isLoading) return

    setAgentState('thinking')
    setOutput(null)
    setError(null)
    setThinkingSteps([])
    setLiveData(null)
    setOutputMode(activeMode)

    try {
      // Fetch live data untuk mode RESEARCH (paralel dengan thinking animation)
      let coinData = null
      if (activeMode === 'RESEARCH') {
        const coinName = detectCoinFromInput(inputValue)
        if (coinName) {
          try {
            coinData = await fetchCoinData(coinName)
            setLiveData(coinData)
          } catch {
            // Jika fetch gagal, lanjut tanpa live data
            coinData = null
          }
        }
      }

      // Jalankan AI dan thinking animation secara paralel
      const [aiResult] = await Promise.all([
        runLumiAgent(activeMode, inputValue.trim(), coinData),
        runThinkingAnimation(activeMode),
      ])

      setIsLastBlinking(false)
      setOutput(aiResult)
      setAgentState('done')
      setTimeout(() => setAgentState('idle'), 800)

    } catch (err) {
      setIsLastBlinking(false)
      setError(err.message || 'Terjadi kesalahan. Coba lagi.')
      setAgentState('idle')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRunAgent()
    }
  }

  function handleQuickTask(task) {
    setInputValue(task)
  }

  function handleModeChange(modeId) {
    setActiveMode(modeId)
    setInputValue('')
    setOutput(null)
    setError(null)
    setThinkingSteps([])
  }

  return (
    <section id="terminal" className="w-full max-w-4xl mx-auto px-4 py-12">

      {/* Terminal header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-lg"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-80 inline-block"></span>
        </div>
        <span
          className="font-orbitron text-xs tracking-widest"
          style={{ color: 'var(--purple-light)' }}
        >
          LUMI_TERMINAL v1.0
        </span>
        <span className="text-xs blink" style={{ color: '#22c55e' }}>
          ● ACTIVE
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="p-5 rounded-b-lg"
        style={{
          backgroundColor: 'var(--bg-terminal)',
          border: '1px solid var(--border-glow)',
          borderTop: 'none',
        }}
      >
        {/* Mode selector tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {MODES.map((mode) => {
            const isActive = activeMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className="px-4 py-2 rounded text-xs font-bold tracking-widest transition-all duration-200"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  backgroundColor: isActive ? 'var(--purple-main)'   : 'var(--bg-secondary)',
                  color:           isActive ? '#ffffff'               : 'var(--text-muted)',
                  border:          isActive ? '1px solid var(--purple-light)' : '1px solid var(--border-glow)',
                  boxShadow:       isActive ? '0 0 15px var(--border-glow)'   : 'none',
                }}
              >
                {mode.icon} {mode.label}
              </button>
            )
          })}
        </div>

        {/* Quick task buttons */}
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            ▸ Quick Tasks:
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TASKS[activeMode].map((task) => (
              <button
                key={task}
                onClick={() => handleQuickTask(task)}
                className="text-xs px-3 py-1 rounded transition-all duration-150"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--cyan-accent)',
                  border: '1px solid rgba(34,211,238,0.3)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan-accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'}
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar — textarea expand ke bawah */}
        <div
          className="flex flex-col gap-2 p-3 rounded-lg mb-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-glow)',
          }}
        >
          <div className="flex items-start gap-2">
            <span
              className="mt-1 flex-shrink-0"
              style={{ color: 'var(--purple-light)', fontFamily: 'Space Mono' }}
            >
              &gt;
            </span>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Masukkan perintah untuk mode ${activeMode}... (Shift+Enter untuk baris baru)`}
              disabled={isLoading}
              rows={2}
              className="flex-1 bg-transparent outline-none text-sm resize-none"
              style={{
                fontFamily: 'Space Mono, monospace',
                color: 'var(--text-primary)',
                minHeight: '48px',
                maxHeight: '160px',
                overflowY: 'auto',
                lineHeight: '1.6',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleRunAgent}
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-2 rounded text-xs font-bold tracking-widest transition-all duration-200"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                background: (isLoading || !inputValue.trim())
                  ? 'var(--bg-primary)'
                  : 'var(--gradient-main)',
                color: (isLoading || !inputValue.trim()) ? 'var(--text-muted)' : '#ffffff',
                border: '1px solid var(--border-glow)',
                cursor: (isLoading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                minWidth: '100px',
              }}
            >
              {isLoading ? 'RUNNING...' : 'RUN ▶'}
            </button>
          </div>
        </div>

        {/* Thinking steps — muncul saat loading */}
        {isLoading && (
          <ThinkingSteps
            steps={thinkingSteps}
            isLastStepBlinking={isLastBlinking}
          />
        )}

        {/* Error state */}
        {error && (
          <div
            className="p-4 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#f87171',
              fontFamily: 'Space Mono',
            }}
          >
            ⚠️ ERROR: {error}
          </div>
        )}

        {/* Output card */}
        {output && !isLoading && (
          <OutputCard content={output} mode={outputMode} liveData={liveData} />
        )}
      </div>
    </section>
  )
}
