import { db } from "@/lib/db";
import type { ScrapedArticle } from "@/lib/validations/article";

/**
 * Two-stage dedupe:
 *  1. Exact match on sourceUrl (a re-scrape of the same article) — cheap DB check.
 *  2. Fuzzy match on title similarity against articles scraped in the last 72h —
 *     catches the same story covered by multiple outlets (e.g. a model launch
 *     picked up by both TechCrunch and VentureBeat) and assigns them a shared
 *     clusterId so the frontend can show "12 sources covering this" instead
 *     of 12 duplicate cards.
 */
export async function isExactDuplicate(sourceUrl: string): Promise<boolean> {
  const existing = await db.article.findUnique({ where: { sourceUrl } });
  return existing !== null;
}

export async function findClusterMatch(article: ScrapedArticle): Promise<string | null> {
  const recentWindow = new Date(Date.now() - 72 * 60 * 60 * 1000);
  const candidates = await db.article.findMany({
    where: { scrapedAt: { gte: recentWindow } },
    select: { id: true, title: true, clusterId: true },
    take: 500,
  });

  for (const candidate of candidates) {
    if (titleSimilarity(article.title, candidate.title) > 0.82) {
      return candidate.clusterId ?? candidate.id;
    }
  }
  return null;
}

// Jaccard similarity over lowercased word sets — fast, dependency-free, and
// good enough for headline-level near-duplicate detection. Swap for an
// embedding-based cosine similarity if false negatives become an issue.
function titleSimilarity(a: string, b: string): number {
  const setA = new Set(normalize(a));
  const setB = new Set(normalize(b));
  const intersection = new Set([...setA].filter((w) => setB.has(w)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function normalize(text: string): string[] {
  const stopwords = new Set(["the", "a", "an", "of", "to", "for", "in", "on", "and", "with", "is", "its"]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}
