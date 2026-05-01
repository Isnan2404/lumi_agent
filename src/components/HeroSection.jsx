export default function HeroSection() {
  function scrollToTerminal() {
    document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 py-16 gap-10 max-w-6xl mx-auto"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)',
      }}
    >
      {/* Karakter Lumi — kiri di desktop, atas di mobile */}
      <div className="flex-shrink-0 flex items-center justify-center order-1 lg:order-none">
        <div
          className="relative"
          style={{ width: 'clamp(200px, 35vw, 340px)', height: 'clamp(200px, 35vw, 340px)' }}
        >
          {/* Glow ring di belakang karakter */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          <img
            src="/lumi-character.png"
            alt="Lumi — AI Crypto Intelligence Agent"
            className="lumi-hero-img relative z-10 w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.6))' }}
          />
        </div>
      </div>

      {/* Teks Hero — kanan di desktop, bawah di mobile */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-none">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-glow)',
            color: 'var(--purple-light)',
            fontFamily: 'Space Mono',
          }}
        >
          <span
            className="w-2 h-2 rounded-full blink flex-shrink-0"
            style={{ backgroundColor: '#22c55e', display: 'inline-block' }}
          ></span>
          AI-Powered Crypto Research Agent
        </div>

        {/* Headline */}
        <h1
          className="font-orbitron font-black mb-4 leading-tight"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 3.5rem)' }}
        >
          <span className="gradient-text">Your AI Crypto</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Intelligence Agent</span>
        </h1>

        {/* Subheadline */}
        <p
          className="mb-8 text-sm tracking-widest"
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'Space Mono',
            letterSpacing: '0.2em',
          }}
        >
          RESEARCH. ANALYZE. UNDERSTAND.
        </p>

        {/* CTA */}
        <button
          onClick={scrollToTerminal}
          className="px-8 py-4 rounded-lg font-bold tracking-widest transition-all duration-300 mb-10"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.875rem',
            background: 'var(--gradient-main)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 0 30px rgba(124,58,237,0.5)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(124,58,237,0.8)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.5)'}
        >
          Activate Lumi ▶
        </button>

        {/* Stats */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
          {[
            { value: '10K+', label: 'Coins Covered' },
            { value: 'ID/EN', label: 'Bilingual' },
            { value: 'AI', label: 'LLaMA 3.3 70B' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-orbitron font-black text-xl gradient-text">
                {stat.value}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
