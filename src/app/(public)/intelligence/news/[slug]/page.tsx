import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { TableOfContents, type TocHeading } from "@/components/blog/TableOfContents";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { formatDate } from "@/lib/utils";
import { MOCK_ARTICLES } from "@/lib/mock-data";

// Real implementation:
//   const article = await db.article.findUnique({ where: { slug }, include: { category: true, source: true, author: true, tags: { include: { tag: true } } } });
//   const related = await db.article.findMany({ where: { categoryId: article.categoryId, id: { not: article.id } }, take: 3 });
//   await db.articleView.create({ data: { articleId: article.id, referrer } }); // fire on client, not here, to avoid double-counting on prefetch

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} — Trafy Intelligence`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.thumbnailUrl ? [article.thumbnailUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${article.slug}`,
    },
  };
}

function extractHeadings(mdx: string): TocHeading[] {
  const matches = [...mdx.matchAll(/^(##{1,2})\s+(.+)$/gm)];
  return matches.map((m) => ({
    depth: m[1].length,
    text: m[2],
    id: m[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));
}

const SAMPLE_BODY = `
Anthropic's latest release focuses on three areas: longer context, more reliable
tool use, and lower latency for interactive agent loops.

## What changed

The context window extends to 2 million tokens, roughly 8x the prior generation,
enabling full-codebase or full-contract analysis in a single call.

## Benchmarks

Early evals show meaningful gains on long-document QA, with the largest
improvements on tasks requiring information synthesis across widely separated
sections of the input.

## What it means for developers

Teams building long-running agents get more headroom before needing to manage
context manually — summarization and retrieval layers become optional rather
than mandatory for many workloads.
`;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const headings = extractHeadings(SAMPLE_BODY);
  const related = MOCK_ARTICLES.filter((a) => a.category.slug === article.category.slug && a.id !== article.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    author: article.author ? { "@type": "Person", name: article.author.name } : undefined,
    publisher: { "@type": "Organization", name: "Trafy Intelligence" },
  };

  return (
    <main>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-border bg-dot-grid px-6 py-14 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <Badge variant="lime">{article.category.name}</Badge>
          <h1 className="mt-5 text-display-md text-ink">{article.title}</h1>
          <p className="mt-4 text-lg text-gray-body">{article.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-body">
            <span className="font-medium text-ink">{article.author?.name ?? article.source.name}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readingTimeMins} min read</span>
            <span>·</span>
            <a href={article.source.slug} className="hover:text-ink">Original source ↗</a>
          </div>
        </div>
      </header>

      {article.thumbnailUrl && (
        <div className="relative mx-auto -mt-8 aspect-[21/9] max-w-5xl overflow-hidden rounded-card border border-border">
          <Image src={article.thumbnailUrl} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-14 lg:grid-cols-[1fr_220px] lg:px-10">
        <article className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-ink prose-a:underline">
          <MDXRemote source={SAMPLE_BODY} />
        </article>
        <TableOfContents headings={headings} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-cream-dim px-6 py-14 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-display-sm text-ink">Related</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.id} article={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10 text-sm lg:px-10">
        <Link href="/intelligence" className="text-gray-body hover:text-ink">← Back to all news</Link>
      </nav>
    </main>
  );
}
