import { db } from "@/lib/db";
import { SOURCES, type SourceConfig } from "./sources";
import { fetchRssSource } from "./fetchers/rss";
import { fetchScrapeSource } from "./fetchers/scrape";
import { fetchArxivSource } from "./fetchers/arxiv";
import { fetchRedditSource } from "./fetchers/reddit";
import { isExactDuplicate, findClusterMatch } from "./dedupe";
import { computeImportanceScore } from "./scoring";
import { scrapedArticleSchema, type ScrapedArticle } from "@/lib/validations/article";
import readingTime from "reading-time";

export interface ScrapeRunSummary {
  sourceSlug: string;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  itemsFound: number;
  itemsNew: number;
  itemsDuped: number;
  durationMs: number;
  errorMessage?: string;
}

const FETCHERS: Record<string, (s: SourceConfig) => Promise<Partial<ScrapedArticle>[]>> = {
  RSS: fetchRssSource,
  SCRAPE: fetchScrapeSource,
  ARXIV: fetchArxivSource,
  REDDIT: fetchRedditSource,
  API: fetchRssSource,   // placeholder — swap per-source once API creds exist (e.g. PapersWithCode, ProductHunt)
  GITHUB: fetchScrapeSource,
};

/**
 * Entry point called by both the 7 AM cron route and the admin "run scraper
 * manually" button. Iterates every active source, fetches, dedupes, scores,
 * and persists new articles as PENDING for admin triage. Never throws — a
 * single source failing is logged and skipped so the rest of the run
 * completes.
 */
export async function runFullScrape(): Promise<ScrapeRunSummary[]> {
  const activeSources = SOURCES; // in production, filter by Source.isActive from DB
  const summaries: ScrapeRunSummary[] = [];

  for (const sourceConfig of activeSources) {
    const start = Date.now();
    let itemsFound = 0;
    let itemsNew = 0;
    let itemsDuped = 0;

    try {
      const source = await db.source.upsert({
        where: { slug: sourceConfig.slug },
        create: {
          slug: sourceConfig.slug,
          name: sourceConfig.name,
          type: sourceConfig.type,
          feedUrl: sourceConfig.feedUrl,
          homepageUrl: sourceConfig.homepageUrl,
        },
        update: {},
      });

      const fetcher = FETCHERS[sourceConfig.type];
      const rawItems = await fetcher(sourceConfig);
      itemsFound = rawItems.length;

      for (const raw of rawItems) {
        const parsed = scrapedArticleSchema.safeParse({
          ...raw,
          importanceScore: raw.importanceScore ?? 0,
          tags: [],
        });
        if (!parsed.success) continue;

        const article = parsed.data;

        if (await isExactDuplicate(article.sourceUrl)) {
          itemsDuped++;
          continue;
        }

        const clusterId = await findClusterMatch(article);
        const category = await db.category.upsert({
          where: { slug: article.categorySlug },
          create: { slug: article.categorySlug, name: titleCase(article.categorySlug) },
          update: {},
        });

        const author = article.authorName
          ? await db.author.upsert({
              where: { slug: slugify(article.authorName) },
              create: { slug: slugify(article.authorName), name: article.authorName },
              update: {},
            })
          : null;

        await db.article.create({
          data: {
            slug: `${slugify(article.title)}-${Date.now().toString(36)}`,
            title: article.title,
            summary: article.summary,
            content: article.content,
            thumbnailUrl: article.thumbnailUrl,
            sourceUrl: article.sourceUrl,
            sourceId: source.id,
            categoryId: category.id,
            authorId: author?.id,
            status: "PENDING",
            importanceScore: computeImportanceScore(article),
            readingTimeMins: Math.max(1, Math.ceil(readingTime(article.content).minutes)),
            publishedAt: article.publishedAt,
            clusterId,
          },
        });
        itemsNew++;
      }

      await logRun(source.id, "SUCCESS", itemsFound, itemsNew, itemsDuped, Date.now() - start);
      summaries.push({ sourceSlug: sourceConfig.slug, status: "SUCCESS", itemsFound, itemsNew, itemsDuped, durationMs: Date.now() - start });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const source = await db.source.findUnique({ where: { slug: sourceConfig.slug } });
      if (source) await logRun(source.id, "FAILED", itemsFound, itemsNew, itemsDuped, Date.now() - start, message);
      summaries.push({ sourceSlug: sourceConfig.slug, status: "FAILED", itemsFound, itemsNew, itemsDuped, durationMs: Date.now() - start, errorMessage: message });
    }
  }

  return summaries;
}

async function logRun(sourceId: string, status: "SUCCESS" | "FAILED", itemsFound: number, itemsNew: number, itemsDuped: number, durationMs: number, errorMessage?: string) {
  await db.scrapeLog.create({
    data: { sourceId, status, itemsFound, itemsNew, itemsDuped, durationMs, errorMessage },
  });
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function titleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
