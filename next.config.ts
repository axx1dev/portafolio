import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["framer-motion"],
  },
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  // Empty turbopack config silences the webpack/turbopack mismatch warning
  // triggered by @tailwindcss/postcss injecting a webpack config internally.
  turbopack: {},
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
