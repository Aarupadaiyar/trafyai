import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runFullScrape } from "@/lib/scraper";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const summaries = await runFullScrape();
  return NextResponse.json({ summaries });
}
