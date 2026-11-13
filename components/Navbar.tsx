import Link from "next/link";
import FavoritesLink from "./FavoritesLink";
import SearchModal from "./SearchModal";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-lg shadow-lg shadow-red-600/30">
            🎬
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Movie<span className="text-red-500">Explorer</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <SearchModal />
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <FavoritesLink />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}