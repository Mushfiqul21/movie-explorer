import type { Metadata } from "next";
import FavoritesView from "@/components/FavoritesView";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "Your saved movies on Movie Explorer.",
};

export default function FavoritesPage() {
  return (
    <section>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        My <span className="text-red-500">Favorites</span>
      </h1>
      <FavoritesView />
    </section>
  );
}