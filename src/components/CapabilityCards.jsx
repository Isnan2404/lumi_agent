const CAPABILITIES = [
  {
    icon: "🔍",
    name: "RESEARCH",
    color: "#7C3AED",
    desc: "Analisis mendalam tentang coin atau token apapun. Dapatkan laporan terstruktur lengkap dengan use case, kelebihan, risiko, dan risk level.",
  },
  {
    icon: "📖",
    name: "EXPLAIN",
    color: "#2563EB",
    desc: "Penjelasan konsep Web3 dan crypto yang rumit menjadi mudah dipahami, lengkap dengan analogi sederhana dan level kesulitan.",
  },
  {
    icon: "📁",
    name: "PORTFOLIO",
    color: "#22D3EE",
    desc: "Review alokasi portfolio crypto kamu. Dapatkan analisis diversifikasi, risk score, dan saran edukatif dari Lumi.",
  },
  {
    icon: "🔤",
    name: "TRANSLATE",
    color: "#A78BFA",
    desc: "Terjemahkan jargon dan istilah Web3 yang membingungkan ke bahasa yang mudah dipahami siapa saja.",
  },
];

export default function CapabilityCards() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <h2 className="font-orbitron text-center text-xl font-bold mb-2 gradient-text tracking-widest">
        AGENT CAPABILITIES
      </h2>
      <p
        className="text-center text-sm mb-10"
        style={{ color: "var(--text-muted)", fontFamily: "Space Mono" }}
      >
        4 mode analisis khusus crypto & Web3
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.name}
            className="card-hover rounded-lg p-5 flex flex-col gap-3"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: `1px solid ${cap.color}40`,
              boxShadow: `0 0 15px ${cap.color}20`,
            }}
          >
            <div className="text-3xl">{cap.icon}</div>
            <div
              className="font-orbitron text-sm font-bold tracking-widest"
              style={{ color: cap.color }}
            >
              {cap.name}
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-muted)", fontFamily: "Space Mono" }}
            >
              {cap.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
