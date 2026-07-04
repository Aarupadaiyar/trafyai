import { db } from "@/lib/db";

export const revalidate = 600;

function escapeXml(str: string) {
  return str.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trafy.ai";

  const articles = await db.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 50,
    include: { category: true },
  });

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${base}/intelligence/news/${a.slug}</link>
      <guid>${base}/intelligence/news/${a.slug}</guid>
      <pubDate>${(a.publishedAt ?? a.createdAt).toUTCString()}</pubDate>
      <category>${escapeXml(a.category.name)}</category>
      <description>${escapeXml(a.summary)}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Trafy Intelligence</title>
    <link>${base}/intelligence</link>
    <description>AI news and insights, curated daily by Trafy.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}
