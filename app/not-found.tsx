import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-7xl font-extrabold text-red-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">
          This scene was cut from the movie
        </h1>
        <p className="mt-2 text-neutral-400">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}