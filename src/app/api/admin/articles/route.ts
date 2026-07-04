import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const articles = await db.article.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(source ? { source: { slug: source } } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(from || to
        ? { publishedAt: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } }
        : {}),
    },
    include: { category: true, source: true, author: true },
    orderBy: { scrapedAt: "desc" },
    take: 100,
  });

  return NextResponse.json(articles);
}
