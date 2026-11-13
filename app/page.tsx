import {
  CATEGORIES,
  getMovies,
  getTrailerKey,
  isCategoryKey,
} from "@/lib/tmdb";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import LoadMoreGrid from "@/components/LoadMoreGrid";

type Props = { searchParams: Promise<{ type?: string }> };

export default async function Home({ searchParams }: Props) {
  const { type } = await searchParams;
  const active = isCategoryKey(type) ? type : "trending";
  const category = CATEGORIES.find((c) => c.key === active)!;

  // Fetch the hero source (trending) and the selected tab in parallel
  const [trending, movies] = await Promise.all([
    getMovies("trending"),
    getMovies(active),
  ]);

  const heroMovie =
    trending.results.find((m) => m.backdrop_path && m.overview) ??
    trending.results[0];
  const trailerKey = await getTrailerKey(heroMovie.id);

  return (
    <>
      <Hero movie={heroMovie} trailerKey={trailerKey} />

      <section>
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {category.label} <span className="text-red-500">Movies</span>
          </h2>
        </div>

        <CategoryTabs active={active} />
<LoadMoreGrid
  key={active}
  initialMovies={movies.results}
  type={active}
  totalPages={movies.total_pages}
/>
      </section>
    </>
  );
}