"use client";

import { useState } from "react";
import type { Movie } from "@/lib/tmdb";
import MovieGrid from "./MovieGrid";

export default function LoadMoreGrid({
  initialMovies,
  type,
  genre,
  totalPages,
}: {
  initialMovies: Movie[];
  type: string;
  genre?: string;
  totalPages: number;
}) {
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const hasMore = page < Math.min(totalPages, 500);

  async function loadMore() {
    setLoading(true);
    setError(false);
    try {
const res = await fetch(
  `/api/movies?type=${type}&page=${page + 1}${genre ? `&genre=${genre}` : ""}`
);
      if (!res.ok) throw new Error("Request failed");
      const data: { results: Movie[] } = await res.json();

      // Skip duplicates (TMDB lists can shift between requests)
      setMovies((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...data.results.filter((m) => !seen.has(m.id))];
      });
      setPage((p) => p + 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MovieGrid movies={movies} />

      <div className="mt-12 flex flex-col items-center gap-3">
        {error && (
          <p className="text-sm text-red-400">
            Could not load more movies. Please try again.
          </p>
        )}

        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-red-600 hover:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {loading ? "Loading..." : "Load More"}
          </button>
        ) : (
          <p className="text-sm text-neutral-500">You've reached the end 🎬</p>
        )}
      </div>
    </>
  );
}