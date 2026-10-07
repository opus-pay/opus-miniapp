import type { NextConfig } from "next";

// The kit ships as TypeScript source, so Next compiles it together with the page.
const nextConfig: NextConfig = {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
    transpilePackages: ["@opus/miniapp"],
};

export default nextConfig;
