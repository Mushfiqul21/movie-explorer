import Image from "next/image";
import Link from "next/link";
import { Movie, getImageUrl } from "@/lib/tmdb";
import TrailerButton from "./TrailerButton";

export default function Hero({
  movie,
  trailerKey,
}: {
  movie: Movie;
  trailerKey: string | null;
}) {
  const year = movie.release_date?.slice(0, 4);

  return (
    <section className="relative mb-12 min-h-[420px] overflow-hidden rounded-3xl ring-1 ring-white/10 sm:min-h-[520px]">
      <Image
        src={getImageUrl(movie.backdrop_path, "w1280")}
        alt=""
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover"
      />

      {/* Gradients for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

      <div className="relative flex min-h-[420px] max-w-2xl flex-col justify-end p-6 sm:min-h-[520px] sm:p-12">
        <span className="mb-4 w-fit rounded-full bg-red-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-400 ring-1 ring-red-500/40">
          #1 Trending This Week
        </span>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {movie.title}
        </h1>

        <div className="mt-3 flex items-center gap-3 text-sm text-neutral-300">
          <span className="font-semibold text-yellow-400">
            ★ {movie.vote_average.toFixed(1)}
          </span>
          {year && <span>{year}</span>}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-300 sm:text-base">
          {movie.overview}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {trailerKey && (
            <TrailerButton
              videoKey={trailerKey}
              title={movie.title}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
            />
          )}
          <Link
            href={`/movies/${movie.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20"
          >
            ⓘ More Details
          </Link>
        </div>
      </div>
    </section>
  );
}