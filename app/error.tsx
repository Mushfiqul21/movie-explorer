"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-6xl">🎞️</p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          The projector broke
        </h1>
        <p className="mt-2 max-w-md text-neutral-400">
          Something went wrong while loading this page. Please try again.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}