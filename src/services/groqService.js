import Groq from "groq-sdk";
import { getSystemPrompt } from "../prompts/systemPrompts";

// Inisialisasi Groq client
// dangerouslyAllowBrowser: true diperlukan karena kita memanggil API dari browser (client-side)
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Menjalankan Lumi AI Agent dengan mode dan input tertentu.
 * @param {string} mode - Salah satu dari: 'RESEARCH', 'EXPLAIN', 'PORTFOLIO', 'TRANSLATE'
 * @param {string} userInput - Teks perintah dari user
 * @returns {Promise<string>} - Output teks dari model AI
 * @throws {Error} - Jika API key tidak ada, atau API call gagal
 */
export async function runLumiAgent(mode, userInput) {
  // Validasi: pastikan API key tersedia
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    throw new Error(
      "GROQ API Key tidak ditemukan. Pastikan file .env sudah dikonfigurasi dengan benar.",
    );
  }

  // Validasi: pastikan input tidak kosong
  if (!userInput || userInput.trim() === "") {
    throw new Error("Input tidak boleh kosong.");
  }

  // Validasi: pastikan mode valid
  const validModes = ["RESEARCH", "EXPLAIN", "PORTFOLIO", "TRANSLATE"];
  if (!validModes.includes(mode)) {
    throw new Error(
      `Mode tidak valid: ${mode}. Mode yang tersedia: ${validModes.join(", ")}`,
    );
  }

  const systemPrompt = getSystemPrompt(mode);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const result = response.choices[0]?.message?.content;

  if (!result) {
    throw new Error("Model tidak menghasilkan output. Coba lagi.");
  }

  return result;
}
