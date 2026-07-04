import { notFound } from "next/navigation";
import { CategoryFilter, CATEGORIES } from "@/components/blog/CategoryFilter";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { MOCK_ARTICLES } from "@/lib/mock-data";

// Real implementation:
//   const articles = await db.article.findMany({
//     where: { status: "PUBLISHED", category: { slug: params.category } },
//     orderBy: { publishedAt: "desc" },
//     include: { category: true, source: true, author: true },
//   });

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const meta = CATEGORIES.find((c) => c.slug === category);
  if (!meta) notFound();

  const articles = MOCK_ARTICLES.filter((a) => a.category.slug === category);

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <h1 className="text-display-sm text-ink">{meta.name}</h1>
      <p className="mt-2 text-gray-body">Everything Trafy Intelligence has tracked in {meta.name}.</p>

      <div className="my-8">
        <CategoryFilter activeSlug={category} />
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-body">No articles in this category yet — check back after the next scrape run.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
