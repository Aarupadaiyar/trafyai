"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
  { slug: "llms", name: "LLMs" },
  { slug: "agents", name: "Agents" },
  { slug: "open-source", name: "Open Source" },
  { slug: "research", name: "Research" },
  { slug: "startups", name: "Startups" },
  { slug: "funding", name: "Funding" },
  { slug: "prompt-engineering", name: "Prompt Engineering" },
  { slug: "infrastructure", name: "Infrastructure" },
  { slug: "robotics", name: "Robotics" },
  { slug: "computer-vision", name: "Computer Vision" },
  { slug: "mlops", name: "MLOps" },
  { slug: "data-science", name: "Data Science" },
  { slug: "opinion", name: "Opinion" },
  { slug: "tutorials", name: "Tutorials" },
];

export function CategoryFilter({ activeSlug }: { activeSlug?: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href="/intelligence"
        className={cn("shrink-0 rounded-pill border px-4 py-2 text-sm font-medium", !activeSlug ? "border-ink bg-ink text-white" : "border-border bg-white text-gray-body hover:text-ink")}
      >
        All
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/intelligence/category/${cat.slug}`}
          className={cn(
            "shrink-0 rounded-pill border px-4 py-2 text-sm font-medium",
            activeSlug === cat.slug ? "border-ink bg-ink text-white" : "border-border bg-white text-gray-body hover:text-ink"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
