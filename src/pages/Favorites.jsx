import React, { useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { Heart, Trash2, ArrowLeft, Search } from "lucide-react";

export default function Favorites({ favorites, toggleFavorite, onClearAllFavorites }) {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Filter local favorites array
  const filteredFavorites = favorites.filter((movie) =>
    movie.title.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  return (
    <div className="main-content">
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem"
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.9rem",
              marginBottom: "0.5rem"
            }}
          >
            <ArrowLeft size={16} /> Back to Discover
          </Link>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Heart fill="#e50914" color="#e50914" size={28} /> My Saved Favorites ({favorites.length})
          </h1>
        </div>

        {favorites.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Local Search Filter */}
            <div className="search-input-wrapper" style={{ width: "240px" }}>
              <input
                type="text"
                placeholder="Filter favorites..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="search-input"
                style={{ padding: "0.5rem 1rem 0.5rem 2.2rem", fontSize: "0.85rem" }}
              />
              <Search className="search-icon" size={15} style={{ left: "0.75rem" }} />
            </div>

            {/* Clear All Button */}
            <button
              className="btn btn-secondary"
              onClick={onClearAllFavorites}
              title="Clear all saved favorites"
              style={{ color: "#f87171", borderColor: "rgba(248, 113, 113, 0.3)" }}
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="empty-state">
          <Heart className="empty-icon" style={{ color: "var(--color-primary)" }} />
          <h3 className="empty-title">Your Favorites List is Empty</h3>
          <p className="empty-desc">
            You haven't saved any movies yet. Click the heart icon on any movie card while browsing to add it here.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Popular Movies
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="empty-state">
          <Search className="empty-icon" />
          <h3 className="empty-title">No Matching Favorites</h3>
          <p className="empty-desc">
            No saved movies match your search term "{filterQuery}".
          </p>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="movies-grid">
          {filteredFavorites.map((movie) => (
            <MovieCard
              key={`fav-${movie.id}`}
              movie={movie}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onClickCard={(m) => setSelectedMovie(m)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
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
