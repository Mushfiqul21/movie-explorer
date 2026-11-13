const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
};

export type Genre = { id: number; name: string };

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type Video = {
  key: string;
  site: string;
  type: string;
  official: boolean;
  name: string;
};

export type MovieDetails = Movie & {
  tagline: string;
  runtime: number | null;
  status: string;
  genres: Genre[];
  credits: { cast: CastMember[] };
  similar: { results: Movie[] };
  videos: { results: Video[] };
};

export class TMDBError extends Error {
  status: number;
  constructor(status: number) {
    super(`TMDB error: ${status}`);
    this.status = status;
  }
}

export async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const query = new URLSearchParams({ language: "en-US", ...params });

  const res = await fetch(`${BASE_URL}${endpoint}?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      accept: "application/json",
    },
    next: { revalidate: 3600 }, // ISR: cache for 1 hour
  });

  if (!res.ok) {
    throw new TMDBError(res.status);
  }

  return res.json();
}

export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    // One request returns details + cast + similar + videos
    return await tmdbFetch<MovieDetails>(`/movie/${id}`, {
      append_to_response: "credits,similar,videos",
    });
  } catch (error) {
    if (error instanceof TMDBError && error.status === 404) return null;
    throw error;
  }
}

export function getImageUrl(path: string | null, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "/no-poster.png";
}

export function formatRuntime(minutes: number | null) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export const CATEGORIES = [
  { key: "trending", label: "Trending", endpoint: "/trending/movie/week" },
  { key: "top_rated", label: "Top Rated", endpoint: "/movie/top_rated" },
  { key: "popular", label: "Popular", endpoint: "/movie/popular" },
  { key: "upcoming", label: "Upcoming", endpoint: "/movie/upcoming" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function isCategoryKey(value: string | undefined): value is CategoryKey {
  return CATEGORIES.some((c) => c.key === value);
}

type MoviesResponse = {
  results: Movie[];
  page: number;
  total_pages: number;
};

export async function getMovies(type: CategoryKey, page = 1, genre?: string) {
  // With a genre selected, use TMDB's discover endpoint
  if (genre) {
    const params: Record<string, string> = {
      page: String(page),
      with_genres: genre,
      include_adult: "false",
      sort_by: "popularity.desc",
    };

    if (type === "top_rated") {
      params.sort_by = "vote_average.desc";
      params["vote_count.gte"] = "300"; // avoid movies with just a few votes
    } else if (type === "upcoming") {
      params.sort_by = "primary_release_date.asc";
      params["primary_release_date.gte"] = new Date()
        .toISOString()
        .slice(0, 10);
    }

    return tmdbFetch<MoviesResponse>("/discover/movie", params);
  }

  const category = CATEGORIES.find((c) => c.key === type)!;
  return tmdbFetch<MoviesResponse>(category.endpoint, {
    page: String(page),
  });
}

export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
  return data.genres;
}

// Builds /?type=popular&genre=28 (skips defaults to keep URLs clean)
export function buildHomeUrl(type: CategoryKey, genre?: string) {
  const params = new URLSearchParams();
  if (type !== "trending") params.set("type", type);
  if (genre) params.set("genre", genre);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export async function getTrailerKey(id: number): Promise<string | null> {
  try {
    const data = await tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`);
    const trailer =
      data.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
      ) ?? data.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
    return trailer?.key ?? null;
  } catch {
    return null;
  }
}