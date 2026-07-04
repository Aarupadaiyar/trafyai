import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trafy.ai";
  return {
    rules: [
      { userAgent: "*", allow: "/intelligence", disallow: "/admin" },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
