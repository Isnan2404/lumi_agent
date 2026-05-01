/**
 * coinGeckoService.js
 * Semua fungsi fetch data crypto dari CoinGecko & Fear/Greed API.
 * Tidak memerlukan API key. Rate limit CoinGecko: 30 req/menit.
 * Selalu gunakan try/catch di pemanggil — jika API gagal, lanjut tanpa data.
 */

const BASE = "https://api.coingecko.com/api/v3";

// Mapping keyword input user → CoinGecko coin ID
export const COIN_IDS = {
  bitcoin:   "bitcoin",
  btc:       "bitcoin",
  ethereum:  "ethereum",
  eth:       "ethereum",
  solana:    "solana",
  sol:       "solana",
  chainlink: "chainlink",
  link:      "chainlink",
  cardano:   "cardano",
  ada:       "cardano",
  polkadot:  "polkadot",
  dot:       "polkadot",
  bnb:       "binancecoin",
  xrp:       "ripple",
  avalanche: "avalanche-2",
  avax:      "avalanche-2",
};

/**
 * Fetch harga semua coin untuk LiveTicker.
 * @returns {Promise<Object>} - Object berisi data harga per coin ID
 */
export async function fetchTickerPrices() {
  const ids = [...new Set(Object.values(COIN_IDS))].join(",");
  const res = await fetch(
    `${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  return res.json();
}

/**
 * Fetch data detail satu coin untuk RESEARCH live data block.
 * @param {string} coinName - Nama atau ticker coin (contoh: "bitcoin", "btc")
 * @returns {Promise<Object|null>} - Data coin atau null jika tidak ditemukan
 */
export async function fetchCoinData(coinName) {
  const id = COIN_IDS[coinName.toLowerCase()];
  if (!id) return null;
  const res = await fetch(
    `${BASE}/coins/markets?vs_currency=usd&ids=${id}&sparkline=false&price_change_percentage=7d`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return data[0] || null;
}

/**
 * Deteksi nama coin dari teks input user.
 * @param {string} input - Teks input user
 * @returns {string|null} - Keyword coin pertama yang ditemukan, atau null
 */
export function detectCoinFromInput(input) {
  const lower = input.toLowerCase();
  for (const keyword of Object.keys(COIN_IDS)) {
    if (lower.includes(keyword)) return keyword;
  }
  return null;
}

/**
 * Fetch Fear & Greed Index saat ini.
 * @returns {Promise<Object>} - { value, value_classification, timestamp }
 */
export async function fetchFearGreed() {
  const res = await fetch("https://api.alternative.me/fng/?limit=1");
  if (!res.ok) throw new Error(`Fear/Greed API error: ${res.status}`);
  const data = await res.json();
  return data.data[0];
}

/**
 * Format angka menjadi currency string yang ringkas.
 * Contoh: 1200000000000 → "$1.2T"
 * @param {number} num
 * @returns {string}
 */
export function formatCurrency(num) {
  if (!num) return "N/A";
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  if (num >= 1_000_000_000)     return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000)         return `$${(num / 1_000_000).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

/**
 * Format harga dengan 2 desimal dan tanda $.
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (!price) return "N/A";
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
