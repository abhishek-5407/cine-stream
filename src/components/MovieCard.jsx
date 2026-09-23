import React, { useState } from "react";
import { Star, Heart, Film, Calendar } from "lucide-react";
import { getPosterUrl } from "../services/tmdbApi";

/**
 * MovieCard Component
 * Displays poster (lazy-loaded), title, release year, star rating, and interactive Heart button.
 */
export default function MovieCard({ movie, isFavorite, onToggleFavorite, onClickCard }) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const ratingFormatted = movie.vote_average ? movie.vote_average.toFixed(1) : "NR";

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Prevent opening modal
    onToggleFavorite(movie);
  };

  return (
    <div className="movie-card" onClick={() => onClickCard && onClickCard(movie)}>
      <div className="poster-wrapper">
        {/* Rating Badge */}
        <div className="rating-badge">
          <Star size={13} fill="#ffb800" color="#ffb800" />
          <span>{ratingFormatted}</span>
        </div>

        {/* Heart Favorite Button */}
        <button
          className={`heart-btn ${isFavorite ? "active" : ""}`}
          onClick={handleHeartClick}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart size={18} fill={isFavorite ? "#ffffff" : "none"} color="#ffffff" />
        </button>

        {/* Lazy Loaded Poster Image or SVG Fallback */}
        {posterUrl && !imgError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className="movie-poster"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="poster-placeholder">
            <Film size={40} />
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{movie.title}</span>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <div className="movie-meta">
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Calendar size={13} /> {releaseYear}
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
            {movie.vote_count ? `${movie.vote_count} votes` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
