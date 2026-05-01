export default function Navbar() {
  function scrollToTerminal() {
    document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="w-full sticky top-0 z-50"
      style={{
        backgroundColor: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-glow)',
      }}
    >
      {/* Inner container — padding responsif */}
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">

        {/* Logo + status dalam satu grup */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="font-orbitron font-black gradient-text tracking-widest flex-shrink-0"
            style={{ fontSize: 'clamp(0.9rem, 4vw, 1.25rem)' }}
          >
            LUMI
          </span>
          {/* Status indicator — tersembunyi di layar sangat kecil */}
          <div
            className="hidden xs:flex items-center gap-1 flex-shrink-0"
            style={{ minWidth: 0 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full blink flex-shrink-0"
              style={{ backgroundColor: '#22c55e', display: 'inline-block' }}
            ></span>
            <span
              className="font-orbitron tracking-widest truncate"
              style={{
                color: '#22c55e',
                fontSize: 'clamp(0.5rem, 2vw, 0.65rem)',
              }}
            >
              LUMI_OS_ACTIVE
            </span>
          </div>
        </div>

        {/* Tombol ACTIVATE */}
        <button
          onClick={scrollToTerminal}
          className="flex-shrink-0 rounded font-bold tracking-widest transition-all duration-200"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(0.55rem, 2.5vw, 0.75rem)',
            padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 3vw, 18px)',
            background: 'var(--gradient-main)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 0 15px var(--border-glow)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ACTIVATE ▶
        </button>
      </div>
    </nav>
  )
}
