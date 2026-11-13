import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Movie Explorer",
    template: "%s | Movie Explorer",
  },
  description:
    "Discover trending, popular and top rated movies. Built with Next.js and TMDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-500">
          Built with Next.js · Data from{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-300 hover:text-white"
          >
            TMDB
          </a>
        </footer>
      </body>
    </html>
  );
}