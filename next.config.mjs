/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Scraped thumbnails come from arbitrary source domains, so this is
    // intentionally permissive; tighten to an explicit allowlist once the
    // active source list stabilizes.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;
