import type { ScrapedArticle } from "@/lib/validations/article";

const HIGH_SIGNAL_SOURCES = new Set(["openai", "anthropic", "deepmind", "meta-ai", "xai"]);
const HIGH_SIGNAL_KEYWORDS = [
  "launch", "release", "funding", "raises", "acquire", "acquisition",
  "state-of-the-art", "sota", "benchmark", "open-source", "open source",
  "gpt", "claude", "gemini", "llama",
];

/**
 * Importance score (0-100) — a heuristic, computed at scrape time, meant to
 * approximate "how big is this story" independent of how popular it becomes
 * later. Cheap keyword/source weighting now; swap the keyword pass for an
 * LLM classification call if/when quality needs to improve.
 */
export function computeImportanceScore(article: ScrapedArticle): number {
  let score = 30; // baseline

  if (HIGH_SIGNAL_SOURCES.has(article.sourceSlug)) score += 25;

  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  const keywordHits = HIGH_SIGNAL_KEYWORDS.filter((kw) => haystack.includes(kw)).length;
  score += Math.min(30, keywordHits * 8);

  if (article.title.length < 90) score += 5; // punchy headlines tend to be announcements

  return Math.max(0, Math.min(100, score));
}

/**
 * Popularity score — recalculated periodically (see cron/digest route) from
 * actual engagement: views, read time, bookmarks, shares. Decays over time
 * so old articles fall out of "Top 10 Today" naturally.
 */
export function computePopularityScore(input: {
  views24h: number;
  avgReadTimeSecs: number;
  bookmarks: number;
  shares: number;
  ageHours: number;
}): number {
  const engagementRaw =
    input.views24h * 1 +
    input.bookmarks * 8 +
    input.shares * 6 +
    Math.min(input.avgReadTimeSecs / 10, 20);

  const recencyDecay = Math.exp(-input.ageHours / 36); // half-life ~25h
  return Math.round(engagementRaw * recencyDecay * 100) / 100;
}
