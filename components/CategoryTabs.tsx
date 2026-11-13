import Link from "next/link";
import { CATEGORIES, CategoryKey, buildHomeUrl } from "@/lib/tmdb";

export default function CategoryTabs({
  active,
  genre,
}: {
  active: CategoryKey;
  genre?: string;
}) {
  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="inline-flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
        {CATEGORIES.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={buildHomeUrl(tab.key, genre)}
              scroll={false}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}