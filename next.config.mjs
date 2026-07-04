/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Scraped thumbnails come from arbitrary source domains (news sites,
    // blogs, CDNs like Facebook's) that we don't control. Many of these
    // block or throttle Next.js's server-side image optimizer, causing
    // timeouts that crash the page. Since we can't guarantee any of them
    // are optimizer-friendly, skip optimization and render them directly.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;