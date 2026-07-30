import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosting friendly: `next build` emits a standalone server bundle.
  output: "standalone",

  images: {
    // Every photo is local, so only the sizes this 440px-wide layout can use.
    imageSizes: [64, 96, 128, 220, 256, 384],
    deviceSizes: [440, 640, 880],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/gallery/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
