import { NextRequest, NextResponse } from "next/server";
import { getMovies, isCategoryKey } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? "trending";
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const genre = request.nextUrl.searchParams.get("genre") ?? undefined;

  // TMDB only allows pages 1 to 500, and genre must be a number
  if (
    !isCategoryKey(type) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 500 ||
    (genre !== undefined && !/^\d+$/.test(genre))
  ) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const data = await getMovies(type, page, genre);
    return NextResponse.json({
      results: data.results,
      page: data.page,
      total_pages: data.total_pages,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 502 });
  }
}