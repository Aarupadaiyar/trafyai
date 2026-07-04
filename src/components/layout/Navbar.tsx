import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/blog/SearchBar";

const NAV_LINKS = [
  { href: "/for-talent", label: "For Talent" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/for-companies", label: "For Companies" },
  { href: "/intelligence", label: "News", highlight: true },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="rounded-pill bg-lime px-4 py-1.5 font-bold text-ink">
          Trafy
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.highlight ? "font-semibold text-ink" : "text-gray-body hover:text-ink"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-56">
            <SearchBar compact />
          </div>
          <Button variant="outline" size="sm">For Companies</Button>
          <Button variant="primary" size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
