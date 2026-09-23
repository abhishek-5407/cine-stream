import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

/**
 * Get active TMDB API Key from localStorage or environment variables
 */
export function getApiKey() {
  const localKey = localStorage.getItem("cinestream_tmdb_key");
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return import.meta.env.VITE_TMDB_API_KEY || "";
}

/**
 * Helper to build poster image URL with fallback
 */
export function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  if (posterPath.startsWith("http")) return posterPath;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

/**
 * Helper to build backdrop image URL with fallback
 */
export function getBackdropUrl(backdropPath) {
  if (!backdropPath) return null;
  if (backdropPath.startsWith("http")) return backdropPath;
  return `${TMDB_BACKDROP_BASE}${backdropPath}`;
}

/**
 * Curated fallback movies for zero-downtime offline/no-key evaluation
 */
const MOCK_MOVIES = [
  {
    id: 939243,
    title: "Sonic the Hedgehog 3",
    overview: "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they've faced before.",
    poster_path: "https://image.tmdb.org/t/p/w500/d8Ryb8AunYAuycVKDp5H9W6o84z.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/zOpe0eHvdNzT2vf6on9t2zV4evW.jpg",
    release_date: "2024-12-19",
    vote_average: 7.8,
    vote_count: 1420,
    genre_ids: [28, 878, 35, 10751]
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    poster_path: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1jv8uaC.jpg",
    release_date: "2024-07-24",
    vote_average: 7.7,
    vote_count: 5800,
    genre_ids: [28, 35, 878]
  },
  {
    id: 1184918,
    title: "The Wild Robot",
    overview: "After a shipwreck, an intelligent robot named Roz is stranded on an uninhabited island and must learn to adapt to the harsh surroundings, gradually bonding with the island's animals and adopting an orphaned gosling.",
    poster_path: "https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrPieufVv0B90.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/mQZJoIhTEkNhCYeq0BCzmy9rjh8.jpg",
    release_date: "2024-09-12",
    vote_average: 8.4,
    vote_count: 3890,
    genre_ids: [16, 878, 10751]
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 5300,
    genre_ids: [878, 12]
  },
  {
    id: 872585,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 8900,
    genre_ids: [18, 36]
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 35000,
    genre_ids: [12, 18, 878]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
    poster_path: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36000,
    genre_ids: [28, 878, 12]
  },
  {
    id: 550,
    title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster_path: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 29000,
    genre_ids: [18]
  }
];

/**
 * Fetch movies with query or type (popular, top_rated, trending)
 * Includes pagination support and abort signal for debounced search cancellation
 */
export async function fetchMovies({ page = 1, query = "", category = "popular", signal = null }) {
  const apiKey = getApiKey();

  // If no API key is provided, use mock dataset enriched with mock pagination
  if (!apiKey) {
    console.warn("Cine-Stream Notice: No TMDB API key detected. Using fallback media records.");
    let filtered = MOCK_MOVIES;
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q));
    }
    return {
      results: filtered,
      page: 1,
      total_pages: 1,
      total_results: filtered.length,
      isFallback: true
    };
  }

  try {
    let url = "";
    const params = {
      api_key: apiKey,
      page: page,
      language: "en-US",
      include_adult: false
    };

    if (query && query.trim()) {
      url = `${TMDB_BASE_URL}/search/movie`;
      params.query = query.trim();
    } else if (category === "top_rated") {
      url = `${TMDB_BASE_URL}/movie/top_rated`;
    } else if (category === "trending") {
      url = `${TMDB_BASE_URL}/trending/movie/day`;
    } else {
      url = `${TMDB_BASE_URL}/movie/popular`;
    }

    const response = await axios.get(url, { params, signal });
    return {
      results: response.data.results || [],
      page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_results: response.data.total_results || 0,
      isFallback: false
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error; // Let caller handle request aborts
    }
    console.error("TMDB API Fetch Error:", error);

    // Provide friendly fallback if network fails or API key is invalid
    let filtered = MOCK_MOVIES;
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(q));
    }
    return {
      results: filtered,
      page: 1,
      total_pages: 1,
      total_results: filtered.length,
      isFallback: true,
      error: error.response?.data?.status_message || error.message
    };
  }
}

/**
 * Fetch detailed movie information including trailer videos
 */
export async function fetchMovieDetails(movieId) {
  const apiKey = getApiKey();
  if (!apiKey) {
    const found = MOCK_MOVIES.find(m => m.id === Number(movieId)) || MOCK_MOVIES[0];
    return {
      ...found,
      runtime: 125,
      genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }],
      tagline: "The world's greatest hero returns.",
      videos: { results: [{ key: "dQw4w9WgXcQ", site: "YouTube", type: "Trailer" }] }
    };
  }

  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
        append_to_response: "videos,similar"
      }
    });
    return response.data;
  } catch (error) {
    console.error("TMDB Movie Details Error:", error);
    const found = MOCK_MOVIES.find(m => m.id === Number(movieId)) || MOCK_MOVIES[0];
    return found;
  }
}
