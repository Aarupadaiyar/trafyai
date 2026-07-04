import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await db.article.findFirst({
    where: { OR: [{ id }, { slug: id }], status: "PUBLISHED" },
    include: { category: true, source: true, author: true, tags: { include: { tag: true } } },
  });

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fire-and-forget view log; don't block the response on it.
  db.articleView.create({ data: { articleId: article.id } }).catch(() => {});

  return NextResponse.json(article);
}
