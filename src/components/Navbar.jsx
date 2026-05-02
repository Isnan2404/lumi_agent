export default function Navbar() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="w-full sticky top-0 z-50"
      style={{
        backgroundColor: 'rgba(7,7,14,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="font-orbitron font-black gradient-text tracking-widest"
            style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}
          >
            LUMI
          </span>
          <span
            className="hidden md:flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full blink"
              style={{ backgroundColor: '#10B981', display: 'inline-block' }}
            />
            LUMI_OS_ACTIVE
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: 'SKILLS',   id: 'capabilities' },
            { label: 'TERMINAL', id: 'terminal'      },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-xs tracking-widest transition-colors duration-200"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--purple-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('terminal')}
          className="rounded font-bold tracking-widest transition-all duration-200"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
            padding: 'clamp(7px, 1.5vw, 9px) clamp(12px, 3vw, 20px)',
            background: 'var(--gradient-main)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.7)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)'}
        >
          ACTIVATE ▶
        </button>
      </div>
    </nav>
  )
}
