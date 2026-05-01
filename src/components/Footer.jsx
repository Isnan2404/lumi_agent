export default function Footer() {
  return (
    <footer
      className="w-full text-center py-10 px-4 mt-8"
      style={{
        borderTop: '1px solid var(--border-glow)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Avatar Lumi kecil di footer */}
      <div className="flex justify-center mb-4">
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: '48px',
            height: '48px',
            border: '2px solid var(--border-glow)',
            boxShadow: '0 0 15px var(--border-glow)',
          }}
        >
          <img
            src="/lumi-avatar.png"
            alt="Lumi"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#7C3AED,#2563EB);display:flex;align-items:center;justify-content:center;font-family:Orbitron,sans-serif;font-weight:900;color:white;font-size:18px">L</div>`
            }}
          />
        </div>
      </div>

      <p className="font-orbitron text-xs tracking-widest gradient-text mb-3">
        LUMI — CRYPTO INTELLIGENCE AGENT
      </p>

      {/* Copyright */}
      <p
        className="text-xs mb-1"
        style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}
      >
        ©2026 | Isnan Ridho Alamsyah
      </p>

      <p
        className="text-xs mb-1"
        style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}
      >
        Powered by Groq AI · LLaMA 3.3 70B
      </p>

      <p
        className="text-xs mb-4"
        style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono' }}
      >
        Built for WealthyPeople.id Stage 2 Developer Recruitment Challenge
      </p>

      <p
        className="text-xs"
        style={{ color: 'rgba(124,58,237,0.7)', fontFamily: 'Space Mono' }}
      >
        ⚠️ Semua output Lumi bersifat edukatif. Bukan saran keuangan atau investasi.
      </p>
    </footer>
  )
}
