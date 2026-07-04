# Trafy Intelligence

AI News & Insights platform, mounted as a subpage of the Trafy website at `/intelligence`.

Two modules:
- **Admin-only scraper & digest** — pulls from 23 AI news/research/community sources daily at 7 AM, dedupes, scores, and emails admins a digest. Nothing here is public until an admin approves and publishes it.
- **Public blog** — the reading experience: homepage, category pages, article pages, search, newsletter.

## Status of this scaffold

This is a **production-shaped codebase, not a running app**. It was generated as a scaffold to drop into (or merge with) the existing Trafy Next.js project. Before it runs:

1. `npm install`
2. Copy `.env.example` → `.env` and fill in real values (Postgres URL, Resend key, admin emails, cron secret).
3. `npm run db:push` (or `db:migrate` once you're past prototyping) to create the schema in Postgres.
4. `npm run db:seed` — seeds categories + all 23 sources; set `SEED_OWNER_EMAIL` first to also create yourself as an OWNER admin.
5. `npm run scrape:manual` to pull real articles, or wait for the 7 AM Vercel Cron (`vercel.json`) once deployed.
6. `npm run dev` and visit `/intelligence` (public) and `/admin` (login via magic link, restricted to `ADMIN_EMAILS`).

Until step 3–5 are done, the public pages render from `src/lib/mock-data.ts` so the design is inspectable immediately — every page that uses it has a comment showing the real Prisma query it replaces.

## Design system

`tailwind.config.ts` and `src/app/globals.css` encode the existing Trafy visual language 1:1 — cream background, near-black ink text/sections, neon lime accent, 20–24px card radius, pill buttons, hairline borders, no gradients, no glassmorphism. Every component pulls from these tokens; don't hardcode colors or radii outside them. `src/styles/design-tokens.ts` mirrors the same values as plain hex for the one place Tailwind can't reach: the HTML email digest.

## Architecture

```
src/
  app/
    (public)/intelligence/     → public blog (homepage, /news/[slug], /category/[slug], rss.xml)
    admin/
      login/                   → unguarded, sibling to the protected group
      (protected)/             → dashboard, articles, sources, logs, newsletter — all behind auth.ts
    api/
      articles, search, newsletter, auth   → public-facing
      admin/articles, admin/scrape         → auth-gated
      cron/scrape, cron/digest             → CRON_SECRET-gated, called by Vercel Cron
  components/
    ui/        → Button, Card, Badge, Input — shadcn-pattern primitives on Trafy tokens
    blog/      → Hero, ArticleCard, Top10Sidebar, HotNewsTicker, CategoryFilter, SearchBar, Newsletter, TableOfContents, SidebarWidgets
    admin/     → AdminSidebar, ArticleTable
    layout/    → Navbar, Footer (visually identical to the current Trafy marketing site)
  lib/
    scraper/   → sources.ts (registry of all 23 sources) + fetchers/{rss,scrape,arxiv,reddit}.ts + dedupe.ts + scoring.ts + index.ts (orchestrator)
    email/     → resend.ts client + digest-template.ts (admin-only digest HTML)
    auth.ts, db.ts, utils.ts, validations/article.ts
prisma/
  schema.prisma  → Article, Category, Author, Tag, Source, ScrapeLog, Admin, NewsletterSubscriber, User, Bookmark, ArticleView, AnalyticsEvent
  seed.ts
```

## Scraper pipeline

`src/lib/scraper/index.ts#runFullScrape` is the single entry point, called by:
- `GET /api/cron/scrape` (Vercel Cron, 7 AM daily, `CRON_SECRET`-protected)
- `POST /api/admin/scrape` (the "Run scraper manually" button in `/admin/sources`)
- `npm run scrape:manual` (CLI, for local testing)

Per source, it fetches → validates (`scrapedArticleSchema`) → checks exact-URL duplicates → fuzzy-matches near-duplicate headlines across sources within 72h (`dedupe.ts`, Jaccard similarity on title tokens — swap for embeddings if precision needs to improve) → scores importance (`scoring.ts`) → writes as `status: PENDING`. Nothing reaches the public site without an admin approving and publishing it in `/admin/articles`.

Four fetcher strategies cover all 23 sources:
- `fetchers/rss.ts` — RSS/Atom (most blogs)
- `fetchers/scrape.ts` — cheerio + hand-tuned CSS selectors, for sites with no feed (Anthropic, Meta AI, Mistral, xAI, Perplexity)
- `fetchers/arxiv.ts` — arXiv's Atom API
- `fetchers/reddit.ts` — Reddit's public `.json` endpoints, filtered by upvote threshold

Sites without RSS are the most likely to need maintenance after a redesign — that's isolated to the `SELECTORS` map in `fetchers/scrape.ts` on purpose.

## Email digest

`sendDailyDigest()` (in `src/app/api/cron/digest/route.ts`) pulls everything scraped in the last 24h and emails a categorized summary to `ADMIN_EMAILS` only via Resend, linking each item to its admin edit page rather than a public URL — this digest is explicitly internal per the product brief.

It's called **directly inside** `GET /api/cron/scrape`, right after the scrape finishes, rather than as its own separately-scheduled cron. Vercel's free Hobby plan only guarantees cron jobs run once a day — not at a precise minute — so two independently-scheduled jobs could fire out of order and the digest would summarize stale data. Chaining them in one request avoids that. `GET /api/cron/digest` still exists as a standalone, `CRON_SECRET`-gated route for manually resending a digest without re-scraping.

## Known gaps / next steps

- `fetchers/rss.ts` is used as a placeholder for the two `API`-type sources (PapersWithCode, Product Hunt) — both need real API integrations with credentials.
- Popularity scoring (`scoring.ts#computePopularityScore`) needs a scheduled job to recompute it from `ArticleView`/`Bookmark`/`AnalyticsEvent` data — not wired to a cron in this scaffold.
- MDX rendering on the article page uses a hardcoded sample body; wire `article.content` (Markdown/MDX string) from the DB once seeded.
- Comments: schema and layout are intentionally left out per the brief ("future-ready, keep architecture modular") — add a `Comment` model + component when needed.
