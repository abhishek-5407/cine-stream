import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Film, Search, X, Sparkles, Heart, Settings } from "lucide-react";

export default function Navbar({
  searchVal,
  onSearchChange,
  favoritesCount,
  onOpenAiModal,
  onOpenSettingsModal
}) {
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";

  return (
    <header className="navbar">
      <div className="nav-content">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <Film className="brand-icon" size={28} />
          <span className="brand-text">Cine-Stream</span>
          <span className="brand-badge">PRO</span>
        </Link>

        {/* Search Input Bar (Hidden on Favorites page for clean UX) */}
        {!isFavoritesPage && (
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search movies (500ms debounced)..."
                value={searchVal}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
                aria-label="Search movies"
              />
              <Search className="search-icon" size={18} />
              {searchVal && (
                <button
                  className="search-clear-btn"
                  onClick={() => onSearchChange("")}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="nav-actions">
          {/* AI Mood Matcher Button */}
          <button
            className="btn btn-ai"
            onClick={onOpenAiModal}
            title="AI Mood Matcher"
          >
            <Sparkles size={17} />
            <span className="nav-btn-text">AI Mood Matcher</span>
          </button>

          {/* Favorites Page Navigation Link */}
          <Link
            to={isFavoritesPage ? "/" : "/favorites"}
            className={`btn ${isFavoritesPage ? "btn-primary" : "btn-secondary"} nav-link-btn`}
            title={isFavoritesPage ? "Discover Movies" : "Favorites"}
          >
            <Heart size={17} fill={isFavoritesPage ? "#ffffff" : "none"} />
            <span className="nav-btn-text">{isFavoritesPage ? "Discover" : "Favorites"}</span>
            <span className="badge-count">{favoritesCount}</span>
          </Link>

          {/* API Key Settings Button */}
          <button
            className="btn btn-secondary"
            onClick={onOpenSettingsModal}
            title="API Settings"
            style={{ padding: "0.65rem 0.85rem" }}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
