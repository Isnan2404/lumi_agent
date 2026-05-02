const CAPABILITIES = [
  {
    icon: '🔍', name: 'RESEARCH', color: '#7C3AED',
    tag: 'Deep Analysis',
    desc: 'Analisis mendalam coin/token apapun dengan live market data, use case, kelebihan, risiko, dan risk level.',
  },
  {
    icon: '📖', name: 'EXPLAIN', color: '#2563EB',
    tag: 'Education',
    desc: 'Konsep Web3 dan crypto yang rumit dijelaskan dengan analogi sederhana dan level kesulitan yang terukur.',
  },
  {
    icon: '📁', name: 'PORTFOLIO', color: '#22D3EE',
    tag: 'Risk Analysis',
    desc: 'Review alokasi portfolio dengan risk score visual, composition bars, dan saran edukatif yang actionable.',
  },
  {
    icon: '🔤', name: 'TRANSLATE', color: '#A78BFA',
    tag: 'Jargon Buster',
    desc: 'Terjemahkan jargon crypto ke bahasa manusia. Setiap istilah dilengkapi danger level badge.',
  },
]

export default function CapabilityCards() {
  return (
    <section id="capabilities" className="w-full max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs mb-4"
          style={{
            backgroundColor: 'rgba(124,58,237,0.1)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--purple-light)',
            fontFamily: 'Space Mono',
          }}
        >
          AGENT CAPABILITIES
        </div>
        <h2 className="font-orbitron text-2xl font-bold gradient-text tracking-widest mb-2">
          What Lumi Can Do
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
          4 mode analisis khusus crypto & Web3 — pilih atau ketik langsung
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CAPABILITIES.map((cap) => (
          <div key={cap.name} className="capability-card flex flex-col gap-4">
            {/* Top row: icon + tag */}
            <div className="flex items-start justify-between">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{
                  backgroundColor: `${cap.color}18`,
                  border: `1px solid ${cap.color}35`,
                }}
              >
                {cap.icon}
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${cap.color}15`,
                  border: `1px solid ${cap.color}30`,
                  color: cap.color,
                  fontFamily: 'Space Mono',
                }}
              >
                {cap.tag}
              </span>
            </div>

            {/* Name */}
            <div
              className="font-orbitron text-sm font-bold tracking-widest"
              style={{ color: cap.color }}
            >
              {cap.name}
            </div>

            {/* Desc */}
            <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
              {cap.desc}
            </p>

            {/* Bottom line accent */}
            <div
              className="h-px w-full rounded"
              style={{ background: `linear-gradient(90deg, ${cap.color}60, transparent)` }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
