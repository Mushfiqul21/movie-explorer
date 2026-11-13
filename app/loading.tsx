export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-12 h-[420px] rounded-3xl bg-neutral-800 sm:h-[520px]" />

      <div className="mb-6 h-8 w-56 rounded-lg bg-neutral-800" />
      <div className="mb-8 h-11 w-96 max-w-full rounded-full bg-neutral-800" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-neutral-800" />
        ))}
      </div>
    </div>
  );
}