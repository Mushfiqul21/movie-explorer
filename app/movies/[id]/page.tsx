import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieDetails, getImageUrl, formatRuntime } from "@/lib/tmdb";
import CastList from "@/components/CastList";
import MovieRow from "@/components/MovieRow";
import TrailerButton from "@/components/TrailerButton";
import FavoriteButton from "@/components/FavoriteButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) return { title: "Movie not found" };

  const description =
    movie.overview?.slice(0, 160) || "Movie details on Movie Explorer.";

  return {
    title: movie.title,
    description,
    openGraph: {
      title: movie.title,
      description,
      images: movie.backdrop_path
        ? [getImageUrl(movie.backdrop_path, "w1280")]
        : [],
    },
  };
}

export default async function MovieDetailsPage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) notFound();

  const year = movie.release_date?.slice(0, 4);
  const runtime = formatRuntime(movie.runtime);
  const trailer =
    movie.videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ??
    movie.videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

  return (
    <article>
      {/* Backdrop */}
      <div className="fixed inset-x-0 top-0 -z-10 h-[75vh]">
        {movie.backdrop_path && (
          <Image
            src={getImageUrl(movie.backdrop_path, "w1280")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-[#0a0a0f]/30" />
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        {/* Poster */}
        <div className="relative mx-auto aspect-[2/3] w-64 shrink-0 overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl shadow-black/60 ring-1 ring-white/10 md:mx-0 md:w-80">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, "w780")}
              alt={movie.title}
              fill
              priority
              sizes="(max-width: 768px) 256px, 320px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-neutral-500">
              No poster
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {movie.title}{" "}
            {year && (
              <span className="font-light text-neutral-400">({year})</span>
            )}
          </h1>

          {movie.tagline && (
            <p className="mt-2 italic text-neutral-400">“{movie.tagline}”</p>
          )}

          {/* Meta chips */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-yellow-400/10 px-3 py-1 font-semibold text-yellow-400 ring-1 ring-yellow-400/30">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            {runtime && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-neutral-300 ring-1 ring-white/10">
                {runtime}
              </span>
            )}
            {movie.release_date && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-neutral-300 ring-1 ring-white/10">
                {new Date(movie.release_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span className="rounded-full bg-white/5 px-3 py-1 text-neutral-300 ring-1 ring-white/10">
              {movie.status}
            </span>
          </div>

          {/* Genres */}
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 ring-1 ring-red-500/30"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <h2 className="mt-8 text-lg font-semibold text-white">Overview</h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-neutral-300">
            {movie.overview || "No overview available."}
          </p>

          {/* Temporary trailer link (replaced by a modal in a later step) */}
<div className="mt-8 flex flex-wrap items-center gap-3">
  {trailer && (
    <TrailerButton
      videoKey={trailer.key}
      title={movie.title}
      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
    />
  )}
  <FavoriteButton
    variant="full"
    movie={{
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }}
  />
</div>
        </div>
      </div>

      <CastList cast={movie.credits.cast} />
      <MovieRow title="You May Also Like" movies={movie.similar.results.slice(0, 12)} />
    </article>
  );
}