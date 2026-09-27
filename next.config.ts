import type { NextConfig } from "next";

// Static export for GitHub Pages. Set NEXT_PUBLIC_BASE_PATH to "/<repo-name>"
// when deploying as a project site (e.g. https://user.github.io/repo-name).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // No image optimization server is available on static hosting.
    unoptimized: true,
  },
  // Lets `next dev` accept HMR/websocket requests tunneled through ngrok
  // (its subdomain changes on every restart on the free plan).
  allowedDevOrigins: ["*.ngrok-free.app"],
};

export default nextConfig;
