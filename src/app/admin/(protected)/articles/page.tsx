"use client";

import { useState } from "react";
import { ArticleTable } from "@/components/admin/ArticleTable";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";

const STATUSES = ["PENDING", "APPROVED", "DRAFT", "PUBLISHED", "REJECTED"];

export default function AdminArticlesPage() {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  const filters: Record<string, string> = {};
  if (status) filters.status = status;
  if (category) filters.category = category;
  if (q) filters.q = q;

  return (
    <div>
      <h1 className="text-display-sm text-ink">Articles</h1>
      <p className="mt-1 text-gray-body">Approve, edit, feature, and publish scraped stories.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="w-64">
          <Input placeholder="Search titles…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-pill border border-border bg-white px-4 py-3 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-pill border border-border bg-white px-4 py-3 text-sm">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="mt-6">
        <ArticleTable filters={filters} />
      </div>
    </div>
  );
}
