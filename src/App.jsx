import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MoodMatcherModal from "./components/MoodMatcherModal";
import ApiKeyModal from "./components/ApiKeyModal";
import useDebounce from "./hooks/useDebounce";

export default function App() {
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);

  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("cinestream_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cinestream_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleClearAllFavorites = () => {
    if (window.confirm("Are you sure you want to remove all saved favorites?")) {
      setFavorites([]);
    }
  };

  const handleApplyAiMovie = (recommendedTitle, promptText) => {
    setSearchVal(recommendedTitle);
    setAiRecommendation({
      title: recommendedTitle,
      prompt: promptText
    });
  };

  const handleClearAiRecommendation = () => {
    setAiRecommendation(null);
    setSearchVal("");
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          searchVal={searchVal}
          onSearchChange={setSearchVal}
          favoritesCount={favorites.length}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        <main style={{ minHeight: "calc(100vh - 72px)" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  searchQuery={debouncedSearchVal}
                  aiRecommendation={aiRecommendation}
                  onClearAiRecommendation={handleClearAiRecommendation}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  onClearAllFavorites={handleClearAllFavorites}
                />
              }
            />
          </Routes>
        </main>

        <footer
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            color: "var(--text-subtle)",
            fontSize: "0.85rem",
            borderTop: "1px solid var(--border-color)",
            marginTop: "3rem"
          }}
        >
          <p>© {new Date().getFullYear()} Cine-Stream. Built with React, Vite & TMDB / Gemini API.</p>
        </footer>

        {/* Modals */}
        <MoodMatcherModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onApplyAiMovie={handleApplyAiMovie}
        />

        <ApiKeyModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onKeysSaved={() => {
            // Trigger refresh if needed
            window.location.reload();
          }}
        />
      </div>
    </Router>
  );
}
