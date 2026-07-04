import { Hero } from "@/components/blog/Hero";
import { HotNewsTicker } from "@/components/blog/HotNewsTicker";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Top10Sidebar } from "@/components/blog/Top10Sidebar";
import { TrendingCompanies, UpcomingEvents, PopularTags } from "@/components/blog/SidebarWidgets";
import { Newsletter } from "@/components/blog/Newsletter";
import {
  MOCK_ARTICLES,
  MOCK_TRENDING_COMPANIES,
  MOCK_EVENTS,
  MOCK_TAGS,
} from "@/lib/mock-data";

// import { db } from "@/lib/db";
//
// Real implementation once the DB is seeded:
//   const [featured, latest, top10] = await Promise.all([
//     db.article.findFirst({ where: { status: "PUBLISHED", isFeatured: true }, orderBy: { publishedAt: "desc" }, include: { category: true, source: true, author: true } }),
//     db.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 12, include: { category: true, source: true, author: true } }),
//     db.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { popularityScore: "desc" }, take: 10, include: { category: true, source: true, author: true } }),
//   ]);

export const revalidate = 300; // ISR — re-render at most every 5 minutes

export default async function NewsHomePage() {
  const [featured, ...latest] = MOCK_ARTICLES;
  const top10 = [...MOCK_ARTICLES].sort((a, b) => b.popularityScore - a.popularityScore);

  return (
    <main>
      <Hero article={featured} />
      <HotNewsTicker items={MOCK_ARTICLES.slice(0, 5)} />

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="mb-8">
          <CategoryFilter />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="mb-6 text-display-sm text-ink">Latest News</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Top10Sidebar articles={top10} />
            <TrendingCompanies companies={MOCK_TRENDING_COMPANIES} />
            <UpcomingEvents events={MOCK_EVENTS} />
            <PopularTags tags={MOCK_TAGS} />
            <Newsletter source="sidebar" />
          </aside>
        </div>
      </section>
    </main>
  );
}
