"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import MovieGrid from "./MovieGrid";

export default function FavoritesView() {
  const { favorites, hydrated, clear } = useFavorites();

  // Skeleton until localStorage has been read (prevents an "empty" flash)
  if (!hydrated) {
    return (
      <div className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-center">
        <div>
          <p className="text-5xl">💔</p>
          <h2 className="mt-4 text-xl font-bold text-white">
            No favorites yet
          </h2>
          <p className="mt-2 text-neutral-400">
            Tap the heart on any movie to save it here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-neutral-400">
          {favorites.length} saved {favorites.length === 1 ? "movie" : "movies"}
        </p>
        <button
          onClick={clear}
          className="rounded-full px-4 py-2 text-sm font-medium text-neutral-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          Clear all
        </button>
      </div>
      <MovieGrid movies={favorites} />
    </>
  );
}