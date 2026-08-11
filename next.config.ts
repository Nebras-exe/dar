import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Real Catalog Preview (local/demo only): representative furniture photography
    // is served from the Unsplash CDN — hotlink-permitted, license-clean, no API
    // key, no paid credits. This only whitelists the host for next/image
    // optimisation; product data and business logic are unchanged. Toggle the
    // overlay with NEXT_PUBLIC_REAL_CATALOG_PREVIEW.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
