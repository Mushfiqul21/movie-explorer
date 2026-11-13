export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <div className="mx-auto aspect-[2/3] w-64 shrink-0 rounded-2xl bg-neutral-800 md:mx-0 md:w-80" />

        <div className="flex-1 space-y-4">
          <div className="h-10 w-3/4 rounded-lg bg-neutral-800" />
          <div className="h-4 w-1/2 rounded bg-neutral-800" />
          <div className="flex gap-3">
            <div className="h-7 w-16 rounded-full bg-neutral-800" />
            <div className="h-7 w-16 rounded-full bg-neutral-800" />
            <div className="h-7 w-28 rounded-full bg-neutral-800" />
          </div>
          <div className="space-y-2 pt-6">
            <div className="h-4 w-full rounded bg-neutral-800" />
            <div className="h-4 w-full rounded bg-neutral-800" />
            <div className="h-4 w-2/3 rounded bg-neutral-800" />
          </div>
        </div>
      </div>

      <div className="mt-14 flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-32 w-32 shrink-0 rounded-full bg-neutral-800"
          />
        ))}
      </div>
    </div>
  );
}