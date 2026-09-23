import React from "react";
import MovieCard from "./MovieCard";
import { SearchX, Film } from "lucide-react";

/**
 * MovieGrid Component
 * Renders array of movies or skeleton placeholder cards when loading.
 */
export default function MovieGrid({
  movies,
  loading,
  favorites,
  toggleFavorite,
  onSelectMovie,
  lastMovieRef,
  searchQuery
}) {
  // Render loading skeleton grid if movies array is empty and loading is true
  if (loading && movies.length === 0) {
    return (
      <div className="movies-grid">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className="skeleton-card">
            <div className="skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  // Render empty state if not loading and no movies returned
  if (!loading && movies.length === 0) {
    return (
      <div className="empty-state">
        <SearchX className="empty-icon" />
        <h3 className="empty-title">No Movies Found</h3>
        <p className="empty-desc">
          {searchQuery
            ? `We couldn't find any results matching "${searchQuery}". Try searching for another movie title.`
            : "No media records available right now."}
        </p>
      </div>
    );
  }

  // Deduplicate movies by ID to avoid React key duplication
  const uniqueMovies = [];
  const seenIds = new Set();
  for (const m of movies) {
    if (m && m.id && !seenIds.has(m.id)) {
      seenIds.add(m.id);
      uniqueMovies.push(m);
    }
  }

  return (
    <div className="movies-grid">
      {uniqueMovies.map((movie, index) => {
        const isLast = index === uniqueMovies.length - 1;
        const isFav = favorites.some((f) => f.id === movie.id);

        return (
          <div
            key={`movie-${movie.id}-${index}`}
            ref={isLast ? lastMovieRef : null}
            style={{ height: "100%" }}
          >
            <MovieCard
              movie={movie}
              isFavorite={isFav}
              onToggleFavorite={toggleFavorite}
              onClickCard={onSelectMovie}
            />
          </div>
        );
      })}
    </div>
  );
}
