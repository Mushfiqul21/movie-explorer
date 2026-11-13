import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";

export default function MovieRow({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  if (movies.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-bold text-white sm:text-2xl">
        {title}
      </h2>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {movies.map((movie) => (
          <div key={movie.id} className="w-40 shrink-0 sm:w-44">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}