"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Movie } from "@/lib/tmdb";

const KEY = "movie-explorer:favorites";
const EMPTY: Movie[] = [];

let cache: Movie[] = EMPTY;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): Movie[] {
  const raw = localStorage.getItem(KEY);
  if (raw === cacheRaw) return cache; // same reference = no extra re-renders
  cacheRaw = raw;
  try {
    cache = raw ? (JSON.parse(raw) as Movie[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Movie[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return; // storage full or blocked
  }
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback); // sync across browser tabs
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);

  // false on the server and during hydration, true afterwards
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const toggle = useCallback((movie: Movie) => {
    const current = read();
    if (current.some((m) => m.id === movie.id)) {
      write(current.filter((m) => m.id !== movie.id));
    } else {
      // Save only what the cards need, to keep storage small
      const { id, title, overview, poster_path, backdrop_path, vote_average, release_date } = movie;
      write([
        { id, title, overview, poster_path, backdrop_path, vote_average, release_date },
        ...current,
      ]);
    }
  }, []);

  const clear = useCallback(() => write([]), []);

  return { favorites, hydrated, isFavorite, toggle, clear };
}