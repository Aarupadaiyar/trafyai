import { NextRequest, NextResponse } from "next/server";
import { runFullScrape } from "@/lib/scraper";
import { sendDailyDigest } from "@/app/api/cron/digest/route";

// Configured in vercel.json as a backup daily job:
//   { "crons": [{ "path": "/api/cron/scrape?digest=true", "schedule": "0 7 * * *" }] }
//
// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically.
// Scraping 15 sources sequentially plus sending the digest can take a while;
// bump the default timeout. Vercel's Hobby plan allows up to 60s per
// function — if real-world runs exceed that, split runFullScrape() into
// batches across multiple cron-triggered requests instead of raising this
// further (Hobby won't go higher).
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summaries = await runFullScrape();
  const failed = summaries.filter((s) => s.status === "FAILED");
  
  // Only send the daily digest if specifically requested via ?digest=true
  let digest = null;
  if (req.nextUrl.searchParams.get("digest") === "true") {
    digest = await sendDailyDigest();
  }

  return NextResponse.json({
    ranAt: new Date().toISOString(),
    sourcesRun: summaries.length,
    totalNew: summaries.reduce((sum, s) => sum + s.itemsNew, 0),
    totalUpdated: summaries.reduce((sum, s) => sum + s.itemsUpdated, 0),
    failed: failed.map((f) => f.sourceSlug),
    digest,
    summaries,
  });
}
