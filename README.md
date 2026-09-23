# 🎬 Cine-Stream — Next-Gen Media Discovery & Streaming Explorer

A production-grade, responsive commercial media discovery web application built with **React**, **Vite**, **TMDB API**, and **Google Gemini AI**.

---

## ✨ Features

- **🔍 500ms Debounced Instant Search:** Real-time search with automatic request cancellation (`AbortController`) to save API quotas and avoid race conditions.
- **📜 Infinite Scroll Hydration:** Smooth pagination powered by the native `IntersectionObserver` API.
- **🤖 AI Mood Matcher (Google Gemini):** Describe your mood or select a curated prompt, and Gemini AI will recommend the exact movie match.
- **🎬 In-Modal Video Player:** Watch official YouTube trailers or stream movies directly inside the app with zero external redirects.
- **❤️ Local Favorites Manager:** Save and filter favorite movies with local `localStorage` persistence.
- **📱 Fully Responsive Design:** Custom dark Obsidian & Crimson theme tailored for **Mobile**, **Tablet**, **Laptop**, and **4K Ultra-Wide Desktops**.
- **⚡ Fallback Offline Mode:** Curated offline datasets with verified HD posters ensuring 100% uptime even if API limits are reached.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, React Router DOM v6
- **Styling:** Vanilla CSS (Custom Design System with Glassmorphism & Micro-animations)
- **Icons:** Lucide React
- **APIs:** The Movie Database (TMDB) REST API v3, Google Gemini REST API v1beta
- **HTTP Client:** Axios

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd cine-stream
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
# TMDB API Key (Get free key from developer.themoviedb.org)
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Google Gemini API Key (Optional for AI Mood Matcher from aistudio.google.com)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
cine-stream/
├── public/
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx       # In-app API Key settings modal
│   │   ├── MoodMatcherModal.jsx  # AI Mood Matcher prompt modal
│   │   ├── MovieCard.jsx         # Card component with rating & favorites
│   │   ├── MovieGrid.jsx         # Dynamic CSS Grid with skeleton shimmer
│   │   ├── MovieModal.jsx        # Detail view with embedded video player
│   │   └── Navbar.jsx            # Responsive header with search & actions
│   ├── hooks/
│   │   └── useDebounce.js        # Debounce hook for instant search
│   ├── pages/
│   │   ├── Home.jsx              # Main feed with categories & infinite scroll
│   │   └── Favorites.jsx         # Saved favorites page with search filter
│   ├── services/
│   │   ├── geminiService.js      # Google Gemini API client
│   │   └── tmdbApi.js            # TMDB API client with offline fallback
│   ├── App.jsx                   # Main layout and routing
│   ├── index.css                 # Obsidian & Crimson Design System
│   └── main.jsx                  # React application entry point
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 📜 License
MIT License. Built for commercial evaluation and learning.
