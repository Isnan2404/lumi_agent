# LUMI — Crypto Intelligence Agent 🤖📊

LUMI adalah AI Crypto Intelligence Agent interaktif yang dibangun khusus untuk **WealthyPeople.id Stage 2 Developer Recruitment Challenge**. 
Ditenagai oleh Groq API dengan model **LLaMA 3.3 70B**, Lumi dirancang untuk memberikan analisis riset, edukasi kripto, terjemahan jargon Web3, serta evaluasi portofolio dengan bahasa yang natural dan user-friendly (Mendukung Bilingual: ID/EN).

## 🌟 Fitur Utama (4 Mode AI)

LUMI beroperasi dengan 4 spesialisasi mode AI:

1. **🔍 RESEARCH:** Memberikan analisis fundamental koin/token secara mendalam, termasuk *use case*, kelebihan, risiko, hingga kalkulasi *Risk Level*.
2. **📖 EXPLAIN:** Menjelaskan konsep *Blockchain*, Web3, atau *DeFi* yang kompleks menjadi bahasa yang sangat mudah dimengerti, dilengkapi dengan analogi.
3. **📁 PORTFOLIO:** Mengevaluasi alokasi portofolio kripto yang kamu miliki, mengukur tingkat diversifikasi aset, memberikan *Risk Score*, dan memberikan analisis edukatif yang objektif.
4. **🔤 TRANSLATE:** Menerjemahkan berbagai jargon (*slang*) yang sering muncul di ekosistem kripto (seperti FOMO, DYOR, WAGMI, Rug Pull) menjadi bahasa awam.

## 🚀 Tech Stack

Aplikasi ini dibangun untuk mengedepankan performa cepat dan antarmuka *futuristik*, menggunakan teknologi berikut:

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v3 + Custom CSS Variables & Animations (Global Design System)
- **AI Engine:** Groq SDK (Model: `llama-3.3-70b-versatile`)
- **Renderer:** `react-markdown` (untuk merender output AI secara rapi)

## 💻 Cara Menjalankan Project (Local Development)

### 1. Prasyarat
Pastikan Anda sudah memiliki [Node.js](https://nodejs.org/) yang terinstal di komputer/laptop Anda.

### 2. Instalasi
Masuk ke direktori project, lalu jalankan perintah:
```bash
npm install
```

### 3. Konfigurasi Environment (API Key)
File `.env` tidak di-*commit* ke repositori demi keamanan. Oleh karena itu, pastikan membuat file bernama `.env` di *root* direktori proyek dan isikan Groq API Key Anda:
```env
VITE_GROQ_API_KEY=KODE_GROQ_API_ANDA_DI_SINI
```
*(Anda dapat memperoleh API Key secara gratis melalui [Groq Cloud Console](https://console.groq.com/))*

### 4. Jalankan Development Server
Setelah semua selesai, jalankan:
```bash
npm run dev
```
Buka browser dan navigasikan ke URL yang muncul di terminal (umumnya `http://localhost:5173/`).

---

### ⚠️ Disclaimer
**Semua output yang dihasilkan oleh platform Lumi murni bersifat edukatif. Lumi TIDAK memberikan saran keuangan, anjuran investasi, atau ajakan untuk membeli instrumen aset kripto manapun. Harap selalu lakukan riset pribadi secara mandiri (DYOR).**

---
*© 2026 | Built by Isnan Ridho Alamsyah for WealthyPeople.id Challenge*
