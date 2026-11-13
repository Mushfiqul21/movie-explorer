import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, Movie } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2 || q.length > 100) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await tmdbFetch<{ results: Movie[] }>("/search/movie", {
      query: q,
      include_adult: "false",
    });

    // Send only what the search list needs
    const results = data.results
      .slice(0, 8)
      .map(({ id, title, poster_path, release_date, vote_average }) => ({
        id,
        title,
        poster_path,
        release_date,
        vote_average,
      }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 502 }
    );
  }
}