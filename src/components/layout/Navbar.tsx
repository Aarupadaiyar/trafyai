import Link from "next/link";
import { SearchBar } from "@/components/blog/SearchBar";

const MAIN_SITE = process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://trafy.ai";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Main Homepage redirecting to original landing page */}
        <a href={MAIN_SITE} className="rounded-pill bg-lime px-4 py-1.5 font-bold text-ink">
          Trafy
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {/* Article Section */}
          <Link href="/intelligence" className="font-semibold text-ink">
            Articles
          </Link>
          {/* Contact Section redirecting to main contact page */}
          <a href={`${MAIN_SITE}/#contact`} className="text-gray-body hover:text-ink">
            Contact
          </a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-56">
            <SearchBar compact />
          </div>
        </div>
      </div>
    </header>
  );
}