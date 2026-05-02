import { useState, useRef } from 'react'
import { runLumiAgent } from '../services/groqService'
import { fetchCoinData, detectCoinFromInput } from '../services/coinGeckoService'
import OutputCard from './OutputCard'
import ThinkingSteps, { THINKING_STEPS } from './ThinkingSteps'
import LumiGreeting from './LumiGreeting'

const MODES = [
  { id: 'RESEARCH',  icon: '🔍', label: 'RESEARCH'  },
  { id: 'EXPLAIN',   icon: '📖', label: 'EXPLAIN'   },
  { id: 'PORTFOLIO', icon: '📁', label: 'PORTFOLIO' },
  { id: 'TRANSLATE', icon: '🔤', label: 'TRANSLATE' },
]

const QUICK_TASKS = {
  RESEARCH:  ['Research Bitcoin untuk saya', 'Research Ethereum untuk saya', 'Research Solana untuk saya', 'Research Chainlink untuk saya'],
  EXPLAIN:   ['Jelaskan apa itu DeFi', 'Apa itu NFT?', 'Jelaskan cara kerja Blockchain', 'Apa itu Web3?'],
  PORTFOLIO: ['50% BTC, 30% ETH, 20% SOL', '100% Bitcoin', '40% BTC, 40% ETH, 20% altcoins', '70% stablecoin, 30% BTC'],
  TRANSLATE: ['Apa itu rug pull, DYOR, hodl?', 'Jelaskan: gas fee, whale, FOMO', 'Apa itu bull market dan bear market?', 'Jelaskan: DEX, CEX, liquidity pool'],
}

export default function LumiTerminal({ agentState, setAgentState }) {
  const [activeMode, setActiveMode]         = useState('RESEARCH')
  const [inputValue, setInputValue]         = useState('')
  const [output, setOutput]                 = useState(null)
  const [outputMode, setOutputMode]         = useState(null)
  const [error, setError]                   = useState(null)
  const [thinkingSteps, setThinkingSteps]   = useState([])
  const [isLastBlinking, setIsLastBlinking] = useState(false)
  const [liveData, setLiveData]             = useState(null)
  const inputRef                            = useRef(null)

  const isLoading = agentState === 'thinking'

  async function runThinkingAnimation(mode) {
    const steps = THINKING_STEPS[mode]
    setThinkingSteps([])
    setIsLastBlinking(false)
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setThinkingSteps(prev => [...prev, steps[i]])
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
      let coinData = null
      if (activeMode === 'RESEARCH') {
        const coinName = detectCoinFromInput(inputValue)
        if (coinName) {
          try { coinData = await fetchCoinData(coinName); setLiveData(coinData) }
          catch { coinData = null }
        }
      }

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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunAgent() }
  }

  // Dipanggil dari LumiGreeting saat user klik quick action
  function handleGreetingAction(prompt) {
    setInputValue(prompt)
    setTimeout(() => {
      document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }, 100)
  }

  function handleModeChange(modeId) {
    setActiveMode(modeId)
    setInputValue('')
    setOutput(null)
    setError(null)
    setThinkingSteps([])
  }

  return (
    <section id="terminal" className="w-full max-w-7xl mx-auto px-6 py-12">

      {/* PROACTIVE GREETING — di atas terminal */}
      <LumiGreeting onQuickAction={handleGreetingAction} />

      {/* Terminal window */}
      <div className="w-full rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-glow)', boxShadow: '0 0 40px rgba(124,58,237,0.12)' }}>

        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 opacity-80 inline-block" />
          </div>
          <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--purple-light)' }}>
            LUMI_TERMINAL v1.0
          </span>
          <span className="text-xs blink" style={{ color: '#10B981', fontFamily: 'Space Mono' }}>
            ● ACTIVE
          </span>
        </div>

        {/* Body */}
        <div className="p-6" style={{ backgroundColor: 'var(--bg-terminal)' }}>

          {/* Mode tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {MODES.map(mode => {
              const isActive = activeMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className="px-4 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-200"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    backgroundColor: isActive ? 'var(--purple-main)' : 'transparent',
                    color:           isActive ? '#fff' : 'var(--text-muted)',
                    border:          isActive ? '1px solid var(--purple-light)' : '1px solid var(--border-subtle)',
                    boxShadow:       isActive ? '0 0 16px rgba(124,58,237,0.5)' : 'none',
                  }}
                >
                  {mode.icon} {mode.label}
                </button>
              )
            })}
          </div>

          {/* Quick tasks */}
          <div className="mb-5">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>▸ Quick Tasks:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TASKS[activeMode].map(task => (
                <button
                  key={task}
                  onClick={() => setInputValue(task)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    backgroundColor: 'rgba(34,211,238,0.05)',
                    color: 'var(--cyan-accent)',
                    border: '1px solid rgba(34,211,238,0.2)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan-accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'}
                >
                  {task}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div
            className="flex flex-col gap-2 p-4 rounded-xl mb-5"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 font-bold" style={{ color: 'var(--purple-light)', fontFamily: 'Space Mono' }}>&gt;</span>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask Lumi anything about crypto... (mode: ${activeMode})`}
                disabled={isLoading}
                rows={2}
                className="flex-1 bg-transparent outline-none text-sm resize-none"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  color: 'var(--text-primary)',
                  minHeight: '48px',
                  maxHeight: '160px',
                  lineHeight: '1.7',
                }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
                Enter ↵ untuk kirim · Shift+Enter baris baru
              </span>
              <button
                onClick={handleRunAgent}
                disabled={isLoading || !inputValue.trim()}
                className="px-5 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-200"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  background: (isLoading || !inputValue.trim()) ? 'var(--bg-primary)' : 'var(--gradient-main)',
                  color: (isLoading || !inputValue.trim()) ? 'var(--text-muted)' : '#fff',
                  border: '1px solid var(--border-subtle)',
                  cursor: (isLoading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                  minWidth: '110px',
                  boxShadow: (!isLoading && inputValue.trim()) ? '0 0 16px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                {isLoading ? 'RUNNING...' : 'RUN LUMI ▶'}
              </button>
            </div>
          </div>

          {/* Thinking steps */}
          {isLoading && <ThinkingSteps steps={thinkingSteps} isLastStepBlinking={isLastBlinking} />}

          {/* Error */}
          {error && (
            <div
              className="p-4 rounded-xl text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', fontFamily: 'Space Mono' }}
            >
              ⚠️ ERROR: {error}
            </div>
          )}

          {/* Output */}
          {output && !isLoading && (
            <OutputCard content={output} mode={outputMode} liveData={liveData} />
          )}
        </div>
      </div>
    </section>
  )
}
