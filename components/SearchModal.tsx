"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/tmdb";

type SearchResult = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

type Status = "idle" | "loading" | "done" | "error";

/* ---------- The popup itself ---------- */
function SearchPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [active, setActive] = useState(0);

  // Debounced fetch: waits 300ms after the last keystroke,
  // and cancels the previous request if you keep typing
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setResults(data.results);
        setStatus("done");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setResults([]);
        setStatus("error");
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Esc to close + lock page scroll while open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Keep the highlighted result visible while using arrow keys
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function handleChange(value: string) {
    setQuery(value);
    setActive(0);
    if (value.trim().length < 2) {
      setResults([]);
      setStatus("idle");
    }
  }

  function go(id: number) {
    onClose();
    router.push(`/movies/${id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].id);
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search movies"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-[#14141b] shadow-2xl shadow-black ring-1 ring-white/10"
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search movies..."
            className="h-14 w-full bg-transparent text-white placeholder-neutral-500 outline-none"
          />
          {status === "loading" && (
            <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
          )}
          <kbd className="hidden rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-neutral-400 sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {status === "idle" && (
            <p className="px-4 py-10 text-center text-sm text-neutral-500">
              Type at least 2 letters to search.
            </p>
          )}

          {status === "error" && (
            <p className="px-4 py-10 text-center text-sm text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          {status === "done" && results.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-neutral-500">
              No movies found for “{query.trim()}”.
            </p>
          )}

          {results.length > 0 && (
            <ul ref={listRef} className="p-2">
              {results.map((movie, index) => (
                <li key={movie.id}>
                  <button
                    onClick={() => go(movie.id)}
                    onMouseEnter={() => setActive(index)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                      index === active ? "bg-white/10" : ""
                    }`}
                  >
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                      {movie.poster_path && (
                        <Image
                          src={getImageUrl(movie.poster_path, "w92")}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {movie.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {movie.release_date?.slice(0, 4) || "N/A"}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-yellow-400">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hints */}
        <div className="hidden items-center gap-4 border-t border-white/10 px-4 py-2.5 text-[11px] text-neutral-500 sm:flex">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- Navbar button + Ctrl+K shortcut ---------- */
export default function SearchModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search movies"
        className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-neutral-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white sm:pr-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>

      {open && <SearchPalette onClose={() => setOpen(false)} />}
    </>
  );
}