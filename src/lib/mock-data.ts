// Dev-only fixture data so pages render before `db:seed` has run against a
// real Postgres instance. Swap every usage of this file for real Prisma
// queries (see src/app/(public)/intelligence/page.tsx for the intended query shape).
import type { ArticleCardData, TrendingCompany, UpcomingEvent } from "@/types";

export const MOCK_ARTICLES: ArticleCardData[] = [
  {
    id: "1",
    slug: "anthropic-ships-claude-opus-4-8",
    title: "Anthropic ships Claude Opus 4.8 with a 2M-token context window",
    summary: "The update focuses on long-document reasoning and tool-use reliability across extended agent sessions.",
    thumbnailUrl: null,
    category: { slug: "llms", name: "LLMs" },
    source: { slug: "anthropic", name: "Anthropic News" },
    author: { slug: "anthropic-team", name: "Anthropic Team" },
    publishedAt: new Date().toISOString(),
    readingTimeMins: 4,
    popularityScore: 98,
  },
  {
    id: "2",
    slug: "openai-agent-framework-launch",
    title: "OpenAI launches a native agent framework for multi-step workflows",
    summary: "Developers can now compose long-running agents with built-in memory, retries, and human-in-the-loop checkpoints.",
    thumbnailUrl: null,
    category: { slug: "agents", name: "Agents" },
    source: { slug: "openai", name: "OpenAI Blog" },
    author: null,
    publishedAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    readingTimeMins: 5,
    popularityScore: 91,
  },
  {
    id: "3",
    slug: "mistral-raises-series-c",
    title: "Mistral raises $1.1B Series C led by a European sovereign fund",
    summary: "The round values the open-weight model company at $14B as it doubles down on enterprise deployments.",
    thumbnailUrl: null,
    category: { slug: "funding", name: "Funding" },
    source: { slug: "techcrunch-ai", name: "TechCrunch AI" },
    author: { slug: "j-doe", name: "Jane Doe" },
    publishedAt: new Date(Date.now() - 6 * 3600_000).toISOString(),
    readingTimeMins: 3,
    popularityScore: 84,
  },
  {
    id: "4",
    slug: "huggingface-open-weights-benchmark",
    title: "Hugging Face's new open leaderboard puts small models under the microscope",
    summary: "Sub-10B models are closing the gap on reasoning benchmarks — here's what changed.",
    thumbnailUrl: null,
    category: { slug: "open-source", name: "Open Source" },
    source: { slug: "huggingface", name: "Hugging Face Blog" },
    author: null,
    publishedAt: new Date(Date.now() - 9 * 3600_000).toISOString(),
    readingTimeMins: 6,
    popularityScore: 77,
  },
  {
    id: "5",
    slug: "arxiv-mixture-of-depths",
    title: "New arXiv paper proposes 'mixture of depths' for 40% faster inference",
    summary: "A dynamic compute allocation method that skips layers for easy tokens without hurting output quality.",
    thumbnailUrl: null,
    category: { slug: "research", name: "Research" },
    source: { slug: "arxiv-ai", name: "arXiv (cs.AI)" },
    author: { slug: "research-team", name: "MIT CSAIL" },
    publishedAt: new Date(Date.now() - 12 * 3600_000).toISOString(),
    readingTimeMins: 8,
    popularityScore: 65,
  },
  {
    id: "6",
    slug: "nvidia-inference-chip",
    title: "NVIDIA previews a dedicated inference chip aimed at agent workloads",
    summary: "Early benchmarks show 3x throughput on tool-calling-heavy tasks versus the current generation.",
    thumbnailUrl: null,
    category: { slug: "infrastructure", name: "Infrastructure" },
    source: { slug: "nvidia", name: "NVIDIA AI Blog" },
    author: null,
    publishedAt: new Date(Date.now() - 18 * 3600_000).toISOString(),
    readingTimeMins: 4,
    popularityScore: 58,
  },
];

export const MOCK_TRENDING_COMPANIES: TrendingCompany[] = [
  { name: "Anthropic", slug: "anthropic", mentionCount: 14 },
  { name: "OpenAI", slug: "openai", mentionCount: 12 },
  { name: "Mistral", slug: "mistral", mentionCount: 7 },
  { name: "xAI", slug: "xai", mentionCount: 5 },
];

export const MOCK_EVENTS: UpcomingEvent[] = [
  { name: "NeurIPS 2026", date: "Dec 2026", location: "San Diego, CA", url: "#" },
  { name: "AI Engineer Summit", date: "Sep 2026", location: "San Francisco, CA", url: "#" },
];

export const MOCK_TAGS = ["gpt-6", "reasoning", "open-weights", "fine-tuning", "rag", "multi-agent"];
