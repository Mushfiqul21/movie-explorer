"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";

export default function FavoritesLink() {
  const { favorites, hydrated } = useFavorites();

  return (
    <Link
      href="/favorites"
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
    >
      Favorites
      {hydrated && favorites.length > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
          {favorites.length}
        </span>
      )}
    </Link>
  );
}