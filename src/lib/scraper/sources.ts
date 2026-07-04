export type SourceType = "RSS" | "API" | "SCRAPE" | "REDDIT" | "GITHUB" | "ARXIV";

export interface SourceConfig {
  slug: string;
  name: string;
  type: SourceType;
  feedUrl: string;
  homepageUrl: string;
  defaultCategorySlug: string;
}

// One entry per source called out in the product brief. `feedUrl` is either
// a real RSS/Atom feed, an API endpoint, or a page URL for the SCRAPE type
// (handled by fetchers/scrape.ts with source-specific selectors).
export const SOURCES: SourceConfig[] = [
  { slug: "openai", name: "OpenAI Blog", type: "RSS", feedUrl: "https://openai.com/news/rss.xml", homepageUrl: "https://openai.com/news", defaultCategorySlug: "llms" },
  { slug: "anthropic", name: "Anthropic News", type: "SCRAPE", feedUrl: "https://www.anthropic.com/news", homepageUrl: "https://www.anthropic.com/news", defaultCategorySlug: "llms" },
  { slug: "deepmind", name: "Google DeepMind", type: "RSS", feedUrl: "https://deepmind.google/blog/rss.xml", homepageUrl: "https://deepmind.google/blog", defaultCategorySlug: "research" },
  { slug: "meta-ai", name: "Meta AI", type: "SCRAPE", feedUrl: "https://ai.meta.com/blog/", homepageUrl: "https://ai.meta.com/blog/", defaultCategorySlug: "research" },
  { slug: "microsoft-ai", name: "Microsoft AI", type: "RSS", feedUrl: "https://blogs.microsoft.com/ai/feed/", homepageUrl: "https://blogs.microsoft.com/ai/", defaultCategorySlug: "infrastructure" },
  { slug: "nvidia", name: "NVIDIA AI Blog", type: "RSS", feedUrl: "https://blogs.nvidia.com/blog/category/deep-learning/feed/", homepageUrl: "https://blogs.nvidia.com", defaultCategorySlug: "infrastructure" },
  { slug: "mistral", name: "Mistral AI", type: "SCRAPE", feedUrl: "https://mistral.ai/news", homepageUrl: "https://mistral.ai/news", defaultCategorySlug: "llms" },
  { slug: "xai", name: "xAI", type: "SCRAPE", feedUrl: "https://x.ai/blog", homepageUrl: "https://x.ai/blog", defaultCategorySlug: "llms" },
  { slug: "huggingface", name: "Hugging Face Blog", type: "RSS", feedUrl: "https://huggingface.co/blog/feed.xml", homepageUrl: "https://huggingface.co/blog", defaultCategorySlug: "open-source" },
  { slug: "perplexity", name: "Perplexity Blog", type: "SCRAPE", feedUrl: "https://www.perplexity.ai/hub/blog", homepageUrl: "https://www.perplexity.ai/hub/blog", defaultCategorySlug: "startups" },
  { slug: "langchain", name: "LangChain Blog", type: "RSS", feedUrl: "https://blog.langchain.dev/rss/", homepageUrl: "https://blog.langchain.dev", defaultCategorySlug: "agents" },
  { slug: "github-trending-ai", name: "GitHub Trending (AI)", type: "GITHUB", feedUrl: "https://github.com/trending/python?since=daily", homepageUrl: "https://github.com/trending", defaultCategorySlug: "open-source" },
  { slug: "paperswithcode", name: "Papers with Code", type: "API", feedUrl: "https://paperswithcode.com/api/v1/papers/", homepageUrl: "https://paperswithcode.com", defaultCategorySlug: "research" },
  { slug: "arxiv-ai", name: "arXiv (cs.AI)", type: "ARXIV", feedUrl: "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending", homepageUrl: "https://arxiv.org/list/cs.AI/recent", defaultCategorySlug: "research" },
  { slug: "techcrunch-ai", name: "TechCrunch AI", type: "RSS", feedUrl: "https://techcrunch.com/category/artificial-intelligence/feed/", homepageUrl: "https://techcrunch.com/category/artificial-intelligence/", defaultCategorySlug: "startups" },
  { slug: "theverge-ai", name: "The Verge AI", type: "RSS", feedUrl: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", homepageUrl: "https://www.theverge.com/ai-artificial-intelligence", defaultCategorySlug: "startups" },
  { slug: "venturebeat-ai", name: "VentureBeat AI", type: "RSS", feedUrl: "https://venturebeat.com/category/ai/feed/", homepageUrl: "https://venturebeat.com/category/ai/", defaultCategorySlug: "funding" },
  { slug: "analytics-india", name: "Analytics India Magazine", type: "RSS", feedUrl: "https://analyticsindiamag.com/feed/", homepageUrl: "https://analyticsindiamag.com", defaultCategorySlug: "data-science" },
  { slug: "ycombinator", name: "Y Combinator Blog", type: "RSS", feedUrl: "https://www.ycombinator.com/blog/rss", homepageUrl: "https://www.ycombinator.com/blog", defaultCategorySlug: "startups" },
  { slug: "producthunt-ai", name: "Product Hunt (AI)", type: "API", feedUrl: "https://api.producthunt.com/v2/api/graphql", homepageUrl: "https://www.producthunt.com/topics/artificial-intelligence", defaultCategorySlug: "startups" },
  { slug: "reddit-machinelearning", name: "r/MachineLearning", type: "REDDIT", feedUrl: "https://www.reddit.com/r/MachineLearning/top/.json?t=day", homepageUrl: "https://www.reddit.com/r/MachineLearning", defaultCategorySlug: "research" },
  { slug: "reddit-localllama", name: "r/LocalLLaMA", type: "REDDIT", feedUrl: "https://www.reddit.com/r/LocalLLaMA/top/.json?t=day", homepageUrl: "https://www.reddit.com/r/LocalLLaMA", defaultCategorySlug: "open-source" },
  { slug: "reddit-openai", name: "r/OpenAI", type: "REDDIT", feedUrl: "https://www.reddit.com/r/OpenAI/top/.json?t=day", homepageUrl: "https://www.reddit.com/r/OpenAI", defaultCategorySlug: "llms" },
];

export function getActiveSourceBySlug(slug: string) {
  return SOURCES.find((s) => s.slug === slug);
}
