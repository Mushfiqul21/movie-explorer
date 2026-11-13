import Image from "next/image";
import Link from "next/link";
import { Movie, getImageUrl } from "@/lib/tmdb";
import FavoriteButton from "./FavoriteButton";

export default function MovieCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.slice(0, 4) || "N/A";

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative block overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-600/20 hover:ring-red-500/50"
    >
      <div className="relative aspect-[2/3] w-full">
        {movie.poster_path ? (
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center bg-neutral-800 p-4 text-center text-sm text-neutral-500">
            No poster available
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-md">
          ★ {movie.vote_average.toFixed(1)}
              </div>
                      <FavoriteButton movie={movie} />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
          <p className="line-clamp-4 text-xs leading-relaxed text-neutral-200">
            {movie.overview || "No overview available."}
          </p>
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-white">
          {movie.title}
        </h3>
        <p className="mt-0.5 text-xs text-neutral-400">{year}</p>
      </div>
    </Link>
  );
}