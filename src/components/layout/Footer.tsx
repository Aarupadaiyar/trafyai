import Link from "next/link";
import { Newsletter } from "@/components/blog/Newsletter";
import { Github, Linkedin } from "lucide-react";

const COLUMNS = [
  { 
    heading: "Intelligence", 
    links: [
      ["Latest News", "/intelligence"], 
      ["Categories", "/intelligence/category/llms"], 
      ["Trending", "/intelligence?sort=trending"], 
      ["RSS Feed", "/intelligence/rss.xml"]
    ] 
  },
  { 
    heading: "For Talent", 
    links: [
      ["Get Started", "https://www.trafy.ai/#talent"], 
      ["AI Assessment", "https://academy.trafy.ai/"], 
      ["Free Portfolio", "https://app.trafy.ai/"]
    ] 
  },
  { 
    heading: "For Companies", 
    links: [
      ["Hire Talent", "https://www.trafy.ai/#companies"], 
      ["Private Workspace", "https://build.trafy.ai/"], 
      ["Enterprise", "https://www.trafy.ai/#how"]
    ] 
  },
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
            <div className="mt-6 flex space-x-4">
              <a
                href="https://www.linkedin.com/company/trafy-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-lime transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/trafy-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-lime transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-bodyDark">{col.heading}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map(([label, href]) => {
                  const isExternal = href.startsWith("http");
                  return (
                    <li key={href}>
                      <Link 
                        href={href} 
                        className="text-white/80 hover:text-lime"
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
