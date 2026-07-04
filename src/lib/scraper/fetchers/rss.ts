import Parser from "rss-parser";
import type { SourceConfig } from "../sources";
import type { ScrapedArticle } from "@/lib/validations/article";

const parser = new Parser({
  timeout: 15_000,
  headers: { "User-Agent": "TrafyIntelligenceBot/1.0 (+https://trafy.ai/intelligence)" },
});

export async function fetchRssSource(source: SourceConfig): Promise<Partial<ScrapedArticle>[]> {
  const feed = await parser.parseURL(source.feedUrl);

  return (feed.items ?? []).slice(0, 25).map((item) => ({
    title: item.title ?? "Untitled",
    summary: stripHtml(item.contentSnippet ?? item.summary ?? "").slice(0, 500),
    content: item["content:encoded"] ?? item.content ?? item.summary ?? "",
    sourceUrl: item.link ?? "",
    sourceSlug: source.slug,
    thumbnailUrl: extractThumbnail(item),
    authorName: item.creator ?? item.author,
    categorySlug: source.defaultCategorySlug,
    publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
  }));
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function extractThumbnail(item: Parser.Item & Record<string, unknown>): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const mediaContent = item["media:content"] as { $: { url?: string } } | undefined;
  if (mediaContent?.$.url) return mediaContent.$.url;

  const match = (item.content as string | undefined)?.match(/<img[^>]+src="([^">]+)"/);
  return match?.[1];
}
