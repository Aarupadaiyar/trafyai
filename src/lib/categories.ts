/**
 * Single source of truth for category slugs and display names.
 * Kept in a plain (non-"use client") module so it can be imported by:
 *   - CategoryFilter.tsx (client component)
 *   - category/[category]/page.tsx  (server component, generateStaticParams)
 * without triggering Next.js's "cannot import a client module on the server" error.
 */
export const CATEGORIES = [
  { slug: "llms",               name: "LLMs" },
  { slug: "agents",             name: "Agents" },
  { slug: "open-source",        name: "Open Source" },
  { slug: "research",           name: "Research" },
  { slug: "startups",           name: "Startups" },
  { slug: "funding",            name: "Funding" },
  { slug: "prompt-engineering", name: "Prompt Engineering" },
  { slug: "infrastructure",     name: "Infrastructure" },
  { slug: "robotics",           name: "Robotics" },
  { slug: "computer-vision",    name: "Computer Vision" },
  { slug: "mlops",              name: "MLOps" },
  { slug: "data-science",       name: "Data Science" },
  { slug: "opinion",            name: "Opinion" },
  { slug: "tutorials",          name: "Tutorials" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
