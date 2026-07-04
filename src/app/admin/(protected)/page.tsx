import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [pending, published, sourcesActive, lastRun] = await Promise.all([
    db.article.count({ where: { status: "PENDING" } }),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.source.count({ where: { isActive: true } }),
    db.scrapeLog.findFirst({ orderBy: { runAt: "desc" }, include: { source: true } }),
  ]);

  const stats = [
    { label: "Pending review", value: pending },
    { label: "Published articles", value: published },
    { label: "Active sources", value: sourcesActive },
  ];

  return (
    <div>
      <h1 className="text-display-sm text-ink">Dashboard</h1>
      <p className="mt-1 text-gray-body">Overview of today&apos;s scrape and article pipeline.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-body">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-body">Last scrape run</p>
        {lastRun ? (
          <p className="mt-2 text-sm text-ink">
            {lastRun.source.name} · {lastRun.status} · {lastRun.itemsNew} new · {new Date(lastRun.runAt).toLocaleString()}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-body">No scrape runs yet. Trigger one from the Sources page.</p>
        )}
      </Card>
    </div>
  );
}
