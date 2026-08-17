import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wmprherzmtndsggxrbze.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // These are the heaviest deps in the bundle (WebGL hero, scroll animation).
  // optimizePackageImports rewrites their imports so Next only ships the
  // specific modules actually used per route instead of the whole package.
  experimental: {
    optimizePackageImports: ["three", "@react-three/fiber", "gsap", "framer-motion"],
  },
};

export default nextConfig;
