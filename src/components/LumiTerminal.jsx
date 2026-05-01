import { useState } from "react";
import { runLumiAgent } from "../services/groqService";
import OutputCard from "./OutputCard";

// Data mode agent
const MODES = [
  { id: "RESEARCH", icon: "🔍", label: "RESEARCH" },
  { id: "EXPLAIN", icon: "📖", label: "EXPLAIN" },
  { id: "PORTFOLIO", icon: "📁", label: "PORTFOLIO" },
  { id: "TRANSLATE", icon: "🔤", label: "TRANSLATE" },
];

// Quick task buttons per mode
const QUICK_TASKS = {
  RESEARCH: [
    "Research Bitcoin untuk saya",
    "Research Ethereum untuk saya",
    "Research Solana untuk saya",
    "Research Chainlink untuk saya",
  ],
  EXPLAIN: [
    "Jelaskan apa itu DeFi",
    "Apa itu NFT?",
    "Jelaskan cara kerja Blockchain",
    "Apa itu Web3?",
  ],
  PORTFOLIO: [
    "50% BTC, 30% ETH, 20% SOL",
    "100% Bitcoin",
    "40% BTC, 40% ETH, 20% altcoins",
    "70% stablecoin, 30% BTC",
  ],
  TRANSLATE: [
    "Apa itu rug pull, DYOR, hodl?",
    "Jelaskan: gas fee, whale, FOMO",
    "Apa itu bull market dan bear market?",
    "Jelaskan: DEX, CEX, liquidity pool",
  ],
};

// Komponen loading dots
function LoadingDots() {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--bg-terminal)',
        border: '1px solid var(--border-glow)',
      }}
    >
      {/* Karakter Lumi kecil dengan animasi bounce saat thinking */}
      <div
        className="flex-shrink-0 rounded-full overflow-hidden"
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid var(--purple-main)',
          boxShadow: '0 0 15px rgba(124,58,237,0.6)',
          animation: 'lumiThink 1s ease-in-out infinite',
        }}
      >
        <img
          src="/lumi-avatar.png"
          alt="Lumi thinking"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#7C3AED,#2563EB);display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-weight:900;color:white;font-size:16px">L</div>`
          }}
        />
      </div>

      <div>
        <div style={{ color: 'var(--cyan-accent)', fontFamily: 'Space Mono', fontSize: '0.875rem' }}>
          Lumi sedang menganalisis
          <span className="dot-1"> .</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono', fontSize: '0.7rem', marginTop: '2px' }}>
          Memproses dengan LLaMA 3.3 70B
        </div>
      </div>
    </div>
  )
}

export default function LumiTerminal() {
  const [activeMode, setActiveMode] = useState("RESEARCH");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [outputMode, setOutputMode] = useState(null);
  const [error, setError] = useState(null);

  // Handler: jalankan agent
  async function handleRunAgent() {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setOutput(null);
    setError(null);
    setOutputMode(activeMode);

    try {
      const result = await runLumiAgent(activeMode, inputValue.trim());
      setOutput(result);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handler: tekan Enter di input
  function handleKeyDown(e) {
    // Enter tanpa Shift = submit. Enter + Shift = baris baru.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRunAgent()
    }
  }

  // Handler: klik quick task button
  function handleQuickTask(task) {
    setInputValue(task);
  }

  return (
    <section id="terminal" className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Terminal header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-lg"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-glow)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
        </div>
        <span
          className="font-orbitron text-xs tracking-widest"
          style={{ color: "var(--purple-light)" }}
        >
          LUMI_TERMINAL v1.0
        </span>
        <span className="text-xs blink" style={{ color: "#22c55e" }}>
          ● ACTIVE
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="p-5 rounded-b-lg"
        style={{
          backgroundColor: "var(--bg-terminal)",
          border: "1px solid var(--border-glow)",
          borderTop: "none",
        }}
      >
        {/* Mode selector tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {MODES.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id);
                  setInputValue("");
                  setOutput(null);
                  setError(null);
                }}
                className="px-4 py-2 rounded text-xs font-bold tracking-widest transition-all duration-200"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  backgroundColor: isActive
                    ? "var(--purple-main)"
                    : "var(--bg-secondary)",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                  border: isActive
                    ? "1px solid var(--purple-light)"
                    : "1px solid var(--border-glow)",
                  boxShadow: isActive ? "0 0 15px var(--border-glow)" : "none",
                }}
              >
                {mode.icon} {mode.label}
              </button>
            );
          })}
        </div>

        {/* Quick task buttons */}
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            ▸ Quick Tasks:
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TASKS[activeMode].map((task) => (
              <button
                key={task}
                onClick={() => handleQuickTask(task)}
                className="text-xs px-3 py-1 rounded transition-all duration-150"
                style={{
                  fontFamily: "Space Mono, monospace",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--cyan-accent)",
                  border: "1px solid rgba(34,211,238,0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.borderColor = "var(--cyan-accent)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderColor = "rgba(34,211,238,0.3)")
                }
              >
                {task}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar — textarea yang expand ke bawah */}
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
              placeholder={`Masukkan perintah untuk mode ${activeMode}...`}
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
                // Auto-expand height mengikuti konten
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
            />
          </div>

          {/* Tombol RUN di baris terpisah, full-width di mobile */}
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

        {/* Output area */}
        {isLoading && <LoadingDots />}

        {error && (
          <div
            className="p-4 rounded-lg text-sm"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "#f87171",
              fontFamily: "Space Mono",
            }}
          >
            ⚠️ ERROR: {error}
          </div>
        )}

        {output && !isLoading && (
          <OutputCard content={output} mode={outputMode} />
        )}
      </div>
    </section>
  );
}
