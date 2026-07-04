import { runFullScrape } from "./index";

runFullScrape()
  .then((summaries) => {
    console.table(summaries);
    const failed = summaries.filter((s) => s.status === "FAILED");
    if (failed.length) {
      console.error(`${failed.length} source(s) failed:`, failed.map((f) => f.sourceSlug).join(", "));
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Scrape run crashed:", err);
    process.exit(1);
  });
