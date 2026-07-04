import { NextRequest, NextResponse } from "next/server";
import { runFullScrape } from "@/lib/scraper";
import { sendDailyDigest } from "@/app/api/cron/digest/route";

// Configured in vercel.json as a single daily job:
//   { "crons": [{ "path": "/api/cron/scrape", "schedule": "0 7 * * *" }] }
//
// The digest is sent from *inside* this same request, right after the scrape
// finishes, rather than as its own separately-scheduled cron. Vercel's free
// Hobby plan only guarantees cron jobs run once a day — it does NOT guarantee
// they fire at a precise minute (a 7:00 AM job can trigger anywhere in that
// hour). Two independently-scheduled crons could easily run out of order,
// so the digest would summarize stale data. Chaining them in-process
// guarantees the digest always reflects the scrape that just ran.
//
// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically.
// Scraping 23 sources sequentially plus sending the digest can take a while;
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
  const digest = await sendDailyDigest();

  return NextResponse.json({
    ranAt: new Date().toISOString(),
    sourcesRun: summaries.length,
    totalNew: summaries.reduce((sum, s) => sum + s.itemsNew, 0),
    failed: failed.map((f) => f.sourceSlug),
    digest,
    summaries,
  });
}
