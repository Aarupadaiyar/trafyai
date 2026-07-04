import Link from "next/link";
import { Newsletter } from "@/components/blog/Newsletter";

const COLUMNS = [
  { heading: "Intelligence", links: [["Latest News", "/intelligence"], ["Categories", "/intelligence/category/llms"], ["Trending", "/intelligence?sort=trending"], ["RSS Feed", "/intelligence/rss.xml"]] },
  { heading: "For Talent", links: [["Get Started", "/for-talent"], ["AI Assessment", "/assessment"], ["Free Portfolio", "/portfolio"]] },
  { heading: "For Companies", links: [["Hire Talent", "/for-companies"], ["Private Workspace", "/workspace"], ["Enterprise", "/enterprise"]] },
] as const;

export function Footer() {
  return (
    <footer>
      <div className="bg-lime px-6 py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-display-sm text-ink">Stay ahead of the AI curve.</h2>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          One email a week: the model releases, funding rounds, and research that actually matter.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <Newsletter variant="on-lime" source="footer" />
        </div>
      </div>

      <div className="bg-ink px-6 py-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <span className="inline-block rounded-pill bg-lime px-4 py-1.5 font-bold text-ink">Trafy</span>
            <p className="mt-4 max-w-xs text-sm text-gray-bodyDark">
              Work Tech connecting global AI talent with the world&apos;s top AI companies.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-bodyDark">{col.heading}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-white/80 hover:text-lime">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
