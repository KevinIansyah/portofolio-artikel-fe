import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-portofolio.keviniansyah.site",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
