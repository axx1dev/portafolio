import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Inline CSS in <head> instead of render-blocking <link> tags.
    // Optimal for Tailwind (atomic CSS stays small) — eliminates the
    // CSS network request that Lighthouse flags as render-blocking.
    inlineCss: true,
    // Tree-shake heavy packages to reduce bundle size
    optimizePackageImports: ["framer-motion"],
  },
  compiler: {
    // Remove console.* in production
    removeConsole: {
      exclude: ["error"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "media.vandal.net" },
      { protocol: "https", hostname: "fotografias-neox.atresmedia.com" },
      { protocol: "https", hostname: "www.televisa.com" },
      { protocol: "https", hostname: "www.motorcyclenews.com" },
      { protocol: "https", hostname: "soymotero.net" },
      { protocol: "https", hostname: "motoriwata.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
};

export default nextConfig;
