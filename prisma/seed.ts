import { PrismaClient } from "@prisma/client";
import { SOURCES } from "../src/lib/scraper/sources";

const db = new PrismaClient();

const CATEGORIES = [
  "llms", "agents", "open-source", "research", "startups", "funding",
  "prompt-engineering", "infrastructure", "robotics", "computer-vision",
  "mlops", "data-science", "opinion", "tutorials",
];

async function main() {
  console.log("Seeding categories…");
  for (const slug of CATEGORIES) {
    await db.category.upsert({
      where: { slug },
      create: { slug, name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
      update: {},
    });
  }

  console.log("Seeding sources…");
  for (const s of SOURCES) {
    await db.source.upsert({
      where: { slug: s.slug },
      create: { slug: s.slug, name: s.name, type: s.type, feedUrl: s.feedUrl, homepageUrl: s.homepageUrl },
      update: {},
    });
  }

  const ownerEmail = process.env.SEED_OWNER_EMAIL;
  if (ownerEmail) {
    console.log(`Seeding owner admin: ${ownerEmail}`);
    await db.admin.upsert({
      where: { email: ownerEmail },
      create: { email: ownerEmail, role: "OWNER" },
      update: {},
    });
  } else {
    console.log("Skipping owner admin — set SEED_OWNER_EMAIL to create one.");
  }

  console.log("Done. Run `npm run scrape:manual` to pull real articles.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
