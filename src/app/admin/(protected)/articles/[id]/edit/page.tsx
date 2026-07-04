"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditableArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  status: string;
}

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<EditableArticle | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => r.json())
      .then(setArticle);
  }, [id]);

  async function save() {
    if (!article) return;
    setSaving(true);
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: article.title, summary: article.summary, content: article.content }),
    });
    setSaving(false);
    router.push("/admin/articles");
  }

  if (!article) return <p className="text-sm text-gray-body">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-display-sm text-ink">Edit article</h1>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-body">Headline</label>
          <Input className="mt-2" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-body">Summary</label>
          <textarea
            className="mt-2 w-full rounded-card border border-border bg-white p-4 text-sm outline-none focus:border-ink"
            rows={3}
            value={article.summary}
            onChange={(e) => setArticle({ ...article, summary: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-body">Content (MDX)</label>
          <textarea
            className="mt-2 w-full rounded-card border border-border bg-white p-4 font-mono text-sm outline-none focus:border-ink"
            rows={16}
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
          />
        </div>
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
