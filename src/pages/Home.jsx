import React, { useState, useEffect, useRef, useCallback } from "react";
import MovieGrid from "../components/MovieGrid";
import MovieModal from "../components/MovieModal";
import { fetchMovies } from "../services/tmdbApi";
import { Sparkles, Loader2, Info } from "lucide-react";

export default function Home({
  searchQuery,
  aiRecommendation,
  onClearAiRecommendation,
  favorites,
  toggleFavorite
}) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("popular"); // 'popular', 'top_rated', 'trending'
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const observerRef = useRef(null);
  const activeAbortControllerRef = useRef(null);

  // Fetch movies helper with AbortController cancellation
  const fetchMoviesData = async (pageNum, query = "", cat = "popular", isNewSearch = false) => {
    // Abort pending request if any
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    try {
      setLoading(true);
      const data = await fetchMovies({
        page: pageNum,
        query: query,
        category: cat,
        signal: abortController.signal
      });

      setIsFallbackMode(data.isFallback);
      const newResults = data.results || [];

      setMovies((prev) => {
        if (pageNum === 1 || isNewSearch) {
          return newResults;
        }
        // Deduplicate and append Page N+1 payload
        const existingIds = new Set(prev.map((m) => m.id));
        const filteredNew = newResults.filter((m) => !existingIds.has(m.id));
        return [...prev, ...filteredNew];
      });

      setHasMore(pageNum < data.total_pages && newResults.length > 0);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Home fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset page and fetch when searchQuery or category changes
  useEffect(() => {
    setPage(1);
    fetchMoviesData(1, searchQuery, category, true);
  }, [searchQuery, category]);

  // Load next page on page state increment (Infinite Scroll)
  useEffect(() => {
    if (page > 1) {
      fetchMoviesData(page, searchQuery, category, false);
    }
  }, [page]);

  // Infinite Scroll Trigger via Intersection Observer
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: "200px" } // Trigger 200px before reaching bottom
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="main-content">
      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <div className="ai-banner">
          <div className="ai-banner-info">
            <div className="ai-icon-box">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="ai-banner-title">
                AI Mood Match Recommendation: "{aiRecommendation.title}"
              </div>
              <div className="ai-banner-sub">
                Based on your prompt: "{aiRecommendation.prompt}"
              </div>
            </div>
          </div>
          <button className="ai-clear-btn" onClick={onClearAiRecommendation}>
            Clear AI Filter
          </button>
        </div>
      )}

      {/* Notice if running in fallback mode without API Key */}
      {isFallbackMode && (
        <div
          style={{
            background: "rgba(255, 184, 0, 0.1)",
            border: "1px solid rgba(255, 184, 0, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            fontSize: "0.85rem",
            color: "var(--color-star)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Info size={18} />
          Running in offline demo mode. Click Settings icon in header to insert your TMDB API Key.
        </div>
      )}

      {/* Category Filter Tabs (Only shown when not searching) */}
      {!searchQuery && (
        <div className="filter-tabs">
          <button
            className={`tab-btn ${category === "popular" ? "active" : ""}`}
            onClick={() => setCategory("popular")}
          >
            🔥 Popular
          </button>
          <button
            className={`tab-btn ${category === "top_rated" ? "active" : ""}`}
            onClick={() => setCategory("top_rated")}
          >
            ⭐ Top Rated
          </button>
          <button
            className={`tab-btn ${category === "trending" ? "active" : ""}`}
            onClick={() => setCategory("trending")}
          >
            📈 Trending Today
          </button>
        </div>
      )}

      {/* Section Title */}
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : category === "top_rated"
          ? "Top Rated Movies"
          : category === "trending"
          ? "Trending Movies"
          : "Popular Movies Stream"}
      </h2>

      {/* Movies Grid Component */}
      <MovieGrid
        movies={movies}
        loading={loading && movies.length === 0}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
        lastMovieRef={lastMovieElementRef}
        searchQuery={searchQuery}
      />

      {/* Infinite Scroll Hydration Loader */}
      {loading && movies.length > 0 && (
        <div className="infinite-scroll-loader">
          <div className="spinner"></div>
          <span>Hydrating media records (Page {page})...</span>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={favorites.some((f) => f.id === selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
