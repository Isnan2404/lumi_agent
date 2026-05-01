import ReactMarkdown from 'react-markdown'

/**
 * OutputCard — Menampilkan hasil output dari Lumi AI Agent
 * Props:
 *   content (string): teks markdown dari API response
 *   mode (string): 'RESEARCH' | 'EXPLAIN' | 'PORTFOLIO' | 'TRANSLATE'
 */
export default function OutputCard({ content, mode }) {
  if (!content) return null

  const modeColors = {
    RESEARCH:  { border: '#7C3AED', label: '📊 RESEARCH REPORT'  },
    EXPLAIN:   { border: '#2563EB', label: '📖 LUMI EXPLAINS'    },
    PORTFOLIO: { border: '#22D3EE', label: '📁 PORTFOLIO ANALYSIS'},
    TRANSLATE: { border: '#A78BFA', label: '🔤 LUMI TRANSLATES'  },
  }

  const current = modeColors[mode] || modeColors.EXPLAIN

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
      {/* Header: avatar Lumi + label mode */}
      <div
        className="flex items-center gap-3 mb-4 pb-3"
        style={{ borderBottom: `1px solid ${current.border}40` }}
      >
        {/* Avatar Lumi kecil */}
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
              // Fallback jika gambar tidak ada
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#7C3AED,#2563EB);display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-weight:900;color:white;font-size:14px">L</div>`
            }}
          />
        </div>

        <div>
          <div
            className="font-orbitron text-xs font-bold tracking-widest"
            style={{ color: current.border }}
          >
            {current.label}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}
          >
            Lumi · AI Crypto Agent
          </div>
        </div>
      </div>

      {/* Markdown content */}
      <div className="markdown-output" style={{ color: 'var(--cyan-accent)' }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
