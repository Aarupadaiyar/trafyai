import * as cheerio from "cheerio";
import type { SourceConfig } from "../sources";
import type { ScrapedArticle } from "@/lib/validations/article";

/**
 * Per-source CSS selectors. Sites without RSS need hand-tuned selectors —
 * this is the piece of the pipeline most likely to need maintenance when a
 * source redesigns its site. Keep selectors isolated here, one block per
 * source slug, so a broken source doesn't block the rest of the run.
 */
const SELECTORS: Record<string, { item: string; title: string; link: string; summary?: string; image?: string }> = {
  anthropic: {
    item: "a[href^='/news/']",
    title: "h3, h2",
    link: "self",
    summary: "p",
  },
  "meta-ai": {
    item: "article",
    title: "h3, h2",
    link: "a",
    summary: "p",
    image: "img",
  },
  mistral: {
    item: "a[href^='/news/']",
    title: "h3, h2",
    link: "self",
    summary: "p",
  },
  xai: {
    item: "a[href^='/blog/']",
    title: "h3, h2",
    link: "self",
    summary: "p",
  },
  perplexity: {
    item: "a[href^='/hub/blog/']",
    title: "h3, h2",
    link: "self",
    summary: "p",
  },
};

export async function fetchScrapeSource(source: SourceConfig): Promise<Partial<ScrapedArticle>[]> {
  const config = SELECTORS[source.slug];
  if (!config) {
    throw new Error(`No selector config for scrape source "${source.slug}" — add one to SELECTORS.`);
  }

  const res = await fetch(source.feedUrl, {
    headers: { "User-Agent": "TrafyIntelligenceBot/1.0 (+https://trafy.ai/intelligence)" },
    // Scraped pages change often; never let a stale cache serve old news.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fetch failed for ${source.slug}: ${res.status}`);

  const $ = cheerio.load(await res.text());
  const results: Partial<ScrapedArticle>[] = [];

  $(config.item)
    .slice(0, 20)
    .each((_, el) => {
      const node = $(el);
      const title = node.find(config.title).first().text().trim() || node.text().trim();
      const href = config.link === "self" ? node.attr("href") : node.find(config.link).attr("href");
      if (!title || !href) return;

      results.push({
        title,
        summary: config.summary ? node.find(config.summary).first().text().trim() : "",
        content: "",
        sourceUrl: new URL(href, source.homepageUrl).toString(),
        sourceSlug: source.slug,
        thumbnailUrl: config.image ? node.find(config.image).attr("src") : undefined,
        categorySlug: source.defaultCategorySlug,
        publishedAt: new Date(),
      });
    });

  return results;
}
