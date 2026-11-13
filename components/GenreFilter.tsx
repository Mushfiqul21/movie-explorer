import Link from "next/link";
import { CategoryKey, Genre, buildHomeUrl } from "@/lib/tmdb";

export default function GenreFilter({
  genres,
  active,
  type,
}: {
  genres: Genre[];
  active?: string;
  type: CategoryKey;
}) {
  const base =
    "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition";
  const on = "bg-red-600 text-white ring-red-500 shadow-lg shadow-red-600/30";
  const off =
    "bg-white/5 text-neutral-300 ring-white/10 hover:bg-white/10 hover:text-white";

  return (
    <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="flex gap-2">
        <Link
          href={buildHomeUrl(type)}
          scroll={false}
          className={`${base} ${!active ? on : off}`}
        >
          All
        </Link>

        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={buildHomeUrl(type, String(genre.id))}
            scroll={false}
            className={`${base} ${String(genre.id) === active ? on : off}`}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}