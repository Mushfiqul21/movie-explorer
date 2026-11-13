"use client";

import { useEffect, useState } from "react";

export default function TrailerButton({
  videoKey,
  title,
  className = "mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500",
}: {
  videoKey: string;
  title: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close with Escape key + lock page scroll while the modal is open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
                className={className}
      >
        ▶ Watch Trailer
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} trailer`}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close trailer"
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl text-white transition hover:bg-red-600"
            >
              ✕
            </button>

            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl shadow-red-600/20 ring-1 ring-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
                title={`${title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}