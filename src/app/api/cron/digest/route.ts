import { NextResponse } from "next/server";
import { sendDailyDigest } from "@/lib/email/send-digest";

// Standalone route for manually resending a digest without re-scraping.
// Same CRON_SECRET gate as the scrape route.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await sendDailyDigest();
  return NextResponse.json(result);
}