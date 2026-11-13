import {
  CATEGORIES,
  getGenres,
  getMovies,
  getTrailerKey,
  isCategoryKey,
} from "@/lib/tmdb";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import GenreFilter from "@/components/GenreFilter";
import LoadMoreGrid from "@/components/LoadMoreGrid";

type Props = { searchParams: Promise<{ type?: string; genre?: string }> };

export default async function Home({ searchParams }: Props) {
  const { type, genre: genreParam } = await searchParams;
  const active = isCategoryKey(type) ? type : "trending";
  const category = CATEGORIES.find((c) => c.key === active)!;

  const [trending, genres] = await Promise.all([
    getMovies("trending"),
    getGenres(),
  ]);

  // Only accept a genre id that really exists (ignores ?genre=abc)
  const selectedGenre = genres.find((g) => String(g.id) === genreParam);
  const genre = selectedGenre ? String(selectedGenre.id) : undefined;

  const movies = await getMovies(active, 1, genre);

  const heroMovie =
    trending.results.find((m) => m.backdrop_path && m.overview) ??
    trending.results[0];
  const trailerKey = await getTrailerKey(heroMovie.id);

  return (
    <>
      <Hero movie={heroMovie} trailerKey={trailerKey} />

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {category.label}{" "}
            <span className="text-red-500">
              {selectedGenre ? `${selectedGenre.name} Movies` : "Movies"}
            </span>
          </h2>
        </div>

        <CategoryTabs active={active} genre={genre} />
        <GenreFilter genres={genres} active={genre} type={active} />

        <LoadMoreGrid
          key={`${active}-${genre ?? "all"}`}
          initialMovies={movies.results}
          type={active}
          genre={genre}
          totalPages={movies.total_pages}
        />
      </section>
    </>
  );
}