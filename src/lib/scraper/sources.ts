export type SourceType = "RSS" | "API" | "SCRAPE" | "REDDIT" | "GITHUB" | "ARXIV";

export interface SourceConfig {
  slug: string;
  name: string;
  type: SourceType;
  feedUrl: string;
  homepageUrl: string;
  defaultCategorySlug: string;
}

// ─── Working sources confirmed live ────────────────────────────────────────
// Sources marked [BROKEN] below are blocked (403), gone (410/404), or require
// JS rendering and cannot be scraped server-side. They are commented out so
// the pipeline never silently returns 0 items for them.
export const SOURCES: SourceConfig[] = [
  // ── Tier-1 AI labs (RSS) ─────────────────────────────────────────────────
  { slug: "openai",       name: "OpenAI Blog",          type: "RSS",    feedUrl: "https://openai.com/news/rss.xml",                                                                     homepageUrl: "https://openai.com/news",                                    defaultCategorySlug: "llms" },
  { slug: "deepmind",     name: "Google DeepMind",      type: "RSS",    feedUrl: "https://deepmind.google/blog/rss.xml",                                                                homepageUrl: "https://deepmind.google/blog",                               defaultCategorySlug: "research" },
  { slug: "microsoft-ai", name: "Microsoft AI",         type: "RSS",    feedUrl: "https://blogs.microsoft.com/feed/",                                                                   homepageUrl: "https://blogs.microsoft.com/",                               defaultCategorySlug: "infrastructure" },
  { slug: "nvidia",       name: "NVIDIA AI Blog",       type: "RSS",    feedUrl: "https://blogs.nvidia.com/blog/category/deep-learning/feed/",                                          homepageUrl: "https://blogs.nvidia.com",                                   defaultCategorySlug: "infrastructure" },
  { slug: "huggingface",  name: "Hugging Face Blog",    type: "RSS",    feedUrl: "https://huggingface.co/blog/feed.xml",                                                                homepageUrl: "https://huggingface.co/blog",                                defaultCategorySlug: "open-source" },

  // ── Tier-1 AI labs (scraped) ─────────────────────────────────────────────
  { slug: "anthropic",    name: "Anthropic News",       type: "SCRAPE", feedUrl: "https://www.anthropic.com/news",                                                                      homepageUrl: "https://www.anthropic.com",                                  defaultCategorySlug: "llms" },
  { slug: "meta-ai",      name: "Meta AI Blog",         type: "SCRAPE", feedUrl: "https://ai.meta.com/blog/",                                                                           homepageUrl: "https://ai.meta.com",                                        defaultCategorySlug: "research" },
  { slug: "mistral",      name: "Mistral AI",           type: "SCRAPE", feedUrl: "https://mistral.ai/news/",                                                                            homepageUrl: "https://mistral.ai",                                         defaultCategorySlug: "llms" },
  // [BLOCKED] xai: 403 on x.ai/blog
  // [BLOCKED] perplexity: 403 on perplexity.ai/hub/blog

  // ── Research ──────────────────────────────────────────────────────────────
  { slug: "arxiv-ai",     name: "arXiv (cs.AI)",        type: "ARXIV",  feedUrl: "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending",  homepageUrl: "https://arxiv.org/list/cs.AI/recent",                        defaultCategorySlug: "research" },
  { slug: "arxiv-lg",     name: "arXiv (cs.LG)",        type: "ARXIV",  feedUrl: "http://export.arxiv.org/api/query?search_query=cat:cs.LG&sortBy=submittedDate&sortOrder=descending",  homepageUrl: "https://arxiv.org/list/cs.LG/recent",                        defaultCategorySlug: "research" },
  { slug: "paperswithcode", name: "Papers with Code",   type: "RSS",    feedUrl: "https://papers.takara.ai/api/feed",                                                                   homepageUrl: "https://paperswithcode.com",                                 defaultCategorySlug: "research" },

  // ── Tech news (RSS) ───────────────────────────────────────────────────────
  { slug: "techcrunch-ai",  name: "TechCrunch AI",      type: "RSS",    feedUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",                                       homepageUrl: "https://techcrunch.com/category/artificial-intelligence/",   defaultCategorySlug: "startups" },
  { slug: "theverge-ai",    name: "The Verge AI",        type: "RSS",    feedUrl: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",                                  homepageUrl: "https://www.theverge.com/ai-artificial-intelligence",        defaultCategorySlug: "startups" },
  { slug: "venturebeat-ai", name: "VentureBeat AI",     type: "RSS",    feedUrl: "https://venturebeat.com/category/ai/feed/",                                                           homepageUrl: "https://venturebeat.com/category/ai/",                       defaultCategorySlug: "funding" },
  { slug: "ycombinator",    name: "Y Combinator Blog",  type: "RSS",    feedUrl: "https://www.ycombinator.com/blog/rss",                                                                homepageUrl: "https://www.ycombinator.com/blog",                           defaultCategorySlug: "startups" },
  // [BROKEN] langchain: malformed XML (unescaped & in feed)
  // [BROKEN] analytics-india: malformed XML (attribute without value)
  // [BLOCKED] reddit-*: 403 (requires OAuth, not open .json)
  // [GONE]    microsoft-ai /ai/feed/ → 410
  // [BROKEN]  producthunt-ai: GraphQL endpoint needs API key → 404
];

export function getActiveSourceBySlug(slug: string) {
  return SOURCES.find((s) => s.slug === slug);
}
