import Image from "next/image";
import { CastMember, getImageUrl } from "@/lib/tmdb";

export default function CastList({ cast }: { cast: CastMember[] }) {
  const topCast = cast.slice(0, 15);
  if (topCast.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-bold text-white sm:text-2xl">
        Top <span className="text-red-500">Cast</span>
      </h2>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {topCast.map((person) => (
          <div key={person.id} className="w-28 shrink-0 text-center sm:w-32">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-neutral-800 ring-2 ring-white/10 sm:h-32 sm:w-32">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path, "w185")}
                  alt={person.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <span className="grid h-full place-items-center text-3xl font-bold text-neutral-500">
                  {person.name.charAt(0)}
                </span>
              )}
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-white">
              {person.name}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {person.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}