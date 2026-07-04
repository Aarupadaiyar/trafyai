import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminNewsletterPage() {
  const [count, recent] = await Promise.all([
    db.newsletterSubscriber.count({ where: { isActive: true } }),
    db.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div>
      <h1 className="text-display-sm text-ink">Newsletter</h1>
      <p className="mt-1 text-gray-body">{count} active subscribers.</p>

      <Card className="mt-6 divide-y divide-border p-0">
        {recent.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="text-ink">{sub.email}</span>
            <span className="text-xs text-gray-body">{sub.source ?? "unknown"} · {new Date(sub.subscribedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
