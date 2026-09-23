import React, { useState, useEffect } from "react";
import { X, Star, Heart, Calendar, Clock, Play, Film, Tv, Video, RotateCcw } from "lucide-react";
import { getBackdropUrl, getPosterUrl, fetchMovieDetails } from "../services/tmdbApi";

export default function MovieModal({ movie, onClose, isFavorite, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePlayer, setActivePlayer] = useState(null); // null | 'trailer' | 'stream'

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (movie && movie.id) {
        setLoading(true);
        const data = await fetchMovieDetails(movie.id);
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [movie]);

  if (!movie) return null;

  const currentData = details || movie;
  const backdropUrl = getBackdropUrl(currentData.backdrop_path);
  const posterUrl = getPosterUrl(currentData.poster_path);
  const releaseYear = currentData.release_date ? currentData.release_date.split("-")[0] : "N/A";
  const ratingFormatted = currentData.vote_average ? currentData.vote_average.toFixed(1) : "NR";

  // Find trailer video if available
  const trailerVideo = details?.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  ) || details?.videos?.results?.[0];

  const youtubeEmbedUrl = trailerVideo?.key
    ? `https://www.youtube-nocookie.com/embed/${trailerVideo.key}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(movie.title + " official trailer")}&autoplay=1`;

  // Streaming player embed (VidSrc / AutoEmbed)
  const streamEmbedUrl = `https://vidsrc.to/embed/movie/${movie.id}`;

  const handleStartTrailer = (e) => {
    e && e.preventDefault();
    setActivePlayer("trailer");
  };

  const handleStartStream = (e) => {
    e && e.preventDefault();
    setActivePlayer("stream");
  };

  const handleClosePlayer = () => {
    setActivePlayer(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Video Player or Hero Backdrop Header */}
        {activePlayer ? (
          <div>
            {/* Player Switcher Bar */}
            <div className="player-controls-bar">
              <div className="player-tabs">
                <button
                  type="button"
                  className={`player-tab-btn ${activePlayer === "trailer" ? "active" : ""}`}
                  onClick={() => setActivePlayer("trailer")}
                >
                  <Video size={14} /> Official Trailer
                </button>
                <button
                  type="button"
                  className={`player-tab-btn ${activePlayer === "stream" ? "active" : ""}`}
                  onClick={() => setActivePlayer("stream")}
                >
                  <Tv size={14} /> Stream Movie
                </button>
              </div>
              <button type="button" className="player-close-btn" onClick={handleClosePlayer}>
                <RotateCcw size={14} /> Back to Overview
              </button>
            </div>

            {/* Embedded Iframe Player */}
            <div className="modal-player-wrapper">
              {activePlayer === "trailer" ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={`${movie.title} Trailer`}
                  className="modal-player-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <iframe
                  src={streamEmbedUrl}
                  title={`${movie.title} Stream`}
                  className="modal-player-iframe"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        ) : (
          <div
            className="modal-backdrop-hero"
            style={{
              backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
              backgroundColor: "#0f172a"
            }}
          >
            <div className="modal-backdrop-overlay"></div>

            {/* Big Center Play Trailer Button */}
            <div className="hero-play-overlay" onClick={handleStartTrailer}>
              <button type="button" className="hero-play-btn" aria-label="Play Trailer">
                <Play size={30} fill="#ffffff" />
              </button>
              <span className="hero-play-text">Click to Play Trailer</span>
            </div>
          </div>
        )}

        {/* Modal Main Content Body */}
        <div className="modal-body" style={activePlayer ? { marginTop: "1rem" } : {}}>
          <div className="modal-header-row">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="modal-poster" />
            ) : (
              <div className="modal-poster poster-placeholder">
                <Film size={32} />
              </div>
            )}

            <div className="modal-meta-content">
              <h2 className="modal-title">{movie.title}</h2>
              {details?.tagline && (
                <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  "{details.tagline}"
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", margin: "0.5rem 0" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--color-star)", fontWeight: 700 }}>
                  <Star size={16} fill="#ffb800" color="#ffb800" /> {ratingFormatted} ({currentData.vote_count || 0})
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  <Calendar size={15} /> {releaseYear}
                </span>
                {details?.runtime && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <Clock size={15} /> {details.runtime} mins
                  </span>
                )}
              </div>

              {/* Genre Pills */}
              {details?.genres && details.genres.length > 0 && (
                <div className="genre-pills">
                  {details.genres.map((g) => (
                    <span key={g.id} className="genre-pill">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="modal-overview">
            {currentData.overview || "No overview available for this media title."}
          </p>

          {/* Actions Bar */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
            <button
              type="button"
              onClick={handleStartTrailer}
              className="btn btn-primary"
            >
              <Play size={18} fill="#ffffff" /> Watch Trailer
            </button>
            <button
              type="button"
              onClick={handleStartStream}
              className="btn btn-ai"
            >
              <Tv size={18} /> Watch Now (Stream)
            </button>
            <button
              type="button"
              className={`btn ${isFavorite ? "btn-primary" : "btn-secondary"}`}
              onClick={() => onToggleFavorite(movie)}
              style={isFavorite ? { backgroundColor: "#e50914" } : {}}
            >
              <Heart size={18} fill={isFavorite ? "#ffffff" : "none"} />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
