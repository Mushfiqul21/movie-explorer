"use client";

import type { Movie } from "@/lib/tmdb";
import { useFavorites } from "@/lib/favorites";

function Heart({ filled, small = false }: { filled: boolean; small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={small ? "h-[18px] w-[18px]" : "h-5 w-5"}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function FavoriteButton({
  movie,
  variant = "icon",
}: {
  movie: Movie;
  variant?: "icon" | "full";
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(movie.id);

  if (variant === "full") {
    return (
      <button
        onClick={() => toggle(movie)}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ring-1 transition ${
          active
            ? "bg-red-600/20 text-red-400 ring-red-500/50 hover:bg-red-600/30"
            : "bg-white/10 text-white ring-white/20 hover:bg-white/20"
        }`}
      >
        <Heart filled={active} />
        {active ? "Saved" : "Add to Favorites"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // the card is a link, so don't navigate
        e.stopPropagation();
        toggle(movie);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className={`absolute right-1.5 top-1.5 z-10 grid h-8 w-8 place-items-center transition duration-200 hover:scale-125 active:scale-90 ${
        active
          ? "text-[#ff4d6d] drop-shadow-[0_0_6px_rgba(255,77,109,0.6)]"
          : "text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] hover:text-[#ff4d6d]"
      }`}
    >
      <Heart filled={active} small />
    </button>
  );
}