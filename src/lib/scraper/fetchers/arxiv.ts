import * as cheerio from "cheerio";
import type { SourceConfig } from "../sources";
import type { ScrapedArticle } from "@/lib/validations/article";

// arXiv's API returns Atom XML — reuse cheerio's XML mode rather than
// pulling in a second parser dependency.
export async function fetchArxivSource(source: SourceConfig): Promise<Partial<ScrapedArticle>[]> {
  const res = await fetch(`${source.feedUrl}&max_results=25`);
  if (!res.ok) throw new Error(`arXiv fetch failed: ${res.status}`);

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const results: Partial<ScrapedArticle>[] = [];
  $("entry").each((_, el) => {
    const node = $(el);
    const title = node.find("title").first().text().trim().replace(/\s+/g, " ");
    const summary = node.find("summary").first().text().trim().replace(/\s+/g, " ").slice(0, 500);
    const link = node.find("id").first().text().trim();
    const published = node.find("published").first().text().trim();
    const author = node.find("author > name").first().text().trim();

    if (!title || !link) return;

    results.push({
      title,
      summary,
      content: summary,
      sourceUrl: link,
      sourceSlug: source.slug,
      authorName: author,
      categorySlug: "research",
      publishedAt: published ? new Date(published) : new Date(),
    });
  });

  return results;
}
