/**
 * ThinkingSteps.jsx
 * Komponen yang menampilkan langkah-langkah proses agent Lumi
 * saat sedang memproses input user.
 *
 * Props:
 *   steps (string[]): array step yang sudah muncul (diisi secara bertahap)
 *   isLastStepBlinking (boolean): apakah step terakhir masih berkedip (AI belum selesai)
 */

// Data steps per mode — diekspor agar bisa dipakai di LumiTerminal
export const THINKING_STEPS = {
  RESEARCH: [
    "Mengidentifikasi aset yang diminta...",
    "Fetching live market data dari CoinGecko...",
    "Menganalisis fundamental & use case...",
    "Menghitung risk level & volatilitas...",
    "Menyusun intelligence report...",
  ],
  EXPLAIN: [
    "Memproses konsep yang diminta...",
    "Menganalisis kompleksitas topik...",
    "Mencari analogi yang paling tepat...",
    "Menyusun penjelasan bertingkat...",
    "Finalisasi laporan edukasi...",
  ],
  PORTFOLIO: [
    "Membaca komposisi portfolio...",
    "Menghitung bobot setiap aset...",
    "Fetching harga live untuk kalkulasi...",
    "Menganalisis diversifikasi & risk score...",
    "Menyusun rekomendasi edukatif...",
  ],
  TRANSLATE: [
    "Mendeteksi istilah Web3/crypto...",
    "Mencari konteks penggunaan di ekosistem...",
    "Menentukan danger level setiap istilah...",
    "Menerjemahkan ke bahasa mudah dipahami...",
    "Finalisasi terjemahan...",
  ],
};

export default function ThinkingSteps({ steps, isLastStepBlinking }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div
      className="p-4 rounded-lg mb-3"
      style={{
        backgroundColor: 'var(--bg-terminal)',
        border: '1px solid var(--border-glow)',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      {/* Header */}
      <div
        className="text-xs mb-3 font-bold tracking-widest"
        style={{ color: 'var(--purple-light)', fontFamily: 'Orbitron, sans-serif' }}
      >
        ◈ AGENT PROCESS LOG
      </div>

      {/* Steps list */}
      <div className="flex flex-col gap-1.5">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isBlinking = isLast && isLastStepBlinking;

          return (
            <div
              key={index}
              className="flex items-center gap-2 text-xs"
              style={{
                color: isBlinking ? 'var(--cyan-accent)' : 'var(--text-muted)',
                animation: isBlinking ? 'stepFadeIn 0.3s ease' : 'stepFadeIn 0.3s ease',
              }}
            >
              {/* Ikon status */}
              <span
                style={{
                  color: isBlinking ? 'var(--cyan-accent)' : '#22c55e',
                  fontSize: '0.7rem',
                  animation: isBlinking ? 'blink 1.2s infinite' : 'none',
                  flexShrink: 0,
                }}
              >
                {isBlinking ? '◌' : '✓'}
              </span>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
