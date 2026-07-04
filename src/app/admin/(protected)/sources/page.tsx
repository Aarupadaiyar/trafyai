"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOURCES } from "@/lib/scraper/sources";

export default function AdminSourcesPage() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function runScraper() {
    setRunning(true);
    setResult(null);
    const res = await fetch("/api/admin/scrape", { method: "POST" });
    const data = await res.json();
    setResult(`Scrape complete — ${data.summaries?.reduce((n: number, s: { itemsNew: number }) => n + s.itemsNew, 0) ?? 0} new articles.`);
    setRunning(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm text-ink">Sources</h1>
          <p className="mt-1 text-gray-body">{SOURCES.length} configured sources across news, research, and community.</p>
        </div>
        <Button variant="primary" onClick={runScraper} disabled={running}>
          {running ? "Running…" : "Run scraper manually"}
        </Button>
      </div>

      {result && <p className="mt-4 text-sm text-ink">{result}</p>}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SOURCES.map((s) => (
          <div key={s.slug} className="rounded-card border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink">{s.name}</p>
              <Badge variant="outline">{s.type}</Badge>
            </div>
            <p className="mt-1 truncate text-xs text-gray-body">{s.homepageUrl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
