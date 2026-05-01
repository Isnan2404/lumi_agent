import Groq from "groq-sdk";
import { getSystemPrompt } from "../prompts/systemPrompts";
import { formatPrice, formatCurrency } from "./coinGeckoService";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Menjalankan Lumi AI Agent.
 * @param {string} mode - 'RESEARCH' | 'EXPLAIN' | 'PORTFOLIO' | 'TRANSLATE'
 * @param {string} userInput - Teks perintah dari user
 * @param {Object|null} liveData - Data live dari CoinGecko (opsional, hanya untuk RESEARCH)
 * @returns {Promise<string>} - Output teks markdown dari model AI
 */
export async function runLumiAgent(mode, userInput, liveData = null) {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    throw new Error("GROQ API Key tidak ditemukan. Pastikan file .env sudah dikonfigurasi.");
  }
  if (!userInput || userInput.trim() === '') {
    throw new Error("Input tidak boleh kosong.");
  }

  const validModes = ['RESEARCH', 'EXPLAIN', 'PORTFOLIO', 'TRANSLATE'];
  if (!validModes.includes(mode)) {
    throw new Error(`Mode tidak valid: ${mode}`);
  }

  const systemPrompt = getSystemPrompt(mode);

  // Jika mode RESEARCH dan ada liveData, inject data live ke user message
  let finalUserMessage = userInput;
  if (mode === 'RESEARCH' && liveData) {
    const liveContext = `
[LIVE MARKET DATA — gunakan data ini dalam report]
Coin: ${liveData.name} (${liveData.symbol?.toUpperCase()})
Current Price: ${formatPrice(liveData.current_price)}
Market Cap: ${formatCurrency(liveData.market_cap)} (Rank #${liveData.market_cap_rank})
24h Volume: ${formatCurrency(liveData.total_volume)}
24h Change: ${liveData.price_change_percentage_24h?.toFixed(2)}%
7d Change: ${liveData.price_change_percentage_7d_in_currency?.toFixed(2) ?? 'N/A'}%
All Time High: ${formatPrice(liveData.ath)}

User request: ${userInput}
`;
    finalUserMessage = liveContext;
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: finalUserMessage },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const result = response.choices[0]?.message?.content;
  if (!result) throw new Error("Model tidak menghasilkan output. Coba lagi.");

  return result;
}
